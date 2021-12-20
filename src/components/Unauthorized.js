import React, { Component } from 'react'
import { View, StyleSheet, Text } from 'react-native'

type Props = {
    style: {}
}

class Unauthorized extends Component<Props> {
    render() {
        const {style} = this.props

        return (
            <View style={ [styles.container, style] }>
                <Text>
                    Usted no se encuentra autorizado para acceder a la información solicitada.
                </Text>
            </View>
        )
    }
}

export default Unauthorized


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})
