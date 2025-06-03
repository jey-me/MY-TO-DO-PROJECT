
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabaseClient'
import { useAuthStore } from './authStore'


export const useTodoStore = defineStore('projects', () => {
  const todos = ref([]) 
  const loading = ref(false)
  const error = ref(null)
  const authStore = useAuthStore()

  // Mostrar tareas
  async function fetchTodos() {
    if (!authStore.user) {
      todos.value = []
      return
    }
    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('projects')
        .select('*')    
        .eq('userid', authStore.user.id)
        .order('created_at', { ascending: false }) 

      if (supabaseError) throw supabaseError
      todos.value = data || []
    } catch (e) {
      error.value = e.message
      console.error('Error fetching projects:', e.message)
    } finally {
      loading.value = false
    }
  }

// --- ACCIONES ---

  // Agregar Tarea

  async function addTodo(taskText, projectTitle = null) { 
    if (!authStore.user || !taskText.trim()) return false

    loading.value = true
    error.value = null
    try {
      const newProjectData = {
        task: taskText.trim(),          
        userid: authStore.user.id,      
        complete: false,                
      }
      if (projectTitle && projectTitle.trim() !== '') {
        newProjectData.title = projectTitle.trim(); 
      }

      const { data, error: supabaseError } = await supabase
        .from('projects') 
        .insert(newProjectData)
        .select()

      if (supabaseError) throw supabaseError

      if (data && data.length > 0) {
        todos.value.unshift(data[0])
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

  // Marcar tarea como completada
  async function toggleTodoStatus(todoId, currentStatus) {
    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('projects') 
        .update({ complete: !currentStatus }) 
        .eq('id', todoId)
        .select('id, complete') 

      if (supabaseError) throw supabaseError

      if (data && data.length > 0) {
        const index = todos.value.findIndex(t => t.id === todoId)
        if (index !== -1) {
          todos.value[index].complete = data[0].complete
        }
      }
    } catch (e) {
      error.value = e.message
      console.error('Error toggling project status:', e.message)
    } finally {
      loading.value = false
    }
  }

  // Modificar Tarea
  async function updateTodoText(todoId, newText) {
    if (!newText.trim()) return

    loading.value = true
    error.value = null
    try {
      const { data, error: supabaseError } = await supabase
        .from('projects') 
        .update({ task: newText.trim() }) 
        .eq('id', todoId)
        .select('id, task')

      if (supabaseError) throw supabaseError

      if (data && data.length > 0) {
        const index = todos.value.findIndex(t => t.id === todoId)
        if (index !== -1) {
          todos.value[index].task = data[0].task
        }
      }
    } catch (e) {
      error.value = e.message
      console.error('Error updating project task text:', e.message)
    } finally {
      loading.value = false
    }
  }
  
  // Eliminar Tarea
  async function deleteTodo(todoId) {
    loading.value = true
    error.value = null
    try {
      const { error: supabaseError } = await supabase
        .from('projects') 
        .delete()
        .eq('id', todoId)

      if (supabaseError) throw supabaseError

      todos.value = todos.value.filter(t => t.id !== todoId)
    } catch (e) {
      error.value = e.message
      console.error('Error deleting project:', e.message)
    } finally {
      loading.value = false
    }
  }

  function clearTodos() {
    todos.value = []
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodoStatus,
    updateTodoText,
    deleteTodo,
    clearTodos,
  }
})