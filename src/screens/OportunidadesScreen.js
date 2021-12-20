import React, {Component} from 'react'
import {Dimensions, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'

import {BACKGROUND_COLOR, BLACK} from '../styles/Colors'
import {clearOportunidad, obtenerListaOportunidad} from '../store/actions/oportunidades'
import {obtenerFormOportunidad} from '../store/actions/formularioOportunidad'
import {getEstadoOportunidadActiva, getOportunidadesFiltradas} from '../store/selectors'
import {formatearMonto} from '../utils/StringHelper'
import {idsArrayParse} from '../utils/ArrayHelper'
import OportunidadCard from '../components/OportunidadCard'
import FilterButton from '../components/FilterButton'
import Loading from '../components/Loading'
import Unauthorized from '../components/Unauthorized'
import {limpiarFilter} from '../store/actions/filtroOportunidades'


const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process
    const {lista, monto} = getOportunidadesFiltradas(state)

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        filters: state.filtroOportunidades,
        isFetching: state.oportunidades.isFetching,
        isRefreshing: state.oportunidades.isRefreshing,
        totalFetched: state.oportunidades.totalFetched,
        error: state.oportunidades.errorMessage,
        hasErrorGetOportunidad: state.oportunidades.hasErrorGetOportunidad,
        hasError: state.oportunidades.hasError,
        oportunidades: lista,
        montoOportunidades: monto,
        estadoOportunidad: getEstadoOportunidadActiva(state),
        pagina: state.oportunidades.pagina,
        colaboradores: state.colaboradores.lista,
        cartera: state.empresas.cartera,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerListaOportunidad,
            obtenerFormOportunidad,
            clearOportunidad,
            limpiarFilter,
        }, dispatch)
    }
}

type Props = {}

class OportunidadesScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: 'Oportunidades',
        tabBarTestID:'NombreOportunidad',
        headerRight: <FilterButton currentScreen={'OportunidadesScreen'} onPress={() => {
            navigation.navigate('FiltroOportunidades')
        }}/>
    })

    state = {
        loading: true,
        refreshing: false,
    }

    componentWillMount() {
        const {
            filters, estadoOportunidad,
            actions: {obtenerListaOportunidad, obtenerFormOportunidad, clearOportunidad},
            currentUser: {plataforma, usuario, codOficina},
            colaboradores
        } = this.props
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        let {
            usuarioNTResponsable,
            estadoId,
            respuestasId,
            clienteId,
            fechaInicioCierre,
            fechaFinCierre,
            privado,
            macrobancaEmpresa,
            plataformaEmpresa
        } = filters
        const platformEmpr = plataformaEmpresa === undefined ? '' : plataformaEmpresa
        clearOportunidad()
        obtenerListaOportunidad({
            usuarioNTResponsable,
            clienteId,
            fechaInicioCierre,
            fechaFinCierre,
            plataforma,
            usuarioNT: usuario,
            estadoId: estadoId || 1,
            respuestasId: idsArrayParse(respuestasId),
            pagina: 0,
            limite: 15,
            privado,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            macrobancaEmpresa,
            plataformaEmpresa:platformEmpr,
            codOficina: codOficina,
        })
        obtenerFormOportunidad(estadoOportunidad)
    }

    componentWillReceiveProps(nextProps) {
        const {isFetching} = this.props

        if (isFetching && !nextProps.isFetching) {
            this.setState({loading: false})
        }
    }

    getOportunidadesList = () => {
        const {navigation, oportunidades} = this.props
        const {loading} = this.state
        if (loading) {
            return <Loading/>
        }
        if (_.isEmpty(oportunidades)) {
            return <View
                {...testID({
                    id: 'SinResultadosOportunidadesContainer',
                    label: 'Contenedor del texto sin resultados de oportunidades'
                })
                }
            >
                <Text
                    {...testID({
                        id: 'SinResultadosOportunidadesLabel',
                        label: 'Texto sin resultados oportunidades'
                    })
                    }
                >No hay oportunidades</Text>
            </View>
        }

        return Object.keys(oportunidades || {}).map(key => {
            return <OportunidadCard key={key} index={Number(key) + 1}
                                    oportunidad={oportunidades[key]}
                                    navigation={navigation}
                                    cartera={this.props.cartera}
            />
        })
    }

    siguientePagina = (e) => {
        const {
            actions: {obtenerListaOportunidad},
            pagina, isRefreshing, totalFetched,
            currentUser: {usuario, plataforma, codOficina},
            colaboradores
        } = this.props
        const {height} = Dimensions.get('window')
        const contentHeight = e.nativeEvent.contentSize.height
        const contentOffsetY = e.nativeEvent.contentOffset.y
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)

        const platformEmpr = this.props.filters.plataformaEmpresa === undefined ? '' : this.props.filters.plataformaEmpresa
        const filters = {
            usuarioNTResponsable: this.props.filters.usuarioNTResponsable,
            clienteId: this.props.filters.clienteId,
            fechaInicioCierre: this.props.filters.fechaInicioCierre,
            fechaFinCierre: this.props.filters.fechaFinCierre,
            estadoId: this.props.filters.estadoId,
            respuestasId: this.props.filters.respuestasId,
            usuarioNT: usuario,
            plataforma,
            privado: this.props.filters.privado,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            macrobancaEmpresa: this.props.filters.macrobancaEmpresa,
            plataformaEmpresa:platformEmpr,
            codOficina: codOficina,
        }

        if (contentOffsetY > contentHeight - height) {
            if (!isRefreshing && !totalFetched) {
                obtenerListaOportunidad({...filters, pagina: pagina + 1, limite: 15})
            }
        }
    }

    _onRefresh = () => {
        const {
            actions: {obtenerListaOportunidad, clearOportunidad, limpiarFilter},
            currentUser: {plataforma, usuario, codOficina},
            colaboradores
        } = this.props
        const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
        clearOportunidad()
        limpiarFilter()
        obtenerListaOportunidad({
            usuarioNTResponsable: '',
            clienteId: '',
            fechaInicioCierre: '',
            fechaFinCierre: '',
            plataforma: plataforma,
            usuarioNT: usuario,
            estadoId: 1,
            respuestasId: [],
            pagina: 0,
            limite: 15,
            privado: false,
            jefeNT: jefeNTCreador.usuarioNtJefe,
            macrobancaEmpresa: '',
            plataformaEmpresa: '',
            codOficina: codOficina,
        })
    }

    render() {
        const {loading} = this.state
        const {montoOportunidades, isRefreshing, error, hasErrorGetOportunidad, hasError} = this.props

        if (error === 'unauthorized' && hasError === true) {
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
                        <View style={styles.summaryOportunidad}
                              {...testID({
                                  id: 'totalMontoOportunidades',
                                  label: 'Contenedor del monto total de oportunidades'
                              })
                              }
                        >
                            <Text style={styles.filterLabel}>Total:</Text>
                            <Text
                                style={styles.total}>{loading ? 'Cargando...' : `$${formatearMonto(parseInt(montoOportunidades))}`}</Text>
                        </View>

                        {this.getOportunidadesList()}

                        {isRefreshing ?
                            <Loading/> : undefined
                        }
                    </ScrollView>
                </View>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OportunidadesScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 10,
        paddingRight: 10
    },
    summaryOportunidad: {
        borderWidth: 1,
        borderColor: BLACK,
        borderRadius: 55,
        height: 60,
        marginTop: 10,
        marginBottom: 20,
        paddingTop: 5
    },
    filterLabel: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600'
    },
    total: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: '600'
    }
})
