import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text, ActivityIndicator,AsyncStorage,Alert } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import testID from '../../../custom_node_modules/react-native-testid'

import { limpiarSignIn, signIn, modalIsVisible } from '../../store/actions/auth'

import { LOGIN_VALIDATION_SCHEMA } from '../../utils/ValidationSchemas'
import InputGroup from '../InputGroup'

import styles from '../../styles/screens/LoginScreen'
import { WHITE } from '../../styles/Colors'
import firebase from 'react-native-firebase'
import { withNavigation } from 'react-navigation';
//import Modal from 'react-native-modalbox' 

const mapStateToProps = (state) => {
    return {
        requesting: state.auth.requesting,
        loggedIn: state.auth.loggedIn,
        error: state.auth.hasError,
        invalidToken: state.auth.invalidToken,
        profile: state.auth.profile 
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ signIn, limpiarSignIn,modalIsVisible }, dispatch)
    }
}

type Props = {}

class LoginForm extends Component<Props> {

    state = {
        signingWithCredentials: false,
        username: null,
        password: null,
        _error: false,
        messageError: '',
    };
     
    async componentDidMount(){
      this.checkPermission() 
      this.createNotificationListeners()
    }
     
    componentWillUnmount() {
      this.notificationListener 
      this.notificationOpenedListener
    }      
   

