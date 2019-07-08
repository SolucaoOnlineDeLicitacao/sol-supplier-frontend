import Vue from 'vue'
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import secrets from '@/lib/core/modules/secrets.js'

Sentry.init({
  dsn: secrets.sentry.dsn,
  integrations: [
    new Integrations.Vue({
      Vue,
      attachProps: true,
    }),
  ],
});
