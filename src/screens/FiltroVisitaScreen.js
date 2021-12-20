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
import {obtenerListaVisitas} from '../store/actions/visitas'
import {
    limpiarFilter,
    obtenerFilterVisita,
    restaurarBackup,
    updateVisitaFilterParams,
} from '../store/actions/filtroVisitas'
import {obtenerMacroBancas} from '../store/actions/macroBancas'
import { obtenerPlataforma } from '../store/actions/obtenerPlataforma'
import moment from 'moment'
import _ from 'lodash'

import {BACKGROUND_COLOR, BLACK, BROWN_GREY, GREEN, WHITE} from '../styles/Colors'
import CloseModalButton from '../components/CloseModalButton'
import ClearFilterButton from '../components/ClearFilterButton'
import Loading from '../components/Loading'
import DateTimePicker from '../components/DateTimePicker'
import SearchModal from '../components/SearchModal'
import ItemListModal from '../components/ItemListModal'
import {TipoBusqueda} from '../constants/Data'
import GoBackButton from '../components/GoBackButton'
import {formatoRut} from '../utils/StringHelper'
import testID from '../../custom_node_modules/react-native-testid'
import SwitchButton from '../components/SwitchButton'

type Props = {}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        filters: state.filtroVisitas,
        backup: state.filtroVisitas.backup,
        colaboradores: state.colaboradores.lista,
        preguntas: state.filtroVisitas.preguntas,
        respuestas: state.filtroVisitas.respuestas,
        respuestasId: state.filtroVisitas.respuestasId,
        isFetching: state.visitas.isFetching,
        macroBancas: state.macroBancas,
        obtenerPlataforma:state.obtenerPlataforma,
        colaboradoresLista: state.colaboradores.lista,
        tipoVisitaR:state.visitas.tipoVisitaR,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerFilterVisita,
            limpiarFilter,
            updateVisitaFilterParams,
            restaurarBackup,
            obtenerListaVisitas,
            obtenerMacroBancas,
            obtenerPlataforma
        }, dispatch)
    }
}

class FiltroVisitaScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => {
        const {params = {}} = navigation.state

