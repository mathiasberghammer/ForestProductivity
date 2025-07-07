<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-stone-900 mb-3 tracking-tight">Task Manager</h1>
      <p class="text-xl text-stone-700 opacity-80">Organize your tasks by project and stay productive</p>
    </div>

    <!-- Folder Navigation -->
    <div class="mb-8">
      <div class="relative">
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
        <div class="relative z-10 p-6">
          <div class="flex items-center justify-between">
            <!-- Folder Tabs -->
            <div class="flex items-center gap-2 flex-1">
              <button
                v-for="folder in folders"
                :key="folder.id"
                @click="selectFolder(folder.id)"
                class="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium"
                :class="[
                  selectedFolderId === folder.id
                    ? 'bg-amber-500 text-stone-900 shadow-lg'
                    : 'bg-white/40 text-stone-700 hover:bg-white/60'
                ]"
              >
                <span class="text-lg">📁</span>
                <span>{{ folder.name }}</span>
                <span class="text-xs opacity-75">({{ getFolderTaskCount(folder.id) }})</span>
              </button>
            </div>

            <!-- Add Folder Button -->
            <div class="flex items-center gap-3">
              <div v-if="showAddFolder" class="flex items-center gap-2">
                <input
                  v-model="newFolderName"
                  @keyup.enter="addFolder"
                  @keyup.esc="cancelAddFolder"
                  placeholder="Folder name"
                  class="px-3 py-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm"
                  ref="folderInput"
                >
                <button
                  @click="addFolder"
                  class="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-3 rounded-xl transition-all duration-200 text-sm"
                >
                  Add
                </button>
                <button
                  @click="cancelAddFolder"
                  class="bg-white/60 hover:bg-white/80 text-stone-700 font-medium py-2 px-3 rounded-xl transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
              
              <button
                v-if="!showAddFolder"
                @click="startAddFolder"
                class="bg-white/40 hover:bg-white/60 text-stone-700 font-medium py-2 px-4 rounded-xl transition-all duration-200 text-sm flex items-center gap-2"
                title="Add New Folder"
              >
                <span class="text-lg">➕</span>
                <span>New Folder</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Folder Content -->
    <div v-if="selectedFolder" class="relative">
      <!-- Glass morphism background -->
      <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
      
      <div class="relative z-10 p-8">
        <!-- Folder Header -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-stone-800 shadow-lg">
              <span class="text-3xl">📁</span>
            </div>
            <div>
              <h2 class="text-3xl font-bold text-stone-900">{{ selectedFolder.name }}</h2>
              <div class="text-stone-600 mt-1">
                {{ getActiveTasks(selectedFolder.id).length }} active, 
                {{ getArchivedTasks(selectedFolder.id).length }} completed
              </div>
            </div>
          </div>
          
          <!-- Folder Actions -->
          <div class="flex items-center gap-3">
            <button
              @click="toggleArchive"
              class="flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 text-stone-700 rounded-xl transition-all duration-200 font-medium"
              :title="showingArchive ? 'Show Active Tasks' : 'Show Archive'"
            >
              <span class="text-lg">{{ showingArchive ? '📋' : '📦' }}</span>
              <span>{{ showingArchive ? 'Active' : 'Archive' }}</span>
            </button>
            <button
              @click="deleteFolder(selectedFolder.id)"
              class="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-200 font-medium"
              title="Delete Folder"
            >
              <span class="text-lg">🗑️</span>
              <span>Delete</span>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-3">
            <span class="text-lg font-medium text-stone-700">Progress</span>
            <span class="text-xl font-bold text-stone-900">{{ getFolderCompletionPercentage(selectedFolder.id) }}%</span>
          </div>
          <div class="w-full bg-stone-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              class="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500 shadow-sm"
              :style="{ width: getFolderCompletionPercentage(selectedFolder.id) + '%' }"
            ></div>
          </div>
        </div>

        <!-- Add Task Form -->
        <div v-if="!showingArchive" class="mb-8">
          <div class="flex items-center gap-3">
            <input
              v-model="newTaskTitle"
              @keyup.enter="addTask"
              :placeholder="`Add task to ${selectedFolder.name}...`"
              class="flex-1 p-3 bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-stone-900 placeholder-stone-600"
            >
            <input
              v-model="newTaskDueDate"
              type="date"
              class="p-3 bg-white/60 backdrop-blur-sm border border-white/60 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-stone-700"
              title="Due date (optional)"
            >
            <button
              @click="addTask"
              :disabled="!newTaskTitle?.trim()"
              class="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-stone-900 font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </div>

        <!-- Tasks List -->
        <div class="space-y-4">
          <!-- Active Tasks -->
          <div v-if="!showingArchive">
            <h3 class="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              Active Tasks
            </h3>
            
            <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              <TaskItem
                v-for="task in getActiveTasks(selectedFolder.id)"
                :key="task.id"
                :task="task"
                @update="updateTask"
                @delete="deleteTask"
              />
              
              <div v-if="getActiveTasks(selectedFolder.id).length === 0" class="text-center py-12 text-stone-600">
                <div class="text-6xl mb-4">✨</div>
                <p class="text-xl font-medium">No active tasks</p>
                <p class="text-stone-500 mt-2">Add your first task above!</p>
              </div>
            </div>
          </div>

          <!-- Archived Tasks -->
          <div v-if="showingArchive">
            <h3 class="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span>📦</span>
              Archived Tasks
            </h3>
            
            <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              <TaskItem
                v-for="task in getArchivedTasks(selectedFolder.id)"
                :key="task.id"
                :task="task"
                :is-archived="true"
                @update="updateTask"
                @delete="deleteTask"
              />
              
              <div v-if="getArchivedTasks(selectedFolder.id).length === 0" class="text-center py-12 text-stone-600">
                <div class="text-6xl mb-4">📦</div>
                <p class="text-xl font-medium">No completed tasks yet</p>
                <p class="text-stone-500 mt-2">Complete some tasks to see them here!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Folders or No Selection State -->
    <div v-if="!selectedFolder" class="text-center py-16">
      <div class="relative">
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
        <div class="relative z-10 p-12">
          <div v-if="folders.length === 0">
            <div class="text-8xl mb-6">📁</div>
            <h3 class="text-3xl font-bold text-stone-900 mb-4">No Folders Yet</h3>
            <p class="text-xl text-stone-700 mb-6">Create your first folder to organize your tasks</p>
            <p class="text-stone-600">Try creating folders like "Work", "Personal", or "Learning"</p>
          </div>
          <div v-else>
            <div class="text-8xl mb-6">👆</div>
            <h3 class="text-3xl font-bold text-stone-900 mb-4">Select a Folder</h3>
            <p class="text-xl text-stone-700">Choose a folder from the tabs above to view and manage your tasks</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue'
