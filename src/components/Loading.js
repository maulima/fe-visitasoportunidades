import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

type Props = {
    style: {}
}

class Loading extends Component<Props> {

    componentDidMount() {
        this.animation.play()
    }

    render() {
        const {style} = this.props

        return (
            <View style={ [styles.container, style] }>
                <LottieView
                    ref={animation => { this.animation = animation }}
                    loop={ true }
                    source={require('../../assets/animations/loading.json')}
                    style={ styles.spin }
                />
            </View>
        )
    }
}

export default Loading


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    spin: {
        width: 75,
        height: 75,
    }
})