        return {
            headerTitle: `Filtros`,
            headerLeft: <View style={{marginBottom:5}}><CloseModalButton onPress={() => {
                navigation.goBack()
            }}/></View>,
            headerRight: <ClearFilterButton onPress={() => {
                params.clearForm()
            }} type="visita"/>
        }
    }

    state = {
        loading: false,
        loadingButton: false,
        form: {
            from_date: '',
            end_date: '',
            rutCliente: '',
            nombreCliente: '',
            grupoEconomico: '',
            motivo: '',
            motivoNombre: '',
            participante: {
                responsable: '',
                usuarioNTResponsable: null,
            },
            agrupado: '',
            filtersActive: false,
            privado: false,
            priorizada:false,
            macrobancaEmpresa: '',
            jefeNT: '',
            codOficina: '',
            obtenerPlataform:'',
        },
        fromDateModalVisible: false,
        toDateModalVisible: false,
        rutClienteModalVisible: false,
        grupoEconomicoModalVisible: false,
        participanteModalVisible: false,
        motivoModalVisible: false,
        macroBancaModalVisible: false,
        obtenerPlataformaModalVisible:false,
    }

    componentWillMount() {
        const {
            actions: {
                obtenerFilterVisita,
                restaurarBackup,
                obtenerMacroBancas,
                obtenerPlataforma
            },
            colaboradores,
            preguntas,
            respuestas,
            filters,
            backup,
            colaboradoresLista,
            currentUser,
            tipoVisitaR
        } = this.props
        

        const {
            usuarioNTResponsable,
            clienteId,
            grupoEconomico,
            respuestasId,
            fechaVisitaInicio,
            fechaVisitaFin,
            participante,
            privado,
            macrobancaEmpresa,
            jefeNT,
            codOficina,
            priorizada,
            plataformaEmpresa
        } = backup || filters

        const {form} = this.state

        let responsable = {}
        if (usuarioNTResponsable) {
            const resultadoBusqueda = _.find(colaboradores, (col) => col.usuarioNt === usuarioNTResponsable)
            if (!_.isEmpty(resultadoBusqueda)) {
                responsable = {responsable: resultadoBusqueda.nombreColaborador}
            } else {
                responsable = {responsable: participante.usuarioNTResponsable}
            }
        }

        const motivo = _.first(respuestasId)
        const jefeNTCreador = jefeNT.length > 1 ? jefeNT : _.find(colaboradoresLista, (col) => col.usuarioNt === currentUser.usuario).usuarioNtJefe
        this.setState({
            form: {
                ...form,
                ...responsable,
                ...(motivo ? {
                    motivo,
                    motivoNombre: respuestas[_.find(_.keys(preguntas), (k) => preguntas[k].name === 'Motivo de la visita')][motivo].name
                } : {}),
                usuarioNTResponsable,
                rutCliente: clienteId,
                grupoEconomico,
                respuestasId,
                from_date: fechaVisitaInicio ? moment(fechaVisitaInicio).format('YYYY-MM-DDTHH:mm:ssZ') : fechaVisitaInicio,
                end_date: fechaVisitaFin ? moment(fechaVisitaFin).format('YYYY-MM-DDTHH:mm:ssZ') : fechaVisitaFin,
                participante: {
                    responsable: participante.responsable || '',
                    usuarioNTResponsable: participante.usuarioNTResponsable || null,
                },
                priorizada,
                privado,
                macrobancaEmpresa,
                obtenerPlataform:plataformaEmpresa,
                jefeNT: jefeNTCreador,
                codOficina: jefeNT.length > 1 ? codOficina : currentUser.codOficina,
            }
        })

        obtenerFilterVisita(tipoVisitaR)

        if( _.isEmpty(this.props.macroBancas.lista) ) {
            obtenerMacroBancas()
        }

        if( _.isEmpty(this.props.obtenerPlataforma.lista) ) {
            obtenerPlataforma()
        }

        if (_.isEmpty(preguntas)) {
            obtenerFilterVisita(tipoVisitaR)
        } else {
            restaurarBackup()
        }
    }

    componentDidMount() {
        this.props.navigation.setParams({
            clearForm: this.clearForm
        })
    }

    componentWillReceiveProps(nextProps) {
        const {isFetching, navigation: {navigate}, actions: {updateVisitaFilterParams}} = this.props

        if (!isFetching && nextProps.isFetching) {
            this.setState({loadingButton: true})
        }

        if (isFetching && !nextProps.isFetching) {
            this.setState({loadingButton: false})
            updateVisitaFilterParams(this.getFiltersParams())
            navigate('VisitasRealizadas')
        }
    }

    clearForm = () => {
        const form = _.clone(this.state.form)
        this.setState(state => {
            return {
                ...state,
                form: {
                    ...form,
                    from_date: '',
                    end_date: '',
                    rutCliente: '',
                    nombreCliente: '',
                    grupoEconomico: '',
                    motivo: '',
                    motivoNombre: '',
                    participante: {
                        responsable: '',
                        usuarioNTResponsable: '',
                    },
                    nombreParticipante: null,
                    priorizada:false,
                    filtersActive: false,
                    privado: false,
                    macrobancaEmpresa: '',
                    obtenerPlataform:''
                }
            }
        })
    }

    onSetParticipante = (value) => {
        const {nombreColaborador, usuarioNt} = value

        this.setState({
            participanteModalVisible: false,
            form: {
                ...this.state.form,
                participante: {
                    responsable: nombreColaborador,
                    usuarioNTResponsable: usuarioNt,
                },
                filtersActive: true
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
                    filtersActive: true
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
                    filtersActive: true
                }
            }
        })
    }

    onSetEmpresaGrupoEconomico = (value) => {
        if (value.agrupado) {
            const {name} = value

            this.setState(state => {
                return {
                    grupoEconomicoModalVisible: false,
                    form: {
                        ...state.form,
                        grupoEconomico: _.capitalize(name),
                        agrupado: true,
                        rutCliente: '',
                        filtersActive: true
                    }
                }
            })

        } else {
            const {rut, digitoVerificador, nombreEmpresa, nombreGrupo} = value

            this.setState(state => {
                return {
                    grupoEconomicoModalVisible: false,
                    form: {
                        ...state.form,
                        rutCliente: `${rut}${digitoVerificador}`,
                        nombreCliente: nombreEmpresa,
                        grupoEconomico: _.capitalize(nombreGrupo),
                        agrupado: false,
                        filtersActive: true
                    }
                }
            })
        }
    }

    onSetEmpresa = (value) => {
        this.setState(state => {
            return {
                rutClienteModalVisible: false,
                form: {
                    ...state.form,
                    rutCliente: `${value.rut}${value.digitoVerificador}`,
                    nombreCliente: value.nombreEmpresa,
                    grupoEconomico: (value.nombreGrupo === undefined ? '' : value.nombreGrupo),
                    agrupado: false,
                    filtersActive: true,
                }
            }
        })
    }

    onSetMotivoInput = (value) => {
        const {respuestas} = this.props
        const {form} = this.state

        this.setState({
            form: {
                ...form,
                motivo: value,
                motivoNombre: _.find(_.first(_.values(respuestas)), (v, k) => k === value).name,
                filtersActive: true,
            },
            motivoModalVisible: false,

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

    /*onSetprivado = (estado) => {
        this.setState({
            form: {
                ...this.state.form,
                privado: estado,
                filtersActive: estado,
            }
        })
    }*/

    onSetVisitasPrioriazada = (estado) => {
        this.setState({
            form: {
                ...this.state.form,
                priorizada: estado,
                filtersActive: estado,
            }
        })
    }

    getFiltersParams = () => {
        const {currentUser: {usuario, plataforma},tipoVisitaR} = this.props
        const {
            form: {
                from_date,
                end_date,
                rutCliente,
                grupoEconomico,
                motivo,
                participante: {usuarioNTResponsable, responsable},
                privado,
                filtersActive,
                macrobancaEmpresa,
                obtenerPlataform,
                jefeNT,
                priorizada,
                codOficina
            }
        } = this.state
        return {
            usuarioNT: usuario,
            fechaVisitaInicio: from_date,
            fechaVisitaFin: end_date,
            clienteId: rutCliente,
            grupoEconomico: grupoEconomico,
            periodo:"",
            plataforma,
            respuestasId: motivo ? [Number(motivo)] : [],
            pagina: 0,
            limite: 15,
            usuarioNTParticipantes: usuarioNTResponsable === null || usuarioNTResponsable.length === 0  ? [] : [usuarioNTResponsable],
            participante: {
                responsable: responsable,
                usuarioNTResponsable: usuarioNTResponsable,
            },
            filtersActive: filtersActive,
            privado,
            macrobancaEmpresa: macrobancaEmpresa,
            plataformaEmpresa:obtenerPlataform,
            priorizada,
            jefeNT,
            codOficina,
            tipoVisitaR:tipoVisitaR
        }
    }

    handleFilter = () => {
        const {actions: {obtenerListaVisitas}} = this.props
        obtenerListaVisitas(this.getFiltersParams())
    }

    renderFromDatePickerInput = () => {
        const {form: {from_date}, fromDateModalVisible} = this.state

        return (
            <View style={styles.inputContainer}>
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
                                      id: `FechaDesdeFiltroVisitaButton`,
                                      label: `Boton que abre el datepicker en filtro visita`
                                  })}
                >
                    {from_date ? <Text style={styles.inputTitle}>Desde:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `FechaDesdeFiltroVisitaLabel`,
                                  label: `Texto del datepicker en filtro visita`
                              })}
                        >
                            {from_date ? moment(from_date).format('dddd, DD MMMM YYYY') : 'Desde'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/calendar_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderToDatePickerInput = () => {
        const {form: {end_date}, toDateModalVisible} = this.state

        return (
            <View style={styles.inputContainer}>
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
                                      id: `FechaHastaFiltroVisitaButton`,
                                      label: `Boton que abre el datepicker en filtro visita`
                                  })}
                >
                    {end_date ? <Text style={styles.inputTitle}>Hasta:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `FechaHastaFiltroVisitaLabel`,
                                  label: `Texto del datepicker en filtro visita`
                              })}
                        >
                            {end_date ? moment(end_date).format('dddd, DD MMMM YYYY') : 'Hasta'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/calendar_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderRutClienteInput = () => {
        const {rutClienteModalVisible, form: {rutCliente, agrupado, grupoEconomico}} = this.state

        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={rutClienteModalVisible}
                       onRequestClose={() => {
                       }}>
                    <SearchModal
                        title='RUT Cliente'
                        type={TipoBusqueda.RUT_CLIENTE}
                        fromFilters={true}
                        getValue={this.onSetEmpresa}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({rutClienteModalVisible: false})
                        }}
                        />}/>
                </Modal>
                <TouchableOpacity onPress={() => this.setState({rutClienteModalVisible: true})}
                                  {...testID({
                                      id: `RutClienteFiltroVisitaButton`,
                                      label: `Boton que abre el modal de rut cliente en filtro visita`
                                  })}
                >
                    {rutCliente ? <Text style={styles.inputTitle}>RUT cliente*:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text
                            style={styles.inputText}
                            {...testID({
                                id: `RutClienteFiltroVisitaLabel`,
                                label: `Texto del input rut cliente en filtro visita`
                            })}
                        >{agrupado ? `${grupoEconomico}` : rutCliente ? formatoRut(rutCliente) : 'RUT cliente'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderGrupoEconomicoInput = () => {
        const {grupoEconomicoModalVisible, form: {grupoEconomico}} = this.state

        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={grupoEconomicoModalVisible}
                       onRequestClose={() => {
                       }}>
                    <SearchModal
                        title='Grupo Económico'
                        type={TipoBusqueda.GRUPO_ECONOMICO}
                        getValue={this.onSetEmpresaGrupoEconomico}
                        fromFilters={true}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({grupoEconomicoModalVisible: false})
                        }}
                        />}/>
                </Modal>
                <TouchableOpacity onPress={() => this.setState({grupoEconomicoModalVisible: true})}
                                  {...testID({
                                      id: `GrupoEconomicoFiltroVisitaButton`,
                                      label: `Boton que abre el modal de grupo economico en filtro visita`
                                  })}
                >
                    {grupoEconomico ? <Text style={styles.inputTitle}>Grupo económico*:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `GrupoEconomicoFiltroVisitaLabel`,
                                  label: `Texto del input Grupo economico en filtro visita`
                              })}
                        >{grupoEconomico ? grupoEconomico : 'Grupo económico'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderParticipanteInput = () => {
        const {participanteModalVisible, form: {participante}} = this.state

        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={participanteModalVisible}
                       onRequestClose={() => {
                       }}>
                    <SearchModal
                        title='Participante'
                        type={TipoBusqueda.RESPONSABLE}
                        getValue={this.onSetParticipante}
                        fromFilters={true}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({participanteModalVisible: false})
                        }}
                        />}/>
                </Modal>
                <TouchableOpacity onPress={() => this.setState({participanteModalVisible: true})}>
                    {participante.usuarioNTResponsable ?
                        <Text style={styles.inputTitle}>Participante visita:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `ParticipanteFiltroVisitaLabel`,
                                  label: `Texto del input participante en filtro visita`
                              })}
                        >
                            {participante.responsable || 'Participante visita'}
                        </Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderMotivoInput = () => {
        const motivos = _.first(_.values(this.props.respuestas))
        const {motivoModalVisible, form: {motivo, motivoNombre}} = this.state

        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={motivoModalVisible} onRequestClose={() => {
                }}>
                    <ItemListModal
                        list={motivos}
                        title='Motivo de visita'
                        saveSelection={this.onSetMotivoInput}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({motivoModalVisible: false})
                        }}/>}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({motivoModalVisible: true})}
                                  {...testID({
                                      id: `MotivoFiltroVisitaButton`,
                                      label: `Boton que abre el modal de motivo en filtro visita`
                                  })}
                >
                    {motivo ? <Text style={styles.inputTitle}>Motivo de visita:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `MotivoFiltroVisitaLabel`,
                                  label: `Texto del input motivo en filtro visita`
                              })}
                        >{motivo ? motivoNombre : 'Motivo de visita'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /*renderSwitchPrivado = () => {
        const {privado} = this.state.form
        return (
            <View style={styles.switchContainer}>
                <SwitchButton onSetprivado={this.onSetprivado}
                              title={'Visita confidencial'}
                              valueSwitch={privado}
                              disabled={false}
                               {...testID({
                                    id: `BotonConfidencialidad`,
                                    label: `Boton switch para marca una oportunidad confidencial `
                               })}   
                />
            </View>
        )
    }*/

    renderSwitchVisitasPrioriazadas = () => {
        const {form:{priorizada}} = this.state
        return (
            <View style={styles.switchContainer}>
                <SwitchButton onSetprivado={this.onSetVisitasPrioriazada}
                              title={'Visita priorizada'}
                              valueSwitch={priorizada}
                              disabled={false}
                               {...testID({
                                    id: `BotonSwitchVisitaPrioriazada`,
                                    label: `Boton switch para marca una visita Priorizada`
                               })}   
                />
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

    renderForm = () => {
        return (
            <View>
                {this.renderFromDatePickerInput()}
                {this.renderToDatePickerInput()}
                {/*this.renderSwitchPrivado()*/}
                {this.renderSwitchVisitasPrioriazadas()}
                {this.renderRutClienteInput()}
                {this.renderParticipanteInput()}
                {this.renderGrupoEconomicoInput()}
                {this.renderMotivoInput()}
                {this.renderMacrobanca()}
                {this.renderObtenerPlataforma()}
            </View>
        )
    }

    render() {
        const {loadingButton, loading} = this.state

        return (
            <View style={styles.container}>
                <ScrollView style={styles.formContainer}>
                    {loading ? <Loading/> : this.renderForm()}
                </ScrollView>
                <TouchableOpacity onPress={this.handleFilter} style={styles.button}
                                  {...testID({
                                      id: `AplicarFiltroVisitaButton`,
                                      label: `Boton filtra vistas`
                                  })}
                >
                    <Text style={styles.buttonText}>Aplicar</Text>
                    {loadingButton && <ActivityIndicator size="small" color="white"/>}
                </TouchableOpacity>
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FiltroVisitaScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
    },
    formContainer: {
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 20
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
        marginBottom: 50
    },
    switchContainer: {
        justifyContent: 'center',
        paddingTop:15,
    },
    inputTitle: {
        fontSize: 12,
        marginBottom: 5
    },
    inputText: {
        fontSize: 16,
        textTransform: 'capitalize'
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
})
