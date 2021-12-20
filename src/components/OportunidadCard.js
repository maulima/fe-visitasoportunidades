import React, {PureComponent} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {Col, Row} from '../components/Grid'
import moment from 'moment'
import testID from '../../custom_node_modules/react-native-testid'

import {BLACK, BROWN_GREY, BROWN_LIGHT_GREY, GREEN, RED, WHITE, YELLOW} from '../styles/Colors'
import {formatoRut} from '../utils/StringHelper'
import privadoIcon from '../../assets/images/icons/privado.png'
import _ from 'lodash'

type Props = {
    oportunidad: Object,
    navigation: func
}

class OportunidadCard extends PureComponent<Props> {

    goToFormularioOportunidad = () => {
        const {oportunidad: {oportunidadId}, navigation: {navigate}} = this.props

        if (oportunidadId) navigate('FormularioOportunidad', {oportunidadId})
    }
    hasCartera = () => {
        const {cartera, oportunidad: {rutEmpresa}} = this.props
        return _.isEmpty(cartera) ? false : cartera.includes(rutEmpresa)
    }

    render() {
        const {oportunidad, fromVisita, index} = this.props
        const currentDate = new Date()
        const limitDate = new Date(moment(oportunidad.fechaFin).format())


        const diffSeconds = limitDate - currentDate
        const diffDays = (diffSeconds) / 3600000 / 24
        const colorStatus = diffDays > 10 ? GREEN : diffSeconds > 0 ? YELLOW : RED

        const creationDate = oportunidad.fechaCreacion !== undefined ? moment(oportunidad.fechaCreacion, 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
        const endDate = moment(oportunidad.fechaFin).format('DD-MM-YYYY')

        if (fromVisita) {
            return (
                <View style={[styles.container, styles.containerFromVisita, {borderRightColor: colorStatus}]}>
                    <View style={styles.containerDetails}>
                        <Row>
                            <Col size={70}>
                                <Row style={{paddingRight: 5}}>
                                    <Text style={[styles.negocio, {textTransform: 'none'}]}>{oportunidad.negocio}</Text>
                                </Row>
                            </Col>
                            <Col size={30} style={styles.nameContainer}>
                                <Text style={[styles.date, styles.rightText]}>{creationDate}</Text>
                            </Col>
                        </Row>

                        <Row>
                            <Col size={70}>
                                <Row style={{paddingRight: 5}}>
                                    <Text style={[styles.negocio, {textTransform: 'none', fontWeight: 'normal'}]}>
                                        {oportunidad.nombreEstado}
                                    </Text>
                                </Row>
                            </Col>
                            <Col size={30} style={styles.nameContainer}>
                                <Text style={[styles.date, styles.rightText]}>{oportunidad.monto}</Text>
                            </Col>
                        </Row>

                        <View style={[styles.separator, {marginVertical: 5}]}/>

                        <Row>
                            <Col size={70}>
                                <Row style={{paddingRight: 5}}>
                                    <Text style={[styles.negocio, {
                                        color: BROWN_GREY,
                                        textTransform: 'none',
                                        fontWeight: 'normal'
                                    }]}>
                                        {'Fecha estimada de cierre:'}
                                    </Text>
                                </Row>
                            </Col>
                            <Col size={30} style={styles.nameContainer}>
                                <Text style={[styles.date, styles.rightText]}>{endDate}</Text>
                            </Col>
                        </Row>
                    </View>
                </View>
            )
        } else {
            return (
                <TouchableOpacity style={[styles.container, {borderTopColor: colorStatus}]}
                                  onPress={this.goToFormularioOportunidad}
                                  {...testID({
                                      id: `oportunidad${index}Card`,
                                      label: `Contenedor de tarjeta de oportunidad número ${index}`
                                  })
                                  }
                >
                    <View style={styles.containerDetails}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.name}
                                  {...testID({
                                      id: `oportunidad${index}ResponsableTextBox`,
                                      label: `Contenedor de texto del nombre del responsable`
                                  })
                                  }
                            >
                                {oportunidad.nombreResponsable}
                            </Text>
                            <Text style={styles.date}
                                  {...testID({
                                      id: `oportunidad${index}CreationDateTextBox`,
                                      label: `Contenedor de texto de la fecha de creación`
                                  })
                                  }
                            >
                                {creationDate}
                            </Text>
                        </View>
                        <View style={styles.productContainer}>
                            <Col size={70} style={{flexDirection: 'row'}}>
                                <Row style={{paddingRight: 5}}>
                                    <Text style={styles.negocio}
                                          {...testID({
                                              id: `oportunidad${index}NegocioTextBox`,
                                              label: `Contenedor de texto del negocio`
                                          })
                                          }
                                    >
                                        {oportunidad.negocio}
                                    </Text>
                                    <Text style={styles.producto}
                                          {...testID({
                                              id: `oportunidad${index}ProductoTextBox`,
                                              label: `Contenedor de texto del producto`
                                          })
                                          }
                                    >
                                        {oportunidad.producto}
                                    </Text>
                                </Row>
                            </Col>
                            <Col size={30} style={styles.typeContainer}>
                                <Text style={styles.type}
                                      {...testID({
                                          id: `oportunidad${index}NombreEstadoTextBox`,
                                          label: `Contenedor de texto del estado de la oportunidad`
                                      })
                                      }
                                >
                                    {oportunidad.nombreEstado}
                                </Text>
                            </Col>
                        </View>
                        <View style={styles.itemContainer}>

                            <Col size={70} style={{flexDirection: 'row'}}>
                                <Image source={require('./../../assets/images/icons/monetization.png')}/>
                                <Text style={styles.details}
                                      {...testID({
                                          id: `oportunidad${index}MontoTextBox`,
                                          label: `Contenedor de texto del monto`
                                      })
                                      }
                                >
                                    {oportunidad.monto}
                                </Text>
                            </Col>
                            <Col size={30} style={{
                                alignItems: 'flex-end',
                            }}>
                                {/*this.hasCartera() &&
                                <Image source={require('./../../assets/images/icons/maletin-icon.png')}/>
                                */}
                            </Col>
                        </View>
                        <View style={styles.itemContainer}>
                            <Image source={require('./../../assets/images/icons/iden_user.png')}/>
                            <Text style={styles.details}
                                  {...testID({
                                      id: `oportunidad${index}RutEmpresaTextBox`,
                                      label: `Contenedor de texto del rut de empresa`
                                  })
                                  }
                            >
                                {formatoRut(oportunidad.rutEmpresa)}
                            </Text>
                        </View>
                        <View style={styles.itemContainer}>
                            <Image source={require('./../../assets/images/icons/factory.png')}/>
                            <Text style={styles.details}
                                  {...testID({
                                      id: `oportunidad${index}NombreEmpresaTextBox`,
                                      label: `Contenedor de texto del nombre de empresa`
                                  })
                                  }
                            >
                                {oportunidad.nombreEmpresa}
                            </Text>
                        </View>
                        {oportunidad.privado &&
                        <View style={styles.containerPrivado}>
                            <Image style={styles.imagePrivado} source={privadoIcon}  
                                  {...testID({
                                      id: `BotonConfidencialidad`,
                                      label: `Boton switch para marca una oportunidad como confidencial`
                                  })
                                  }/>
                        </View>
                        }
                    </View>
                    <View style={styles.separator}/>
                    <View style={styles.statusContainer}
                          {...testID({
                              id: `oportunidad${index}EndDateContainer`,
                              label: `Contenedor de fecha estimada de cierre`
                          })
                          }
                    >
                        <View style={[styles.circle, {backgroundColor: colorStatus}]}/>
                        <Text style={styles.closeDateLabel}
                              {...testID({
                                  id: `oportunidad${index}EndDateLabel`,
                                  label: `Contenedor de titulo de fecha estimada de cierre`
                              })
                              }
                        >
                            Fecha estimada de cierre:
                        </Text>
                        <Text style={styles.closeDate}
                              {...testID({
                                  id: `oportunidad${index}EndDateTextBox`,
                                  label: `Contenedor de texto de fecha estimada de cierre`
                              })
                              }
                        >
                            {endDate}
                        </Text>
                    </View>
                </TouchableOpacity>
            )
        }


    }
}

