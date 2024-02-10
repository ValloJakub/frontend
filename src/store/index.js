import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    userId: null,
    token: null,
    email: null,
    admin: null,
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getUserId(state) {
      return state.userId;
    },
    getEmail(state) {
      return state.email;
    },
    getAdmin(state) {
      return state.admin;
    },
  },
  mutations: {
    setUser(state,  user) {
      state.user = user;
      state.userId = user ? user.id : null;
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
    }
  },
  // V prípade posielania na backend
  actions: {
  },
  modules: {
  },
});
