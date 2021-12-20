import React,{ Component }  from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform
} from 'react-native';
import GoBackButton from './GoBackButton'
import { BROWN_RELIGHT_GREY } from '../styles/Colors';
import testID from '../../custom_node_modules/react-native-testid'
import { connect } from 'react-redux'

class Header extends Component {
   
  render(){  
  const { total,cantMensajesN,navigation } = this.props
  return (
    <SafeAreaView style={styles.content}>
       <View style={styles.containerButton}>
        <GoBackButton onPress={() => {
            navigation.navigate('HomeTab')
         }}/>
        <View style={styles.contentHeader}>
           <Text style={styles.titleHeader}
           {...testID({
             id: "NotificacionTextBox",
             label: "Contenedor de texto de Notificación"
            })
           }>Notificaciones</Text>
           { total == 0 && cantMensajesN === undefined ? <Text style={styles.paramsHeader}></Text>:
             <Text style={styles.paramsHeader}
             {...testID({
                id: 'CantidadMensajesNotificación',
                label: 'Contenedor de texto cantidad de mensajes Notificaciones'
             })
             }
             >{`${cantMensajesN} - ${total}`}</Text>
           }
        </View>
       </View> 
    </SafeAreaView>
   )
  }
}

const mapStateToProps = (state) => {
  const {env: {API_ENV}} = process
  return {
      currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
      cantMensajesN:state.mensajesNotificaciones.cant_mensajes_n
  }
}

export default connect(mapStateToProps, null)(Header)

const styles = StyleSheet.create({
    content: {
        backgroundColor: BROWN_RELIGHT_GREY,
        elevation:0
    },
    containerButton: {
        paddingVertical: Platform.OS === 'ios' ? 10 : 20,
        paddingHorizontal: 10,
        flexDirection:'row',
    },
    titleHeader:{
        color:'black',
        fontWeight:'500',
        fontSize:20,
    },
    paramsHeader:{
        color:'black',
        fontWeight:'400',
        fontSize:16,
    },
    contentHeader:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        marginRight:40
    }
})

