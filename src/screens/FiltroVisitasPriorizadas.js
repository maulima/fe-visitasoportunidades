import React, {Component} from 'react'
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {obtenerTipoVisitaPriorizada} from '../store/actions/visitas'
import {
    limpiarFilter,
    obtenerFilterPriorizadaVisita,
    restaurarBackup,
    updateVisitaFilterParams,
} from '../store/actions/filtroVisitas'
import {obtenerMacroBancas} from '../store/actions/macroBancas'
import { obtenerPlataforma } from '../store/actions/obtenerPlataforma'
import { obtenerPeriodos } from '../store/actions/obtenerPeriodos'
import _ from 'lodash'

import {BACKGROUND_COLOR, BLACK, BROWN_GREY, GREEN, WHITE} from '../styles/Colors'
import CloseModalButton from '../components/CloseModalButton'
import ClearFilterButton from '../components/ClearFilterButton'
import Loading from '../components/Loading'
import SearchModal from '../components/SearchModal'
import ItemListModal from '../components/ItemListModal'
import {TipoBusqueda} from '../constants/Data'
import GoBackButton from '../components/GoBackButton'
import {formatoRut} from '../utils/StringHelper'
import testID from '../../custom_node_modules/react-native-testid'

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
        obtenerPeriodos:state.obtenerPeriodos,
        colaboradoresLista: state.colaboradores.lista,
        tipoVisitaPR:state.visitas.tipoVisitaPR
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerTipoVisitaPriorizada,
            limpiarFilter,
            updateVisitaFilterParams,
            obtenerFilterPriorizadaVisita,
            restaurarBackup,
            obtenerMacroBancas,
            obtenerPlataforma,
            obtenerPeriodos
        }, dispatch)
    }
}

