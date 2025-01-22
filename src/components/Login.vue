<script>
import { setToken } from "../services/AuthProvider.js";
import { login } from "../services/httpClient.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      if (!this.canLogin) {
        this.error = "Il manque le nom d'utilisateur ou le mot de passe";
        return;
      }
      try {
        const jsonLogin = await login(this.username, this.password);
        setToken(jsonLogin.token);
        this.$router.push("/");
      } catch (e) {
        this.error = e.message;
      }
    },
  },
  computed: {
    canLogin() {
      return this.username.length > 0 && this.password.length > 0;
    },
  },
};
</script>

<template>
  <h1>Connexion</h1>
  <p>Connectez vous pour pouvoir jouer au morpion</p>
  <input type="text" v-model="username" placeholder="Nom d'utilisateur" />
  <input type="password" v-model="password" placeholder="Mot de passe" />
  <button :class="{ unclickable: !canLogin }" @click="handleLogin">
    Connexion
  </button>
  <div class="error" v-if="error.length !== 0">
    {{ error }}
  </div>
</template>
<style scoped></style>
