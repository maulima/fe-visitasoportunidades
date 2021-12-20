import React, {Component} from 'react'
import {
    View,
    ScrollView,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Platform,
    ActivityIndicator
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {
    limpiarForm,
    obtenerFormRiesgo,
    obtenerPreguntasFormRiesgo,
    sobrescribirAtributosFormRiesgo
} from '../store/actions/formularioRiesgo'
import {clearRiesgo, crearRiesgo, actualizarRiesgo, obtenerRiesgo} from '../store/actions/riesgos'
import moment from 'moment'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'

import {
    BACKGROUND_COLOR,
    BLACK,
    BROWN_GREY,
    BROWN_LIGHT_GREY,
    GREEN,
    RED,
    GREY,
    OCEAN_BLUE,
    WHITE
} from '../styles/Colors'
import {idsArrayParse} from '../utils/ArrayHelper'
import {formatoRut, desformatoRut, invalidInteger, invalidDecimal, montoPuntosMil} from '../utils/StringHelper'
import {TipoPregunta} from '../constants/Data'
import Loading from '../components/Loading'
import GoBackButton from '../components/GoBackButton'
import ItemListModal from '../components/ItemListModal'
import InputGroup from '../components/InputGroup'
import SimpleTabs from '../components/SimpleTabs'
import DateTimePicker from '../components/DateTimePicker'
import BooleanRadioButton from '../components/BooleanRadioButton'
import ResumenRiesgoScreen from './ResumenRiesgoScreen'
import NavBar from '../components/NavBar'

const mapStateToProps = (state, ownProps) => {
    const {env: {API_ENV}} = process
    const riesgoId = ownProps.navigation.getParam('riesgoId') || null
    const addToVisita = ownProps.navigation.getParam('addToVisita')
    const fromVisita = ownProps.navigation.getParam('fromVisita')
    const clienteVisita = ownProps.navigation.getParam('clienteVisita')

    return {
        riesgoId,
        addToVisita,
        ...(fromVisita ? {fromVisita} : {}),
        ...(clienteVisita ? {clienteVisita} : {}),
        riesgo: state.riesgos.item,
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        colaboradores: state.colaboradores.lista,
        isFetchingObtenerPregunta: state.formularioRiesgo.isFetching,
        preguntas: state.formularioRiesgo.preguntas,
        respuestas: state.formularioRiesgo.respuestas,
        isPushing: state.riesgos.isPushing,
        initialFormLoaded: state.formularioRiesgo.initialFormLoaded,
        hasError: state.riesgos.hasError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerFormRiesgo,
            obtenerPreguntasFormRiesgo,
            sobrescribirAtributosFormRiesgo,
            limpiarForm,
            crearRiesgo,
            actualizarRiesgo,
            clearRiesgo,
            obtenerRiesgo,
        }, dispatch)
    }
}

type Props = {}

class FormularioRiesgoScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: 'Nueva Riesgo',
        headerLeft: <GoBackButton onPress={() => {
            navigation.goBack()
        }}/>
    })

    state = {
        loading: true,
        saving: false,
        detallesCargados: 0,
        form: {
            detalle: null,
            riesgoDate: moment(),
            rutCliente: null,
            nombreCliente: null,
            grupoEconomico: null
        },
        resumen: {},
        rutClienteModalVisible: false,
        grupoEconomicoModalVisible: false,
        riesgoDateModalVisible: false,
        resumenModalVisible: false,
        requeridosFaltantes: false
    }

    componentWillMount() {
        const {
            riesgoId,
            fromVisita,
            clienteVisita,
            actions: {obtenerFormRiesgo, obtenerRiesgo, limpiarForm, clearRiesgo},
            currentUser: {usuario, nombreCompleto}
        } = this.props

        const {form} = this.state

        clearRiesgo()
        limpiarForm()

        if (riesgoId) {
            obtenerRiesgo({riesgoId})
        } else {
            this.setState({
                loading: false,
                form: {
                    ...form,
                    ...(fromVisita ? {
                        rutCliente: clienteVisita.rutCliente || null,
                        nombreCliente: clienteVisita.nombreCliente || null,
                        grupoEconomico: clienteVisita.grupoEconomico || null,
                        macrobancaEmpresa: clienteVisita.macrobancaEmpresa || null,
                    } : {})
                }
            })
            obtenerFormRiesgo()
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            isPushing
        } = this.props

        const {saving} = this.state

        if (saving) {
            if (isPushing && !nextProps.isPushing) {
                this.setState({saving: false})
            }
        }
    }

    handleLoading = () => {
        this.setState({
            loading: !!this.state.loading
        })
    }

    componentDidUpdate(prevProps, prevState) {
        const {initialFormLoaded} = this.props
        const {loading, saving} = this.state

        if (loading) {
            if (!prevProps.initialFormLoaded && initialFormLoaded) {
                this.setState({loading: false})
            }
        } else {
            if (_.size(this.props.preguntas) < _.size(prevProps.preguntas)) {
                this.limpiarAtributos(prevProps.preguntas)
            }
        }
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

    onSetSimpleInput = (value, pregunta) => {
        const {respuestas, actions: {obtenerPreguntasFormRiesgo}} = this.props
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

        obtenerPreguntasFormRiesgo({respuestaId: value})
    }

    onSetLibreInput = (value, pregunta) => {
        const atributo = pregunta.name

        this.setState({
            form: {
                ...this.state.form,
                [atributo]: value.trim(),
            }
        })
    }

    onSetBooleanInput = (value, title) => {
        const {form} = this.state

        if (form[title] !== value) {
            const {
                actions: {
                    obtenerPreguntasFormRiesgo
                },
                respuestas
            } = this.props

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
                preguntasModificadas: false,
                onPressBooleanButton: title
            })

            obtenerPreguntasFormRiesgo({respuestaId: value})
        }
    }

    onSetEndDatetime = (date) => {
        this.setState(state => {
            return {
                riesgoDateModalVisible: false,
                form: {
                    ...state.form,
                    riesgoDate: moment(date)
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
                    grupoEconomico: _.capitalize(value.nombreGrupo)
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
                    grupoEconomico: _.capitalize(value.nombreGrupo)
                }
            }
        })
    }

    validationForm = (validarRequeridos = false) => {
        const {preguntas, isFetchingObtenerPregunta} = this.props
        const {form} = this.state
        let validation = 0

        if (!form['rutCliente'] && !form['grupoEconomico']) validation++

        _.values(preguntas).map(pregunta => {
            const {name, obligatorio} = pregunta

            if (obligatorio && !form[name]) {
                validation++
            } else if (form[name]) {
                switch (pregunta.tipo) {
                    case TipoPregunta.MONEDA:
                    case TipoPregunta.ENTERO:
                        if (invalidInteger(form[name])) validation++
                        break
                    case TipoPregunta.DECIMAL:
                        if (invalidDecimal(form[name])) validation++
                        break
                    default:
                }
            }
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
            return true
        }
    }

    onCreateSummaryRiesgo = () => {
        const {currentUser, riesgoId} = this.props
        const form = {...this.state.form}
        const preguntas = {...this.props.preguntas}
        const paramsForm = {}
        const respuestasId = []
        const resumen = {}
        const detalle = []

        const {ENTERO, DECIMAL, MONEDA, LIBRE, SIMPLE, TABS} = TipoPregunta

        const validation = this.validationForm()
        const fechaCreacion = moment(new Date()).format()

        const usuarioNTCreador = currentUser.usuario.trim()
        const nombreCreador = currentUser.nombreCompleto.trim()
        const rutCreador = `${currentUser.rut}${currentUser.digitoVerif}`
        const plataformaCreador = currentUser.plataforma || form['plataformaCreador']

        let riesgoDate = moment(form['riesgoDate']).format('YYYY-MM-DDTHH:mm:ssZ')

        Object.keys(form).map(st => {
            Object.keys(preguntas || {}).map(key => {
                const {tipo} = preguntas[key]

                if (st === preguntas[key].name) {
                    if (!_.includes([ENTERO, MONEDA, DECIMAL, LIBRE], tipo)) {
                        respuestasId.push(Number(form[st]))
                    }

                    if (tipo === SIMPLE || tipo === TABS) Object.assign(resumen, {[st.toLowerCase()]: form[`${st}Nombre`]})

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

        Object.assign(paramsForm, {plataformaCreador: plataformaCreador})
        Object.assign(paramsForm, {id: riesgoId ? String(riesgoId) : ''})
        Object.assign(paramsForm, {usuarioNTCreador})
        Object.assign(paramsForm, {clienteId: form['rutCliente']})
        Object.assign(paramsForm, {fechaRiesgo: riesgoDate})
        Object.assign(paramsForm, {respuestasId: idsArrayParse(respuestasId)})
        Object.assign(resumen, {nombreCreador})
        Object.assign(resumen, {rutCreador})
        Object.assign(resumen, {nombreEmpresa: form['nombreCliente']})
        Object.assign(resumen, {rutEmpresa: desformatoRut(form['rutCliente'])})
        Object.assign(resumen, {grupoEconomico: form['grupoEconomico']})
        Object.assign(resumen, {fechaRiesgo: riesgoDate})
        Object.assign(resumen, {fechaCreacion})
        Object.assign(resumen, {macrobancaEmpresa: form['macrobancaEmpresa']})
        Object.assign(paramsForm, {resumen: resumen})
        Object.assign(paramsForm, {detalle: detalle})

        this.setState({
            resumen: paramsForm,
            resumenModalVisible: true
        })
    }

    onSaveRiesgo = () => {
        const {addToVisita, navigation} = this.props
        const {resumen} = this.state

        this.setState({saving: true})

        addToVisita(resumen)
        navigation.goBack()
    }

    renderSimpleInput = (key, pID) => {
        const {preguntas} = this.props
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

        if (tipo === TipoPregunta.SIMPLE) {
            return (
                <View key={key}>
                    <View style={inputStyle}>
                        <Modal animationType={'slide'} transparent={false} visible={modalVisible}
                               onRequestClose={() => {
                               }}>
                            <ItemListModal
                                list={respuestas}
                                saveSelection={(value) => this.onSetSimpleInput(value, {...pregunta, id: key})}
                                title={name}
                                headerLeft={<GoBackButton onPress={() => {
                                    this.setState({[tituloModal]: false})
                                }}/>}
                                type={'ANY'}
                                pID={pID}
                                defaultValue={actualRespuesta}/>
                        </Modal>
                        <TouchableOpacity onPress={() => this.setState({[tituloModal]: true})}
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

    renderLibreInput = (key, pID) => {
        const {preguntas} = this.props
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
            maxLengthStyle = [styles.maxLength, {marginTop: -40}]
        }

        return (
            <View key={key}>
                <View style={inputStyle}>
                    <Text style={inputTitleStyle}>{`${name}${obligatorio ? '*' : ':'}`}</Text>
                    <InputGroup
                        testID={testID({
                            id: `${pID}Input`,
                            label: `Contenedor de input de ${name}`
                        })}
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
                    />
                </View>

                <Text style={maxLengthStyle}>{`${_.size(respuesta)}/${maxLength}`}</Text>
                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderBooleanInput = (value, pID) => {
        const {preguntas, respuestas} = this.props
        const {requeridosFaltantes} = this.state
        const title = preguntas[value] !== undefined ? preguntas[value].name : 'Cargando...'
        const respuesta = respuestas[value]
        const actualRespuesta = this.state.form[title]
        const obligatorio = !!(preguntas[value] !== undefined && preguntas[value].obligatorio)

        const requeridoFaltante = obligatorio && requeridosFaltantes && !actualRespuesta
        const inputStyle = [styles.inputContainer].concat(requeridoFaltante ? styles.inputContainerRequired : [])
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])

        return (
            <View key={value}>
                <View style={inputStyle}>
                    <Text style={inputTitleStyle}
                          {...testID({
                              id: `${pID}TextBox`,
                              label: `Contenedor de texto de ${title}`
                          })}
                    >
                        {title}{obligatorio ? '*' : null}:
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        {
                            Object.keys(respuesta || {}).map((key, index) => {
                                return <BooleanRadioButton
                                    editable={true}
                                    key={key}
                                    title={title}
                                    pID={pID}
                                    label={respuesta[key].name}
                                    value={key}
                                    active={this.state.form[`${title}Nombre`]}
                                    handleSelectItem={this.onSetBooleanInput}
                                />
                            })
                        }
                    </View>
                </View>

                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderRiesgoDatePickerInput = () => {
        const {form: {riesgoDate}, riesgoDateModalVisible} = this.state

        return (
            <View style={styles.inputContainer}>
                {
                    Platform.OS === 'ios'
                        ? <Modal animationType={'slide'} transparent={true} visible={riesgoDateModalVisible}
                                 onRequestClose={this.onSetEndDatetime}>
                            <DateTimePicker
                                defaultDate={null}
                                onSave={this.onSetEndDatetime}
                                isVisible={riesgoDateModalVisible}
                                onCancel={this.onSetEndDatetime}/>
                        </Modal>
                        : <DateTimePicker
                            defaultDate={null}
                            onSave={this.onSetEndDatetime}
                            isVisible={riesgoDateModalVisible}
                            onCancel={this.onSetEndDatetime}/>
                }

                <TouchableOpacity onPress={() => {
                    this.setState({riesgoDateModalVisible: true})
                }}
                                  {...testID({
                                      id: `FechaRiesgoButton`,
                                      label: `Contenedor de texto de boton fecha de riesgo`
                                  })}
                >
                    {riesgoDate ? <Text style={styles.inputTitle}
                                        {...testID({
                                            id: `FechaRiesgoLabel`,
                                            label: `Contenedor de label de fecha de riesgo`
                                        })}
                    >
                        Fecha riesgo*:
                    </Text> : null}
                    <View style={styles.itemContainer}
                          {...testID({
                              id: `FechaRiesgoTextBoxContainer`,
                              label: `Contenedor de caja de texto fecha de riesgo`
                          })}
                    >
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `FechaRiesgoTextBox`,
                                  label: `Contenedor de texto de fecha de riesgo`
                              })}
                        >
                            {riesgoDate ? riesgoDate.format('dddd, DD MMMM YYYY') : 'Fecha cierre oportunidad'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/calendar_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderRutClienteInput = () => {
        const {form: {rutCliente, grupoEconomico}, requeridosFaltantes} = this.state
        const obligatorio = !grupoEconomico
        const requeridoFaltante = obligatorio && requeridosFaltantes && !rutCliente

        const inputStyle = [styles.inputContainer, styles.inputContainerDisabled].concat(requeridoFaltante ? styles.inputContainerRequired : [])
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const inputTextStyle = [styles.inputText].concat(requeridoFaltante ? styles.inputTextRequired : [])

        return (
            <View {...testID({
                id: `RutClienteRiesgoTextBoxContainer`,
                label: `Contenedor de caja de texto de rut`
            })}
            >
                <View style={inputStyle}>
                    {rutCliente ? <Text style={inputTitleStyle}
                                        {...testID({
                                            id: `RutClienteRiesgoLabel`,
                                            label: `Contenedor de label de rut`
                                        })}
                    >
                        RUT cliente*:
                    </Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={inputTextStyle}
                              {...testID({
                                  id: `RutClienteRiesgoTextBox`,
                                  label: `Contenedor de texto de rut`
                              })}
                        >
                            {rutCliente ? formatoRut(rutCliente) : `RUT cliente${obligatorio ? '*' : ':'}`}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </View>

                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderGrupoEconomicoInput = () => {
        const {form: {grupoEconomico, rutCliente}, requeridosFaltantes} = this.state
        const obligatorio = !rutCliente
        const requeridoFaltante = obligatorio && requeridosFaltantes && !grupoEconomico

        const inputStyle = [styles.inputContainer, styles.inputContainerDisabled].concat(requeridoFaltante ? styles.inputContainerRequired : [])
        const inputTitleStyle = [styles.inputTitle].concat(requeridoFaltante ? styles.inputTitleRequired : [])
        const inputTextStyle = [styles.inputText].concat(requeridoFaltante ? styles.inputTextRequired : [])

        return (
            <View {...testID({
                id: `GrupoEconomicoRiesgoInput`,
                label: `Contenedor de input de grupo economico`
            })}
            >
                <View style={inputStyle}>
                    {grupoEconomico ?
                        <Text style={inputTitleStyle}
                              {...testID({
                                  id: `GrupoEconomicoRiesgoLabel`,
                                  label: `Contenedor de caja de texto de grupo economico`
                              })}
                        >
                            Grupo económico*:
                        </Text>
                        : null}
                    <View style={styles.itemContainer}>
                        <Text style={inputTextStyle}
                              {...testID({
                                  id: `GrupoEconomicoRiesgoTextBox`,
                                  label: `Contenedor de texto de grupo economico`
                              })}
                        >
                            {grupoEconomico ? grupoEconomico : `Grupo económico${obligatorio ? '*' : ':'}`}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </View>

                {requeridoFaltante ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderResumenRiesgo = () => {
        const {
            resumenModalVisible,
            saving,
            form,
            form: {rutCliente, nombreCliente, grupoEconomico},
            resumen: {usuarioNTCreador, fechaRiesgo, detalle}
        } = this.state

        const resumen = {
            usuarioNTCreador,
            fechaRiesgo,
            rutCliente,
            nombreCliente,
            grupoEconomico,
            detalle
        }

        return (
            <Modal animationType={'slide'} transparent={false} visible={resumenModalVisible} onRequestClose={() => {
            }}>
                <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR, paddingTop: 15}}>
                    <NavBar
                        title="Resumen Riesgo"
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({resumenModalVisible: false})
                        }}/>}
                    />
                    <ScrollView>
                        <ResumenRiesgoScreen title="Resumen Riesgo" riesgo={resumen}
                                             navigation={this.props.navigation}/>
                    </ScrollView>

                    <TouchableOpacity onPress={() => {
                        this.onSaveRiesgo()
                    }} style={styles.buttonsContainer}>
                        <Text style={styles.buttonText}>Agregar a visita</Text>
                        {saving && <ActivityIndicator size="small" color="white"/>}
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }

    renderForm = () => {
        const {preguntas, isFetchingObtenerPregunta} = this.props
        const {form: {rutCliente, nombreCliente}} = this.state
        const llavesDependencias = _.keys(preguntas)
        let j = _.size(_.filter(preguntas, (pt) => pt.main))

        return (
            <View style={styles.container}>
                <ScrollView style={styles.formContainer}>
                    {this.renderRiesgoDatePickerInput()}
                    {this.renderRutClienteInput()}
                    {this.renderGrupoEconomicoInput()}

                    <View style={rutCliente ? styles.inputContainer : styles.inputDisabledContainer}
                          {...testID({
                              id: `RutClienteRiesgoTextContainer`,
                              label: `Contenedor de rut de cliente`
                          })}
                    >
                        {nombreCliente ? <Text style={styles.inputTitle}
                                               {...testID({
                                                   id: `RutClienteRiesgoTextLabel`,
                                                   label: `Contenedor de caja de label de rut`
                                               })}
                        >
                            Nombre cliente*:
                        </Text> : null}
                        <Text style={styles.inputDisableText}
                              {...testID({
                                  id: `RutClienteRiesgoTextBox`,
                                  label: `Contenedor de texto de rut`
                              })}
                        >
                            {nombreCliente ? nombreCliente : 'Nombre cliente'}
                        </Text>
                    </View>

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

                    <View style={{marginBottom: 50}}/>

                    {this.renderResumenRiesgo()}
                </ScrollView>
                <TouchableOpacity onPress={() => {
                    !isFetchingObtenerPregunta && this.validationForm(true) ? this.onCreateSummaryRiesgo() : false
                }}
                                  style={!isFetchingObtenerPregunta && this.validationForm() ? styles.buttonsContainer : styles.buttonsDisabledContainer}
                                  {...testID({
                                      id: `AgregarFormularioRiesgoButton`,
                                      label: `Boton para agregar nuevo riesgo en la visita`
                                  })}
                >
                    <Text style={styles.buttonText}>Agregar</Text>
                    {isFetchingObtenerPregunta && <ActivityIndicator size="small" color="white"/>}
                </TouchableOpacity>
            </View>
        )
    }

    renderFormInput = (pregunta, key, index) => {
        const pID = `P${index}RIESGO`

        switch (pregunta.tipo) {
            case TipoPregunta.SIMPLE:
            case TipoPregunta.TABS:
                return this.renderSimpleInput(key, pID)
            case TipoPregunta.LIBRE:
            case TipoPregunta.ENTERO:
            case TipoPregunta.DECIMAL:
            case TipoPregunta.MONEDA:
                return this.renderLibreInput(key, pID)
            case TipoPregunta.BOOLEAN:
                return this.renderBooleanInput(key, pID)
            default:
        }
    }

    loadingForm = () => {
        const {loading} = this.state

        return loading
    }

    render() {
        return this.loadingForm() ? <Loading/> : this.renderForm()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FormularioRiesgoScreen)

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
    buttonsContainer: {
        backgroundColor: GREEN,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonsDisabledContainer: {
        height: 50,
        backgroundColor: GREY,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonText: {
        color: WHITE,
        fontSize: 18,
        paddingTop: 12.5,
        textTransform: 'uppercase',
        fontWeight: '500'
    },
    createTextButton: {
        color: WHITE,
        textAlign: 'center',
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
    inputTitle: {
        fontSize: 12,
        marginBottom: 5
    },
    inputContainerDisabled: {
        opacity: 0.4
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
        textAlign: 'right',
        color: BROWN_GREY
    }
})
