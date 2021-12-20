import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    hasError: false,
    errorMessage: null,
    isFetching: false,
    empresas: [],
    lista: {},
}

class GruposEconomicos {
    static reduce(state = initialState, action) {
        if (GruposEconomicos[action.type]) {
            return GruposEconomicos[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_GRUPOS_ECONOMICOS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
        }
    }

    static [Action.GET_GRUPOS_ECONOMICOS_SUCCESS](state, action) {
        return {
            ...state,
            isFetching: false,
            lista: action.response
        }
    }

    static [Action.GET_GRUPOS_ECONOMICOS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.GET_EMPRESA_GRUPOS_ECONOMICOS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
        }
    }

    static [Action.GET_EMPRESA_GRUPOS_ECONOMICOS_SUCCESS](state, action) {
        let ruts = _.map(action.response, 'rutEmpresa')
        ruts = _.uniq(ruts)

        return {
            ...state,
            isFetching: false,
            empresas: _.concat(state.empresas, ruts)
        }
    }

    static [Action.GET_EMPRESA_GRUPOS_ECONOMICOS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CLEAR_EMPRESAS_GRUPOS_ECONOMICOS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
        }
    }

    static [Action.CLEAR_EMPRESAS_GRUPOS_ECONOMICOS_SUCCESS](state, action) {
        return {
            ...state,
            isFetching: false,
            empresas: []
        }
    }

    static [Action.CLEAR_EMPRESAS_GRUPOS_ECONOMICOS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default GruposEconomicos.reduce
