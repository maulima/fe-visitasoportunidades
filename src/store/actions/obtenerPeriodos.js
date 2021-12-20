import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getObtenerPeriodos = () => ({
    [CALL_API]: {
        types: [Action.GET_OBTENER_PERIODOS_REQUEST, Action.GET_OBTENER_PERIODOS_SUCCESS, Action.GET_OBTENER_PERIODOS_ERROR],
        endpoint: routes().GET_OBTENER_PERIODOS,
        method: 'GET',
        data: {}
    },
})

export const obtenerPeriodos = () => (dispatch) => {
    return dispatch(getObtenerPeriodos())
}

