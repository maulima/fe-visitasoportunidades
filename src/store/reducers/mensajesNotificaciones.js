import * as Action from '../actions/ActionTypes'
import _ from 'lodash';

const initialState = {
    errorMessage: null,
    hasError: false,
    isFetching: false,
    isRefreshing: false,
    mensajes_notificaciones:[],
    lista:[],
    total:'',
    totalMensaje:false,
    pagina: 0,
}

class MensajesNotificaciones {
    static reduce(state = initialState, action) {
        if (MensajesNotificaciones[action.type]) {
            return MensajesNotificaciones[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_MENSAJES_NOTIFICACIONES_REQUEST](state, action) {
        const { request: { data: { pagina } } } = action
        return {
            ...state,
            isFetching: true,
            isRefreshing: pagina > 0,
            hasError: false
        }
    }

    static [Action.GET_MENSAJES_NOTIFICACIONES_SUCCESS](state, action) {
        const { response:{ mensajes,total },request: { data: { pagina } } } = action
        const { lista } = state
        return {
            ...state,
            total,
            totalMensaje:_.size(mensajes) < 20,
            //lista:pagina === 0 ? mensajes : _.concat(lista, mensajes || []),
            lista:pagina === 0 ? (mensajes === null ? [] : mensajes ) : _.uniqWith(_.concat(lista, mensajes || []), _.isEqual),
            pagina:pagina,
            isFetching: false,
            isRefreshing: false,
            hasError: false
        }
    }

    static [Action.GET_MENSAJES_NOTIFICACIONES_ERROR](state, action) {
        const {error} = action
        return {
            ...state,
            isFetching: false,
            isRefreshing: false,
            hasError: true,
            errorMessage: error
        }
    }

    static [Action.GET_CANT_MENSAJES_NO_LEIDOS_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true
        }
    }

    static [Action.GET_CANT_MENSAJES_NO_LEIDOS_SUCCESS](state, action) {
        const { response:{ cantidadMensajesNoLeidos }} = action
        return {
            ...state,
            isFetching:false,
            cant_mensajes_n:cantidadMensajesNoLeidos
        }
    }

    static [Action.GET_CANT_MENSAJES_NO_LEIDOS_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            error: true
        }
    }


    static [Action.MARCAR_MENSAJES_LEIDOS_REQUEST](state, action) {
        return {
            ...state,
            buttonStyle:true,   
        }
    }
       
    static [Action.MARCAR_MENSAJES_LEIDOS_SUCCESS](state, action) {
        return {
            ...state,
            buttonStyle:false,
            
        }
    }

    static [Action.MARCAR_MENSAJES_LEIDOS_ERROR](state, action) {
        return {
            ...state,
            buttonStyle:false,
        }
    }



    static [Action.CLEAR_MENSAJES_NOTIFICACIONES](state, action) {
        return {
            ...state,
            cant_mensajes_n:''
        }
    }
   
}

export default MensajesNotificaciones.reduce
