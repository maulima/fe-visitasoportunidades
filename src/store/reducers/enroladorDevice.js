import * as Action from '../actions/ActionTypes'

const initialState = {
    isFetching: false,
    error: false,
    user_enrolador_device:{
        rutColaborador:"",
        dvColaborador:"",
        nombreColaborador:"",
        apellidoMaterno:"",
        aplicacion:"",
        versionAplicacion:"",
        proveedorCanal:"",
        token:"",
        uuidDispositivo:"",
        dispositivo:{
            idDispositivo:"",
            modeloDispositivo:"",
            proveedorDispositivo:"",
            proveedorSO:"",
            versionSO:"" 
        }
    }
}


class EnroladorDevice {
    static reduce(state = initialState, action) {
        if (EnroladorDevice[action.type]) {
            return EnroladorDevice[action.type](state, action);
        } else {
            return state
        }
    }

    static [Action.GET_ENROLADOR_DEVICE_REQUEST](state, action) {
        return {
            ...state,
            isFetching: true,
        }
    }

    static [Action.GET_ENROLADOR_DEVICE_SUCCESS](state, action) {
        return {
            ...state,
            isFetching: false 
        }
    }

    static [Action.GET_ENROLADOR_DEVICE_ERROR](state, action) {
        return {
            ...state,
            isFetching: false,
            error: true
        }
    }
   
}

export default EnroladorDevice.reduce
