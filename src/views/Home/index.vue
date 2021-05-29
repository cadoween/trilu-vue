<template>
  <AppLayout>
    <div class="container">
      <div class="board-container">
        <div class="board-wrapper" v-for="board in boards" :key="board.id">
          <div
            @click.self="
              $router.push({ name: 'Board', params: { id: board.id } })
            "
            class="board"
          >
            <input
              v-if="board.isEditInputActive"
              :value="board.name"
              @keypress.enter="handleUpdateOrDelete(board, $event.target.value)"
              type="text"
              placeholder="Are you sure want to delete?"
              autofocus
            />
            <span v-else @click.prevent="board.isEditInputActive = true">{{
              board.name
            }}</span>
          </div>
        </div>
        <div class="board-wrapper">
          <div class="board new-board" @click.prevent="isAddInputActive = true">
            <input
              v-if="isAddInputActive"
              v-model="formData.name"
              @keypress.enter="handleStore"
              type="text"
              placeholder="New Board Name"
              autofocus
            />
            <span v-else>Create new board...</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from "../../components/Layouts/AppLayout";
import ApiService from "../../helpers/ApiService";

export default {
  name: "Home",
  components: { AppLayout },
  data() {
    return {
      boards: [],
      isAddInputActive: false,
      formData: {
        name: "",
      },
    };
  },
  async mounted() {
    await this.fetchBoards();
  },
  methods: {
    async fetchBoards() {
      const res = await ApiService.get("board");
      const data = await res.json();

      data.forEach((board) => (board.isEditInputActive = false));

      this.boards = data;
    },
    async handleStore() {
      const res = await ApiService.post("board", this.formData);

      if (res.status === 200) {
        this.isAddInputActive = false;
        this.formData.name = "";

        await this.fetchBoards();
      }
    },
    async handleUpdateOrDelete(board, value) {
      if (value !== "") {
        const res = await ApiService.put(`board/${board.id}`, {
          name: value,
        });

        if (res.status === 200) {
          await this.fetchBoards();

          board.isEditInputActive = false;
        }
      } else {
        const res = await ApiService.delete(`board/${board.id}`);

        if (res.status === 200) {
          await this.fetchBoards();
        } else {
          board.isEditInputActive = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
}

.board-container {
  flex: 1 1 100%;
  margin: 20px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  align-items: flex-start;
}

.board-container::after {
  content: "";
  flex: auto;
}

.board-wrapper {
  display: flex;
  flex: 0 0 25%;
  box-sizing: border-box;
  padding: 0.5em;
  cursor: pointer;
}

.board {
  flex: 1;
  padding: 1em;
  background: #248ea9;
  color: #ffe;
  font-weight: bold;
}

.new-board {
  background: #fafdcb;
  color: #248ea9;
}

.board input {
  width: 100%;
}
</style>
