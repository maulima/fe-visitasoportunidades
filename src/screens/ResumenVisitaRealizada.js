import React, {Component} from 'react'
import {View, ScrollView, Image, Text, StyleSheet,TouchableOpacity,Modal} from 'react-native'
import RiesgoCard from '../components/RiesgoCard'
import OportunidadCard from '../components/OportunidadCard'
import {connect} from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import {Col, Row} from '../components/Grid'
import {formatoRut, montoPuntosMil} from '../utils/StringHelper'
import {BLACK, BACKGROUND_COLOR, BROWN_GREY, BROWN_RELIGHT_GREY, GREEN, WHITE} from '../styles/Colors'
import ResumenOportVisitaRealizadaScreen from './ResumenOportVisitaRealizada'
import GoBackButton from '../components/GoBackButton'
import NavBar from '../components/NavBar'
import ResumenNota from '../components/resumenNota'
import ResumenRiesgoVisitasScreen from './ResumenRiesgoVisitasScreen'
import OportunidadCardLock from '../components/OportunidadCardLock'
import testID from '../../custom_node_modules/react-native-testid'
import privadoIcon from '../../assets/images/icons/privado.png'

require('moment/locale/es.js')
moment.locale('es')

type Props = {
    visita: Object,
    title: String
}

class ResumenVisitaScreen extends Component<Props> {
    state = {
        rutEmpresa:'',
        nombreEmpres:'',
        usuarioNTCreador:'',
        grupoEconomico:'',
        mov1:[],
        mov2:[],
        mov3:[],
        mov4:[],
        oportunidades:[],
        riesgos:[],
        privado:false
    }

    getNotas = (notas) => {
        if (!_.isEmpty(notas)) {
            return (
                <ResumenNota notas={notas} />
            )
        }
    }
     
    componentWillReceiveProps(nextProps){
        const { visita } = this.props
        if(visita !== nextProps.visita){
            this.detalleVisitaResumen(nextProps.visita)
        }
    }
    
    detalleVisitaResumen = (visita) => {
       const {fechaCr,fechaVisita,nombreEmpresa,usuarioNTCreador,motivo1,motivo2,motivo3,motivo4,rutEmpresa,grupoEconomico,notas,privado,oportunidades,riesgos} = visita
        this.setState({
            fechaCr,
            fechaVisita,
            usuarioNTCreador,
            mov1:motivo1,
            mov2:motivo2,
            mov3:motivo3,
            mov4:motivo4,
            rutEmpresa,
            nombreEmpres:nombreEmpresa,
            grupoEconomico,
            notas,
            privado,
            oportunidades,
            riesgos
        })
    }

    obtenerResumenOportunidad = (resumenOportunidadModalName) => {
        this.setState({[resumenOportunidadModalName]: true})
    }

    obtenerResumenRiesgo = (resumenRiesgoModalName) => {
        this.setState({[resumenRiesgoModalName]: true})
    }

    renderSummary = () => {
        const { usuarioNTCreador,fechaVisita,fechaCr,mov1,mov2,mov3,mov4,rutEmpresa,nombreEmpres,grupoEconomico,notas,privado,oportunidades,riesgos} = this.state  
        const x = typeof mov1[0] !== 'undefined' ? mov1[0] : ''
        const w = typeof mov2[0] !== 'undefined' ? mov2[0] : ''
        const c = typeof mov3[0] !== 'undefined' ? mov3[0] : ''
        const r = typeof mov4[0] !== 'undefined' ? mov4[0] : '' 
        return (
            <View style={styles.container}>
                <View style={styles.summaryContainer}>
                    <View style={styles.detailsContainer}>
                       { w === '' ?  null : <View style={styles.simpleContainer}>
                            <Text style={styles.title}>{w.pregunta !== 'undefined' && w.pregunta}</Text>
                            <Text style={styles.value}>{w.respuesta !== 'undefined' && w.respuesta}</Text>
                        </View>}
                        
                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Creador:</Text>
                            <Text style={styles.value}>{usuarioNTCreador}</Text>
                        </View>

                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Fecha de creación:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.value]}>{ fechaCr === undefined ? '' : moment(fechaCr,'YYYY-MM-DD').format('YYYY-MM-DD')}</Text>
                            </View>
                        </View>

