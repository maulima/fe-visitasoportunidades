import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    hasError: false,
    loadedInitialForm: false,
    errorMessage: null,
    isFetching: false,
    first: null,
    current: null,
    respuestaId: null,
    preguntas: {},
    respuestas: {},
    backup: {
        preguntas: {},
        respuestas: {},
    }
}

class FormularioOportunidad {
    static reduce(state = initialState, action) {
        if (FormularioOportunidad[action.type]) {
            return FormularioOportunidad[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_FORMULARIO_INICIAL_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            loadedInitialForm: false,
            hasError: false
        }
    }

    static [Action.GET_FORMULARIO_INICIAL_OPORTUNIDAD_SUCCESS](state, action) {
        const { response, request: { data: {backupStore} } } = action
        let responseRespuesta = response[0].respuestaModel
        let respuestas = {}
        let first = state.first === null && state.current === null ? response[0].id : state.first
        let current = response[0].id  
        

        Object.keys(responseRespuesta || {}).map(key => {
            Object.assign(respuestas, {[responseRespuesta[key].id]: {name: responseRespuesta[key].name, main: true}})
        })

        return {
            ...state,
            isFetching: false,
            first,
            ...( backupStore ? {
                backup: {
                    preguntas: {
                      [response[0].id]: { name: response[0].name, obligatorio: response[0].obligatorio, tipo: response[0].tipoPreguntaModel.name, main: true },
                    },
                    respuestas: {
                        [response[0].id]:{ ...respuestas}
                    }
                },
                loadedInitialForm: false
            } : {
                preguntas: {
                  [response[0].id]: { name: response[0].name, obligatorio: response[0].obligatorio, tipo: response[0].tipoPreguntaModel.name },
                },
                respuestas: {
                    [response[0].id]:{ ...respuestas},
                },
                loadedInitialForm: true,
                current
            }),
            /*preguntaSlider: {
                id:response[1].id,name: response[1].name, obligatorio: response[1].obligatorio, tipo:response[1].tipoPreguntaModel.name, main: true
            },*/
            hasError: false,
        }
    }

    static [Action.GET_FORMULARIO_INICIAL_OPORTUNIDAD_ERROR](state, action) {
        const { error } = action

        return {
            ...state,
            isFetching: false,
            loadedInitialForm: false,
            hasError: true,
            errorMessage: error,
        }
    }

    static [Action.GET_PREGUNTAS_FORMULARIO_OPORTUNIDAD_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
            hasError: false
        }
    }

    static [Action.GET_PREGUNTAS_FORMULARIO_OPORTUNIDAD_SUCCESS](state, action) {
        const { response, request: { data: {respuestaId, backupStore} } } = action
        const { backup } = state
        const prevPreguntas = {...state.preguntas}
        const prevRespuestas = {...state.respuestas}
        const preguntas = {}
        const totalRespuestas = {}
        const parentId = _.find(_.keys(prevRespuestas), (k) => !!prevRespuestas[k][respuestaId])
        let respuestas = {}

        _.filter(_.keys(prevPreguntas), (k) => {
            if (parentId && prevPreguntas[k].parentId === parentId) {
                _.remove(prevPreguntas[parentId].childrensId, (ci) => ci ===  Number(k))

                return delete prevPreguntas[k]
            }

            return null
        })

        response.map(p => {
            respuestas = {}
            if (!_.includes(prevPreguntas, p.id)) {
                Object.assign(preguntas, { [p.id] : {name: p.name, obligatorio: p.obligatorio, tipo: p.tipoPreguntaModel.name, parentId} })
                if (prevPreguntas[parentId]) prevPreguntas[parentId].childrensId = _.orderBy(_.uniq( _.concat( (prevPreguntas[parentId].childrensId || []), p.id ) ))
                p.respuestaModel.map(r => {
                    Object.assign(respuestas, { [r.id]: { name: r.name } })
                })
                Object.assign(totalRespuestas, { [p.id] : { ...respuestas }})
            }
        })



        return {
            ...state,
            isFetching: false,
            ...( backupStore ? {
                backup: {
                    preguntas: {
                        ...backup.preguntas,
                        ...preguntas
                    },
                    respuestas: {
                        ...backup.respuestas,
                        ...totalRespuestas
                    }
                }
            } : {
                preguntas: {
                    ...prevPreguntas,
                    ...preguntas
                },
                respuestas: {
                    ...prevRespuestas,
                    ...totalRespuestas
                }
            }),
            respuestaId,
            hasError: false
        }
    }

    static [Action.GET_PREGUNTAS_FORMULARIO_OPORTUNIDAD_ERROR](state, action) {
        const { request: { data: { respuestaId } } } = action
        const preguntas = _.clone(state.preguntas)
        const respuestas = _.clone(state.respuestas)
        const parentId = _.find(_.keys(respuestas), (k) => _.includes(_.keys(respuestas[k]), respuestaId))

        _.filter(_.keys(preguntas), (k) => {
            if (parentId && preguntas[k].parentId === parentId) {
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

    static [Action.CLEAR_FORMULARIO_OPORTUNIDAD_SUCCESS](state, action) {
        const { response: { full } } = action
        const { first, current } = state
        let firstPregunta = state.preguntas[current]
        let firstRespuestas = state.respuestas[current]

        return full ? initialState : {
            ...initialState,
            first,
            current,
            preguntas: {
                [current]: { ...firstPregunta }
            },
            respuestas: {
                [current]: { ...firstRespuestas }
            }
        }
    }

    static [Action.REPLACE_FORMULARIO_OPORTUNIDAD_ATTRIBUTES](state, action) {
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

export default FormularioOportunidad.reduce
