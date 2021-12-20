import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    hasError: false,
    initialFormLoaded: false,
    errorMessage: null,
    isFetching: false,
    respuestaId: null,
    preguntas: {},
    respuestas: {},
    backup: {
        preguntas: {},
        respuestas: {},
    }
}

class FormularioRiesgo {
    static reduce(state = initialState, action) {
        if (FormularioRiesgo[action.type]) {
            return FormularioRiesgo[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_FORMULARIO_INICIAL_RIESGO_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            initialFormLoaded: false,
            hasError: false
        }
    }

    static [Action.GET_FORMULARIO_INICIAL_RIESGO_SUCCESS](state, action) {
        const { response, request: { data: {backupStore} } } = action
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

    static [Action.GET_FORMULARIO_INICIAL_RIESGO_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            initialFormLoaded: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.GET_PREGUNTAS_FORMULARIO_RIESGO_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            initialFormLoaded: false,
            hasError: false
        }
    }

    static [Action.GET_PREGUNTAS_FORMULARIO_RIESGO_SUCCESS](state, action) {
        const { response, request: { data: { id } } } = action
        const prevPreguntas = {...state.preguntas}
        const prevRespuestas = {...state.respuestas}
        const preguntas = {}
        const totalRespuestas = {}
        const parentId = _.find(_.keys(prevRespuestas), (k) => _.includes(_.keys(prevRespuestas[k]), id))
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
            initialFormLoaded: false,
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

    static [Action.GET_PREGUNTAS_FORMULARIO_RIESGO_ERROR](state, action) {
        const { request: { data: { id } } } = action
        const preguntas = _.clone(state.preguntas)
        const respuestas = _.clone(state.respuestas)
        const parentId = _.find(_.keys(respuestas), (k) => _.includes(_.keys(respuestas[k]), id))

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
            initialFormLoaded: false,
            hasError: true,
            errorMessage: null,
        }
    }

    static [Action.CLEAR_FORMULARIO_RIESGO_SUCCESS](state, action) {
        return {
            ...initialState
        }
    }

    static [Action.REPLACE_FORMULARIO_RIESGO_ATTRIBUTES](state, action) {
        const { response } = action
        const res = {}

        _.map(_.keys(response), (attr) => {
            return Object.assign(res, {[attr]: response[attr]})
        })

        return {
            ...state,
            ...res
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default FormularioRiesgo.reduce
