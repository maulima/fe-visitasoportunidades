import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'


const getFormVisita = (tipoVisita, backupStore, deFiltros) => ({
    [CALL_API]: {
        types: [Action.GET_FORMULARIO_INICIAL_VISITA_REQUEST, Action.GET_FORMULARIO_INICIAL_VISITA_SUCCESS, Action.GET_FORMULARIO_INICIAL_VISITA_ERROR],
        endpoint: `${routes().GET_FORM_VISITA}/${tipoVisita}`,
        method: 'GET',
        data: {},
        response: {
            backupStore,
            deFiltros
        }
    },
})

const getPreguntasFormVisita = (params) => ({
    [CALL_API]: {
        types: [Action.GET_PREGUNTAS_FORMULARIO_VISITA_REQUEST, Action.GET_PREGUNTAS_FORMULARIO_VISITA_SUCCESS, Action.GET_PREGUNTAS_FORMULARIO_VISITA_ERROR],
        endpoint: `${routes().GET_PREGUNTAS_FORM_VISITA}/${params.respuestaId}`,
        method: 'GET',
        data: {},
        response: {
            id: params.respuestaId
        }
    },
})

export const obtenerFormVisita = (tipoVisita,backupStore=false, deFiltros=false) => (dispatch) => {
    return dispatch(getFormVisita(tipoVisita,backupStore, deFiltros))
}

export const obtenerPreguntasFormVisita = (params) => (dispatch) => {
    return dispatch(getPreguntasFormVisita(params))
}

export const limpiarForm = (params={}) => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_FORMULARIO_VISITA_SUCCESS,
        response: params
    })
}

export const sobrescribirAtributosFormVisita = (params) => (dispatch, getState) => {
    dispatch({
        type: Action.REPLACE_FORMULARIO_VISITA_ATTRIBUTES,
        response: params
    })
}
