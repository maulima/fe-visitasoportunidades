import React, {Component} from 'react'
import {View, ScrollView, Image, Text, StyleSheet} from 'react-native'
import RiesgoCard from '../components/RiesgoCard'
import OportunidadCard from '../components/OportunidadCard'
import moment from 'moment'
import _ from 'lodash'
import {Col, Row} from '../components/Grid'
import {formatoRut, montoPuntosMil} from '../utils/StringHelper'
import {BLACK, BACKGROUND_COLOR, BROWN_GREY, BROWN_RELIGHT_GREY, GREEN, WHITE} from '../styles/Colors'
import ResumenNota from '../components/resumenNota'
import privadoIcon from '../../assets/images/icons/privado.png'

require('moment/locale/es.js')
moment.locale('es')

type Props = {
    visita: Object,
    title: String
}

class ResumenVisitaScreen extends Component<Props> {

    state = {}
    getNotas = (notas) => {
        if (!_.isEmpty(notas)) {
            return (
                <ResumenNota notas={notas}/>
            )
        }
    }

    renderSummary = () => {
        const {
            visita,tipoVisita,visita: {
                usuarioNTCreador,
                fechaVisita,
                origenVisita,
                motivoVisita,
                gestionVisita,
                subdetalleVisita,
                detalleOrigen,
                rutCliente,
                nombreCliente,
                grupoEconomico,
                oportunidades,
                riesgos,
                participantes,
                notas,
                fechaCreacion,
                plataform
            }
        } = this.props
        const hayParticipantes = !!_.find(participantes, (pt) => !!pt.usuarioNt)
        const plataformEmpresa = plataform === undefined || plataform == "" ? '-' :  plataform
        return (
            <View style={styles.container}>
                <View style={styles.summaryContainer}>
                    <View style={styles.detailsContainer}>
                        
                       { tipoVisita == 2 ? <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Gestión de la Visita</Text>
                            <Text style={styles.value}>{gestionVisita}</Text>
                        </View>:null}

                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Creador:</Text>
                            <Text style={styles.value}>{usuarioNTCreador}</Text>
                        </View>

                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Plataforma Empresa</Text>
                            <Text style={styles.value}>{plataformEmpresa}</Text>
                        </View>

                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Fecha de creación:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.value]}>{moment(fechaCreacion).format('DD-MM-YYYY hh:mm A')}</Text>
                            </View>
                        </View>

                        <View style={styles.separator}/>
                        <View style={styles.simpleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.title, styles.twoCol]}>Fecha de visita:</Text>
                                <Text style={[styles.title, {width: '40%'}]}>Tipo de visita:</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Col size={50}>
                                    <Text
                                        style={[styles.value, styles.twoCol]}>{moment(fechaVisita).format('DD-MM-YYYY')}</Text>
                                </Col>
                                <Col size={40}>
                                    <Text style={[styles.value]}>{visita.privado ? 'Confidencial' : 'Pública'}</Text>
                                </Col>
                                <Col size={10}>
                                    {visita.privado &&
                                    < Image style={{width: 30, height: 40}} source={privadoIcon}/>
                                    }
                                </Col>
                            </View>
                        </View>
                        {hayParticipantes ?
                            <View>
                                <View style={styles.separator}/>
                                <View style={styles.simpleContainer}>
                                    <Text style={styles.title}>Participante(s):</Text>
                                    {_.map(participantes, (participante, i) => {
                                        return (
                                            <View key={i} style={{flexDirection: 'row'}}>
                                                <Text style={styles.value}>{participante.nombreColaborador}</Text>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View> : null
                        }
                        <View style={styles.separator}/>
                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Origen de la visita:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.value}>{origenVisita}</Text>
                            </View>
                        </View>
                        {detalleOrigen ?
                            <View style={styles.simpleContainer}>
                                <Text style={styles.title}>Detalle origen visita:</Text>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.value}>{detalleOrigen}</Text>
                                </View>
                            </View> : null
                        }
                        <View style={styles.separator}/>
                        <View style={styles.simpleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.title, styles.twoCol]}>Motivo de la visita:</Text>
                                {motivoVisita === 'Venta' ?
                                    <Text style={[styles.title, styles.twoCol]}>Subdetalle motivo visita:</Text> : null}
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.value, styles.twoCol]}>{motivoVisita}</Text>
                                {motivoVisita === 'Venta' ?
                                    <Text style={[styles.value, styles.twoCol]}>{subdetalleVisita}</Text> : null}
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

                        {_.isEmpty(riesgos) ? null :
                            <View>
                                <View style={styles.separator}/>

                                <View style={{marginBottom: 20}}/>

                                <View style={styles.simpleContainer}>
                                    <Text style={[styles.title, {marginBottom: 10, color: BLACK}]}>Preguntas de
                                        riesgos:</Text>
                                    <View>
                                        {_.map(riesgos, (riesgo, i) => {
                                            const {riesgoId} = riesgo
                                            const resumen = {
                                                ...riesgo,
                                                ...(riesgo.resumen ? {
                                                    ...riesgo.resumen,
                                                    rutCliente: riesgo.resumen.rutEmpresa,
                                                    nombreCliente: riesgo.resumen.nombreEmpresa
                                                } : {}),
                                            }

                                            return (
                                                <Row key={i}>
                                                    <RiesgoCard key={i} riesgo={resumen}
                                                                navigation={this.props.navigation} fromVisita={true}/>
                                                </Row>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                        }

                        {_.isEmpty(oportunidades) ? null :
                            <View>
                                <View style={styles.separator}/>

                                <View style={{marginBottom: 20}}/>

                                <View style={styles.simpleContainer}>
                                    <Text style={[styles.title, {marginBottom: 10, color: BLACK}]}>Oportunidades:</Text>
                                    <View>
                                        {_.map(oportunidades, (oportunidad, i) => {
                                            const {oportunidadId} = oportunidad
                                            const resumen = oportunidadId ? oportunidad : {
                                                ...oportunidad.resumen,
                                                monto: `$ ${oportunidad.monto ? montoPuntosMil(oportunidad.monto) : 0}`,
                                                nombreEstado: oportunidad.nombreEstado || 'Activa',
                                                fechaFin: oportunidad.fechaFin
                                            }

                                            return (
                                                <Row key={i}>
                                                    <OportunidadCard key={i} oportunidad={resumen}
                                                                     navigation={this.props.navigation}
                                                                     fromVisita={true}/>
                                                </Row>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                        }
                        {this.getNotas(notas)}
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

export default ResumenVisitaScreen

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
