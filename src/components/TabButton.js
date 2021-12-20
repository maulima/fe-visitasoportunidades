import React, { PureComponent } from 'react'
import { View, Image, TouchableOpacity, Animated} from 'react-native'
import { withNavigation } from 'react-navigation'

type Props = {}
const SIZE = 80
class TabButton extends PureComponent<Props> {
    state = {
        active: false
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    toggleView = () => {
        const { navigation: { navigate  }  } = this.props

        navigate('HandleNewOportunidadStack')
    }

    render() {

        return (
            <View style={{ alignItems: 'center', height: 60, bottom: 7 }}>
                <Animated.View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: SIZE,
                    height: SIZE,
                    borderRadius: SIZE / 2,
                }}>
                    <TouchableOpacity onPress={ this.toggleView } activeOpacity={1}>
                        <Image style={{ width: 43, height: 43, alignItems: 'center' }} source={require('./../../assets/images/icons/add_inactive_tab.png')} />
                    </TouchableOpacity>
                </Animated.View>
            </View>
        )
    }
}

export default withNavigation(TabButton)
