<script>
import {
  getUserIdentity,
  isAuthenticated,
  removeToken,
} from "@/services/AuthProvider.js";
import GameList from "@/components/GameList.vue";

export default {
  components: { GameList },
  data() {
    return {};
  },
  computed: {
    username() {
      const userIdentity = getUserIdentity();
      if (userIdentity) {
        return userIdentity.username;
      }
      return null;
    },
  },
  methods: {
    logout() {
      removeToken();
      this.$router.push("/login");
    },
  },
};
</script>

<template>
  <div id="dashboard">
    <h1>Dashboard</h1>
    <p v-if="username">Utilisateur connécté: {{ username }}</p>
    <nav>
      <button @click="logout">Deconnexion</button>
      <RouterLink class="nav-link" to="/change"
        >Modifier mon profile
      </RouterLink>
    </nav>
    <main>
      <GameList></GameList>
    </main>
  </div>
</template>

<style scoped>
#dashboard {
  width: 100%;
}
</style>
