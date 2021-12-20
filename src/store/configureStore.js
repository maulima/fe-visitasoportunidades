import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { AsyncStorage } from 'react-native'
import { persistStore, persistReducer } from 'redux-persist'
import { composeWithDevTools } from 'redux-devtools-extension'

import api from '../config/ApiConnect'
import { middlewareNav } from '../AppNavigator'
import AppReducer from './reducers'


const middlewares = [thunk, middlewareNav, api];

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth', 'currentUser']
}

const persistedReducer = persistReducer(persistConfig, AppReducer)

export default () => {
    let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middlewares)))
    let persistor = persistStore(store)
    return { store, persistor }
}