import TaskItem from './TaskItem.vue'

// Props and emits
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['task-created', 'task-updated', 'task-deleted', 'folder-created', 'folder-deleted'])

// Reactive state
const folders = ref([])
const newFolderName = ref('')
const showAddFolder = ref(false)
const selectedFolderId = ref(null)
const newTaskTitle = ref('')
const newTaskDueDate = ref('')
const showingArchive = ref(false)
const folderInput = ref(null)

// Load folders from localStorage on mount
const loadFolders = () => {
  const savedFolders = localStorage.getItem('taskFolders')
  if (savedFolders) {
    folders.value = JSON.parse(savedFolders)
  } else {
    // Create default folders
    folders.value = [
      { id: 'default', name: 'Personal', createdAt: new Date().toISOString() }
    ]
    saveFolders()
  }
}

// Save folders to localStorage
const saveFolders = () => {
  localStorage.setItem('taskFolders', JSON.stringify(folders.value))
}

// Computed properties
const selectedFolder = computed(() => {
  return folders.value.find(folder => folder.id === selectedFolderId.value) || null
})

const getFolderTaskCount = (folderId) => {
  const activeTasks = props.tasks.filter(task => task.folderId === folderId && !task.completed).length
  const completedTasks = props.tasks.filter(task => task.folderId === folderId && task.completed).length
  return `${activeTasks}/${activeTasks + completedTasks}`
}

