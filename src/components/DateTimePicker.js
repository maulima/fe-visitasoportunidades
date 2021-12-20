import React, { Component } from 'react'
import { View, StyleSheet, DatePickerAndroid, TimePickerAndroid, DatePickerIOS, Text, TouchableOpacity, Platform, TouchableWithoutFeedback } from 'react-native'

import { GREEN, WHITE } from '../styles/Colors'

type Props = {
    isVisible: boolean,
    mode: 'date' | 'datetime',
    onSave: (datetime: Date) => Date,
    onCancel: () => void,
    minimumDate: Date,
    maximumDate: Date,
    defaultDate: Date,
}

const IS_ANDROID = Platform.OS === 'android'

class DateTimePicker extends Component<Props> {

    state = {
        date: this.props.defaultDate || new Date(),
        isVisible: this.props.isVisible,
    }

    componentWillReceiveProps(nextProps) {
        if (IS_ANDROID && !this.props.isVisible && nextProps.isVisible) {
            this.openAndroidDateTimePicker()
        } else if (this.props.isVisible !== nextProps.isVisible) {
            this.setState({isVisible: nextProps.isVisible})
        }
    }

    shouldComponentUpdate() {
        return !IS_ANDROID //No need to render for Android
    }

    openAndroidDateTimePicker() {
        DatePickerAndroid
            .open({
                minDate: this.props.minimumDate,
                maxDate: this.props.maximumDate,
                date: this.state.date,
            })
            .then(this.onSelectAndroidDate)
    }

    openTimePicker(date) {
        TimePickerAndroid
            .open({is24Hour: true,})
            .then(this.onSelectAndroidTime.bind(this, date))
            .catch(this.onCancel)
    }

    onSelectAndroidDate = ({action, year, month, day}) => {
        if (action === DatePickerAndroid.dismissedAction) {
            return this.onCancel()
        }
        // Selected year, month (0-11), day
        const date = new Date(year, month, day)

        this.setState({
            date
        }, this.onSave)

        return true

        // this.openTimePicker(date)
    }

    onSelectAndroidTime = (date, {action, hour, minute}) => {
        if (action === TimePickerAndroid.dismissedAction) {
            return this.onCancel()
        }
        const dateTime = new Date(date)
        dateTime.setMinutes(minute)
        dateTime.setHours(hour)

        this.setState({date: dateTime}, this.onSave)
    }

    onSelectIOSDateTime = (date) => {
        this.setState({date})
    }

    onCancel = () => {
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel()
        }
    }

    onSave = () => {
        const { date } = this.state
        if (typeof this.props.onSave === 'function') {
            this.props.onSave(date)
            this.setState({isVisible: false})
        }
    }

    render() {
        if (IS_ANDROID) {
            return null
        }

        return (
            <TouchableWithoutFeedback>
                <View style={ styles.content }>
                    <DatePickerIOS
                        // locale={I18n.currentLocale()}
                        minimumDate={ this.props.minimumDate }
                        maximumDate={ this.props.maximumDate }
                        date={ this.state.date }
                        onDateChange={ this.onSelectIOSDateTime }
                        mode={ this.props.mode || 'date' }
                        locale='es' />
                    <TouchableOpacity
                        style={ styles.button }
                        onPress={ this.onSave }>
                        <Text style={ styles.buttonLabel }>Seleccionar</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export default DateTimePicker

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    button: {
        borderRadius: 2.5,
        marginHorizontal: 30,
        marginTop: 10,
        height: 45,
        backgroundColor: GREEN,
        justifyContent: 'center'
    },
    buttonLabel: {
        fontSize: 16,
        textAlign: 'center',
        color: WHITE
    }
})
