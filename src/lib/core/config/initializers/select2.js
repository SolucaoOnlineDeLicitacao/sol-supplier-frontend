import Select2 from 'select2'
import Select2PtBr from 'select2/dist/js/i18n/pt-BR'

// Configuração padrão para Select2: "ocupe toda a largura".
// Facilita uso de Grid.
$.fn.select2.defaults.set('width', '100%')
$.fn.select2.defaults.set('language', Select2PtBr);
