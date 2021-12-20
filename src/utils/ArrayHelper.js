import * as _ from 'lodash'

export const idsArrayParse = (arr) => {
      return _.compact(_.map(arr, (a) => a || null))
}
