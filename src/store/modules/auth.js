import ApiService from "../../helpers/ApiService";

const state = {
  token: null,
  loginResponse: {},
  registerResponse: {},
};

const getters = {
  getLoginResponse: (state) => state.loginResponse,
  getRegisterResponse: (state) => state.registerResponse,
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
  async doRegister({ commit }, registerData) {
    try {
      const response = await ApiService.post("auth/register", registerData);
      const data = await response.json();

      commit("setRegisterResponse", { response, data });
    } catch (e) {
      commit("setRegisterResponse", { response: e.response });
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
  setRegisterResponse: (state, { response, data }) => {
    state.registerResponse = response;

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
