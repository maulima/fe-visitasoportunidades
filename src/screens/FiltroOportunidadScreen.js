import React, {Component} from 'react'
import {
    ActivityIndicator,
    Image,
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
import moment from 'moment'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'
//Components
import CloseModalButton from '../components/CloseModalButton'
import ItemListModal from '../components/ItemListModal'
import GoBackButton from '../components/GoBackButton'
import DateTimePicker from '../components/DateTimePicker'
import SearchModal from '../components/SearchModal'
import BooleanRadioButton from '../components/BooleanRadioButton'
import ClearFilterButton from '../components/ClearFilterButton'
import SwitchButton from '../components/SwitchButton'
//Actions
import {obtenerListaOportunidad} from '../store/actions/oportunidades'
import {
    limpiarFilter,
    obtenerFilterOportunidad,
    restaurarBackup,
    updateOportunidadFilterParams
} from '../store/actions/filtroOportunidades'
import {obtenerMacroBancas} from '../store/actions/macroBancas'
import { obtenerPlataforma } from '../store/actions/obtenerPlataforma'
//Assets
import {BACKGROUND_COLOR, BLACK, BROWN_GREY, BROWN_LIGHT_GREY, GREEN, RED, WHITE} from '../styles/Colors'
import {formatoRut} from '../utils/StringHelper'
import {idsArrayParse} from '../utils/ArrayHelper'
import {TipoBusqueda} from '../constants/Data'
import {FiltroOportunidad, TipoPregunta} from './../constants/Data'


const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        filters: state.filtroOportunidades,
        backup: state.filtroOportunidades.backup,
        colaboradores: state.colaboradores.listaBusqueda,
        estadosOportunidad: state.estadosOportunidad.lista,
        primeraPregunta: state.filtroOportunidades.current,
        preguntas: state.filtroOportunidades.preguntas,
        respuestas: state.filtroOportunidades.respuestas,
        respuestasId: state.filtroOportunidades.respuestasId,
        isFetching: state.oportunidades.isFetching,
        macroBancas: state.macroBancas,
        obtenerPlataforma:state.obtenerPlataforma,
        colaboradoresLista: state.colaboradores.lista,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerFilterOportunidad,
            limpiarFilter,
            obtenerListaOportunidad,
            updateOportunidadFilterParams,
            restaurarBackup,
            obtenerMacroBancas,
            obtenerPlataforma
        }, dispatch)
    }
}

class FiltroOportunidadScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => {
        const {params = {}} = navigation.state
        return {
            headerTitle: 'Filtros',
            headerLeft: <CloseModalButton onPress={() => params.closeComponent()}/>,
            headerRight: <ClearFilterButton onPress={() => params.clearFilter()} type="oportunidad"/>
        }
    }

    state = {
        form: {
            from_date: '',
            end_date: '',
            rutCliente: '',
            nombreCliente: '',
            responsable: '',
            usuarioNTResponsable: '',
            estado: 1,
            estadoNombre: '',
            filtersActive: true,
            privado: false,
            macrobancaEmpresa: '',
            obtenerPlataform:'',
        },
        formValidation: {
            from_date: false,
            end_date: false,
        },
        loadingButton: false,
        fromDateModalVisible: false,
        toDateModalVisible: false,
        tipoProductoModalVisible: false,
        rutClienteModalVisible: false,
        responsableModalVisible: false,
        estadoModalVisible: false,
        preguntasModificadas: false,
        macroBancaModalVisible: false,
        obtenerPlataformaModalVisible:false
    }

    componentWillMount() {
        const {
            actions: {
                obtenerFilterOportunidad,
                obtenerMacroBancas,
                obtenerPlataforma
            },
            estadosOportunidad,
            filters,
            backup,
            colaboradoresLista,
            currentUser
        } = this.props

        const {
            usuarioNTResponsable,
            nombreCliente,
            estadoId,
            clienteId,
            respuestasId,
            fechaInicioCierre,
            fechaFinCierre,
            privado,
            responsable,
            macrobancaEmpresa,
            jefeNT,
            codOficina,
            plataformaEmpresa
        } = backup || filters

        const {form} = this.state
        const estadoNombre = estadoId ? {
            estadoNombre: _.find(estadosOportunidad, (e) => e.id === estadoId).nombre
        } : {}

        const jefeNTCreador = jefeNT.length > 1 ? jefeNT : _.find(colaboradoresLista, (col) => col.usuarioNt === currentUser.usuario).usuarioNtJefe
        _.map(respuestasId, (respuestaId) => {
            _.map(backup.respuestas, (r, k) => {
                if (r[respuestaId]) {
                    const pregunta = backup.preguntas[k]

                    form[`${pregunta.name}`] = respuestaId
                    form[`${pregunta.name}Nombre`] = r[respuestaId].name
                }
            })
            return null
        })
        this.setState({
            form: {
                ...form,
                responsable,
                ...estadoNombre,
                usuarioNTResponsable,
                estado: estadoId,
                rutCliente: clienteId,
                nombreCliente,
                respuestasId,
                from_date: fechaInicioCierre,
                end_date: fechaFinCierre,
                privado,
                macrobancaEmpresa,
                obtenerPlataform:plataformaEmpresa,
                jefeNT: jefeNTCreador,
                codOficina: jefeNT.length > 1 ? codOficina : currentUser.codOficina,
            }
        })

        if (_.isEmpty(this.props.macroBancas.lista)) {
            obtenerMacroBancas()
        }

        if( _.isEmpty(this.props.obtenerPlataforma.lista) ) {
            obtenerPlataforma()
        }

        obtenerFilterOportunidad(estadoId, true)
    }

    componentDidMount() {
        this.props.navigation.setParams({
            clearFilter: this.clearFilter,
            closeComponent: this.closeComponent
        })
    }

    componentWillReceiveProps(nextProps) {
        const {isFetching, navigation: {navigate}, navigation, actions: {updateOportunidadFilterParams}} = this.props
        if (!isFetching && nextProps.isFetching) {
            this.setState({loadingButton: true})
        }

        if (isFetching && !nextProps.isFetching) {
            this.setState({loadingButton: false})
            updateOportunidadFilterParams(this.getFiltersParams())
            // navigation.goBack()
            navigate('Oportunidades')
        }
    }

    clearFilter = () => {
        const form = _.clone(this.state.form)

        _.map(_.values(this.props.preguntas), (pg) => {
            delete form[pg.name]
            delete form[`${pg.name}Nombre`]

            return null
        })


        this.setState(state => {
            return {
                ...state,
                form: {
                    ...form,
                    from_date: '',
                    end_date: '',
                    rutCliente: '',
                    nombreCliente: '',
                    responsable: '',
                    usuarioNTResponsable: '',
                    estado: 1,
                    estadoNombre: '',
                    respuestasId: [],
                    filtersActive: false,
                    privado: false,
                    macrobancaEmpresa: '',
                    obtenerPlataform:'',
                },
                formValidation: {
                    from_date: false,
                    end_date: false,
                }
            }
        })
    }

    closeComponent = () => {
        const {navigation} = this.props

        navigation.goBack()
    }

    onSaveEstado = (estado) => {
        const {estadosOportunidad} = this.props
        const {form} = this.state
        const estadoId = Number(estado)
        let nombreEstado = ''

        Object.keys(estadosOportunidad || {}).filter(e => {
            if (estadosOportunidad[e].id === estadoId) {
                nombreEstado = estadosOportunidad[e].nombre
            }
        })

        this.setState(state => {
            return {
                estadoModalVisible: false,
                form: {
                    ...form,
                    estado: estadoId,
                    estadoNombre: nombreEstado,
                    filtersActive: true,
                }
            }
        })
    }

    onSetFromDatetime = (date) => {
        this.setState(state => {
            return {
                fromDateModalVisible: false,
                form: {
                    ...state.form,
                    from_date: date ? moment(date).format('YYYY-MM-DDTHH:mm:ssZ') : date,
                    filtersActive: true,
                }
            }
        })
    }

    onSetToDatetime = (date) => {
        this.setState(state => {
            return {
                toDateModalVisible: false,
                form: {
                    ...state.form,
                    end_date: date ? moment(date).format('YYYY-MM-DDTHH:mm:ssZ') : date,
                    filtersActive: true,
                }
            }
        })
    }

    onSetEmpresa = (value) => {
        this.setState(state => {
            return {
                ...state,
                rutClienteModalVisible: false,
                form: {
                    ...state.form,
                    rutCliente: `${value.rut}${value.digitoVerificador}`,
                    nombreCliente: value.nombreEmpresa,
                    filtersActive: true,
                }
            }
        })
    }

    onSetSimpleInput = (value, title) => {
        const {respuestas, preguntas} = this.props

        let preguntaID = Object.keys(preguntas || {}).filter(p => {
            return preguntas[p].name === title
        })
        let pregunta = preguntas[preguntaID]
        let respuesta = respuestas[preguntaID]

        this.setState(state => {
            return {
                ...state,
                [`${pregunta.name}ModalVisible`]: false,
                form: {
                    ...state.form,
                    [`${pregunta.name}`]: value,
                    [`${pregunta.name}Nombre`]: respuesta[value].name,
                    filtersActive: true,
                }
            }
        })
    }

    onSetBooleanInput = (value, title) => {
        const {form} = this.state

        if (form[title] !== value) {
            const {
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
                    [`${title}Nombre`]: radioRespuesta,
                    filtersActive: true,
                }
            })
        }
    }

    onSetLibreInput = (value, title) => {
        this.setState(state => {
            return {
                ...state,
                form: {
                    ...state.form,
                    [title]: value,
                    filtersActive: true,
                }
            }
        })
    }

    onSetResponsable = (value) => {
        this.setState(state => {
            return {
                responsableModalVisible: false,
                form: {
                    ...state.form,
                    responsable: value.nombreColaborador,
                    usuarioNTResponsable: value.usuarioNt,
                    filtersActive: true,
                }
            }
        })
    }

    onSetprivado = (estado) => {
        this.setState({
            form: {
                ...this.state.form,
                privado: estado,
            }
        })
    }

    onSetMacroBancaInput = (value) => {
        const {form} = this.state
        const {macroBancas: {lista}} = this.props
        this.setState({
            form: {
                ...form,
                macroBanca: value,
                macrobancaEmpresa: lista[value].name,
                filtersActive: true,
            },
            macroBancaModalVisible: false,

        })
    }

     onSetObtenerPlataformaInput = (value) => {
        const { form } = this.state
        const {obtenerPlataforma: {lista}} = this.props
        this.setState({
            form: {
                ...form,
                obtenerPlatafor: value,
                obtenerPlataform: lista[value].name,
                filtersActive: true,
            },
            obtenerPlataformaModalVisible: false,
        })
    }

    getFiltersParams = () => {
        const {
            preguntas, currentUser: {plataforma, usuario}
        } = this.props
        const {form} = this.state
        let filterParams = {}
        let respuestas = []

        Object.keys(preguntas || {}).map(key => {
            Object.keys(form || {}).map(st => {
                if (!!preguntas[key] && preguntas[key].name === st && !_.isNull(form[st]) && !!form[`${st}Nombre`]) {
                    respuestas.push(form[st])
                }
            })
        })

        respuestas = idsArrayParse(respuestas)
        Object.assign(filterParams, {plataforma})
        Object.assign(filterParams, {usuarioNT: usuario})
        Object.assign(filterParams, {usuarioNTResponsable: form['usuarioNTResponsable']})
        Object.assign(filterParams, {responsable: form['responsable']})
        Object.assign(filterParams, {clienteId: form['rutCliente']})
        Object.assign(filterParams, {fechaInicioCierre: form['from_date']})
        Object.assign(filterParams, {fechaFinCierre: form['end_date']})
        Object.assign(filterParams, {estadoId: form['estado'] || 1})
        Object.assign(filterParams, {nombreCliente: (form['nombreCliente'] === undefined ? '' : form['nombreCliente'])})
        Object.assign(filterParams, {respuestasId: _.isEmpty(respuestas) ? form.respuestasId || [] : respuestas})
        Object.assign(filterParams, {pagina: 0})
        Object.assign(filterParams, {limite: 15})
        Object.assign(filterParams, {filtersActive: form['filtersActive']})
        Object.assign(filterParams, {privado: form['privado']})
        Object.assign(filterParams, {macrobancaEmpresa: form['macrobancaEmpresa']})
        Object.assign(filterParams, {plataformaEmpresa: form['obtenerPlataform']})
        Object.assign(filterParams, {jefeNT: form['jefeNT']})
        Object.assign(filterParams, {codOficina: form['codOficina']})

        return filterParams
    }

    handleFilter = () => {
        const {actions: {obtenerListaOportunidad}} = this.props
        if (this.validateDateForm()) {
            obtenerListaOportunidad(this.getFiltersParams())
        }
    }

    validateDateForm = () => {
        //Validamos si las fechas son validadas , etc.
        const {form} = this.state
        let validateForm = false

        if (form['from_date'].length > 0 && form['end_date'].length === 0) {
            this.setState({
                formValidation: {
                    end_date: true,
                }
            })
        } else if (form['from_date'].length === 0 && form['end_date'].length > 0) {
            this.setState({
                formValidation: {
                    from_date: true,
                }
            })
        } /*else if (moment(form.from_date).format('DD-MM-YYYY') > moment(form.end_date).format('DD-MM-YYYY')) {
            this.setState({
                formValidation: {
                    end_date: true,
                }
            })
        }*/ else {
            this.setState({
                formValidation: {
                    from_date: false,
                    end_date: false,
                }
            })
            validateForm = true
        }

        return validateForm
    }

    renderResponsable = () => {
        const {form: {responsable}, responsableModalVisible} = this.state

        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={responsableModalVisible}
                       onRequestClose={() => {
                       }}>
                    <SearchModal
                        title="Responsable"
                        type={TipoBusqueda.RESPONSABLE}
                        getValue={this.onSetResponsable}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({responsableModalVisible: false})
                        }}/>}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({responsableModalVisible: true})}
                                  {...testID({
                                      id: `ResponsableFiltroOportunidadButton`,
                                      label: `Boton que abre el modal de ejecutivo responsable en filtro oportunidad`
                                  })}
                >
                    {responsable ? <Text style={styles.inputTitle}>Ejecutivo responsable:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `ResponsableFiltroOportunidadLabel`,
                                  label: `Texto del input responsable en filtro oportunidad`
                              })}
                        >{responsable ? responsable : 'Ejecutivo responsable'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderRUTClienteInput = () => {
        const {form: {rutCliente, nombreCliente}, rutClienteModalVisible} = this.state

        return (
            <View>
                <View style={styles.inputContainer}>
                    <Modal animationType={'slide'} transparent={false} visible={rutClienteModalVisible}
                           onRequestClose={() => {
                           }}>
                        <SearchModal
                            title="RUT cliente"
                            type={TipoBusqueda.RUT_CLIENTE}
                            getValue={this.onSetEmpresa}
                            fromFilters={true}
                            headerLeft={<GoBackButton onPress={() => {
                                this.setState({rutClienteModalVisible: false})
                            }}/>}
                        />
                    </Modal>
                    <TouchableOpacity onPress={() => {
                        this.setState({rutClienteModalVisible: true})
                    }} style={styles.itemContainer}
                                      {...testID({
                                          id: `RutClienteFiltroOportunidadButton`,
                                          label: `Boton que abre el modal de rut cliente en filtro oportunidad`
                                      })}
                    >
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `RutClienteFiltroOportunidadLabel`,
                                  label: `Texto del input rut cliente en filtro oportunidad`
                              })}
                        >
                            {rutCliente ? formatoRut(rutCliente) : 'RUT cliente'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </TouchableOpacity>
                </View>
                <View style={[styles.inputContainer, styles.inputDisableText, {borderBottomColor: BROWN_LIGHT_GREY}]}>
                    {nombreCliente ?
                        <Text style={[styles.inputTitle, {color: BROWN_LIGHT_GREY}]}
                              {...testID({
                                  id: `NombreClienteFiltroOportunidadLabel`,
                                  label: `Texto del nombre cliente en filtro oportunidad`
                              })}
                        >Nombre cliente*:</Text> : null}
                    <Text style={styles.inputDisableText}>
                        {nombreCliente ? nombreCliente : 'Nombre cliente'}
                    </Text>
                </View>
            </View>
        )
    }

    renderFromDatePickerInput = () => {
        const {form: {from_date}, fromDateModalVisible, formValidation} = this.state

        return (
            <View>
                <View style={formValidation['from_date'] ? styles.inputContainerError : styles.inputContainer}>
                    {
                        Platform.OS === 'ios'
                            ? <Modal animationType={'slide'} transparent={true} visible={fromDateModalVisible}
                                     onRequestClose={this.onSetFromDatetime}>
                                <DateTimePicker
                                    defaultDate={null}
                                    onSave={this.onSetFromDatetime}
                                    isVisible={fromDateModalVisible}
                                    onCancel={this.onSetFromDatetime}/>
                            </Modal>
                            : <DateTimePicker
                                defaultDate={null}
                                onSave={this.onSetFromDatetime}
                                isVisible={fromDateModalVisible}
                                onCancel={this.onSetFromDatetime}/>
                    }

                    <TouchableOpacity onPress={() => {
                        this.setState({fromDateModalVisible: true})
                    }}
                                      {...testID({
                                          id: `FechaDesdeFiltroOportunidadButton`,
                                          label: `Boton que abre el datepicker en filtro oportunidad`
                                      })}
                    >
                        {from_date ? <Text style={styles.inputTitle}>Desde:</Text> : null}
                        <View style={styles.itemContainer}>
                            <Text style={styles.inputText}
                                  {...testID({
                                      id: `FechaDesdeFiltroOportunidadLabel`,
                                      label: `Texto del datepicker en filtro oportunidad`
                                  })}
                            >
                                {from_date ? moment(from_date).format('dddd, DD MMMM YYYY') : 'Desde'}
                            </Text>
                            <Image style={{marginRight: 10}}
                                   source={require('./../../assets/images/icons/calendar_icon.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                {formValidation['from_date'] ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderToDatePickerInput = () => {
        const {form: {end_date}, toDateModalVisible, formValidation} = this.state
        console.log(formValidation)
        return (
            <View>

                <View style={formValidation['end_date'] ? styles.inputContainerError : styles.inputContainer}>
                    {
                        Platform.OS === 'ios'
                            ? <Modal animationType={'slide'} transparent={true} visible={toDateModalVisible}
                                     onRequestClose={this.onSetToDatetime}>
                                <DateTimePicker
                                    defaultDate={null}
                                    onSave={this.onSetToDatetime}
                                    isVisible={toDateModalVisible}
                                    onCancel={this.onSetToDatetime}/>
                            </Modal>
                            : <DateTimePicker
                                defaultDate={null}
                                onSave={this.onSetToDatetime}
                                isVisible={toDateModalVisible}
                                onCancel={this.onSetToDatetime}/>
                    }

                    <TouchableOpacity onPress={() => {
                        this.setState({toDateModalVisible: true})
                    }}
                                      {...testID({
                                          id: `FechaHastaFiltroOportunidadButton`,
                                          label: `Boton que abre el datepicker en filtro oportunidad`
                                      })}
                    >
                        {end_date ? <Text style={styles.inputTitle}>Hasta:</Text> : null}
                        <View style={styles.itemContainer}>
                            {/**/}
                            <Text
                                style={[styles.inputText].concat(formValidation['end_date'] ? styles.inputTitleRequired : [])}
                                {...testID({
                                    id: `FechaHastaFiltroOportunidadLabel`,
                                    label: `Texto del datepicker en filtro oportunidad`
                                })}
                            >
                                {end_date ? moment(end_date).format('dddd, DD MMMM YYYY') : 'Hasta'}
                            </Text>
                            <Image style={{marginRight: 10}}
                                   source={require('./../../assets/images/icons/calendar_icon.png')}/>
                        </View>
                    </TouchableOpacity>
                </View>
                {formValidation['end_date'] ? <Text style={styles.requeridoMssg}>campo requerido</Text> : null}
            </View>
        )
    }

    renderEstadoInput = () => {
        const {form: {estado, estadoNombre}, estadoModalVisible} = this.state
        const {estadosOportunidad} = this.props
        let estados = {}

        Object.keys(estadosOportunidad || {}).map(key => {
            Object.assign(estados, {[estadosOportunidad[key].id]: {name: estadosOportunidad[key].nombre}})
        })

        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={estadoModalVisible} onRequestClose={() => {
                }}>
                    <ItemListModal
                        title="Estado"
                        list={estados}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({estadoModalVisible: false})
                        }}/>}
                        type={FiltroOportunidad.STATUS_OPORTUNIDAD}
                        saveSelection={this.onSaveEstado}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({estadoModalVisible: true})}
                                  {...testID({
                                      id: `EstadoFiltroOportunidadButton`,
                                      label: `Boton que abre el modal de los estados en filtro oportunidad`
                                  })}
                >
                    <Text style={styles.inputTitle}>Estado</Text>

                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `NombreEstadoFiltroOportunidadLabel`,
                                  label: `Texto del nombre estado en filtro oportunidad`
                              })}
                        >{estadoNombre ? estadoNombre : 'Activa'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderSimpleInput = (key, pID) => {
        const {preguntas} = this.props
        const {form, requeridosFaltantes} = this.state
        const pregunta = preguntas[key]
        const respuestas = this.props.respuestas[key]
        const {name, obligatorio, tipo} = pregunta
        const tituloModal = `${name}ModalVisible`
        const tituloInput = `${name}${obligatorio ? '' : ':'}`
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
                                saveSelection={(value) => this.onSetSimpleInput(value, name)}
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
                                              label: `Contenedor de selección simple de ${name} OPORTUNIDAD`
                                          })}
                        >
                            {actualRespuestaNombre ? <Text style={inputTitleStyle}>{`${tituloInput}:`}</Text> : null}
                            <View style={styles.itemContainer}
                                  {...testID({
                                      id: `${pID}TextBoxContainer`,
                                      label: `Contenedor de caja de texto de ${name} OPORTUNIDAD`
                                  })}
                            >
                                <Text style={inputTextStyle}
                                      {...testID({
                                          id: `${pID}TextBox`,
                                          label: `Contenedor de texto de ${name} OPORTUNIDAD`
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
                        {title}:
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                        {
                            Object.keys(respuesta || {}).map((key) => {
                                return <BooleanRadioButton
                                    editable={true}
                                    key={key}
                                    title={title}
                                    pID={pID}
                                    label={(respuesta[key] || {}).name}
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

    renderFormInput = (pregunta, key, index) => {
        const pID = `P${index}FILTROOPORTUNIDAD`

        switch (pregunta.tipo) {
            case TipoPregunta.SIMPLE:
                return this.renderSimpleInput(key, pID)
            case TipoPregunta.BOOLEAN:
                return this.renderBooleanInput(key, pID)
            default:
        }
    }

    renderSwitchPrivado = () => {
        const {privado} = this.state.form
        return (
            <View style={styles.switchContainer}>
                {/*<SwitchButton onSetprivado={this.onSetprivado}
                              title={'Oportunidad confidencial'}
                              valueSwitch={privado}
                              disabled={false}
                              {...testID({
                                    id: `BotonConfidencialidad`,
                                    label: `Boton switch para marca una oportunidad confidencial `
                               })}  
                              />*/}
            </View>
        )
    }

    renderMacrobanca = () => {
        const {macroBancaModalVisible, form: {macrobancaEmpresa}} = this.state
        const {macroBancas: {lista}} = this.props
        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={macroBancaModalVisible}
                       onRequestClose={() => {
                       }}>
                    <ItemListModal
                        list={lista}
                        title='Macrobanca'
                        saveSelection={this.onSetMacroBancaInput}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({macroBancaModalVisible: false})
                        }}/>}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({macroBancaModalVisible: true})}
                                  {...testID({
                                      id: `macroBancaFiltroVisitaButton`,
                                      label: `Boton que abre el modal de macroBanca en filtro visita`
                                  })}
                >
                    {macrobancaEmpresa ? <Text style={styles.inputTitle}>Macrobanca:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `macroBancaFiltroVisitaLabel`,
                                  label: `Texto del input macroBanca en filtro visita`
                              })}
                        >{macrobancaEmpresa ? macrobancaEmpresa : 'Macrobanca'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderObtenerPlataforma = () => {
        const {obtenerPlataformaModalVisible, form: {obtenerPlataform}} = this.state
        const {obtenerPlataforma: {lista}} = this.props
        return (
            <View style={styles.inputContainerPlatforma}>
                <Modal animationType={'slide'} transparent={false} visible={obtenerPlataformaModalVisible}
                       onRequestClose={() => {
                       }}>
                    <ItemListModal
                        list={lista}
                        title='Plataforma'
                        saveSelection={this.onSetObtenerPlataformaInput}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({obtenerPlataformaModalVisible: false})
                        }}/>}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({obtenerPlataformaModalVisible: true})}
                                  {...testID({
                                      id: `PlataformaFiltroVisitaButton`,
                                      label: `Boton que abre el modal de Plataforma en filtro visita Priorizada`
                                  })}
                >
                    {obtenerPlataform ? <Text style={styles.inputTitle}>Plataforma:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `PlataformaFiltroVisitaLabel`,
                                  label: `Texto del input Plataforma en filtro visita Priorizada`
                              })}
                        >{obtenerPlataform ? obtenerPlataform : 'Plataforma'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    render() {
        const {loadingButton} = this.state
        const {preguntas} = this.props
        const llavesDependencias = _.keys(preguntas)
        let j = _.size(_.filter(preguntas, (pt) => pt.main))
        let preguntasLength = Object.keys(preguntas || {}).length

        return (
            <View style={styles.container}>
                <ScrollView style={styles.formContainer}>
                    {this.renderFromDatePickerInput()}
                    {this.renderToDatePickerInput()}
                    {this.renderSwitchPrivado()}
                    {this.renderEstadoInput()}
                    {this.renderRUTClienteInput()}
                    {this.renderResponsable()}
                    {this.renderMacrobanca()}
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
                    {this.renderObtenerPlataforma()}
                    <View style={styles.br}/>
                </ScrollView>
                <TouchableOpacity onPress={() => {
                    this.handleFilter()
                }} style={styles.button}
                                  {...testID({
                                      id: `AplicarFiltroOportunidadButton`,
                                      label: `Boton filtra oportunidades`
                                  })}
                >
                    <Text style={styles.buttonText}>Aplicar</Text>
                    {loadingButton && <ActivityIndicator size="small" color="white"/>}
                </TouchableOpacity>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltroOportunidadScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR
    },
    formContainer: {
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 20
    },
    button: {
        backgroundColor: GREEN,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 50,
        alignItems: 'center'
    },
    buttonText: {
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
        marginBottom: 20
    },
    inputContainerPlatforma:{
        borderBottomWidth: 1,
        borderBottomColor: BLACK,
        paddingBottom: 10,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    inputContainerError: {
        borderBottomWidth: 1,
        borderBottomColor: RED,
        paddingBottom: 10,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 0
    },
    inputTitle: {
        fontSize: 12,
        marginBottom: 5
    },
    inputText: {
        fontSize: 16,
        textTransform: 'capitalize'
    },
    inputDisabledContainer: {
        borderBottomWidth: 1,
        borderBottomColor: BROWN_GREY,
        paddingBottom: 5,
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40
    },
    inputDisableText: {
        fontSize: 16,
        color: BROWN_GREY
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    montoInputText: {
        fontSize: 16,
        textTransform: 'capitalize',
        marginLeft: 40
    },
    br: {
        height: 40
    },
    inputTitleRequired: {
        color: RED
    },
    requeridoMssg: {
        color: RED,
        fontStyle: 'italic',
        marginTop: 2,
        marginBottom: 20
    }
})
