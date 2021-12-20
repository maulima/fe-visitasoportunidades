import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'
import { urlWithParams } from '../../utils/StringHelper'


const getColaboradores = (user) => ({
    [CALL_API]: {
        types: [Action.GET_COLABORADORES_REQUEST, Action.GET_COLABORADORES_SUCCESS, Action.GET_COLABORADORES_ERROR],
        endpoint: routes().GET_COLABORADORES_USER,
        method: 'POST',
        data: {
            usuario: user
        }
    },
})

const getColaboradoresBusqueda = (value = '') => ({
    [CALL_API]: {
        types: [Action.GET_COLABORADORES_BUSQUEDA_REQUEST, Action.GET_COLABORADORES_BUSQUEDA_SUCCESS, Action.GET_COLABORADORES_BUSQUEDA_ERROR],
        endpoint: routes().GET_COLABORADORES_USER_BUSQUEDA,
        method: 'POST',
        data: {
            terminoDeBusqueda: value,
        }
    },
})

export const obtenerColaboradores = (user) => (dispatch) => {
    return dispatch(getColaboradores(user))
}

export const obtenerColaboradoresBusqueda = (value) => (dispatch) => {
    return dispatch(getColaboradoresBusqueda(value))
}