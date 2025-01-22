<script>
import { register } from "@/services/httpClient.js";

export default {
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      error: "",
    };
  },
  computed: {
    canRegister() {
      return (
        this.username.length > 0 &&
        this.password.length > 0 &&
        this.password === this.confirmPassword
      );
    },
  },
  methods: {
    async handleRegister() {
      if (!this.canRegister) {
        this.error =
          "Il manque le nom d'utilisateur ou le mot de passe et sa confirmation";
        return;
      }
      try {
        const registerJson = await register(this.username, this.password);
        this.$router.push("/login");
      } catch (e) {
        this.error = e.message;
      }
    },
  },
};
</script>

<template>
  <div id="register">
    <h1>Inscription</h1>
    <p>Inscrivez vous pour pouvoir jouer au morpion</p>
    <p>
      <router-link class="nav-link" to="login">J'ai déjà un compte</router-link>
    </p>
    <input type="text" v-model="username" placeholder="Nom d'utilisateur" />
    <input type="password" v-model="password" placeholder="Mot de passe" />
    <input
      type="password"
      v-model="confirmPassword"
      placeholder="Confirmer le mot de passe"
    />
    <button :class="{ unclickable: !canRegister }" @click="handleRegister">
      Inscription
    </button>
    <div class="error" v-if="error.length !== 0">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
#register > * {
}
</style>
