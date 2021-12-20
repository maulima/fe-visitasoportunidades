import React from 'react'
import {createStackNavigator, createSwitchNavigator, createBottomTabNavigator} from 'react-navigation'
import {Image} from 'react-native'

import LoginScreen from './screens/LoginScreen'
import MainScreen from './screens/MainScreen'
import AuthLoadingScreen from './screens/AuthLoadingScreen'
import VisitasRealizadasScreen from './screens/VisitasRealizadasScreen'
import VisitasPriorizadasScreen from './screens/VisitasPriorizadasScreen'
import OportunidadesScreen from './screens/OportunidadesScreen'
import NotificacionesScreen from './screens/NotificacionesScreen'
import NuevoRegistroModal from './components/NuevoRegistroModal'
import FiltroOportunidadScreen from './screens/FiltroOportunidadScreen'
import SettingsScreen from './screens/SettingsScreen'
import TipoVisitasScreen from './screens/TipoVisitasScreen'
import FormularioOportunidadScreen from './screens/FormularioOportunidadScreen'
import FormularioVisitaScreen from './screens/FormularioVisitaScreen'
import FormularioVisitaPriorizadaScreen from './screens/FormularioVisitaPriorizadaScreen'
import FormularioRiesgoScreen from './screens/FormularioRiesgoScreen'
import TabButton from './components/TabButton'
import FiltroVisitasRealiazadas from './screens/FiltroVisitaScreen'
import FiltroVisitasPriorizadas from './screens/FiltroVisitasPriorizadas'

import ResumenEditVisitaScreen from './screens/ResumenEditVisitaScreen'

import {HEADER_STYLE} from './styles/Header'
import {BACKGROUND_COLOR_TAB} from './styles/Colors'
import NotificacionesTabBadge from './components/NotificacionesTabBadge'

const MainStack = createStackNavigator({
    Main: {screen: MainScreen},
}, {
    //initialRouteName: 'Main',
    navigationOptions: ({navigation}) => ({
        ...HEADER_STYLE,
    })
})

const VisitasStack = createStackNavigator({
    Visitas: {screen: TipoVisitasScreen},
}, {
    initialRouteName: 'Visitas',
    navigationOptions: ({navigation}) => ({
        ...HEADER_STYLE,
    })
})


