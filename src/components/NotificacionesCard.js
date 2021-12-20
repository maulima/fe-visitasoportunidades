//Dependency
import React, {Component} from 'react'
import {View,Text, StyleSheet, TouchableOpacity} from 'react-native'
import moment from 'moment'
import testID from '../../custom_node_modules/react-native-testid'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { marcarMensajeLeidos,cantMensajesNoLeidos } from '../store/actions/mensajesNotificaciones'
//Components
import { Col } from './Grid'

//Assets
import {BROWN_GREY,WHITE,OCEAN_BLUE,BLACK,BLUE_lINKTO} from '../styles/Colors'


class NotificacionesCard extends Component{

    state = {
     styleActive:false
    }


    goToFormularioVisita (id,idConten,active) {
        
        const {navigation: {navigate}, actions: {marcarMensajeLeidos,cantMensajesNoLeidos}} = this.props
        const oportunidadId = id !== undefined ? id.split('=')[1] : '';  
         
        const paramsConst = {
            fechaHasta : moment(new Date()).format("YYYY-MM-DD"),
            idContenidos : [idConten],
            leido : "true"
        }   
     
        const { fechaHasta,idContenidos,leido } = paramsConst; 
       
        if(active === false){
           oportunidadId ? navigate('FormularioOportunidad', {oportunidadId}) : null  
           marcarMensajeLeidos({idContenidos,leido})
           this.setState({styleActive:true})
           setTimeout(()=>cantMensajesNoLeidos({fechaHasta}),3000)
        }else{
           oportunidadId ? navigate('FormularioOportunidad', {oportunidadId}) : null  
        }
       
        return;
    }

    render() {
        const {Notificaciones:{fechaCreacion,contenidoPrivado,idContenido,leido},index} = this.props
        const creationDate = fechaCreacion !== undefined ? moment(fechaCreacion, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
        const { styleActive } = this.state
        const validateJson = contenidoPrivado.startsWith("{")
        const contentHide = validateJson === true ? JSON.parse(contenidoPrivado).secciones[0].texto.toString().split('.') : contenidoPrivado.toString().split('.')
        return (
            <TouchableOpacity style={styleActive === true || leido === true ? styles.containerClick : styles.container }  onPress={()=>this.goToFormularioVisita(contentHide.length == 3 ? contentHide[2]:contentHide[1],idContenido,leido)}
            {...testID({
                id: `Notification${index}Card`,
                label: `Tarjeta que contiene la notificación ${index}`
             })
            }
            >
                <View style={styles.containerHeader}>
                    <Col size={60}>
                        <Text style={styles.date}
                        {...testID({
                            id: `Notificación${index}CreateDate`,
                            label: `Contenedor de titulo de fecha creada la notificación`
                        })
                        } 
                        >{creationDate}</Text>
                    </Col>
                    <Col size={40}>
                        <Text style={styleActive === true || leido === true ? styles.linkTo2 : styles.linkTo}
                        {...testID({
                            id: `Notificación${index}Ver`,
                            label: `Contenedor de titulo de link ver`
                        })
                        }
                        >Ver</Text>
                    </Col>
                </View>
                <View>
                    <Text style={styles.text}
                    {...testID({
                        id: `Notificación${index}HideContent`,
                        label: `Contenedor de titulo que oculta contenido`
                    })
                    } 
                    >{ contentHide[0] }</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process
    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            marcarMensajeLeidos,
            cantMensajesNoLeidos,
        }, dispatch)
    }
}

 export default connect(mapStateToProps, mapDispatchToProps)(NotificacionesCard)

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical:10,
        height:'auto',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowColor: OCEAN_BLUE,
        shadowOpacity: 0.2,
        borderRadius: 4,
        borderTopWidth: 3,
        borderColor: OCEAN_BLUE,
        marginBottom:15,
    },
    containerClick: {
        backgroundColor: WHITE,
        paddingLeft: 20,
        paddingRight: 20,
        paddingVertical:10,
        height:'auto',
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowColor: BROWN_GREY,
        shadowOpacity: 0.2,
        borderRadius: 4,
        borderTopWidth: 3,
        borderColor: BROWN_GREY,
        marginBottom:15,
    },
    containerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    date: {
        textAlign: 'left',
        color:BROWN_GREY,
        fontSize: 15,
    },
    linkTo: {
        textAlign: 'right',
        color:BLUE_lINKTO,
        fontSize: 15,
    },
    linkTo2: {
        textAlign: 'right',
        color:BROWN_GREY,
        fontSize: 15,
    },
    text: {  
        fontSize: 15,
        fontWeight: 'bold',
        color: BLACK
    },

})

