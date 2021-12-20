import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'

type Props = {
    onPress: func
}

class EmptyButton extends PureComponent<Props> {

    render() {
        return (
            <View>
                <TouchableOpacity onPress={ this.props.onPress }>
                    <Image style={ styles.container } source={ require('./../../assets/images/icons/empty_search_icon.png') } />
                </TouchableOpacity>
            </View>
        )
    }
}

export default EmptyButton

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        alignItems: 'center'
    }
})