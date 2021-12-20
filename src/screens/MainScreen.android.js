import React, { Component } from 'react'
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, BackHandler,Image,ImageBackground,AsyncStorage,Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Col, Row } from '../components/Grid'
import NotificacionesIconHome from '../components/NotificacionesIconHome'
import testID from '../../custom_node_modules/react-native-testid'
import moment from 'moment'
import uuidv1 from 'uuid/v1'
import {BuildVersion} from '../constants/Data'

import { BACKGROUND_COLOR, OCEAN_BLUE } from '../styles/Colors'
import { getEstadoOportunidadActiva } from '../store/selectors'
import { obtenerGrupoEconomicos } from '../store/actions/gruposEconomicos'
import { obtenerColaboradores } from '../store/actions/colaboradores'
import { agregarPlataforma } from '../store/actions/auth'
import { obtenerCartera } from '../store/actions/empresas'
import { obtenerEstadosOportunidad } from '../store/actions/estadosFormularioOportunidad'
import { obtenerFormOportunidad } from '../store/actions/formularioOportunidad'
import { updateOportunidadFilterParams } from '../store/actions/filtroOportunidades'
import { registerEnroladorDevice }from '../store/actions/enroladorDevice'
import { cantMensajesNoLeidos } from '../store/actions/mensajesNotificaciones'
import { obtenerCantidadVisitaPriorizada,obtenerOportunidadesVencidad,obtenerTipoVisita} from '../store/actions/visitas'
import ButtonSignOut from '../components/ButtonSignOut'
import SectionCard from '../components/SectionCard'
import Loading from '../components/Loading'
import _ from 'lodash'

import DeviceInfo from 'react-native-device-info';


const mapStateToProps = (state) => {
    const { env: { API_ENV } } = process

    return {
        loggedIn: state.auth.loggedIn,
        currentUser:  API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        colaboradores: state.colaboradores.lista,
        isFetchingEstados: state.estadosOportunidad.isFetching,
        isFetchingFormOportunidad: state.formularioOportunidad.isFetching,
        isFetchingGruposEconomicos: state.gruposEconomicos.isFetching,
        isFetchingCartera: state.empresas.isFetchingCartera,
        isFetchingColaboradores: state.colaboradores.isFetching,
        estadoActivo: getEstadoOportunidadActiva(state),
        cantVistPrio:state.visitas.cantVistPrio,
        oportunidadVencidad:state.visitas.oportunidadVencidad,
        tipoVisitaR: state.visitas.tipoVisitaR
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerGrupoEconomicos,
            obtenerCartera,
            obtenerColaboradores,
            obtenerEstadosOportunidad,
            obtenerFormOportunidad,
            updateOportunidadFilterParams,
            agregarPlataforma,
            registerEnroladorDevice,
            cantMensajesNoLeidos,
            obtenerCantidadVisitaPriorizada,
            obtenerOportunidadesVencidad,
            obtenerTipoVisita
        }, dispatch)
    }
}

type Props = {}

