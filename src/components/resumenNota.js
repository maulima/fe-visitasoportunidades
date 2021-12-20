import React, {Component} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import {Row} from './Grid'
import testID from '../../custom_node_modules/react-native-testid'
import {BROWN_GREY, BROWN_RELIGHT_GREY} from '../styles/Colors'

class ResumenNota extends Component {

    getNota = (notas) => {
      return  _.map(notas, (nota, i) => {
            const {contenido, fechaCreacion, usuarioCreador} = nota
            const fechaCreacionParse = fechaCreacion.length === 0 ? moment(new Date(), 'YYYY-MM-DD HH:mm:ss Z') : moment(fechaCreacion, 'YYYY-MM-DD HH:mm:ss Z')

            return (
                <View key={i} style={{marginBottom: 15}}>
                    <Row style={[styles.itemContainer]}>
                        <Text style={styles.title}
                           {...testID({
                            id: `fechacreacionnota${i}`,
                            label: 'Contenedor de la fecha creación de la nota'
                         })
                         }
                        >
                            {
                                `${usuarioCreador} / ${fechaCreacionParse.format('DD:MMMM YYYY').replace(':', ' de ')} / ${fechaCreacionParse.format('hh:mm A')}`
                            }
                        </Text>
                    </Row>
                    <Row style={styles.itemContainer}>
                        <Text style={styles.col}
                        {...testID({
                                id: `contentnota${i}`,
                                label: 'Contenedor de texto que muestra el contenido de una nota'
                             })
                        }
                        >{contenido}</Text>
                    </Row>
                </View>
            )
        })
    }

    render() {
        const {notas} = this.props
        return (
            <View>
                <View style={styles.separator}/>
                <View style={styles.fieldContainer}>
                    <Text style={[styles.title, {marginBottom: 20, width: '100%'}]}>{'Nota(s):'}</Text>
                    {this.getNota(notas)}
                </View>
            </View>
        )
    }
}

export default ResumenNota

const styles = StyleSheet.create({
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: BROWN_RELIGHT_GREY,
    },
    title: {
        color: BROWN_GREY,
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 5
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
    col: {
        width: '100%'
    }
})