      //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }  
    }
    
     //3
     async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        //console.log(fcmToken)
        if(!fcmToken){
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
               //usuario tiene un token de dispositivo
               await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
      }
      
    
      //2
      async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // Usuario tiene autorización 
            this.getToken();
          } catch (error) {
            // Usuario no tiene  los permisos de autorización 
            console.log('permission rejected');
          }
      }

    
      async createNotificationListeners(credentials) { 
        //Se activa cuando se recibe una notificación particular en primer plano
        this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body } = notification;
        console.log('onNotification:');
        const localNotification = new firebase.notifications.Notification({
        show_in_foreground: true,
        })
        .setNotificationId(notification.notificationId)
        .setTitle(title)
        .setBody(body)
        .android.setChannelId('fcm_FirebaseNotifiction_default_channel')
        .android.setSmallIcon('@drawable/ic_launcher')
        .android.setColor('#OOOOOO') // puedes establecer un color aquí
        .android.setAutoCancel(true)
        .android.setPriority(firebase.notifications.Android.Priority.High);
        firebase.notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
         
        });

        const channel = new firebase.notifications.Android.Channel('fcm_FirebaseNotifiction_default_channel', 'Visitas', firebase.notifications.Android.Importance.High)
        .setDescription('Visitas')
        firebase.notifications().android.createChannel(channel); 
        //Si App está en segundo plano, puede escuchar cuando se hace clicK / se toca / abre una notificación de la siguiente manera:
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const {navigate} = this.props.navigation;
            if(credentials === true){
               navigate('Notificaciones')
               console.log('Notificacion')
            }       
        });
       
        //Si App está cerrada, puede verificar si se abrió al hacer clic / tocar / abrir una notificación de la siguiente manera: 
        const notificationOpen = await firebase.notifications().getInitialNotification();
          if (notificationOpen) {
          const { title, body } = notificationOpen.notification;
        }
     }


    componentWillMount() {
        const { actions: { limpiarSignIn } } = this.props
        // limpiarSignIn()
    }

     async componentWillReceiveProps(nextProps) {
        const { requesting, error,actions: { limpiarSignIn }, invalidToken,tokenD } = this.props
        if (!requesting && nextProps.requesting ) {
            this.setState({signingWithCredentials: true})
            this.createNotificationListeners(true)       
        } else if (requesting && !nextProps.requesting) {
            this.setState({signingWithCredentials: false})
            //this.createNotificationListeners(false)  
        }

        if (!error && nextProps.error) {
            if (!invalidToken) {
                this.setState({
                    _error: true,
                    messageError: nextProps.error
                })
            }

            limpiarSignIn()
        }
    }
    

    onPressLogin = () => {
        LOGIN_VALIDATION_SCHEMA
            .validate(this.state)
            .then(() => {
                this.loginWithCredentials(this.state.username, this.state.password,this.props.token)
            })
            .catch((error) => {
                if (error.path === 'username') {
                    this.setState({
                        _error: true,
                        messageError: 'Debes ingresar tu usuario'
                    })
                } else if (error.path === 'password') {
                    this.setState({
                        _error: true,
                        messageError: 'Debes ingresar tu contraseña'
                    })
                } else {
                    this.setState({
                        _error: true,
                        messageError: error.message
                    })
                }
            })
    }

     async loginWithCredentials(username, pass) {
        const { profile,actions: { signIn } } = this.props
        const { env: { API_ENV } } = process

        if (username === null || pass === null) {
            return
        }

        switch (API_ENV) {
            case 'dev':
            case 'int':
            case 'cert': {
                const formData = new FormData()

                formData.append('username', username.toUpperCase())
                formData.append('password', pass)
                formData.append('grant_type', 'password')

                signIn(formData)

                break
            }
        
            default: {
                const formData = {}

                formData.user = username.toUpperCase()
                formData.password = pass
                                 
                signIn(formData)      
               
            }
           
        }
    }

    usernameHandle = (value) => {
        this.setState({
            username: value.replace(/\s/g, '')
        })
    }

    closeModal = () => {
        this.setState({
            isModalOpen: false,
        })
    }

    render() {
        const { signingWithCredentials, _error, messageError, fadeAnim,isModalOpen } = this.state
        const userIcon = <Image style={ styles.inputIcon } source={ require('../../../assets/images/icons/username_login.png') }/>
        const passIcon = <Image style={ styles.inputPassIcon } source={ require('../../../assets/images/icons/pass_login.png') } />
        return (
            <View>
                { _error
                    ? <Text style={ styles.errorMessage }>{messageError}</Text>
                    : null
                }
                <View>
                    <View style={ styles.inputContainer }>
                        <Text {...testID({
                                      id: "UsuarioTextBox",
                                      label: "Contenedor de texto de usuario"
                                  })
                              }
                              style={ styles.inputLabel } >Usuario:
                        </Text>
                        <InputGroup
                            testID={ testID({
                                id: "UsuarioInput",
                                label: "Contenedor de input de usuario"
                            })}
                            placeHolderText="Usuario"
                            placeholderTextColor={ WHITE }
                            autoCapitalize="none"
                            keyboardType="default"
                            autoComplete={"username"}
                            onChangeText={this.usernameHandle}
                            style={styles.input}
                            leftContent={ userIcon }
                            rightContent={[]}
                            value={this.state.username}
                        />
                    </View>
                    <View style={ styles.inputContainer }>
                        <Text {...testID({
                                      id: "PasswordTextBox",
                                      label: "Contenedor de texto de password"
                                  })
                              }
                              style={ styles.inputLabel } >Contraseña:
                        </Text>
                        <InputGroup
                            testID={ testID({
                                id: "PasswordInput",
                                label: "Contenedor de input de password"
                            })}
                            placeHolderText="Contraseña"
                            placeholderTextColor={ WHITE }
                            autoCapitalize="none"
                            keyboardType="default"
                            secureTextEntry={ true }
                            onChangeText={(password) => this.setState({password})}
                            style={styles.input}
                            leftContent={ passIcon }
                            rightContent={[]}
                            autoComplete={"password"}
                        />
                    </View>
                    <TouchableOpacity onPress={ this.onPressLogin } style={ styles.buttonLogin }
                                      {...testID({
                                                id: "LoginButton",
                                                label: "Contenedor de texto de login"
                                            })
                                      }
                    >
                        <Text style={ styles.buttonLoginLabel }
                              {...testID({
                                        id: "LoginTextBox",
                                        label: "Contenedor de texto de login"
                                    })
                              }
                          >
                              Login
                        </Text>
                        { signingWithCredentials && <ActivityIndicator size="small" color="white" /> }
                  </TouchableOpacity>                      
                </View>   
            </View>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(LoginForm))
