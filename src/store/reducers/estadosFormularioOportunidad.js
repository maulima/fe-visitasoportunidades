import * as Action from '../actions/ActionTypes'

const initialState = {
    hasError: false,
    errorMessage: null,
    isFetching: false,
    lista: [],
}

class EstadosFormularioOportunidad {
    static reduce(state = initialState, action) {
        if (EstadosFormularioOportunidad[action.type]) {
            return EstadosFormularioOportunidad[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_ESTADOS_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
        }
    }

    static [Action.GET_ESTADOS_OPORTUNIDAD_SUCCESS](state, action) {
        const estados = action.response
        return {
            ...state,
            isFetching: false,
            lista: {
                ...state.lista,
                ...estados
            }
        }
    }

    static [Action.GET_ESTADOS_OPORTUNIDAD_ERROR](state, action) {
        const { error } = action

        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: error
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default EstadosFormularioOportunidad.reduce