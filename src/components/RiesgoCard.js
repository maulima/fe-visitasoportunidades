import React, { PureComponent } from 'react'
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Col, Row } from '../components/Grid'
import moment from 'moment'
import testID from '../../custom_node_modules/react-native-testid'
import { BLACK, BROWN_GREY, BROWN_LIGHT_GREY, GREEN, RED, WHITE, YELLOW } from '../styles/Colors'
import { formatoRut } from '../utils/StringHelper'

require('moment/locale/es.js')
moment.locale('es')

type Props = {
    riesgo: Object,
    navigation: func
}

class RiesgoCard extends PureComponent<Props> {
    render() {
        const { riesgo, riesgo: { nombreCreador }, fromVisita,index } = this.props
        const fechaRiesgo = moment(riesgo.fechaRiesgo).format('DD-MM-YYYY hh:mmA')
        const fechaTranscurrida = moment(riesgo.fechaRiesgo).fromNow()

        return (
            <View style={ [styles.container, styles.containerFromVisita] }>
                <View style={ styles.containerDetails }>
                    <Row>
                        <Col size={50}>
                            <Row style={{ paddingRight: 5 }}>
                                <Text style={ [styles.nameContainer, { textTransform: 'none' }] }
                                 {...testID({
                                    id: `fecha${index}riesgo`,
                                    label: `Contenedor de texto de fecha riesgo`
                                 })}
                                >{ fechaRiesgo }</Text>
                            </Row>
                        </Col>
                        <Col size={50} style={ styles.nameContainer }>
                            <Text style={ [styles.date, styles.rightText] }
                            {...testID({
                                id: `fecha${index}transcurrida`,
                                label: `Contenedor de texto de fecha transcurrida`
                             })}
                            >{ fechaTranscurrida }</Text>
                        </Col>
                    </Row>

                    <View style={ [{ marginVertical: 5 }] } />

                    <Row>
                        <Col size={100}>
                            <Row style={{ paddingRight: 5 }}>
                                <Text style={ [styles.nameContainer, { textTransform: 'none' }] }
                                 {...testID({
                                    id: `nombre${index}creador`,
                                    label: `Contenedor de texto de nombre creador`
                                 })}
                                >{ nombreCreador }</Text>
                            </Row>
                        </Col>
                    </Row>
                </View>
            </View>
        )

    }
}

export default RiesgoCard

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
        flexDirection:'row',
        alignItems: 'center',
        flexDirection: 'row',
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
    }
})
