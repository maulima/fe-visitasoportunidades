import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getMacroBancas = () => ({
    [CALL_API]: {
        types: [Action.GET_MACROBANCAS_REQUEST, Action.GET_MACROBANCAS_SUCCESS, Action.GET_MACROBANCAS_ERROR],
        endpoint: routes().GET_MACROBANCAS,
        method: 'GET',
        data: {}
    },
})

export const obtenerMacroBancas = () => (dispatch) => {
    return dispatch(getMacroBancas())
}

export const limpiarMacroBancas = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_DATA
    })
}
