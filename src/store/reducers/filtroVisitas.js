import * as Action from '../actions/ActionTypes'
import * as _ from 'lodash'


const initialState = {
    currentFilter: 'DEFAULT',
    usuarioNTResponsable: "",
    fechaVisitaInicio: "",
    fechaVisitaFin: "",
    clienteId: "",
    grupoEconomico: "",
    periodo: "",
    respuestasId: [],
    respuestasId2:[],
    detalles: [],
    preguntas: {},
    respuestas: {},
    initialFormLoaded: false,
    participante: {
        responsable: null,
        usuarioNTResponsable: null,
    },
    filtersActive: false,
    privado: false,
    priorizada:false,
    jefeNT: '',
    macrobancaEmpresa: '',
    plataformaEmpresa:'',
    codOficina: '',
}

class FiltroVisitas {
    static reduce(state = initialState, action) {
        if (FiltroVisitas[action.type]) {
            return FiltroVisitas[action.type](state, action)
        } else {
            return state
        }
    }

    static [Action.SET_VISITA_FILTER_PARAMS](state, action) {
        const newState = {...state, ...action.data}
        delete newState.backup

        return {
            ...newState,
            backup: {...newState}
        }
    }

    static [Action.GET_FILTRO_INICIAL_VISITA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            initialFormLoaded: false,
            hasError: false
        }
    }

    static [Action.GET_FILTRO_INICIAL_VISITA_SUCCESS](state, action) {
        const { response, request: { data: {backupStore} } } = action
        const preguntas = {}
        const respuestas = {}

        const motivoArr = _.filter(response, (pregunta) => pregunta.name === 'Motivo de la visita')

        _.map(motivoArr, (pregunta) => {
            const { name, obligatorio, tipoPreguntaModel, respuestaModel } = pregunta
            const res = {}

            preguntas[pregunta.id] = { name, obligatorio, tipo: tipoPreguntaModel.name, main: true }
            _.map(respuestaModel, (rm) => res[rm.id] = { name: rm.name, main: true } )

            return respuestas[pregunta.id] = res
        })

        return {
            ...state,
            isFetching: false,
            ...( backupStore ? {
                backup: {
                    preguntas,
                    respuestas
                },
                initialFormLoaded: false
            } : {
                preguntas,
                respuestas,
                initialFormLoaded: true
            }),
            hasError: false
        }
    }

    static [Action.GET_FILTRO_INICIAL_VISITA_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            initialFormLoaded: false,
            hasError: true,
            errorMessage: null,
        }
    }
    

    static [Action.GET_FILTRO_PRIORIZADA_VISITA_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            initialFormLoaded: false,
            hasError: false
        }
    }
    

    static [Action.GET_FILTRO_PRIORIZADA_VISITA_SUCCESS](state, action) {
        const { response, request: { data: {backupStore} } } = action
        const preguntas = {}
        const respuestas = {}
        
        const motivoArr2 = _.filter(response, (pregunta) => pregunta.name === 'Gestión de la visita')
        const motivoArr3 = _.filter(response, (pregunta) => pregunta.name === 'Detalle del origen')

        _.map(motivoArr2, (pregunta) => {
            const { name, obligatorio, tipoPreguntaModel, respuestaModel } = pregunta
            const res = {}

            preguntas[pregunta.id] = { name, obligatorio, tipo: tipoPreguntaModel.name, main: true }
            _.map(respuestaModel, (rm) => res[rm.id] = { name: rm.name, main: true } )

            return respuestas[pregunta.id] = res
        })

        _.map(motivoArr3, (pregunta) => {
            const { name, obligatorio, tipoPreguntaModel, respuestaModel } = pregunta
            const res = {}

            preguntas[pregunta.id] = { name, obligatorio, tipo: tipoPreguntaModel.name, main: true }
            _.map(respuestaModel, (rm) => res[rm.id] = { name: rm.name, main: true } )

            return respuestas[pregunta.id] = res
        })

        return {
            ...state,
            isFetching: false,
            ...( backupStore ? {
                backup: {
                    preguntas,
                    respuestas
                },
                initialFormLoaded: false
            } : {
                preguntas,
                respuestas,
                initialFormLoaded: true
            }),
            hasError: false
        }
    }

    static [Action.GET_FILTRO_PRIORIZADA_VISITA_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            initialFormLoaded: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CLEAR_FILTRO_VISITA_SUCCESS](state, action) {
        return {
            ...initialState,
            jefeNT: state.jefeNT,
            codOficina: state.codOficina,
        }
    }

    static [Action.RESTORE_BACKUP_FILTRO_VISITA_SUCCESS](state, action) {
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

export default FiltroVisitas.reduce
