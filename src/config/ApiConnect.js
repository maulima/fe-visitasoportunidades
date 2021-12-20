import {Platform} from 'react-native'
import {normalize} from 'normalizr'
import {fetch} from '../../custom_node_modules/react-native-ssl-pinning'
import axios from 'axios'
import * as _ from 'lodash'
import uuidv1 from 'uuid/v1'

import * as Action from '../store/actions/ActionTypes'
import {BuildVersion} from '../constants/Data'
import {routes} from '../config/endpoints'
import {
    IC_API_ROOT,
    IC_PCOMERCIAL_KEY,
    IC_API_NOTIFICATIONS,
    INT_API_ROOT,
    INT_APICONNECT_API_ROOT,
    INT_APICONNECT_CLIENT_ID,
    INT_PCOMERCIAL_KEY,
    PROD_APICONNECT_API_ROOT,
    PROD_APICONNECT_CLIENT_ID,
    IC_API_NOTIFICATIONS_CLIENT_ID,
    QA_APICONNECT_API_ROOT,
    QA_APICONNECT_CLIENT_ID,
    CERT_AZURE_NOTIFICATIONS,
    CERT_AZURE_NOTIFICATIONS_CLIENT_ID
} from './environments'

// Default Axios configurations
const requestTimeout = 60000
axios.defaults.timeout = requestTimeout

type Callbacks = {
    onUploadProgress: () => {},
    onDownloadProgress: () => {},
    cancelToken: (cancel) => {}
}

type RequestConfig = {
    callbacks: Callbacks,
    data: FormData,
    method: 'OPTIONS' | 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    responseSchema: Object
}

