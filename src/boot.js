import _ from '@/lib/lodash-ext'
import app from './app'


// making assets and css available to Webpack+Webpacker
import './assets'
import './styles.scss'

// loading app specific locales
import translations from './config/locales'
_.merge(app.i18n.translations, translations)

// loading app routes and router
import { routes, namespace } from './config/routes'
app.router = app.routerFactory.init(routes, { namespace, afterLoginRoute: 'home' })

// loading app specific components and initializers
import './components'
import './config/initializers'

// one-time setup event
app.$emit('app:setup')


export default app
