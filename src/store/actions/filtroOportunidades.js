import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'



const getFilterOportunidad = (id, backupStore) => ({
    [CALL_API]: {
        types: [Action.GET_FILTRO_INICIAL_OPORTUNIDAD_REQUEST, Action.GET_FILTRO_INICIAL_OPORTUNIDAD_SUCCESS, Action.GET_FILTRO_INICIAL_OPORTUNIDAD_ERROR],
        endpoint: routes().GET_FILTER_OPORTUNIDAD,
        method: 'GET',
        data: {},
        response: {
            estadoId: id
        }
    },
})

const getPreguntasFilterOportunidad = (params) => ({
    [CALL_API]: {
        types: [Action.GET_PREGUNTAS_FILTRO_OPORTUNIDAD_REQUEST, Action.GET_PREGUNTAS_FILTRO_OPORTUNIDAD_SUCCESS, Action.GET_PREGUNTAS_FILTRO_OPORTUNIDAD_ERROR],
        endpoint: routes().GET_PREGUNTAS_FORM_OPORTUNIDAD,
        method: 'POST',
        data: {
            respuestaId: Number(params.respuestaId),
            estadoId: params.estadoId || 1
        },
        response: {
            respuestaId: params.respuestaId
        }
    },
})

export const updateOportunidadFilterParams = (params = Object) => (dispatch) => {
    dispatch({
        type: Action.SET_OPORTUNIDAD_FILTER_PARAMS,
        data: params,
    })
}


export const obtenerFilterOportunidad = (id, backupStore=false) => (dispatch) => {
    return dispatch(getFilterOportunidad(id, backupStore))
}

export const obtenerPreguntasFilterOportunidad = (params) => (dispatch) => {
    return dispatch(getPreguntasFilterOportunidad(params))
}

export const limpiarFilter = (params={}) => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_FILTRO_OPORTUNIDAD_SUCCESS,
        response: params
    })
}

export const restaurarBackup = () => (dispatch, getState) => {
    dispatch({
        type: Action.RESTORE_BACKUP_FILTRO_OPORTUNIDAD_SUCCESS
    })
}

export const sobrescribirAtributosFilterOportunidad = (params) => (dispatch, getState) => {
    dispatch({
        type: Action.REPLACE_FILTRO_OPORTUNIDAD_ATTRIBUTES,
        response: params
    })
}
