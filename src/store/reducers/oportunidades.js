import * as Action from '../actions/ActionTypes'
import {montoEntero} from '../../utils/StringHelper'
import _ from 'lodash'

const initialState = {
    hasError: false,
    hasErrorGetOportunidad: false,
    errorMessage: null,
    isFetching: false,
    isRefreshing: false,
    isPushing: false,
    isSaved: false,
    totalFetched: false,
    monto: 0,
    lista: [],
    item: {},
    itemOportunidadId:{},
    pagina: 0
}

class Oportunidades {
    static reduce(state = initialState, action) {
        if (Oportunidades[action.type]) {
            return Oportunidades[action.type](state, action)
        } else {
            return state
        }
    }

    static [Action.GET_OPORTUNIDADES_REQUEST](state, action) {
        const {request: {data: {pagina}}} = action

        return {
            ...state,
            isFetching: true,
            isRefreshing: pagina > 0,
            hasError: false
        }
    }

    static [Action.GET_OPORTUNIDADES_SUCCESS](state, action) {
        const {response: {listaOportunidad, monto}, request: {data: {pagina}}} = action
        const {lista} = state

        return {
            ...state,
            isSaved: false,
            isFetching: false,
            isRefreshing: false,
            monto: pagina === 0 ? monto || 0 : state.monto,
            totalFetched: _.size(listaOportunidad) < 15,
            pagina: pagina,
            lista: pagina === 0 ? listaOportunidad : _.concat(lista, listaOportunidad || []),
        }
    }

    static [Action.GET_OPORTUNIDADES_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            isRefreshing: false,
            hasError: true,
            errorMessage: action.error,
        }
    }

    static [Action.GET_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_OPORTUNIDAD_SUCCESS](state, action) {
        const response = action.response
        return {
            ...state,
            isFetching: false,
            item: response,
            hasErrorGetOportunidad: false,
        }
    }

    static [Action.GET_OPORTUNIDAD_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isFetching: false,
            item: {},
            hasErrorGetOportunidad: true,
            errorMessage: error,
        }
    }

   /* static [Action.GET_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_OPORTUNIDAD_SUCCESS](state, action) {
        const response = action.response
        return {
            ...state,
            isFetching: false,
            item: response,
            hasErrorGetOportunidad: false,
        }
    }

    static [Action.GET_OPORTUNIDAD_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isFetching: false,
            item: {},
            hasErrorGetOportunidad: true,
            errorMessage: error,
        }
    }*/

    static [Action.CREATE_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
            hasError: false
        }
    }

    static [Action.CREATE_OPORTUNIDAD_SUCCESS](state, action) {
        let oportunidad = action.response.resumen
        let monto = action.response.monto
        let numeroOportunidades = Object.keys(state.lista || {}).length + 1

        return {
            ...state,
            isPushing: false,
            isSaved: true,
            monto: state.monto + monto,
            lista: {
                ...state.lista,
                [numeroOportunidades]: {...oportunidad}
            },
            item: oportunidad
        }
    }

    static [Action.CREATE_OPORTUNIDAD_ERROR](state, action) {
        return {
            ...state,
            isPushing: false,
        }
    }

    static [Action.UPDATE_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
            hasError: false
        }
    }

    static [Action.UPDATE_OPORTUNIDAD_SUCCESS](state, action) {
        const {response, response: {id, resumen}} = action
        const lista = _.clone(state.lista)
        let monto = 0

        _.map(lista, (value, i) => {
            if (id === value.oportunidadId) {
                let diferenciaMonto = montoEntero(resumen.monto) - montoEntero(value.monto)

                monto = state.monto + diferenciaMonto
                lista[i] = resumen
            }

            return value
        })

        return {
            ...state,
            lista,
            item: response,
            monto,
            isSaved: true,
            isPushing: false,
            hasError: false
        }
    }

    static [Action.UPDATE_OPORTUNIDAD_ERROR](state, action) {
        return {
            ...state,
            isPushing: false,
            hasError: true
        }
    }

    static [Action.UPDATE_DETALLE_OPORTUNIDAD](state, action) {
        const {response} = action

        return {
            ...state,
            item: {
                ...state.item,
                ...response
            }
        }
    }

    static [Action.CLEAR_OPORTUNIDAD_SUCCESS](state, action) {
        return {
            ...state,
            hasError: false,
            errorMessage: null,
            isFetching: false,
            isPushing: false,
            isSaved: false,
            item: {}
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }



    static [Action.GET_LISTA_OPORTUNIDADES_BY_IDS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_LISTA_OPORTUNIDADES_BY_IDS_SUCCESS](state, action) {
        const response = action.response
        return {
            ...state,
            isFetching: false,
            itemOportunidadId: response,
            hasErrorGetOportunidad: false,
        }
    }

    static [Action.GET_LISTA_OPORTUNIDADES_BY_IDS_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isFetching: false,
            item: {},
            hasErrorGetOportunidad: true,
            errorMessage: error,
        }
    }

}

export default Oportunidades.reduce
