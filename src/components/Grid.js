import React, {Component} from 'react'
import {View} from 'react-native'
import * as _ from 'lodash'

const getCustomStyles = (style) => {
    if (_.isArray(style)) {
        const res = {}
        const aux = _.clone(style)

        while (!_.isEmpty(aux)) Object.assign(res, aux.shift())
        return res
    } else {
        return (style || {})
    }
}

export class Col extends Component {
    render = () => {
        const {size, style, offset} = this.props
        const customStyle = getCustomStyles(style)

        return (
            <View style={{
                ...customStyle,
                width: `${size}%`,
                justifyContent: 'center',
                alignSelf: 'flex-start',
                marginLeft: `${offset ? offset : 0}%`

            }}>
                {this.props.children}
            </View>
        )
    }
}

export class Row extends Component {
    render () {
        const {style} = this.props
        const customStyle = getCustomStyles(style)

        return (
            <View style={{
                ...customStyle,
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%'
            }}>
                {this.props.children}
            </View>
        )
    }
}
