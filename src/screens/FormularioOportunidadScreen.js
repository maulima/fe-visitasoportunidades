import React, {Component} from 'react'
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Slider
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import moment from 'moment'
import _ from 'lodash'
import ModalBox from 'react-native-modalbox'
import testID from '../../custom_node_modules/react-native-testid'

import {
    BACKGROUND_COLOR,
    BLACK,
    BROWN_GREY,
    BROWN_LIGHT_GREY,
    BROWN_RELIGHT_GREY,
    GREEN,
    GREY,
    RED,
    WHITE
} from '../styles/Colors'
import {FiltroOportunidad, TipoBusqueda, TipoPregunta} from '../constants/Data'
import {
    limpiarForm,
    obtenerFormOportunidad,
    obtenerPreguntasFormOportunidad,
    sobrescribirAtributosFormOportunidad
} from '../store/actions/formularioOportunidad'
import {
    actualizarDetalleOportunidad,
    actualizarOportunidad,
    clearOportunidad,
    crearOportunidad,
    obtenerOportunidad
} from '../store/actions/oportunidades'
import {
    desformatoRut,
    formatoRut,
    invalidDecimal,
    invalidInteger,
    montoDecimal,
    montoEntero,
    montoPuntosMil
} from '../utils/StringHelper'
import {idsArrayParse} from '../utils/ArrayHelper'
import GoBackButton from '../components/GoBackButton'
import SearchModal from '../components/SearchModal'
import ItemListModal from '../components/ItemListModal'
import DateTimePicker from '../components/DateTimePicker'
import Loading from '../components/Loading'
import Unauthorized from '../components/Unauthorized'
import InputGroup from '../components/InputGroup'
import BooleanRadioButton from '../components/BooleanRadioButton'
import EstadosOportunidad from '../components/EstadosOportunidad'
import ResumenOportunidadScreen from './ResumenOportunidadScreen'
import NavBar from '../components/NavBar'
import SwitchButton from '../components/SwitchButton'
import ButtonAddNota from '../components/ButtonAddNota'


require('moment/locale/es.js')
moment.locale('es')
const mapStateToProps = (state, ownProps) => {
    const {env: {API_ENV}} = process
    const oportunidadId = ownProps.navigation.getParam('oportunidadId') || null
    const fromMain = ownProps.navigation.getParam('fromMain')
    const fromVisita = ownProps.navigation.getParam('fromVisita')
    const clienteVisita = ownProps.navigation.getParam('clienteVisita')
    const addToVisita = ownProps.navigation.getParam('addToVisita')

    return {
        ...(fromMain ? {fromMain} : {}),
        ...(fromVisita ? {fromVisita} : {}),
        ...(clienteVisita ? {clienteVisita} : {}),
        ...(addToVisita ? {addToVisita} : {}),
        oportunidadId,
        oportunidad: state.oportunidades.item,
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        colaboradores: state.colaboradores.lista,
        estadosOportunidad: state.estadosOportunidad.lista,
        isFetchingObtenerPregunta: state.formularioOportunidad.isFetching,
        primeraPregunta: state.formularioOportunidad.first,
        actualPregunta: state.formularioOportunidad.current,
        primeraRespuesta: state.formularioOportunidad.respuestaId,
        preguntas: state.formularioOportunidad.preguntas,
        respuestas: state.formularioOportunidad.respuestas,
        backup: state.formularioOportunidad.backup,
        empresas: state.empresas.lista,
        //slider: state.formularioOportunidad.preguntaSlider,
        isFetching: state.oportunidades.isFetching,
        isPushing: state.oportunidades.isPushing,
        isSaved: state.oportunidades.isSaved,
        loadedInitialForm: state.formularioOportunidad.loadedInitialForm,
        error: state.formularioOportunidad.errorMessage || state.oportunidades.errorMessage,
        hasErrorGetOportunidad: state.oportunidades.hasErrorGetOportunidad,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerFormOportunidad,
            actualizarDetalleOportunidad,
            obtenerPreguntasFormOportunidad,
            sobrescribirAtributosFormOportunidad,
            limpiarForm,
            crearOportunidad,
            actualizarOportunidad,
            clearOportunidad,
            obtenerOportunidad
        }, dispatch)
    }
}

type Props = {
    oportunidadId: Number
}