                        <View style={styles.separator}/>
                        <View style={styles.simpleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.title, styles.twoCol]}>Fecha de visita:</Text>
                                <Text style={[styles.title, styles.twoCol]}>Tipo de visita:</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Col size={50}>
                                    <Text
                                        style={[styles.value, styles.twoCol]}>{fechaVisita}</Text>
                                </Col>
                                <Col size={40}>
                                    <Text style={[styles.value]}>{privado ? 'Confidencial' : 'Pública'}</Text>
                                </Col>
                                <Col size={10}>
                                    {/*visita.privado &&
                                    < Image style={{width: 30, height: 40}} source={privadoIcon}/>
                                    */}
                                </Col>
                            </View>
                        </View>
                        {/*hayParticipantes ?
                            <View>
                                <View style={styles.separator}/>
                                <View style={styles.simpleContainer}>
                                    <Text style={styles.title}>Participante(s):</Text>
                                      
                                </View>
                            </View> : null
                        */}
                        <View style={styles.separator}/>
                        {c === '' ? null : <View style={styles.simpleContainer}>
                            <Text style={styles.title}>{c.pregunta !== 'undefined' && c.pregunta}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.value}>{c.respuesta !== 'undefined' && c.respuesta}</Text>
                            </View>
                        </View>}
                        <View style={styles.separator}/>
                        <View style={styles.simpleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.title, styles.twoCol]}>{x.pregunta !== 'undefined' && x.pregunta}</Text>
                                <Text style={[styles.title, styles.twoCol]}>{r.pregunta !== 'undefined' && r.pregunta}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.value, styles.twoCol]}>{x.respuesta !== 'undefined' && x.respuesta}</Text>
                                <Text style={[styles.value, styles.twoCol]}>{r.respuesta !== 'undefined' && r.respuesta}</Text>
                            </View>
                        </View>
                        <View style={styles.simpleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.title, styles.twoCol]}>RUT cliente:</Text>
                                <Text style={[styles.title, styles.twoCol]}>Grupo económico:</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[styles.value, styles.twoCol]}>{formatoRut(rutEmpresa) || '-'}</Text>
                                <Text style={[styles.value, styles.twoCol]}>{grupoEconomico || '-'}</Text>
                            </View>
                        </View>
                        <View style={styles.simpleContainer}>
                            <Text style={styles.title}>Nombre cliente:</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.value}>{nombreEmpres || '-'}</Text>
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

                                           const resumenRiesgoModalName = [`ResumenRiesgo[${i}]Visible`]
                                           const resumenRiesgoModalVisible = !!this.state[resumenRiesgoModalName]

                                            return (
                                            <Row key={i}>
                                                <TouchableOpacity
                                                    onPress={() => this.obtenerResumenRiesgo(resumenRiesgoModalName)}
                                                    {...testID({
                                                        id: `ResumenRiesgoVisitaButton`,
                                                        label: `Boton que abre el resumen de riesgo`
                                                    })}
                                                    >
                                                      <RiesgoCard key={i} riesgo={resumen}
                                                                  index={i}
                                                                  navigation={this.props.navigation} fromVisita={true}/>
                                                 </TouchableOpacity> 
                                            {/*modal con resumen de riesgo*/}
                                            <Modal animationType={'slide'} transparent={false}
                                               visible={resumenRiesgoModalVisible} onRequestClose={() => {
                                             }}>
                                            <View style={{flex: 1, backgroundColor: BACKGROUND_COLOR, paddingTop: 15}}>
                                                <NavBar
                                                    title="Resumen Riesgo"
                                                    headerLeft={<GoBackButton onPress={() => {
                                                        this.setState({[resumenRiesgoModalName]: false})
                                                    }}/>}
                                                />
                                                <ScrollView>
                                                    {riesgoId && _.isEmpty(riesgo) ?
                                                        <Loading/> :
                                                        //Vista resumen de riesgo
                                                        <ResumenRiesgoVisitasScreen title="Resumen Riesgo"
                                                                                    index={i}  
                                                                                    riesgoId={riesgoId}
                                                        />
                                                    }
                                                </ScrollView>
                                            </View>
                                        </Modal>           
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
                                            const resumenOportunidadModalName = [`ResumenOportunidad[${i}]Visible`]
                                            const resumenOportunidadModalVisible = !!this.state[resumenOportunidadModalName]
                                            if (oportunidad.mostrar) {
                                            return (
                                                <Row key={i}>
                                                    <TouchableOpacity onPress={() => this.obtenerResumenOportunidad(resumenOportunidadModalName)}>
                                                      <OportunidadCard key={i} oportunidad={resumen}
                                                                       navigation={this.props.navigation}
                                                                       fromVisita={true}/>
                                                    </TouchableOpacity>

                                                <Modal animationType={'slide'} transparent={false}
                                                       visible={resumenOportunidadModalVisible} onRequestClose={() => {
                                                }}>
                                                    <View style={{
                                                        flex: 1,
                                                        backgroundColor: BACKGROUND_COLOR,
                                                        paddingTop: 15
                                                    }}>
                                                        <NavBar
                                                            title="Resumen Oportunidad"
                                                            headerLeft={<GoBackButton onPress={() => {
                                                                this.setState({[resumenOportunidadModalName]: false})
                                                            }}/>}
                                                        />
                                                        <ScrollView>
                                                            {oportunidadId && _.isEmpty(oportunidad) ?
                                                                <Loading/> :
                                                                <ResumenOportVisitaRealizadaScreen title='Resumen Oportundidad'
                                                                                                   oportunidadId={oportunidadId}
                                                                />
                                                            }
                                                        </ScrollView>
                                                    </View>
                                                </Modal>
                                             </Row>
                                            )
                                         }else{
                                            return <OportunidadCardLock key={i}/>
                                         }  
                                        })}
                                    </View>
                                </View>
                            </View>
                        }
                        {this.getNotas(notas)}
                    </View>
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.goBack() } style={styles.buttonsContainer}
                                      {...testID({
                                          id: `GuardarVisitaButton`,
                                          label: `boton para guardar la visita despues de ver el resumen`
                                      })}
                                    >
                                  <Text style={styles.buttonText}>Cerrar</Text>
                </TouchableOpacity>
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
    },
    buttonsContainer: {
        backgroundColor: GREEN,
        height: 50,
        marginTop:-10,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    buttonText: {
        color: WHITE,
        paddingTop: 12.5,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: '500'
    },
})
