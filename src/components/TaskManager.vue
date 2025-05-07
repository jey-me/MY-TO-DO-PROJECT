<template>
  <div>
    <h2>Gestor de Tareas</h2>
    <input
      v-model="newTask"
      placeholder="Añadir nueva tarea"
      @keyup.enter="addTask"
    />
    <button @click="addTask">Añadir Tarea</button>

    <table>
      <thead>
        <tr>
          <th>Tarea</th>
          <th>Completada</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, index) in tasks" :key="index">
          <td>
            <input v-model="task.name" :disabled="!task.editing" />
          </td>
          <td>
            <input type="checkbox" v-model="task.completed" />
          </td>
          <td>
            <button @click="editTask(index)">
              {{ task.editing ? "Guardar" : "Modificar" }}
            </button>
          </td>
          <td>
            <button @click="deleteTask(index)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newTask: "",
      tasks: [],
    };
  },
  methods: {
    addTask() {
      if (this.newTask.trim() !== "") {
        this.tasks.push({
          name: this.newTask,
          completed: false,
          editing: false,
        });
        this.newTask = "";
      }
    },
    editTask(index) {
      this.tasks[index].editing = !this.tasks[index].editing;
      if (!this.tasks[index].editing) {
        // Save the task when editing is done
        this.tasks[index].name = this.tasks[index].name.trim();
      }
    },
    deleteTask(index) {
      this.tasks.splice(index, 1);
    },
  },
};
</script>

<style scoped>
</style>
