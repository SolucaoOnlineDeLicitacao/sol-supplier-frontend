import NotFound from '@/components/not-found.vue'

import Login from '@/views/login.vue'
import Terms from '@/views/terms.vue'

import editProfile from '@/views/profile/edit.vue'
import editPassword from '@/views/password/edit.vue'

import Home from '@/views/home.vue'
import Map from '@/views/map.vue'

import Notifications from '@/views/notifications/index.vue'

import NewProvider from '@/views/providers/new.vue'

import Biddings from '@/views/biddings/index.vue'
import Bidding from '@/views/biddings/show.vue'

import Contracts from '@/views/contracts/index.vue'
import Contract from '@/views/contracts/show.vue'

import Lots from '@/views/biddings/lots/index.vue'
import Lot from '@/views/biddings/lots/show.vue'

import NewProposal from '@/views/biddings/lots/proposals/new.vue'
import EditProposal from '@/views/biddings/lots/proposals/edit.vue'

import GlobalLots from '@/views/biddings/lots/indexg.vue'
import NewLotProposal from '@/views/biddings/lots/lot_proposals/new.vue'
import EditLotProposal from '@/views/biddings/lots/lot_proposals/edit.vue'

import Proposals from '@/views/biddings/lots/proposals/index.vue'
import Proposal from '@/views/biddings/lots/proposals/show.vue'

import GlobalProposals from '@/views/biddings/proposals/index.vue'
import GlobalProposal from '@/views/biddings/proposals/show.vue'

const namespace = null

const routes = [
  {
    name:      'home',
    path:      '', // root
    component: Home,
    meta:      {
      auth:       true,
      transition: { name: 'slide-right' }
    }
  },

  {
    name:      'map',
    path:      '/map',
    component: Map,
    meta:      {
      auth:       true,
      transition: { name: 'slide-right' }
    }
  },

  // login
  // ----
  {
    name:      'login',
    path:      '/login',
    component: Login,
    meta:      {
      transition: { name: 'fade' }
    }
  },

  // terms
  // ----
  {
    name:      'terms',
    path:      '/terms',
    component: Terms,
    meta:      {
      transition: { name: 'fade' }
    }
  },

  // password
  // ----
  {
    name:      'editPassword',
    path:      '/password/edit',
    component: editPassword,
    meta:      {
      transition: { name: 'fade' }
    }
  },


  // profile
  // ----
  {
    name:      'editProfile',
    path:      '/profile',
    component: editProfile,
    meta:      {
      auth:       true,
      transition: { name: 'fade' }
    }
  },

  // notifications
  // ----
  {
    name:      'notifications',
    path:      '/notifications',
    component: Notifications,
    meta:      {
      auth:       true,
      transition: { name: 'slide-left' }
    }
  },

  // providers
  {
    name:      'newProvider',
    path:      '/providers/new',
    component: NewProvider,
    meta:      {
      auth:       false,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },


  // biddings
  // ----
  {
    name:      'biddings',
    path:      '/biddings',
    component: Biddings,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-right' }
    }
  },

  {
    name:      'bidding',
    path:      '/biddings/:id',
    component: Bidding,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },


  // contracts
  // ----
  {
    name:      'contracts',
    path:      '/contracts',
    component: Contracts,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-right' }
    }
  },

  {
    name:      'contract',
    path:      '/contracts/:id',
    component: Contract,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },


// lots
  {
    name:      'lots',
    path:      '/biddings/:bidding_id/lots',
    component: Lots,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },

  {
    name:      'lot',
    path:      '/biddings/:bidding_id/lots/:id',
    component: Lot,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },

// global lots
  {
    name:      'lotsg',
    path:      '/biddings/:bidding_id/lotsg',
    component: GlobalLots,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },

// globalProposals
  {
    name:      'globalProposals',
    path:      '/biddings/:bidding_id/proposals',
    component: GlobalProposals,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },
  {
    name:      'globalProposal',
    path:      '/biddings/:bidding_id/proposals/:id',
    component: GlobalProposal,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },
// proposals
  {
    name:      'proposals',
    path:      '/biddings/:bidding_id/lots/:lot_id/proposals',
    component: Proposals,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },
  {
    name:      'proposal',
    path:      '/biddings/:bidding_id/lots/:lot_id/proposals/:id',
    component: Proposal,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },
  {
    name:      'newProposal',
    path:      '/biddings/:bidding_id/lots/:lot_id/proposals/new',
    component: NewProposal,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },

  {
    name:      'editProposal',
    path:      '/biddings/:bidding_id/lots/:lot_id/proposals/:id/edit',
    component: EditProposal,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },

  {
    name:      'newLotProposal',
    path:      '/biddings/:bidding_id/lots/:lot_id/lot_proposals/new',
    component: NewLotProposal,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },

  {
    name:      'editLotProposal',
    path:      '/biddings/:bidding_id/lots/:lot_id/lot_proposals/:id/edit',
    component: EditLotProposal,
    meta:      {
      auth:       true,
      back:       true,
      transition: { name: 'slide-left' }
    }
  },

  // TODO componetnes específicos para rotas específicas!
  // Rails tem ErrorsController, com páginas dinâmicas em rotas específicas:
  // /401 - unauthorized (não autenticado)
  // /403 - forbidden (não tem permissão)
  // /404 - not found
  // /422 - falha de verificação CSRF e CORS
  // /500 - internal server error
  //

  // "catch-all" componente para rotas não encontradas (404):
  { path: '*', component: NotFound }
]


export { routes, namespace }
export default routes
