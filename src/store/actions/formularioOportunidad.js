import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getFormOportunidad = (id, backupStore, deFiltros) => ({
    [CALL_API]: {
        types: [Action.GET_FORMULARIO_INICIAL_OPORTUNIDAD_REQUEST, Action.GET_FORMULARIO_INICIAL_OPORTUNIDAD_SUCCESS, Action.GET_FORMULARIO_INICIAL_OPORTUNIDAD_ERROR],
        endpoint: `${routes().GET_FORM_OPORTUNIDAD}/${id}`,
        method: 'GET',
        data: {},
        response: {
            backupStore,
            deFiltros
        }
    },
})

const getPreguntasFormOportunidad = (params) => ({
    [CALL_API]: {
        types: [Action.GET_PREGUNTAS_FORMULARIO_OPORTUNIDAD_REQUEST, Action.GET_PREGUNTAS_FORMULARIO_OPORTUNIDAD_SUCCESS, Action.GET_PREGUNTAS_FORMULARIO_OPORTUNIDAD_ERROR],
        endpoint: routes().GET_PREGUNTAS_FORM_OPORTUNIDAD,
        method: 'POST',
        data: {
            respuestaId: Number(params.respuestaId),
            estadoId: params.estadoId || 1
        },
        response: {
            preguntaId: params.preguntaId,
            respuestaId: params.respuestaId,
            backupStore: params.backupStore,
            deFiltros: params.deFiltros
        }
    },
})

export const obtenerFormOportunidad = (id, backupStore=false, deFiltros=false) => (dispatch) => {
    return dispatch(getFormOportunidad(id, backupStore, deFiltros))
}

export const obtenerPreguntasFormOportunidad = (params) => (dispatch) => {
    return dispatch(getPreguntasFormOportunidad(params))
}

export const limpiarForm = (params={}) => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_FORMULARIO_OPORTUNIDAD_SUCCESS,
        response: params
    })
}

export const sobrescribirAtributosFormOportunidad = (params) => (dispatch, getState) => {
    dispatch({
        type: Action.REPLACE_FORMULARIO_OPORTUNIDAD_ATTRIBUTES,
        response: params
    })
}
