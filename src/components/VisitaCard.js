import React, {PureComponent} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Col, Row} from '../components/Grid'
import {formatoRut} from '../utils/StringHelper'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {obtenerFormVisita} from '../store/actions/formularioVisita'
import { obtenerVisita} from '../store/actions/visitas'
import {BLACK, BROWN_GREY, WHITE} from '../styles/Colors'
import testID from '../../custom_node_modules/react-native-testid'
import privadoIcon from '../../assets/images/icons/privado.png'
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
        actions: bindActionCreators({obtenerVisita}, dispatch)
    }
}

class VisitaCard extends PureComponent<Props> {

    goToFormularioVisita = () => {
        const {visita: {visitaId}, navigation: {navigate},actions: {obtenerVisita},tipoVisita} = this.props

        if (visitaId) navigate('ResumenEditVisita')
        
        obtenerVisita({visitaId,tipoVisita})
        //obtenerFormVisita(tipoVisita)
    }

    hasCartera = () => {
        const {cartera, visita: {rutEmpresa}} = this.props
        return _.isEmpty(cartera) ? false : cartera.includes(rutEmpresa)
    }

    esParticipante = () => {
        const {visita: {esParticipante}} = this.props
        return esParticipante
    }

    render() {
        const {visita: {tituloVisita, fechaVisita, nombreEmpresa, rutEmpresa, oportunidad, privado,realizada}, index} = this.props
        return (
            <TouchableOpacity onPress={this.goToFormularioVisita}
                              {...testID({
                                  id: `visita${index}Card`,
                                  label: `Contenedor de tarjeta de visita numero ${index}`
                              })
                              }
            >
                <View style={styles.container}>
                    <View style={styles.typeContainer}>
                        <Col size={60}>
                            <Row>
                                <Text style={styles.type}
                                      {...testID({
                                          id: `tituloVisita${index}`,
                                          label: `Contenedor de texto de titulo de visita`
                                      })
                                      }
                                >
                                    {tituloVisita}
                                </Text>

                                {oportunidad &&
                                <View style={styles.dollarIconContainer}>
                                    <Image source={require('./../../assets/images/icons/monetization.png')}
                                        {...testID({
                                            id: `IconoDollar${index}`,
                                            label: `Icono de dollar`
                                        })}
                                    />
                                </View>
                                }
                                {this.esParticipante() &&
                                <View style={styles.dollarIconContainer}>
                                    <Image source={require('./../../assets/images/icons/person-icon.png')}
                                       {...testID({
                                        id: `IconoParticipante${index}`,
                                        label: `Icono de aviso que el user conectado es participante a la visita`
                                      })}
                                    />
                                </View>
                                }
                               {/*this.hasCartera() &&
                                <View style={styles.dollarIconContainer}>
                                    <Image source={require('./../../assets/images/icons/maletin-icon.png')}
                                         {...testID({
                                          id: `IconoCartera${index}`,
                                          label: `Icono de aviso que el cliente que asocia la visita o oportunidad pertenece a la cartera del banquero`
                                        })}
                                    />

                                </View>
                                */}
                            </Row>
                        </Col>

                        <Col size={40}>
                            <Text style={styles.date}
                                  {...testID({
                                      id: `fechaVisita${index}`,
                                      label: `Contenedor de texto de fecha de visita`
                                  })
                                  }
                            >
                                {fechaVisita}
                            </Text>
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
                        <Image source={require('./../../assets/images/icons/factory.png')}/>
                        <Text style={styles.rut}
                              {...testID({
                                  id: `rutEmpresaVisita${index}`,
                                  label: `Contenedor de texto de rut de empresa`
                              })}
                        >
                            {formatoRut(rutEmpresa)}
                        </Text>
                    </View>
                    {privado &&
                    <View style={styles.containerPrivado}>
                        <Image style={styles.imagePrivado} source={privadoIcon} />  
                    </View>
                    }
                    {realizada ? <View style={styles.containerIconPrioriaza}>
                        <Image source={require('./../../assets/images/icons/ic-viene_de_priorizada.png')}
                               {...testID({
                                    id: `IconoCartera${index}`,
                                    label: `Icono de aviso que el row es una visita priorizada`
                                 })}
                         />

                   </View>:null}
                </View>
            </TouchableOpacity>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(VisitaCard)

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE,
        height: 'auto',
        marginBottom: 15,
        marginRight: 5,
        paddingTop: 8,
        paddingBottom: 8,
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
        marginBottom: 15
    },
    type: {
        width: 'auto',
        alignSelf: 'flex-start',
        color: BLACK,
        textTransform: 'uppercase',
        fontWeight: '600',
        flexWrap: 'wrap',
        paddingRight: 5
    },
    date: {
        width: '100%',
        textAlign: 'right',
        flexWrap: 'wrap',
        fontSize: 13,
        color: BROWN_GREY
    },
    detailsContainer: {
        flexDirection: 'row',
        marginBottom: 15
    },
    dollarIconContainer: {
        marginHorizontal: 4,
        alignSelf: 'flex-start'
    },
    factory: {
        marginLeft: 15,
        textTransform: 'uppercase',
        flexWrap: 'wrap'
    },
    rut: {
        marginLeft: 15,
        flexWrap: 'wrap'
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
    containerIconPrioriaza:{
        position: 'absolute',
        bottom: 5,
        right: 33,
    },
    imagePrivado: {
        width: 27,
        height: 38
    },

})
