<script>
import {
  getUserIdentity,
  removeToken,
  setToken,
} from "@/services/AuthProvider.js";
import { changeProfile, register } from "@/services/httpClient.js";

export default {
  name: "ModifierProfile",
  data() {
    return {
      newUsername: "",
      newPassword: "",
      newPasswordConfirm: "",
      error: "",
    };
  },
  computed: {
    username() {
      const userIdentity = getUserIdentity();
      if (userIdentity) {
        return userIdentity.username;
      }
      return null;
    },
    canChange() {
      return (
        this.newUsername.length > 0 &&
        this.newPassword.length > 0 &&
        this.newPassword === this.newPasswordConfirm
      );
    },
    methods: {},
    async handleChange() {
      try {
        if (!this.canChange) {
          this.error =
            "Il manque le nom d'utilisateur ou le mot de passe et la confirmation du mot de passe";
          return;
        }
        const registerJson = await changeProfile(
          this.newUsername,
          this.newPassword,
        );
        setToken(registerJson.user.token);
        this.$router.push("/");
      } catch (e) {
        this.error = e.message;
      }
    },
  },
};
</script>

<template>
  <div id="modifierProfile">
    <h1>Modifier mon profile</h1>
    <input type="text" v-model="newUsername" :placeholder="username" />
    <input
      type="password"
      v-model="newPassword"
      placeholder="Nouveau mot de passe"
    />
    <input
      type="password"
      v-model="newPasswordConfirm"
      placeholder="Confirmer le mot de passe"
    />
    <button :class="{ unclickable: !canChange }" @click="handleChange">
      Modifier
    </button>
    <div class="error" v-if="error.length !== 0">
      {{ error }}
    </div>
  </div>
</template>

<style scoped></style>
