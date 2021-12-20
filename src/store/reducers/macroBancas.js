import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    hasError: false,
    errorMessage: null,
    isFetching: false,
    empresas: [],
    lista: {},
}

class MacroBancas {
    static reduce(state = initialState, action) {
        if (MacroBancas[action.type]) {
            return MacroBancas[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_MACROBANCAS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_MACROBANCAS_SUCCESS](state, action) {
        const { response } = action
        const lista = {}

        _.map(response, (obj) => {
            const res = {
                id: obj.id,
                name: obj.macrobancaNombre
            }

            return lista[obj.id] = res
        })

        return {
            ...state,
            lista,
            isFetching: false,
            hasError: false
        }
    }

    static [Action.GET_MACROBANCAS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default MacroBancas.reduce
