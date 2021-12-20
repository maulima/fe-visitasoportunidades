import React, { PureComponent } from 'react'
import {View, Image, TouchableOpacity, StyleSheet,Platform} from 'react-native'

type Props = {
    onPress: func
}
class CloseModalButton extends PureComponent<Props> {

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={ this.props.onPress }>
                    <Image style={ styles.container } source={ require('./../../assets/images/icons/close_modal_icon.png') } />
                </TouchableOpacity>
            </View>
        )
    }
}

export default CloseModalButton

const styles = StyleSheet.create({
    container: {
        marginLeft: 15,
        marginTop: Platform.OS === 'android' ? 10 : null,
    }
})
