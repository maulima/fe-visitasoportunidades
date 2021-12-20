import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getObtenerPlataforma = () => ({
    [CALL_API]: {
        types: [Action.GET_OBTENER_PLATAFORMA_REQUEST, Action.GET_OBTENER_PLATAFORMA_SUCCESS, Action.GET_OBTENER_PLATAFORMA_ERROR],
        endpoint: routes().GET_OBTENER_PLATAFORMA,
        method: 'GET',
        data: {}
    },
})

export const obtenerPlataforma = () => (dispatch) => {
    return dispatch(getObtenerPlataforma())
}

export const limpiarObtenerPlataforma = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_DATA
    })
}
