//Dependency
import React, {Component} from 'react'
import {
    Dimensions,
    View,
    ScrollView,
    Image,
    Text,
    StatusBar,
    ImageBackground,
    KeyboardAvoidingView,
    SafeAreaView
} from 'react-native'
import {connect} from 'react-redux'
import Modal from 'react-native-modalbox'
import {bindActionCreators} from 'redux'
import {limpiarSignIn, limpiarSignOut} from '../store/actions/auth'
import {BuildVersion, ApiEnvironments} from '../constants/Data'
//import {SafeAreaView} from 'react-navigation'

//Components
import GoBackButton from '../components/GoBackButton'
import ItemListModal from '../components/ItemListModal'
import LoginForm from '../components/forms/LoginForm'
import {Row} from '../components/Grid'

//Assets
import styles from './../styles/screens/LoginScreen'


type Props = {}

class LoginScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => ({
        header: null
    })

    state = {
        isModalOpen: false,
        apiEnvSelection: false,
        errorTitle: '',
        errorMessage: '',
        icon: '',
        apiEnv: process.env.API_ENV,
    
    }

    async componentDidMount() {
        const {actions: {limpiarSignIn, limpiarSignOut}, error, errorMessage} = this.props

        if (error) {
            this.handleError(errorMessage)
            limpiarSignIn()
        }

        limpiarSignOut()
    }
       
    componentWillReceiveProps(nextProps) {
        const {requesting, navigation, actions: {limpiarSignIn}} = this.props

        if (requesting && !nextProps.requesting) {
            if (nextProps.error) {
                this.handleError(nextProps.errorMessage)
                limpiarSignIn()
            } else {
                navigation.navigate('AuthLoading')
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {apiEnv, errorTitle} = this.state

        if (errorTitle !== nextState.errorTitle) {
            this.setState({
                isModalOpen: true,
            })
        }

        if (apiEnv !== nextState.apiEnv) {
            const {navigation} = this.props

            navigation.navigate('AuthLoading')
        }

        return true
    }

    handleError = (error) => {
        let title, message, icon

        switch (error) {
            case 'invalid_token':
                title = 'Clave expirada'
                message = 'Su clave ha expirado, por favor vuelva a iniciar sesión.'
                icon = '../../assets/images/icons/expired_sesion.png'
                break
            case 'Bad credentials':
            case 'error en la repuesta getToken':
                title = 'Error autenticación'
                message = 'Nombre de usuario o contraseña incorrectas'
                icon = '../../assets/images/icons/not_allowed.png'
                break
            case 'request_timeout':
                title = 'Error'
                message = 'Tiempo de espera del servicio expirado (408)'
                icon = '../../assets/images/icons/not_allowed.png'
                break
            default:
                title = 'Error'
                message = 'Ha ocurrido un error inesperado (500)'
                icon = '../../assets/images/icons/expired_sesion.png'
                break
        }

        this.setState({
            isModalOpen: true,
            errorTitle: title,
            errorMessage: message
        })
    }

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        })
    }

    changeApiEnv = (value) => {
        process.env.API_ENV = value
        this.setState({apiEnv: value, apiEnvSelection: false})
    }

    render() {
        const {apiEnvSelection, isModalOpen, errorTitle, errorMessage, apiEnv } = this.state
        const {height} = Dimensions.get('window')
        return (
            <View style={styles.container}>
                <ImageBackground style={{flex: 1, resizeMode: 'cover'}}
                                 source={require('../../assets/images/login_bg.png')}>

                    <ScrollView>
                        <KeyboardAvoidingView style={{minHeight: height - 30}} behavior="padding" enabled>
                            <StatusBar hidden={true} animated={true} barStyle="light-content"/>
                            <View style={styles.formContainer}>
                                <Image source={require('../../assets/images/logo.png')} style={styles.logo}/>
                                <LoginForm />
                            </View>
                        </KeyboardAvoidingView>

                        {/*<TouchableOpacity onPress={ () => this.setState({apiEnvSelection: true}) }>
                            <Row style={{bottom: 0, backgroundColor: 'transparent', justifyContent: 'flex-end'}}>
                                  <Text style={[styles.text]}>{ApiEnvironments[apiEnv].name}</Text>
                                  <Text style={[styles.text]}>{BuildVersion}</Text>
                                  <Image source={ require('../../assets/images/icons/settings-icon.png') } style={ styles.settingsIcon }/>
                            </Row>
                        </TouchableOpacity>*/}
                        <SafeAreaView style={{flex:1}}>
                            <Row style={{bottom: 0, backgroundColor: 'transparent', justifyContent: 'flex-end',right:15}}>
                                <Text style={[styles.text]}>{ApiEnvironments[apiEnv].name}</Text>
                                <Text style={[styles.text]}>{BuildVersion}</Text>
                            </Row>
                        </SafeAreaView>
                    </ScrollView>
                </ImageBackground>
                <Modal isOpen={isModalOpen} style={styles.modal} position={"bottom"}  onClosed={() => this.closeModal()}>
                    <Image source={require('../../assets/images/icons/expired_sesion.png')} style={styles.modalIcon}/>
                    <Text style={styles.modalTitle}>{errorTitle}</Text>
                    <Text style={styles.modalDescription}>{errorMessage}</Text>
                </Modal>

                <Modal isOpen={apiEnvSelection} onClosed={() => null}>
                    <ItemListModal
                        list={ApiEnvironments}
                        saveSelection={this.changeApiEnv}
                        defaultValue={apiEnv}
                        title="Ambiente de la aplicación"
                        headerLeft={<GoBackButton onPress={() => {
                            this.setState({apiEnvSelection: false})
                        }}/>}
                        type={'ANY'}/>
                </Modal>
            </View>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        requesting: state.auth.requesting,
        error: state.auth.hasError,
        errorMessage: state.auth.errorMessage,
        invalidToken: state.auth.invalidToken,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            limpiarSignIn,
            limpiarSignOut
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
