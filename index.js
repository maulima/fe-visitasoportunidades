/** @format */

import {ApiEnv} from './src/constants/Data'

process.env.API_ENV = ApiEnv

import {AppRegistry} from 'react-native'
import App from './src/Root'
import {name as appName} from './app.json'
import bgMessaging from './bgMessaging';

AppRegistry.registerComponent('Visitas', () => App)
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => bgMessaging);
