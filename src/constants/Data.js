export const FiltroOportunidad = {
    TIPO_NEGOCIOS: 'TIPO_NEGOCIOS',
    TIPO_PRODUCTOS: 'TIPO_PRODUCTOS',
    STATUS_OPORTUNIDAD: 'STATUS_OPORTUNIDAD'
};

export const ListaEstadosOportunidad = {
    ACTIVA: 'Activa',
    GANADA: 'Ganada',
    CANCELADA: 'Cancelada'
}

export const ListaEstadosIdOportunidad = {
    ACTIVA: 1,
    GANADA: 2,
    CANCELADA: 3
}

export const TipoBusqueda = {
    RESPONSABLE: 1,
    RUT_CLIENTE: 2,
    GRUPO_ECONOMICO: 3,
    EJECUTIVO: 4,
    MOTIVO_CANCELACION: 5,
    GRUPO_ECONOMICO_AGRUPADO: 6
}

export const TipoPregunta = {
    SIMPLE: 'simple',
    TABS: 'tabs',
    MULTIPLE: 'multiple',
    LIBRE: 'libre',
    ENTERO: 'entero',
    DECIMAL: 'decimal',
    MONEDA: 'moneda',
    CHECKBOX: 'checkbox',
    BOOLEAN: 'booleano',
    ESTRUCTURADO: 'usuario estructurado'
}

export const MotivoVisita = {
    VENTA: 'Venta',
    RIESGO: 'Riesgo',
    FUGA: 'Fuga'
}

export const BuildVersion = 'v1.9.12'
export const ApiEnv = 'qa_Azure'

export const ApiEnvironments = {
    dev: { name: 'Desarrollo' },
    ic: { name: 'Integración continua' },
    cert: { name: 'Certificación' },
    intApiConnect: { name: 'apiConnect Integración' },
    qaApiConnect: { name: 'apiConnect QA' },
    prodApiConnect: { name: 'Producción' },
    ic_Azure: { name: 'ic_Azure' },
    qa_Azure: { name: '*qa_Azure*' }
}

export const FeatureIc = 'bugfix-re-v3-1-0'
export const versionQA = 'v3.2'
export const msTuboExp = 'v1.1'
export const msEmpresaInformacionFinanciera = 'v3.0'
export const msGrupoEconomicoInformacionFinanciera = 'v3.0'
export const msDatosBasicosColaborador = 'v4.1'
export const msDatosCliente = 'v4.0'
export const msEnroladorDispositivo = 'v2.0'