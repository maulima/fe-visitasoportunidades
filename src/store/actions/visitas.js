import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getVisitaList = (params) => ({
    [CALL_API]: {
        types: [Action.GET_VISITAS_REQUEST, Action.GET_VISITAS_SUCCESS, Action.GET_VISITAS_ERROR],
        endpoint: `${routes().GET_LISTA_VISITA}/${params.tipoVisitaR}`,
        method: 'POST',
        data: params,
        response: {
            pagina: params.pagina
        }
    },
})

const getTipoVisitaPriorizada = (params) => ({
    [CALL_API]: {
        types: [Action.GET_VISITAS_PRIORIZADA_REQUEST, Action.GET_VISITAS_PRIORIZADA_SUCCESS,Action.GET_VISITAS_PRIORIZADA_ERROR],
        endpoint: `${routes().GET_LISTA_VISITA}/${params.tipoVisitaPR}`,
        method: 'POST',
        data: params,
        response: {
            pagina: params.pagina
        }
    },
})

const getVisita = (params) => ({
    [CALL_API]: {
        types: [Action.GET_VISITA_REQUEST, Action.GET_VISITA_SUCCESS, Action.GET_VISITA_ERROR],
        endpoint: `${routes().GET_VISITA}/${params.visitaId}/${params.tipoVisita}`,
        method: 'GET',
        data: {}
    }
})

const createVisita = (params) => ({
    [CALL_API]: {
        types: [Action.CREATE_VISITA_REQUEST, Action.CREATE_VISITA_SUCCESS, Action.CREATE_VISITA_ERROR],
        endpoint: `${routes().CREATE_VISITA}/${params.resumen.tipoVisita}`,
        method: 'POST',
        data: params
    }
})

const updateVisita = (params) => ({
    [CALL_API]: {
        types: [Action.UPDATE_VISITA_REQUEST, Action.UPDATE_VISITA_SUCCESS, Action.UPDATE_VISITA_ERROR],
        endpoint:`${routes().CREATE_VISITA}/${params.resumen.tipoVisita}`,
        method: 'POST',
        data: params
    }
})

const getTipoVisita = () => ({
    [CALL_API]: {
        types: [Action.GET_TIPO_VISITA_REQUEST,Action.GET_TIPO_VISITA_SUCCESS,Action.GET_TIPO_VISITA_ERROR],
        endpoint: routes().GET_TIPO_VISITA,
        method: 'GET',
        data: {}
    },
});


const getOportunidadesVencidad = (params) => ({
    [CALL_API]: {
        types: [Action.GET_OPORTUNIDADES_VENCIDAD_REQUEST,Action.GET_OPORTUNIDADES_VENCIDAD_SUCCESS,Action.GET_OPORTUNIDADES_VENCIDAD_ERROR],
        endpoint: routes().GET_OPORTUNIDADES_VENCIDAD,
        method: 'POST',
        data: params
    },
});


const getCantidadVisitaPriorizada = (params) => ({
    [CALL_API]: {
        types: [Action.GET_CANTIDAD_VISITAS_PRIORIZADA_REQUEST,Action.GET_CANTIDAD_VISITAS_PRIORIZADA_SUCCESS,Action.GET_CANTIDAD_VISITAS_PRIORIZADA_ERROR],
        endpoint: routes().GET_CANTIDAD_VISITA_PRIORIZADA,
        method: 'POST',
        data: params
    },
}) 

export const obtenerListaVisitas = (params) => (dispatch) => {
    return dispatch(getVisitaList(params))
}

export const obtenerVisita = (params) => (dispatch) => {
    return dispatch(getVisita(params))
}

export const crearVisita = (params) => (dispatch) => {
    console.log(params)
    return dispatch(createVisita(params))
}

export const actualizarVisita = (params) => (dispatch) => {
    return dispatch(updateVisita(params))
}

export const obtenerTipoVisita = () => (dispatch) => {
    return dispatch(getTipoVisita())
}

export const obtenerTipoVisitaPriorizada = (params) => (dispatch) => {
    return dispatch(getTipoVisitaPriorizada(params))
}

export const obtenerCantidadVisitaPriorizada = (params) => (dispatch) => {
    return dispatch(getCantidadVisitaPriorizada(params))
}

export const obtenerOportunidadesVencidad = (params) => (dispatch) => {
    return dispatch(getOportunidadesVencidad(params))
} 

export const clearVisita = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_VISITA_SUCCESS
    })
}