class FiltroVisitaPriorizadasScreen extends Component<Props> {
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
            motivo2: '',
            motivoNombre2: '',
            participante: {
                responsable: '',
                usuarioNTResponsable: null,
            },
            agrupado: '',
            filtersActive: false,
            privado: false,
            macrobancaEmpresa: '',
            obtenerPlataform:'',
            obtenerPeriodo:'',
            jefeNT: '',
            codOficina: '',
        },
        fromDateModalVisible: false,
        toDateModalVisible: false,
        rutClienteModalVisible: false,
        grupoEconomicoModalVisible: false,
        participanteModalVisible: false,
        motivoModalVisible: false,
        macroBancaModalVisible: false,
        obtenerPlataformaModalVisible:false,
        gestionVisitaModalVisible:false,
        detalleOrigenModalVisible:false,
        obtenerPeriodosModalVisible:false
    }

    componentWillMount() {
        const { 
            actions: {
                obtenerFilterPriorizadaVisita,
                restaurarBackup,
                obtenerMacroBancas,
                obtenerPlataforma,
                obtenerPeriodos
            },
            colaboradores,
            preguntas,
            respuestas,
            filters,
            backup,
            colaboradoresLista,
            currentUser,
            tipoVisitaPR
        } = this.props

        const {
            usuarioNTResponsable,
            clienteId,
            grupoEconomico,
            respuestasId,
            respuestasId2,
            participante,
            privado,
            macrobancaEmpresa,
            jefeNT,
            codOficina,
            plataformaEmpresa,
            periodo
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
        const motivo2 = _.first(respuestasId2)
        const jefeNTCreador = jefeNT.length > 1 ? jefeNT : _.find(colaboradoresLista, (col) => col.usuarioNt === currentUser.usuario).usuarioNtJefe
    
        
        this.setState({
            form: {
                ...form,
                ...responsable,
                ...(motivo ? {
                    motivo,
                    motivoNombre: respuestas[_.find(_.keys(preguntas), (k) => preguntas[k].name === 'Detalle del origen')][motivo].name
                } : {}),
                ...(motivo2 ? {
                    motivo2,
                    motivoNombre2: respuestas[_.find(_.keys(preguntas), (k) => preguntas[k].name === 'Gestión de la visita')][motivo2].name
                } : {}),
                respuestasId2,
                usuarioNTResponsable,
                rutCliente: clienteId,
                grupoEconomico,
                obtenerPeriodo:periodo,
                respuestasId,
                participante: {
                    responsable: participante.responsable || '',
                    usuarioNTResponsable: participante.usuarioNTResponsable || null,
                },
                privado,
                macrobancaEmpresa,
                obtenerPlataform:plataformaEmpresa,
                jefeNT: jefeNTCreador,
                codOficina: jefeNT.length > 1 ? codOficina : currentUser.codOficina,
            }
        })

         
        obtenerFilterPriorizadaVisita(tipoVisitaPR)

        if( _.isEmpty(this.props.macroBancas.lista) ) {
            obtenerMacroBancas()
        }

        if( _.isEmpty(this.props.obtenerPlataforma.lista) ) {
            obtenerPlataforma()
        }

        if( _.isEmpty(this.props.obtenerPeriodos.lista) ){
           obtenerPeriodos()
        }

        if (_.isEmpty(preguntas)) {
            //obtenerFilterVisita(tipoVisitaPR)
            obtenerFilterPriorizadaVisita(tipoVisitaPR)
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
        const {isFetching,navigation: {navigate}, actions: {updateVisitaFilterParams}} = this.props

        if (!isFetching && nextProps.isFetching) {
            this.setState({loadingButton: true})
        }

        if (isFetching && !nextProps.isFetching) {
            this.setState({loadingButton: false})
            updateVisitaFilterParams(this.getFiltersParams())
            navigate('VisitasPriorizadas')
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
                    motivoNombre:'',
                    motivo2:'',
                    motivoNombre2:'',
                    participante: {
                        responsable: '',
                        usuarioNTResponsable: '',
                    },
                    nombreParticipante: null,
                    filtersActive: false,
                    privado: false,
                    macrobancaEmpresa: '',
                    obtenerPlataform:'',
                    plataformaEmpresa:'',
                    obtenerPeriodo:'',
                    detalleOrigen:''
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

    onSetObtenerPeriodosInput = (value) => {
        const { form } = this.state
        const {obtenerPeriodos: {lista}} = this.props
     
        this.setState({
            form: {
                ...form,
                obtenerPeriod: value,
                obtenerPeriodo: lista[value].name,
                filtersActive: true,
            },
            obtenerPeriodosModalVisible: false,
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

    onSetGestionVisitaInput = (value) => {
        const {respuestas} = this.props
        const {form} = this.state
        this.setState({
            form: {
                ...form,
                motivo2: value,
                motivoNombre2: _.find(_.first(_.values(respuestas)), (v, k) => k === value).name,
                filtersActive: true,
            },
            gestionVisitaModalVisible: false,
        })
    }

    onSetDetalleOrigenInput = (value) => {
        const {respuestas} = this.props
        const {form} = this.state
        this.setState({
            form: {
                ...form,
                motivo: value,
                motivoNombre: _.find(_.last(_.values(respuestas)), (v, k) => k === value).name,
                filtersActive: true,
            },
            detalleOrigenModalVisible: false,
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
                    grupoEconomico: (value.nombreGrupo === undefined ? '' : value.nombreGrupo),
                    agrupado: false,
                    filtersActive: true,
                }
            }
        })
    }

    getFiltersParams = () => {
        const {currentUser: {usuario, plataforma},tipoVisitaPR} = this.props
        const {
            form: {
                rutCliente,
                grupoEconomico,
                motivo,
                motivo2,
                participante: {usuarioNTResponsable, responsable},
                privado,
                filtersActive,
                macrobancaEmpresa,
                obtenerPlataform,
                obtenerPeriodo,
                jefeNT,
                codOficina
            }
        } = this.state

        return {
            usuarioNT: usuario,
            clienteId: rutCliente,
            grupoEconomico: grupoEconomico,
            periodo:obtenerPeriodo,
            plataforma,
            respuestasId: motivo ? [Number(motivo)] : [] ,
            respuestasId2: motivo2 ? [Number(motivo2)] : [],
            pagina: 0,
            limite: 20,
            usuarioNTParticipantes: usuarioNTResponsable === null || usuarioNTResponsable.length === 0  ? [] : [usuarioNTResponsable],
            participante: {
                responsable: responsable,
                usuarioNTResponsable: usuarioNTResponsable,
            },
            filtersActive: filtersActive,
            privado,
            macrobancaEmpresa: macrobancaEmpresa,
            plataformaEmpresa:obtenerPlataform,
            jefeNT,
            codOficina,
            tipoVisitaPR:tipoVisitaPR
        }
    }

    handleFilter = () => {
    const {actions: {obtenerTipoVisitaPriorizada}} = this.props
        obtenerTipoVisitaPriorizada(this.getFiltersParams())
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
                                      label: `Boton que abre el modal de rut cliente en filtro visita prioriazadas`
                                  })}
                >
                    {rutCliente ? <Text style={styles.inputTitle}>RUT cliente*:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text
                            style={styles.inputText}
                            {...testID({
                                id: `RutClienteFiltroVisitaLabel`,
                                label: `Texto del input rut cliente en filtro visita prioriazadas`
                            })}
                        >{agrupado ? `${grupoEconomico}` : rutCliente ? formatoRut(rutCliente) : 'RUT cliente'}</Text>
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
                                  id: `ParticipanteFiltroVisitaPriorizadaLabel`,
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

    renderSwitchPrivado = () => {
        const {privado} = this.state.form
        return (
            <View style={styles.switchContainer}>
                {/*<SwitchButton onSetprivado={this.onSetprivado}
                              title={'Visita confidencial'}
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
                                      id: `macroBancaFiltroVisitaPriorizadaButton`,
                                      label: `Boton que abre el modal de macroBanca en filtro visita Prioriazada`
                                  })}
                >
                    {macrobancaEmpresa ? <Text style={styles.inputTitle}>Macrobanca:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `macroBancaFiltroVisitaLabel`,
                                  label: `Texto del input macroBanca en filtro visita Priorizada`
                              })}
                        >{macrobancaEmpresa ? macrobancaEmpresa : 'Macrobanca'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    renderGestionVisitaInput = () => {
        const motivos = _.first(_.values(this.props.respuestas))
        const {gestionVisitaModalVisible, form: {motivo2, motivoNombre2}} = this.state
        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={gestionVisitaModalVisible} onRequestClose={() => {
                }}>
                    <ItemListModal
                        list={motivos}
                        title='Gestion de la visita'
                        saveSelection={this.onSetGestionVisitaInput}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({gestionVisitaModalVisible: false})
                        }}/>}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({gestionVisitaModalVisible: true})}
                                  {...testID({
                                      id: `MotivoFiltroVisitaButton`,
                                      label: `Boton que abre el modal de motivo en filtro visita`
                                  })}
                >
                    {motivo2 ? <Text style={styles.inputTitle}>Gestion de la visita:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `MotivoFiltroVisitaLabel`,
                                  label: `Texto del input motivo en filtro visita`
                              })}
                        >{motivo2 ? motivoNombre2 : 'Gestion de la visita'}</Text>
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
            <View style={styles.inputContainer}>
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
                                      id: `PlataformaFiltroVisitaPrioriazadaButton`,
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
    

    renderDetalleOrigen = () => {
        const motivos = _.last(_.values(this.props.respuestas))
        const {detalleOrigenModalVisible, form: {motivo, motivoNombre}} = this.state
        return (
            <View style={styles.inputContainer}>
                <Modal animationType={'slide'} transparent={false} visible={detalleOrigenModalVisible} onRequestClose={() => {
                }}>
                    <ItemListModal
                        list={motivos}
                        title='Detalle Origen'
                        saveSelection={this.onSetDetalleOrigenInput}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({detalleOrigenModalVisible: false})
                        }}/>}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({detalleOrigenModalVisible: true})}
                                  {...testID({
                                      id: `DetalleOrigenFiltroVisitaPriorizadaButton`,
                                      label: `Boton que abre el modal detalle origen en filtro visita priorizada`
                                  })}
                >
                    {motivo ? <Text style={styles.inputTitle}>Detalle Origen:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `DetalleOrigenFiltroVisitaPriorizadaLabel`,
                                  label: `Texto del input Detalle origen en filtro visita Prioriazada`
                              })}
                        >{motivo ? motivoNombre : 'Detalle Origen'}</Text>
                        <Image style={{marginRight: 10}}
                               source={require('./../../assets/images/icons/down_arrow_icon.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }


    renderObtenerPeriodos = () => {
        const {obtenerPeriodosModalVisible, form: {obtenerPeriodo}} = this.state
        const {obtenerPeriodos: {lista}} = this.props
        return (
            <View style={styles.inputContainerPeriodo}>
                <Modal animationType={'slide'} transparent={false} visible={obtenerPeriodosModalVisible}
                       onRequestClose={() => {
                       }}>
                    <ItemListModal
                        list={lista}
                        title='Periodo'
                        saveSelection={this.onSetObtenerPeriodosInput}
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({obtenerPeriodosModalVisible: false})
                        }}/>}
                    />
                </Modal>
                <TouchableOpacity onPress={() => this.setState({obtenerPeriodosModalVisible: true})}
                                  {...testID({
                                      id: `PeriodoFiltroVisitaPriorizadaButton`,
                                      label: `Boton que abre el modal de Periodo en filtro visita Priorizada`
                                  })}
                >
                    {obtenerPeriodo ? <Text style={styles.inputTitle}>Periodo:</Text> : null}
                    <View style={styles.itemContainer}>
                        <Text style={styles.inputText}
                              {...testID({
                                  id: `PeriodoFiltroVisitaPriorizadaLabel`,
                                  label: `Texto del input Periodo en filtro visita Priorizada`
                              })}
                        >{obtenerPeriodo ? obtenerPeriodo : 'Periodo'}</Text>
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
                {this.renderRutClienteInput()}
                {this.renderParticipanteInput()}
                {/*this.renderSwitchPrivado()*/}
                {this.renderDetalleOrigen()}
                {this.renderMacrobanca()}
                {this.renderObtenerPlataforma()}
                {this.renderGestionVisitaInput()}
                {this.renderObtenerPeriodos()}
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

export default connect(mapStateToProps, mapDispatchToProps)(FiltroVisitaPriorizadasScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR
    },
    formContainer: {
        paddingTop: 20,
        paddingRight: 20,
        paddingLeft: 20,
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
        marginBottom: 25
    },
    inputContainerPeriodo:{
       borderBottomWidth: 1,
       borderBottomColor: BLACK,
       paddingBottom: 10,
       justifyContent: 'center',
       marginTop: 20,
       marginBottom: 35
   },
    switchContainer: {
        paddingBottom: 10,
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10
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
