import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    token: null,
    email: null,
    admin: null,
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getEmail(state) {
      return state.email;
    },
    getAdmin(state) {
      return state.admin;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setAdmin(state, admin) {
      state.admin = admin;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.email = null;
    }
  },
  //keby som chcel na backend
  actions: {
  },
  modules: {
  },
});
