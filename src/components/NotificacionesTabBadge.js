//Dependency
import React, {Component} from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'
import IconBadge from 'react-native-icon-badge'
//Components
import { connect } from 'react-redux';
//Assets
import { RED } from '../styles/Colors'


//type Props = {}

 class NotificacionesTabBadge extends Component{
    
    state = {}

    render() {
        const { focused, cantMensajesN } = this.props
        const notificationCount = cantMensajesN
        const isReader = true
        return (
            <View style={styles.cardContainer}>
                <IconBadge
                    MainElement={
                        focused ?
                            <Image style={styles.iconImage}
                                   source={require('../../assets/images/icons/notification_active_tab.png')}/>
                            :
                            <Image style={{width: 25, height: 30}}
                                   source={require('../../assets/images/icons/notification_inactive_tab.png')}/>
                    }
                    BadgeElement={
                        <Text style={styles.TextBadgeElement}
                        {...testID({
                            id: 'countNotification',
                            label: 'contenedor de texto que muestra un contador de notificación'
                        })
                        }
                        >{notificationCount}</Text>
                    }
                    IconBadgeStyle={styles.IconBadgeStyle}
                    Hidden={notificationCount == 0 || notificationCount === undefined ? true : false }
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({ cantMensajesN:state.mensajesNotificaciones.cant_mensajes_n });
export default connect(mapStateToProps, null)(NotificacionesTabBadge);
  

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconImage: {
        width: 25,
        height: 30
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

