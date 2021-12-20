import { NavigationActions } from 'react-navigation'
import { RootNavigator as AppNavigator  } from '../../NavigationRoutes'
import { isEqual } from "lodash";
import * as Action from "../actions/ActionTypes";

const firstScreen = AppNavigator.router.getActionForPathAndParams('AuthLoading')
const initialState = AppNavigator.router.getStateForAction(firstScreen)

class Nav {
    static reduce(state = initialState, action) {
        if (Nav[action.type]) {
            return Nav[action.type](state, action);
        } else {
            return AppNavigator.router.getStateForAction(action, state);
        }
    }

    static 'Navigation/BACK'(state, action) {
        const newState = AppNavigator.router.getStateForAction(NavigationActions.back(), state)
        if (state.routes[state.index].routeName === 'Main') {
            if (newState.routes[newState.index].routeName === 'Login') {
                return state
            }
        }

        return newState
    }

    static 'Navigation/NAVIGATE'(state, action) {
        const { routes, index } = state
        const { routeName, params } = action
        const currentRoute = routes[index]

        if (currentRoute.routes) {
            const lastScene = currentRoute.routes[currentRoute.routes.length - 1]

            // Check for duplication
            if (lastScene.routeName === routeName && isEqual(lastScene.params, params)) {
                return state
            }
        }

        return AppNavigator.router.getStateForAction(action, state)
    }

    static [Action.SIGN_IN_SUCCESS](state, action) {
        return {
            ...state,
            invalidToken: false
        }
    }

    static 'Navigation/COMPLETE_TRANSITION'(state, action) {
        return state
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        const { errorType } = action
        const { invalidToken } = state

        return invalidToken ? state : {
            ...initialState,
            ...(errorType === 'invalid_token' ? {
                invalidToken: true,
            } : {})
        }
    }

}


export default Nav.reduce
