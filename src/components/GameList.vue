<script>
import {
  createGame,
  deleteGame,
  getGames,
  joinGame,
} from "@/services/httpClient.js";
import { getUserIdentity } from "@/services/AuthProvider.js";

export default {
  data() {
    return {
      gameList: [],
      getGamesError: "",
      topError: "",
      joinedGame: null,
    };
  },
  async mounted() {
    try {
      this.gameList = await getGames();
    } catch (e) {
      this.getGamesError = e.message;
    }
  },
  computed: {
    user() {
      return getUserIdentity();
    },
  },
  methods: {
    async refreshGames() {
      try {
        this.gameList = await getGames();
      } catch (e) {
        this.getGamesError = e.message;
      }
    },
    async createGame() {
      try {
        let newGame = await createGame();
        await this.refreshGames();
      } catch (e) {
        this.topError = e.message;
      }
    },
    isJoinable(game) {
      return (
        (game.player1 === null || game.player2 === null) &&
        game.player1 !== this.user.id &&
        game.player2 !== this.user.id
      );
    },
    isCreator(game) {
      return game.creator === this.user.id;
    },
    async deleteGame(id) {
      try {
        await deleteGame(id);
        await this.refreshGames();
      } catch (e) {
        this.topError = e.message;
      }
    },
    async joinGame(id) {
      try {
        this.joinedGame = await joinGame(id);
        await this.refreshGames();
      } catch (e) {
        this.topError = e.message;
      }
    },
    isPlayer(game) {
      return game.player1 === this.user.id || game.player2 === this.user.id;
    },
    playGame(id) {
      this.$router.push("/game/" + id);
    },
  },
};
</script>

<template>
  <h2>Liste des parties</h2>
  <nav>
    <button id="create" @click="createGame">Créer une nouvelle partie</button>
  </nav>
  <div v-if="topError.length > 0">Erreur : {{ topError }}</div>
  <div id="game-list">
    <span v-for="game in gameList" v-if="gameList.length > 0">
      <p class="gameNum">Partie : {{ game.id }}</p>
      <button class="join" v-if="isJoinable(game)" @click="joinGame(game.id)">
        Rejoindre la partie
      </button>
      <button
        class="delete"
        @click="deleteGame(game.id)"
        v-if="isCreator(game)"
      >
        Supprimer la partie
      </button>
      <button class="play" v-if="isPlayer(game)" @click="playGame(game.id)">
        Jouer la partie
      </button>
    </span>
    <span v-else-if="getGamesError.length !== 0">
      {{ getGamesError }}
    </span>
    <span v-else> Pas de partie disponible </span>
  </div>
</template>

<style scoped>
#game-list {
  display: flex;
  flex-direction: column;
}

.gameNum {
  width: 60%;
}

span {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.5em;
  height: 2em;
  align-items: center;
}

#create {
  background-color: limegreen;
}

button {
  height: 2em;
  border: none;
  border-radius: 0.3em;
  margin: 0.5em;
}

span:nth-child(odd) {
  background-color: #cccccc;
}

.delete {
  background-color: darkred;
  color: white;
}

.join {
  background-color: orange;
}

span:nth-child(even) > .play {
  background-color: white;
}

.play {
  border: 1px solid black;
}
</style>
