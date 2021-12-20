import { string, object } from 'yup';

export const LOGIN_VALIDATION_SCHEMA = object().shape({
    username: string().required(),
    password: string().required(),
})

// export const OPORTUNITY_VALIDATION_SCHEMA =  object().shape({
//     cli_cliente_id: string.required(),
//     opt_fecha_fin_fec: string.required(),
//     tes_tipo_estado_id: string.required(),
//     usr_usuario_responsable_id: string.required(),
//     opt_monto_mto: string.required()
// })