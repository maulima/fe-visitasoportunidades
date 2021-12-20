import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getRiesgoListByIds = (params) => ({
    [CALL_API]: {
        types: [Action.GET_LISTA_RIESGOS_BY_IDS_REQUEST, Action.GET_LISTA_RIESGOS_BY_IDS_SUCCESS, Action.GET_LISTA_RIESGOS_BY_IDS_ERROR],
        endpoint: routes().GET_LISTA_RIESGOS_BY_IDS,
        method: 'POST',
        data: params
    },
})

const getRiesgo = (params) => ({
    [CALL_API]: {
        types: [Action.GET_RIESGO_REQUEST, Action.GET_RIESGO_SUCCESS, Action.GET_RIESGO_ERROR],
        endpoint: `${routes().GET_RIESGO}/${params.riesgoId}`,
        method: 'GET',
        data: {}
    }
})

const getVigenciaRiesgo = (params) => ({
    [CALL_API]: {
        types: [Action.GET_VIGENCIA_RIESGOS_REQUEST, Action.GET_VIGENCIA_RIESGOS_SUCCESS, Action.GET_VIGENCIA_RIESGOS_ERROR],
        endpoint: routes().GET_VIGENCIA_RIESGOS,
        method: 'POST',
        data: params
    }
})

const createRiesgo = (params) => ({
    [CALL_API]: {
        types: [Action.CREATE_RIESGO_REQUEST, Action.CREATE_RIESGO_SUCCESS, Action.CREATE_RIESGO_ERROR],
        endpoint: routes().CREATE_RIESGO,
        method: 'POST',
        data: params
    }
})

const updateRiesgo = (params) => ({
    [CALL_API]: {
        types: [Action.UPDATE_RIESGO_REQUEST, Action.UPDATE_RIESGO_SUCCESS, Action.UPDATE_RIESGO_ERROR],
        endpoint: routes().CREATE_RIESGO,
        method: 'POST',
        data: params
    }
})

export const obtenerRiesgosPorIds = (params) => (dispatch) => {
    return dispatch(getRiesgoListByIds(params))
}

export const obtenerRiesgo = (params) => (dispatch) => {
    return dispatch(getRiesgo(params))
}

export const obtenerVigenciaRiesgos = (params) => (dispatch) => {
    return dispatch(getVigenciaRiesgo(params))
}

export const crearRiesgo = (params) => (dispatch) => {
    return dispatch(createRiesgo(params))
}

export const actualizarRiesgo = (params) => (dispatch) => {
    return dispatch(updateRiesgo(params))
}

export const clearRiesgo = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_RIESGO_SUCCESS
    })
}