export default OportunidadCard

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        backgroundColor: WHITE,
        borderTopWidth: 4,
        borderTopColor: GREEN,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowColor: BROWN_GREY,
        shadowOpacity: 0.2,
        borderRadius: 4,
        marginBottom: 15,
        marginRight: 5,
        paddingBottom: 5
    },
    containerFromVisita: {
        borderTopWidth: 0,
        borderTopColor: 'transparent',
        borderRightWidth: 4,
        borderRightColor: GREEN,
    },
    containerDetails: {
        paddingTop: 8,
        paddingLeft: 15,
        paddingRight: 12,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    name: {
        color: BROWN_GREY,
        fontWeight: '100',
        fontSize: 13,
        textTransform: 'capitalize'
    },
    date: {
        fontSize: 13,
        color: BROWN_GREY
    },
    rightText: {
        width: '100%',
        textAlign: 'right'
    },
    productContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    negocio: {
        fontSize: 15,
        textTransform: 'uppercase',
        color: BLACK,
        fontWeight: '600',
        marginRight: 10
    },
    producto: {
        fontSize: 15,
        color: BLACK,
    },
    productType: {
        fontSize: 15,
    },
    typeContainer: {
        backgroundColor: BLACK,
        paddingTop: 4,
        paddingLeft: 17,
        paddingRight: 17,
        paddingBottom: 5,
        borderRadius: 50,
        height: 22
    },
    type: {
        fontSize: 12,
        color: WHITE,
        width: '100%',
        textAlign: 'center'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    details: {
        flex: 1,
        marginLeft: 10,
        fontWeight: '500',
        flexWrap: 'wrap',
        color: BLACK,
    },
    separator: {
        borderBottomColor: BROWN_LIGHT_GREY,
        borderBottomWidth: 1,
        paddingLeft: 0,
        paddingRight: 0,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingLeft: 12
    },
    circle: {
        width: 12,
        height: 12,
        borderRadius: 50,
        marginRight: 22
    },
    greenStatus: {
        backgroundColor: GREEN
    },
    yellowStatus: {
        backgroundColor: YELLOW
    },
    redStatus: {
        backgroundColor: RED
    },
    closeDateLabel: {
        fontSize: 12,
        marginRight: 13
    },
    closeDate: {
        fontSize: 13,
        fontWeight: '500'
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

})
