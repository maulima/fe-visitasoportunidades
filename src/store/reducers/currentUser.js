import * as Action from '../actions/ActionTypes'
import _ from 'lodash'

const initialState = {
    isPushing: false,
    hasError: false,
    profile: {
        id: '',
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
    }
};

class CurrentUser {
    static reduce(state = initialState, action) {
        if (CurrentUser[action.type]) {
            return CurrentUser[action.type](state, action);
        } else {
            return state;
        }
    }

    static [Action.GET_CURRENT_USER_REQUEST](state, action) {
        return {
            ...state,
            isPushing: true,
        }
    }

    static [Action.GET_CURRENT_USER_SUCCESS](state, action) {
        const { response, response: { permisos: { puertas } } } = action
        const esEspecialista = !!_.find(puertas, (pt) => pt.codPuerta === 'PCOWHLSL/ESA' || pt.codPuerta === 'PCOWHLSL/ESB')
        const puedeCrearVisita = !!_.find(puertas, (pt) => pt.codPuerta === 'APPVISTB/CVI')
        const puedeCrearOportunidad = !!_.find(puertas, (pt) => pt.codPuerta === 'APPVISTB/COP')
        const puedeCrearRiesgo = !!_.find(puertas, (pt) => pt.codPuerta === 'APPVISTB/CRR')
        const puedeCrearProspecto = !!_.find(puertas, (pt) => pt.codPuerta === 'APPVISTB/CVI,APPVISTB/COP')

        return {
            ...state,
            isPushing: false,
            profile: {
                id: response.id,
                rut: response.infoUsuario.rut,
                digitoVerif : response.infoUsuario.digitoVerif,
                usuario : (response.infoUsuario.usuario || '').trim(),
                nombreCompleto : response.infoUsuario.nombreCompleto,
                rol : esEspecialista ? 'Especialista' : 'Banquero',
                codRegional : response.infoUsuario.codRegional,
                codPlataforma : response.infoUsuario.codPlataforma,
                codOficina : response.infoUsuario.codOficina,
                codBancaAsociada : response.infoUsuario.codBancaAsociada,
                codigoCargo : response.infoUsuario.codigoCargo,
                permisos: {
                    puedeCrearVisita,
                    puedeCrearOportunidad,
                    puedeCrearRiesgo,
                    puedeCrearProspecto
                }
            }
        }
    }

    static [Action.GET_CURRENT_USER_ERROR](state, action) {
        return {
            ...state,
            isPushing: false,
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
                    ...state,
                    profile: { ...profile, plataforma: response }
                }
            default:
                return {
                    ...state
                }
        }
    }

    static [Action.SIGN_OUT_SUCCESS](state, action) {
        return initialState
    }

    static [Action.CLEAR_DATA](state, action) {
        return initialState
    }
}

export default CurrentUser.reduce;
