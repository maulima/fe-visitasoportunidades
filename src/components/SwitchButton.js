import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Switch, Text, View} from 'react-native'
import {BROWN_GREY, GREY, OCEAN_BLUE} from '../styles/Colors'

class SwitchButton extends PureComponent {
    state = {isSwitchOn: false}

    componentWillMount() {
        const {valueSwitch} = this.props
        this.setState({isSwitchOn: valueSwitch})
    }

    toggleSwitch = () => {
        const {isSwitchOn} = this.state
        this.setState({isSwitchOn: !isSwitchOn})
        this.props.onSetprivado(!isSwitchOn)
    }


    render() {
        const {title, disabled, valueSwitch} = this.props
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flexWrap: 'wrap'
            }}>
                <Text style={[styles.title, disabled? styles.titleDisable : null]}>{title}</Text>
                <Switch
                    onValueChange={this.toggleSwitch}
                    value={!!valueSwitch}
                    onTintColor={OCEAN_BLUE}
                    style={{marginBottom: 10}}
                    disabled={disabled}
                    // thumbTintColor={OCEAN_BLUE}
                    // tintColor="#ff0000"
                />
            </View>
        )
    }
}

SwitchButton.propTypes = {}

export default SwitchButton

const styles = StyleSheet.create({
    title: {
        fontSize: 15,
    },
    titleDisable: {
        color: BROWN_GREY
    }
})