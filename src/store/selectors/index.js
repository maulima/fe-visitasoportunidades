import { createSelector } from 'reselect'
import { ListaEstadosIdOportunidad } from '../../constants/Data'
import { montoEntero } from '../../utils/StringHelper'
import moment from 'moment'
import _ from 'lodash'

const _getGruposEconomicosList = (state) => state.gruposEconomicos.lista
const _getEmpresasGruposEconomicosList = (state) => state.gruposEconomicos.empresas
const _getEmpresasList = (state) => state.empresas.lista
const _getOportunidadesList = (state) => state.oportunidades.lista
const _getMontoOportunidades = (state) => state.oportunidades.monto
const _getColaboradoresList = (state) => state.colaboradores.lista
const _getEstadosOportunidad = (state) => state.estadosOportunidad.lista
const _getFiltrosOportunidad = (state) => state.filtroOportunidades
const _getVisitasList = (state) => state.visitas.lista
const _getFiltrosVisita = (state) => state.filtroVisitas

export const getOportunidadesFiltradas: Array = createSelector(
    [_getOportunidadesList, _getMontoOportunidades, _getFiltrosOportunidad, _getColaboradoresList],
    (lista, monto, filters, colaboradores) => {
        const { fechaCierre, clienteId, estadoId, usuarioNTResponsable, respuestasId, respuestas } = filters
        let res = _.clone(lista)
        let resMonto = monto

        if (fechaCierre) res = _.filter(res, (o) => moment(o.fechaFin).format() === moment(moment(fechaCierre).format('YYYY-MM-DD')).format())
        if (estadoId) res = _.filter(res, (o) => ListaEstadosIdOportunidad[_.upperCase(o.nombreEstado)] === estadoId)
        if (clienteId) res = _.filter(res, (o) => o.rutEmpresa === clienteId)

        if (usuarioNTResponsable) {
            const colaborador = _.find(colaboradores, (col) => col.usuarioNt === usuarioNTResponsable)
            // res = _.filter(res, (o) => _.lowerCase(o.nombreResponsable) === _.lowerCase(colaborador.nombreColaborador))
        }

        if (!_.isEmpty(respuestasId)) {
            const respuesta = _.first(_.values(respuestas))
            const negocioRespuestaId = _.find(respuestasId, (rId) => !!respuesta[rId])
            
            if (negocioRespuestaId) {
                const respuestaNombre = _.lowerCase(respuesta[negocioRespuestaId].name)

                res = _.filter(res, (o) => _.lowerCase(o.negocio) === respuestaNombre)
            }
        }

        _.map(lista, (l) =>
            !_.find(res, (l2) => l.oportunidadId === l2.oportunidadId) ?
                resMonto -= Number(montoEntero(l.monto))
            :
                null
        )

        return {
            lista: _.sortBy(res, (o) => new Date(o.fechaFin)),
            monto: resMonto
        }
    }
)

export const getEmpresasLength: Array = createSelector(
    [_getEmpresasList],
    (lista) => {
        let count = 0
        Object.keys(lista || {}).map(key => {
            count++
        })

        return count
    }
)

export const getColaboradoresLength: Array = createSelector(
    [_getColaboradoresList],
    (lista) => {
        let count = 0
        Object.keys(lista || {}).map(key => {
            count++
        })

        return count
    }
)

export const getEstadoOportunidadActiva: Array = createSelector(
    [_getEstadosOportunidad],
    (lista) => {
        Object.keys(lista || {}).map((key, index) => {
            return index === 0 ? lista[key].id : 1
        })

        return 1
    }
)

export const getOportunidadesByEndDate: Array = createSelector(
    [_getOportunidadesList], (lista) => {
        let listaOrdenada = _.sortBy(lista, (dateObj) => {
            return new Date(dateObj.fechaFin)
        });

        return listaOrdenada
    }
)

export const getVisitasFiltradas: Array = createSelector(
    [_getVisitasList, _getFiltrosVisita], (lista, filters) => {
        const { fechaVisitaFin, fechaVisitaInicio, clienteId, respuestasId, respuestas } = filters
        let res = _.clone(lista)

        if (fechaVisitaFin && fechaVisitaInicio) {
            res = _.filter(res, (o) => {
                const fechaVisita = moment(o.fechaVisita).format()
                const fechaInicio = moment(moment(fechaVisitaInicio).format('YYYY-MM-DD')).format()
                const fechaFin = moment(moment(fechaVisitaFin).format('YYYY-MM-DD')).format()

                return fechaVisita >= fechaInicio && fechaVisita <= fechaFin
            })
        }

        if (clienteId) res = _.filter(res, (o) => o.rutEmpresa === clienteId)

        if (!_.isEmpty(respuestasId)) {
            const respuesta = _.first(_.values(respuestas))
            const respuestaNombre = _.lowerCase(respuesta[_.first(respuestasId)].name)

            res = _.filter(res, (o) => _.lowerCase(o.tituloVisita) === respuestaNombre)
        }

        return _.orderBy(res, [(o) => new Date(o.fechaVisita)], ['desc'])
    }
)
