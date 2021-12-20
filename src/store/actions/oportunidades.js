import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getOportunidadList = (params) => ({
    [CALL_API]: {
        types: [Action.GET_OPORTUNIDADES_REQUEST, Action.GET_OPORTUNIDADES_SUCCESS, Action.GET_OPORTUNIDADES_ERROR],
        endpoint: routes().GET_LISTA_OPORTUNIDAD,
        method: 'POST',
        data: params,
        response: {
            pagina: params.pagina
        }
    },
})

const getOportunidad = (params) => ({
    [CALL_API]: {
        types: [Action.GET_OPORTUNIDAD_REQUEST, Action.GET_OPORTUNIDAD_SUCCESS, Action.GET_OPORTUNIDAD_ERROR],
        endpoint: routes().GET_OPORTUNIDAD,
        method: 'POST',
        data: params
    }
})

const createOportunidad = (params) => ({
    [CALL_API]: {
        types: [Action.CREATE_OPORTUNIDAD_REQUEST, Action.CREATE_OPORTUNIDAD_SUCCESS, Action.CREATE_OPORTUNIDAD_ERROR],
        endpoint: routes().CREATE_OPORTUNIDAD,
        method: 'POST',
        data: params
    }
})

const updateOportunidad = (params) => ({
    [CALL_API]: {
        types: [Action.UPDATE_OPORTUNIDAD_REQUEST, Action.UPDATE_OPORTUNIDAD_SUCCESS, Action.UPDATE_OPORTUNIDAD_ERROR],
        endpoint: routes().CREATE_OPORTUNIDAD,
        method: 'POST',
        data: params
    }
})

const getOportunidadListByIds = (params) => ({
    [CALL_API]: {
        types: [Action.GET_LISTA_OPORTUNIDADES_BY_IDS_REQUEST, Action.GET_LISTA_OPORTUNIDADES_BY_IDS_SUCCESS, Action.GET_LISTA_OPORTUNIDADES_BY_IDS_ERROR],
        endpoint: routes().GET_LISTA_OPORTUNIDADES_BY_IDS,
        method: 'POST',
        data: params
    },
})



export const obtenerListaOportunidad = (params) => (dispatch) => {
    return dispatch(getOportunidadList(params))
}

export const obtenerOportunidad = (params) => (dispatch) => {
    return dispatch(getOportunidad(params))
}

export const crearOportunidad = (params) => (dispatch) => {
    return dispatch(createOportunidad(params))
}

export const actualizarOportunidad = (params) => (dispatch) => {
    return dispatch(updateOportunidad(params))
}

export const obtenerOportunidadesPorIds = (params) => (dispatch) => {
    return dispatch(getOportunidadListByIds(params))
}

export const actualizarDetalleOportunidad = (params) => (dispatch, getState) => {
    dispatch({
        type: Action.UPDATE_DETALLE_OPORTUNIDAD,
        response: params
    })
}

export const clearOportunidad = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_OPORTUNIDAD_SUCCESS
    })
}