// Call Api with configurations
const callApi = (url: String, config: RequestConfig, token: String) => {
    // Routes skip token (OAuth2)
    const skip_token = [routes().SIGN_IN]

    const routes_header = [
        // Oportunidades
        routes().GET_LISTA_OPORTUNIDAD,
        routes().GET_OPORTUNIDAD,
        routes().CREATE_OPORTUNIDAD,
        routes().CREATE_PROSPECTO,
        routes().GET_PROSPECTO,
        routes().GET_PREGUNTAS_FORM_OPORTUNIDAD,
        routes().GET_LISTA_OPORTUNIDADES_BY_IDS,
        // Visitas
        routes().GET_LISTA_VISITA,
        routes().CREATE_VISITA,
        routes().GET_VISITA,
        routes().GET_PREGUNTAS_FORM_VISITA,
        // Riesgos
        routes().CREATE_RIESGO,
        routes().GET_VIGENCIA_RIESGOS,
        routes().GET_LISTA_RIESGOS_BY_IDS,
        //EnroladorDispositivo
        routes().REGISTER_ENROLADOR_DEVICE 

    ]

    let request = {}
    let urlBase,absoluteUrl
    const {responseSchema = null, data, callbacks, method} = config
    const urlEnv = process.env.API_ENV
    const {OS} = Platform
    const OSVersion = `${OS} ${Platform.Version}`


    //Generacion
    //Headers
    //Url Base del servicio
    //Add SSL Pinning en QA, Prod
    switch (urlEnv) {
        case 'prodApiConnect':
        case 'qaApiConnect':
        case 'ic':
        case 'intApiConnect':
        case 'cert':
        case 'ic_Azure':
        case 'qa_Azure':        
            let apiRoot, clientId
            //Dependiendo el ambiente sacamos los parametros para construir la url base
            if (urlEnv === 'prodApiConnect') {
                urlBase = axios.defaults.baseURL = PROD_APICONNECT_API_ROOT
                apiRoot = PROD_APICONNECT_API_ROOT
                clientId = PROD_APICONNECT_CLIENT_ID
            } else if (urlEnv === 'qaApiConnect') {
                urlBase  = axios.defaults.baseURL  = QA_APICONNECT_API_ROOT
                apiRoot = QA_APICONNECT_API_ROOT
                clientId = QA_APICONNECT_CLIENT_ID
            } else if (urlEnv === 'intApiConnect') {
                urlBase = axios.defaults.baseURL = INT_APICONNECT_API_ROOT
                apiRoot = INT_APICONNECT_API_ROOT
                clientId = INT_APICONNECT_CLIENT_ID
            }
            if (urlEnv === 'ic') {
                urlBase = axios.defaults.baseURL = IC_API_ROOT
                apiRoot = IC_API_ROOT
                clientId = IC_PCOMERCIAL_KEY
            }
            else if(urlEnv === 'ic_Azure'){
                urlBase = axios.defaults.baseURL = IC_API_NOTIFICATIONS
                apiRoot = IC_API_NOTIFICATIONS
                clientId = IC_API_NOTIFICATIONS_CLIENT_ID
            }
            if(urlEnv === 'qa_Azure'){
                urlBase = axios.defaults.baseURL = CERT_AZURE_NOTIFICATIONS
                apiRoot = CERT_AZURE_NOTIFICATIONS
                clientId = CERT_AZURE_NOTIFICATIONS_CLIENT_ID
            }
            // else {
            //     urlBase = axios.defaults.baseURL = CERT_API_ROOT
            //     apiRoot = CERT_API_ROOT
            //     clientId = CERT_PCOMERCIAL_KEY
            // }

            //Url base del servicio
            absoluteUrl = `${urlBase}${url}`
            request = {
                method,
                ...(urlEnv === 'prodApiConnect' ? {
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Access-Control-Allow-Origin': '*',
                        'e_platform': 'mobile',
                        'Content-Type': 'application/json'
                    },
                    timeoutInterval: requestTimeout,
                    // your certificates array (needed only in android) ios will pick it automatically
                    sslPinning: {
                        certs: ['certificate','certificate2','certificate3']
                    },
                    body: JSON.stringify(data),
                } : {
                    url,
                    ...(method === 'GET' ? {} : {data})
                })
            }

            // APICONNECT

            //If login que no necesita token
            if (_.includes(skip_token, url)) {
                request = {
                    ...callbacks,
                    ...request,
                    headers: {
                        ...request.headers,
                        'X-IBM-Client-Id': clientId,
                        'Authorization': `bearer ${token}`,
                        // 'Application-Id': `prueba_publico`,
                        'Application-Id': `visitas ${BuildVersion}`,
                        'Channel': `280`,
                        'Origin-addr': `1122`,
                        'Reference-Operation': OSVersion,
                        'Reference-Service': OSVersion,
                        'Tracking-Id': uuidv1()
                    }
                }
            } else if (method === 'GET') {
                request = {
                    ...callbacks,
                    ...request,
                    headers: {
                        ...request.headers,
                        'Authorization': `bearer ${token}`,
                        'X-IBM-Client-Id': clientId,
                        // 'Application-Id': `prueba_publico`,
                        'Application-Id': `visitas ${BuildVersion}`,
                        'Channel': `280`,
                        'Origin-addr': `1122`,
                        'Reference-Operation': OSVersion,
                        'Reference-Service': OSVersion,
                        'Tracking-Id': uuidv1()
                    }
                }
            }
            //Servicios de mauricio
            else if (_.includes(routes_header, url)) {
                request = {
                    ...callbacks,
                    ...request,
                    headers: {
                        ...request.headers,
                        'Authorization': `bearer ${token}`,
                        'X-IBM-Client-Id': clientId,
                        // 'Application-Id': `prueba_publico`,
                        'Application-Id': `visitas ${BuildVersion}`,
                        'Channel': `280`,
                        'Origin-addr': `1122`,
                        'Reference-Operation': OSVersion,
                        'Reference-Service': OSVersion,
                        'Tracking-Id': uuidv1()
                    }
                }
            } else {
                request = {
                    ...callbacks,
                    ...request,
                    headers: {
                        ...request.headers,
                        'Authorization': `bearer ${token}`,
                        'X-IBM-Client-Id': clientId,
                        // 'Application-Id': `prueba_publico`,
                        'Application-Id': `visitas ${BuildVersion}`,
                        'Channel': `280`,
                        'Origin-addr': `1122`,
                        'Reference-Operation': OSVersion,
                        'Reference-Service': OSVersion,
                        'Tracking-Id': uuidv1()
                    }
                }
            }

            break
        case 'dev':
        case 'int':
          
            let pComercialKey
            request = {url}

            if (urlEnv === 'ic' || urlEnv === 'dev') {
                urlBase = axios.defaults.baseURL = IC_API_ROOT
                apiRoot = IC_API_ROOT
                pComercialKey = IC_PCOMERCIAL_KEY
            } else {
                urlBase = axios.defaults.baseURL = INT_API_ROOT
                apiRoot = INT_API_ROOT
                pComercialKey = INT_PCOMERCIAL_KEY
            }

            // INTEGRACION / INTEGRACION CONTINUA

            if (_.includes(skip_token, url)) {
                request = {
                    ...callbacks,
                    ...request,
                    data,
                    method,
                    headers: {
                        ...request.headers,
                        'Authorization': `Basic ${pComercialKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            } else if (method === 'GET') {
                request = {
                    ...callbacks,
                    ...request,
                    method,
                    headers: {
                        ...request.headers,
                        'Authorization': `bearer ${token}`,
                        // 'Application-Id': `prueba_publico`,
                        'Application-Id': `visitas ${BuildVersion}`,
                        'Channel': `280`,
                        'Origin-addr': `1122`,
                        'Reference-Operation': OSVersion,
                        'Reference-Service': OSVersion,
                        'Tracking-Id': uuidv1()
                    }
                }
            } else if (_.includes(routes_header, url)) {
                request = {
                    ...callbacks,
                    ...request,
                    data,
                    method,
                    headers: {
                        ...request.headers,
                        'Authorization': `bearer ${token}`,
                        // 'Application-Id': `prueba_publico`,
                        'Application-Id': `visitas ${BuildVersion}`,
                        'Channel': `280`,
                        'Origin-addr': `1122`,
                        'Reference-Operation': OSVersion,
                        'Reference-Service': OSVersion,
                        'Tracking-Id': uuidv1()
                    }
                }
            } else {
                request = {
                    ...callbacks,
                    ...request,
                    data,
                    method,
                    headers: {
                        ...request.headers,
                        'Authorization': `bearer ${token}`,
                    }
                }
            }
        default:
    }
    switch (urlEnv) {
        case 'prodApiConnect':
            return fetch(absoluteUrl, request).then(handleError)
                .then(response => {
                        const json = response.data
                        console.log('response', json)
                        if ([200, 201].indexOf(response.status) === - 1) {

                            return Promise.reject(json)
                        }

                        if (responseSchema === null) {
                            return json
                        }

                        const nextPageUrl = getNextPageUrl(json)
                        return Object.assign({}, normalize(json, responseSchema), {nextPageUrl})
                    }
                )
                .catch(error => {
                    const response = error.response

                    if (response) {
                        return Promise.reject(response)
                    } else {
                        console.log(`No se ha detectaron respuesta de error de ${_.last(_.split(url, '/'))}`)
                    }
                })
        default:
            console.log("********")
            console.log(absoluteUrl)
            console.log("********")
            console.log(request)
            return axios(request)
                .then(response => {
                        const json = response.data
                        if ([200, 201].indexOf(response.status) === - 1) {
                            return Promise.reject(json)
                        }

                        if (responseSchema === null) {
                            return json
                        }

                        const nextPageUrl = getNextPageUrl(json)
                        return Object.assign({}, normalize(json, responseSchema), {nextPageUrl})
                    }
                )
                .catch(error => {
                    const response = error.response
                    console.log(response)
                    if (response) {
                        return Promise.reject(response)
                    } else {
                        console.log(`No se ha detectaro respuesta de error de ${_.last(_.split(url, '/'))}`)
                    }
                })
    }
}

const getNextPageUrl = json => {
    if (!json.hasOwnProperty('meta')) {
        return null
    }

    const {meta} = json

    if (!meta.hasOwnProperty('pagination')) {
        return null
    }

    if (meta.pagination.current_page >= meta.pagination.total_pages) {
        return null
    }

    return meta.pagination.links.next || undefined
}

export const CALL_API = 'Call API'

// Redux request and response register on store
export default store => next => action => {
    const initTime = new Date().getTime()
    const callAPI = action[CALL_API]
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let {endpoint} = callAPI
    const {schema, types, method = 'GET', data, callbacks, response} = callAPI
    const request = response ? {data: response} : null
    const {auth: {access_token} = {}} = store.getState()

    if (typeof endpoint === 'function') {
        endpoint = endpoint(store.getState())
    }

    if (typeof endpoint !== 'string') {
        throw new Error('Specify a string endpoint URL.')
    }
    if (!data && !schema) {
        throw new Error('Specify one of the exported Schemas.')
    }
    if (!Array.isArray(types) || types.length !== 3) {
        throw new Error('Expected an array of three action types.')
    }
    if (!types.every(type => typeof type === 'string')) {
        throw new Error('Expected action types to be strings.')
    }

    const actionWith = data => {
        const finalAction = Object.assign({}, action, data)
        delete finalAction[CALL_API]
        return finalAction
    }

    const [requestType, successType, failureType] = types
    next(actionWith({type: Action.NETWORK_OPERATION_START}))
    next(actionWith({type: requestType, request}))

    const config = {
        responseSchema: schema,
        data,
        callbacks,
        method
    }
    return callApi(endpoint, config, access_token)
        .then(
            response => {
                next(actionWith({
                    request,
                    response,
                    type: successType
                }))
                next(actionWith({type: Action.NETWORK_OPERATION_END}))
            },
            error => {
                const status = error && error.status !== undefined ? error.status : null

                if (!error || isFatalError(error) || _.includes([401, 501, 502, 503], status)) {
                    const finalTime = new Date().getTime() - initTime
                    const errorMssg = finalTime >= requestTimeout ? 'request_timeout' : error ? error.data.error : 'Something bad happened'
                    console.log('error!', error)

                    next(actionWith({
                        type: Action.SIGN_OUT_SUCCESS,
                        errorType: errorMssg,
                        errorMessage: errorMssg,
                        error: true
                    }))
                    next(actionWith({type: Action.NETWORK_OPERATION_END}))
                } else {
                    console.log('error!', error)
                    const errorMssg = error.status === 409 ? 'conflict' : error.status === 403 ? 'unauthorized' :
                        (error && (typeof (error.data) === 'string' ? error.data : error.data.message || error.data.error_description)) || 'Something bad happened'

                    next(actionWith({
                        type: failureType,
                        error: errorMssg,
                        request
                    }))
                    next(actionWith({type: Action.NETWORK_OPERATION_END}))
                }
            }
        )
}

const handleError = (response) => {
    if (!response.ok) {
        throw Error(response)
    }
    return response
}

const isFatalError = (err) => {
    const {status, request: {responseURL}} = err || {request: {}}

    return status === 500 ? !_.includes(responseURL, 'empresaComercialBasico') : false
}
