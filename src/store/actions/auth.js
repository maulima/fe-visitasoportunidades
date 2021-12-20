import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

// const getSignIn = (params) => ({
//     [CALL_API]: {
//         types: [Action.SIGN_IN_REQUEST, Action.SIGN_IN_SUCCESS, Action.SIGN_IN_ERROR],
//         endpoint: routes().SIGN_IN,
//         method: 'POST',
//         data: params
//     },
// })

const getSignIn = (params) => ({
    [CALL_API]: {
        types: [Action.SIGN_IN_REQUEST, Action.SIGN_IN_SUCCESS, Action.SIGN_IN_ERROR],
        endpoint: routes().SIGN_IN,
        method: 'POST',
        data: params
    },
})

const getSignOut = () => ({
    [CALL_API]: {
        types: [Action.SIGN_OUT_REQUEST, Action.SIGN_OUT_SUCCESS, Action.SIGN_OUT_ERROR],
        endpoint: routes().SIGN_OUT,
        method: 'POST',
        data: {}
    },
})

// export const signIn = (params) => (dispatch) => {
//     return dispatch(getSignIn(params))
// }

export const signIn = (params) => (dispatch) => {
    return dispatch(getSignIn(params))
}

export const signOut = () => (dispatch) => {
    return dispatch(getSignOut())
}

export const agregarPlataforma = (plataforma) => (dispatch, getState) => {
    dispatch({
        type: Action.ADD_PLATAFORMA,
        response: plataforma
    })
}

export const limpiarSignIn = () => (dispatch, getState) => {
    dispatch({
        type: Action.SIGN_OUT_CLEAR
    })
}

export const limpiarSignOut = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_DATA
    })
}


