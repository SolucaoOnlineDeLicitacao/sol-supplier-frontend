import dom from './dom'

const HEADER = 'X-CSRF-Token'

const data = {
  param: null,
  token: null
}

/**
 * Singleton para controle de CSRF token
 *
 * @type {Object}
 */
const csrf = {
  get HEADER() {
    return HEADER
  },

  get param() {
    if (!data.param) {
      data.param = dom.fetchMeta('csrf-param')
    }

    return data.param
  },

  get token() {
    if (!data.token) {
      data.token = dom.fetchMeta('csrf-token')
    }

    return data.token
  },

  set token(value) {
    dom.setMeta('csrf-token', value)
    data.token = value
  }
}

export default csrf


//
// TODO adicionar hooks de ajax (provável módulo http.js) para verificar
// falhas por motivo de CSRF! (estão retornando 422) (ex: outra aba se "autenticou")
//    Isso deve, provavelmente, disparar um recarregamento (navegacional)
// da página atual, para que o Rails atualiza o CSRF na <meta>.
//
