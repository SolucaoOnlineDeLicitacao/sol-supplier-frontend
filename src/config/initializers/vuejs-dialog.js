import VuejsDialog from "vuejs-dialog"
// import VuejsDialogMixin from "vuejs-dialog/vuejs-dialog-mixin.min.js" // only needed in custom components

// check better way to load css dependency
import '../../../node_modules/vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VuejsDialog, {
  okText: 'Continuar',
  cancelText: 'Cancelar'
})
