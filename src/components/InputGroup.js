import React, {Component} from 'react'
import {View, TextInput, StyleSheet} from 'react-native'

// import styles from './../styles/components/InputGroup'

type Props = {
    testID: Object,
    maxLength?: any,
    containerStyle?: any,
    placeHolderText?: any,
    placeholderTextColor?: any,
    secureTextEntry: Boolean,
    autoCapitalize?: any,
    keyboardType?: any,
    onChangeText: func,
    onFocus: func,
    onBlur: func,
    style?: any,
    leftContent?: false,
    rightContent?: false,
    value?: any,
    editable?: true
}

export default class InputGroup extends Component {
    props: Props

    render() {
        const {testID} = this.props
        //console.log(this.props.editable)
        //typeof this.props.editable === 'number' ? false :  this.props.editable
        const getvalidateType = typeof(this.props.editable)
        const resultPropsType =  getvalidateType === 'number' ? true : this.props.editable
        return (
            <View>
                {
                    this.props.leftContent
                        ? <View style={styles.left}>
                            {this.props.leftContent ? this.props.leftContent : ''}
                        </View>
                        : ''
                }
                <TextInput
                    {...testID}
                    editable={resultPropsType}
                    keyboardType={this.props.keyboardType}
                    placeholder={this.props.placeHolderText}
                    placeholderTextColor={this.props.placeholderTextColor}
                    autoCapitalize={this.props.autoCapitalize}
                    onChangeText={this.props.onChangeText}
                    onFocus={this.props.onFocus}
                    onBlur={this.props.onBlur}
                    onSubmitEditing={this.props.onSubmitEditing}
                    secureTextEntry={this.props.secureTextEntry}
                    style={this.props.style}
                    maxLength={this.props.maxLength}
                    value={this.props.value}
                    autoComplete={this.props.autoComplete}
                    multiline={this.props.multiline}
                    numberOfLines={4}
                />
                {
                    this.props.rightContent
                        ? <View style={styles.left}>
                            {this.props.rightContent ? this.props.rightContent : ''}
                        </View>
                        : ''
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    left: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    },
    right: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
    }
})
