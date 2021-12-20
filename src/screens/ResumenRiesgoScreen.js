import React, {Component} from 'react'
import {connect} from 'react-redux'
import {View, ScrollView, Image, Text, StyleSheet} from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import {Col, Row} from '../components/Grid'
import {TipoPregunta} from '../constants/Data'
import {formatoRut, montoPuntosMil} from '../utils/StringHelper'
import {BLACK, BACKGROUND_COLOR, BROWN_GREY, BROWN_RELIGHT_GREY, GREEN, WHITE} from '../styles/Colors'

require('moment/locale/es.js')
moment.locale('es')

type Props = {
    riesgo: Object,
    title: String
}

const mapStateToProps = (state, ownProps) => {
    return {
        preguntas: state.formularioRiesgo.preguntas,
        respuestas: state.formularioRiesgo.respuestas
    }
}

class ResumenRiesgoScreen extends Component<Props> {

    state = {}

    getPregunta = (item, key, isLast) => {
        const {preguntas} = this.props
        const tipo = (_.find(_.values(preguntas), (pg) => pg.name === item.pregunta) || {}).tipo
        const {DECIMAL, ENTERO, MONEDA} = TipoPregunta

        return (
            <View key={key}>
                <Row>
                    <Text style={styles.title}>{item.pregunta}:</Text>
                </Row>

                <Row>
                    <Text>
                        {(
                            tipo === DECIMAL ?
                                montoDecimal(item.respuesta) : tipo === MONEDA ?
                                formatearMonto(item.respuesta, '$') : tipo === ENTERO ?
                                    formatearMonto(item.respuesta) : _.capitalize(item.respuesta)
                        ) || '-'
                        }
                    </Text>
                </Row>

                {isLast ? null : <View style={[styles.separator, {marginTop: 10}]}/>}
            </View>
        )
    }

    renderSummary = () => {
        const {
            riesgo, riesgo: {
                usuarioNTCreador,
                fechaRiesgo,
                rutCliente,
                nombreCliente,
                grupoEconomico,
                detalle
            }
        } = this.props

        return (
            <View style={styles.container}>
                <View style={styles.summaryContainer}>
                    <View style={styles.detailsContainer}>
                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Creador:</Text>
                            <Text style={styles.value}>{usuarioNTCreador}</Text>
                        </View>

                        <View style={styles.separator}/>

                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Fecha riesgo:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={[styles.value, styles.twoCol]}>{moment(fechaRiesgo).format('DD-MM-YYYY')}</Text>
                                <Text
                                    style={[styles.value, styles.twoCol]}>{moment(fechaRiesgo).format('hh:mm A')}</Text>
                            </View>
                        </View>

                        <View style={styles.separator}/>

                        <View style={styles.simpleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.title, styles.twoCol]}>RUT cliente:</Text>
                                <Text style={[styles.title, styles.twoCol]}>Grupo económico:</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.value, styles.twoCol]}>{formatoRut(rutCliente) || '-'}</Text>
                                <Text style={[styles.value, styles.twoCol]}>{grupoEconomico || '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Nombre cliente:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.value}>{nombreCliente || '-'}</Text>
                            </View>
                        </View>


                        {_.isEmpty(detalle) ? null : <View style={styles.separator}/>}

                        {detalle.map((item, key) => {
                            return this.getPregunta(item, key, key === _.size(detalle) - 1)
                        })}
                    </View>
                </View>
            </View>
        )
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {this.renderSummary()}
            </ScrollView>
        )
    }
}

export default connect(mapStateToProps)(ResumenRiesgoScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10
    },
    separator: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: BROWN_RELIGHT_GREY,
    },
    summaryContainer: {
        backgroundColor: WHITE,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowColor: BROWN_GREY,
        shadowOpacity: 0.2,
        borderRadius: 4,
        marginBottom: 15,
        marginRight: 5,
        paddingTop: 10
    },
    detailsContainer: {
        paddingTop: 8,
        paddingLeft: 12,
        paddingRight: 12,
        paddingBottom: 8
    },
    simpleContainer: {
        marginBottom: 10
    },
    sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        color: BROWN_GREY,
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 5
    },
    value: {
        fontSize: 14
    },
    twoCol: {
        width: '50%'
    },
    threeCol: {
        width: '33%'
    }
})