class MainScreen extends Component<Props> {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: 'Bienvenido',
        headerTitleStyle: {
            marginLeft: 55,
            textAlign:"center", 
            flex:1,  
            padding: 0,
            elevation: 0, // remove shadow on Android
        },
        cardStyle: {
            shadowColor: 'transparent'
        },
        headerRight: <View style={{marginTop:2,flexDirection:'row'}}>
                       <NotificacionesIconHome navigation={navigation} />
                       <ButtonSignOut onPress={() => {
                          navigation.navigate('Settings')
                       }}/>
                </View>
    })

    state = {
        loading: true,
        formularioOportunidadLoaded: false
    }

    componentWillMount () {
        const {loggedIn, navigation: { navigate } } = this.props
        if (!loggedIn) navigate('AuthLoading')
    }

    async componentDidMount() {
        const { currentUser, actions: {
            obtenerGrupoEconomicos,
            obtenerCartera,
            obtenerColaboradores,
            obtenerEstadosOportunidad,
            obtenerFormOportunidad,
            registerEnroladorDevice,
            cantMensajesNoLeidos,
            obtenerTipoVisita
        } } = this.props
                
        
        const paramsConst = {
            //fechaDesde : moment(`01-01-${n}`).format("YYYY-MM-DD") ,
            fechaHasta : moment(new Date()).format("YYYY-MM-DD"),
        }    

        const { fechaHasta } = paramsConst; 
        
        const { codOficina } = currentUser

        if (currentUser.usuario) {
            const usuario = currentUser.usuario.trim()

            if (currentUser.rol === 'Banquero')
                obtenerCartera({ codigoOficina: codOficina, codigoEjecutivo: usuario })

            obtenerGrupoEconomicos(usuario)
            obtenerColaboradores(usuario)
            obtenerEstadosOportunidad()
            obtenerFormOportunidad(1)
            cantMensajesNoLeidos({fechaHasta})
            obtenerTipoVisita()
        }   
          
            // const enroladorDevice = {}
            // let fcmToken = await AsyncStorage.getItem('fcmToken');
            // const {OS} = Platform
            // const OSVersion = `${OS} ${Platform.Version}`
            //
            // enroladorDevice.rutColaborador = currentUser.rut
            // enroladorDevice.dvColaborador = currentUser.digitoVerif
            // enroladorDevice.nombreColaborador = currentUser.nombreCompleto
            // enroladorDevice.apellidoMaterno = currentUser.nombreCompleto
            // enroladorDevice.apellidoPaterno = currentUser.nombreCompleto
            // enroladorDevice.aplicacion = 'visitas_tubos_prod'
            // enroladorDevice.versionAplicacion = `${BuildVersion}`
            // enroladorDevice.proveedorCanal =  Platform.OS === 'android' ? 'Google' : null
            // enroladorDevice.token = fcmToken
            // enroladorDevice.uuidDispositivo = uuidv1()
            // enroladorDevice.dispositivo = {}
            // enroladorDevice.dispositivo.idDispositivo = '-1'
            // enroladorDevice.dispositivo.modeloDispositivo =  DeviceInfo.getModel();
            // enroladorDevice.dispositivo.proveedorDispositivo = DeviceInfo.getManufacturer();
            // enroladorDevice.dispositivo.proveedorSO = OSVersion
            // enroladorDevice.dispositivo.versionSO = Platform.Version
            //
            // registerEnroladorDevice(enroladorDevice)

            this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                this.props.navigation.goBack(); // works best when the goBack is async
                return true;
            });
    }

    componentWillReceiveProps(nextProps) {
        const {
            actions: {
                agregarPlataforma,
                obtenerCantidadVisitaPriorizada,
                obtenerOportunidadesVencidad
            },
            currentUser,
            isFetchingEstados,
            isFetchingFormOportunidad,
            isFetchingColaboradores,
        } = this.props

        if (isFetchingEstados !== nextProps.isFetchingEstados && !nextProps.isFetchingEstados) {
            this.handleDefaultOportunidadFilter()
        }

        if (isFetchingFormOportunidad && !nextProps.isFetchingFormOportunidad) {
            this.setState({ formularioOportunidadLoaded: true })
        }

        if (isFetchingColaboradores && !nextProps.isFetchingColaboradores) {
            const myself = _.find(nextProps.colaboradores, (col) => col.usuarioNt === currentUser.usuario)

            if (myself) agregarPlataforma(myself.centroCosto)

            obtenerCantidadVisitaPriorizada({
                usuarioNT:myself.usuarioNt,
                jefeNT:myself.usuarioNtJefe
            })

            obtenerOportunidadesVencidad({
                usuarioNT:myself.usuarioNt,
                jefeNT:myself.usuarioNtJefe
            })
        }
    }

    componentDidUpdate () {
        const {
            isFetchingGruposEconomicos,
            isFetchingCartera,
            isFetchingColaboradores,
        } = this.props 

        const { loading } = this.state

        if (loading && !isFetchingGruposEconomicos && !isFetchingCartera && !isFetchingColaboradores) {
            this.setState({loading: false})
        }
    }

    handleDefaultOportunidadFilter = () => {
        const { estadoActivo, actions: { updateOportunidadFilterParams } } = this.props

        let params = {
            usuarioNTResponsable: "",
            estadoId: estadoActivo,
            fechaCierre: "",
            clienteId: "",
            respuestasId: []
        }

        updateOportunidadFilterParams(params)
    }

    handleNavigation = (screen) => {
        const { navigation } = this.props

        navigation.navigate(screen, { fromMain: true })
    }

    handleNavigationNewVisita = (screen) => {
        const {navigation,tipoVisitaR} = this.props
        navigation.navigate(screen,{tipoVisita:tipoVisitaR})
    }

    loading = () => {
        const { isFetchingGruposEconomicos, isFetchingCartera, isFetchingColaboradores } = this.props
        const { loading } = this.state

        return loading || isFetchingGruposEconomicos || isFetchingCartera || isFetchingColaboradores
    }

    render() {
        const { currentUser,cantVistPrio,oportunidadVencidad } = this.props
        const { formularioOportunidadLoaded } = this.state
        const nuevaVisita = require('../../assets/images/icons/handshake.png')
        const nuevaOportunidadIcon = require('../../assets/images/icons/money.png')
        const visitasIcon = require('../../assets/images/icons/group.png')
        const oportunidadesIcon = require('../../assets/images/icons/worldwide.png')
        const circautionIcon = require('../../assets/images/icons/ic-cir-caution-1.png')

        if (this.loading()) {
            return <Loading />
        } else {
            return (
                <ScrollView style={styles.container} >
                    <View style={styles.cardContainer}>
                        <Text {...testID({
                            id: "userNicknameOnMainScreen",
                            label: "Contenedor de texto de nickname de usuario"
                        })
                        }
                            style={{ color: 'black', fontSize: 35, fontWeight: 'bold', textTransform: 'capitalize', marginBottom: 30 }} >
                            {currentUser.nombreCompleto}
                        </Text>

                        {oportunidadVencidad == true ? <View style={styles.RectOportVencida}>
                            <View style={styles.contentOportVencid}>
                              <Image source={require('../../assets/images/icons/ic-caution.png')}/>  
                              <Text style={styles.oportunidadesVencid}
                              {...testID({
                                id: "oportunidadVencidad",
                                label: "Contenedor de texto de Oportunidades Vencidad"
                            })
                            }>Tienes oportunidades vencidas</Text>
                            </View>
                        </View>:<View style={styles.HideRectOportVencida}></View>}

                        {/*boxes*/}
                        <Row >
                            <Col size={50}>
                                <TouchableOpacity onPress={() => { this.handleNavigationNewVisita('FormularioVisita') }}
                                    {...testID({
                                        id: "nuevaVisitaCard",
                                        label: "Contenedor de tarjeta de nueva visita"
                                    })
                                    }
                                >
                                    <SectionCard title="Nueva Visita" icon={nuevaVisita} />
                                </TouchableOpacity>
                            </Col>

                            <Col size={50} style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { this.handleNavigation('FormularioOportunidad') }}
                                    {...testID({
                                        id: "nuevaOportunidadCard",
                                        label: "Contenedor de tarjeta de nueva oportunidad"
                                    })
                                    }
                                >
                                    <SectionCard title="Nueva Oportunidad" icon={nuevaOportunidadIcon}
                                        otherStyle={{ marginTop: 10 }}
                                        otherTextStyle={{ marginTop: 10 }}
                                        toRight={true} />
                                </TouchableOpacity>
                            </Col>
                        </Row>

                        <Row>
                            <Col size={50}>
                                <TouchableOpacity onPress={() => { this.handleNavigation('VisitasTab') }}
                                    {...testID({
                                        id: "visitasCard",
                                        label: "Contenedor de lista de visitas"
                                    })
                                    }
                                >
                                    <SectionCard title="Consultar Visitas" icon={visitasIcon} otherStyle={{ marginTop: 0 }} otherTextStyle={{ marginTop: 10 }} />
                                </TouchableOpacity>
                            </Col>

                            <Col size={50} style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { this.handleNavigation('OportunidadesTab') }}
                                    {...testID({
                                        id: "oportunidadesCard",
                                        label: "Contenedor de lista de oportunidades"
                                    })
                                    }
                                >
                                    <SectionCard title="Consultar Oportunidades" icon={oportunidadesIcon} icon2={circautionIcon} oportunidadVencidad={oportunidadVencidad} otherStyle={{ marginTop: 10 }} otherTextStyle={{ marginTop: 10 }}
                                        toRight={true} />
                                </TouchableOpacity>
                            </Col>
                        </Row>
                        {cantVistPrio == 0 || cantVistPrio === undefined ? null : <View style={styles.contNumerVisitasPrior}>
                          <ImageBackground source={require('../../assets/images/icons/Rectangle_Copy_2.png')} style={styles.imgBackgroundVisitasPrior}>
                            <View style={styles.contentInfoVisiPrior}>
                               <Image source={require('../../assets/images/icons/ic_caution_copy.png')} style={{marginTop:10}} />
                               <Text style={styles.textBackgroundVisitasPrio}
                                 {...testID({
                                    id: "cantidadVisitasPriorizadas",
                                    label: "Contenedor de cantidad de visitas priorizadas"
                                   })
                                } 
                               >{`${cantVistPrio} visitas Priorizadas`}</Text>
                            </View> 
                          </ImageBackground>
                        </View>}
                        {/*BTN mode offline*/}
                        {/*<TouchableOpacity onPress={() => { }} style={styles.updateButton}>*/}
                            {/*<View style={styles.containerTextButton}>*/}
                                {/*<Image style={{ marginTop: 10 }} source={require('./../../assets/images/icons/refresh.png')} />*/}
                                {/*<Text style={styles.textButton}>Actualizar</Text>*/}
                            {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </ScrollView>
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR
    },
    cardContainer: {
        width: '92%',
        marginLeft: '4%',
        marginTop: 5,
        padding: 0
    },
    updateButton: {
        borderWidth: 1,
        borderColor: OCEAN_BLUE,
        borderRadius: 50,
        height: 44,
        marginVertical: 20
    },
    containerTextButton: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textButton: {
        color: OCEAN_BLUE,
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: '500',
        paddingTop: 10,
        paddingLeft: 10
    },
    contVisitasPrior:{
        height: 55,
        marginBottom: 20,
        paddingVertical:10,
        backgroundColor: 'white',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        borderRadius:5
    },
    icon_calendar_home:{
        width: 42, 
        height: 38
    },
    title_visitas_pr:{
        height: 21,
        width: 173,
        color:'#1E1E1E',
        fontSize:16,
        fontWeight: 'bold'
    },
    icon_numer_visitas_pr:{
        borderRadius: 50,
        width:34,
        height:34,
        backgroundColor:'#FFD700',
        alignItems:'center',
        justifyContent:'center'
    },
    RectOportVencida:{
        resizeMode: 'cover',
        height: 53, 
        //width: 344,
        borderWidth:1,
        borderColor:'#FFD700',	
        borderRadius:4,
        backgroundColor:'rgba(255,215,0,0.2)',
        marginBottom:15,
    },
    HideRectOportVencida:{
        height: 30, 
    },
    contentOportVencid:{
        flexDirection:'row',
        paddingVertical:12,
        paddingHorizontal:10,
        flex:1
    },
    oportunidadesVencid:{
        height: 22,
        //width: 258,
        color: '#CCAC00',	
        fontSize: 15,	
        lineHeight:22,
        marginLeft:10,
        marginTop:2
    },  
    contNumerVisitasPrior:{
        height:60
    },
    imgBackgroundVisitasPrior:{
       //width: 350, 
       height: 66,
       marginTop:-15,
    },
    contentInfoVisiPrior:{
        position: 'absolute',
        top: 0,
        alignItems:'center',
        left: 0, 
        right: 0, 
        bottom: 0,
        flexDirection:'row',
        paddingHorizontal:20
    },
    textBackgroundVisitasPrio:{
        marginTop:15,
        marginLeft:10,
        fontSize:16,
        color:'#ffffff',
        fontWeight:'bold'
    }
})
