import * as Action from '../actions/ActionTypes'
import _ from 'lodash'


const initialState = {
    hasError: false,
    errorMessage: null,
    isFetching: false,
    empresas: [],
    lista: {},
}

class ObtenerPlataforma {
    static reduce(state = initialState, action) {
        if (ObtenerPlataforma[action.type]) {
            return ObtenerPlataforma[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_OBTENER_PLATAFORMA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_OBTENER_PLATAFORMA_SUCCESS](state, action) {
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

    static [Action.GET_OBTENER_PLATAFORMA_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default ObtenerPlataforma.reduce
