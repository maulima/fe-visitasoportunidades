import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'

type Props = {
    onPress: func
}

class GoBackButton extends PureComponent<Props> {

    render() {
        return (
            <View>
                <TouchableOpacity onPress={ this.props.onPress }
                   {...testID({
                    id: "BotonGoBack",
                    label: "Botón para volver atras"
                    })
                   }
                >
                    <Image style={ styles.container } source={ require('./../../assets/images/icons/left_arrow_icon.png') } />
                </TouchableOpacity>
            </View>
        )
    }
}

export default GoBackButton

const styles = StyleSheet.create({
    container: {
        marginLeft: 15
    }
})
