import _ from '@/lib/lodash-ext'
import data from 'json-loader!yaml-loader!@/config/secrets.yml'

let secrets = _.merge({}, data.shared, data[process.env.NODE_ENV])

export default secrets
