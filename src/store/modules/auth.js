import ApiService from "../../helpers/ApiService";

const state = {
  token: null,
  loginResponse: {},
};

const getters = {
  getLoginResponse: (state) => state.loginResponse,
};

const actions = {
  async doLogin({ commit }, loginData) {
    try {
      const response = await ApiService.post("auth/login", loginData);
      const data = await response.json();

      commit("setLoginResponse", { response, data });
    } catch (e) {
      commit("setLoginResponse", { response: e.response });
    }
  },
};

const mutations = {
  setLoginResponse: (state, { response, data }) => {
    state.loginResponse = response;

    if (data !== undefined) {
      state.token = data.token;
      localStorage.setItem("token", data.token);
    }
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
