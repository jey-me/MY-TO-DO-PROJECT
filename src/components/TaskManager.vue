<template>
  <main class="task-manager">
    <h1>Mi Lista de Tareas</h1>

    <section class="add-new-task option-b">
      <div class="grid-input">
        <input
          v-model="newTaskText"
          placeholder="Añadir nueva tarea"
          @keyup.enter="handleAddTask"
          :disabled="projectStore.loading"
        />
        <button
          class="btn-add"
          @click="handleAddTask"
          :disabled="projectStore.loading || !newTaskText.trim()"
        >
          ➕
        </button>
      </div>
      <p v-if="addTaskError" class="error-message">{{ addTaskError }}</p>
    </section>

    <!-- Lista de tareas -->
    <ul v-if="projectStore.todos.length" class="task-list">
      <li
        v-for="item in projectStore.todos"
        :key="item.id"
        class="task-item"
        :class="{ completed: item.complete }"
      >
        <!-- Vista normal o edición inline -->
        <template v-if="!item.editing">
          <p class="task-text">{{ item.task }}</p>
          <div class="task-actions">
            <button
              @click="projectStore.toggleTodoStatus(item.id, item.complete)"
              class="action-btn"
            >
              {{ item.complete ? "↩️" : "✅" }}
            </button>
            <button @click="startEdit(item)" class="action-btn">✏️</button>
            <button @click="handleDeleteTask(item.id)" class="action-btn">
              ❌
            </button>
          </div>
        </template>
        <template v-else>
          <textarea
            v-model="item.editableTaskText"
            @input="autoResize"
            @keyup.enter="saveEdit(item)"
            @keyup.esc="cancelEdit(item)"
            class="edit-input"
            rows="1"
          ></textarea>
          <div class="task-actions">
            <button @click="saveEdit(item)" class="action-btn">💾</button>
            <button @click="cancelEdit(item)" class="action-btn">↩️</button>
          </div>
        </template>
      </li>
    </ul>

    <p
      v-if="
        !projectStore.loading &&
        !projectStore.todos.length &&
        !projectStore.error
      "
      class="no-tasks"
    >
      ¡No hay tareas pendientes!
    </p>
    <div v-if="projectStore.loading" class="loading-message">
      Cargando tareas...
    </div>
    <div v-if="projectStore.error" class="error-message">
      Error: {{ projectStore.error }}
    </div>
  </main>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useTodoStore } from "@/stores/projectsStore";
import { useAuthStore } from "@/stores/authStore";

const projectStore = useTodoStore();
const authStore = useAuthStore();

const newTaskText = ref("");
const addTaskError = ref(null);

watch(
  () => authStore.user,
  (user) => {
    if (user) projectStore.fetchTodos();
    else projectStore.clearTodos();
  },
  { immediate: true }
);

async function handleAddTask() {
  addTaskError.value = null;
  if (!newTaskText.value.trim()) {
    addTaskError.value = "La descripción de la tarea no puede estar vacía.";
    return;
  }
  const success = await projectStore.addTodo(newTaskText.value);
  if (success) newTaskText.value = "";
  else addTaskError.value = projectStore.error || "Error al agregar la tarea.";
}

function startEdit(item) {
  projectStore.todos.forEach((t) => (t.editing = false));
  item.editing = true;
  item.editableTaskText = item.task;
  nextTick(() => autoResize());
}

function autoResize(event) {
  const textarea =
    event?.target || document.querySelector(".task-edit textarea");
  if (textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
}

function cancelEdit(item) {
  item.editing = false;
}

async function saveEdit(item) {
  if (!item.editableTaskText.trim()) {
    alert("El texto no puede estar vacío.");
    return;
  }
  await projectStore.updateTodoText(item.id, item.editableTaskText.trim());
  if (projectStore.error) {
    alert("Error al guardar la tarea: " + projectStore.error);
  } else {
    item.task = item.editableTaskText.trim();
    item.editing = false;
  }
}

function handleDeleteTask(id) {
  if (confirm("¿Eliminar tarea?")) projectStore.deleteTodo(id);
}
</script>

<style scoped>
.task-manager {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  color: #eee;
  display: flex;
  flex-direction: column;
}

h1 {
  margin-bottom: 1rem;
}

.add-new-task {
  margin-bottom: 1rem;
}

.btn-add {
  background-color: #42b983;
  color: #fff;
  border: none;
  padding: 0.6em;
  cursor: pointer;
  font-size: 1.2em;
}

.btn-add:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  color: #f66;
  margin-top: 0.5rem;
}

.no-tasks {
  color: #aaa;
  font-style: italic;
}

.loading-message {
  color: #ccc;
}

.task-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0.75rem;
  border-bottom: 1px solid #444;
}

.task-text {
  margin: 0;
  text-align: left;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  opacity: 0.6;
}

.task-actions {
  flex-basis: 20%;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.edit-input {
  flex: 1;
  padding: 0.5em;
  background: #333;
  border: 1px solid #555;
  color: #eee;
  resize: vertical;
  min-height: 2em;
  overflow-wrap: break-word;
}

.option-b .grid-input {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
}

.option-b input {
  padding: 0.5em;
  background: #333;
  border: 1px solid #555;
  color: #eee;
}

.task-edit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

@media (max-width: 768px) {
  .task-item,
  .task-edit {
    flex-direction: column;
    align-items: flex-start;
  }
  .task-text,
  .edit-input {
    width: 100%;
  }
}
</style>
