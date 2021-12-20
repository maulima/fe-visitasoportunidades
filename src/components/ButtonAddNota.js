import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'
import {GREEN} from '../styles/Colors'

class ButtonAddNota extends Component {
    render() {

        const {title} = this.props
        return (
            <TouchableOpacity onPress={() => {
                this.props.addNota()
            }} style={styles.buttonNota}
                              {...testID({
                                  id: `NuevaNotaOportunidadButton`,
                                  label: `Boton para agregar una nueva nota de la oportunidad`
                              })}
            disabled={this.props.disabled}>
                <Text style={styles.buttonNotaText}>{title}</Text>
            </TouchableOpacity>
        )
    }
}

export default ButtonAddNota

const styles = StyleSheet.create({

    buttonNota: {
        flexDirection: 'row',
        height: 44,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 120
    },
    buttonNotaText: {
        color: GREEN,
        textAlign: 'center',
        fontSize: 16,
        textTransform: 'capitalize',
    },

})