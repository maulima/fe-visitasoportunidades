import React, {Component} from 'react'
import {View, ScrollView, Image, Text, StyleSheet} from 'react-native'
import moment from 'moment'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import {Col, Row} from '../components/Grid'
import testID from '../../custom_node_modules/react-native-testid'
import {TipoPregunta} from '../constants/Data'
import {formatoRut, montoPuntosMil} from '../utils/StringHelper'
import { obtenerRiesgo,clearRiesgo } from '../store/actions/riesgos'
import {BLACK, BACKGROUND_COLOR, BROWN_GREY, BROWN_RELIGHT_GREY, GREEN, WHITE} from '../styles/Colors'

//import { get } from 'https';

require('moment/locale/es.js')
moment.locale('es')

/*type Props = {
    riesgo: Object,
    title: String
}*/

const mapStateToProps = (state) => {
    return {
        riesgo: state.riesgos.item,
        preguntas: state.formularioRiesgo.preguntas,
        respuestas: state.formularioRiesgo.respuestas
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({obtenerRiesgo,clearRiesgo}, dispatch)
    }
}

class ResumenRiesgoVisitasScreen extends Component<Props> {

    state = {
        riesgo:[]
    }

    componentDidMount() {
       const {actions:{obtenerRiesgo},riesgoId} = this.props
       obtenerRiesgo({
            riesgoId
       })
    }

    getPregunta = (item, key, isLast) => {
        const {preguntas} = this.props
        const tipo = (_.find(_.values(preguntas), (pg) => pg.name === item.pregunta) || {}).tipo
        const {DECIMAL, ENTERO, MONEDA} = TipoPregunta

        return (
            <View key={key}>
                <Row>
                    <Text style={styles.title}
                    {...testID({
                            id: `pregunta${key}`,
                            label: `Contenedor de texto que muestra pregunta`
                        })
                    } 
                    >{item.pregunta}:</Text>
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

    componentWillMount(){
        const {actions:{clearRiesgo}} = this.props
        clearRiesgo()
    }

    render() {
        const { riesgo:{usuarioNTCreador,resumen,detalle},index } = this.props
        const r = resumen === undefined ? '' : resumen
        const { fechaRiesgo,nombreEmpresa,grupoEconomico,rutEmpresa } = r
        const d = detalle === undefined ? '' : detalle
        return (
            <ScrollView style={styles.container}>
               <View style={styles.container}>
                <View style={styles.summaryContainer}>
                    <View style={styles.detailsContainer}>
                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Creador:</Text>
                            <Text style={styles.value}
                              {...testID({
                                id: `usuarioNTCreador${index}`,
                                label: `Contenedor de texto de usuario creador`
                              })
                             }  
                            >{usuarioNTCreador}</Text>
                        </View>

                        <View style={styles.separator}/>

                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Fecha riesgo:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    style={[styles.value, styles.twoCol]}
                                    {...testID({
                                        id: `fechaRiesgo${index}`,
                                        label: `Contenedor de texto de fecha riesgo`
                                      })
                                    }
                                    >{fechaRiesgo === undefined ? '' : moment(fechaRiesgo).format('DD-MM-YYYY')}</Text>
                                <Text
                                    style={[styles.value, styles.twoCol]}
                                    {...testID({
                                        id: `fechaRiesgoHora${index}`,
                                        label: `Contenedor texto de fecha riesgo Hora`
                                      })
                                    }
                                    >{fechaRiesgo === undefined ? '' : moment(fechaRiesgo).format('hh:mm A')}</Text>
                            </View>
                        </View>

                        <View style={styles.separator}/>

                        <View style={styles.simpleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.title, styles.twoCol]}>RUT cliente:</Text>
                                <Text style={[styles.title, styles.twoCol]}>Grupo económico:</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.value, styles.twoCol]}
                                {...testID({
                                    id: `rut${index}empresa`,
                                    label: `Contenedor de texto de rut empresa`
                                  })
                                 }
                                >{formatoRut(rutEmpresa) || '-'}</Text>
                                <Text style={[styles.value, styles.twoCol]}
                                 {...testID({
                                    id: `Grupo${index}Economico`,
                                    label: `Contenedor de texto de grupo economico`
                                  })
                                 }>{grupoEconomico || '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Nombre cliente:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.value}
                                 {...testID({
                                    id: `Nombre${index}Cliente`,
                                    label: `Contenedor de texto de nombre cliente`
                                  })
                                 }
                                >{nombreEmpresa || '-'}</Text>
                            </View>
                        </View>


                        {_.isEmpty(d) ? null : <View style={styles.separator}/>}

                        {Object.values(d).map((item, key) => {
                            return this.getPregunta(item, key, key === _.size(d) - 1)
                        })}
                    </View>
                </View>
              </View>
            </ScrollView>
        )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ResumenRiesgoVisitasScreen)

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
