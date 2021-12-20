import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    loggedIn: false,
    access_token: null,
    requesting: false,
    hasError: false,
    errorType: null,
    errorMessage: null,
    profile: {
        rut: '',
        digitoVerif : '',
        usuario : '',
        nombreCompleto : '',
        rol : '',
        codRegional : '',
        codPlataforma : '',
        codOficina : '',
        codBancaAsociada : '',
        codigoCargo : ''
    },
    permisos: {}
};

class Auth {
    static reduce(state = initialState, action) {
        if (Auth[action.type]) {
            return Auth[action.type](state, action);
        } else {
            return state;
        }
    }

    static [Action.SIGN_IN_REQUEST](state, action) {
        return {
            ...state,
            requesting: true,
            hasError: false,
            errorMessage: null,
        }
    }

    static [Action.SIGN_IN_SUCCESS](state, action) {
        const { env: { API_ENV } } = process
        let res

        switch (API_ENV) {
          case 'dev':
          case 'int':
            res = {
                ...state,
                access_token: action.response ? action.response.access_token : null,
                loggedIn: !!action.response.access_token,
                requesting: false,
                hasError: false,
                errorMessage: ''
            }

            break
          default:
            const { response: { token, session: { infoUsuario, permisos: { puertasPCO, puertasNivel1 } }}} = action
            const esEspecialista = !!_.find(puertasNivel1, (pt) => {
                //false ===  especialista
                //true === banquero
                return (
                    (pt.disabled === false && pt.codPuerta === 'PCOWHLSL/ESA') || 
                    (pt.disabled === false && pt.codPuerta === 'PCOWHLSL/ESB')
                )
            })

            const puedeCrearVisita = !!_.find(puertasPCO, (pt) => pt.codPuerta === 'APPVISTB/CVI')
            const puedeCrearOportunidad = !!_.find(puertasPCO, (pt) => pt.codPuerta === 'APPVISTB/COP')
            const puedeCrearRiesgo = !!_.find(puertasPCO, (pt) => pt.codPuerta === 'APPVISTB/CRR')
            const puedeCrearProspecto = !!_.find(puertasPCO, (pt) => pt.codPuerta === 'APPVISTB/CVI,APPVISTB/COP')
              res = {
                ...state,
                access_token: token.access_token ? token.access_token : null,
                loggedIn: !!token.access_token,
                requesting: false,
                hasError: false,
                errorMessage: '',
                profile: {
                    ...infoUsuario,
                    usuario: infoUsuario.usuario.trim(),
                    rol: esEspecialista ? 'Especialista' : 'Banquero',
                    permisos: {
                        puedeCrearVisita,
                        puedeCrearOportunidad,
                        puedeCrearRiesgo,
                        puedeCrearProspecto
                    }
                },
                invalidToken: false
            }
        }

        return res
    }

    static [Action.SIGN_IN_ERROR](state, action) {
        return {
            ...state,
            requesting: false,
            errorMessage: action.error,
            hasError: true
        }
    }

    static [Action.ADD_PLATAFORMA](state, action) {
        const { env: {API_ENV} } = process
        const { response } = action
        const { profile } = state

        switch (API_ENV) {
            case 'dev':
            case 'int':
                return {
                    ...state
                }
            default:
                return {
                    ...state,
                    profile: { ...profile, plataforma: response }
                }
        }
    }

    static [Action.SIGN_OUT_REQUEST](state, action) {
        return {
            ...state,
            requesting: true
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        const { error, errorType } = action
        const { invalidToken } = state

        return {
            ...initialState,
            ...(error ? {
                hasError: error,
                errorType,
                errorMessage: errorType,
                ...(errorType == 'invalid_token' ? {
                    invalidToken: true,
                    invalidTokenMssgShow: !invalidToken
                } : {})
            } : {})
        }
    }

    static [Action.SIGN_OUT_ERROR](state, action) {
        return {
            ...state,
            loggedIn: false,
            access_token: null,
            requesting: false
        }
    }

    static [Action.SIGN_OUT_CLEAR](state, action) {
        const {invalidToken} = state

        return {
            loggedIn: false,
            access_token: null,
            requesting: false,
            hasError: false,
            errorType: null,
            errorMessage: null,
            ...(state.invalidToken ? {invalidToken} : {})
        }
    }

}

export default Auth.reduce;
