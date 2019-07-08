/* eslint no-console:0 */
import _ from '@/lib/lodash-ext'

// This file is loaded when you require the 'application' module:
//   - `import 'application'`
//   - `require('application')`
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


import app from './app'


// Para tornar as imagens - especialmente as não referenciadas pelos templates do Vue, mas usadas
// em e-mail - disponíveis ao webpack
import './assets'

// Para tornar o CSS disponível ao Webpack
//   - se estiver em um pack, ele será extraído pelo ExtractTextPlugin e incluido
//     no CSS ${pack}.css, sendo possível sua utilização via
//     `stylesheet_pack_tag ${pack}`
import './styles.scss'


// loading core locales
import translations from './config/locales'
_.merge(app.i18n.translations, translations)

// loading core components
import './components'

// loading core initializers
import './config/initializers'

// one-time setup event
app.$emit('core:setup')


export default app
