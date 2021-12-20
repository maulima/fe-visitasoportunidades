import * as Action from '../actions/ActionTypes'
import * as _ from 'lodash'

const initialState = {
    currentFilter: 'DEFAULT',
    usuarioNTResponsable: "",
    responsable: "",
    estadoId: 1,
    clienteId: "",
    respuestasId: [],
    detalles: [],
    preguntas: {},
    respuestas: {},
    fechaInicioCierre: "",
    fechaFinCierre: "",
    current: null,
    filtersActive: false,
    privado: false,
    jefeNT: '',
    macrobancaEmpresa: '',
    codOficina: '',
}

class FiltroOportunidades {
    static reduce(state = initialState, action) {
        if (FiltroOportunidades[action.type]) {
            return FiltroOportunidades[action.type](state, action)
        } else {
            return state
        }
    }

    static [Action.SET_OPORTUNIDAD_FILTER_PARAMS](state, action) {
        const newState = {...state, ...action.data}
        delete newState.backup
        return {
            ...newState,
            backup: {...newState}
        }
    }

    static [Action.GET_FILTRO_INICIAL_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            loadedInitialForm: false,
            hasError: false
        }
    }

    static [Action.GET_FILTRO_INICIAL_OPORTUNIDAD_SUCCESS](state, action) {
        const { response, request: { data: { estadoId } } } = action
        const preguntas = {}
        const respuestas = {}

        _.map(response, (pregunta) =>{
            const { name, obligatorio, tipoPreguntaModel, respuestaModel } = pregunta
            const res = {}

            preguntas[pregunta.id] = { name, obligatorio, tipo: tipoPreguntaModel.name, main: true }
            _.map(respuestaModel, (rm) => res[rm.id] = { name: rm.name, main: true } )

            return respuestas[pregunta.id] = res
        })

        return {
            ...state,
            isFetching: false,
            estadoId: Number(estadoId),
            preguntas,
            respuestas,
            respuestasId: [],
            initialFormLoaded: true,
            hasError: false
        }
    }

    static [Action.GET_FILTRO_INICIAL_OPORTUNIDAD_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            loadedInitialForm: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.GET_PREGUNTAS_FILTRO_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_PREGUNTAS_FILTRO_OPORTUNIDAD_SUCCESS](state, action) {
        const { response, request: { data: { respuestaId } } } = action
        const prevPreguntas = {...state.preguntas}
        const prevRespuestas = {...state.respuestas}
        const preguntas = {}
        const totalRespuestas = {}
        const parentId = _.find(_.keys(prevRespuestas), (k) => _.includes(_.keys(prevRespuestas[k]), respuestaId))
        let respuestas = {}

        _.filter(_.keys(prevPreguntas), (k) => {
            if (prevPreguntas[k].parentId === parentId) {
                _.remove(prevPreguntas[parentId].childrensId, (ci) => ci ===  Number(k))

                return delete prevPreguntas[k]
            }

            return null
        })

        response.map(p => {
            respuestas = {}
            if (!_.includes(prevPreguntas, p.id)) {
                Object.assign(preguntas, { [p.id] : {name: p.name, obligatorio: p.obligatorio, tipo: p.tipoPreguntaModel.name, parentId} })
                prevPreguntas[parentId].childrensId = _.uniq( _.concat( (prevPreguntas[parentId].childrensId || []), p.id ) )
                p.respuestaModel.map(r => {
                    Object.assign(respuestas, { [r.id]: { name: r.name } })
                })
                Object.assign(totalRespuestas, { [p.id] : { ...respuestas }})
            }
        })

        return {
            ...state,
            isFetching: false,
            preguntas: {
                ...prevPreguntas,
                ...preguntas
            },
            respuestas: {
                ...prevRespuestas,
                ...totalRespuestas
            },
            hasError: false
        }
    }

    static [Action.GET_PREGUNTAS_FILTRO_OPORTUNIDAD_ERROR](state, action) {
        const { request: { data: { respuestaId } } } = action
        const preguntas = _.clone(state.preguntas)
        const respuestas = _.clone(state.respuestas)
        const parentId = _.find(_.keys(respuestas), (k) => _.includes(_.keys(respuestas[k]), respuestaId))

        _.filter(_.keys(preguntas), (k) => {
            if (preguntas[k].parentId === parentId) {
                _.remove(preguntas[parentId].childrensId, (ci) => ci === Number(k))
                return delete preguntas[k]
            }

            return null
        })

        return {
            ...state,
            preguntas,
            respuestas,
            isFetching: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CLEAR_FILTRO_OPORTUNIDAD_SUCCESS](state, action) {
        const { response: { respuestaId, full } } = action
        const { current, backup } = state
        let firstPregunta = state.preguntas[current]
        let firstRespuestas = state.respuestas[current]

        return full ? initialState : {
            ...initialState,
            jefeNT: state.state,
            codOficina: state.codOficina,
            current,
            backup,
            preguntas: {
                [current]: { ...firstPregunta }
            },
            respuestas: {
                [current]: { ...firstRespuestas }
            },
            filtersActive: false,
        }
    }

    static [Action.RESTORE_BACKUP_FILTRO_OPORTUNIDAD_SUCCESS](state, action) {
        const { backup } = state

        return {
            ...state,
            ...backup
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default FiltroOportunidades.reduce
