import axios from 'axios'
import qs from 'qs'
import csrf from './csrf'
import loading from './loading'
import secrets from './secrets'
import auth from './auth'


// dados privados
const data = {
  count: 0
}

const router = axios.create({
  baseURL: secrets.api.host,
  paramsSerializer(params) {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  }
})

// Dizendo que somos XHR!
router.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

router.defaults.headers.common['Authorization'] = `Basic ${auth.clientCredentials}`

router.interceptors.request.use(
  // Antes de enviar a requisição, queremos:
  //   - enviar token CSRF
  //   - ativar estado de "carregamento" da app
  (config) => {
    // TODO: Enviando header de locale para i18n
    config.headers['Accept-Language'] = app.i18n.locale

    // Enviando headers de autenticação
    let token = auth.token
    if (token) config.headers['Authorization'] = `Bearer ${token}`


    loading.start()
    data.count++

    return config
  },

  // Quando houver erro no envio de requisição, queremos:
  //   - desativar estado de "carregamento" da app
  (error) => {
    loading.stop()
    data.count--

    // TODO integrar com módulo de notificações e/ou router!
    // Use `error.response.status` para verificar:
    // - 400 - bad_request - falha em preenchimento de dados
    // - 401 - unauthorized (não autenticado)
    // - 403 - forbidden (não tem permissão)
    // - 404 - not found
    // - 422 - falha de verificação CSRF e CORS
    // - 500 - internal server error

    return Promise.reject(error)
  }
)

router.interceptors.response.use(
  // Quando uma requisição for bem sucedida obtendo uma resposta, queremos:
  //   - desativar estado de "carregamento" da app
  (response) => {
    loading.stop()
    data.count--

    return response
  },

  // Quando houver erro no processamento de uma resposta, queremos:
  //   - desativar estado de "carregamento" da app
  (error) => {
    loading.stop()
    data.count--

    return Promise.reject(error)
  }
)


/**
 * Singleton para controle de requisições assíncronas (XHR).
 */
const http = {
  /**
   * Indica se há requisições em andamento
   * @return {Boolean} `true` se houver requisições em andamento
   */
  get active() {
    return data.count > 0
  },

  get host() {
    return secrets.api.host
  },

  // expondo o router, para permitir a inclusão de interceptors
  router,

  // aliases para os métodos HTTP (que enviam XHR)
  request: router.request,
  get:     router.get,
  post:    router.post,
  patch:   router.patch,
  delete:  router.delete
}

export default http
