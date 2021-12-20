import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

export const updateVisitaFilterParams = (params = Object) => (dispatch) => {
    dispatch({
        type: Action.SET_VISITA_FILTER_PARAMS,
        data: params,
    })
}

const getFilterVisita = (tipoVisita,backupStore) => ({
    [CALL_API]: {
        types: [Action.GET_FILTRO_INICIAL_VISITA_REQUEST, Action.GET_FILTRO_INICIAL_VISITA_SUCCESS, Action.GET_FILTRO_INICIAL_VISITA_ERROR],
        endpoint: `${routes().GET_FILTER_VISITA}/${tipoVisita}`,
        method: 'GET',
        data: {},
        response: {
            backupStore
        }
    },
})

const getFilterPrioriazadaVisita = (tipoVisita,backupStore) => ({
    [CALL_API]: {
        types: [Action.GET_FILTRO_PRIORIZADA_VISITA_REQUEST, Action.GET_FILTRO_PRIORIZADA_VISITA_SUCCESS, Action.GET_FILTRO_PRIORIZADA_VISITA_ERROR],
        endpoint: `${routes().GET_FILTER_VISITA}/${tipoVisita}`,
        method: 'GET',
        data: {},
        response: {
            backupStore
        }
    },
})


export const obtenerFilterVisita = (tipoVisita,backupStore=false) => (dispatch) => {
    return dispatch(getFilterVisita(tipoVisita,backupStore))
}

export const obtenerFilterPriorizadaVisita = (tipoVisita,backupStore=false) => (dispatch) => {
    return dispatch(getFilterPrioriazadaVisita(tipoVisita,backupStore))
}

export const limpiarFilter = (params={}) => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_FILTRO_VISITA_SUCCESS,
        response: params
    })
}

export const restaurarBackup = () => (dispatch, getState) => {
    dispatch({
        type: Action.RESTORE_BACKUP_FILTRO_VISITA_SUCCESS
    })
}

export const sobrescribirAtributosFilterVisita = (params) => (dispatch, getState) => {
    dispatch({
        type: Action.REPLACE_FILTRO_VISITA_ATTRIBUTES,
        response: params
    })
}
