<template>
  <div>
    <div class="header">
      <div>
        <router-link to="/home">Home</router-link>
      </div>
      <div class="right">
        <a href="">{{ user.first_name }} {{ user.last_name }}</a>
        <a @click.prevent="handleLogout">Logout</a>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
import ApiService from "../../helpers/ApiService";

export default {
  name: "AppLayout",
  async created() {
    await this.fetchAuthUser();
  },
  data() {
    return {
      user: {},
    };
  },
  methods: {
    async fetchAuthUser() {
      const res = await ApiService.get("user");

      this.user = await res.json();
    },
    async handleLogout() {
      const res = await ApiService.get("user");

      if (res.status === 200) {
        localStorage.removeItem("token");

        await this.$router.push({ name: "Auth" });
      }
    },
  },
};
</script>