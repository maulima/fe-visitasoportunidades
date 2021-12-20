import * as Action from '../actions/ActionTypes'

const initialState = {
    hasError: false,
    errorMessage: null,
    isFetching: false,
    isPushing: false,
    isSaved: false,
    isValidatingApplicability: false,
    hasValid: false,
    lista: [],
    item: {},
    itemRiesgo:{}
}

class Riesgos {
    static reduce(state = initialState, action) {
        if (Riesgos[action.type]) {
            return Riesgos[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_RIESGO_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_RIESGO_SUCCESS](state, action) {
        const response = action.response

        return {
            ...state,
            isFetching: false,
            item: response,
            hasError: false
        }
    }

    static [Action.GET_RIESGO_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.GET_VIGENCIA_RIESGOS_REQUEST](state, action) {
        return {
            ...state,
            isValidatingApplicability: true,
            hasError: false
        }
    }

    static [Action.GET_VIGENCIA_RIESGOS_SUCCESS](state, action) {
        const { response } = action

        return {
            ...state,
            isValidatingApplicability: false,
            hasValid: response,
            hasError: false
        }
    }

    static [Action.GET_VIGENCIA_RIESGOS_ERROR](state, action) {
        return {
            ...state,
            isValidatingApplicability: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CREATE_RIESGO_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
            hasError: false
        }
    }

    static [Action.CREATE_RIESGO_SUCCESS](state, action) {
        let riesgo = action.response.resumen
        let numeroRiesgos = Object.keys(state.lista || {}).length + 1

        return {
            ...state,
            isPushing: false,
            hasError: false,
            lista: {
                ...state.lista,
                [numeroRiesgos]: {...riesgo}
            },
            item: riesgo
        }
    }

    static [Action.CREATE_RIESGO_ERROR](state, action) {
        return {
            ...state,
            isPushing: false,
            hasError: true
        }
    }

    static [Action.UPDATE_RIESGO_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
            hasError: false
        }
    }

    static [Action.UPDATE_RIESGO_SUCCESS](state, action) {
        const { response, response: { id, resumen } } = action
        const lista = _.clone(state.lista)

        for ( var key of _.keys(lista) ) {
            if (id === lista[key].riesgoId) {
                lista[key] = resumen
                break
            }
        }

        return {
            ...state,
            lista,
            item: response,
            isSaved: true,
            isPushing: false,
            hasError: false
        }
    }

    static [Action.UPDATE_RIESGO_ERROR](state, action) {
        return {
            ...state,
            isPushing: false,
            hasError: true
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }

    
    static [Action.GET_LISTA_RIESGOS_BY_IDS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_LISTA_RIESGOS_BY_IDS_SUCCESS](state, action) {
        const response = action.response
        console.log(response)
        return {
            ...state,
            isFetching: false,
            itemRiesgo: response,
            hasError: false
        }
    }

    static [Action.GET_LISTA_RIESGOS_BY_IDS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CLEAR_RIESGO_SUCCESS](state, action) {
        return {
            ...state,
            item:{} 
        }
    }

}

export default Riesgos.reduce
