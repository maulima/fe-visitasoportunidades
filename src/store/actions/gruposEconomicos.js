import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getGruposEconomicos = (user) => ({
    [CALL_API]: {
        types: [Action.GET_GRUPOS_ECONOMICOS_REQUEST, Action.GET_GRUPOS_ECONOMICOS_SUCCESS, Action.GET_GRUPOS_ECONOMICOS_ERROR],
        endpoint: routes().GET_GRUPO_ECONOMICOS_USER,
        method: 'POST',
        data: {
            codigoEjecutivo: user
        }
    },
})

const getEmpresasGrupoEconomicos = (groupId, groupName) => ({
    [CALL_API]: {
        types: [Action.GET_EMPRESA_GRUPOS_ECONOMICOS_REQUEST, Action.GET_EMPRESA_GRUPOS_ECONOMICOS_SUCCESS, Action.GET_EMPRESA_GRUPOS_ECONOMICOS_ERROR],
        endpoint: routes().GET_GRUPO_ECONOMICOS_EMPRESAS,
        method: 'POST',
        data: {
            idGrupo: groupId
        },
        response: {
            idGrupo: groupId,
            nombreGrupo: groupName
        }
    },
})

export const obtenerGrupoEconomicos = (user) => (dispatch) => {
    return dispatch(getGruposEconomicos(user))
}

export const obtenerEmpresaGrupoEconomico = (groupId, groupName) => (dispatch) => {
    return new Promise((resolve, reject) => {
       try {
           resolve(dispatch(getEmpresasGrupoEconomicos(groupId, groupName)))
       }catch (e) {
           console.log('ERROR ACTION GRUPO ECONOMICO: ', e)
       }
    })
}

export const limpiarEmpresasGrupoEconomico = () => (dispatch, getState) => {
    dispatch({
        type: Action.CLEAR_EMPRESAS_GRUPOS_ECONOMICOS_SUCCESS
    })
}
