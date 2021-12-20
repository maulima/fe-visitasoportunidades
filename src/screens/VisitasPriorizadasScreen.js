import React, {Component} from 'react'
import {View, ScrollView, Image, Text, StyleSheet,Dimensions, RefreshControl} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {obtenerTipoVisitaPriorizada,clearVisita,clearTipoVisita} from '../store/actions/visitas'
import {getVisitasFiltradas} from '../store/selectors'
import {BACKGROUND_COLOR, GREEN} from '../styles/Colors'
import GoBackButton from '../components/GoBackButton'
import FilterButton from '../components/FilterButton'
import Loading from '../components/Loading'
import Unauthorized from '../components/Unauthorized'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'
import {limpiarFilter} from '../store/actions/filtroVisitas'
import VisitaPriorizadaCard from '../components/VisitaPriorizadaCard';

type Props = {}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        isFetching: state.visitas.isFetching,
        isRefreshing: state.visitas.isRefreshing,
        totalFetched: state.visitas.totalFetched,
        visitas: state.visitas.lista,
        filters: state.filtroVisitas,
        pagina: state.visitas.pagina,
        error: state.visitas.errorMessage,
        cartera: state.empresas.cartera,
        colaboradores: state.colaboradores.lista,
        tipoVisitaPR:state.visitas.tipoVisitaPR,
        total:state.visitas.totalVPR
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({obtenerTipoVisitaPriorizada,limpiarFilter,clearVisita,clearTipoVisita}, dispatch)
    }
}

class VisitasPriorizadasScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => {
        const {params = {}} = navigation.state
        const totVistPr = params.totalVistPriorizada !== undefined ? params.totalVistPriorizada : ''
        return {
         headerTitle: `Visitas Priorizadas (${totVistPr})`,
         headerLeft: <GoBackButton onPress={() => {
            navigation.goBack()
         }}/>,
         headerRight: <FilterButton currentScreen={'VisitasPriorizadasScreen'} onPress={() => {
            navigation.navigate('FiltroVisitasPriorizadas')
         }}/>
        }
    }

    state = {
        loading: true,
        refreshing: false,
    }

     componentDidMount() {
        const {
            actions: {obtenerTipoVisitaPriorizada,clearVisita,clearTipoVisita},
            currentUser: {usuario, plataforma, codOficina},
            colaboradores,
            tipoVisitaPR,
            navigation,
            total
        } = this.props
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        const filters = {
            usuarioNT: usuario,
            grupoEconomico: this.props.filters.grupoEconomico,
            periodo:this.props.filters.periodo,
            fechaVisitaInicio: this.props.filters.fechaVisitaInicio,
            fechaVisitaFin: this.props.filters.fechaVisitaFin,
            clienteId: this.props.filters.clienteId,
            respuestasId: this.props.filters.respuestasId,
            respuestasId2: this.props.filters.respuestasId2,
            plataforma,
            pagina: 0,
            limite: 20,
            usuarioNTParticipantes: [],
            filtersActive: this.props.filters.filtersActive,
            privado: this.props.filters.privado,
            macrobancaEmpresa: this.props.filters.macrobancaEmpresa,
            plataformaEmpresa:this.props.filters.plataformaEmpresa,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            codOficina: codOficina,
            tipoVisitaPR:tipoVisitaPR
        }
        setTimeout(() => {
            obtenerTipoVisitaPriorizada(filters) 
        }, 700);
        navigation.setParams({ totalVistPriorizada:total });  
    }

    componentWillReceiveProps(nextProps) {    
        const { isFetching,total } = this.props
     
        if (isFetching && !nextProps.isFetching) {
            this.setState({loading: false, refreshing: false,})
        }
        
        if(total !== nextProps.total){
          this.props.navigation.setParams({ totalVistPriorizada: nextProps.total });
        }
    }
     

    getPriorizadasList = () => {
        const {visitas, navigation,tipoVisitaPR} = this.props
        return _.map(visitas, (visita, index) => <VisitaPriorizadaCard
                                                             key={index}
                                                             index={index}
                                                             visita={visita}
                                                             contador={index+1}
                                                             navigation={navigation}
                                                             cartera={this.props.cartera}
                                                             tipoVisita={tipoVisitaPR}
                                                             usuarioNT={this.props.currentUser.usuario}
            />
        )                                                                          
    }

    siguientePagina = (e) => {
        const {
            actions: {obtenerTipoVisitaPriorizada},
            pagina, isRefreshing, totalFetched,
            currentUser: {usuario, plataforma, codOficina},
            colaboradores,
            tipoVisitaPR
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
            periodo:this.props.filters.periodo,
            fechaVisitaInicio: this.props.filters.fechaVisitaInicio,
            fechaVisitaFin: this.props.filters.fechaVisitaFin,
            clienteId: this.props.filters.clienteId,
            respuestasId: this.props.filters.respuestasId,
            respuestasId2: this.props.filters.respuestasId2,
            plataforma,
            usuarioNTParticipantes:this.props.filters.filtersActive ? usuarioNTParticipantesFilter : usuarioNTParticipantes2,
            filtersActive:this.props.filters.filtersActive,
            privado: this.props.filters.privado,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            codOficina: codOficina,
            macrobancaEmpresa: this.props.filters.macrobancaEmpresa,
            plataformaEmpresa:this.props.filters.plataformaEmpresa,
            tipoVisitaPR:tipoVisitaPR
        }

        if (contentOffsetY > contentHeight - height) {
            if (!isRefreshing && !totalFetched) {
                obtenerTipoVisitaPriorizada({...filters, pagina: pagina + 1, limite: 20})
            }
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true})
        const {
            actions: {obtenerTipoVisitaPriorizada, limpiarFilter},
            currentUser: {usuario, plataforma, codOficina},
            colaboradores,
            tipoVisitaPR
        } = this.props
        limpiarFilter()
        clearVisita()
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        const filters = {
            usuarioNT: usuario,
            grupoEconomico: '',
            periodo:this.props.filters.periodo,
            fechaVisitaInicio: '',
            fechaVisitaFin: '',
            clienteId: '',
            respuestasId: [],
            plataforma,
            pagina: 0,
            limite: 20,
            usuarioNTParticipantes: [],
            privado: false,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            codOficina: codOficina,
            macrobancaEmpresa: '',
            plataformaEmpresa:'',
            tipoVisitaPR:tipoVisitaPR
        }
        obtenerTipoVisitaPriorizada({...filters})
    }

    componentWillUnmount(){
        const { actions:{clearVisita}} = this.props

        clearVisita()
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
                            this.getPriorizadasList()
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

export default connect(mapStateToProps, mapDispatchToProps)(VisitasPriorizadasScreen)

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