class FormularioOportunidadScreen extends Component<Props> {
    requiredDefaultColumns = {
        '00': 'responsable',
        '01': 'rutCliente',
        '02': 'Negocio'
    }
    requiredColumns = {}
    missingColumns = {}
    validationColumnCount = 0
    testIDCount = null
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: `${navigation.getParam('oportunidadId') ? 'Edición de' : 'Nueva'} oportunidad`,
        headerLeft: <GoBackButton onPress={() => {
            navigation.goBack()
        }}/>
    })

    state = {
        loading: true,
        loadingButton: false,
        loadingTab: false,
        loadedInitialForm: false,
        backupLoaded: false,
        preguntasModificadas: false,
        constantsFormAttributes: {},
        backup: {},
        form: {
            responsable: null,
            usuarioNTResponsable: null,
            grupoEconomico: null,
            rutCliente: null,
            nombreCliente: null,
            Negocio: null,
            NegocioNombre: null,
            end_date: moment(),
            notas: [],
            privado: false,
        },
        resumen: {},
        validationOportunidad: false,
        responsableModalVisible: false,
        rutClienteModalVisible: false,
        grupoEconomicoModalVisible: false,
        endDateModalVisible: false,
        resumenModalVisible: false,
        alertModalVisible: false,
        bancoModalVisible: false,
        detallesCargados: 0,
        isButtonDisabled:false,
        value:0,
        sl:{},
        plataform:''
    }

    componentWillMount() {
        const {
            fromVisita,
            clienteVisita,
            oportunidadId,
            actions: {obtenerFormOportunidad, obtenerOportunidad, limpiarForm, clearOportunidad},
            currentUser: {usuario, plataforma, codOficina},
            colaboradores,
            currentUser
        } = this.props

        const {form} = this.state

        clearOportunidad()
        //no borrar nunca en la vida, o validar que se puedan visualizar las oportunidades en todos sus estados
        limpiarForm()
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        if (oportunidadId) {
            this.setState({loading: true})
            obtenerOportunidad({
                oportunidadId,
                plataforma,
                usuarioNT: usuario,
                jefeNT: jefeNTCreador.usuarioNtJefe,
                codOficina: codOficina,
            })
        } else {
            const colaborador = _.find(colaboradores, (responsable) => responsable.usuarioNt === _.trim(currentUser.usuario)) || {
                nombreColaborador: currentUser.nombreCompleto,
                usuarioNt: currentUser.usuario,
                centroCosto: currentUser.plataforma,
                usuarioNtJefe: currentUser.usuarioNtJefe,
            }
            this.setState({
                loading: false,
                form: {
                    ...form,
                    ...(fromVisita ? {
                        rutCliente: clienteVisita.rutCliente || null,
                        nombreCliente: clienteVisita.nombreCliente || null,
                        grupoEconomico: clienteVisita.grupoEconomico || null
                    } : {}),
                    estadoId: 1,
                    ...(colaborador ? {
                        responsable: colaborador.nombreColaborador,
                        usuarioNTResponsable: colaborador.usuarioNt,
                        usuarioNtJefe: colaborador.usuarioNtJefe,
                        jefeNTResponsable: colaborador.usuarioNtJefe,
                        plataformaResponsable: colaborador.centroCosto,
                    } : {}),
                    notas: [{
                        id: '',
                        usuarioCreador: usuario,
                        fechaCreacion: '',
                        contenido: ''
                    }]
                }
            })

            obtenerFormOportunidad(1)
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            actions: {obtenerPreguntasFormOportunidad},
            oportunidad,
            isFetching,
            isFetchingObtenerPregunta,
            loadedInitialForm,
            preguntas,
            backup,
            isSaved,
            isPushing,
            slider
        } = this.props
        const {loading, detallesCargados} = this.state
         
        /*if(slider !== nextProps.slider){
            this.setState({
                sl:slider
            })
        }*/

        if (isFetching && !nextProps.isFetching) {
            if (nextProps.hasErrorGetOportunidad) {
                this.setState({fatalError: true})
            } else if (nextProps.oportunidadId) {
                this.setOportunidadFormEdition(nextProps.oportunidad)
            }
        } else if (!nextProps.isFetching && (
            (isFetchingObtenerPregunta && !nextProps.isFetchingObtenerPregunta)
            ||
            (_.size(backup.preguntas) !== _.size(nextProps.backup.preguntas))
            ||
            (_.size(preguntas) !== _.size(nextProps.preguntas))
            ||
            (!loadedInitialForm && nextProps.loadedInitialForm)
        )) {
            if (nextProps.oportunidadId) {
                const {actions: {actualizarDetalleOportunidad}} = this.props
                const {initFormLoaded, form: {estadoId}, backup: {detalle}, loadingMainData, backupDataLoaded, backupLoaded} = this.state

                this.setState({
                    loading: !backupLoaded,
                    loadingTab: false
                })

                if (!initFormLoaded) {
                    if (loadingMainData) {
                        if ((_.size(backup.preguntas) !== _.size(nextProps.backup.preguntas))) {
                            const oportunidadDetalle = _.clone(oportunidad.detalle)
                            const backupDetalle = _.clone(detalle)
                            let detalleSize = _.size(detalle)
                            let backupDataLoadedCount = this.state.backupDataLoadedCount

                            if (detalleSize < _.size(nextProps.backup.preguntas)) {
                                const prgs = _.remove(oportunidadDetalle, (od) => !!nextProps.backup.preguntas[od.preguntaId])
                                _.map(prgs, (prg) => backupDetalle.push(prg))

                                this.setState({
                                    backup: {
                                        detalle: backupDetalle,
                                        preguntas: nextProps.backup.preguntas,
                                        respuestas: nextProps.backup.respuestas
                                    }
                                })
                                actualizarDetalleOportunidad({detalle: oportunidadDetalle})
                            }

                            detalleSize = _.size(backupDetalle)
                            this.setState({backupDataLoaded: detalleSize})

                            _.map(_.slice(backupDetalle, backupDataLoaded, detalleSize), (d) => {
                                const {respuestaId} = d

                                backupDataLoadedCount += 1
                                this.setState({backupDataLoadedCount})

                                return respuestaId ? obtenerPreguntasFormOportunidad({
                                    respuestaId,
                                    backupStore: true
                                }) : null
                            })
                        }

                        if (!nextProps.loadedInitialForm || (_.size(preguntas) !== _.size(nextProps.preguntas))) {
                            const {mainDataLoaded, mainDataKeyStack} = this.state
                            const preguntasKeys = _.keys(nextProps.preguntas)

                            this.setState({
                                mainDataLoaded: _.size(nextProps.preguntas),
                                mainDataKeyStack: preguntasKeys
                            })

                            _.map(preguntasKeys, (key) => {
                                if (!_.includes(mainDataKeyStack, key)) {
                                    const {respuestaId} = _.find(oportunidad.detalle, (d) => d.preguntaId == key) || {}

                                    obtenerPreguntasFormOportunidad({respuestaId})
                                }

                                return null
                            })
                        }
                    } else {
                        this.setState({initFormLoaded: true})

                        if (oportunidad.estadoId === estadoId) {
                            const d = _.first(detalle)
                            if (d) {
                                const {respuestaId} = d

                                return respuestaId ?
                                    obtenerPreguntasFormOportunidad({respuestaId})
                                    :
                                    this.setState({detallesCargados: detallesCargados + 1})
                            }
                        }
                    }
                }
            } else {
                this.setState({
                    loading: false,
                    loadingTab: false
                })
            }
        }

        if (Object.keys(preguntas || {}).length !== Object.keys(nextProps.preguntas || {}).length && nextProps.primeraRespuesta) {
            this.handleColumnsStateMap(nextProps.preguntas || {}, preguntas || {}, nextProps.primeraRespuesta)
            this.handleRequiredColumns(nextProps.preguntas)
        }

        if (isPushing !== nextProps.isPushing && nextProps.isPushing) {
            this.setState({
                loadingButton: true
            })
        }

        if (isPushing !== nextProps.isPushing && !nextProps.isPushing) {
            this.setState({
                loadingButton: false
            })
        }

        //Oportunidad guardada o actualizada
        if (isSaved !== nextProps.isSaved && nextProps.isSaved) {
            this.setState({
                alertModalVisible: true
            })
        }

        if (nextProps.loadedInitialForm && isFetchingObtenerPregunta && !nextProps.isFetchingObtenerPregunta) {
            if (loading) this.setState({detallesCargados: detallesCargados + 1})
        }

        _.map(_.values(nextProps.preguntas), (pregunta) => {
            const {name, tipo} = pregunta

            if (tipo === TipoPregunta.ESTRUCTURADO && !this.state.form[name]) {
                const {currentUser} = this.props
                const {form} = this.state

                this.setState({
                    form: {
                        ...form,
                        [name]: currentUser.usuario
                    }
                })
            }
        })
       

        if(this.props.empresas !== nextProps.empresas || _.size(this.props.empresas) == _.size(nextProps.empresas)){
            console.log('logggggg')
            this.setState({
                plataform:nextProps.empresas
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let validationCount = 0
        Object.keys(this.requiredColumns || {}).map(key => {
            Object.keys(nextState.form || {}).map(field => {
                if (this.requiredColumns[key] === field && _.isNull(nextState.form[field])) {
                    validationCount ++
                }
            })
        })

        Object.keys(this.requiredDefaultColumns || {}).map(key => {
            Object.keys(nextState.form || {}).map(field => {
                if (this.requiredDefaultColumns[key] === field && _.isNull(nextState.form[field])) {
                    validationCount ++
                }
            })
        })

        this.validationColumnCount = validationCount

        return true
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.backupLoaded) {
            const {preguntas, oportunidadId, oportunidad, oportunidad: {estadoId}} = this.props
            const {backupDataLoadedCount, initialDetalleSize, backup, backup: {detalle}, form, detallesCargados} = this.state

            const backupLoaded = estadoId === 1 ?
                detallesCargados === _.size(oportunidad.detalle)
                : (
                    !!oportunidadId &&
                    prevState.backupDataLoadedCount <= backupDataLoadedCount &&
                    (backupDataLoadedCount + _.size(preguntas) === initialDetalleSize || oportunidad.detalle < detalle)
                )
            if (backupLoaded) {
                if (estadoId === 1) {
                    this.setState({
                        backup: {
                            ...backup,
                            preguntas: this.props.preguntas,
                            respuestas: this.props.respuestas
                        },
                        backupLoaded: true,
                        loading: false
                    })
                } else {
                    const constantsFormAttributes = {}
                    const form = _.clone(this.state.form)

                    _.map((_.concat(detalle, oportunidad.detalle)), (d) => {
                        const {pregunta, respuesta, respuestaId} = d

                        if (respuestaId) {
                            form[`${pregunta}Nombre`] = respuesta
                            form[pregunta] = respuestaId
                        } else if (respuesta) {
                            form[pregunta] = respuesta
                        }
                    })

                    _.map((detalle), (d) => {
                        const {pregunta} = d

                        return constantsFormAttributes[pregunta] = true
                    })

                    this.setState({
                        constantsFormAttributes: {
                            ...this.state.constantsFormAttributes,
                            ...constantsFormAttributes
                        },
                        form,
                        backupLoaded,
                        initFormLoaded: true,
                        loadingMainData: false
                    })
                }
            } else if (detallesCargados > prevState.detallesCargados) {
                const {actions: {obtenerPreguntasFormOportunidad}} = this.props
                const {backup: {detalle}} = this.state
                const d = detalle[detallesCargados]


                if (d) {
                    const {respuestaId} = d

                    return respuestaId ?
                        obtenerPreguntasFormOportunidad({respuestaId})
                        :
                        this.setState({detallesCargados: detallesCargados + 1})
                }
            }
        } else {
            const {actions: {sobrescribirAtributosFormOportunidad}, primeraPregunta} = this.props
            const {form: {estadoId}, backup} = this.state
            if (estadoId !== prevState.form.estadoId) {
                if (estadoId === 1) {
                    sobrescribirAtributosFormOportunidad({
                        current: primeraPregunta,
                        preguntas: backup.preguntas,
                        respuestas: backup.respuestas
                    })
                }
            }
        }
    }

    setOportunidadFormEdition = (oportunidad) => {
        const {actions: {obtenerFormOportunidad, actualizarDetalleOportunidad}, preguntas, primeraPregunta} = this.props
        const {
            estadoId,
            usuarioNTResponsable,
            jefeNTResponsable,
            plataformaResponsable,
            resumen: {
                grupoEconomico,
                nombreEmpresa,
                rutEmpresa,
                nombreResponsable,
                fechaFin,
                producto,
                negocio,
                privado,
                macrobancaEmpresa,
            },
            notas,
        } = oportunidad
        const form = {
            ...this.state.form,
            estadoId: estadoId,
            grupoEconomico,
            usuarioNTResponsable,
            jefeNTResponsable,
            responsable: nombreResponsable,
            rutCliente: rutEmpresa,
            nombreCliente: nombreEmpresa,
            macroBanca: macrobancaEmpresa,
            end_date: moment(fechaFin),
            notas,
            privado: privado === null ? false : privado,  //Si es null es porque las oportunidades antiguas traen null en el nivel de resumen
            plataformaResponsable,
        }

        const constantsFormAttributes = {}
        let oportunidadDetalle = _.clone(oportunidad.detalle)
        let oportunidadDetalleSize = _.size(oportunidadDetalle)
        let prgs, loadingMainData, backupDataLoaded, backupDataLoadedCount, initialDetalleSize, mainDataKeyStack,
            mainDataLoaded, mainDataLoadedCount

        if (estadoId !== 1) {
            _.map(_.keys(_.isEmpty(form) ? form : form), (key) => {
                return constantsFormAttributes[key] = true
            })

            _.map(oportunidad.detalle, (dt) => {
                return constantsFormAttributes[dt.pregunta] = true
            })

            prgs = _.remove(oportunidadDetalle, (detalle) =>
                detalle.respuesta === negocio || detalle.respuesta === producto
            )

            actualizarDetalleOportunidad({detalle: oportunidadDetalle})
            oportunidadDetalle = prgs
            loadingMainData = true
            mainDataKeyStack = []
            backupDataLoaded = 0
            backupDataLoadedCount = 0
            mainDataLoaded = 0
            mainDataLoadedCount = 0
            initialDetalleSize = oportunidadDetalleSize
        } else {
            _.map(oportunidadDetalle, (detalle) => {
                const {pregunta, respuesta, preguntaId, respuestaId} = detalle
                if(pregunta === 'Probabilidad curse/activación'){
                    this.setState({value:parseInt(respuesta)})
                }
                return Object.assign(form, respuestaId ? {
                    [pregunta]: `${respuestaId}`, [`${pregunta}Nombre`]: respuesta
                } : {
                    [pregunta]: respuesta
                })
            })

            constantsFormAttributes['Negocio'] = true
            constantsFormAttributes[`NegocioNombre`] = true
            constantsFormAttributes['Producto'] = true
            constantsFormAttributes[`ProductoNombre`] = true
            constantsFormAttributes['rutCliente'] = true
            constantsFormAttributes['grupoEconomico'] = true
            loadingMainData = false
            initialDetalleSize = oportunidadDetalleSize
        }

        this.setState({
            constantsFormAttributes,
            initFormLoaded: false,
            loadingMainData,
            loading: true,
            backupDataLoaded,
            backupDataLoadedCount,
            initialDetalleSize,
            form,
            backup: {
                detalle: oportunidadDetalle
            }
        })

        if (oportunidad.estadoId !== 1) {
            const backupStore = true
            obtenerFormOportunidad(1, backupStore)
            obtenerFormOportunidad(estadoId)
        } else {
            obtenerFormOportunidad(1)
        }
    }

    getProducto = (preguntas, respuestas, ProductoNombre) => {
        const k = _.find(_.keys(preguntas), (k) => preguntas[k].name === 'Producto')
        const res = _.find(_.keys(respuestas[k]), (k2) => respuestas[k][k2].name === ProductoNombre)

        return res || null
    }

    handleColumnsStateMap = (values, oldValues, respuestaId) => {
        const {actualPregunta, respuestas, oportunidadId} = this.props
        const {form: {estadoId}, preguntasModificadas} = this.state
        const form = _.clone(this.state.form)
        const stateParams = {}

        _.map(_.values(oldValues), (oldValue) => {
            if (!_.find(_.values(values), (newValue) => oldValue.name === newValue.name)) {
                const title = oldValue.name
                delete form[title]
                delete form[`${title}Nombre`]
            }

            return
        })

        if (_.size(_.keys(values)) === 1) {
            const atributo = (values[actualPregunta] || {}).name
            const valueNombre = (respuestas[actualPregunta][respuestaId] || {}).name
            this.setState({form: {...form, [atributo]: respuestaId, [`${atributo}Nombre`]: valueNombre}})
        } else {
            _.keys(values).map(key => {
                if (parseInt(key) !== actualPregunta) {
                    let title = values[key].name
                    let type = values[key].tipo

                    Object.assign(stateParams, {
                        ...(TipoPregunta.SIMPLE === type ? {[`${title}ModalVisible`]: false} : {}),
                        form: Object.assign(form, {
                            ...(preguntasModificadas ? {
                                [title]: null,
                                [`${title}Nombre`]: null
                            } : {})
                        })
                    })
                }
            })
        }

        this.setState({...stateParams, preguntasModificadas: false, onPressBooleanButton: false})
        if (estadoId !== 1) this.setState({form: {...form, ...this.state.backup.form}})
    }

    handleRequiredColumns = (values) => {
        this.requiredColumns = {}
        let validationCount = 0
        let required = Object.keys(values || {}).filter(key => {
            return values[key].obligatorio
        })

        Object.keys(values || {}).map(key => {
            if (_.includes(required, key)) {
                Object.assign(this.requiredColumns, {[key]: values[key].name})
                validationCount ++
            }
        })
        this.validationColumnCount = validationCount
    }

    handleValidationForm = () => {
        if (this.validationColumnCount === 0) {
            this.setState({
                validationOportunidad: true
            })
        } else {
            this.setState({
                validationOportunidad: false
            })
        }
    }

    onSetEndDatetime = (date) => {
        this.setState(state => {
            return {
                endDateModalVisible: false,
                form: {
                    ...state.form,
                    end_date: moment(date)
                }
            }
        })
    }

    onSetEmpresaGrupoEconomico = (value) => {
        this.setState(state => {
            return {
                grupoEconomicoModalVisible: false,
                form: {
                    ...state.form,
                    rutCliente: `${value.rut}${value.digitoVerificador}`,
                    nombreCliente: value.nombreEmpresa,
                    grupoEconomico: value.nombreGrupo,
                    macroBanca: value.macroBanca || null
                }
            }
        })

        this.handleValidationForm()
    }

    onSetEmpresa = (value) => {
        this.setState(state => {
            return {
                rutClienteModalVisible: false,
                form: {
                    ...state.form,
                    rutCliente: `${value.rut}${value.digitoVerificador || value.dv}`,
                    nombreCliente: value.nombreEmpresa || value.nombre,
                    grupoEconomico: value.nombreGrupo || null,
                    macroBanca: value.macroBanca || null
                }
            }
        })
        this.handleValidationForm()
    }

    onSetResponsable = (value, title) => {
        this.setState(state => {
            return {
                [`${title}ModalVisible`]: false,
                form: {
                    ...state.form,
                    ...(title === 'responsable' ? {
                        responsable: value.nombreColaborador,
                        usuarioNTResponsable: value.usuarioNt,
                        jefeNT: value.usuarioNtJefe,
                        jefeNTResponsable: value.usuarioNtJefe,
                        plataformaResponsable: value.centroCosto,
                    } : {
                        [title]: value.usuarioNt
                    })
                }
            }
        })
        this.handleValidationForm()
    }

    onSetPrimeraRespuesta = (value) => {
        const {preguntas, respuestas, actualPregunta, actions: {obtenerPreguntasFormOportunidad, limpiarForm}} = this.props
        const {backup, form: {estadoId}} = this.state
        const atributo = (preguntas[actualPregunta] || {}).name
        let nombre = respuestas[actualPregunta]

        nombre = nombre[value].name

        const detalle = estadoId === 1 ? [{
            pregunta: atributo,
            respuesta: nombre,
            preguntaId: actualPregunta,
            respuestaId: value,
        }] : backup.detalle

        this.setState(state => {
            return {
                ...state,
                [`${atributo}Modal`]: false,
                form: {
                    ...state.form,
                    [atributo]: `${value}`,
                    [`${atributo}Nombre`]: nombre
                },
                backup: {
                    ...state.backup,
                    detalle
                },
                preguntasModificadas: true
            }
        })

        limpiarForm({respuestaId: value})

        obtenerPreguntasFormOportunidad({respuestaId: value})
        this.handleValidationForm()
    }

    onSetSimpleInput = (value, pregunta, srcProps = null) => {
        const {actions: {obtenerPreguntasFormOportunidad}} = this.props
        const {respuestas} = srcProps || this.props
        const {form, backup} = this.state
        const atributo = pregunta.name
        const nombreRespuesta = (respuestas[pregunta.id][value] || {}).name

        this.setState({
            form: {
                ...form,
                [atributo]: value,
                [`${atributo}Nombre`]: nombreRespuesta
            },
            backup: {
                ...backup,
                detalle: backup.detalle.concat({
                    pregunta: pregunta.name,
                    respuesta: nombreRespuesta,
                    preguntaId: pregunta.id,
                    respuestaId: value
                })
            },
            [`${atributo}ModalVisible`]: false
        })

        obtenerPreguntasFormOportunidad({respuestaId: value})
    }

    onSetBooleanInput = (value, title) => {
        const {form} = this.state

        if (form[title] !== value) {
            const {actions: {obtenerPreguntasFormOportunidad}, respuestas} = this.props
            let radioRespuesta

            for (var k1 of _.keys(respuestas)) {
                const j1 = respuestas[k1]
                const k2 = _.find(_.keys(j1), (k2) => k2 === value)

                if (k2) {
                    radioRespuesta = j1[k2].name.toLowerCase()
                    break
                }
            }

            this.setState({
                form: {
                    ...this.state.form,
                    [`${title}`]: value,
                    [`${title}Nombre`]: radioRespuesta
                },
                backup: {
                    ...this.state.backup,
                    detalle: this.state.backup.detalle.concat({
                        pregunta: title,
                        respuesta: radioRespuesta,
                        respuestaId: value
                    })
                },
                preguntasModificadas: false,
                onPressBooleanButton: title
            })

            obtenerPreguntasFormOportunidad({respuestaId: value})
        }
    }

    onSetLibreInput = (value, title) => {

        this.setState(state => {
            return {
                ...state,
                form: {
                    ...state.form,
                    [title]: value
                }
            }
        })

        this.handleValidationForm()
    }

    onSetContenidoNota = (contenido, i) => {
        const {form} = this.state
        const notas = _.clone(form.notas)

        notas[i].contenido = contenido

        this.setState({
            form: {
                ...form,
                notas
            }
        })
    }

    onCreateSummaryOportunidad = () => {
        const {currentUser, oportunidadId, colaboradores, oportunidad} = this.props
        const {backup,value,sl,plataform} = this.state
        const form = {...backup.form, ...this.state.form}
        const preguntas = {...this.props.preguntas, ...backup.preguntas}
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === currentUser.usuario)
        let usuarioResponsable = {}
        let usuarioCreador
        let jefeNTCreadorRequest
        let usuarioNTEdicion
        let ultimoCambio = null
        
        //console.log(this.state.form.rutCliente)
        const plataformEmpresa = plataform === undefined || plataform[this.state.form.rutCliente] === undefined || plataform[this.state.form.rutCliente].plataforma === undefined || plataform[this.state.form.rutCliente].plataforma === "" ? null : plataform[this.state.form.rutCliente].plataforma
   

        usuarioResponsable = _.find(colaboradores, (pt) => pt.usuarioNt === form['usuarioNTResponsable']) || {
            nombreColaborador: currentUser.nombreCompleto,
            usuarioNt: currentUser.usuario,
            centroCosto: currentUser.plataforma,
        }
        //oportunidad nueva
        if (oportunidadId === null) {
            usuarioCreador = currentUser.usuario.trim()
            jefeNTCreadorRequest = jefeNTCreador.usuarioNtJefe
            usuarioNTEdicion = ''
        }
        //editar oportunidad
        else {
            usuarioResponsable.centroCosto = usuarioResponsable.centroCosto === undefined ? oportunidad.plataformaResponsable : usuarioResponsable.centroCosto
            usuarioCreador = oportunidad.usuarioNTCreador
            jefeNTCreadorRequest = oportunidad.jefeNTCreador
            usuarioNTEdicion = currentUser.usuario.trim()
        }
        // const plataformaResponsable = usuarioResponsable.centroCosto
        const plataformaCreador = oportunidadId === null ? currentUser.plataforma : oportunidad.plataformaCreador

        const paramsForm = {}
        const respuestasId = []
        const resumen = {}
        const detalle = []

        const fechaCreacion = moment(new Date()).format()
        

        let endDate = moment(form['end_date']).format('YYYY-MM-DD')
        let tieneMonto = false

        Object.keys(form).map(st => {
            Object.keys(preguntas || {}).map(key => {
                const {tipo} = preguntas[key]

                if (st === preguntas[key].name) {
                    if (!_.includes([TipoPregunta.ENTERO, TipoPregunta.MONEDA, TipoPregunta.DECIMAL, TipoPregunta.LIBRE, TipoPregunta.ESTRUCTURADO], tipo)) {
                        respuestasId.push(form[st])
                    }
                    if (st.toLowerCase() === 'negocio' || st.toLowerCase() === 'producto') {
                        Object.assign(resumen, {[st.toLowerCase()]: form[`${st}Nombre`]})
                    }

                    if (st === 'Monto') tieneMonto = true

                    detalle.push({
                        pregunta: preguntas[key].name,
                        preguntaId: Number(key), ...(_.includes([TipoPregunta.LIBRE, TipoPregunta.ESTRUCTURADO], tipo) ?
                                {respuesta: form[st]}
                                : _.includes([TipoPregunta.ENTERO, TipoPregunta.MONEDA], tipo) ?
                                    {respuesta: montoEntero(form[st])}
                                    : tipo === TipoPregunta.DECIMAL ?
                                        {respuesta: montoDecimal(form[st])}
                                        :
                                        {respuesta: form[`${st}Nombre`], respuestaId: Number(form[st])}
                        )
                    })

                }
            })
        })
        /*if(sl !== undefined){
          sliderPreg = {
                pregunta:sl.name,
                respuesta:value,
                preguntaId:sl.id
           }
           detalle.push(sliderPreg)
        }else{
           sliderPreg = {
                pregunta:'Probabilidad curse/activación',
                respuesta:value,
                preguntaId:48
           }
           detalle.push(sliderPreg)
        }*/

        Object.assign(paramsForm, {plataformaResponsable: form['plataformaResponsable']})
        Object.assign(paramsForm, {plataformaCreador})
        Object.assign(paramsForm, {plataformaEmpresa:plataformEmpresa})
        Object.assign(paramsForm, {id: oportunidadId ? String(oportunidadId) : ''})
        Object.assign(paramsForm, {usuarioNTCreador: usuarioCreador})
        Object.assign(paramsForm, {usuarioNTResponsable: form['usuarioNTResponsable']})
        Object.assign(paramsForm, {clienteId: form['rutCliente']})
        Object.assign(paramsForm, {fechaFin: endDate})
        Object.assign(paramsForm, {estadoId: form['estadoId']})
        Object.assign(paramsForm, {monto: tieneMonto && form['Monto'] ? Number(form['Monto'].replace(/\./g, '')) : 0})
        Object.assign(paramsForm, {respuestasId: idsArrayParse(respuestasId)})
        Object.assign(paramsForm, {usuarioNTEdicion: usuarioNTEdicion})
        Object.assign(paramsForm, {privado: form['privado']})
        Object.assign(paramsForm, {jefeNTResponsable: form['jefeNTResponsable']})
        Object.assign(paramsForm, {jefeNTCreador: jefeNTCreadorRequest})

        Object.assign(resumen, {nombreEmpresa: form['nombreCliente']})
        Object.assign(resumen, {rutEmpresa: desformatoRut(form['rutCliente'])})
        Object.assign(resumen, {macrobancaEmpresa: form['macroBanca']})
        Object.assign(resumen, {grupoEconomico: form['grupoEconomico']})
        Object.assign(resumen, {nombreResponsable: form['responsable']})
        Object.assign(resumen, {privado: form['privado']})
        Object.assign(paramsForm, {mostrar: true})

        if (oportunidad.resumen !== undefined) {
            Object.assign(resumen, {fechaCreacion: oportunidad.resumen.fechaCreacion})
        }


        Object.assign(paramsForm, {resumen: resumen})
        Object.assign(paramsForm, {detalle: detalle})
        Object.assign(paramsForm, {
            notas: _.compact(_.map(form['notas'], (nota) => (nota.contenido ? {
                ...nota,
                fechaCreacion: nota.fechaCreacion == '' ? fechaCreacion : nota.fechaCreacion
            } : null)))
        })

        this.setState({
            resumen: paramsForm,
            resumenModalVisible: true
        })
       
    }

    onSaveOportunidad = () => {
        const {actions: {crearOportunidad, actualizarOportunidad}, oportunidadId, fromVisita, addToVisita, navigation} = this.props
        const {resumen} = this.state
        if (fromVisita) {
            addToVisita(resumen)
            navigation.goBack()
        } else if (oportunidadId) {
            actualizarOportunidad(resumen)
        } else {
            crearOportunidad(resumen)
        }
        
        this.setState({
            isButtonDisabled:true
        })

        setTimeout(() => this.setState({ isButtonDisabled: false }), 5000) 

    }

    onPressEstadoOportunidad = (estado) => {
        const {actions: {obtenerFormOportunidad}, estadosOportunidad, preguntas, respuestas} = this.props
        const {form, backup} = this.state
        const estadoId = _.find(estadosOportunidad, (e) => estado === e.nombre).id
        const constantsFormAttributes = {}
        const bk = {}
        let loadingTab = false
        if (estadoId === 1) {
            _.map(_.keys(form), (key) => {
                return delete constantsFormAttributes[key]
            })

            constantsFormAttributes['Negocio'] = true
            constantsFormAttributes[`NegocioNombre`] = true
            constantsFormAttributes['Producto'] = true
            constantsFormAttributes[`ProductoNombre`] = true
            constantsFormAttributes['rutCliente'] = true
            constantsFormAttributes['grupoEconomico'] = true

            Object.assign(bk, {...backup})
        } else {
            loadingTab = true
            Object.assign(bk, _.isEmpty(backup.form) ? {
                preguntas: _.clone(preguntas),
                respuestas: _.clone(respuestas),
                form: {...form, estadoId},
                detalle: backup.detalle
            } : {
                preguntas: backup.preguntas,
                respuestas: backup.respuestas,
                form: {...backup.form, estadoId},
                detalle: backup.detalle
            })

            _.map(_.keys(_.isEmpty(backup.form) ? form : backup.form), (key) => {
                return constantsFormAttributes[key] = true
            })

            if (estadoId === 2) delete constantsFormAttributes['Spread']
        }

        this.setState({
            form: {
                ...(estadoId === 1 ? backup.form : form),
                estadoId
            },
            backup: bk,
            constantsFormAttributes,
            loadingTab: loadingTab,
            initFormLoaded: estadoId === 1,
            preguntasModificadas: false
        })

        //se comento porque al cambiar de tabs no se cargan nuevamente las activa
        if (estadoId !== 1) obtenerFormOportunidad(estadoId)
        // obtenerFormOportunidad(estadoId)
    }

    onSetprivado = (estado) => {
        //TODO las lineas comentadas son un parche cuando es una edicion de oportunidad
        // const {oportunidadId} = this.props
        this.setState({
            form: {
                ...this.state.form,
                privado: estado,
                // responsable: !!oportunidadId ? null : this.state.form.responsable,
                // usuarioNTResponsable: !!oportunidadId ? null : this.state.form.usuarioNTResponsable,
            }
        })
    }

    validationForm = (validarRequeridos = false) => {
        const {preguntas, isFetchingObtenerPregunta} = this.props
        const {form, form: {estadoId}} = this.state
        const label = _.trim(form['NegocioNombre'])
        let validation = 0

        if (_.isNull(form['usuarioNTResponsable']) || _.isEmpty(form['usuarioNTResponsable'])) validation ++
        if (_.isNull(form['rutCliente']) || _.isEmpty(form['rutCliente'])) validation ++
        if (_.isEmpty(form['notas']) || !_.find(form['notas'], (nota) => !!nota.contenido.trim())) validation ++
        if (estadoId === 2) {

            if ((label === 'Colocación' || label === 'Leasing' || label === 'Factoring')
            // &&
            // (!form['Spread'] ||
            //     Number(form['Spread'] <= 0))
            ) {
                if (Number(form['Spread'] <= 0)) validation ++
                if (invalidDecimal(form['Spread'])) validation ++

            }
            // validation++

        }

        Object.keys(preguntas || {}).map(key => {
            Object.keys(form || {}).map(st => {
                const {name, obligatorio} = preguntas[key]

                if (obligatorio && !form[name]) {
                    validation ++
                } else if (form[name]) {
                    const pregunta = _.find(_.values(preguntas), (pg) => pg.name === name)

                    switch (pregunta.tipo) {
                        case TipoPregunta.MONEDA:
                        case TipoPregunta.ENTERO:
                            if (invalidInteger(form[name])) validation ++
                            if (montoEntero(form[name]) <= 0) validation ++
                            break
                        case TipoPregunta.DECIMAL:
                            if (invalidDecimal(form[name])) validation ++
                            if (montoDecimal(form[name]) <= 0) validation ++
                            break
                        default:
                    }
                }
            })
        })

        if (validation > 0) {
            if (validarRequeridos) setTimeout(function () {
                this.setState({requeridosFaltantes: true})
            }.bind(this), 200)
            return false
        } else {
            if (validarRequeridos) setTimeout(function () {
                this.setState({requeridosFaltantes: false})
            }.bind(this), 200)
            return !isFetchingObtenerPregunta && true
        }
    }

    renderAlertModal = () => {
        const {alertModalVisible} = this.state

        return (
            <ModalBox isOpen={alertModalVisible} backdropPressToClose={false} swipeToClose={false} style={styles.modal}
                      position={'center'} onClosed={() => {
                this.setState({alertModalVisible: false})
            }}>
                <Text style={styles.modalTitle}>
                    Oportunidad guardada exitosamente
                </Text>
                <Text style={styles.modalSubTitle}>¿Qué deseas hacer?</Text>
                <View style={styles.modalContainerButtons}>
                    <TouchableOpacity onPress={() => this.goBackHome()}
                                      style={[styles.buttonModal, styles.buttonSolid]}>
                        <Text style={styles.textModalSolidButton}>Volver</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.goNuevaOportunidad()}
                                      style={[styles.buttonModal, styles.buttonSolid]}>
                        <Text style={styles.textModalSolidButton}>Nueva oportunidad</Text>
                    </TouchableOpacity>
                </View>
            </ModalBox>
        )
    }

    goBackHome = () => {
        const {actions: {clearOportunidad}, navigation: {goBack, navigate}, fromMain} = this.props
        navigate('Main')
        // fromMain ? navigate('Main') : navigate('Oportunidades')
    }

    goNuevaOportunidad = () => {
        const {navigation: {replace}, fromMain} = this.props

        replace('FormularioOportunidad', {fromMain})
    }

    isEditableFormAttribute = (attName) => {
        const {constantsFormAttributes} = this.state
        return !constantsFormAttributes[attName]
    }

    renderResponsableInput = (value = null, srcProps = {}) => {
        const {colaboradores} = this.props
        const {preguntas} = srcProps
        const {form, requeridosFaltantes} = this.state
        const title = value ? preguntas[value].name : 'responsable'
        const capitalizedTitle = _.capitalize(title)
        const respuesta = title === 'responsable' ?
            form[title] : (_.find(colaboradores, (responsable) => responsable.usuarioNt === form[title]) || {}).nombreColaborador || form[title]
        const modalVisibleKey = `${value ? title : 'responsable'}ModalVisible`
        const modalVisible = this.state[`${value ? title : 'responsable'}ModalVisible`]
        const requeridoFaltante = requeridosFaltantes && !respuesta
        const inputStyle = [styles.inputContainer].concat(this.isEditableFormAttribute(title) ? [] : styles.inputContainerDisabled)

        if (requeridoFaltante) inputStyle.push(styles.inputContainerRequired)

        return (
            <View key={value}>
                <View style={inputStyle}>
                    <Modal animationType={'slide'} transparent={false} visible={!!modalVisible} onRequestClose={() => {
                    }}>
                        <SearchModal title={capitalizedTitle} type={TipoBusqueda.RESPONSABLE}
                                     getValue={(value) => this.onSetResponsable(value, title)}
                                     headerLeft={<GoBackButton onPress={() => {
                                         this.setState({[modalVisibleKey]: false})
                                     }}/>}/>
                    </Modal>
                    <TouchableOpacity
                        onPress={() => this.isEditableFormAttribute(title) ? this.setState({[modalVisibleKey]: true}) : null}
                        {...testID({
                            id: `ResponsableOportunidadButton`,
                            label: `Boton para agregar responsable a la oportunidad`
                        })}
                    >
                        {respuesta ? <Text
                            style={[styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])}>{`${capitalizedTitle} oportunidad*:`}</Text> : null}
                        <View style={styles.itemContainer}>
                            <Text
                                style={styles.inputText}>{respuesta ? respuesta : `${capitalizedTitle} ${value ? '' : 'oportunidad'}*`}</Text>
                            <Image style={{marginRight: 10}}
                                   source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>

                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderRutClienteInput = () => {
        const {rutClienteModalVisible, form: {estadoId, rutCliente}, requeridosFaltantes} = this.state
        const requeridoFaltante = requeridosFaltantes && !rutCliente
        const inputStyle = [styles.inputContainer].concat(this.isEditableFormAttribute('rutCliente') ? [] : styles.inputContainerDisabled)
        if (requeridoFaltante) inputStyle.push(styles.inputContainerRequired)

        return (
            <View>
                <View style={inputStyle}>
                    <Modal animationType={'slide'} transparent={false} visible={rutClienteModalVisible}
                           onRequestClose={() => {
                           }}>
                        <SearchModal
                            title='RUT Cliente'
                            type={TipoBusqueda.RUT_CLIENTE}
                            getValue={this.onSetEmpresa}
                            headerLeft={<GoBackButton onPress={() => {
                                this.setState({rutClienteModalVisible: false})
                            }}/>}
                        />
                    </Modal>
                    <TouchableOpacity
                        onPress={() => this.isEditableFormAttribute('rutCliente') ? this.setState({rutClienteModalVisible: true}) : null}
                        {...testID({
                            id: `RutClienteOportunidadButton`,
                            label: `Boton rut cliente oportunidad`
                        })}
                    >
                        {rutCliente ?
                            <Text style={[styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])}
                                  {...testID({
                                      id: `RutClienteOportunidadLabel`,
                                      label: `Label de rut`
                                  })}
                            >
                                RUT cliente*:
                            </Text> : null}
                        <View style={styles.itemContainer}>
                            <Text style={[styles.inputText].concat(requeridoFaltante ? styles.inputTextRequired : [])}
                                  {...testID({
                                      id: `RutClienteOportunidadTextBox`,
                                      label: `Contenedor de texto de rut`
                                  })}
                            >
                                {rutCliente ? formatoRut(rutCliente) : 'RUT cliente*'}
                            </Text>
                            <Image style={{marginRight: 10}}
                                   source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>

                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderGrupoEconomicoInput = () => {
        const {grupoEconomicoModalVisible, form: {estadoId, grupoEconomico}} = this.state
        return (
            <View
                style={[styles.inputContainer].concat(this.isEditableFormAttribute('grupoEconomico') ? [] : styles.inputContainerDisabled)}>
                <Modal animationType={'slide'} transparent={false} visible={grupoEconomicoModalVisible}
                       onRequestClose={() => {
                       }}>
                    <SearchModal
                        title='Grupo Económico'
                        type={TipoBusqueda.GRUPO_ECONOMICO}
                        getValue={this.onSetEmpresaGrupoEconomico}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({grupoEconomicoModalVisible: false})
                        }}
                        />}/>
                </Modal>
                <TouchableOpacity
                    onPress={() => this.isEditableFormAttribute('grupoEconomico') ? this.setState({grupoEconomicoModalVisible: true}) : null}
                    {...testID({
                        id: `GrupoEconomicoOportunidadButton`,
                        label: `Boton grupo economico oportunidad`
                    })}
                >
                    {grupoEconomico ? <Text style={styles.inputTitle}
                                            {...testID({
                                                id: `GrupoEconomicoOportunidadLabel`,
                                                label: `Contenedor de texto de grupo economico`
                                            })}
                    >
                        Grupo económico*:
                    </Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `GrupoEconomicoOportunidadTextBox`,
                                  label: `Contenedor de texto de grupo economico`
                              })}
                        >
                            {grupoEconomico ? grupoEconomico : 'Grupo económico'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderPrimeraPreguntaInput = (srcProps, pID) => {
        const {actualPregunta, preguntas, respuestas} = srcProps
        const {form, requeridosFaltantes} = this.state
        const atributo = (preguntas[actualPregunta] || {}).name
        const value = form[atributo]
        const valueNombre = form[`${atributo}Nombre`]
        const primeraPreguntaModal = !!this.state[`${atributo}Modal`]
        let title = preguntas[actualPregunta] !== undefined ? preguntas[actualPregunta].name : 'Cargando...'
        let list = respuestas[actualPregunta] !== undefined ? respuestas[actualPregunta] : []
        let obligatorio = !!(preguntas[actualPregunta] !== undefined && preguntas[actualPregunta].obligatorio)
        const requeridoFaltante = obligatorio && requeridosFaltantes && !value
        const inputStyle = [styles.inputContainer].concat(this.isEditableFormAttribute(atributo) ? [] : styles.inputContainerDisabled)
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const inputTextStyle = [styles.inputText].concat(requeridoFaltante ? styles.inputTextRequired : [])
        
        if (requeridoFaltante) inputStyle.push(styles.inputContainerRequired)

        return (
            <View>
                <View style={inputStyle}>
                    <Modal animationType={'slide'} transparent={false} visible={primeraPreguntaModal}
                           onRequestClose={() => {
                           }}>
                        <ItemListModal
                            list={list}
                            saveSelection={this.onSetPrimeraRespuesta}
                            title={title}
                            pID={pID}
                            headerLeft={<GoBackButton onPress={() => {
                                this.setState({[`${atributo}Modal`]: false})
                            }}/>}
                            type={FiltroOportunidad.TIPO_NEGOCIOS}
                            defaultValue={value}/>
                    </Modal>
                    <TouchableOpacity
                        onPress={() => this.isEditableFormAttribute(atributo) ? this.setState({[`${atributo}Modal`]: true}) : null}
                        {...testID({
                            id: `PrimeraPreguntaOportunidadButton`,
                            label: `Boton para seleccionar la primera pregunta oportunidad`
                        })}
                    >
                        {
                            valueNombre ? <Text style={inputTitleStyle}>{title}{obligatorio ? '*' : null}</Text> : null
                        }
                        <View style={styles.itemContainer}
                              {...testID({
                                  id: `PrimeraPreguntaOportunidadContainer`,
                                  label: `Contenedor primera pregunta oportunidad`
                              })}
                        >
                            <Text style={inputTextStyle}
                                  {...testID({
                                      id: `PrimeraPreguntaOportunidadLabel`,
                                      label: `Texto primera pregunta oportunidad`
                                  })}
                            >
                                {/*valueNombre ? valueNombre : `${title}${obligatorio ? '*' : ''}`*/}
                                {valueNombre ? valueNombre : `${title !== undefined ? title : ''}${obligatorio ? '*' : ''}`}  
                            </Text>
                            <Image style={{marginRight: 10}}
                                   source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>

                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }
    

     /*renderSliderText = () => {
        const { value } = this.state;
        const { slider } = this.props
        const dataJson = slider !== undefined ? slider : '';
        return(
         <View>
            <View style={{flexDirection:'row',justifyContent: 'space-between'}}> 
              <Text>{dataJson.name !== undefined ? dataJson.name : 'Probabilidad curse/activación'}</Text> 
              <Text>{value}</Text>
            </View>  
            <Slider
              step={1}
              maximumValue={100}
              value={value}
              onValueChange={(value) => this.setState({value})}
            />
          </View>
        )
    }*/


    renderSimpleInput = (key, srcProps, pID) => {
        const {preguntas} = srcProps
        const {form, requeridosFaltantes} = this.state
        const pregunta = preguntas[key]
        const respuestas = srcProps.respuestas[key]
        const {name, obligatorio, tipo} = pregunta
        const tituloModal = `${name}ModalVisible`
        const tituloInput = `${name}${obligatorio ? '*' : ':'}`
        const modalVisible = !!this.state[tituloModal]
        const actualRespuesta = form[name]
        const actualRespuestaNombre = form[`${name}Nombre`]

        const requeridoFaltante = obligatorio && requeridosFaltantes && !actualRespuesta
        const inputStyle = [styles.inputContainer].concat(requeridoFaltante ? styles.inputContainerRequired : [])
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const inputTextStyle = [styles.inputText].concat(requeridoFaltante ? styles.inputTextRequired : [])

        //El campo es editable
        const isEditable = this.isEditableFormAttribute(name)
        if (!isEditable) inputStyle.push(styles.inputContainerDisabled)
        

        if (tipo === TipoPregunta.SIMPLE) { 
            return (
                <View key={key}>
                    <View style={inputStyle}>
                        <Modal animationType={'slide'} transparent={false} visible={modalVisible}
                               onRequestClose={() => {
                               }}>
                            <ItemListModal
                                list={respuestas}
                                saveSelection={(value) => this.onSetSimpleInput(value, {
                                    ...pregunta,
                                    id: key
                                }, srcProps)}
                                title={name}
                                headerLeft={<GoBackButton onPress={() => {
                                    this.setState({[tituloModal]: false})
                                }}/>}
                                type={'ANY'}
                                pID={pID}
                                defaultValue={actualRespuesta}/>
                        </Modal>
                        <TouchableOpacity onPress={() => this.setState({[tituloModal]: true})} disabled={!isEditable}
                                          {...testID({
                                              id: `${pID}SimpleInput`,
                                              label: `Contenedor de selección simple de ${name}`
                                          })}
                        >
                            {actualRespuestaNombre ? <Text style={inputTitleStyle}>{`${tituloInput}:`}</Text> : null}
                            <View style={styles.itemContainer}
                                  {...testID({
                                      id: `${pID}TextBoxContainer`,
                                      label: `Contenedor de caja de texto de ${name}`
                                  })}
                            >
                                <Text style={inputTextStyle}
                                      {...testID({
                                          id: `${pID}TextBox`,
                                          label: `Contenedor de texto de ${name}`
                                      })}
                                >
                                    {actualRespuestaNombre || tituloInput}</Text>
                                <Image style={{marginRight: 10}}
                                       source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
                </View>
            )
        } else {
            return (
                <View key={key} style={{marginBottom: 30}}>
                    <Text style={styles.titleMotivo}>{`${tituloInput}:`}</Text>
                    <SimpleTabs list={respuestas} value={actualRespuesta} onSetSimpleTabsInput={this.onSetSimpleInput}
                                responseData={{...pregunta, id: key}}/>
                </View>
            )
        }
    }
   

    renderLibreInput = (value, srcProps, pID) => {
        const {preguntas} = srcProps
        const {form, form: {estadoId}, requeridosFaltantes} = this.state
        let title = preguntas[value] !== undefined ? preguntas[value].name : 'Cargando...'

        let icon = preguntas[value].tipo === TipoPregunta.MONEDA ?
            <Image source={require('./../../assets/images/icons/monetization_input_icon.png')}/> : []
        let obligatorio = !!(preguntas[value] !== undefined && preguntas[value].obligatorio) || (estadoId === 2 && title === 'Spread')

        const respuesta = form[title]
        const enteroInvalido = preguntas[value].tipo === TipoPregunta.MONEDA || preguntas[value].tipo === TipoPregunta.ENTERO ?
            !!respuesta && invalidInteger(respuesta) : false
        const decimalInvalido = preguntas[value].tipo === TipoPregunta.DECIMAL ?
            !!respuesta && invalidDecimal(respuesta) : false
        const requeridoFaltante = (obligatorio && requeridosFaltantes && !respuesta) || enteroInvalido || decimalInvalido
        const inputStyle = [styles.inputContainer].concat(this.isEditableFormAttribute(title) ? [] : styles.inputContainerDisabled)
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const inputTextStyle = preguntas[value].tipo === TipoPregunta.MONEDA ? [styles.montoInputText] : [styles.inputText]

        if (requeridoFaltante) {
            inputTextStyle.push(styles.inputTextRequired)
            inputStyle.push(styles.inputContainerRequired)
        } else {
            inputTextStyle.push({color: BLACK})
        }
        return (
            <View key={value}>
                <View style={inputStyle}>
                    <Text style={inputTitleStyle}>{title}{obligatorio ? '*' : null}:</Text>
                    <InputGroup
                        testID={testID({
                            id: `${pID}Input`,
                            label: `Contenedor de input de ${title}`
                        })}
                        editable={this.isEditableFormAttribute(title)}
                        secureTextEntry={false}
                        onChangeText={value => {
                            this.onSetLibreInput(value, title)
                        }}
                        onBlur={() => {
                        }}
                        placeHolderText={title}
                        placeholderTextColor={BROWN_LIGHT_GREY}
                        autoCapitalize="none"
                        keyboardType={_.includes([TipoPregunta.MONEDA, TipoPregunta.ENTERO], preguntas[value].tipo) ?
                            'number-pad'
                            : preguntas[value].tipo === TipoPregunta.DECIMAL ?
                                'decimal-pad'
                                :
                                'default'
                        }
                        style={inputTextStyle}
                        leftContent={icon}
                        value={TipoPregunta.MONEDA === preguntas[value].tipo || TipoPregunta.ENTERO === preguntas[value].tipo ?
                            montoPuntosMil(this.state.form[title]) : this.state.form[title]
                        }
                        rightContent={[]}
                    />
                </View>

                {requeridoFaltante ?
                    <Text style={styles.requeridoMssg}>
                        {!enteroInvalido && !decimalInvalido ? 'campo requerido' : enteroInvalido ? 'campo debe ser un número entero' : 'campo debe ser un número decimal'}
                    </Text>
                    : null}
            </View>
        )
    }

    renderBooleanInput = (value, srcProps, pID) => {
        const {preguntas, respuestas} = srcProps
        const {requeridosFaltantes, form: {estadoId}} = this.state
        const title = preguntas[value] !== undefined ? preguntas[value].name : 'Cargando...'
        const respuesta = respuestas[value]
        const actualRespuesta = this.state.form[title]
        const obligatorio = !!(preguntas[value] !== undefined && preguntas[value].obligatorio)

        const requeridoFaltante = obligatorio && requeridosFaltantes && !actualRespuesta
        const inputStyle = [styles.inputContainer].concat(requeridoFaltante ? styles.inputContainerRequired : [])
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const isEditable = estadoId === 1

        if (!isEditable) inputStyle.push(styles.inputContainerDisabled)

        return (
            <View key={value}>
                <View style={inputStyle}>
                    <Text style={inputTitleStyle}
                          {...testID({
                              id: `${pID}TextBox`,
                              label: `texto de ${title}`
                          })}
                    >
                        {title}{obligatorio ? '*' : null}:
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        {
                            Object.keys(respuesta || {}).map((key, index) => {
                                //onsetboolean acepta dos parametros value (que es la key o el id de la respuesta) y title que es 'CSE'
                                return <BooleanRadioButton
                                    editable={isEditable}  //es editable
                                    key={key} //id respuesta
                                    title={title} // nombre de la pregunta
                                    pID={pID} //
                                    label={respuesta[key].name} // nombre de la respuesta
                                    value={key} // id de la respuesta
                                    active={this.state.form[`${title}Nombre`]} //
                                    handleSelectItem={this.onSetBooleanInput} // accion para seleccionar respuesta
                                />
                            })
                        }
                    </View>
                </View>

                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderFormColumns = (fromBackup = false) => {
        const srcProps = fromBackup ? {
            actualPregunta: this.props.primeraPregunta,
            preguntas: this.state.backup.preguntas || this.props.backup.preguntas,
            respuestas: this.state.backup.respuestas || this.props.backup.respuestas
        } : this.props
        const {preguntas, actualPregunta} = srcProps
        let preguntasLength = Object.keys(preguntas || {}).length
        this.testIDCount = 1
        return (
            <View>
                {this.renderPrimeraPreguntaInput(srcProps, `P${this.testIDCount}OPORTUNIDAD`)}
                     
                {preguntasLength > 1 ?
                    _.map(preguntas[actualPregunta].childrensId, (chId) => {
                        this.testIDCount += 1
                        return this.renderFormInputWithChildrens({...preguntas[chId], parentId: false}, chId, srcProps)
                    }) : null
                }
            </View>
        )
    }

    renderFormInputWithChildrens = (pregunta, key, srcProps) => {
        const {preguntas} = srcProps

        return (
            <View key={key}>
                {!pregunta.parentId ?
                    this.renderFormInput(pregunta, key, `P${this.testIDCount}OPORTUNIDAD`, srcProps) : null
                }

                {_.map(pregunta.childrensId, (chId) => {
                    this.testIDCount += 1
                    return this.renderFormInputWithChildrens({...preguntas[chId], parentId: false}, chId, srcProps)
                })}
            </View>
        )
    }

    renderFormInput = (pregunta, key, pID, srcProps) => {
        switch (pregunta.tipo) {
            case TipoPregunta.SIMPLE:
                return this.renderSimpleInput(key, srcProps, pID)
            case TipoPregunta.MULTIPLE:
                break
            case TipoPregunta.LIBRE:
            case TipoPregunta.ENTERO:
            case TipoPregunta.DECIMAL:
            case TipoPregunta.MONEDA:
                return this.renderLibreInput(key, srcProps, pID)
            case TipoPregunta.CHECKBOX:
                break
            case TipoPregunta.BOOLEAN:
                return this.renderBooleanInput(key, srcProps, pID)
            case TipoPregunta.ESTRUCTURADO:
                return this.renderResponsableInput(key, srcProps, pID)
            default:
                break
        }
    }

    renderEndDatePickerInput = () => {
        const {oportunidad: {estadoId}, oportunidadId} = this.props
        const {form, form: {end_date}, endDateModalVisible} = this.state
        const title = `Fecha ${form.estadoId === 1 ? 'Estimada ' : ''}de Cierre`
        const isEditable = !oportunidadId || estadoId === 1
        const inputStyle = [styles.inputContainer].concat(isEditable ? [] : styles.inputContainerDisabled)

        return (
            <View style={inputStyle}>
                {
                    Platform.OS === 'ios'
                        ? <Modal animationType={'slide'} transparent={true} visible={endDateModalVisible}
                                 onRequestClose={this.onSetEndDatetime}>
                            <DateTimePicker
                                defaultDate={new Date(end_date)}
                                onSave={this.onSetEndDatetime}
                                isVisible={endDateModalVisible}
                                onCancel={this.onSetEndDatetime}/>
                        </Modal>
                        : <DateTimePicker
                            defaultDate={new Date(end_date)}
                            onSave={this.onSetEndDatetime}
                            isVisible={endDateModalVisible}
                            onCancel={this.onSetEndDatetime}/>
                }

                <TouchableOpacity onPress={() => {
                    isEditable ? this.setState({endDateModalVisible: true}) : null
                }}
                                  {...testID({
                                      id: `FechaOportunidadButton`,
                                      label: `Contenedor de boton fecha de oportunidad`
                                  })}
                >
                    {end_date ? <Text style={styles.inputTitle}>{title}*:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}>
                            {end_date ? end_date.format('dddd, DD MMMM YYYY') : title}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/calendar_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderNotaInput = (nota, key) => {
        const {id, contenido, fechaCreacion, usuarioCreador} = nota
        const editable = !id
        const maxLength = 300
        let horaNota
        if (fechaCreacion.length === 0) {
            horaNota = ''
        } else {
            let fechaCreacionOportunidad = moment(fechaCreacion, 'YYYY-MM-DD HH:mm:ss Z')
            horaNota = moment(fechaCreacionOportunidad).format('DD-MM-YYYY HH:mm A')
        }


        return (
            <View key={key}>
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                }}>
                    <Text style={styles.horaNotaOportunidad}>{usuarioCreador} {horaNota}</Text>
                </View>
                <View
                    style={[styles.inputContainer, styles.notaInputContainer].concat(editable ? [] : styles.inputContainerDisabled)}>
                    <InputGroup
                        testID={testID({
                            id: `nota${key + 1}Input`,
                            label: `Contenedor de input de nota ${key + 1}`
                        })}
                        editable={editable}
                        maxLength={maxLength}
                        secureTextEntry={false}
                        onChangeText={value => this.onSetContenidoNota(value, key)}
                        onBlur={() => {
                        }}
                        placeHolderText={`Nota ${key + 1}`}
                        placeholderTextColor={BROWN_LIGHT_GREY}
                        autoCapitalize="none"
                        keyboardType={'default'}
                        style={styles.inputText}
                        leftContent={[]}
                        rightContent={[]}
                        value={contenido}
                        multiline={true}
                        numberOfLines={4}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignSelf: 'stretch',
                }}>
                    <Text style={styles.maxLength}>{`${_.size(contenido)}/${maxLength}`}</Text>
                </View>

            </View>
        )
    }

    renderResumenOportunidad = () => {
        const {fromVisita} = this.props
        const {resumen, resumenModalVisible, loadingButton, form: {notas, estadoId},isButtonDisabled} = this.state
        return (
            <Modal animationType={'slide'} transparent={false} visible={resumenModalVisible} onRequestClose={() => {
            }}>
                <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR, paddingTop: 15}}>
                    <NavBar
                        title="Resumen Oportunidad"
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({resumenModalVisible: false})
                        }}/>}
                    />
                    <ScrollView>
                        <ResumenOportunidadScreen title='Resumen Oportundidad' oportunidad={{...resumen, ...resumen}}
                                                  estadoId={estadoId}/>
                    </ScrollView>
                    <TouchableOpacity onPress={() => {
                        this.onSaveOportunidad()
                    }} style={styles.buttonsContainer}
                                      {...testID({
                                          id: `GuardarOportunidadButton`,
                                          label: `boton para guardar la oportunidad despues de ver el resumen`
                                      })}
                    disabled={isButtonDisabled}>
                        <Text style={styles.buttonText}>{fromVisita ? 'Agregar a visita' : 'Guardar'}</Text>
                        {loadingButton && <ActivityIndicator size="small" color="white"/>}
                    </TouchableOpacity>
                </View>
                {this.renderAlertModal()}
            </Modal>
        )
    }

    renderPrivadoSwitch = () => {
        const {form: {privado}} = this.state
        const {oportunidad} = this.props
        return (
            <View>
                <View style={styles.inputContainerSwitch}>
                    {/*SwitchButton onSetprivado={this.onSetprivado} title={'Oportunidad confidencial'}
                                  valueSwitch={privado}
                                  disabled={(oportunidad.estadoId !== 1 && oportunidad.estadoId !== undefined)}/>*/}
                </View>
            </View>
        )

    }

    agregarNota = () => {
        const {currentUser: {usuario}} = this.props
        const {form, form: {notas}} = this.state
        if (_.last(notas).contenido.trim().length > 0) {
            this.setState({
                form: {
                    ...form,
                    notas: notas.concat({
                        id: '',
                        usuarioCreador: usuario,
                        fechaCreacion: '',
                        contenido: ''
                    })
                }
            })
        }

    }

    renderCreador = () => {
        const {oportunidad, oportunidadId, currentUser} = this.props

        if (oportunidadId) {
            return {
                nombreCreador: oportunidad.usuarioNTCreador,
                fechaCreacion: moment(oportunidad.resumen.fechaCreacion, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss').replace('00:00:00', ''),
            }
        } else {
            return {
                nombreCreador: currentUser.nombreCompleto.trim(),
                fechaCreacion: ''
            }
        }
    }

    ultimoCambioOportunidad = () => {
        const {oportunidad, oportunidadId} = this.props

        if (oportunidadId && oportunidad.ultimoCambio !== null) {
            return {
                usuarioNT: oportunidad.ultimoCambio.usuarioNT,
                fechaEdicion: moment(oportunidad.ultimoCambio.fechaCreacion).format('YYYY-MM-DD HH:mm:ss'),
            }
        } else {
            return false
        }
    }

    renderForm = () => {
        const {estadosOportunidad, oportunidadId, oportunidad, fromVisita, isFetchingObtenerPregunta} = this.props
        const {form: {estadoId, rutCliente, nombreCliente, notas}, loadingTab, requeridosFaltantes} = this.state
        const notaFaltante = !_.find(notas, (nt) => !!nt.contenido)
        const notaTitleStyle = [styles.inputTitle]
        const editable = this.validationForm()
        const {nombreCreador, fechaCreacion} = this.renderCreador()
        const ultimoCambio = oportunidadId && this.ultimoCambioOportunidad()
        if (requeridosFaltantes && notaFaltante) notaTitleStyle.push(styles.inputTitleRequired)

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'position' : null}
                    style={{flex: 1}}
                    enabled
                >
                    <ScrollView style={styles.formContainer}>

                        <View style={styles.userContainer}
                              {...testID({
                                  id: `CreadorOportunidadContainer`,
                                  label: `Contenedor del creador de oportunidad`
                              })}
                        >
                            <View style={styles.titleContainer}>
                                {/*<Image source={require('./../../assets/images/icons/creator_icon.png')}/>*/}
                                <Text style={styles.title}>Creador:</Text>
                            </View>
                            <Text style={styles.creator}  {...testID({
                                id: `NombreCreadorOportunidadLabel`,
                                label: `Nombre del creador de oportunidad`
                            })}>
                                {nombreCreador}
                            </Text>
                            <Text style={styles.dateHeader}
                                  {...testID({
                                      id: `CreadorOportunidadContainer`,
                                      label: `Fecha de creacion de la oportunidad`
                                  })}
                            >
                                {fechaCreacion}
                            </Text>
                        </View>

                        {(oportunidadId && ultimoCambio) &&
                        <View style={styles.userContainer}
                              {...testID({
                                  id: `EditorOportunidadContainer`,
                                  label: `Contenedor de la edicion  de oportunidad`
                              })}
                        >
                            <View style={styles.titleContainer}>
                                {/*<Image source={require('./../../assets/images/icons/creator_icon.png')}/>*/}
                                <Text style={styles.title}>Ultima edición:</Text>
                            </View>
                            <Text style={styles.creator} {...testID({
                                id: `NombreEditorOportunidadLabel`,
                                label: `Nombre del creador de oportunidad`
                            })}>
                                {ultimoCambio.usuarioNT}
                            </Text>
                            <Text style={styles.dateHeader}
                                  {...testID({
                                      id: `FechaEdicionOportunidadLabel`,
                                      label: `Fecha de edicion de oportunidad`
                                  })}
                            >
                                {ultimoCambio.fechaEdicion}
                            </Text>
                        </View>
                        }
                        {oportunidadId ?
                            <EstadosOportunidad
                                value={(_.find(estadosOportunidad, (e) => e.id === estadoId) || {}).nombre}
                                estadoId={oportunidad.estadoId}
                                editable={(oportunidad.estadoId === 1 && estadoId !== 1) || editable}
                                changeTabValue={oportunidad.estadoId === 1 ? this.onPressEstadoOportunidad : () => null}/>
                            : null}

                        {loadingTab ? <Loading style={{top: 50}}/> :
                            <View>
                                {estadoId === 3 ?
                                    <View>
                                        {this.renderFormColumns()}
                                        <View style={styles.separator}/>
                                    </View>
                                    : null}

                                {this.renderPrivadoSwitch()}
                                {this.renderResponsableInput()}
                                {this.renderRutClienteInput()}
                                {this.renderGrupoEconomicoInput()}

                                <View
                                    style={rutCliente ? [styles.inputContainer].concat(estadoId !== 2 ? [] : styles.inputContainerDisabled) : styles.inputDisabledContainer}
                                    {...testID({
                                        id: `NombreClienteOportunidadContainer`,
                                        label: `Container nombre cliente oportunidad`
                                    })}
                                >
                                    {nombreCliente ? <Text style={styles.inputTitle}>Nombre cliente*:</Text> : null}
                                    <Text style={styles.inputDisableText}
                                          {...testID({
                                              id: `NombreClienteOportunidadLabel`,
                                              label: `Texto nombre cliente oportunidad`
                                          })}
                                    >
                                        {nombreCliente ? nombreCliente : 'Nombre cliente'}
                                    </Text>
                                </View>

                                {/*Formulario de preguntas dinamicas*/}
                                {this.renderFormColumns(estadoId !== 1)}

                                {this.renderEndDatePickerInput()}

                                <Text style={notaTitleStyle}
                                      {...testID({
                                          id: `NotaOportunidadLabel`,
                                          label: `Label de la nota oportunidad`
                                      })}
                                >
                                    {'Nota(s) *.'}
                                </Text>
                                {requeridosFaltantes && notaFaltante ?
                                    <Text style={styles.requeridoMssg}>debe haber al menos una nota</Text> : null}

                                {/*Ver todas las notas*/}
                                {_.map(notas, (nota, i) => {
                                    return this.renderNotaInput(nota, i)
                                })}

                                {/*Agregar nueva nota*/}
                                {this.isEditableFormAttribute('notas') ?
                                    <ButtonAddNota addNota={this.agregarNota} title={'Agregar Nota'}/> : null}

                                {this.renderResumenOportunidad()}


                            </View>
                        }

                    </ScrollView>
                </KeyboardAvoidingView>

                {
                    loadingTab || (oportunidadId && oportunidad.estadoId !== 1) ? null :
                        <TouchableOpacity onPress={() => {
                            this.validationForm(true) ? this.onCreateSummaryOportunidad() : false
                        }} style={editable ? styles.buttonsContainer : styles.buttonsDisabledContainer}
                                          {...testID({
                                              id: `CrearOportunidadButton`,
                                              label: `Boton para crear o editar una oportunidad`
                                          })}
                        >
                            <Text
                                style={styles.buttonText}>{oportunidadId ? 'Editar' : fromVisita ? 'Agregar' : 'Crear'}</Text>
                            {isFetchingObtenerPregunta && <ActivityIndicator size="small" color="white"/>}
                        </TouchableOpacity>
                }
            </View>
        )
    }

    loadingForm = () => {
        const {oportunidad: {estadoId}, isSaved, oportunidadId} = this.props
        const {loading, backupLoaded} = this.state
        //Antigua validacion de Mario
        // return !isSaved ? !oportunidadId || estadoId === 1 ? loading : !backupLoaded : false
        return !oportunidadId || estadoId === 1 ? loading : !backupLoaded
    }

    render() {
        const {error} = this.props
        const {fatalError} = this.state
        return error === 'unauthorized' ? <Unauthorized/> : this.loadingForm() ? <Loading/> : fatalError ?
            <Text>{'Ha habido un error en el sistema. Por favor vuelva intentarlo mas tarde.'}</Text>
            : this.renderForm()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormularioOportunidadScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    formContainer: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20
    },
    userContainer: {
        height: 76,
        backgroundColor: WHITE,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom: 20
    },
    titleContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    title: {
        marginLeft: 10,
        fontWeight: '500'
    },
    creator: {
        textTransform: 'capitalize',
        fontWeight: '600'
    },
    dateHeader: {
        textTransform: 'capitalize',
        fontWeight: '200'
    },
    buttonsContainer: {
        backgroundColor: GREEN,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonsDisabledContainer: {
        backgroundColor: GREY,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonText: {
        color: WHITE,
        paddingTop: 12.5,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: '500'
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: BLACK,
        paddingBottom: 10,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    inputContainerSwitch: {
        paddingBottom: 10,
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 5
    },
    inputContainerRequired: {
        color: RED,
        borderBottomColor: RED,
        marginBottom: 0
    },
    inputContainerDisabled: {
        opacity: 0.4
    },
    inputTitle: {
        fontSize: 12,
        marginBottom: 5
    },
    inputTitleRequired: {
        color: RED
    },
    inputText: {
        fontSize: 16,
        color: BLACK
    },
    inputTextRequired: {
        color: RED
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    inputDisabledContainer: {
        borderBottomWidth: 1,
        borderBottomColor: BROWN_GREY,
        paddingBottom: 5,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
        textTransform: 'capitalize'
    },
    inputDisableText: {
        fontSize: 16,
        color: BROWN_GREY
    },
    montoInputText: {
        fontSize: 16,
        textTransform: 'capitalize',
        marginLeft: 40
    },
    modal: {
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        height: 180,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 20
    },
    modalSubTitle: {
        fontSize: 16,
        marginBottom: 20
    },
    modalContainerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonModal: {
        height: 44,
        borderRadius: 50,
        marginHorizontal: 2.5

    },
    buttonTransparent: {
        borderWidth: 1,
        borderColor: GREEN,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
        marginRight: 20
    },
    buttonSolid: {
        backgroundColor: GREEN,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'center',
    },
    textModalSolidButton: {
        color: WHITE,
        fontSize: 14
    },
    textModalTransparentButton: {
        color: GREEN,
        fontSize: 14
    },
    buttonNota: {
        flexDirection: 'row',
        height: 44,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 120
    },
    buttonNotaText: {
        color: GREEN,
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: BROWN_RELIGHT_GREY,
        marginVertical: 5
    },
    notaInputContainer: {
        marginBottom: 0
    },
    maxLength: {
        textAlign: 'right',
        color: BROWN_GREY,
        marginBottom: 40,
        flex: 1
    },
    horaNotaOportunidad: {
        textAlign: 'center',
        color: BROWN_GREY,
        marginBottom: 0,
        flex: 1
    },
    requeridoMssg: {
        color: RED,
        fontStyle: 'italic',
        marginTop: 2,
        marginBottom: 20
    }
})
