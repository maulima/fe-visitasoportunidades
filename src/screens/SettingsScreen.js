import React, {Component} from 'react'
import { View,Image, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import GoBackButton from '../components/GoBackButton'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import testID from '../../custom_node_modules/react-native-testid'
import {BuildVersion, ApiEnvironments} from '../constants/Data'
import { Row } from '../components/Grid'
import {BACKGROUND_COLOR, BLACK, WHITE} from '../styles/Colors'
import { clearMensajesNotificaciones } from '../store/actions/mensajesNotificaciones'
import {clearVisita} from '../store/actions/visitas'
import { signOut } from '../store/actions/auth'

type Props = {}

class SettingsScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: 'Configuración',
        headerLeft: <GoBackButton onPress={() => {
            navigation.goBack()
         }}/>,
    })

    state = {
        signingOut: false,
        apiEnv: process.env.API_ENV,
    }

    componentWillMount() {
    }

    async componentDidMount() {
        const {
            actions: { clearVisita }
        } = this.props  
        clearVisita()
    }

    componentWillReceiveProps(nextProps) {
        const { requesting, navigation } = this.props

        if (requesting !== nextProps.requesting && nextProps.requesting) {
            this.setState({signingOut: true})
        }

        if (requesting !== nextProps.requesting && !nextProps.requesting) {
            this.setState({signingOut: false})
            navigation.navigate('AuthLoading')
        }
    }

    handleSignOut = () => {
        const { actions: { signOut,clearVisita,clearMensajesNotificaciones } } = this.props
        clearMensajesNotificaciones()
        signOut()
        clearVisita()
    }
   
    handleButtonMain = () => {
        const { navigation } = this.props
        navigation.navigate('Main')
    } 

    render() {
        const { signingOut } = this.props
        const { apiEnv } = this.state
        return (
            <View style={ styles.container }>
                <View style={ styles.imageContainer }>
                    <Image style={ styles.image } source={ require('./../../assets/images/logo_black.png') } />
                </View>
                <View>
                    <TouchableOpacity onPress={ () => this.handleSignOut() } style={styles.signOutContainer}
                      {...testID({
                        id: `BotonCerrarSesion`,
                        label: `Botón para cerrar la sesión`
                      })
                      }>
                        <Text style={styles.buttonSignOut}>Cerrar Sesión</Text>
                        { signingOut && <ActivityIndicator size="small" color={ BLACK } /> }
                    </TouchableOpacity>
                </View>
                <Row style={{bottom: 20,right:10,backgroundColor: 'transparent',justifyContent:'flex-end',alignItems:'flex-end'}}>
                    <Text style={[styles.text]}>{ApiEnvironments[apiEnv].name}</Text>
                    <Text style={[styles.text]}>{BuildVersion}</Text>
                </Row>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        requesting: state.auth.requesting,
        hasError: state.auth.hasError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ signOut,clearVisita,clearMensajesNotificaciones }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 20,
        paddingRight: 10
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    image: {
        width: 200,
        height: 90
    },
    signOutContainer: {
        backgroundColor: '#F13D47',
        borderRadius: 50,
        paddingVertical: 8.5,
        height: 40,
        marginBottom: 10,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    ButtonHome: {
        backgroundColor: '#186EDC',
        borderRadius: 50,
        paddingVertical: 8.5,
        height: 40,
        marginBottom: 10,
        marginTop: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom:10
    },
    buttonSignOut:{
        color: WHITE,
        fontSize: 15,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        paddingTop:1,
        textAlign: 'center',
    },
    text: {
        color: 'black',
        fontSize: 14,
        paddingHorizontal: 2,
        margin: 0
    },
})
