import React, {Component} from 'react'
import {View, ScrollView, Text, StyleSheet, Image} from 'react-native'
import {connect} from 'react-redux'
import moment from 'moment'
import {Col, Row} from '../components/Grid'
import _ from 'lodash'

import {BACKGROUND_COLOR, BLACK, BROWN_GREY, BROWN_RELIGHT_GREY, GREEN, YELLOW, RED, WHITE} from '../styles/Colors'
import {TipoPregunta} from '../constants/Data'
import {formatearMonto, formatoRut, montoDecimal} from '../utils/StringHelper'

require('moment/locale/es.js')
moment.locale('es')
import {
    obtenerOportunidad,
} from '../store/actions/oportunidades'
import {bindActionCreators} from 'redux'
import ResumenNota from '../components/resumenNota'
import privadoIcon from '../../assets/images/icons/privado.png'

type Props = {
    oportunidad: {}
}


const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({
            obtenerOportunidad,
        }, dispatch)
    }
}

class ResumenOportunidadScreen extends Component<Props> {
    state = {
        loading: true,
        oportunidad: undefined
    }

    componentWillMount() {
        const {oportunidad,
          colaboradores,
          actions: {obtenerOportunidad},
          currentUser: {
            plataforma, usuario, codOficina
          }} = this.props
        const {oportunidadId} = oportunidad
        if (oportunidad.hasOwnProperty('resumen')) {
            this.setState({loading: false, oportunidad: oportunidad})
        } else {
            this.setState({loading: true})
            const jefeNTCreador = _.find(colaboradores, (col) => col.usuarioNt === usuario)
            obtenerOportunidad({
              oportunidadId,
              plataforma,
              usuarioNT: usuario,
              jefeNT: jefeNTCreador.usuarioNtJefe,
              codOficina: codOficina,
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.oportunidad === undefined && this.state.loading === true) {
            const {oportunidad} = nextProps
            this.setState({loading: false, oportunidad: oportunidad})
        }
    }

    getPregunta = (item, key) => {
        const {preguntas} = this.props
        const tipo = (_.find(_.values(preguntas), (pg) => pg.name === item.pregunta) || {}).tipo
        const {DECIMAL, MONEDA, SIMPLE, BOOLEAN} = TipoPregunta
        if (tipo !== SIMPLE && tipo !== BOOLEAN && tipo !== undefined) {
            return (
                <Row key={key}>
                    <Text style={[styles.title, styles.dobleCol]}>{item.pregunta}:</Text>
                    <Text style={[styles.dobleCol]}>
                        {(
                            tipo === DECIMAL ?
                                montoDecimal(item.respuesta) : tipo === MONEDA ?
                                formatearMonto(item.respuesta, '$') : formatearMonto(item.respuesta)) || '-'}
                    </Text>
                </Row>
            )
        } else {
            return (
                <Row key={key}>
                    <Text style={[styles.title, styles.dobleCol]}>{item.pregunta}:</Text>
                    <Text style={[styles.dobleCol]}>{item.respuesta || '-'}</Text>
                </Row>
            )
        }
    }

    getNotas = () => {
        const {oportunidad: {notas}} = this.props
        if (!_.isEmpty(notas)) {
            return <ResumenNota notas={notas}/>
        }
    }

    renderSummary = (oportunidad) => {
        if (oportunidad === undefined) {
            this.setState({loading: true})
            return false
        } else {
            const {currentUser} = this.props
            const {greenStatus, yellowStatus, redStatus} = styles
            const {oportunidad} = this.state
            const {resumen: {grupoEconomico, fechaCreacion}, estadoId,plataformaEmpresa} = oportunidad
            const platformEmpresa = plataformaEmpresa == null ? '-' : plataformaEmpresa
            let endDate = moment(oportunidad.fechaFin).format('DD-MM-YYYY')
            let createDate
            let hour
            const updateDate = moment().format('DD-MM-YYYY')
            const updateHour = moment().format('HH:mm')

            //si es undefined es porque es nueva
            if (fechaCreacion !== undefined) {
                createDate = moment(fechaCreacion,'YYYY-MM-DD').format('DD-MM-YYYY')
            } else {
                createDate = updateDate
                hour = updateHour
            }

            const negocio = _.find(oportunidad.detalle, ['pregunta', 'Negocio'])
            const producto = _.find(oportunidad.detalle, ['pregunta', 'Producto'])

            const currentDate = new Date()
            const limitDate = new Date(moment(oportunidad.fechaFin).format())

            const diffSeconds = limitDate - currentDate
            const diffDays = (diffSeconds) / 3600000 / 24
            const colorStatus = diffDays > 10 ? greenStatus : diffSeconds > 0 ? yellowStatus : redStatus

            return (
                <View style={styles.container}>
                    <View style={[styles.summaryContainer].concat(colorStatus)}>
                        <View style={styles.detailsContainer}>
                            <View style={styles.profileContainer}>
                                <View style={{width: '33%'}}>
                                    <Text style={styles.title}>Creador:</Text>
                                    <Text style={styles.creator}>{oportunidad.usuarioNTCreador}</Text>
                                </View>
                                <View style={[styles.typeContainer, {width: '35%'}]}>
                                    <Text style={[styles.type]}>
                                        {estadoId === 1 ? 'Activa' : estadoId === 2 ? 'Ganada' : 'Cancelada'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.separator}/>
                             
                            <Row style={styles.fieldContainer}>
                                <Text style={[styles.title, styles.col]}>Plataforma Empresa:</Text>
                                <Text style={[styles.col, styles.col]}>{platformEmpresa}</Text>
                            </Row>
                            

                            <Row style={styles.fieldContainer}>
                                <Text style={[styles.title, styles.dobleCol]}>Oportunidad creada:</Text>
                                <Text style={[styles.title, {width: '40%'}]}>Tipo de oportunidad:</Text>
                                <Col size={50}>
                                    <Row>
                                        <Text style={styles.dobleCol}>{createDate}</Text>
                                        {!fechaCreacion &&
                                        <Text style={styles.dobleCol}>{hour} hrs</Text>
                                        }
                                    </Row>
                                </Col>
                                <Col size={40}>
                                    <Row>
                                        <Text>{oportunidad.privado ? 'Confidencial' : 'Pública'}</Text>
                                    </Row>
                                </Col>
                                {oportunidad.privado &&
                                <Col size={10}>
                                    <Row>
                                        <Image style={{width: 30, height: 40}} source={privadoIcon}/>
                                    </Row>
                                </Col>
                                }

                            </Row>

                            <View style={styles.separator}/>
                            {oportunidad.usuarioNTEdicion !== null && oportunidad.usuarioNTEdicion.length > 0 ?
                                <View>
                                    <View style={styles.profileContainer}>
                                        <View style={{width: '65%'}}>
                                            <Text style={styles.title}>último usuario modificador:</Text>
                                            <Text style={styles.creator}>{oportunidad.usuarioNTEdicion}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.separator}/>

                                    <Row style={styles.fieldContainer}>
                                        <Text style={[styles.title, styles.col]}>Fecha de última modificación:</Text>

                                        <Col size={100}>
                                            <Row>
                                                <Text style={styles.dobleCol}>{updateDate}</Text>
                                                <Text style={styles.dobleCol}>{updateHour} hrs</Text>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <View style={styles.separator}/>
                                </View> : null
                            }
                            <View style={styles.profileContainer}>
                                <View style={{width: '33%'}}>
                                    <Text style={styles.title}>Responsable:</Text>
                                    <Text style={styles.creator}>{oportunidad.usuarioNTResponsable}</Text>
                                </View>
                            </View>
                            <Row style={styles.fieldContainer}>
                                <Text style={[styles.title, styles.dobleCol]}>RUT cliente:</Text>
                                <Text style={[styles.title, styles.dobleCol]}>Grupo económico:</Text>
                                <Col size={100}>
                                    <Row>
                                        <Text
                                            style={styles.dobleCol}>{oportunidad.clienteId ? formatoRut(oportunidad.clienteId) : '-'}</Text>
                                        <Text style={styles.dobleCol}>{grupoEconomico ? grupoEconomico : '-'}</Text>
                                    </Row>
                                </Col>
                            </Row>

                            <Row style={styles.fieldContainer}>
                                <Text style={[styles.title, styles.col]}>Nombre cliente:</Text>
                                <Text
                                    style={styles.col}>{oportunidad.resumen.nombreEmpresa ? oportunidad.resumen.nombreEmpresa : '-'}</Text>
                            </Row>

                            <View style={styles.separator}/>
                            <Row style={styles.fieldContainer}>
                                <Text style={[styles.title, styles.dobleCol]}>Negocio:</Text>
                                <Text style={[styles.title, styles.dobleCol]}>Producto:</Text>

                                <Text style={styles.dobleCol}>{negocio ? negocio.respuesta : '-'}</Text>
                                <Text style={styles.dobleCol}>{producto ? producto.respuesta : '-'}</Text>
                            </Row>

                            {_.isEmpty(oportunidad.detalle) ? null : <View style={styles.separator}/>}

                            {oportunidad.detalle.map((item, key) => {
                                return item.pregunta !== 'Producto' && item.pregunta !== 'Negocio' ? this.getPregunta(item, key) : null
                            })}

                            <View style={styles.separator}/>

                            <Row style={styles.fieldContainer}>
                                <Text style={[styles.title, styles.col]}>Fecha estimada de cierre:</Text>
                                <Text style={[styles.col, styles.col]}>{endDate}</Text>
                            </Row>

                            {this.getNotas()}

                        </View>
                    </View>
                </View>
            )
        }
    }

    render() {
        const {loading, oportunidad} = this.state

        return (
            <ScrollView style={styles.container}>
                {!loading &&
                this.renderSummary(oportunidad)
                }
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' ? state.currentUser.profile : state.auth.profile,
        estadosOportunidad: state.estadosOportunidad.lista,
        preguntas: state.formularioOportunidad.preguntas,
        colaboradores: state.colaboradores.lista,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResumenOportunidadScreen)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 10
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: BROWN_RELIGHT_GREY,
    },
    summaryContainer: {
        flexWrap: 'wrap',
        backgroundColor: WHITE,
        borderTopWidth: 4,
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
    profileContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    titleContainerTwo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        color: BROWN_GREY,
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 5
    },
    creator: {
        fontSize: 14,
        textTransform: 'capitalize'
    },
    typeContainer: {
        backgroundColor: BLACK,
        paddingTop: 4,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
        borderRadius: 50,
        height: 30,
        justifyContent: 'center'
    },
    type: {
        fontSize: 16,
        fontWeight: '600',
        color: WHITE,
        textAlign: 'center'
    },
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    fieldContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 8,
        paddingBottom: 8
    },
    greenStatus: {
        borderTopColor: GREEN,
    },
    yellowStatus: {
        borderTopColor: YELLOW
    },
    redStatus: {
        borderTopColor: RED
    },
    thirdCol: {
        width: '32%'
    },
    dobleCol: {
        width: '50%'
    },
    col: {
        width: '100%'
    }
})
