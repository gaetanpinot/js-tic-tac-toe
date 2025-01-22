<script>
export default {};
</script>

<template>
  <div id="app">
    <h1>Tic Tac Toe</h1>
    <nav>
      <RouterLink class="nav-link" to="/">Dashboard</RouterLink>
      <RouterLink class="nav-link" to="/register">Inscription</RouterLink>
      <RouterLink class="nav-link" to="/login">Connexion</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
    <footer>Tic Tac Toe par Gaëtan Pinot</footer>
  </div>
</template>

<style scoped>
footer {
  position: fixed;
  bottom: 0;
  background-color: white;
  height: 1.5em;
  width: 100%;
  text-align: center;
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

nav {
  justify-self: start;
}

main {
  width: 100%;
}
</style>
