import {FeatureIc} from '../constants/Data'
import {versionQA} from '../constants/Data'
import {msTuboExp,msEmpresaInformacionFinanciera,msGrupoEconomicoInformacionFinanciera,msDatosBasicosColaborador,msDatosCliente,msEnroladorDispositivo} from '../constants/Data'
export const routes = () => {
    let res
    switch (process.env.API_ENV) {
        case 'dev':
            res = {
                // SESSIONS
                SIGN_IN: '/ms-logincolaboradores-util-master/oauth/token',
                SIGN_OUT: '/ms-logincolaboradores-util-master/oauth/revoke/token',

                // PROFILE
                GET_PROFILE: '/ms-sesionusuario-util-master/soporte-empresarial/gestion-ti/ms-sesionusuario-util/crear-sesion',

                // COLABORADORES
                GET_COLABORADORES_USER: '/ms-datosbasicoscolaborador-util-master/SoporteEmpresarial/GestionRecursosHumanos/colaboradorPar',

                // COLABORADORES
                GET_COLABORADORES_USER_BUSQUEDA: '/ms-datosbasicoscolaborador-util-feature-obtener-todos-ejecutivos/SoporteEmpresarial/GestionRecursosHumanos/obtenerColaborador',

                // CARTERA
                GET_CARTERA: '/ms-empresainformacionfinanciera-neg-master/v1/DatosFinancierosEmpresa/cartera',

                // GRUPO ECONOMICOS
                GET_GRUPO_ECONOMICOS_USER: '/ms-grupoeconomicoinformacionfinanciera-neg-master/v1/DatosFinancierosGrupo/gruposEjecutivo',
                GET_GRUPO_ECONOMICOS_EMPRESAS: '/ms-grupoeconomicoinformacionfinanciera-neg-master/v1/DatosFinancierosGrupo/empresas',

                // EMPRESA
                GET_EMPRESA: '/ms-datoscliente-neg-master/DatosCliente/empresaComercialBasico',
                VALIDATE_EMPRESA: '/ms-empresainformacionfinanciera-neg-master/v1/DatosFinancierosEmpresa/rutEmpresaBancaPrivada',

                // Estados
                GET_ESTADOS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerTipoEstado',

                // MACROBANCA
                GET_MACROBANCAS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerMacrobanca',

                // Forrmulario Oportunidad
                GET_FORM_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerFormularioOportunidad',
                GET_PREGUNTAS_FORM_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerPreguntasOportunidad',

                // Filtro Oportunidad
                GET_FILTER_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerFiltroOportunidad',

                // Oportunidad
                GET_LISTA_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerOportunidadResumen',
                CREATE_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/crearOportunidad',
                GET_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerOportunidad',
                GET_LISTA_OPORTUNIDADES_BY_IDS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerOportunidadResumenLista',

                // Prospecto
                CREATE_PROSPECTO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/crearProspecto',
                GET_PROSPECTO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/buscarProspecto',

                //Sprint 2

                // Forrmulario Visita
                GET_FORM_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerFormularioVisita',
                GET_PREGUNTAS_FORM_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerPreguntasVisita',

                // Filtro Visita
                GET_FILTER_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerFiltroVisita',


                // Visita
                GET_LISTA_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerVisitaResumen',
                CREATE_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/guardarVisita',
                GET_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerVisita',

                //Sprint 2

                // Forrmulario Riesgo
                GET_FORM_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerFormularioRiesgo',
                GET_PREGUNTAS_FORM_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerPreguntasRiesgo',

                // Visita
                GET_LISTA_RIESGOS_BY_IDS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerRiesgoResumenLista',
                CREATE_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/guardarRiesgo',
                GET_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/obtenerRiesgo',
                GET_VIGENCIA_RIESGOS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/develop/formularioRiesgoVigente',
            }
            break
        case 'ic':
            res = {

                // SESSIONS
                SIGN_IN: '/bff/bff-logincolaboradoresmovil-feature-version3/login/login',
                SIGN_OUT: '/bff/bff-logincolaboradoresmovil-master/login/logout',

                // PROFILE
                GET_PROFILE: '/ms-sesionusuario-util-master/v1/getSession',

                // COLABORADORES
                GET_COLABORADORES_USER: '/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/feature-rut-colaborador/colaboradorPar',
                GET_COLABORADORES_USER_BUSQUEDA: '/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/develop/obtenerColaboradores',

                // CARTERA
                GET_CARTERA: '/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/develop/cartera',

                // GRUPO ECONOMICOS
                GET_GRUPO_ECONOMICOS_USER: '/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/develop/gruposEjecutivo',
                GET_GRUPO_ECONOMICOS_EMPRESAS: '/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/develop/empresas',

                // EMPRESA
                GET_EMPRESA: '/ventas-y-servicios/gestion-clientes/ms-datoscliente-neg/develop/empresaComercialBasico',
                VALIDATE_EMPRESA: '/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/develop/rutEmpresaBancaPrivada',

                // Estados
                GET_ESTADOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerTipoEstado`,

                // MACROBANCA
                GET_MACROBANCAS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerMacrobanca`,

                // Forrmulario Oportunidad
                GET_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFormularioOportunidad`,
                GET_PREGUNTAS_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPreguntasOportunidad`,
                GET_LISTA_OPORTUNIDADES_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerOportunidadResumenLista`,

                // Filtro Oportunidad
                GET_FILTER_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFiltroOportunidad`,

                // Oportunidad
                GET_LISTA_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerOportunidadResumen`,
                CREATE_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/crearOportunidad`,
                GET_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerOportunidad`,

                // Prospecto
                CREATE_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/crearProspecto`,
                GET_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/buscarProspecto`,

                //Sprint 2

                // Forrmulario Visita
                GET_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFormularioVisita`,
                GET_PREGUNTAS_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPreguntasVisita`,

                // Filtro Visita
                GET_FILTER_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFiltroVisita`,

                // Visita
                GET_LISTA_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerVisitaResumen`,
                CREATE_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/guardarVisita`,
                GET_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerVisita`,

                //Sprint 2

                // Forrmulario Riesgo
                GET_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFormularioRiesgo`,
                GET_PREGUNTAS_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPreguntasRiesgo`,

                // Visita
                GET_LISTA_RIESGOS_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerRiesgoResumenLista`,
                CREATE_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/guardarRiesgo`,
                GET_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerRiesgo`,
                GET_VIGENCIA_RIESGOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/formularioRiesgoVigente`,
                
            }
            break
        case 'intApiConnect':
            res = {
                // SESSIONS
                SIGN_IN: '/bff/bff-logincolaboradoresmovil-re-v1-0-0/login/login',
                SIGN_OUT: '/bff/bff-logincolaboradoresmovil-re-v1-0-0/login/logout',

                // PROFILE
                GET_PROFILE: '/ms-sesionusuario-util-re-v1-1-3/v1/getSession',

                // COLABORADORES
                GET_COLABORADORES_USER: '/ms-datosbasicoscolaborador-util-re-v1-3/SoporteEmpresarial/GestionRecursosHumanos/colaboradorPar',
                GET_COLABORADORES_USER_BUSQUEDA: '/ms-datosbasicoscolaborador-util-re-v1-3/SoporteEmpresarial/GestionRecursosHumanos/obtenerColaboradores',

                // CARTERA
                GET_CARTERA: '/ms-empresainformacionfinanciera-neg-re-v1-2/v1/DatosFinancierosEmpresa/cartera',
                VALIDATE_EMPRESA: '/ms-empresainformacionfinanciera-neg-re-v1-2/v1/DatosFinancierosEmpresa/rutEmpresaBancaPrivada',

                // GRUPO ECON OMICOS
                GET_GRUPO_ECONOMICOS_USER: '/ms-grupoeconomicoinformacionfinanciera-neg-re-v1-2/v1/DatosFinancierosGrupo/gruposEjecutivo',
                GET_GRUPO_ECONOMICOS_EMPRESAS: '/ms-grupoeconomicoinformacionfinanciera-neg-re-v1-2/v1/DatosFinancierosGrupo/empresas',

                // EMPRESA
                GET_EMPRESA: '/ms-datoscliente-neg-re-v1-2-0/DatosCliente/empresaComercialBasico',


                // Estados
                GET_ESTADOS: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerTipoEstado',

                // MACROBANCA
                GET_MACROBANCAS: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerMacrobanca',

                // Forrmulario Oportunidad
                GET_FORM_OPORTUNIDAD: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerFormularioOportunidad',
                GET_PREGUNTAS_FORM_OPORTUNIDAD: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerPreguntasOportunidad',
                GET_LISTA_OPORTUNIDADES_BY_IDS: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerOportunidadResumenLista',

                // Filtro Oportunidad
                GET_FILTER_OPORTUNIDAD: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerFiltroOportunidad',

                // Oportunidad
                GET_LISTA_OPORTUNIDAD: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerOportunidadResumen',
                CREATE_OPORTUNIDAD: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/crearOportunidad',
                GET_OPORTUNIDAD: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerOportunidad',

                // Prospecto
                CREATE_PROSPECTO: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/crearProspecto',
                GET_PROSPECTO: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/buscarProspecto',

                // Forrmulario Visita
                GET_FORM_VISITA: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerFormularioVisita',
                GET_PREGUNTAS_FORM_VISITA: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerPreguntasVisita',

                // Filtro Visita
                GET_FILTER_VISITA: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerFiltroVisita',

                // Visita
                GET_LISTA_VISITA: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerVisitaResumen',
                CREATE_VISITA: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/guardarVisita',
                GET_VISITA: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerVisita',

                // Forrmulario Riesgo
                GET_FORM_RIESGO: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerFormularioRiesgo',
                GET_PREGUNTAS_FORM_RIESGO: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerPreguntasRiesgo',

                // Visita
                GET_LISTA_RIESGOS_BY_IDS: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerRiesgoResumenLista',
                CREATE_RIESGO: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/guardarRiesgo',
                GET_RIESGO: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/obtenerRiesgo',
                GET_VIGENCIA_RIESGOS: '/ms-visitasyoportunidades-neg_re-v1-2/VentasYServicios/Ventas/ms-visitasyoportunidades-neg-V1.0/formularioRiesgoVigente',
            }
            break
        case 'qaApiConnect':
            res = {
                // SESSIONS
                SIGN_IN: '/bff/bff-logincolaboradoresmovil-re-v3-0/login/login',
                SIGN_OUT: '/bff/bff-logincolaboradoresmovil-re-v3-0/login/logout',

                // PROFILE
                GET_PROFILE: '/ms-sesionusuario-util-master/v1/getSession',

                //enroladordispositivo
                //REGISTER_ENROLADOR_DEVICE: '/transversales/notificaciones/ms-enroladordispositivocolaborador-neg/develop/enrolador/dispositivo',

                // COLABORADORES
                GET_COLABORADORES_USER: '/ms-datosbasicoscolaborador-util-re-v2-0/SoporteEmpresarial/GestionRecursosHumanos/colaboradorPar',
                GET_COLABORADORES_USER_BUSQUEDA: '/ms-datosbasicoscolaborador-util-re-v2-0/SoporteEmpresarial/GestionRecursosHumanos/obtenerColaboradores',
                // CARTERA
                GET_CARTERA: '/ms-empresainformacionfinanciera-neg-re-v2-1/v1/DatosFinancierosEmpresa/cartera',

                //Agrega el rut a  la cartera de un especialista

                // GRUPO ECONOMICOS
                GET_GRUPO_ECONOMICOS_USER: '/ms-grupoeconomicoinformacionfinanciera-neg-re-v2-0/v1/DatosFinancierosGrupo/gruposEjecutivo',
                GET_GRUPO_ECONOMICOS_EMPRESAS: '/ms-grupoeconomicoinformacionfinanciera-neg-re-v2-0/v1/DatosFinancierosGrupo/empresas',

                // EMPRESA
                GET_EMPRESA: '/ventas-y-servicios/gestion-cliente/ms-datoscliente-neg/v2.0/empresaComercialBasico',
                VALIDATE_EMPRESA: '/ms-empresainformacionfinanciera-neg-re-v2-1/v1/DatosFinancierosEmpresa/rutEmpresaBancaPrivada',

                // Estados
                GET_ESTADOS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerTipoEstado',

                // MACROBANCA
                GET_MACROBANCAS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerMacrobanca',

                // Forrmulario Oportunidad
                GET_FORM_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerFormularioOportunidad',
                GET_PREGUNTAS_FORM_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerPreguntasOportunidad',
                GET_LISTA_OPORTUNIDADES_BY_IDS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerOportunidadResumenLista',

                // Filtro Oportunidad
                GET_FILTER_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerFiltroOportunidad',

                // Oportunidad
                GET_LISTA_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerOportunidadResumen',
                CREATE_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/crearOportunidad',
                GET_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerOportunidad',
                // Prospecto
                CREATE_PROSPECTO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/crearProspecto',
                GET_PROSPECTO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/buscarProspecto',

                // Forrmulario Visita
                GET_FORM_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerFormularioVisita',
                GET_PREGUNTAS_FORM_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerPreguntasVisita',

                // Filtro Visita
                GET_FILTER_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerFiltroVisita',

                // Visita
                GET_LISTA_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerVisitaResumen',
                CREATE_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/guardarVisita',
                GET_VISITA: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerVisita',

                // Forrmulario Riesgo
                GET_FORM_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerFormularioRiesgo',
                GET_PREGUNTAS_FORM_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerPreguntasRiesgo',

                // Visita
                GET_LISTA_RIESGOS_BY_IDS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerRiesgoResumenLista',
                CREATE_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/guardarRiesgo',
                GET_RIESGO: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/obtenerRiesgo',
                GET_VIGENCIA_RIESGOS: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/formularioRiesgoVigente'
            }
            break
        case 'ic_Azure':
            res = {
                // SESSIONS
                SIGN_IN: '/bff/bff-logincolaboradoresmovil-feature-version3/login/login',
                SIGN_OUT: '/bff/bff-logincolaboradoresmovil-master/login/logout',

                // PROFILE
                GET_PROFILE: '/ms-sesionusuario-util-master/v1/getSession',

                //enroladordispositivo
                REGISTER_ENROLADOR_DEVICE: '/transversales/notificaciones/ms-enroladordispositivocolaborador-neg/develop/enrolador/dispositivo',

                // COLABORADORES
                GET_COLABORADORES_USER: '/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/develop/colaboradorPar',
                GET_COLABORADORES_USER_BUSQUEDA: '/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/develop/obtenerColaboradores',

                // CARTERA
                GET_CARTERA: '/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/develop/cartera',

                // GRUPO ECONOMICOS
                GET_GRUPO_ECONOMICOS_USER: '/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/develop/gruposEjecutivo',
                GET_GRUPO_ECONOMICOS_EMPRESAS: '/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/develop/empresas',

                // EMPRESA
                GET_EMPRESA: '/ventas-y-servicios/gestion-clientes/ms-datoscliente-neg/develop/empresaComercialBasico',
                VALIDATE_EMPRESA: '/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/develop/rutEmpresaBancaPrivada',

                // Estados
                GET_ESTADOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerTipoEstado`,

                // MACROBANCA
                GET_MACROBANCAS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerMacrobanca`,

                // Forrmulario Oportunidad
                GET_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFormularioOportunidad`,
                GET_PREGUNTAS_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPreguntasOportunidad`,
                GET_LISTA_OPORTUNIDADES_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerOportunidadResumenLista`,

                // Filtro Oportunidad
                GET_FILTER_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFiltroOportunidad`,

                // Oportunidad
                GET_LISTA_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerOportunidadResumen`,
                //CREATE_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/crearOportunidad`,
                CREATE_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/develop/crearOportunidadNotificacion',
                //CREATE_OPORTUNIDAD_NOTIFICACION:'/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/develop/crearOportunidadNotificacion',
                GET_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerOportunidad`,

                // Prospecto
                CREATE_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/crearProspecto`,
                GET_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/buscarProspecto`,

                //Sprint 2

                // Forrmulario Visita
                GET_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFormularioVisita`,
                GET_PREGUNTAS_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPreguntasVisita`,

                // Filtro Visita
                GET_FILTER_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFiltroVisita`,

                // Visita
                GET_LISTA_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerVisitaResumen`,
                CREATE_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/guardarVisita`,
                GET_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerVisita`,
                GET_CANTIDAD_VISITA_PRIORIZADA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/cantidadVisitasPriorizadas`,  
                GET_OPORTUNIDADES_VENCIDAD:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/oportunidadesVencidas`,   

                //Sprint 2

                // Forrmulario Riesgo
                GET_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerFormularioRiesgo`,
                GET_PREGUNTAS_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPreguntasRiesgo`,

                // Visita
                GET_LISTA_RIESGOS_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerRiesgoResumenLista`,
                CREATE_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/guardarRiesgo`,
                GET_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerRiesgo`,
                GET_VIGENCIA_RIESGOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/formularioRiesgoVigente`,
                
                //tipoVisita
                GET_TIPO_VISITA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerTipoVisita`,

                //mostrar lista mensajes notificaciones
                GET_LISTA_MENSAJES_NOTIFICACIONES : '/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/develop/obtenerMensajes', 
                GET_CANT_MENSAJES_NO_LEIDOS : '/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/develop/obtenerCantidadMensajesNoLeidos',
                MARCAR_MENSAJES_LEIDOS : '/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/develop/marcarMensajeLeido',
                
                //Obtener Plataforma
                GET_OBTENER_PLATAFORMA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPlataforma`,

                //Obtener Periodo
                GET_OBTENER_PERIODOS:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${FeatureIc}/obtenerPeriodos`
                
            }
            break
        case 'qa_Azure':
            res = {
                // SESSIONS
                SIGN_IN: '/bff/bff-logincolaboradoresmovil-re-v3-0/login/login',
                SIGN_OUT: '/bff/bff-logincolaboradoresmovil-re-v3-0/login/logout',
  
                // PROFILE
                GET_PROFILE: '/ms-sesionusuario-util-master/v1/getSession',
  
                //enroladordispositivo
                REGISTER_ENROLADOR_DEVICE: `/transversales/notificaciones/ms-enroladordispositivocolaborador-neg/${msEnroladorDispositivo}/enrolador/dispositivo`,
  
                // COLABORADORES
                GET_COLABORADORES_USER: `/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/${msDatosBasicosColaborador}/colaboradorPar`,
                GET_COLABORADORES_USER_BUSQUEDA: `/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/${msDatosBasicosColaborador}/obtenerColaboradores`,
  
                // CARTERA
                GET_CARTERA: `/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/${msEmpresaInformacionFinanciera}/cartera`,

                // GRUPO ECONOMICOS
                GET_GRUPO_ECONOMICOS_USER: `/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/${msGrupoEconomicoInformacionFinanciera}/gruposEjecutivo`,
                GET_GRUPO_ECONOMICOS_EMPRESAS: `/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/${msGrupoEconomicoInformacionFinanciera}/empresas`,

                // EMPRESA
                GET_EMPRESA: `/ventas-y-servicios/gestion-clientes/ms-datoscliente-neg/${msDatosCliente}/empresaComercialBasico`,
                VALIDATE_EMPRESA: `/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/${msEmpresaInformacionFinanciera}/rutEmpresaBancaPrivada`,

                // Estados
                GET_ESTADOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerTipoEstado`,

                // MACROBANCA
                GET_MACROBANCAS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerMacrobanca`,

                // Forrmulario Oportunidad
                GET_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFormularioOportunidad`,
                GET_PREGUNTAS_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPreguntasOportunidad`,
                GET_LISTA_OPORTUNIDADES_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerOportunidadResumenLista`,

                // Filtro Oportunidad
                GET_FILTER_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFiltroOportunidad`,

                // Oportunidad
                GET_LISTA_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerOportunidadResumen`,
                //CREATE_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/crearOportunidad',
                CREATE_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/crearOportunidadNotificacion`,
                GET_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerOportunidad`,

                // Prospecto
                CREATE_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/crearProspecto`,
                GET_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/buscarProspecto`,

                // Forrmulario Visita
                GET_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFormularioVisita`,
                GET_PREGUNTAS_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPreguntasVisita`,

                // Filtro Visita
                GET_FILTER_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFiltroVisita`,

                // Visita
                GET_LISTA_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerVisitaResumen`,
                CREATE_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/guardarVisita`,
                GET_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerVisita`,
                GET_CANTIDAD_VISITA_PRIORIZADA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/cantidadVisitasPriorizadas`,
                GET_OPORTUNIDADES_VENCIDAD:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/oportunidadesVencidas`,

                // Forrmulario Riesgo
                GET_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFormularioRiesgo`,
                GET_PREGUNTAS_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPreguntasRiesgo`,

                // Visita
                GET_LISTA_RIESGOS_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerRiesgoResumenLista`,
                CREATE_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/guardarRiesgo`,
                GET_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerRiesgo`,
                GET_VIGENCIA_RIESGOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/formularioRiesgoVigente`,

                //tipoVisita
                GET_TIPO_VISITA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerTipoVisita`,

                //mostrar lista mensajes notificaciones
                GET_LISTA_MENSAJES_NOTIFICACIONES : `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/obtenerMensajes`,
                GET_CANT_MENSAJES_NO_LEIDOS : `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/obtenerCantidadMensajesNoLeidos`,
                MARCAR_MENSAJES_LEIDOS : `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/marcarMensajeLeido`,

                //Obtener Plataforma
                GET_OBTENER_PLATAFORMA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPlataforma`,

                GET_OBTENER_PERIODOS:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPeriodos`
            }
            break 
        default:
            res = {
                // SESSIONS
                // SESSIONS
                SIGN_IN: '/bff/bff-logincolaboradoresmovil-re-v3-0/login/login',
                SIGN_OUT: '/bff/bff-logincolaboradoresmovil-re-v3-0/login/logout',

                // PROFILE
                GET_PROFILE: '/ms-sesionusuario-util-master/v1/getSession',

                //enroladordispositivo
                REGISTER_ENROLADOR_DEVICE: `/transversales/notificaciones/ms-enroladordispositivocolaborador-neg/${msEnroladorDispositivo}/enrolador/dispositivo`,

                // COLABORADORES
                GET_COLABORADORES_USER: `/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/${msDatosBasicosColaborador}/colaboradorPar`,
                GET_COLABORADORES_USER_BUSQUEDA: `/soporte-empresarial/gestion-de-recursos-humanos/ms-datosBasicosColaborador-util/${msDatosBasicosColaborador}/obtenerColaboradores`,

                // CARTERA
                GET_CARTERA: `/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/${msEmpresaInformacionFinanciera}/cartera`,

                // GRUPO ECONOMICOS
                GET_GRUPO_ECONOMICOS_USER: `/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/${msGrupoEconomicoInformacionFinanciera}/gruposEjecutivo`,
                GET_GRUPO_ECONOMICOS_EMPRESAS: `/ventas-y-servicios/gestion-clientes/ms-grupoeconomicoinformacionfinanciera-neg/${msGrupoEconomicoInformacionFinanciera}/empresas`,

                // EMPRESA
                GET_EMPRESA: `/ventas-y-servicios/gestion-clientes/ms-datoscliente-neg/${msDatosCliente}/empresaComercialBasico`,
                VALIDATE_EMPRESA: `/ventas-y-servicios/gestion-clientes/ms-empresaInformacionFinanciera-neg/${msEmpresaInformacionFinanciera}/rutEmpresaBancaPrivada`,

                // Estados
                GET_ESTADOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerTipoEstado`,

                // MACROBANCA
                GET_MACROBANCAS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerMacrobanca`,

                // Forrmulario Oportunidad
                GET_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFormularioOportunidad`,
                GET_PREGUNTAS_FORM_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPreguntasOportunidad`,
                GET_LISTA_OPORTUNIDADES_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerOportunidadResumenLista`,

                // Filtro Oportunidad
                GET_FILTER_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFiltroOportunidad`,

                // Oportunidad
                GET_LISTA_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerOportunidadResumen`,
                //CREATE_OPORTUNIDAD: '/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/v2.1/crearOportunidad',
                CREATE_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/crearOportunidadNotificacion`,
                GET_OPORTUNIDAD: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerOportunidad`,

                // Prospecto
                CREATE_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/crearProspecto`,
                GET_PROSPECTO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/buscarProspecto`,

                // Forrmulario Visita
                GET_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFormularioVisita`,
                GET_PREGUNTAS_FORM_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPreguntasVisita`,

                // Filtro Visita
                GET_FILTER_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFiltroVisita`,

                // Visita
                GET_LISTA_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerVisitaResumen`,
                CREATE_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/guardarVisita`,
                GET_VISITA: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerVisita`,
                GET_CANTIDAD_VISITA_PRIORIZADA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/cantidadVisitasPriorizadas`,
                GET_OPORTUNIDADES_VENCIDAD:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/oportunidadesVencidas`,

                // Forrmulario Riesgo
                GET_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerFormularioRiesgo`,
                GET_PREGUNTAS_FORM_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPreguntasRiesgo`,

                // Visita
                GET_LISTA_RIESGOS_BY_IDS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerRiesgoResumenLista`,
                CREATE_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/guardarRiesgo`,
                GET_RIESGO: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerRiesgo`,
                GET_VIGENCIA_RIESGOS: `/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/formularioRiesgoVigente`,

                //tipoVisita
                GET_TIPO_VISITA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerTipoVisita`,

                //mostrar lista mensajes notificaciones
                GET_LISTA_MENSAJES_NOTIFICACIONES : `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/obtenerMensajes`,
                GET_CANT_MENSAJES_NO_LEIDOS : `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/obtenerCantidadMensajesNoLeidos`,
                MARCAR_MENSAJES_LEIDOS : `/ventas-y-servicios/ventas/ms-tubos-wholesalemobile-exp/${msTuboExp}/marcarMensajeLeido`,

                //Obtener Plataforma
                GET_OBTENER_PLATAFORMA:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPlataforma`,

                GET_OBTENER_PERIODOS:`/ventas-y-servicios/ventas/ms-visitasyoportunidades-neg/${versionQA}/obtenerPeriodos`
            }
    }

    return res
}
