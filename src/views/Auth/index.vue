<template>
  <GuestLayout>
    <div class="form">
      <header>Login</header>
      <form @submit.prevent="handleLogin">
        <input
          type="text"
          placeholder="Username"
          v-model="loginData.username"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="loginData.password"
        />
        <input type="submit" value="Login" />
      </form>
    </div>
    <div class="form">
      <header>Register</header>
      <form @submit.prevent="handleRegister">
        <input
          type="text"
          placeholder="First Name"
          v-model="registerData.first_name"
        />
        <input
          type="text"
          placeholder="Last Name"
          v-model="registerData.last_name"
        />
        <input
          type="text"
          placeholder="Username"
          v-model="registerData.username"
        />
        <input
          type="password"
          placeholder="Password"
          v-model="registerData.password"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          v-model="registerData.password_confirmation"
        />
        <input type="submit" value="Register" />
      </form>
    </div>
  </GuestLayout>
</template>

<script>
import GuestLayout from "../../components/Layouts/GuestLayout";
import ApiService from "../../helpers/ApiService";

export default {
  name: "index",
  components: { GuestLayout },
  data() {
    return {
      loginData: {
        username: "",
        password: "",
      },
      registerData: {
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        password_confirmation: "",
      },
    };
  },
  methods: {
    async handleLogin() {
      const res = await ApiService.post("auth/login", this.loginData);
      const data = await res.json();

      if (res.status === 200) {
        localStorage.setItem("token", data.token);

        await this.$router.push({ name: "Home" });
      }
    },
    async handleRegister() {
      if (
        this.registerData.password === this.registerData.password_confirmation
      ) {
        const res = await ApiService.post("auth/register", this.registerData);
        const data = await res.json();

        if (res.status === 200) {
          localStorage.setItem("token", data.token);

          await this.$router.push({ name: "Home" });
        }
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0px;
  padding: 0px;
  font-family: Arial;
}

.form {
  display: flex;
  margin: 5em;
  align-items: center;
  justify-content: center;
  flex-flow: column;
}

.form input {
  display: flex;
  margin: 0.5em;
  padding: 0.2em;
  font-size: 1.2em;
}

.form header {
  display: block;
  font-weight: bold;
  font-size: 1.5em;
}
</style>