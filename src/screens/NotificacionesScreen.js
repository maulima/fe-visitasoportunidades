//Dependency
import React, {Component} from 'react'
import {View, ScrollView,StyleSheet,RefreshControl,Dimensions} from 'react-native'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import _ from 'lodash'
import moment from 'moment'
import {mensajesNotificaciones,cantMensajesNoLeidos} from '../store/actions/mensajesNotificaciones'
//Components
import Loading from '../components/Loading'
import Unauthorized from '../components/Unauthorized'
import NotificacionesCard from '../components/NotificacionesCard'
import NotificacionesSinResultados from '../components/NotificacionesSinResultados'
import Header from '../components/Header'

//Assets
import { BACKGROUND_COLOR } from '../styles/Colors';

require('moment/locale/es.js')
moment.locale('es')

class NotificacionesScreen extends Component {
    
    state = {
        loading: true,
        refreshing: false,
    }

    componentWillMount() {
        const {
            actions: {mensajesNotificaciones,cantMensajesNoLeidos}
        } = this.props
        //const d = new Date();
        //const n = d.getFullYear();
        const paramsConst = {
            //fechaDesde : moment(`01-01-${n}`).format("YYYY-MM-DD"),
            fechaHasta : moment(new Date()).format("YYYY-MM-DD"),
            limite:20,
            pagina:0 
        }    

        const { fechaHasta,limite,pagina } = paramsConst;
        mensajesNotificaciones({fechaHasta,limite,pagina})
        cantMensajesNoLeidos({fechaHasta})
    }
     
    componentWillReceiveProps(nextProps) {
        const {isFetching} = this.props

        if (isFetching && !nextProps.isFetching) {
            this.setState({loading: false, refreshing: false,})
        }
    }
   
    getOportunidadesList = () => {
       const { Notificaciones,navigation } = this.props
       return _.map(Notificaciones, (notificacion, index) => <NotificacionesCard  key={index}
                                                                                  index={index}
                                                                                  Notificaciones={notificacion}
                                                                                  navigation={navigation} 
                                                                                   
       />
       )
    }

    siguientePagina = (e) => {
        const { actions:{mensajesNotificaciones},totalFetch,isRefreshing,pagina } = this.props
        const { height } = Dimensions.get('window')
        const contentHeight = e.nativeEvent.contentSize.height
        const contentOffsetY = e.nativeEvent.contentOffset.y
        
        const paramsConst = {
           fechaHasta:moment(new Date()).format("YYYY-MM-DD"),
           limite:20
        }
         
        const { fechaHasta,limite} = paramsConst

        if (contentOffsetY > contentHeight - height) {
            if(!isRefreshing && !totalFetch){
                mensajesNotificaciones({ fechaHasta, pagina : pagina + 1,limite}); 
            }
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true})
        const {
            actions: { mensajesNotificaciones,cantMensajesNoLeidos },
        } = this.props
        const paramsConst = {
            fechaHasta : moment(new Date()).format("YYYY-MM-DD"),
            pagina:0,
            limite:20 
        }

        const { fechaHasta } = paramsConst;
        cantMensajesNoLeidos({fechaHasta})

        mensajesNotificaciones({
            ...paramsConst
        });
    }


    render() {
        const { isRefreshing,navigation,total,error} = this.props
        const { refreshing,loading} = this.state
        if (loading) {
            return <Loading/>
        } else if (error === 'unauthorized') {
            return <Unauthorized/>
        }else{
            return (
            <View style={styles.container}>
                <Header navigation={navigation} total={total}   />
                <ScrollView contentContainerStyle={styles.containerScrollNot} onScroll={(e) => this.siguientePagina(e)}
                                  scrollEventThrottle={400}
                                  refreshControl={
                                      <RefreshControl
                                          refreshing={refreshing}
                                          onRefresh={this._onRefresh}
                                      />
                                  }
                   >  
                    {total === 0  ?  
                        <NotificacionesSinResultados/>
                       : 
                       this.getOportunidadesList()
                    }

                    {isRefreshing ?
                        <Loading/> : undefined
                    }
                </ScrollView>
            </View>
        )
       }
     } 
   }



const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process
    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        Notificaciones:state.mensajesNotificaciones.lista,
        isFetching: state.mensajesNotificaciones.isFetching,
        isRefreshing: state.mensajesNotificaciones.isRefreshing,    
        totalFetch:state.mensajesNotificaciones.totalMensaje,
        total:state.mensajesNotificaciones.total,
        pagina: state.mensajesNotificaciones.pagina,
        error: state.mensajesNotificaciones.errorMessage,
        val_imagen_sin_not:state.mensajesNotificaciones.val_imagen_sin_not,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            mensajesNotificaciones,
            cantMensajesNoLeidos
        }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificacionesScreen)

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: BACKGROUND_COLOR,
        paddingBottom:15
    },
    containerScrollNot:{
        marginTop: 20,
        marginHorizontal:20,
    }

})
