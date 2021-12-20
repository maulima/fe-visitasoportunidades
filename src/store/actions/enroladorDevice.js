import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'

const getregisterEnroladorDevice = (params) => ({
    [CALL_API]: {
        types: [Action.GET_ENROLADOR_DEVICE_REQUEST , Action.GET_ENROLADOR_DEVICE_SUCCESS, Action.GET_ENROLADOR_DEVICE_ERROR],
        endpoint: routes().REGISTER_ENROLADOR_DEVICE,
        method: 'POST',
        data: params
    },
})

export const registerEnroladorDevice = (params) => (dispatch) => {
    return dispatch(getregisterEnroladorDevice(params))
}