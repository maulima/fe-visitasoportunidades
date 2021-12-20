import React, {Component} from 'react'
import {View, ScrollView, Image, Text, StyleSheet, TouchableOpacity, Dimensions, RefreshControl,InteractionManager} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {clearVisita} from '../store/actions/visitas'
import {obtenerListaVisitas} from '../store/actions/visitas'
import {getVisitasFiltradas} from '../store/selectors'
import {BACKGROUND_COLOR, GREEN} from '../styles/Colors'
import GoBackButton from '../components/GoBackButton'
import VisitaCard from '../components/VisitaCard'
import FilterButton from '../components/FilterButton'
import Loading from '../components/Loading'
import Unauthorized from '../components/Unauthorized'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'
import {limpiarFilter} from '../store/actions/filtroVisitas'


type Props = {}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        isFetching: state.visitas.isFetching,
        isRefreshing: state.visitas.isRefreshing,
        totalFetched: state.visitas.totalFetched,
        visitas: getVisitasFiltradas(state),
        filters: state.filtroVisitas,
        pagina: state.visitas.pagina,
        error: state.visitas.errorMessage,
        cartera: state.empresas.cartera,
        colaboradores: state.colaboradores.lista,
        tipoVisitaR:state.visitas.tipoVisitaR,
        total:state.visitas.totalV
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({obtenerListaVisitas,limpiarFilter,clearVisita}, dispatch)
    }
}

class VisitasRealizadasScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => {
        const {params = {}} = navigation.state
        const totValidVistR = params.totalVistRealizadas !== undefined ? params.totalVistRealizadas : ''
        const totVistR = totValidVistR === null ? 0 : totValidVistR
        return {
         headerTitle: `Visitas Realizadas(${totVistR})`,
         headerLeft: <GoBackButton onPress={() => {
            navigation.goBack()
         }}/>,
         headerRight: <FilterButton currentScreen={'VisitasRealizadasScreen'} onPress={() => {
            navigation.navigate('FiltroVisitasRealiazadas')
         }}/>
        }
    }

    state = {
        loading: true,
        refreshing: false
    }

    componentDidMount(){
        const {
            actions: {obtenerListaVisitas,clearVisita},
            currentUser: {usuario, plataforma, codOficina},
            colaboradores,
            tipoVisitaR,
            navigation,
            total
        } = this.props
        //clearVisita()
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        const filters = {
            usuarioNT: usuario,
            grupoEconomico: this.props.filters.grupoEconomico,
            fechaVisitaInicio: this.props.filters.fechaVisitaInicio,
            fechaVisitaFin: this.props.filters.fechaVisitaFin,
            clienteId: this.props.filters.clienteId,
            respuestasId: this.props.filters.respuestasId,
            periodo:this.props.filters.periodo,
            plataforma,
            pagina: 0,
            limite: 15,
            usuarioNTParticipantes: [],
            filtersActive: this.props.filters.filtersActive,
            privado: this.props.filters.privado,
            macrobancaEmpresa: this.props.filters.macrobancaEmpresa,
            plataformaEmpresa:this.props.filters.plataformaEmpresa,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            codOficina: codOficina,
            priorizada:this.props.filters.priorizada,
            tipoVisitaR:tipoVisitaR
        }
        
        /*setTimeout(() => {
            obtenerListaVisitas(filters)
        }, 700);*/
        obtenerListaVisitas(filters)
        navigation.setParams({ totalVistRealizadas:total });
    }

    componentWillReceiveProps(nextProps) {
        const { isFetching, total} = this.props

        if (isFetching && !nextProps.isFetching) {
            this.setState({loading: false, refreshing: false,})
        }
        if(total !== nextProps.total){ 
          this.props.navigation.setParams({ totalVistRealizadas:nextProps.total });
        }

    }

    getVisitList = () => {
        const { navigation,tipoVisitaR,visitas } = this.props
        return _.map(visitas, (visita, index) => <VisitaCard key={index}
                                                             index={index}
                                                             visita={visita}
                                                             tipoVisita={tipoVisitaR}
                                                             navigation={navigation}
                                                             cartera={this.props.cartera}
                                                             usuarioNT={this.props.currentUser.usuario}
            />
        )
    }

    siguientePagina = (e) => {
        const {
            actions: {obtenerListaVisitas},
            pagina, isRefreshing, totalFetched,
            currentUser: {usuario, plataforma, codOficina},
            colaboradores,
            tipoVisitaR
        } = this.props
        const {height} = Dimensions.get('window')
        const contentHeight = e.nativeEvent.contentSize.height
        const contentOffsetY = e.nativeEvent.contentOffset.y
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        //const usuarioNTParticipantes = this.props.filters.usuarioNTParticipantes === '' ? [] : this.props.filters.usuarioNTParticipantes
        //const usuarioNTParticipantes = this.props.filters.usuarioNTResponsable === '' ? [] : this.props.filters.usuarioNTResponsable
        //usuarioNTParticipantes
        //const usuarioNTParti = [];
        const usuarioNTParticipantesFilter = this.props.filters.usuarioNTParticipantes === '' ? [] : this.props.filters.usuarioNTParticipantes
        const usuarioNTParticipantes2 = this.props.filters.usuarioNTResponsable === '' ? [] : this.props.filters.usuarioNTResponsable

        const filters =  {
            usuarioNT: usuario,
            grupoEconomico: this.props.filters.grupoEconomico,
            fechaVisitaInicio: this.props.filters.fechaVisitaInicio,
            fechaVisitaFin: this.props.filters.fechaVisitaFin,
            clienteId: this.props.filters.clienteId,
            respuestasId: this.props.filters.respuestasId,
            periodo:this.props.filters.periodo,
            plataforma,
            usuarioNTParticipantes:this.props.filters.filtersActive ? usuarioNTParticipantesFilter : usuarioNTParticipantes2,
            filtersActive:this.props.filters.filtersActive,
            privado: this.props.filters.privado,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            codOficina: codOficina,
            priorizada:this.props.filters.priorizada,
            macrobancaEmpresa: this.props.filters.macrobancaEmpresa,
            plataformaEmpresa:this.props.filters.plataformaEmpresa,
            tipoVisitaR:tipoVisitaR
        }

        if (contentOffsetY > contentHeight - height) {
            if (!isRefreshing && !totalFetched) {
                obtenerListaVisitas({...filters, pagina: pagina + 1, limite: 15})
            }
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true})
        const {
            actions: {obtenerListaVisitas, limpiarFilter},
            currentUser: {usuario, plataforma, codOficina},
            colaboradores,
            tipoVisitaR
        } = this.props
        limpiarFilter()
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        const filters = {
            usuarioNT: usuario,
            grupoEconomico: '',
            fechaVisitaInicio: '',
            fechaVisitaFin: '',
            clienteId: '',
            respuestasId: [],
            plataforma,
            periodo:this.props.filters.periodo,
            pagina: 0,
            limite: 15,
            usuarioNTParticipantes: [],
            privado: false,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            codOficina: codOficina,
            plataformaEmpresa:'',
            macrobancaEmpresa: '',
            priorizada:this.props.filters.priorizada,
            tipoVisitaR:tipoVisitaR
        }
        obtenerListaVisitas({...filters})
    }

    render() {
        const {isRefreshing, visitas, error } = this.props
        const {loading} = this.state
        if (loading) {
            return <Loading/>
        } else if (error === 'unauthorized') {
            return <Unauthorized/>
        } else {
            return (
                <View style={styles.container}>
                    <ScrollView style={{marginTop: 5}} onScroll={(e) => this.siguientePagina(e)}
                                scrollEventThrottle={400}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                                }
                    >
                        {_.isEmpty(visitas) ?
                            <View
                                {...testID({
                                    id: `SinResultadosVisitasContainer`,
                                    label: `Contenedor de mensaje sin resultados de visitas`
                                })}
                            >
                                <Text
                                    {...testID({
                                        id: `SinResultadosVisitasLabel`,
                                        label: `Texto de mensaje sin resultados de visitas`
                                    })}
                                >No hay visitas</Text>
                            </View>
                            :
                            this.getVisitList()
                        }

                        {isRefreshing ?
                            <Loading/> : undefined
                        }
                    </ScrollView>
                </View>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitasRealizadasScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 20,
        paddingRight: 10
    },
    mapButton: {
        borderWidth: 1,
        borderColor: GREEN,
        borderRadius: 50,
        height: 44,
        marginTop: 10,
        marginBottom: 20
    },
    containerTextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textButton: {
        color: GREEN,
        fontSize: 15,
        fontWeight: '500',
        paddingTop: 10,
        paddingLeft: 10
    }
})
