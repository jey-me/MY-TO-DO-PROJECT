import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabaseClient'
import { useAuthStore } from './authStore'


export const useProjectStore = defineStore('projects', () => {
  const porjects = ref([])
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  // --- ACCIONES ---

  // 1. Obtener Tareas/Proyectos
  async function fetchTodos() {
    if (!authStore.user) {
      projects.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('projects')
        .select('*')      // 'id, created_at, title, task, complete, userid'
        .eq('userid', authStore.user.id)
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError
      projects.value = data || []
    } catch (e) {
      error.value = e.message
      console.error('Error fetching projects:', e.message)
    } finally {
      loading.value = false
    }
  }

  // 2. Agregar Tarea/Proyecto
  // El parámetro taskText será el contenido de tu columna 'task'
  async function addTodo(taskText, projectTitle = null) { // projectTitle es opcional
    if (!authStore.user || !taskText.trim()) return false

    loading.value = true
    error.value = null
    try {
      const newProjectData = {
        task: taskText.trim(),          // <<< Tu columna para el texto de la tarea
        userid: authStore.user.id,      // <<< Tu columna de usuario
        complete: false,                // <<< Tu columna de completado
      }
      if (projectTitle && projectTitle.trim() !== '') {
        newProjectData.title = projectTitle.trim(); // <<< Tu columna de título (opcional)
      }

      const { data, error: supabaseError } = await supabase
        .from('projects') // <<< Tu nombre de tabla
        .insert(newProjectData)
        .select()

      if (supabaseError) throw supabaseError

      if (data && data.length > 0) {
        projects.value.unshift(data[0])
      }
      return true
    } catch (e) {
      error.value = e.message
      console.error('Error adding project:', e.message)
      return false
    } finally {
      loading.value = false
    }
  }

  // 3. Marcar/Desmarcar Tarea/Proyecto
  async function toggleTodoStatus(todoId, currentStatus) {
    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('projects') // <<< Tu nombre de tabla
        .update({ complete: !currentStatus }) // <<< Tu columna de completado
        .eq('id', todoId)
        .select('id, complete') // Solo necesitamos el ID y el estado actualizado

      if (supabaseError) throw supabaseError

      if (data && data.length > 0) {
        const index = projects.value.findIndex(t => t.id === todoId)
        if (index !== -1) {
          projects.value[index].complete = data[0].complete // <<< Actualiza tu columna
        }
      }
    } catch (e) {
      error.value = e.message
      console.error('Error toggling project status:', e.message)
    } finally {
      loading.value = false
    }
  }

  // 4. Modificar Texto de Tarea/Proyecto
  // newText actualizará la columna 'task'
  async function updateTodoText(todoId, newText) {
    if (!newText.trim()) return

    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('projects') // <<< Tu nombre de tabla
        .update({ task: newText.trim() }) // <<< Tu columna de texto de tarea
        .eq('id', todoId)
        .select('id, task') // Solo necesitamos el ID y el texto actualizado

      if (supabaseError) throw supabaseError

      if (data && data.length > 0) {
        const index = projects.value.findIndex(t => t.id === todoId)
        if (index !== -1) {
          projects.value[index].task = data[0].task // <<< Actualiza tu columna
        }
      }
    } catch (e) {
      error.value = e.message
      console.error('Error updating project task text:', e.message)
    } finally {
      loading.value = false
    }
  }
  
  // (Opcional) Modificar Título del Proyecto
  async function updateTodoTitle(todoId, newTitle) {
    if (!newTitle.trim()) return;
    loading.value = true;
    error.value = null;
    try {
      const { data, error: supabaseError } = await supabase
        .from('projects')
        .update({ title: newTitle.trim() }) // <<< Tu columna de título
        .eq('id', todoId)
        .select('id, title');
      if (supabaseError) throw supabaseError;
      if (data && data.length > 0) {
        const index = projects.value.findIndex(t => t.id === todoId);
        if (index !== -1) {
          projects.value[index].title = data[0].title;
        }
      }
    } catch (e) {
      error.value = e.message;
      console.error('Error updating project title:', e.message);
    } finally {
      loading.value = false;
    }
  }


  // 5. Eliminar Tarea/Proyecto
  async function deleteTodo(todoId) {
    loading.value = true
    error.value = null
    try {
      const { error: supabaseError } = await supabase
        .from('projects') // <<< Tu nombre de tabla
        .delete()
        .eq('id', todoId)

      if (supabaseError) throw supabaseError

      projects.value = projects.value.filter(t => t.id !== todoId)
    } catch (e) {
      error.value = e.message
      console.error('Error deleting project:', e.message)
    } finally {
      loading.value = false
    }
  }

  function clearTodos() {
    projects.value = []
  }

  return {
    projects,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodoStatus,
    updateTodoText,
    updateTodoTitle,
    deleteTodo,
    clearTodos,
  }
})