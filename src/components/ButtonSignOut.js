import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import testID from '../../custom_node_modules/react-native-testid'

type Props = {
    onPress: func
}

class ButtonSignOut extends PureComponent<Props> {

    render() {
        return (
            <View style={{position:'relative',right:20,top:5}}>
                <TouchableOpacity onPress={ this.props.onPress }
                {...testID({
                     id: "IconoCerrarSesión",
                     label: "Icono de cerrar sesión "
                   })
                 }
                >
                    <Image style={ styles.container } source={ require('./../../assets/images/icons/baseline-more_vert.png') } />
                </TouchableOpacity>
            </View>
        )
    }
}

export default ButtonSignOut

const styles = StyleSheet.create({
 
})