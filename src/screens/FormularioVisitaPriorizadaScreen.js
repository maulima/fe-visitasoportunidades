//Dependency
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
    View
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    limpiarForm,
    obtenerFormVisita,
    obtenerPreguntasFormVisita,
    sobrescribirAtributosFormVisita
} from '../store/actions/formularioVisita'
import {actualizarVisita, clearVisita, crearVisita, obtenerVisita} from '../store/actions/visitas'
import {crearOportunidad, obtenerOportunidad, obtenerOportunidadesPorIds} from '../store/actions/oportunidades'
import {crearRiesgo, obtenerRiesgo, obtenerRiesgosPorIds, obtenerVigenciaRiesgos} from '../store/actions/riesgos'
import {obtenerEmpresas, validarEmpresasEspecialista} from '../store/actions/empresas'
import moment from 'moment'
import _ from 'lodash'

import ModalBox from 'react-native-modalbox'
import testID from '../../custom_node_modules/react-native-testid'
//Screen
import ResumenVisitaScreen from './ResumenVisitaScreen'
import ResumenOportunidadScreen from './ResumenOportunidadScreen'
import ResumenRiesgoScreen from './ResumenRiesgoScreen'
//Components
import ButtonAddNota from '../components/ButtonAddNota'
import Loading from '../components/Loading'
import Unauthorized from '../components/Unauthorized'
import GoBackButton from '../components/GoBackButton'
import SearchModal from '../components/SearchModal'
import ItemListModal from '../components/ItemListModal'
import InputGroup from '../components/InputGroup'
import SimpleTabs from '../components/SimpleTabs'
import DateTimePicker from '../components/DateTimePicker'
import NavBar from '../components/NavBar'
import OportunidadCard from '../components/OportunidadCard'
import RiesgoCard from '../components/RiesgoCard'
import OportunidadCardLock from '../components/OportunidadCardLock'
import RadioHideButtonOportunidad from '../components/RadioHideButtonOportunidad';
//Assets
import {BACKGROUND_COLOR, BLACK, BROWN_GREY, BROWN_LIGHT_GREY, GREEN, GREY, RED, WHITE} from '../styles/Colors'
import {idsArrayParse} from '../utils/ArrayHelper'
import {desformatoRut, formatoRut, invalidDecimal, invalidInteger, montoPuntosMil} from '../utils/StringHelper'
import {TipoBusqueda, TipoPregunta} from '../constants/Data'
import SwitchButton from '../components/SwitchButton'






const mapStateToProps = (state, ownProps) => {
    const {env: {API_ENV}} = process
    const visitaId = ownProps.navigation.getParam('visitaId') || null
    const fromMain = ownProps.navigation.getParam('fromMain')
    const tipoVisita = ownProps.navigation.getParam('tipoVisita')
    const hideEditPrio = ownProps.navigation.getParam('hideEditPrio')  
    return {
        ...(fromMain ? {fromMain} : {}),
        visitaId,
        visita: state.visitas.item,
        oportunidad: state.oportunidades.item,
        riesgo: state.riesgos.item,
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        colaboradores: state.colaboradores.lista,
        empresas: state.empresas.lista,
        isFetchingEmpresa: state.empresas.isFetching,
        isFetchingObtenerPregunta: state.formularioVisita.isFetching,
        isPushingOportunidad: state.oportunidades.isPushing,
        isPushingRiesgo: state.riesgos.isPushing,
        isValidatingEmpresa: state.empresas.isValidating,
        isValidatingApplicability: state.riesgos.isValidatingApplicability,
        hasValidRiesgo: state.riesgos.hasValid,
        isFetchingRiesgo: state.riesgos.isFetching,
        preguntas: state.formularioVisita.preguntas,
        respuestas: state.formularioVisita.respuestas,
        isFetching: state.visitas.isFetching,
        isFetchingOportunidades: state.visitas.isFetchingOportunidades,
        isFetchingRiesgos: state.visitas.isFetchingRiesgos,
        isPushing: state.visitas.isPushing,
        initialFormLoaded: state.formularioVisita.initialFormLoaded,
        hasError: state.visitas.hasError,
        hasErrorOportunidad: state.oportunidades.hasError,
        hasErrorOportunidades: state.visitas.hasErrorOportunidades,
        hasErrorRiesgo: state.riesgos.hasError,
        hasErrorEmpresa: state.empresas.hasError,
        hasErrorRiesgos: state.visitas.hasErrorRiesgos,
        error: state.formularioVisita.errorMessage,
        tipoVisita,
        hideEditPrio
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerFormVisita,
            obtenerPreguntasFormVisita,
            sobrescribirAtributosFormVisita,
            limpiarForm,
            crearVisita,
            actualizarVisita,
            clearVisita,
            obtenerVisita,
            crearOportunidad,
            obtenerOportunidad,
            obtenerRiesgo,
            obtenerVigenciaRiesgos,
            obtenerOportunidadesPorIds,
            obtenerRiesgosPorIds,
            crearRiesgo,
            obtenerEmpresas,
            validarEmpresasEspecialista
        }, dispatch)
    }
}

type Props = {}

class FormularioVisitaPriorizadaScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: `${navigation.getParam('visitaId') ? 'Edición' : 'Nueva'} visita Priorizada`,
        headerLeft: <GoBackButton onPress={() => {
            navigation.goBack()
        }}/>
    })

    state = {
        loading: true,
        saving: false,
        detallesCargados: 0,
        oportunidadesCreadas: 0,
        riesgosCreados: 0,
        form: {
            participantes: [],
            detalle: null,
            visitaDate: moment(),
            rutCliente: null,
            clienteProspecto: false,
            nombreCliente: null,
            grupoEconomico: null,
            riesgos: [],
            oportunidades: [],
            privado: false,
            notas: [],
        },
        resumen: {},
        existenRiesgosVigentes: false,
        rutClienteModalVisible: false,
        grupoEconomicoModalVisible: false,
        visitaDateModalVisible: false,
        resumenModalVisible: false,
        requeridosFaltantes: false,
        alertModalVisible: false,
        isButtonDisabled:false,
        plataform:'',
        selectItem:false,
        isHidden:true,
        validateRadioButton:true,
        hideCardOportunidad:true
    }

    componentWillMount() {
        const {
            visitaId,
            actions: {obtenerFormVisita, obtenerVisita, limpiarForm, clearVisita},
            currentUser: {usuario},
            colaboradores,
            currentUser,
            tipoVisita
        } = this.props
       

        const participante = _.find(colaboradores, (col) => col.usuarioNt === usuario) || {
            nombreColaborador: this.props.currentUser.nombreCompleto,
            usuarioNt: this.props.currentUser.usuario,
            centroCosto: this.props.currentUser.plataforma,
            usuarioNtJefe: _.find(colaboradores, (col) => col.usuarioNt === currentUser.usuario) || ''
        }

        const {nombreColaborador, usuarioNt, centroCosto, usuarioNtJefe} = participante
        const {form} = this.state

        limpiarForm()
     
        if (visitaId) {
            this.setState({cargandoEmpresa: true})
            obtenerVisita({visitaId,tipoVisita})
        } else {
            this.setState({
                form: {
                    ...form,
                    participantes: [{
                        usuarioNombre: nombreColaborador,
                        usuarioNT: usuarioNt,
                        usuarioPlataforma: centroCosto,
                        jefeNT: usuarioNtJefe,
                    }],
                    notas: [{
                        id: '',
                        usuarioCreador: usuario,
                        fechaCreacion: '',
                        contenido: ''
                    }]

                }
            })
             obtenerFormVisita(tipoVisita)
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            actions: {obtenerPreguntasFormVisita, obtenerEmpresas},
            visitaId,
            initialFormLoaded,
            isFetching,
            isFetchingEmpresa,
            isFetchingObtenerPregunta,
            isFetchingOportunidades,
            isFetchingRiesgos,
            isValidatingApplicability,
            isValidatingEmpresa,
            isPushingOportunidad,
            isPushingRiesgo,
            isPushing,
            isFetchingRiesgo,
        } = this.props

        const {loading, saving, detallesCargados, cargandoEmpresa} = this.state

        if (cargandoEmpresa && isFetchingEmpresa && !nextProps.isFetchingEmpresa) {
            this.setState({
                form: {
                    ...this.state.form,
                    ...(nextProps.hasErrorEmpresa ? {
                        clienteProspecto: true
                    } : {
                        macroBanca: _.capitalize(_.first(_.values(nextProps.empresas)).macroBanca),
                        clienteProspecto: false
                    })
                },
                cargandoEmpresa: false
            })
        }

        if (visitaId && isFetching && !nextProps.isFetching) {
            if (nextProps.hasError) {
                this.setState({fatalError: true})
            } else {
                this.setVisitaFormEdition(nextProps.visita)
            }

        } else if (!initialFormLoaded && nextProps.initialFormLoaded) {
            if (visitaId && detallesCargados < _.size(nextProps.visita.detalle)) {
                const respuestaId = nextProps.visita.detalle[detallesCargados].respuestaId
                respuestaId ? obtenerPreguntasFormVisita({respuestaId}) : this.setState({detallesCargados: detallesCargados})
            } else {
                const tabKey = _.find(_.keys(nextProps.preguntas), (k) => nextProps.preguntas[k].tipo === TipoPregunta.TABS)
                const tabTitle = nextProps.preguntas[tabKey].name
                const firstTabValue = _.first(_.keys(nextProps.respuestas[tabKey]))
                const firstTabName = _.first(_.values(nextProps.respuestas[tabKey]) || {}).name

                this.setState({
                    form: {
                        ...this.state.form,
                        [tabTitle]: firstTabValue,
                        [`${tabTitle}Nombre`]: firstTabName
                    }
                })
                obtenerPreguntasFormVisita({respuestaId: firstTabValue})
            }
        } else if (loading && initialFormLoaded && isFetchingObtenerPregunta && !nextProps.isFetchingObtenerPregunta) {
            this.setState({detallesCargados: detallesCargados + 1})
        } else if (saving) {
            if (isPushing && !nextProps.isPushing) {
                this.setState({saving: false, alertModalVisible: true})
            } else if (isPushingOportunidad && !nextProps.isPushingOportunidad) {
                if (!nextProps.hasErrorOportunidad) {
                    const {oportunidad, oportunidad: {oportunidadId}} = nextProps
                    const {resumen: {oportunidadesId}, oportunidadesCreadas, form} = this.state
                    const oportunidades = _.clone(form.oportunidades)
                    const minResumen = {
                        negocio: oportunidad.negocio,
                        ...(oportunidad.producto ? {producto: oportunidad.producto} : {}),
                        nombreEmpresa: oportunidad.nombreEmpresa,
                        rutEmpresa: oportunidad.rutEmpresa,
                        grupoEconomico: oportunidad.grupoEconomico,
                        nombreResponsable: oportunidad.nombreResponsable,
                    }

                    let oportunidadEnFormulario = _.find(oportunidades, (op, i) => {
                        const stop = !op.oportunidadId && _.isEqual(op.resumen, minResumen)

                        if (stop) oportunidades[i] = oportunidad

                        return stop
                    })

                    this.setState({
                        form: {
                            ...form,
                            oportunidades
                        },
                        resumen: {
                            ...this.state.resumen,
                            oportunidadesId: _.concat(oportunidadesId, oportunidadId),
                        },
                        oportunidadesCreadas: oportunidadesCreadas + 1,
                    })
                }
            } else if (isPushingRiesgo && !nextProps.isPushingRiesgo) {
                if (!nextProps.hasErrorRiesgo) {
                    const {riesgo, riesgo: {riesgoId}} = nextProps
                    const {resumen: {riesgosId}, riesgosCreados, form} = this.state
                    const riesgos = _.clone(form.riesgos)

                    let riesgoEnFormulario = _.find(riesgos, (rg, i) => {
                        const stop = !rg.riesgoId

                        if (stop) riesgos[i] = riesgo

                        return stop
                    })

                    this.setState({
                        form: {
                            ...form,
                            riesgos
                        },
                        resumen: {
                            ...this.state.resumen,
                            riesgosId: _.concat(riesgosId, riesgoId),
                        },
                        riesgosCreados: riesgosCreados + 1,
                    })
                }
            }
        }

        if (isFetchingOportunidades && !nextProps.isFetchingOportunidades) {
            if (!nextProps.hasErrorOportunidades) {
                const {form, form: {oportunidades}} = this.state

                this.setState({
                    form: {
                        ...form,
                        oportunidades: nextProps.visita.oportunidades
                    }
                })
            }
        }

        if (isFetchingRiesgos && !nextProps.isFetchingRiesgos) {
            if (!nextProps.hasErrorRiesgos) {
                const {form, form: {riesgos}} = this.state

                this.setState({
                    form: {
                        ...form,
                        riesgos: nextProps.visita.riesgos
                    }
                })
            }
        }

        if (isFetchingRiesgo && !nextProps.isFetchingRiesgo) {
            const {form, modalResumenOpenWait} = this.state
            this.setState({
                form: {
                    ...form,
                    riesgos: [nextProps.riesgo]
                },
                [modalResumenOpenWait]: true
            })
        }

        if (isValidatingApplicability && !nextProps.isValidatingApplicability) {
            if (!nextProps.hasErrorRiesgo) {
                this.setState({existenRiesgosVigentes: nextProps.hasValidRiesgo})
            }
        }

        if (!_.isEmpty(nextProps.visita) && isValidatingEmpresa && !nextProps.isValidatingEmpresa) {
            obtenerEmpresas(this.state.form.rutCliente)
        }

        if(this.props.empresas !== nextProps.empresas){
            const plataform  = this.props.empresas[this.state.form.rutCliente]
            const plataformaEmp = typeof(plataform)
            const platform =  plataformaEmp == 'undefined' ? '' : plataform
            const { plataforma } = platform
            this.setState({
                plataform:plataforma
            })
        }

    }

    handleLoading = () => {
        this.setState({
            loading: !!this.state.loading
        })
    }

    componentWillUpdate(nextProps, nextState) {
        const {actions: {obtenerEmpresas}} = this.props
        const {visitaId} = nextProps
        const {form, form: {rutCliente, riesgos}} = this.state
        const motivoVisita = form['Motivo de la visitaNombre']
        const subdetalleVisita = form['Subdetalle de la visitaNombre']
        const siguienteRutCliente = nextState.form['rutCliente']
        const siguienteMotivoVisita = nextState.form['Motivo de la visitaNombre']
        const siguienteSubdetalleVisita = nextState.form['Subdetalle de la visitaNombre']

        if (visitaId && !_.isEqual(riesgos, nextState.form.riesgos)) {
            this.validarOtrosRiesgosCreados(siguienteRutCliente, siguienteMotivoVisita, siguienteSubdetalleVisita)
        } else {
            if (siguienteRutCliente && siguienteMotivoVisita) {
                if (rutCliente !== siguienteRutCliente || motivoVisita !== siguienteMotivoVisita || subdetalleVisita !== siguienteSubdetalleVisita) {
                    this.validarOtrosRiesgosCreados(siguienteRutCliente, siguienteMotivoVisita, siguienteSubdetalleVisita)
                }
            }
        }

        if (!visitaId && rutCliente !== siguienteRutCliente) {
            this.setState({cargandoEmpresa: true})
            obtenerEmpresas(desformatoRut(siguienteRutCliente))
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {actions: {obtenerPreguntasFormVisita}, initialFormLoaded, visita: {detalle}} = this.props
        const {loading, saving, form: {oportunidades, riesgos}, resumen: {oportunidadesId, riesgosId}, detallesCargados} = this.state

        if (loading) {
            const {visitaId, preguntas} = this.props

            if (visitaId && initialFormLoaded) {
                const {visita: {detalle}} = this.props

                if (!_.isEmpty(preguntas) && _.size(preguntas) === _.size(detalle)) {
                    this.setState({loading: false})
                } else if (prevState.detallesCargados < detallesCargados && detallesCargados < _.size(detalle)) {
                    const respuestaId = detalle[detallesCargados].respuestaId

                    respuestaId ? obtenerPreguntasFormVisita({respuestaId}) : this.setState({detallesCargados: detallesCargados + 1})
                }
            } else {
                if (_.size(preguntas) === 3) {
                    this.setState({loading: false})
                }
            }
        } else if (saving) {
            const nuevaOportunidadCreada = _.size(oportunidadesId) > _.size(prevState.resumen.oportunidadesId)
            const nuevoRiesgoCreado = _.size(riesgosId) > _.size(prevState.resumen.riesgosId)
            const sinOportunidadesPorCrear = _.size(oportunidadesId) === _.size(oportunidades)
            const sinRiesgosPorCrear = _.size(riesgosId) === _.size(riesgos)

            if (nuevaOportunidadCreada || nuevoRiesgoCreado) {
                if (sinOportunidadesPorCrear && sinRiesgosPorCrear) {
                    this.onSaveVisita()
                } else if (!loading) {
                    if (nuevaOportunidadCreada && !sinOportunidadesPorCrear) this.onSaveOportunidades()
                    if (nuevoRiesgoCreado && !sinRiesgosPorCrear) this.onSaveRiesgos()
                }
            }
        } else {
            if (_.size(this.props.preguntas) < _.size(prevProps.preguntas)) {
                this.limpiarAtributos(prevProps.preguntas)
            }
        }
    }

    obtenerResumenOportunidad = (resumen, resumenOportunidadModalName) => {
        const {actions: {obtenerOportunidad}, currentUser: {plataforma, usuario, codOficina}, colaboradores} = this.props
        const {oportunidadId} = resumen
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        this.setState({[resumenOportunidadModalName]: true})
        if (oportunidadId) {
            obtenerOportunidad({
                oportunidadId: oportunidadId,
                plataforma,
                usuarioNT: usuario,
                jefeNT: jefeNTCreador.usuarioNtJefe,
                codOficina: codOficina,
            })
        }
    }

    obtenerResumenRiesgo = (resumen, resumenRiesgoModalName) => {

        const {actions: {obtenerRiesgo}} = this.props
        const {riesgoId} = resumen

        if (riesgoId) {
            this.setState({modalResumenOpenWait: resumenRiesgoModalName})
            obtenerRiesgo({riesgoId: riesgoId})

        } else {
            this.setState({[resumenRiesgoModalName]: true})
        }
    }

    setVisitaFormEdition = (visita) => {
        const {actions: {obtenerFormVisita, obtenerOportunidadesPorIds, obtenerRiesgosPorIds},
            currentUser,
            colaboradores,
            tipoVisita
        } = this.props
        const {form} = this.state
    
        const {
            usuarioNTParticipantes, detalle,
            resumen: {nombreEmpresa, rutEmpresa, grupoEconomico, fechaVisita}, oportunidadesId, riesgosId, privado, usuarioNTCreador, notas
        } = visita
        const participantes = []
        const respuestasForm = {}
        
        _.map(usuarioNTParticipantes, (participante) => {
            participantes.push({
                usuarioNombre: participante.usuarioNombre,
                usuarioNT: participante.usuarioNT,
                usuarioPlataforma: participante.usuarioPlataforma,
                jefeNT: participante.usuarioNtJefe,
            })

            return participante
        })

        _.map(detalle, (dt) => {
            if (dt.respuestaId) {
                respuestasForm[dt.pregunta] = `${dt.respuestaId}`
                respuestasForm[`${dt.pregunta}Nombre`] = dt.respuesta
            } else {
                respuestasForm[dt.pregunta] = dt.respuesta
            }

            return dt
        })

        const notasEdit = _.isEmpty(notas) ? [{
            id: '',
            usuarioCreador: currentUser.usuario,
            fechaCreacion: '',
            contenido: ''
        }] : [...visita.notas]
       

        this.setState({
            form: {
                ...form,
                ...respuestasForm,
                participantes,
                grupoEconomico,
                nombreCliente: nombreEmpresa,
                rutCliente: rutEmpresa,
                visitaDate: moment(),
                privado,
                notas: notasEdit,
            },
            resumen: {
                oportunidadesId,
                riesgosId
            }
        })
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === currentUser.usuario)
        if (oportunidadesId) obtenerOportunidadesPorIds({
            usuarioNT: currentUser.usuario,
            oportunidadIds: oportunidadesId,
            plataforma: currentUser.plataforma,
            jefeNT: jefeNTCreador.usuarioNtJefe,
        })
        //if (riesgosId) obtenerRiesgosPorIds(riesgosId)
        
        
        obtenerFormVisita(tipoVisita)
    }

    limpiarAtributos = (prevPreguntas) => {
        const {preguntas} = this.props
        const form = _.clone(this.state.form)
        const {SIMPLE, BOOLEAN} = TipoPregunta

        _.filter(_.values(prevPreguntas), (prevtPt) => {
            const borrar = !_.find(_.values(preguntas), (pt) => pt.name === prevtPt.name)

            if (borrar) {
                delete form[prevtPt.name]
                delete form[`${prevtPt.name}Nombre`]
            }

            return borrar
        })

        this.setState({form})
    }

    agregarCliente = () => {
        const {form, form: {participantes}} = this.state

        this.setState({
            form: {
                ...form,
                participantes: _.concat(participantes, {
                    responsable: '',
                    usuarioNTResponsable: ''
                })
            }
        })
    }

    goToFormularioRiesgo = () => {
        const {navigation: {navigate}} = this.props
        const {form: {rutCliente, nombreCliente, grupoEconomico, macrobancaEmpresa}} = this.state
        let clienteVisita

        if (grupoEconomico && !rutCliente) {
            const cliente = _.find(empresas, (ep) => _.lowerCase(ep.nombreGrupo) === _.lowerCase(grupoEconomico))

            clienteVisita = {
                ...(cliente ? {
                    rutCliente: `${cliente.rut}${cliente.digitoVerificador}`,
                    nombreCliente: cliente.nombreEmpresa,
                    grupoEconomico
                } : {}),
            }
        } else {
            clienteVisita = {rutCliente, nombreCliente, grupoEconomico, macrobancaEmpresa}
        }

        navigate('FormularioRiesgo', {fromVisita: true, clienteVisita, addToVisita: this.onSetRiesgo})
    }

    goToFormularioOportunidad = () => {
        const {navigation: {navigate}, empresas} = this.props
        const {form: {rutCliente, nombreCliente, grupoEconomico}} = this.state
        let clienteVisita

        if (grupoEconomico && !rutCliente) {
            const cliente = _.find(empresas, (ep) => _.lowerCase(ep.nombreGrupo) === _.lowerCase(grupoEconomico))

            clienteVisita = {
                ...(cliente ? {
                    rutCliente: `${cliente.rut}${cliente.digitoVerificador}`,
                    nombreCliente: cliente.nombreEmpresa,
                    grupoEconomico
                } : {}),
            }
        } else {
            clienteVisita = {rutCliente, nombreCliente, grupoEconomico}
        }
        this.setState({
            requeridosFaltantes:false
        })
        navigate('FormularioOportunidad', {fromVisita: true, clienteVisita, addToVisita: this.onSetOportunidad})
    }

    onSetSimpleInput = (value, pregunta) => {
        const {respuestas, actions: {obtenerPreguntasFormVisita}} = this.props
        const {form} = this.state
        const atributo = pregunta.name
        const nombreRespuesta = (respuestas[pregunta.id][value] || {}).name

        this.setState({
            form: {
                ...form,
                [atributo]: value,
                [`${atributo}Nombre`]: nombreRespuesta
            },
            [`${atributo}ModalVisible`]: false
        })

        obtenerPreguntasFormVisita({respuestaId: value})
    }

    onSetLibreInput = (value, pregunta) => {
        const atributo = pregunta.name

        this.setState({
            form: {
                ...this.state.form,
                // [atributo]: value.trim(),
                [atributo]: value,
            }
        })
    }

    onSetEndDatetime = (date) => {
        this.setState(state => {
            return {
                visitaDateModalVisible: false,
                form: {
                    ...state.form,
                    visitaDate: moment(date)
                }
            }
        })
    }

    onSetEmpresaGrupoEconomico = (value) => {
        const {rut, digitoVerificador, nombreEmpresa, nombreGrupo, macroBanca} = value

        this.setState(state => {
            return {
                grupoEconomicoModalVisible: false,
                form: {
                    ...state.form,
                    rutCliente: `${rut}${digitoVerificador}`,
                    nombreCliente: nombreEmpresa,
                    grupoEconomico: _.capitalize(nombreGrupo),
                    macroBanca: _.capitalize(macroBanca)
                }
            }
        })
    }

    onSetEmpresa = (value) => {
        this.setState(state => {
            return {
                rutClienteModalVisible: false,
                form: {
                    ...state.form,
                    rutCliente: `${value.rut}${value.digitoVerificador}`,
                    nombreCliente: value.nombreEmpresa,
                    grupoEconomico: _.capitalize(value.nombreGrupo),
                    macrobancaEmpresa: _.capitalize(value.macroBanca)
                }
            }
        })
    }

    onSetParticipante = (value, i) => {
        const {form} = this.state
        const {nombreColaborador, usuarioNt, centroCosto, usuarioNtJefe} = value
        const participantes = _.clone(form.participantes)

        const participante = {
            usuarioNombre: _.trim(nombreColaborador),
            usuarioNT: _.trim(usuarioNt),
            usuarioPlataforma: _.trim(centroCosto),
            jefeNT: usuarioNtJefe,
        }

        if (!_.find(participantes, (pt) => pt.usuarioNT === participante.usuarioNT)) {
            participantes[i] = participante

            this.setState({
                [`participante[${i}]ModalVisible`]: false,
                form: {
                    ...form,
                    participantes
                }
            })
        } else {
            this.setState({[`participante[${i}]ModalVisible`]: false})
        }
    }

    onSetRiesgo = (riesgo) => {
        const {form, form: {riesgos}} = this.state

        this.setState({form: {...form, riesgos: _.concat(riesgos, riesgo)}})
    }

    onSetOportunidad = (oportunidad) => {
        const {form, form: {oportunidades}} = this.state

        this.setState({form: {...form, oportunidades: _.concat(oportunidades, oportunidad)}})
    }

    onSetprivado = (estado) => {
        this.setState({
            form: {
                ...this.state.form,
                privado: estado,
            }
        })
    }

    validarRiesgosRequeridos = () => {
        const {currentUser} = this.props
        const {form, form: {riesgos}} = this.state
        const motivoVisita = form['Motivo de la visitaNombre']
        const subdetalleVisita = form['Subdetalle de la visitaNombre']
        switch (motivoVisita) {
            case 'Venta':
                switch (subdetalleVisita) {
                    case 'Vinculación':
                    case 'Cierre de Negocio':
                        const limitDays = 90

                        if (!_.find(riesgos, (riesgo) => riesgo.usuarioNTCreador === currentUser.usuario.trim())) {
                            return limitDays
                        } else {
                            const riesgosDeUsuario = _.filter(riesgos, (riesgo) => riesgo.usuarioNTCreador === currentUser.usuario.trim())
                            const today = new Date(moment(new Date()).format())

                            if (!!_.find(riesgosDeUsuario, (riesgo) => new Date(moment(riesgo.fechaRiesgo).add(limitDays, 'days').format()) < today)) {
                                return limitDays
                            }
                        }
                        break
                    default:

                }

                break
            case 'Riesgo':
                const limitDays = 30

                if (!_.find(riesgos, (riesgo) => riesgo.usuarioNTCreador === currentUser.usuario.trim())) {
                    return limitDays

                } else {
                    const riesgosDeUsuario = _.filter(riesgos, (riesgo) => riesgo.usuarioNTCreador === currentUser.usuario.trim())
                    const today = new Date(moment(new Date()).format())

                    if (!!_.find(riesgosDeUsuario, (riesgo) => new Date(moment(riesgo.fechaRiesgo).add(limitDays, 'days').format()) < today)) {
                        return limitDays
                    }
                }

                break
            default:

        }

        return false
    }

    validarOportunidadesRequeridas = () => {
        const {form} = this.state
        const subdetalleVisita = form['Subdetalle de la visitaNombre']

        return !!subdetalleVisita && subdetalleVisita !== 'Cierre de Negocio' && _.isEmpty(form['oportunidades'])
    }

    validarOtrosRiesgosCreados = (rutCliente, motivoVisita, subdetalleVisita) => {
        const {actions: {obtenerVigenciaRiesgos}, currentUser} = this.props

        switch (motivoVisita) {
            case 'Venta':
                switch (subdetalleVisita) {
                    case 'Vinculación':
                    case 'Cierre de Negocio':
                        const limitDays = 90

                        obtenerVigenciaRiesgos({
                            clienteId: rutCliente,
                            cantidadDias: 90
                        })
                        break
                    default:

                }

                break
            case 'Riesgo':
                const limitDays = 30

                obtenerVigenciaRiesgos({
                    clienteId: rutCliente,
                    cantidadDias: 30
                })
                break
            default:

        }

        return false
    }

    puedeCrearRiesgo = () => {
        const {env: {API_ENV}} = process
        const {form: {macroBanca}} = this.state
        const {currentUser: {permisos: {puedeCrearRiesgo}}} = this.props

        return (API_ENV !== 'qaApiConnect') ||
            (puedeCrearRiesgo &&
                (macroBanca === 'Empresas' || macroBanca === 'Grandesempresas'))
    }

    validationForm = (validarRequeridos = false) => {
        const {preguntas} = this.props
        const {form, existenRiesgosVigentes,selectItem} = this.state
        let validation = 0
        

        if (!form['rutCliente'] && !form['grupoEconomico']) validation ++

        if (!existenRiesgosVigentes && this.puedeCrearRiesgo() && this.validarRiesgosRequeridos()) {
            validation ++
        }

        /*if (this.validarOportunidadesRequeridas()) {
            validation ++
        }*/

        _.values(preguntas).map(pregunta => {
            const {name, obligatorio} = pregunta

            if (obligatorio) {
                if (!form[name]) {
                    validation ++
                } else {
                    switch (pregunta.tipo) {
                        case TipoPregunta.MONEDA:
                        case TipoPregunta.ENTERO:
                            if (invalidInteger(form[name])) validation ++
                            break
                        case TipoPregunta.DECIMAL:
                            if (invalidDecimal(form[name])) validation ++
                            break
                        default:
                    }
                }
            }
        })

        if(form['oportunidades'].length == 0){
            validation++
         }else{
             validation = 0
         }
         
         if(selectItem === true){
            validation-- 
        }

        if (validation > 0) {
            if (validarRequeridos) setTimeout(function () {
                this.setState({requeridosFaltantes: true})
            }.bind(this), 200)
            return false
        } else {
            if (validarRequeridos) setTimeout(function () {
                this.setState({requeridosFaltantes: false})
            }.bind(this), 200)
            return true
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
                    Visita guardada exitosamente
                </Text>
                <View style={styles.modalContainerButtons}>
                    <TouchableOpacity onPress={() => this.goBackHome()}
                                      style={[styles.buttonModal, styles.buttonSolid]}>
                        <Text style={styles.textModalSolidButton}>Volver</Text>
                    </TouchableOpacity>
                </View>
            </ModalBox>
        )
    }

    goBackHome = () => {
        const {actions: {clearVisita}, navigation: {goBack, navigate}, fromMain} = this.props
        navigate('Main')
        // fromMain ? navigate('Main') : navigate('Visitas')
    }

    goNuevaVisita = () => {
        const {navigation: {replace,navigate}, fromMain} = this.props

        replace('FormularioVisitaPriorizada', {fromMain})
    }

    onCreateSummaryVisita = () => {
        const {currentUser, visitaId, colaboradores, visita: {usuarioNTCreador,},tipoVisita} = this.props
        const {resumen: {oportunidadesId, riesgosId},plataform} = this.state
        const form = {...this.state.form}
        const preguntas = {...this.props.preguntas}
        const plataformaCreador = currentUser.plataforma
        
        //const plataformEmpresa = plataform === undefined ? null : plataform
        console.log(plataform)
        const usuarioNTParticipantes = _.map(_.filter(form['participantes'], (pt) => !!pt.usuarioNT), (pt) => {
            return {
                usuarioNT: pt.usuarioNT,
                usuarioNombre: pt.usuarioNombre,
                usuarioPlataforma: pt.usuarioPlataforma,
                jefeNT: pt.jefeNT,
            }
        })

        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === currentUser.usuario)
        const paramsForm = {}
        const respuestasId = []
        const resumen = {}
        const detalle = []

        const {ENTERO, DECIMAL, MONEDA, LIBRE} = TipoPregunta

        const fechaCreacion = visitaId === null ?
            moment(new Date()).format() :
            moment(this.props.visita.resumen.fechaCreacion).format()

        let visitaDate = moment(form['visitaDate']).format('YYYY-MM-DDTHH:mm:ssZ')

        Object.keys(form).map(st => {
            Object.keys(preguntas || {}).map(key => {
                const {tipo} = preguntas[key]

                if (st === preguntas[key].name) {
                    if (!_.includes([ENTERO, MONEDA, DECIMAL, LIBRE], tipo)) {
                        respuestasId.push(Number(form[st]))
                    }

                    if (st === 'Motivo de la visita') Object.assign(resumen, {tituloVisita: form[`${st}Nombre`]})

                    detalle.push({
                        pregunta: preguntas[key].name,
                        preguntaId: Number(key), ...(tipo === LIBRE ?
                                {respuesta: form[st]}
                                : tipo === ENTERO || tipo === MONEDA ?
                                    {respuesta: montoEntero(form[st])}
                                    : tipo === DECIMAL ?
                                        {respuesta: montoDecimal(form[st])}
                                        :
                                        {respuesta: form[`${st}Nombre`], respuestaId: Number(form[st])}
                        )
                    })
                }
            })
        })
        Object.assign(paramsForm, {plataformaCreador})
        Object.assign(paramsForm, {usuarioNTParticipantes})
        Object.assign(paramsForm, {id: visitaId ? String(visitaId) : ''})
        Object.assign(paramsForm, {usuarioNTCreador: visitaId ? usuarioNTCreador : currentUser.usuario.trim()})
        Object.assign(paramsForm, {clienteId: form['rutCliente']})
        Object.assign(paramsForm, {fechaVisita: visitaDate})
        Object.assign(paramsForm, {respuestasId: idsArrayParse(respuestasId)})
        Object.assign(paramsForm, {oportunidadesId: oportunidadesId || []})
        Object.assign(paramsForm, {riesgosId: riesgosId || []})
        Object.assign(resumen, {nombreEmpresa: form['nombreCliente']})
        Object.assign(resumen, {rutEmpresa: desformatoRut(form['rutCliente'])})
        Object.assign(resumen, {grupoEconomico: form['grupoEconomico']})
        Object.assign(resumen, {fechaVisita: visitaDate})
        Object.assign(resumen, {fechaCreacion})
        Object.assign(resumen, {macrobancaEmpresa: form['macrobancaEmpresa']})
        Object.assign(resumen, {privado: form['privado']})
        Object.assign(resumen, {tipoVisita:tipoVisita})
        Object.assign(paramsForm, {privado: form['privado']})


        Object.assign(paramsForm, {jefeNTCreador: visitaId ? jefeNTCreador.usuarioNtJefe : this.props.visita.jefeNTCreador })
        // Object.assign(paramsForm, {jefeNTCreador: jefeNTCreador.usuarioNtJefe})

        Object.assign(resumen, {
            usuarioNombreParticipantes: _.compact(_.map(form['participantes'], (participante) => _.trim(participante.usuarioNombre) || null))
        })

        Object.assign(paramsForm, {resumen: resumen})
        Object.assign(paramsForm, {detalle: detalle})

        Object.assign(paramsForm, {
            notas: _.compact(form['notas'].map((nota) => {
                return (
                    nota.contenido.trim().length > 0 && {
                        ...nota,
                        fechaCreacion: nota.fechaCreacion === '' ? moment(new Date()).format() : nota.fechaCreacion
                    }
                )
            }))
        })
        
        this.setState({
            resumen: paramsForm,
            resumenModalVisible: true
        })

    }

    onSaveOportunidades = () => {
        const {actions: {crearOportunidad}} = this.props
        const {form: {oportunidades}} = this.state

        this.setState({saving: true})

        _.find(oportunidades, (oportunidad) => {
            if (oportunidad.oportunidadId) {
                return false
            } else {
                crearOportunidad(oportunidad)

                return true
            }
        })
    }

    onSaveRiesgos = () => {
        const {actions: {crearRiesgo}} = this.props
        const {form: {riesgos}} = this.state

        this.setState({saving: true})

        _.find(riesgos, (riesgo) => {
            if (riesgo.riesgoId) {
                return false
            } else {
                crearRiesgo(riesgo)

                return true
            }
        })
    }

    onSaveVisita = () => {
        const {actions: {crearVisita, actualizarVisita}, visitaId} = this.props
        const {resumen} = this.state

        this.setState({saving: true})

        if (visitaId) {
            actualizarVisita(resumen)
        } else {
            crearVisita(resumen)
        }
    }

    guardarVisita = () => {
        const {form: {oportunidades, riesgos}, resumen: {oportunidadesId, riesgosId}} = this.state

        const oportunidadesPorCrear = _.size(oportunidades) > _.size(oportunidadesId)
        const riesgosPorCrear = _.size(riesgos) > _.size(riesgosId)

        if (!oportunidadesPorCrear && !riesgosPorCrear) {
            this.onSaveVisita()
        } else {
            if (oportunidadesPorCrear) this.onSaveOportunidades()
            if (riesgosPorCrear) this.onSaveRiesgos()
        }

        this.setState({
            isButtonDisabled:true
        })

        setTimeout(() => this.setState({ isButtonDisabled: false }), 5000) 
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

    renderParticipanteInput = (participante, i) => {

        const {visitaId,hideEditPrio} = this.props
        const {usuarioNombre} = participante
        const modalName = `participante[${i}]ModalVisible`
        const participanteModalVisible = !!this.state[modalName]
        const inputStyle = [styles.inputContainer]
        const index = i + 1
        //if (visitaId) inputStyle.push(styles.inputContainerDisabled)
        if(hideEditPrio) inputStyle.push(styles.inputContainerDisabled)

        return (
            <View key={i} style={inputStyle}>
                <Modal animationType={'slide'} transparent={false} visible={participanteModalVisible}
                       onRequestClose={() => {
                       }}>
                    <SearchModal
                        title='Participante'
                        type={TipoBusqueda.RESPONSABLE}
                        getValue={(value) => this.onSetParticipante(value, i)}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({[modalName]: false})
                        }}/>}/>
                </Modal>
                <TouchableOpacity onPress={() => hideEditPrio ? null : visitaId ? this.setState({[modalName] : true}):null}>
                    <Text {...testID({
                        id: `participanteTextBox`,
                        label: `Contenedor de texto de participante`
                    })}
                          style={styles.inputTitle}
                    >
                        Participante visita:
                    </Text>
                    <View style={styles.itemContainer}
                          {...testID({
                              id: `participante${index}SimpleInput`,
                              label: `Contenedor de selector de participante ${index}`
                          })}
                    >
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `participante${index}TextBox`,
                                  label: `Contenedor de selector de participante ${index}`
                              })}
                        >
                            {usuarioNombre || 'Participante visita'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderSimpleInput = (key, pID) => {
        const {preguntas, visitaId,hideEditPrio} = this.props
        const {form, requeridosFaltantes} = this.state
        const pregunta = preguntas[key]
        const respuestas = this.props.respuestas[key]
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
        if (hideEditPrio) inputStyle.push(styles.inputContainerDisabled)
   
        if (tipo === TipoPregunta.SIMPLE) {
            //Preguntas tipo seleccion
            return (
                <View key={key}>
                    <View style={inputStyle}>
                        {/*Modal con las respuestas a seleccionar*/}
                        <Modal animationType={'slide'} transparent={false} visible={modalVisible}
                               onRequestClose={() => {
                               }}>
                            <ItemListModal
                                list={respuestas}
                                saveSelection={(value) => this.onSetSimpleInput(value, {...pregunta, id: key})}
                                title={name}
                                pID={pID}
                                headerLeft={<GoBackButton onPress={() => {
                                    this.setState({[tituloModal]: false})
                                }}/>}
                                type={'ANY'}
                                defaultValue={actualRespuesta}/>
                        </Modal>
                        {/*Boton que abre el modal con las respuestas de la pregunta*/}
                        {name === 'Gestión de la visita' ? <TouchableOpacity onPress={() => hideEditPrio ? null : this.setState({[tituloModal]: true}) }
                                          {...testID({
                                              id: `${pID}TextBoxButton`,
                                              label: `Contenedor de boton de ${name}`
                                          })}
                        >
                            {actualRespuestaNombre ? <Text style={inputTitleStyle}>{`${tituloInput}:`}</Text> : null}
                            <View style={styles.itemContainer}>
                                <Text style={inputTextStyle}
                                      {...testID({
                                          id: `${pID}TextBox`,
                                          label: `Contenedor de texto de ${name}`
                                      })}
                                >
                                    {actualRespuestaNombre || tituloInput}
                                </Text>
                                <Image style={{marginRight: 10}}
                                       source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                            </View>
                        </TouchableOpacity>:
                        <View style={styles.inputContainerDisabled}>
                            <TouchableOpacity onPress={() => visitaId ? null : this.setState({[tituloModal]: true}) }
                                          {...testID({
                                              id: `${pID}TextBoxButton`,
                                              label: `Contenedor de boton de ${name}`
                                          })}
                        >
                            {actualRespuestaNombre ? <Text style={inputTitleStyle}>{`${tituloInput}:`}</Text> : null}
                            <View style={styles.itemContainer}>
                                <Text style={inputTextStyle}
                                      {...testID({
                                          id: `${pID}TextBox`,
                                          label: `Contenedor de texto de ${name}`
                                      })}
                                >
                                    {actualRespuestaNombre || tituloInput}
                                </Text>
                                <Image style={{marginRight: 10}}
                                       source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                            </View>
                        </TouchableOpacity></View>}
                    </View>

                    {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
                </View>
            )
        } else {
            // preguntas estilo Tabs
            return (
                <View key={key} style={[{marginBottom: 30}].concat(visitaId ? [styles.inputContainerDisabled] : [])}>
                    <Text style={styles.titleMotivo}
                          {...testID({
                              id: `${pID}TextBox`,
                              label: `Contenedor de texto de ${name}`
                          })}
                    >
                        {`${tituloInput}:`}
                    </Text>
                    <SimpleTabs editable={!visitaId}
                                pID={pID}
                                list={respuestas}
                                value={actualRespuesta}
                                onSetSimpleTabsInput={this.onSetSimpleInput}
                                responseData={{...pregunta, id: key}}/>
                </View>
            )
        }
    }

    renderLibreInput = (key, pID) => {
        const {preguntas, visitaId} = this.props
        const {form, requeridosFaltantes} = this.state
        const pregunta = preguntas[key]
        const {name, obligatorio, tipo} = pregunta
        const respuesta = form[name]
        const {MONEDA, ENTERO, DECIMAL} = TipoPregunta
        const keyboardType = tipo === DECIMAL ? 'decimal-pad' : tipo === ENTERO || tipo === MONEDA ? 'numberl-pad' : 'default'

        const maxLength = 300
        const requeridoFaltante = obligatorio && requeridosFaltantes && !respuesta

        let inputStyle
        let inputTitleStyle
        let inputTextStyle
        let maxLengthStyle

        if (requeridoFaltante) {
            inputTextStyle = [styles.inputText]
            inputTitleStyle = [styles.inputTitle, styles.inputTitleRequired]
            inputStyle = [styles.inputContainer, styles.inputContainerRequired]
            maxLengthStyle = [styles.maxLength]
        } else {
            inputTextStyle = [styles.inputText]
            inputTitleStyle = [styles.inputTitle]
            inputStyle = [styles.inputContainer]
            maxLengthStyle = [styles.maxLength, {marginTop: - 40}]
        }

        //if (visitaId) inputStyle.push(styles.inputContainerDisabled)

        return (
            <View key={key}>
                <View style={inputStyle}>
                    <Text style={inputTitleStyle}>{`${name}${obligatorio ? '*' : ':'}`}</Text>
                    <InputGroup
                        testID={testID({
                            id: `${pID}Input`,
                            label: `Contenedor de input de ${name}`
                        })}
                        editable={visitaId}
                        secureTextEntry={false}
                        onChangeText={value => {
                            this.onSetLibreInput(value, pregunta)
                        }}
                        onBlur={() => {
                        }}
                        placeHolderText={name}
                        placeholderTextColor={BROWN_LIGHT_GREY}
                        maxLength={maxLength}
                        autoCapitalize="none"
                        keyboardType={keyboardType}
                        style={inputTextStyle}
                        leftContent={[]}
                        rightContent={[]}
                        value={respuesta}
                    />
                </View>

                <Text style={maxLengthStyle}
                      {...testID({
                          id: `${pID}TextBox`,
                          label: `Contenedor de texto de ${name}`
                      })}
                >
                    {`${_.size(respuesta)}/${maxLength}`}
                </Text>
                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderVisitaDatePickerInput = () => {
        //boton que abre el datePicker de visitas
        const {visitaId,hideEditPrio} = this.props
        const {form: {visitaDate}, visitaDateModalVisible} = this.state
        const inputStyle = [styles.inputContainer]
        //if (visitaId) inputStyle.push(styles.inputContainerDisabled)

        return (
            <View style={inputStyle}>
                {
                    Platform.OS === 'ios'
                        ? <Modal animationType={'slide'} transparent={true} visible={visitaDateModalVisible}
                                 onRequestClose={this.onSetEndDatetime}>
                           <DateTimePicker
                                defaultDate={new Date(visitaDate)}
                                onSave={this.onSetEndDatetime}
                                isVisible={visitaDateModalVisible}
                                onCancel={this.onSetEndDatetime}/>
                        </Modal>
                        : <DateTimePicker
                            defaultDate={new Date(visitaDate)}
                            onSave={this.onSetEndDatetime}
                            isVisible={visitaDateModalVisible}
                            onCancel={this.onSetEndDatetime}/>
                }

                <TouchableOpacity onPress={() => {
                    visitaId ? this.setState({visitaDateModalVisible: true}) : null
                }}
                                  {...testID({
                                      id: `FechaVisitaButton`,
                                      label: `Contenedor de boton fecha de visita`
                                  })}
                disabled={hideEditPrio ? true : false}>
                    {visitaDate ? <Text style={styles.inputTitle}>Fecha visita*:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `FechaVisitaTextBox`,
                                  label: `Contenedor de texto fecha de visita`
                              })}
                        >
                           {visitaDate ? visitaDate.format('dddd, DD MMMM YYYY') : 'Fecha cierre oportunidad'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/calendar_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View> 
        )
    }

    renderRutClienteInput = () => {
        const {visitaId} = this.props
        const {rutClienteModalVisible, form: {rutCliente, grupoEconomico}, requeridosFaltantes} = this.state
        const obligatorio = !grupoEconomico
        const requeridoFaltante = obligatorio && requeridosFaltantes && !rutCliente

        const inputStyle = [styles.inputContainer].concat(requeridoFaltante ? styles.inputContainerRequired : [])
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const inputTextStyle = [styles.inputText].concat(requeridoFaltante ? styles.inputTextRequired : [])

        if (visitaId) inputStyle.push(styles.inputContainerDisabled)

        return (
            <View {...testID({
                id: `RutClienteVisitaInput`,
                label: `Contenedor de rut`
            })}
            >
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
                            }}
                            />}/>
                    </Modal>
                    <TouchableOpacity onPress={() => visitaId ? null : this.setState({rutClienteModalVisible: true})}
                                      {...testID({
                                          id: `RutClienteVisitadButton`,
                                          label: `Boton rut cliente de visita`
                                      })}
                    >
                        {rutCliente ? <Text style={inputTitleStyle}
                                            {...testID({
                                                id: `RutClienteVisitaLabel`,
                                                label: `Contenedor de label de rut`
                                            })}
                        >
                            RUT cliente*:
                        </Text> : null}
                        <View style={styles.itemContainer}>
                            <Text style={inputTextStyle}
                                  {...testID({
                                      id: `RutClienteVisitaTextBox`,
                                      label: `Contenedor de texto de rut`
                                  })}
                            >
                                {rutCliente ? formatoRut(rutCliente) : `RUT cliente${obligatorio ? '*' : ':'}`}
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
        const {visitaId} = this.props
        const {grupoEconomicoModalVisible, form: {grupoEconomico, rutCliente}, requeridosFaltantes} = this.state
        const obligatorio = !rutCliente
        const requeridoFaltante = obligatorio && requeridosFaltantes && !grupoEconomico

        const inputStyle = [styles.inputContainer].concat(requeridoFaltante ? styles.inputContainerRequired : [])
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const inputTextStyle = [styles.inputText].concat(requeridoFaltante ? styles.inputTextRequired : [])

        if (visitaId) inputStyle.push(styles.inputContainerDisabled)

        return (
            <View {...testID({
                id: `GrupoEconomicoVisitaInput`,
                label: `Contenedor de input de grupo economico`
            })}
            >
                <View style={inputStyle}>
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
                        onPress={() => visitaId ? null : this.setState({rutClienteModalVisible: true})}>
                        {grupoEconomico ?
                            <Text style={inputTitleStyle}
                                  {...testID({
                                      id: `GrupoEconomicoVisitaLabel`,
                                      label: `Contenedor de label de grupo economico`
                                  })}
                            >
                                Grupo económico*:
                            </Text> : null}
                        <View style={styles.itemContainer}>
                            <Text style={inputTextStyle}
                                  {...testID({
                                      id: `GrupoEconomicoVisitaTextBox`,
                                      label: `Contenedor de texto de grupo economico`
                                  })}
                            >
                                {grupoEconomico ? grupoEconomico : `Grupo económico${obligatorio ? '*' : ':'}`}
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

    renderResumenVisita = () => {
        const {
            resumenModalVisible,
            saving,
            form,
            form: {riesgos, oportunidades, participantes, rutCliente, nombreCliente, grupoEconomico, privado},
            resumen: {usuarioNTCreador, fechaVisita, notas},
            isButtonDisabled,
            selectItem
        } = this.state
        const {tipoVisita} = this.props

        const oportunidadCards = selectItem === false ? oportunidades : ''

        const resumen = {
            usuarioNTCreador,
            fechaVisita,
            participantes,
            origenVisita: form['Origen de la visitaNombre'],
            motivoVisita: form['Motivo de la visitaNombre'],
            subdetalleVisita: form['Subdetalle de la visitaNombre'],
            detalleOrigen: form['Detalle Origen'],
            gestionVisita: form['Gestión de la visitaNombre'],
            rutCliente,
            nombreCliente,
            grupoEconomico,
            riesgos,
            oportunidades:oportunidadCards,
            notas,
            privado,
            fechaCreacion: this.state.resumen.resumen !== undefined ? this.state.resumen.resumen.fechaCreacion : fechaVisita,
        }


        return (
            <Modal animationType={'slide'} transparent={false} visible={resumenModalVisible} onRequestClose={() => {
            }}>
                <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR, paddingTop: 15}}>
                    <NavBar
                        title="Resumen Visita"
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({resumenModalVisible: false})
                        }}/>}
                    />
                    <ScrollView>
                        <ResumenVisitaScreen title="Resumen Visita" visita={resumen} tipoVisita={tipoVisita}
                                             navigation={this.props.navigation}/>
                    </ScrollView>
                    <TouchableOpacity onPress={this.guardarVisita} style={styles.buttonsContainer}
                                      {...testID({
                                          id: `GuardarVisitaButton`,
                                          label: `boton para guardar la visita despues de ver el resumen`
                                      })}
                                      disabled={isButtonDisabled}>
                        <Text style={styles.buttonText}>Guardar</Text>
                        {saving && <ActivityIndicator size="small" color="white"/>}
                    </TouchableOpacity>
                </View>

                {this.renderAlertModal()}
            </Modal>
        )
    }

    renderFormInput = (pregunta, key, index) => {
        const pID = `P${index}VISITA`

        switch (pregunta.tipo) {
            case TipoPregunta.SIMPLE:
            case TipoPregunta.TABS:
                return this.renderSimpleInput(key, pID)
            case TipoPregunta.LIBRE:
            case TipoPregunta.ENTERO:
            case TipoPregunta.DECIMAL:
            case TipoPregunta.MONEDA:
                return this.renderLibreInput(key, pID)
            default:
        }
    }

    renderCreador = () => {
        const {visita, visitaId, currentUser} = this.props
        if (visitaId) {
            return {
                nombreCreador: visita.usuarioNTCreador,
                fechaVisita: moment(visita.resumen.fechaCreacion, 'YYYY-MM-DD HH:mm:ss Z').format('YYYY-MM-DD HH:mm:ss').replace('00:00:00', ''),
            }
        } else {
            return {
                nombreCreador: currentUser.nombreCompleto.trim(),
                fechaVisita: ''
            }
        }
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
                    style={[styles.inputContainer, styles.notaInputContainer].concat(editable ? [] : null)}>
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

    handleSelectItem = (value) => {
        this.setState({
            isHidden:!this.state.isHidden,
            selectItem:value,
            validateRadioButton:!this.state.validateRadioButton,
            hideCardOportunidad:!this.state.hideCardOportunidad
        })
    }

    renderForm = () => {
        const {preguntas, respuestas, visita, currentUser, visitaId,hideEditPrio, visita: {usuarioNTCreador}, isFetchingObtenerPregunta, isValidatingApplicability, isFetchingOportunidades, isFetchingRiesgos} = this.props
        const {form: {rutCliente, nombreCliente, oportunidades, riesgos, participantes, privado, notas}, requeridosFaltantes, existenRiesgosVigentes,validateRadioButton} = this.state
        const llavesDependencias = _.keys(preguntas)
        const riesgoRequerido = !existenRiesgosVigentes && this.validarRiesgosRequeridos()
        const oportunidadRequerida = this.validarOportunidadesRequeridas()
        const oportunidadRequeridaMssg = requeridosFaltantes && oportunidadRequerida
        const riesgoRequeridaMssg = requeridosFaltantes && riesgoRequerido
        const {nombreCreador, fechaVisita} = this.renderCreador()
        const puedeCrearRiesgo = this.puedeCrearRiesgo()
        let j = _.size(_.filter(preguntas, (pt) => pt.main))
       

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    style={{flex: 1}}
                >
                    <ScrollView style={styles.formContainer}>
                        <View style={styles.userContainer}
                              {...testID({
                                  id: `CreadorVisitaContainer`,
                                  label: `Contenedor del creador de la visita`
                              })}
                        >
                            <View style={styles.titleContainer}>
                                {/*<Image source={require('./../../assets/images/icons/creator_icon.png')}/>*/}
                                <Text style={styles.title}
                                      {...testID({
                                          id: `CreadorVisitaLabel`,
                                          label: `Label del creador de la visita`
                                      })}
                                >Creador:</Text>
                            </View>
                            <Text style={styles.creator}
                                  {...testID({
                                      id: `NombreCreadorVisitaLabel`,
                                      label: `Nombre del creador de la visita`
                                  })}
                            >
                                {nombreCreador}
                            </Text>
                            <Text style={styles.dateHeader}
                                  {...testID({
                                      id: `FechaCreacionVisitaLabel`,
                                      label: `Fecha de creacion de la visita`
                                  })}
                            >
                                {fechaVisita}
                            </Text>
                        </View>

                        {/*Lista de participantes en la visita*/}
                        {_.map(participantes, (participante, i) => {
                            return this.renderParticipanteInput(participante, i)
                        })}

                        {/*<SwitchButton onSetprivado={this.onSetprivado} title={'Visita confidencial'}
                                      valueSwitch={privado}
                                      disabled={!!visitaId}/>*/}

                        {/*Button agrega elemento Button "Agregar nuevo participante"*/}
                        {visitaId ? <TouchableOpacity onPress={() => {
                            this.agregarCliente()
                        }} style={styles.buttonParticipante}
                                                             {...testID({
                                                                 id: `AgregarParticipanteVisitaButton`,
                                                                 label: `Botón de agregar nuevo participante`
                                                             })}
                        disabled={hideEditPrio ? true : false}>
                            <Text style={styles.buttonParticipanteText}
                                  {...testID({
                                      id: `AgregarParticipanteVisitaTextButton`,
                                      label: `Texto del Botón de agregar nuevo participante`
                                  })}
                            >Agregar Participante</Text>
                        </TouchableOpacity>:null}

                        

                        {/*Lista de preguntas*/}
                        {_.map(llavesDependencias, (key, i) => {
                            let parentInput

                            if (preguntas[key].main) parentInput = this.renderFormInput(preguntas[key], key, i + 1)

                            return parentInput ? (
                                <View key={key}>
                                    {parentInput}

                                    {_.map(preguntas[key].childrensId, (childrenKey) => {
                                        j += 1
                                        const childrenFormInput = this.renderFormInput(preguntas[childrenKey], childrenKey, j)

                                        return childrenFormInput
                                    })}
                                </View>
                            ) : null
                        })}

                        

                        {this.renderVisitaDatePickerInput()}
                        {this.renderRutClienteInput()}
                        {this.renderGrupoEconomicoInput()}

                        <View style={rutCliente ? styles.inputContainer : styles.inputDisabledContainer}
                              {...testID({
                                  id: `NombreClienteVisitaContainer`,
                                  label: `Container del nombre cliente visita`
                              })}
                        >
                            {nombreCliente ? <Text style={styles.inputTitle}>Nombre cliente*:</Text> : null}
                            <Text style={styles.inputDisableText}
                                  {...testID({
                                      id: `nombreClienteVisitasLabel`,
                                      label: `Label del nombre del cliente de la visita`
                                  })}
                            >
                                {nombreCliente ? nombreCliente : 'Nombre cliente'}
                            </Text>
                        </View>

                        {/*Preguntas de riesgo*/}
                        <View style={{marginBottom: 10, marginTop: 20}}>

                            {/*Msj error riesgo*/}
                            {
                                (puedeCrearRiesgo || (!_.isEmpty(riesgos))) &&
                                <Text style={[styles.titleButton].concat(riesgoRequeridaMssg ? {color: RED} : [])}>
                                    {`Preguntas de riesgo${riesgoRequerido ? '*' : ':'}`}
                                </Text>
                            }

                            {!puedeCrearRiesgo ? null : riesgoRequeridaMssg ?
                                <Text style={styles.requeridoMssg}>
                                    {`debe haber al menos una pregunta de riesgo con no mas de ${riesgoRequerido} días de antigüedad`}
                                </Text>
                                : null}

                            {isFetchingRiesgos && <Loading/>}

                            <View style={{marginBottom: 10}}/>


                            {_.map(riesgos, (riesgo, i) => {
                                const {riesgoId} = riesgo

                                let resumen = {}
                                if (riesgoId && this.props.riesgo.riesgoId === riesgoId) {
                                    if (this.props.riesgo.resumen) {
                                        resumen =
                                            {
                                                ...this.props.riesgo.resumen,
                                                rutCliente: this.props.riesgo.resumen.rutEmpresa,
                                                nombreCliente: this.props.riesgo.resumen.nombreEmpresa,
                                                ...this.props.riesgo,
                                            }
                                    } else {
                                        resumen = {
                                            ...this.props.riesgo,
                                        }
                                    }

                                } else {
                                    resumen = {
                                        ...riesgo,
                                        ...(riesgo.resumen ? {
                                            ...riesgo.resumen,
                                            rutCliente: riesgo.resumen.rutEmpresa,
                                            nombreCliente: riesgo.resumen.nombreEmpresa
                                        } : {}),
                                    }
                                }

                                const resumenRiesgoModalName = [`ResumenRiesgo[${i}]Visible`]
                                const resumenRiesgoModalVisible = !!this.state[resumenRiesgoModalName]


                                return (
                                    <View key={i}>
                                        {/*Boton que abre el resumen de riesgo*/}
                                        <TouchableOpacity
                                            onPress={() => this.obtenerResumenRiesgo(resumen, resumenRiesgoModalName)}
                                            {...testID({
                                                id: `ResumenRiesgoVisitaButton`,
                                                label: `Boton que abre el resumen de riesgo`
                                            })}
                                        >
                                            {/*Card de resumen de riego de riego*/}
                                            <RiesgoCard riesgo={resumen} navigation={this.props.navigation}
                                                        fromVisita={true}/>
                                        </TouchableOpacity>

                                        {/*modal con resumen de riesgo*/}
                                        <Modal animationType={'slide'} transparent={false}
                                               visible={resumenRiesgoModalVisible} onRequestClose={() => {
                                        }}>
                                            <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR, paddingTop: 15}}>
                                                <NavBar
                                                    title="Resumen Riesgo"
                                                    headerLeft={<GoBackButton onPress={() => {
                                                        this.setState({[resumenRiesgoModalName]: false})
                                                    }}/>}
                                                />
                                                <ScrollView>
                                                    {isFetchingRiesgos || (riesgoId && this.props.riesgo.riesgoId !== riesgoId) ?
                                                        <Loading/> :
                                                        //Vista resumen de riesgo
                                                        <ResumenRiesgoScreen title="Resumen Riesgo" riesgo={resumen}
                                                                             navigation={this.props.navigation}/>
                                                    }
                                                </ScrollView>
                                            </View>
                                        </Modal>
                                    </View>
                                )
                            })}

                            {/*boton abrir formulario de riesgo*/}
                            {puedeCrearRiesgo ?
                                <TouchableOpacity onPress={this.goToFormularioRiesgo} style={styles.button}
                                                  {...testID({
                                                      id: `formularioRiesgoVisitaButton`,
                                                      label: `Boton que abre el formulario de riesgo`
                                                  })}
                                disabled={hideEditPrio ? true : false}>
                                    <Image style={{marginRight: 10}}
                                           source={require('./../../assets/images/icons/plus_icon.png')}/>
                                    <Text style={styles.textButton}>Contestar preguntas</Text>
                                </TouchableOpacity> : null
                            }
                        </View>

                        {/*Resumen oportunidad*/}
                        {visitaId || _.size(visita.oportunidadesId) ?
                            <View style={{marginBottom: 20}}>
                                <Text style={styles.titleButton}>
                                   {`Oportunidades${':'}`}
                                </Text>
                                {hideEditPrio ? null :<View style={styles.contentRadioHideButtonOport}>
                                <RadioHideButtonOportunidad 
                                    key={ 1 } 
                                    label={ "Si"} 
                                    value={ false } 
                                    active={ this.state.selectItem } 
                                    handleSelectItem={ this.handleSelectItem } 
                                    rID={ 1 } />
                                <RadioHideButtonOportunidad 
                                    key={ 2 } 
                                    label={ "No" } 
                                    value={ true } 
                                    active={ this.state.selectItem } 
                                    handleSelectItem={ this.handleSelectItem } 
                                    rID={ 2 } />   
                                </View>}
                                {requeridosFaltantes === true && validateRadioButton ? <Text style={styles.requeridoMssg}>Tienes que agregar una oportunidad a esta visita antes de guardar.</Text> : null}
                                {isFetchingOportunidades && <Loading/>}

                                <View style={{marginBottom: 10}}/>

                                {_.map(oportunidades, (oportunidad, i) => {
                                    const {oportunidadId} = oportunidad
                                    const resumen = oportunidadId ? oportunidad : {
                                        ...oportunidad.resumen,
                                        monto: `$ ${oportunidad.monto ? montoPuntosMil(oportunidad.monto) : 0}`,
                                        nombreEstado: oportunidad.nombreEstado || 'Activa',
                                        fechaFin: oportunidad.fechaFin
                                    }
                                    const resumenOportunidadModalName = [`ResumenOportunidad[${i}]Visible`]
                                    const resumenOportunidadModalVisible = !!this.state[resumenOportunidadModalName]
                                    const resumenCompleto = oportunidadId ? {
                                        ...this.props.oportunidad,
                                        notas: this.props.oportunidad.notas || []
                                    } : oportunidad

                                    if (oportunidad.mostrar) {
                                        return (
                                            <View key={i}>
                                                <TouchableOpacity
                                                    onPress={() => this.obtenerResumenOportunidad(resumen, resumenOportunidadModalName)}>
                                                    {this.state.hideCardOportunidad ?  <OportunidadCard oportunidad={resumen}
                                                                     navigation={this.props.navigation}
                                                                     fromVisita={true}/>:null} 
                                                </TouchableOpacity>

                                                <Modal animationType={'slide'} transparent={false}
                                                       visible={resumenOportunidadModalVisible} onRequestClose={() => {
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        backgroundColor: BACKGROUND_COLOR,
                                                        paddingTop: 15
                                                    }}>
                                                        <NavBar
                                                            title="Resumen Oportunidad"
                                                            headerLeft={<GoBackButton onPress={() => {
                                                                this.setState({[resumenOportunidadModalName]: false})
                                                            }}/>}
                                                        />
                                                        <ScrollView>
                                                            {isFetchingOportunidades || (oportunidadId && _.isEmpty(this.props.oportunidad)) ?
                                                                <Loading/> :
                                                                <ResumenOportunidadScreen title='Resumen Oportundidad'
                                                                                          oportunidad={resumenCompleto}
                                                                                          estadoId={this.props.oportunidad.estadoId}/>
                                                            }
                                                        </ScrollView>
                                                    </View>
                                                    {this.renderAlertModal()}
                                                </Modal>
                                            </View>
                                        )
                                    } else {
                                        return <OportunidadCardLock key={i}/>
                                    }
 
                                })}

                                {visitaId && this.state.isHidden? 
                                    <TouchableOpacity onPress={this.goToFormularioOportunidad} style={styles.button}
                                                      {...testID({
                                                          id: `formularioOportunidadVisitaButton`,
                                                          label: `Boton que abre el formulario de oportunidad`
                                                      })}
                                    disabled={hideEditPrio ? true : false}>
                                        <Image style={{marginRight: 10}}
                                               source={require('./../../assets/images/icons/plus_icon.png')}/>
                                        <Text style={styles.textButton}>Crear nueva oportunidad</Text>
                                    </TouchableOpacity>:null}
                            </View> : null
                        }

                        <View style={{marginBottom: 50}}/>

                        {/*Modal con el resumen de la visita*/}
                        {this.renderResumenVisita()}


                        {/*Ver todas las notas*/}

                        {_.map(notas, (nota, i) => {
                            return this.renderNotaInput(nota, i)
                        })}
                        <ButtonAddNota addNota={this.agregarNota}  disabled={hideEditPrio ? true : false} title={'Agregar Nota'}/>


                    </ScrollView>
                </KeyboardAvoidingView>
                <TouchableOpacity onPress={() => {
                  !isFetchingObtenerPregunta && !isValidatingApplicability && this.validationForm(true) ? this.onCreateSummaryVisita() : false
                }}
                                  style={hideEditPrio ? styles.buttonsDisabledContainer : styles.buttonsContainer }
                                  {...testID({
                                      id: `CrearVisitaButton`,
                                      label: `Boton para crear o editar una visita`
                                  })}
                    >
                    <Text style={styles.buttonText}>
                        {visitaId ? 'Guardar Cambios' : 'Crear Visita'}
                    </Text>
                    {(isFetchingObtenerPregunta || isValidatingApplicability) &&
                    <ActivityIndicator size="small" color="white"/>}
                </TouchableOpacity>
            </View>
        )
    }

    loadingForm = () => {
        const {loading} = this.state

        return loading
    }

    render() {
        const {error} = this.props
        return error === 'unauthorized' ? <Unauthorized/> : this.loadingForm() ? <Loading/> : this.renderForm()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormularioVisitaPriorizadaScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    formContainer: {
        paddingLeft: 15,
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
    titleMotivo: {
        marginBottom: 10,
        fontWeight: '500'
    },
    titleButton: {
        fontSize: 13,
        fontWeight: '500'
    },
    buttonParticipante: {
        flexDirection: 'row',
        height: 44,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    buttonParticipanteText: {
        color: GREEN,
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'capitalize',
    },
    button: {
        backgroundColor: GREEN,
        borderRadius: 50,
        paddingVertical: 8.5,
        height: 40,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    modal: {
        justifyContent: 'center',
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
    textButton: {
        textAlign: 'center',
        color: WHITE,
        fontWeight: '600',
        fontSize: 16,
    },
    requeridoMssg: {
        color: RED,
        fontStyle: 'italic',
        marginTop: 2,
        marginBottom: 20
    },
    maxLength: {
        flex: 1,
        textAlign: 'right',
        color: BROWN_GREY
    },
    dateHeader: {
        textTransform: 'capitalize',
        fontWeight: '200'
    },
    creator: {
        textTransform: 'capitalize',
        fontWeight: '600'
    },
    notaInputContainer: {
        marginBottom: 0
    },
    horaNotaOportunidad: {
        textAlign: 'center',
        color: BROWN_GREY,
        marginBottom: 0,
        flex: 1
    },
    contentRadioHideButtonOport:{
        flexDirection: 'row',
        justifyContent:'flex-start'
    }

})
