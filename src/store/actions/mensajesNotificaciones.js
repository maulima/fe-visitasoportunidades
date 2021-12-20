import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getMensajesNotificaciones = (params) => ({
    [CALL_API]: {
        types: [Action.GET_MENSAJES_NOTIFICACIONES_REQUEST, Action.GET_MENSAJES_NOTIFICACIONES_SUCCESS, Action. GET_MENSAJES_NOTIFICACIONES_ERROR],
        endpoint: routes().GET_LISTA_MENSAJES_NOTIFICACIONES,
        method: 'POST',
        data: params,
        response: {
            pagina: params.pagina
        }
    },
})

const getCantMensajesNoLeidos = (params) => ({
    [CALL_API]: {
        types: [Action.GET_CANT_MENSAJES_NO_LEIDOS_REQUEST, Action.GET_CANT_MENSAJES_NO_LEIDOS_SUCCESS, Action.GET_CANT_MENSAJES_NO_LEIDOS_ERROR],
        endpoint: routes().GET_CANT_MENSAJES_NO_LEIDOS,
        method: 'POST',
        data: params
    }
})

const getMarcarMensajeLeidos = (params) => ({
    [CALL_API]: {
        types: [Action.MARCAR_MENSAJES_LEIDOS_REQUEST, Action.MARCAR_MENSAJES_LEIDOS_SUCCESS, Action.MARCAR_MENSAJES_LEIDOS_ERROR],
        endpoint: routes().MARCAR_MENSAJES_LEIDOS,
        method: 'POST',
        data: params
    }
})


export const mensajesNotificaciones = (params) => (dispatch) => {
    return dispatch(getMensajesNotificaciones(params))
}

export const clearMensajesNotificaciones = () => (dispatch) => {
    dispatch({
        type: Action.CLEAR_MENSAJES_NOTIFICACIONES
    })
}

export const cantMensajesNoLeidos = (params) => (dispatch) => {
    return dispatch(getCantMensajesNoLeidos(params))
}

export const marcarMensajeLeidos = (params) => (dispatch) => {
    return dispatch(getMarcarMensajeLeidos(params))
}