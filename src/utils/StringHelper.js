const _ = require('lodash')

this.separador = '.'
this.sepDecimal = ','
this.simbol = ''

this.format = (num) => {
    num += ''
    var splitStr = num.split('.')
    var splitLeft = splitStr[0]
    var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : ''
    var regx = /(\d+)(\d{3})/
    while (regx.test(splitLeft)) {
        splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2')
    }
    return this.simbol + splitLeft + splitRight
}

export const formatoRut = (rut, sinPuntos = false) => {
    let rutActual = rut || ''
    let rutLimpio = rutActual.replace(/\./g, '').replace(/\-/g, '')

    if (rutActual.length < 2) {
        return rutActual
    } else {
        let res = ''
        let j = - 1
        if (rutLimpio.toString().length === 8) {
            rutLimpio = `0${rutLimpio}`
        }
        for (var i = rutLimpio.length - 1; i > - 1; i --) {

            if (j === - 1) {
                let dv = rutLimpio[i]
                res = `-${dv <= '9' && dv >= '0' ? dv : 'K'}`
            } else {
                let num = rutLimpio[i]
                res = `${num <= '9' && num >= '0' ? num : '1'}${!sinPuntos && j > 0 && j % 3 === 0 ? '.' : ''}${res}`
            }

            j ++
        }
        return res
    }
}

export const desformatoRut = (rut) => {
    let res = rut.replace(/\./g, '').replace('-', '')
    if (res.toString().length === 8) {
        res = `0${res}`
    }
    return res
}

export const getRutAndDv = (valueRut) => {
    let rut = valueRut.substr(0, valueRut.indexOf('-'))
    let dv = valueRut.split('-').pop()
    rut = rut.replace('.', '')

    return {
        rut: rut.replace('.', ''),
        dv: dv
    }
}

export const formatearMonto = (num, simbol) => {
    this.simbol = simbol || ''
    return num !== null ? this.format(num) : '-'
}

export const montoPuntosMil = (monto) => {
    if (monto) {
        let res = ''
        let count = 0
        let str = monto ? String(monto).replace(/\./g, '') : null

        for (var i = str.length - 1; i > - 1; i --) {
            if (count !== 0 && count % 3 == 0) {
                res = `.${res}`
            }

            res = `${str[i]}${res}`
            count += 1
        }

        return res
    } else {
        return null
    }
}

export const montoEntero = (monto) => {
    if (monto) {
        let res = monto.replace(/\D/g, '')

        return res
    } else {
        return null
    }
}

export const montoDecimal = (monto) => {
    if (monto) {
        let res = ''
        let aux = monto.replace(/\,/g, '.')
        let ptCount = 0

        for (var i = 0; i < aux.length; i ++) {
            const ch = aux[i]

            if (ch === '.') {
                if (ptCount === 0) {
                    res += ch
                }

                ptCount += 1
            } else if (ch >= '0' && ch <= '9') {
                res += ch
            }
        }

        return res
    } else {
        return null
    }
}

export const invalidInteger = (value) => {
    return !!_.find(String(value).replace(/\./g, ''), (ch) => ch < '0' || ch > '9')
}

export const invalidDecimal = (value) => {
    return !!_.find(String(value).replace(/\./g, '').replace(/\,/g, ''), (ch) => ch < '0' || ch > '9')
}

function parseParams(params, parentKey = undefined, lvl = 0) {
    let res = lvl === 0 ? '?' : ''
    const keys = Object.keys(params)
    const prevLvl = lvl - 1
    const container = prevLvl > 0 ? `[${parentKey}]` : prevLvl < 0 ? '' : parentKey

    for (var i = 0; i < keys.length; i ++) {
        const key = keys[i]
        const separator = i > 0 && res.length > 1 ? '&' : ''

        if (_.isArray(params[key])) {
            res += _.map(params[key], (a) => {
                return `${separator}${container}[${key}][]=${a}`
            }).join('&')
        } else if (typeof (params[key]) === 'object') {
            let parsedObject = parseParams(params[key], key, lvl + 1).split('&').join(`&${container}`)

            if (parsedObject) res += `${separator}${container}${parsedObject}`
        } else {
            let parsedValue = encodeURIComponent(params[key])

            if (parsedValue) res += `${separator}${container}${lvl > 0 ? `[${key}]` : key}=${encodeURIComponent(params[key])}`
        }
    }

    return res
}

export const urlWithParams = function (url, params) {
    return `${url}${parseParams(params)}`
}

// export const formatoMonto = (monto) => {
//     if (monto === undefined || monto === null) {
//         return ''
//     }
//
//     var montoActual = monto.replace(/^0+/, "")
//     const thousand_separator = '.';
//     var	number_string = montoActual.toString(),
//         rest 	  = number_string.length % 3,
//         result 	  = number_string.substr(0, rest),
//         thousands = number_string.substr(rest).match(/\d{3}/gi);
//
//     if (thousands) {
//         let separator = rest ? thousand_separator : '';
//         result += separator + thousands.join(thousand_separator);
//     }
//
//     return result
// }
