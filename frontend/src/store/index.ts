import Vue from "vue";
import Vuex from "vuex";

import { clientStore } from './client.store.ts'

Vue.use(Vuex)
export const store = new Vuex.Store(clientStore)