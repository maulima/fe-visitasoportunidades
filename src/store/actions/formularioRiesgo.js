import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getFormRiesgo = (backupStore, deFiltros) => ({
    [CALL_API]: {
        types: [Action.GET_FORMULARIO_INICIAL_RIESGO_REQUEST, Action.GET_FORMULARIO_INICIAL_RIESGO_SUCCESS, Action.GET_FORMULARIO_INICIAL_RIESGO_ERROR],
        endpoint: routes().GET_FORM_RIESGO,
        method: 'GET',
        data: {},
        response: {
            backupStore,
            deFiltros
        }
    },
})

const getPreguntasFormRiesgo = (params) => ({
    [CALL_API]: {
        types: [Action.GET_PREGUNTAS_FORMULARIO_RIESGO_REQUEST, Action.GET_PREGUNTAS_FORMULARIO_RIESGO_SUCCESS, Action.GET_PREGUNTAS_FORMULARIO_RIESGO_ERROR],
        endpoint: `${routes().GET_PREGUNTAS_FORM_RIESGO}/${params.respuestaId}`,
        method: 'GET',
        data: {},
        response: {
            id: params.respuestaId
        }
    },
})

export const obtenerFormRiesgo = (backupStore=false, deFiltros=false) => (dispatch) => {
    return dispatch(getFormRiesgo(backupStore, deFiltros))
}

export const obtenerPreguntasFormRiesgo = (params) => (dispatch) => {
    return dispatch(getPreguntasFormRiesgo(params))
}

export const limpiarForm = (params={}) => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_FORMULARIO_RIESGO_SUCCESS,
        response: params
    })
}

export const sobrescribirAtributosFormRiesgo = (params) => (dispatch, getState) => {
    dispatch({
        type: Action.REPLACE_FORMULARIO_RIESGO_ATTRIBUTES,
        response: params
    })
}
