import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    hasError: false,
    errorMessage: null,
    isFetching: false,
    lista: {},
}

class ObtenerPeriodos {
    static reduce(state = initialState, action) {
        if (ObtenerPeriodos[action.type]) {
            return ObtenerPeriodos[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_OBTENER_PERIODOS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_OBTENER_PERIODOS_SUCCESS](state, action) {
        const { response } = action
        const lista = {}

        _.map(response, (obj,id) => {
            const res = {
                id:id,
                name:obj
            }

            return lista[id] = res
        })

        return {
            ...state,
            lista,
            isFetching: false,
            hasError: false
        }
    }

    static [Action.GET_OBTENER_PERIODOS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }
}

export default ObtenerPeriodos.reduce
