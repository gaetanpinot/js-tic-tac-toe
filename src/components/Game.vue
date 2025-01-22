<script>
import {getGame, getUser, playGame} from "@/services/httpClient.js";
import {getUserIdentity} from "@/services/AuthProvider.js";

export default {
  name: "Game",

  props: {
    id: "",
  },

  data() {
    return {
      game: null,
      error: "",
      selectedBox: -1,
      player1Symbol: 'X',
      player2Symbol: 'O',
      player1: null,
      player2: null,
      pulling: null
    };
  },


  computed: {
    user() {
      return getUserIdentity();
    },
    isMyTurn() {
      return this.game.status === "in_progress" && this.game.currentPlayer === this.user.id;
    },
    mySymbol() {
      return this.player1.id === this.user.id ? this.player1Symbol : this.player2Symbol
    }
  },

  methods: {
    startPolling() {
      if (this.polling) return;
      this.polling = setInterval(this.refreshGame, 5000); // Poll every
    },
    stopPolling() {
      if (this.polling) {
        clearInterval(this.polling);
        this.polling = null;
      }
    },
    async refreshGame() {
      try {
        this.game = await getGame(this.id);
        this.player1 = await getUser(this.game.player1)
        this.player2 = await getUser(this.game.player2)
        if (game.status === "finished") {
          this.stopPolling()
        }
      } catch (e) {
        this.error = e.message;
      }
    },

    async handleJouer() {
      if (!(this.selectedBox > -1 && this.selectedBox < 9)) {
        return 0;
      }
      const row = Math.floor(this.selectedBox / 3)
      const col = this.selectedBox % 3
      try {
        await playGame(this.id, row, col)
        await this.refreshGame()
      } catch (e) {
        this.error = e.message;
      }

    }
  },
  async created() {
    await this.refreshGame();
    this.startPolling();
  },
  beforeUnmount() {
    this.stopPolling();
  },
};
</script>

<template>
  <h2>Partie</h2>
  <div v-if="game !== null" id="game">
    <p>N° {{ game.id }}</p>
    <p v-if="player1">Joueur 1: {{ player1.username }}, <b v-if="game.player1===user.id">Vous,</b> Joue:
      {{ player1Symbol }}</p>
    <p v-if="player2">Joueur 2: {{ player2.username }}, <b v-if="game.player2===user.id">Vous,</b> Joue:
      {{ player2Symbol }}</p>
    <!--    <p>Status: {{ game.status }}</p>-->
    <p class="status" id="yourTurn" v-if="isMyTurn">A vous de jouer</p>
    <p class="status" id="waiting" v-else-if="game.status==='waiting'">En attente d'un autre joueur</p>
    <p class="status" id="finished" v-else-if="game.status==='finished'">La partie est terminée, un joueur a gagné</p>
    <p class="status" id="finished" v-else-if="game.status==='draw'">La partie est terminée sur une égalité</p>
    <p class="status" id="waiting" v-else>Attendez</p>
    <!--    <p v-if="isMyTurn">Case selectionné: {{ selectedBox }}</p>-->
    <div id="board">
      <div class="case" v-for="(box,index) in game.board">
        <p v-if="box === game.player1 ">{{ player1Symbol }}</p>
        <p v-else-if="box !==null">{{ player2Symbol }}</p>
        <p v-else-if="index===selectedBox">{{ mySymbol }}</p>
        <input class="inputCase" type="radio" name="play" v-else-if="isMyTurn" :value="index"
               v-model="selectedBox"></input>
      </div>
    </div>
    <button v-if="isMyTurn && selectedBox>-1" @click="handleJouer">Jouer la case séléctionné</button>
  </div>
  <div v-else-if="error.length > 0">Erreur : {{ error }}</div>
  <div v-else>Chargement en cours</div>
</template>

<style scoped>

.case {
  aspect-ratio: 1;
  border: 2px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.inputCase {
  position: absolute;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  opacity: 0;
}

#board {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  align-self: center;
  width: 6em;
  gap: 0.2em;
}

.case {
  border: 1px solid black;
  width: 2em;
  height: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.3em;
  height: 2em;
  width: 50%;
}

#yourTurn {
  background-color: limegreen;
  color: white;
}

#waiting {
  background-color: orange;
  color: white;
}

#finished {
  background-color: #333333;
  color: white;
}
</style>
