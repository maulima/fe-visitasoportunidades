//Dependency
import React, {Component} from 'react'
import {Image, StyleSheet, Text, View,TouchableOpacity} from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'
import IconBadge from 'react-native-icon-badge'
import { cantMensajesNoLeidos } from '../store/actions/mensajesNotificaciones'
//Components
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import moment from 'moment'
//Assets
import { RED } from '../styles/Colors'


 class NotificacionesIconHome extends Component{
    
   state = {
      notificationCount:''  
   }

   componentDidMount(){
    const { actions: {
        cantMensajesNoLeidos
    } } = this.props        
    const paramsConst = {
        fechaHasta : moment(new Date()).format("YYYY-MM-DD"),
    }  
    const { fechaHasta } = paramsConst; 
    cantMensajesNoLeidos({fechaHasta})
   }

    render() {
        const { navigation,cantMensajesN } = this.props
        return (
            <View style={styles.cardContainer}>
                <IconBadge
                    MainElement={
                        <TouchableOpacity onPress={() => navigation.navigate('Notificaciones')}
                            {...testID({
                                id: 'IconoNotification',
                                label: 'Icono en el home para indicar el numero de notificaciones no leidas'
                            })
                            }
                        >
                            <Image style={styles.iconImage}
                                   source={require('../../assets/images/icons/icon_notificacion_home.png')}/>
                        </TouchableOpacity>           
                    }
                    BadgeElement={
                        <Text style={styles.TextBadgeElement}>{cantMensajesN}</Text>
                    }
                    IconBadgeStyle={styles.IconBadgeStyle}
                    Hidden={cantMensajesN == 0 || cantMensajesN === undefined ? true : false }
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({ cantMensajesN:state.mensajesNotificaciones.cant_mensajes_n });

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            cantMensajesNoLeidos
        }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NotificacionesIconHome);
  

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width:30,
        marginRight:50
    },
    iconImage: {
        width: 25,
        height: 25,
    },
    TextBadgeElement: {
        color: '#FFFFFF',
        fontSize: 10,
    },
    IconBadgeStyle: {
        width: 15,
        height: 15,
        backgroundColor: RED,
        position: 'absolute', left: 10, top: -5,
    },

})

