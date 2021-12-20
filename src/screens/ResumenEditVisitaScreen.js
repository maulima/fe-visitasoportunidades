//Dependency
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import GoBackButton from '../components/GoBackButton'
import moment from 'moment'
import _ from 'lodash'
//Screen
import ResumenVisitaRealizada from './ResumenVisitaRealizada'

const mapStateToProps = (state, ownProps) => {
    const {env: {API_ENV}} = process
    const fromMain = ownProps.navigation.getParam('fromMain')
    return {
        ...(fromMain ? {fromMain} : {}),
        visita: state.visitas.item
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
        }, dispatch)
    }
}

type Props = {}

class ResumenEditVisitaScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: 'Resumen Visita',
        headerLeft: <GoBackButton onPress={() => {
            navigation.goBack()
         }}/>
    })

    state = {
        fechaVisita:'',
        usuarioNTCreador:'',
        motivo1:[],
        motivo2:[],
        motivo3:[],
        motivo4:[],
        rutEmpresa:'',
        nombreEmpresa:'',
        grupoEconomico:'',
        privado:false,
        oportunidades:[],
        riesgos:[]
    }

    componentDidUpdate(prevProps){
       const { visita }  = this.props
       
       if(visita !== prevProps.visita){
         this.setVisitaResumen(visita)
       }

    }

    setVisitaResumen = (visita) => {

       const { usuarioNTCreador,detalle,notas,resumen:{fechaCreacion,rutEmpresa,nombreEmpresa,grupoEconomico,fechaVisita,privado},oportunidades,riesgos } = visita
       const motivoArr1 = _.filter(detalle, (x) => x.pregunta === 'Motivo de la visita')
       const motivoArr2 = _.filter(detalle, (x) => x.pregunta === 'Gestión de la visita')
       const motivoArr3 = _.filter(detalle, (x) => x.pregunta === 'Detalle del origen')
       const motivoArr4 = _.filter(detalle, (x) => x.pregunta === 'Subdetalle de la visita')      

       this.setState({
            fechaCr:fechaCreacion,
            fechaVisita,
            rutEmpresa,
            nombreEmpresa,
            grupoEconomico,
            usuarioNTCreador,
            motivo1:motivoArr1,
            motivo2:motivoArr2,
            motivo3:motivoArr3,
            motivo4:motivoArr4,
            notas,
            privado,
            oportunidades,
            riesgos
        })
    }

    render() {
        const { usuarioNTCreador,fechaCr,motivo1,motivo2,motivo3,motivo4,rutEmpresa,nombreEmpresa,grupoEconomico,notas,fechaVisita,privado,oportunidades,riesgos } = this.state
        resumen = {
            fechaVisita,
            fechaCr,
            usuarioNTCreador,
            motivo1,
            motivo2,
            motivo3,
            motivo4,
            rutEmpresa,
            nombreEmpresa,
            grupoEconomico,
            notas,
            privado,
            oportunidades,
            riesgos
        }
        return(
             <ResumenVisitaRealizada
                 visita={resumen}
                 navigation={this.props.navigation}
             />
        ) 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResumenEditVisitaScreen)

