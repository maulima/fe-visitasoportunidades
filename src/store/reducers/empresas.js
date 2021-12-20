import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    hasError: false,
    hasErrorProspecto: false,
    hasErrorCartera: false,
    errorMessage: null,
    isFetchingCartera: false,
    isValidating: false,
    isFetching: false,
    isPushing: false,
    isSaved: false,
    lista: {},
    grupos: {},
    cartera: {}
}

class Empresas {
    static reduce(state = initialState, action) {
        if (Empresas[action.type]) {
            return Empresas[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_CARTERA_REQUEST](state, action) {
        return {
            ...state,
            isFetchingCartera: true,
            hasError: false,
            hasErrorCartera: false
        }
    }

    static [Action.GET_CARTERA_SUCCESS](state, action) {
        const {response} = action

        const res =  {
            ...state,
            isFetchingCartera: false,
            cartera: _.uniq(_.map(response, (r) => r.rutEmpresa)),
            hasError: false,
            hasErrorCartera: false
        }

        return res
    }

    static [Action.GET_CARTERA_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isFetchingCartera: false,
            hasError: true,
            hasErrorCartera: false,
            errorMessage: error
        }
    }

    static [Action.VALIDATE_EMPRESA_REQUEST](state, action) {
        return {
            ...state,
            isValidating: true,
            hasError: false,
            hasErrorProspecto: false
        }
    }

    static [Action.VALIDATE_EMPRESA_SUCCESS](state, action) {
        const {response} = action
        const res =  {
            ...state,
            isValidating: false,
            rutEmpresaValido: !_.isEmpty(response),
            hasError: false,
            hasErrorProspecto: false
        }

        return res
    }

    static [Action.VALIDATE_EMPRESA_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isValidating: false,
            hasError: true,
            hasErrorProspecto: false,
            errorMessage: error
        }
    }

    static [Action.GET_EMPRESA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false,
            hasErrorProspecto: false
        }
    }

    static [Action.GET_EMPRESA_SUCCESS](state, action) {
        const {response} = action
        const {lista, grupos} = state
        const key = response.rut + response.digitoVerificador
        const res =  {
            ...state,
            isFetching: false,
            lista: {
                ...lista,
                [key]: {...grupos[key], ...response}
            },
            hasError: false,
            hasErrorProspecto: false
        }

        return res
    }

    static [Action.GET_EMPRESA_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isFetching: false,
            hasError: true,
            hasErrorProspecto: false,
            errorMessage: error
        }
    }
    

    static [Action.GET_PROSPECTO_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false,
            hasErrorProspecto: false
        }
    }

    static [Action.GET_PROSPECTO_SUCCESS](state, action) {
        const {response: {rut, dv, nombre, usuarioResponsable, macrobanca}} = action
        const {lista, grupos} = state
        const key = rut + dv

        const res =  {
            ...state,
            isFetching: false,
            lista: {
                ...lista,
                [key]: {
                    ...grupos[key],
                    usuarioResponsable,
                    nombreEmpresa: nombre,
                    rut,
                    digitoVerificador: dv,
                    macroBanca: macrobanca.macrobancaNombre,
                }
            },
            hasError: false,
            hasErrorProspecto: false
        }

        return res
    }

    static [Action.GET_PROSPECTO_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isFetching: false,
            hasError: false,
            hasErrorProspecto: true,
            errorMessage: _.includes(error, 'CLIENTE NO EXISTE') ? 'CLIENTE NO EXISTE' : error,
        }
    }

    static [Action.CLEAR_EMPRESA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
        }
    }

    static [Action.CLEAR_EMPRESA_SUCCESS](state, action) {
        return {
            ...state,
            isFetching: false,
            lista: {}
        }
    }

    static [Action.CLEAR_EMPRESA_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CREATE_PROSPECTO_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
            hasError: false,
            hasErrorProspecto: false
        }
    }

    static [Action.CREATE_PROSPECTO_SUCCESS](state, action) {
        const {response: {rut, dv, nombre, usuarioResponsable}} = action

        return {
            ...state,
            isPushing: false,
            lista: {
                [rut + dv]: {
                    rut,
                    usuarioResponsable,
                    nombreEmpresa: nombre,
                    digitoVerificador: dv
                }
            },
            hasError: false,
            hasErrorProspecto: false
        }
    }

    static [Action.CREATE_PROSPECTO_ERROR](state, action) {
        const {error} = action

        return {
            ...state,
            isPushing: false,
            hasError: false,
            hasErrorProspecto: true,
            errorMessage: error,
        }
    }

    static [Action.GET_EMPRESA_GRUPOS_ECONOMICOS_SUCCESS](state, action) {
        const {request: {data: {idGrupo, nombreGrupo}}, response} = action
        const rutEmpresas = _.uniq(_.map(response, (empresa) => empresa.rutEmpresa))
        const lista = _.clone(state.lista)

        _.map(rutEmpresas, (rutEmpresa) => {
            return lista[rutEmpresa] = {...lista[rutEmpresa], idGrupo, nombreGrupo}
        })

        return {
            ...state,
            grupos: lista
        }
    }

    static [Action.CLEAR_EMPRESA_SUCCESS](state, action) {
        const { cartera } = state

        return {...initialState, cartera}
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default Empresas.reduce
