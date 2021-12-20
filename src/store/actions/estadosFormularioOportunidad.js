import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'


const getEstadosOportunidad = () => ({
    [CALL_API]: {
        types: [Action.GET_ESTADOS_OPORTUNIDAD_REQUEST, Action.GET_ESTADOS_OPORTUNIDAD_SUCCESS, Action.GET_ESTADOS_OPORTUNIDAD_ERROR],
        endpoint: routes().GET_ESTADOS,
        method: 'GET',
        data: {}
    },
})

export const obtenerEstadosOportunidad = () => (dispatch) => {
    return dispatch(getEstadosOportunidad())
}