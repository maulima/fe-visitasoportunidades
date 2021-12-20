/**
 * Bci Visitas -  React Native App
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { View, ScrollView, Text } from 'react-native'
import {SafeAreaView} from 'react-navigation';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'

import configureStore from './store/configureStore'
import JailMonkey from 'jail-monkey'
import App from './App'
import Loading from './components/Loading'

import _ from 'lodash'

const { store, persistor } = configureStore()

type Props = {}

export default class Root extends Component<Props> {
    state = {
        isSafe: null,
        hasError: null
    }

     componentWillMount () {
        try {
            const { trustFall } = JailMonkey

            this.setState({
                isSafe: trustFall(),
                hasError: false
            })
        } catch (e) {
            this.setState({ hasError: true })
        }

         
    }

    requestingSafety = () => {
        const { isSafe } = this.state

        return _.isNull(isSafe)
    }

    isSafeDevice = () => {
        const { isSafe } = this.state

        return isSafe
    }

    render() {
        const { hasError } = this.state
        console.disableYellowBox = true;
        if (this.requestingSafety()) {
            return (
                <View style={{ flex: 1 }}>
                    <Loading />
                </View>
            )
        //    anti jailbreak y root
        // } else if (this.isSafeDevice()) {
        } else if (true) {
            return (
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                            <App/>
                    </PersistGate>
                </Provider>
            )
        }
    }
}
