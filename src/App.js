import React, { Component } from 'react'
import { StatusBar, View, BackHandler} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {AppNavigator} from './AppNavigator'

type Props = {};

class App extends Component<Props> {

    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar barStyle='dark-content'/>
                <AppNavigator/>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const {env: {API_ENV}} = process

    return {
        currentUser: API_ENV === 'dev' || API_ENV === 'cert' ? state.currentUser.profile : state.auth.profile,
        loggedIn: state.auth.loggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
