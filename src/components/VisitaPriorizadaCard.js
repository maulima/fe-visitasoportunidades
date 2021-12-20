import React, {PureComponent} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Col, Row} from '../components/Grid'
import {formatoRut} from '../utils/StringHelper'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {obtenerFormVisita} from '../store/actions/formularioVisita'
import {BLACK, BROWN_GREY, WHITE} from '../styles/Colors'
import testID from '../../custom_node_modules/react-native-testid'
//import privadoIcon from '../../assets/images/icons/privado.png'
import _ from 'lodash'

type Props = {
    visit: Object
}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({obtenerFormVisita}, dispatch)
    }
}

class VisitaPriorizadaCard extends PureComponent<Props> {

    state = {
        hideEditPrio:false  
    }

    goToFormularioVisitaPriorizada = () => {
        const {visita: {visitaId}, navigation: {navigate},actions: {obtenerFormVisita},tipoVisita} = this.props
        const { hideEditPrio } = this.state
        if (visitaId) navigate('FormularioVisitaPriorizada', {visitaId,tipoVisita,hideEditPrio})

        obtenerFormVisita(tipoVisita)
    }

    ValidstateIconVistPrior = () => {
        const {visita:{realizada,rechazo,rechazoBanco}} = this.props
        if(realizada === true){
          if(rechazo === true){
              if(rechazoBanco == true){
                this.setState({hideEditPrio:true})    
                return (<Image source={require('./../../assets/images/icons/Group_8.png')} style={styles.icon_group2}/>)
              }else{
                this.setState({hideEditPrio:true})  
                return (<Image source={require('./../../assets/images/icons/Group_2.png')} style={styles.icon_group2}/>)
              }
          }else{
              this.setState({hideEditPrio:true})  
              return (<Image source={require('./../../assets/images/icons/circle_with_check_symbol.png')} style={styles.icon_group2}/>)
          }
        }else{
            this.setState({hideEditPrio:false})
        }
    }

    render() {
        const {visita: {tituloVisita,fechaVisita, nombreEmpresa,rutEmpresa}, index,contador} = this.props
        return (
          <TouchableOpacity onPress={this.goToFormularioVisitaPriorizada}
                              {...testID({
                                  id: `visita${index}Card`,
                                  label: `Contenedor de tarjeta de visita priorizada numero ${index}`
                              })
                              }
            >
                <View style={styles.container}>
                    <View style={styles.typeContainer}>
                        <Col size={45}>
                                <Text style={styles.type}
                                      {...testID({
                                          id: `titulo${index}Visita`,
                                          label: `Contenedor de texto de titulo de visita Priorizada`
                                      })
                                      }
                                >
                                  {tituloVisita}
                                </Text>
                        </Col>

                        <Col size={55}>
                          <Row style={styles.icon_radius_date}>
                            <Text style={styles.date}
                                  {...testID({
                                      id: `fechaVisita${index}`,
                                      label: `Contenedor de texto de fecha de visita prioriazada`
                                  })
                                  }
                            >
                             {fechaVisita}
                            </Text>
                            <View style={styles.icon_numer_visitas_pr}>   
                                  <Text style={styles.text_numer_visitas_pr}
                                      {...testID({
                                        id: `textoNumeroVisitasPriorizadas${index}`,
                                        label: `Contenedor de texto de numero de visitas priorizadas`
                                    })
                                  }
                                  >{contador}</Text>
                            </View>
                          </Row>  
                        </Col>
                    </View>
                    <View style={styles.detailsContainer}>
                        <Image source={require('./../../assets/images/icons/iden_user.png')}/>
                        <Text style={styles.factory}
                              {...testID({
                                  id: `nombreEmpresaVisita${index}`,
                                  label: `Contenedor de texto de nombre de empresa`
                              })
                              }
                       >
                            {nombreEmpresa}
                        </Text>
                    </View>
                    <View style={styles.detailsContainer}>
                      <Col size={50} style={{marginTop:20}}>
                        <Image source={require('./../../assets/images/icons/factory.png')}/>
                        <Text style={styles.rut}
                              {...testID({
                                  id: `rutEmpresaVisita${index}`,
                                   label: `Contenedor de texto de rut de empresa`
                              })}
                            >
                            {formatoRut(rutEmpresa)}
                        </Text>
                    </Col>
                    <Col size={50} style={{marginTop:15}}>
                          {this.ValidstateIconVistPrior()}
                    </Col>
                  </View>
                </View>
            </TouchableOpacity>
        )
      
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitaPriorizadaCard)

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        height: 'auto',
        marginTop:10,
        marginBottom: 15,
        marginRight: 5,
        paddingTop: 12,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 12,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowColor: BROWN_GREY,
        shadowOpacity: 0.2,
        borderRadius: 4
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    type: {
        width: 'auto',
        alignSelf: 'flex-start',
        color: BLACK,
        textTransform: 'uppercase',
        fontWeight: '600',
        flexWrap: 'wrap',
        paddingVertical:7,
        paddingRight: 5
    },
    date: {
        justifyContent:'flex-end',
        marginRight:10,
        paddingVertical:5,
        flexWrap: 'wrap',
        fontSize: 13,
        color: BROWN_GREY
    },
    detailsContainer: {
        flexDirection: 'row',
    },
    dollarIconContainer: {
        marginHorizontal: 4,
        alignSelf: 'flex-start'
    },
    factory: {
        marginLeft: 5,
        textTransform: 'uppercase',
        fontWeight: '600',
        flexWrap: 'wrap'
    },
    rut: {
        marginLeft: 25,
        fontWeight: '600',
        marginTop:-15
    },
    userName: {
        marginLeft: 15,
        flexWrap: 'wrap'
    },
    containerPrivado: {
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    imagePrivado: {
        width: 27,
        height: 38
    },
    icon_numer_visitas_pr:{
        borderRadius: 50,
        width:33,
        height:29,
        backgroundColor:'#FFD700',
        alignItems:'center',
        justifyContent:'center'
    },
    text_numer_visitas_pr:{
        color:'#1E1E1E',
        fontSize:18
    },
    icon_group2:{
        alignSelf:'flex-end'
    },
    icon_radius_date:{
        justifyContent:'flex-end'
    }
})