const OportunidadesStack = createStackNavigator({
    Oportunidades: {screen: OportunidadesScreen},
}, {
    initialRouteName: 'Oportunidades',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const HandleNewOportunidadStack = createStackNavigator({
    HandleNewOportunidad: {screen: NuevoRegistroModal}
}, {
    initialRouteName: 'HandleNewOportunidad',
    mode: 'screen',
    headerMode: 'none',
})

const NotificacionesStack = createStackNavigator({
    Notificaciones: {screen: NotificacionesScreen},
}, {
    initialRouteName: 'Notificaciones',
    headerMode: 'none',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const SettingsStack = createStackNavigator({
    Settings: {screen: SettingsScreen}
}, {
    initialRouteName: 'Settings',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const FormularioOportunidadStack = createStackNavigator({
    FormularioOportunidad: {screen: FormularioOportunidadScreen}
}, {
    mode: 'float',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const FormularioVisitaStack = createStackNavigator({
    FormularioVisita: {screen: FormularioVisitaScreen}
}, {
    mode: 'float',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const FormularioVisitaPriorizadaStack = createStackNavigator({
    FormularioVisitaPriorizada: {screen: FormularioVisitaPriorizadaScreen}
}, {
    mode: 'float',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const FormularioRiesgoStack = createStackNavigator({
    FormularioRiesgo: {screen: FormularioRiesgoScreen}
}, {
    mode: 'float',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const FiltroOportunidadStack = createStackNavigator({
    FiltroOportunidades: {screen: FiltroOportunidadScreen}
}, {
    mode: 'float',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const FiltroVisitaRealiazadasStack = createStackNavigator({
    FiltroVisitasRealiazadas: {screen: FiltroVisitasRealiazadas}
}, {
    mode: 'float',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const FiltroVisitaPriorizadasStack = createStackNavigator({
    FiltroVisitasPriorizadas: {screen: FiltroVisitasPriorizadas}
}, {
    mode: 'float',
    navigationOptions: {
        ...HEADER_STYLE
    }
})

const VisitasRealizadasStack = createStackNavigator({
    VisitasRealizadas:{screen:VisitasRealizadasScreen}
},{
    initialRouteName: 'VisitasRealizadas',
    navigationOptions: {
        ...HEADER_STYLE,
    }   
})

const VisitasPriorizadasStack = createStackNavigator({
    VisitasPriorizadas:{screen:VisitasPriorizadasScreen}
},{
    initialRouteName: 'VisitasPriorizadas',
    navigationOptions: {
        ...HEADER_STYLE,
    }   
})

const ResumenEditVisitaStack = createStackNavigator({
    ResumenEditVisita:{screen:ResumenEditVisitaScreen}
},{
    initialRouteName: 'ResumenEditVisita',
    navigationOptions: {
        ...HEADER_STYLE,
    }  
})

const TabsNavigator = createBottomTabNavigator({
        HomeTab:{
           screen: MainStack,
           navigationOptions: {
                tabBarLabel: 'Inicio',
                tabBarTestID: 'BotonMenuInicio',
                tabBarAccessibilityLabel:'Icono del acceso a la vista home',
                tabBarIcon: ({focused}) => (
                    focused
                        ? <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/home_icon_active.png')}/>
                        : <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/home_icon.png')}/>
                                 
                )
            }
        },
        VisitasTab: {
            screen: VisitasStack,
            navigationOptions: {
                tabBarLabel: 'Visitas',
                tabBarTestID: 'BotonMenuVisitas',
                tabBarAccessibilityLabel:'Icono del acceso a la lista de visitas desde el menu',
                tabBarIcon: ({focused}) => (
                    focused
                        ? <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/visit_active_tab.png')}/>
                        : <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/visit_inactive_tab.png')}/>
                )
            }
        },
        HandleNewOportunidadTab: {
            screen: NuevoRegistroModal,
            mode: 'float',
            navigationOptions: () => ({
                title: '',
                tabBarIcon: <TabButton/>
            })
        },
        OportunidadesTab: {
            screen: OportunidadesStack,
            navigationOptions: {
                tabBarLabel: 'Oportunidades',
                tabBarTestID: 'BotonMenuOportunidad',
                tabBarAccessibilityLabel:'Icono del acceso a la vista de lista de oportunidades desde el menu',
                tabBarIcon: ({focused}) => (
                    focused
                        ? <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/oport_active_tab.png')}/>
                        : <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/oport_inactive_tab.png')}/>
                ),
            }
        },
        NotificacionesTab: {
            screen: NotificacionesStack,
            navigationOptions: {
                tabBarLabel: 'Notificaciones',
                tabBarTestID: 'BotonNotificationCenter',
                tabBarAccessibilityLabel:'Botón de acceso al centro de notificaciones',
                tabBarIcon: ({focused}) => (
                    <NotificacionesTabBadge focused={focused}/>
                ),
            }
        },
    },
    {
        initialRouteName: 'HomeTab',
        tabBarOptions: {
            style: {
                backgroundColor: BACKGROUND_COLOR_TAB,
                borderTopWidth: 1,
                height: 60
            },
        },
        backBehavior: false
    })

    const TabsNavigator2 = createBottomTabNavigator({
        HomeTab2:{
           screen: MainStack,
           navigationOptions: {
                tabBarLabel: 'Inicio',
                tabBarTestID: 'BotonMenuInicio',
                tabBarAccessibilityLabel:'Icono del acceso a la vista home',
                tabBarIcon: ({focused}) => (
                    focused
                    ? <Image style={{width: 25, height: 25}}
                    source={require('./../assets/images/icons/home_icon_active.png')}/>
                    : <Image style={{width: 25, height: 25}}
                    source={require('./../assets/images/icons/home_icon.png')}/>  
                )
            }
        },
        VisitasRealizadasTab: {
            screen: VisitasRealizadasStack,
            navigationOptions: {
                tabBarLabel: 'Visitas',
                tabBarTestID: 'BotonMenuVisitas',
                tabBarAccessibilityLabel:'Icono del acceso a la lista de visitas desde el menu',
                tabBarIcon: ({focused}) => (
                    focused
                        ? <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/visit_active_tab.png')}/>
                        : <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/visit_inactive_tab.png')}/>
                )
            }
        },
        HandleNewOportunidadTab: {
            screen: NuevoRegistroModal,
            mode: 'float',
            navigationOptions: () => ({
                title: '',
                tabBarIcon: <TabButton/>
            })
        },
        OportunidadesTab: {
            screen: OportunidadesStack,
            navigationOptions: {
                tabBarLabel: 'Oportunidades',
                tabBarTestID: 'BotonMenuOportunidad',
                tabBarAccessibilityLabel:'Icono del acceso a la vista de lista de oportunidades desde el menu',
                tabBarIcon: ({focused}) => (
                    focused
                        ? <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/oport_active_tab.png')}/>
                        : <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/oport_inactive_tab.png')}/>
                ),
            }
        },
        NotificacionesTab: {
            screen: NotificacionesStack,
            navigationOptions: {
                tabBarLabel: 'Notificaciones',
                tabBarTestID: 'BotonNotificationCenter',
                tabBarAccessibilityLabel:'Botón de acceso al centro de notificaciones',
                tabBarIcon: ({focused}) => (
                    <NotificacionesTabBadge focused={focused}/>
                ),
            }
        },
    },
    {
        initialRouteName: 'HomeTab2',
        tabBarOptions: {
            style: {
                backgroundColor: BACKGROUND_COLOR_TAB,
                borderTopWidth: 1,
                height: 60
            },
        },
        backBehavior: false
    })
    
 
    const TabsNavigator3 = createBottomTabNavigator({
        HomeTab3:{
           screen: MainStack,
           navigationOptions: {
                tabBarLabel: 'Inicio',
                tabBarTestID: 'BotonMenuInicio',
                tabBarAccessibilityLabel:'Icono del acceso a la vista home',
                tabBarIcon: ({focused}) => (
                    focused
                    ? <Image style={{width: 25, height: 25}}
                             source={require('./../assets/images/icons/home_icon_active.png')}/>
                    : <Image style={{width: 25, height: 25}}
                             source={require('./../assets/images/icons/home_icon.png')}/>  
                       
                )
            }
        },
        VisitasRealizadasTab: {
            screen: VisitasPriorizadasStack,
            navigationOptions: {
                tabBarLabel: 'Visitas',
                tabBarTestID: 'BotonMenuVisitas',
                tabBarAccessibilityLabel:'Icono del acceso a la lista de visitas desde el menu',
                tabBarIcon: ({focused}) => (
                    focused
                        ? <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/visit_active_tab.png')}/>
                        : <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/visit_inactive_tab.png')}/>
                )
            }
        },
        HandleNewOportunidadTab: {
            screen: NuevoRegistroModal,
            mode: 'float',
            navigationOptions: () => ({
                title: '',
                tabBarIcon: <TabButton/>
            })
        },
        OportunidadesTab: {
            screen: OportunidadesStack,
            navigationOptions: {
                tabBarLabel: 'Oportunidades',
                tabBarTestID: 'BotonMenuOportunidad',
                tabBarAccessibilityLabel:'Icono del acceso a la vista de lista de oportunidades desde el menu',
                tabBarIcon: ({focused}) => (
                    focused
                        ? <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/oport_active_tab.png')}/>
                        : <Image style={{width: 25, height: 25}}
                                 source={require('./../assets/images/icons/oport_inactive_tab.png')}/>
                ),
            }
        },
        NotificacionesTab: {
            screen: NotificacionesStack,
            navigationOptions: {
                tabBarLabel: 'Notificaciones',
                tabBarTestID: 'BotonNotificationCenter',
                tabBarAccessibilityLabel:'Botón de acceso al centro de notificaciones',
                tabBarIcon: ({focused}) => (
                    <NotificacionesTabBadge focused={focused}/>
                ),
            }
        },
    },
    {
        initialRouteName: 'HomeTab3',
        tabBarOptions: {
            style: {
                backgroundColor: BACKGROUND_COLOR_TAB,
                borderTopWidth: 1,
                height: 60
            },
        },
        backBehavior: false
})  

const AuthStack = createStackNavigator({
        Login: {screen: LoginScreen},
    },
    {
        cardStyle: {
            shadowColor: 'transparent'
        }
    })

const AppStack = createStackNavigator({
    //MainStack: {screen: MainStack},
    //VisitasStack : {screen: VisitasStack},
    TabsNavigator: {screen: TabsNavigator},
    TabsNavigator2:{screen: TabsNavigator2},
    TabsNavigator3:{screen:TabsNavigator3},
    FormularioOportunidadStack: {screen: FormularioOportunidadStack},
    FormularioVisitaStack: {screen: FormularioVisitaStack},
    FormularioVisitaPriorizadaStack: {screen: FormularioVisitaPriorizadaStack},
    FormularioRiesgoStack: {screen: FormularioRiesgoStack},
    FiltroOportunidadStack: {screen: FiltroOportunidadStack},
    FiltroVisitaRealiazadasStack: {screen: FiltroVisitaRealiazadasStack},
    FiltroVisitaPriorizadasStack: {screen: FiltroVisitaPriorizadasStack},
    HandleNewOportunidadStack: {screen: HandleNewOportunidadStack},
    NotificacionesStack: {screen: NotificacionesStack},
    SettingsStack:{screen:SettingsStack},
    VisitasRealizadasStack:{screen:VisitasRealizadasStack},
    VisitasPriorizadassScreen:{screen:VisitasPriorizadasStack},
    ResumenEditVisitaScreen:{screen:ResumenEditVisitaStack}
}, {
    headerMode: 'none',
    gesturesEnabled: false,
    cardStyle: {
        shadowColor: 'transparent'
    },
})

export const RootNavigator = createSwitchNavigator({
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack
    },
    {
        initialRouteName: 'AuthLoading',
    }
)
