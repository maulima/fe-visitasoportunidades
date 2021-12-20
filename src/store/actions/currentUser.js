import * as Action from './ActionTypes'
import { CALL_API } from '../../config/ApiConnect'
import { routes } from '../../config/endpoints'
import { signOut } from './auth'

const getUser = () => ({
    [CALL_API]: {
        types: [Action.GET_CURRENT_USER_REQUEST, Action.GET_CURRENT_USER_SUCCESS, Action.GET_CURRENT_USER_ERROR],
        endpoint: routes().GET_PROFILE,
        method: 'POST',
        data: {}
    }
})

export const fetchUser = () => (dispatch, getState) => {
    return new Promise((resolve, reject) => {
        resolve(dispatch(getUser()))
    })
}