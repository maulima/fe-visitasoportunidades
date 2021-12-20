import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

import { OCEAN_BLUE } from '../styles/Colors'
import testID from '../../custom_node_modules/react-native-testid'

type Props = {
    onPress: func,
    type: String
}

class ClearFilterButton extends PureComponent<Props> {
    render() {
        return (
            <TouchableOpacity onPress={ this.props.onPress }
                              {...testID({
                                  id: `limpiarClearFilterButton`,
                                  label: `Boton que limpia los filtros`
                              })
                              }
            >
                <Text style={ styles.filter }>Limpiar filtros</Text>
            </TouchableOpacity>
        )
    }
}

export default ClearFilterButton

const styles = StyleSheet.create({
    filter: {
        color: OCEAN_BLUE,
        fontSize: 14,
        marginRight: 15
    }
})
