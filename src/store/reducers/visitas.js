import * as Action from '../actions/ActionTypes'
import _ from 'lodash'


const initialState = {
    hasError: false,
    errorMessage: null,
    hasErrorOportunidades: false,
    isFetching: false,
    isRefreshing: false,
    isPushing: false,
    isSaved: false,
    isFetchingOportunidades: false,
    totalFetched: false,
    lista: [],
    item: {},
    pagina: 0
}

class Visitas {
    static reduce(state = initialState, action) {
        if (Visitas[action.type]) {
            return Visitas[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_VISITAS_REQUEST](state, action) {
        const { request: { data: { pagina } } } = action

        return {
            ...state,
            isFetching: true,
            isRefreshing: pagina > 0,
            hasError: false
        }
    }

    static [Action.GET_VISITAS_SUCCESS](state, action) {
        const { response : { listaVisita,total }, request: { data: { pagina } } } = action
        const { lista } = state
        return {
            ...state,
            //lista: pagina === 0 ? (listaVisita === null ? [] : listaVisita ) : _.uniqWith(_.concat(lista, listaVisita || []), _.isEqual),
            lista: pagina === 0 ? listaVisita : _.concat(lista, listaVisita || []),
            totalFetched: _.size(listaVisita) < 15,
            pagina: pagina,
            totalV:total,
            isSaved: false,
            isFetching: false,
            isRefreshing: false,
            hasError: false
        }
    }

    static [Action.GET_VISITAS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            isRefreshing: false,
            hasError: true,
            errorMessage: action.error,
        }
    }
    
    static [Action.GET_VISITAS_PRIORIZADA_REQUEST](state, action) {
        const { request: { data: { pagina } } } = action

        return {
            ...state,
            isFetching: true,
            isRefreshing: pagina > 0,
            hasError: false
        }
    }

    static [Action.GET_VISITAS_PRIORIZADA_SUCCESS](state, action) {
        const { response : { listaVisita,total }, request: { data: { pagina } } } = action
        const { lista } = state
        return {
            ...state,
            //lista: pagina === 0 ? (listaVisita === null ? [] : listaVisita ) : _.uniqWith(_.concat(lista, listaVisita || []), _.isEqual),
            lista: pagina === 0 ? listaVisita : _.concat(lista, listaVisita || []),
            totalFetched: _.size(listaVisita) < 15,
            pagina: pagina,
            totalVPR:total,
            isSaved: false,
            isFetching: false,
            isRefreshing: false,
            hasError: false
        }
    }

    static [Action.GET_VISITAS_PRIORIZADA_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            isRefreshing: false,
            hasError: true,
            errorMessage: action.error,
        }
    }

    static [Action.GET_VISITA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_VISITA_SUCCESS](state, action) {
        const response = action.response

        return {
            ...state,
            isFetching: false,
            item: {
                ...response,
                detalle: _.map(response.detalle, (dt) => {
                    return {
                        ...dt,
                        preguntaId: `${dt.preguntaId}`,
                        ...(dt.respuestaId ? {respuestaId: `${dt.respuestaId}`} : {})
                    }
                })
            },
            hasError: false
        }
    }

    static [Action.GET_VISITA_ERROR](state, action) {
        const { error } = action

        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: error
        }
    }

    static [Action.CREATE_VISITA_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
            hasError: false
        }
    }

    static [Action.CREATE_VISITA_SUCCESS](state, action) {
        let visita = action.response.resumen
        let numeroVisitas = Object.keys(state.lista || {}).length + 1

        return {
            ...state,
            isPushing: false,
            hasError: false,
            lista: _.uniqWith(_.concat(visita, state.lista), _.isEqual)
        }
    }

    static [Action.CREATE_VISITA_ERROR](state, action) {
        return {
            ...state,
            isPushing: false,
            hasError: true
        }
    }

    static [Action.UPDATE_VISITA_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
            hasError: false
        }
    }

    static [Action.UPDATE_VISITA_SUCCESS](state, action) {
        const { response, response: { id, resumen } } = action
        const lista = _.clone(state.lista)

        for ( var key of _.keys(lista) ) {
            if (id === lista[key].visitaId) {
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

    static [Action.UPDATE_VISITA_ERROR](state, action) {
        return {
            ...state,
            isPushing: false,
            hasError: true
        }
    }

    static [Action.GET_LISTA_OPORTUNIDADES_BY_IDS_REQUEST](state, action) {
        return {
            ...state,
            isFetchingOportunidades: true,
            hasErrorOportunidades: false
        }
    }

    static [Action.GET_LISTA_OPORTUNIDADES_BY_IDS_SUCCESS](state, action) {
        const { item } = state
        const { response } = action

        return {
            ...state,
            isFetchingOportunidades: false,
            item: {
                ...item,
                oportunidades: response
            },
            hasErrorOportunidades: false
        }
    }

    static [Action.GET_LISTA_OPORTUNIDADES_BY_IDS_ERROR](state, action) {
        return {
            ...state,
            isFetchingOportunidades: false,
            hasErrorOportunidades: true
        }
    }

    static [Action.GET_LISTA_RIESGOS_BY_IDS_REQUEST](state, action) {
        return {
            ...state,
            isFetchingRiesgos: true,
            hasErrorRiesgos: false
        }
    }

    static [Action.GET_LISTA_RIESGOS_BY_IDS_SUCCESS](state, action) {
        const { item } = state
        const { response } = action

        return {
            ...state,
            isFetchingRiesgos: false,
            item: {
                ...item,
                riesgos: response
            },
            hasErrorRiesgos: false
        }
    }

    static [Action.GET_LISTA_RIESGOS_BY_IDS_ERROR](state, action) {
        return {
            ...state,
            isFetchingRiesgos: false,
            hasErrorRiesgos: true
        }
    }

    static [Action.CLEAR_VISITA_SUCCESS](state, action) {
        return {
            ...state,
            hasError: false,
            errorMessage: null,
            isFetching: false,
            isPushing: false,
            isSaved: false,
            lista:[] 
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }

    static [Action.GET_TIPO_VISITA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_TIPO_VISITA_SUCCESS](state, action) {
        const { response } = action
        const tipVis = {}

        _.map(response, (obj) => {
            const res = {
                id: obj.id,
                name: obj.nombre
            }

            return tipVis[obj.id] = res
        })
    
        return {
            ...state,
            tipoVisitaR:tipVis[1].id,
            tipoVisitaPR:tipVis[2].id,
            isFetching: false,
            hasError: false
        }
    }

    static [Action.GET_TIPO_VISITA_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.GET_CANTIDAD_VISITAS_PRIORIZADA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_CANTIDAD_VISITAS_PRIORIZADA_SUCCESS](state, action) {
        const { response } = action
        return {
            ...state,
            isFetching: false,
            cantVistPrio:response,
            hasError: false
        }
    }

    static [Action.GET_CANTIDAD_VISITAS_PRIORIZADA_ERROR](state, action) {
        const { error } = action

        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: error
        }
    }
    
    static [Action.GET_OPORTUNIDADES_VENCIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_OPORTUNIDADES_VENCIDAD_SUCCESS](state, action) {
        const { response } = action
        return {
            ...state,
            isFetching: false,
            oportunidadVencidad:response,
            hasError: false
        }
    }

    static [Action.GET_OPORTUNIDADES_VENCIDAD_ERROR](state, action) {
        const { error } = action

        return {
            ...state,
            isFetching: false,
            hasError: true,
            errorMessage: error
        }
    }
}

export default Visitas.reduce
