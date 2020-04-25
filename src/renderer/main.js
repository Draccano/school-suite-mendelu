import Vue from 'vue';
import axios from 'axios';

import App from './App';
import router from './router';
import store from './store';
import './assets/css/tailwind.css';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

import { ipcRenderer } from 'electron';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

export const messageBus = new Vue({});

Vue.use(Buefy);

new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app');

ipcRenderer.on('userInfoToShow', (event, data) => {
  messageBus.$emit('userInfoToShow', data);
});

ipcRenderer.on('hasAuthorizedUser', (event) => {
  messageBus.$emit('hasAuthorizedUser');
});

ipcRenderer.on('termAccesible', (event, item) => {
  messageBus.$emit('termAccesible', item);
});
ipcRenderer.on('termUnAccesible', (event, item) => {
  messageBus.$emit('termUnAccesible', item);
});
ipcRenderer.on('termRegistered', (event, item) => {
  messageBus.$emit('termRegistered', item);
});

ipcRenderer.on('errorLog', (event, item) => {
  messageBus.$emit('errorLog', item);
});
ipcRenderer.on('noTerms', (event) => {
  messageBus.$emit('noTerms');
});
