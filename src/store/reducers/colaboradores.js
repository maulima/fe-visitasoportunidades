import * as Action from '../actions/ActionTypes'

const initialState = {
    hasError: false,
    errorMessage: null,
    isFetching: false,
    isFetchingBusqueda: false,
    lista: [],
    listaBusqueda: []
}

class Colaboradores {
    static reduce(state = initialState, action) {
        if (Colaboradores[action.type]) {
            return Colaboradores[action.type](state, action)
        } else {
            return state
        }
    }

    static [Action.GET_COLABORADORES_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false,
        }
    }

    static [Action.GET_COLABORADORES_SUCCESS](state, action) {
        const colaboradores = action.response.usuarios

        return {
            ...state,
            isFetching: false,
            lista: {
                ...state.lista,
                ...colaboradores
            }
        }
    }

    static [Action.GET_COLABORADORES_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.GET_COLABORADORES_BUSQUEDA_REQUEST](state, action) {
        return {
            ...state,
            isFetchingBusqueda: true,
            hasError: false,
        }
    }

    static [Action.GET_COLABORADORES_BUSQUEDA_SUCCESS](state, action) {
        const colaboradores = action.response

        return {
            ...state,
            isFetchingBusqueda: false,
            // lista: {
            //     ...state.lista,
            //     ...colaboradores
            // },
            listaBusqueda: {
                ...colaboradores
            }
        }
    }

    static [Action.GET_COLABORADORES_BUSQUEDA_ERROR](state, action) {
        return {
            ...state,
            isFetchingBusqueda: false,
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

export default Colaboradores.reduce