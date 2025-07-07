<template>
  <div class="min-h-screen bg-stone-50 font-sans">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <nav class="w-80 bg-stone-800 border-r border-stone-700 p-6 flex flex-col">
        <!-- Logo Section -->
        <div class="flex items-center gap-3 mb-10 pb-6 border-b border-stone-600">
          <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-stone-800 shadow-lg">
            <svg viewBox="0 0 24 24" class="w-6 h-6">
              <path fill="currentColor" d="M12 2L8 8h8l-4-6z"/>
              <path fill="currentColor" d="M10 8L6 14h12l-4-6H10z" opacity="0.8"/>
              <rect x="11" y="14" width="2" height="8" fill="currentColor" opacity="0.6"/>
            </svg>
          </div>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-amber-100 leading-none">FocusForest</h1>
            <span class="text-sm text-amber-300 font-medium block mt-0.5">Productivity Studio</span>
          </div>
          <!-- Tiny Reset Button -->
          <button
            @click="confirmResetProfile"
            class="w-6 h-6 flex items-center justify-center rounded-lg bg-red-900 hover:bg-red-800 text-red-300 hover:text-red-200 transition-all duration-200 opacity-50 hover:opacity-100"
            title="Reset all data"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>

        <!-- Navigation -->
        <div class="flex-1 flex flex-col gap-2 mb-8">
          <router-link 
            v-for="item in navItems"
            :key="item.id"
            :to="{ name: item.id }"
            class="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 text-sm font-medium text-left group relative overflow-hidden"
            :class="[
              $route.name === item.id 
          ? 'bg-amber-600 text-stone-900 shadow-lg transform scale-105' 
          : focusing && $route.name === 'timer' && item.id !== 'timer'
            ? 'text-amber-200 opacity-50 cursor-not-allowed'
            : 'text-amber-200 hover:bg-stone-700 hover:translate-x-2 hover:shadow-md hover:text-amber-100'
            ]"
            @click="handleNavClick($event, item.id)"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0 z-10" />
            <span class="flex-1 z-10">{{ item.label }}</span>
            <!-- Active indicator -->
            <div 
              v-if="$route.name === item.id"
              class="absolute left-0 top-0 w-1 h-full bg-amber-400 rounded-r"
            ></div>
            <!-- Focus lock indicator -->
            <div 
              v-if="focusing && $route.name === 'timer' && $route.name !== item.id"
              class="absolute inset-0 bg-stone-900 bg-opacity-50 rounded-xl flex items-center justify-center"
            >
              <svg class="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
            </div>
          </router-link>
        </div>

        <!-- Focus Status Banner -->
        <div v-if="focusing && $route.name === 'timer'" class="mb-6 p-4 bg-amber-800 border border-amber-600 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            <div>
              <div class="text-sm font-bold text-amber-100">Focus Mode Active</div>
              <div class="text-xs text-amber-300">Navigation is locked during focus sessions</div>
            </div>
          </div>
        </div>

        <!-- Stats Panel -->
        <div class="border-t border-stone-600 pt-6">
          <h3 class="text-sm font-bold text-amber-100 mb-6 uppercase tracking-wider">Your Progress</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-stone-700 rounded-xl border border-stone-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-stone-600">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
                  <span class="text-green-200 text-sm">🌳</span>
                </div>
                <div>
                  <div class="text-xs text-amber-300 font-medium uppercase tracking-wider">Trees</div>
                  <div class="text-xl font-bold text-amber-100">{{ totalTrees }}</div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-stone-700 rounded-xl border border-stone-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-stone-600">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center">
                  <span class="text-amber-200 text-sm">⏰</span>
                </div>
                <div>
                  <div class="text-xs text-amber-300 font-medium uppercase tracking-wider">Hours</div>
                  <div class="text-xl font-bold text-amber-100">{{ totalFocusHours }}</div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between p-4 bg-stone-700 rounded-xl border border-stone-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-stone-600">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-orange-700 rounded-lg flex items-center justify-center">
                  <span class="text-orange-200 text-sm">✓</span>
                </div>
                <div>
                  <div class="text-xs text-amber-300 font-medium uppercase tracking-wider">Tasks</div>
                  <div class="text-xl font-bold text-amber-100">{{ completedTasksCount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 h-screen overflow-hidden bg-amber-500">
        <div class="h-full overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
          <router-view 
        :trees="trees"
        :tasks="tasks"
        @tree-grown="handleTreeGrown"
        @task-created="handleTaskCreated"
        @task-updated="handleTaskUpdated"
        @task-deleted="handleTaskDeleted"
        @task-completed="handleTaskCompleted"
        @focus-time-updated="handleFocusTimeUpdated"
        @focus-state-changed="handleFocusUpdated"
        @folder-created="handleFolderCreated"
        @folder-deleted="handleFolderDeleted"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Icon components
const TimerIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  `
}

const TasksIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  `
}

const ForestIcon = {
  template: `
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L8 8h8l-4-6z"/>
      <path d="M10 8L6 14h12l-4-6H10z" opacity="0.8"/>
      <rect x="11" y="14" width="2" height="8" opacity="0.6"/>
    </svg>
  `
}

// Reactive data
const trees = ref([])
const tasks = ref([])
const totalFocusTime = ref(0)
const focusing = ref(false)

// Navigation items
const navItems = [
  { id: 'timer', label: 'Focus Timer', icon: TimerIcon },
  { id: 'todos', label: 'Tasks', icon: TasksIcon },
  { id: 'forest', label: 'My Forest', icon: ForestIcon }
]

// Computed properties
const totalTrees = computed(() => trees.value.length)
const totalFocusHours = computed(() => Math.floor(totalFocusTime.value / 3600))

const todayTasksCount = computed(() => {
  return tasks.value.filter(task => !task.completed).length
})

const completedTasksCount = computed(() => {
  return tasks.value.filter(task => task.completed).length
})

// Navigation handler
const handleNavClick = (event, itemId) => {
  // Only block navigation if we're currently on the timer page AND actively focusing AND trying to go to a different page
  if (focusing.value && route.name === 'timer' && itemId !== 'timer') {
    event.preventDefault()
    event.stopPropagation()
    console.log('Navigation blocked - Focus mode is active')
    return false
  }
  // Otherwise, let the router-link handle navigation normally
}

// Profile reset functionality
const confirmResetProfile = () => {
  const confirmMessage = `⚠️ WARNING: This will permanently delete ALL your data:

• ${totalTrees.value} trees in your forest
• ${tasks.value.length} tasks (active and completed)  
• ${totalFocusHours.value} hours of focus time
• All folders and progress

This action cannot be undone. Are you absolutely sure?`

  if (confirm(confirmMessage)) {
    // Double confirmation for safety
    if (confirm("Last chance! Are you really sure you want to delete everything and start fresh?")) {
      resetProfile()
    }
  }
}

const resetProfile = async () => {
  try {
    // Clear all reactive data
    trees.value = []
    tasks.value = []
    totalFocusTime.value = 0
    focusing.value = false

    // Clear storage
    if (window.electronAPI) {
      await window.electronAPI.store.clear()
    } else {
      // Clear all localStorage items related to the app
      localStorage.removeItem('forestApp_trees')
      localStorage.removeItem('forestApp_tasks')
      localStorage.removeItem('forestApp_totalFocusTime')
      localStorage.removeItem('taskFolders')
      localStorage.removeItem('focusSessionHistory')
    }

    // Redirect to timer page
    if (route.name !== 'timer') {
      router.push({ name: 'timer' })
    }

    console.log('Profile reset successfully')
    alert('Profile reset successfully! Starting fresh.')
    
  } catch (error) {
    console.error('Error resetting profile:', error)
    alert('Error resetting profile. Please try again.')
  }
}

// Event handlers
const handleTreeGrown = (treeData) => {
  const newTree = {
    id: Date.now() + Math.random(),
    type: treeData.type || 'oak',
    grownAt: new Date().toISOString(),
    duration: treeData.duration || 0,
    source: treeData.source || 'timer',
    taskId: treeData.taskId || null
  }
  trees.value.push(newTree)
  saveData()
}

const handleTaskCreated = (taskData) => {
  const newTask = {
    id: Date.now() + Math.random(),
    title: taskData.title,
    folderId: taskData.folderId,
    dueDate: taskData.dueDate || null,
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString()
  }
  tasks.value.push(newTask)
  saveData()
}

const handleTaskUpdated = (updatedTask) => {
  const index = tasks.value.findIndex(task => task.id === updatedTask.id)
  if (index !== -1) {
    tasks.value[index] = { ...updatedTask }
    
    if (updatedTask.completed && !tasks.value[index].completedAt) {
      tasks.value[index].completedAt = new Date().toISOString()
    }
    
    saveData()
  }
}

const handleTaskDeleted = (taskId) => {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
  saveData()
}

// Handle task completion from focus timer
const handleTaskCompleted = (taskId) => {
  console.log('Task completed from focus timer:', taskId)
  
  const taskIndex = tasks.value.findIndex(task => task.id === taskId)
  if (taskIndex !== -1) {
    // Mark the task as completed
    tasks.value[taskIndex] = {
      ...tasks.value[taskIndex],
      completed: true,
      completedAt: new Date().toISOString()
    }
    
    console.log('Task marked as completed:', tasks.value[taskIndex])
    saveData()
    
    // Optional: Show a success message
    showTaskCompletionMessage(tasks.value[taskIndex].title)
  }
}

// Optional: Show completion message
const showTaskCompletionMessage = (taskTitle) => {
  // You can implement a toast notification here if you want
  console.log(`Task "${taskTitle}" has been moved to archive!`)
}

// Fixed focus handling - expecting a boolean value, not an object
const handleFocusUpdated = (isFocusing) => {
  console.log('Focus state updated:', isFocusing)
  focusing.value = isFocusing
  saveData()
}

const handleFocusTimeUpdated = (seconds) => {
  totalFocusTime.value += seconds
  saveData()
}

// Folder event handlers
const handleFolderCreated = (folderData) => {
  // Folders are managed in the TodoList component, no action needed here
  console.log('Folder created:', folderData)
}

const handleFolderDeleted = (folderId) => {
  // Remove any tasks that belonged to the deleted folder
  tasks.value = tasks.value.filter(task => task.folderId !== folderId)
  saveData()
  console.log('Folder deleted:', folderId)
}

// Data persistence
const saveData = async () => {
  try {
    if (window.electronAPI) {
      await window.electronAPI.store.set('trees', trees.value)
      await window.electronAPI.store.set('tasks', tasks.value)
      await window.electronAPI.store.set('totalFocusTime', totalFocusTime.value)
    } else {
      localStorage.setItem('forestApp_trees', JSON.stringify(trees.value))
      localStorage.setItem('forestApp_tasks', JSON.stringify(tasks.value))
      localStorage.setItem('forestApp_totalFocusTime', totalFocusTime.value.toString())
    }
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const loadData = async () => {
  try {
    if (window.electronAPI) {
      const savedTrees = await window.electronAPI.store.get('trees') || []
      const savedTasks = await window.electronAPI.store.get('tasks') || []
      const savedFocusTime = await window.electronAPI.store.get('totalFocusTime') || 0
      
      trees.value = savedTrees
      tasks.value = savedTasks
      totalFocusTime.value = savedFocusTime
    } else {
      const savedTrees = localStorage.getItem('forestApp_trees')
      const savedTasks = localStorage.getItem('forestApp_tasks')
      const savedFocusTime = localStorage.getItem('forestApp_totalFocusTime')
      
      if (savedTrees) trees.value = JSON.parse(savedTrees)
      if (savedTasks) tasks.value = JSON.parse(savedTasks)
      if (savedFocusTime) totalFocusTime.value = parseInt(savedFocusTime)
    }
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

// Global navigation guard
onMounted(() => {
  loadData()
  
  // Add a global router guard to prevent navigation during focus
  router.beforeEach((to, from, next) => {
    // Only block navigation if we're currently on the timer page AND actively focusing
    if (focusing.value && from.name === 'timer' && to.name !== from.name) {
      console.log('Router guard blocking navigation from timer while focusing')
      next(false) // Block navigation
    } else {
      next() // Allow navigation
    }
  })
})

</script>