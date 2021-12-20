import React from 'react'
import { connect } from 'react-redux'
import { reduxifyNavigator, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'

import { RootNavigator } from './NavigationRoutes'

const middlewareNav = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
);

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root');

const mapStateToProps = state => ({
    state: state.nav,
});

const AppNavigator = connect(mapStateToProps)(AppWithNavigationState);

export { AppNavigator, middlewareNav }