const getFolderCompletionPercentage = (folderId) => {
  const folderTasks = props.tasks.filter(task => task.folderId === folderId)
  if (folderTasks.length === 0) return 0
  
  const completedTasks = folderTasks.filter(task => task.completed)
  return Math.round((completedTasks.length / folderTasks.length) * 100)
}

const getActiveTasks = (folderId) => {
  return props.tasks
    .filter(task => task.folderId === folderId && !task.completed)
    .sort((a, b) => {
      // Sort by due date, then by creation date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      } else if (a.dueDate) {
        return -1
      } else if (b.dueDate) {
        return 1
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
}

const getArchivedTasks = (folderId) => {
  return props.tasks
    .filter(task => task.folderId === folderId && task.completed)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
}

// Methods
const selectFolder = (folderId) => {
  selectedFolderId.value = folderId
  showingArchive.value = false
}

const startAddFolder = async () => {
  showAddFolder.value = true
  await nextTick()
  folderInput.value?.focus()
}

const cancelAddFolder = () => {
  showAddFolder.value = false
  newFolderName.value = ''
}

const addFolder = () => {
  if (!newFolderName.value.trim()) return

  const newFolder = {
    id: Date.now().toString(),
    name: newFolderName.value.trim(),
    createdAt: new Date().toISOString()
  }

  folders.value.push(newFolder)
  saveFolders()
  emit('folder-created', newFolder)

  // Auto-select the new folder
  selectedFolderId.value = newFolder.id
  
  // Reset form
  newFolderName.value = ''
  showAddFolder.value = false
}

const deleteFolder = (folderId) => {
  const folder = folders.value.find(f => f.id === folderId)
  if (!folder) return
  
  const folderTasks = props.tasks.filter(task => task.folderId === folderId)
  
  let message
  if (folderTasks.length > 0) {
    message = `Are you sure you want to delete "${folder.name}"?\n\nThis will permanently delete ${folderTasks.length} task${folderTasks.length !== 1 ? 's' : ''} in this folder.`
  } else {
    message = `Are you sure you want to delete "${folder.name}"?`
  }
  
  if (!confirm(message)) {
    return
  }
  
  // Delete all tasks in the folder
  folderTasks.forEach(task => deleteTask(task.id))

  folders.value = folders.value.filter(folder => folder.id !== folderId)
  saveFolders()
  emit('folder-deleted', folderId)
  
  // If we're deleting the selected folder, clear selection
  if (selectedFolderId.value === folderId) {
    selectedFolderId.value = folders.value.length > 0 ? folders.value[0].id : null
  }
}

const addTask = () => {
  if (!newTaskTitle.value?.trim() || !selectedFolderId.value) return

  const newTask = {
    title: newTaskTitle.value.trim(),
    folderId: selectedFolderId.value,
    dueDate: newTaskDueDate.value || null,
    completed: false,
    createdAt: new Date().toISOString()
  }

  emit('task-created', newTask)

  // Reset form
  newTaskTitle.value = ''
  newTaskDueDate.value = ''
}

const updateTask = (updatedTask) => {
  emit('task-updated', updatedTask)
}

const deleteTask = (taskId) => {
  emit('task-deleted', taskId)
}

const toggleArchive = () => {
  showingArchive.value = !showingArchive.value
}

// Initialize folders and select first one
const initializeFolders = () => {
  loadFolders()
  if (folders.value.length > 0) {
    selectedFolderId.value = folders.value[0].id
  }
}

// Initialize folders on mount
initializeFolders()
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(245, 158, 11, 0.3) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(245, 158, 11, 0.3);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(245, 158, 11, 0.5);
}
</style>