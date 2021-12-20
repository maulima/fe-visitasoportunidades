import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'
import * as _ from 'lodash'

const getCartera = (params) => ({
    [CALL_API]: {
        types: [Action.GET_CARTERA_REQUEST, Action.GET_CARTERA_SUCCESS, Action.GET_CARTERA_ERROR],
        endpoint: routes().GET_CARTERA,
        method: 'POST',
        data: params
    },
})

const getEmpresas = (rut, dv) => ({
    [CALL_API]: {
        types: [Action.GET_EMPRESA_REQUEST, Action.GET_EMPRESA_SUCCESS, Action.GET_EMPRESA_ERROR],
        endpoint: routes().GET_EMPRESA,
        method: 'POST',
        data: {
            rutEmpresa: rut + dv
        }
    },
})

const validateEmpresasEspecialista = (rut, dv) => ({
    [CALL_API]: {
        types: [Action.VALIDATE_EMPRESA_REQUEST, Action.VALIDATE_EMPRESA_SUCCESS, Action.VALIDATE_EMPRESA_ERROR],
        endpoint: routes().VALIDATE_EMPRESA,
        method: 'POST',
        data: {
            rutEmpresa: `${rut}-${dv}`
        }
    },
})

const getProspectos = (rut, dv) => ({
    [CALL_API]: {
        types: [Action.GET_PROSPECTO_REQUEST, Action.GET_PROSPECTO_SUCCESS, Action.GET_PROSPECTO_ERROR],
        endpoint: routes().GET_PROSPECTO,
        method: 'POST',
        data: {
            rut: Number(rut),
            dv: dv
        }
    },
})

const createProspecto = (params) => ({
    [CALL_API]: {
        types: [Action.CREATE_PROSPECTO_REQUEST, Action.CREATE_PROSPECTO_SUCCESS, Action.CREATE_PROSPECTO_ERROR],
        endpoint: routes().CREATE_PROSPECTO,
        method: 'POST',
        data: params
    },
})

export const obtenerCartera = (params) => (dispatch) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(dispatch(getCartera(params)))
        } catch (e) {
            console.log('Error obtener cartera: ', e)
        }
    })
}

export const obtenerEmpresas = (rut) => (dispatch) => {
    return new Promise((resolve, reject) => {
        try {
            const dv = _.last(rut)
            resolve(dispatch(getEmpresas(rut.substring(0, _.size(rut) - 1), dv)))
        } catch (e) {
            console.log('Error obtener empresa: ', e)
        }
    })
}

export const validarEmpresasEspecialista = (rut) => (dispatch) => {
    return new Promise((resolve, reject) => {
        try {
            const dv = _.last(rut)
            resolve(dispatch(validateEmpresasEspecialista(rut.substring(0, _.size(rut) - 1), dv)))
        } catch (e) {
            console.log('Error obtener empresa: ', e)
        }
    })
}

export const obtenerProspectos = (rut) => (dispatch) => {
    return new Promise((resolve, reject) => {
        try {
            const dv = _.last(rut)
            resolve(dispatch(getProspectos(rut.substring(0, _.size(rut) - 1), dv)))
        } catch (e) {
            console.log('Error obtener empresa: ', e)
        }
    })
}

export const crearProspecto = (params) => (dispatch) => {
    return dispatch(createProspecto(params))
}

export const limpiarEmpresas = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_EMPRESA_SUCCESS
    })
}
