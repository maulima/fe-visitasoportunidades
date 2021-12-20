import { combineReducers } from 'redux'

import nav from './nav'
import auth from './auth'
import currentUser from './currentUser'
import gruposEconomicos from './gruposEconomicos'
import empresas from './empresas'
import colaboradores from './colaboradores'
import macroBancas from './macroBancas'
import obtenerPlataforma from './obtenerPlataforma'
import obtenerPeriodos from './obtenerPeriodos'
import estadosOportunidad from './estadosFormularioOportunidad'
import oportunidades from './oportunidades'
import formularioOportunidad from './formularioOportunidad'
import filtroOportunidades from './filtroOportunidades'
import visitas from './visitas'
import formularioVisita from './formularioVisita'
import filtroVisitas from './filtroVisitas'
import riesgos from './riesgos'
import formularioRiesgo from './formularioRiesgo'
import enroladorDevice from './enroladorDevice'
import mensajesNotificaciones from './mensajesNotificaciones';

const AppReducer = combineReducers({
    nav,
    auth,
    currentUser,
    gruposEconomicos,
    empresas,
    colaboradores,
    macroBancas,
    obtenerPlataforma,
    obtenerPeriodos,
    estadosOportunidad,
    oportunidades,
    formularioOportunidad,
    filtroOportunidades,
    visitas,
    formularioVisita,
    filtroVisitas,
    riesgos,
    formularioRiesgo,
    enroladorDevice,
    mensajesNotificaciones
})

export default AppReducer
