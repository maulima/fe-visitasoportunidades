import React, {Component} from 'react'
import {View,StyleSheet, TouchableOpacity,Text,ScrollView} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import { Col, Row } from '../components/Grid'
import {BACKGROUND_COLOR, GREEN} from '../styles/Colors'
import { clearVisita } from '../store/actions/visitas'
import _ from 'lodash'
import testID from '../../custom_node_modules/react-native-testid'
import {limpiarFilter} from '../store/actions/filtroVisitas'

type Props = {}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        cantVistPrio:state.visitas.cantVistPrio
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({clearVisita,limpiarFilter}, dispatch)
    }
}

class TipoVisitasScreen extends Component<Props> {
    static navigationOptions = ({navigation, screenProps}) => ({
        headerTitle: 'Visitas',
    })

    handleNavigation = (screen) => {
        const { actions:{clearVisita,limpiarFilter},navigation } = this.props
        setTimeout(() => {
            navigation.navigate(screen)
        }, 500); 
        limpiarFilter()
        clearVisita()
    }

    render() {
        const { cantVistPrio } = this.props
        return (
            <ScrollView style={styles.container}>
                <View style={styles.cardContainer}>
                  <Row>
                       <TouchableOpacity onPress={() => { this.handleNavigation('VisitasPriorizadas') }}
                                {...testID({
                                    id: "visitasPriorizadasButton",
                                    label: "Contenedor de menu visitas Priorizadas"
                                })
                                }
                            >
                             <Row style={styles.contVisitasPrior}>
                               <Col size={80}>     
                                  <Text style={styles.title_visitas_pr}
                                    {...testID({
                                        id: "tituloVisitasPriorizadas",
                                        label: "Contenedor de Texto de visitas Priorizadas"
                                    })
                                    }
                                  >PRIORIZADAS</Text>
                               </Col>
                               <Col size={20} style={{alignItems:'center'}}>
                                {cantVistPrio == 0 ? null : <View style={styles.icon_numer_visitas_pr}>   
                                  <Text style={{color:'#1E1E1E',fontSize:20}}
                                     {...testID({
                                        id: "NumeroCantidadVisitasPriorizadas",
                                        label: "Contenedor de Texto que muestra cantidad visitas Priorizadas"
                                    })
                                    }
                                  >{cantVistPrio}</Text>
                                </View>}
                               </Col>
                             </Row>     
                        </TouchableOpacity>
                      </Row>
                      <Row>
                       <TouchableOpacity onPress={() => { this.handleNavigation('VisitasRealizadasTab') }}
                                {...testID({
                                    id: "visitasRealizadasButton",
                                    label: "Contenedor de menu visitas Realizadas"
                                })
                                }
                            >
                             <Row style={styles.contVisitasPrior}>
                               <Col size={100}>     
                                  <Text style={styles.title_visitas_pr}
                                    {...testID({
                                        id: "tituloVisitasaRealizadas",
                                        label: "Contenedor de Texto de visitas Realizadas"
                                    })
                                    }
                                  >REALIZADAS</Text>
                               </Col>
                             </Row>     
                        </TouchableOpacity>
                      </Row>  
                </View>
             </ScrollView>
            )
        }
    }


export default connect(mapStateToProps, mapDispatchToProps)(TipoVisitasScreen)

const styles = StyleSheet.create({
    container: {
       flex: 1,
       backgroundColor: BACKGROUND_COLOR,
    },
    cardContainer: {
        width: '92%',
        marginLeft: '4%',
        marginTop: 20,
        padding: 0
    },
    contVisitasPrior:{
        height: 65,
        marginBottom: 20,
        paddingVertical:20,
        paddingRight:25,
        backgroundColor: 'white',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowColor: 'black',
        shadowOpacity: 0.2,
        borderRadius:5,
    },
    title_visitas_pr:{
        height: 21,
        width: 173,
        color:'#1E1E1E',
        fontSize:16,
        marginLeft:15,
        marginTop:5,
        fontWeight: 'bold'
    },
    icon_numer_visitas_pr:{
        borderRadius: 50,
        width:34,
        height:34,
        backgroundColor:'#FFD700',
        alignItems:'center',
        justifyContent:'center'
    }
})
