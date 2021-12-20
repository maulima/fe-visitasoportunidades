import React, { Component } from 'react'
import { View, ActivityIndicator, StatusBar } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { fetchUser } from '../store/actions/currentUser'
import Loading from '../components/Loading'

type Props = {}

class AuthLoadingScreen extends Component<Props> {

    state = {}

    componentWillMount() {
    }

    componentDidMount() {
        const { hydrate, loggedIn, navigation, actions: { fetchUser } } = this.props
        const { env: {API_ENV} } = process

        if (hydrate) {
            if (loggedIn) {
                switch (API_ENV) {
                  case 'dev':
                  case 'int':
                      fetchUser()
                          .then(() => {
                              navigation.navigate('App')
                          })
                          .catch(error => {
                              console.log('Error: ', error)
                          })
                  break
                  default:
                    navigation.navigate('App')
                }
            } else {
                navigation.navigate('Auth')
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        const { hydrate, navigation, loggedIn, actions: { fetchUser }  } = this.props
        const { env: {API_ENV} } = process

        if (hydrate) {
            if (!loggedIn && nextProps.loggedIn) {
                switch (API_ENV) {
                  case 'dev':
                  case 'int':
                      fetchUser()
                          .then(() => {
                              navigation.navigate('App')
                          })
                          .catch(error => {
                              console.log('Error: ', error)
                          })
                  break
                  default:
                      navigation.navigate('App')
                }
            } else {
                navigation.navigate('Auth')
            }
        }

        if (loggedIn !== nextProps.loggedIn && !nextProps.loggedIn) {
            navigation.goBack()
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="default" />
                <Loading />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        hydrate: state._persist.rehydrated,
        loggedIn: state.auth.loggedIn
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators({ fetchUser }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen)
