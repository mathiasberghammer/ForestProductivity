<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-5xl font-bold text-stone-900 mb-3 tracking-tight">Task Manager</h1>
      <p class="text-xl text-stone-700 opacity-80">Organize your tasks by project and stay productive</p>
    </div>

    <!-- Folder Navigation -->
    <div class="mb-6">
      <div class="relative">
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl"></div>
        <div class="relative z-10 p-4">
          <div class="flex items-center justify-between">
            <!-- Folder Tabs -->
            <div class="flex items-center gap-2 flex-1 overflow-x-auto">
              <button
                v-for="folder in folders"
                :key="folder.id"
                @click="selectFolder(folder.id)"
                class="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium whitespace-nowrap"
                :class="[
                  selectedFolderId === folder.id
                    ? 'text-stone-900 shadow-lg'
                    : 'text-stone-700 hover:bg-white/60'
                ]"
                :style="{ 
                  backgroundColor: selectedFolderId === folder.id 
                    ? getFolderColor(folder).bg 
                    : 'rgba(255, 255, 255, 0.4)' 
                }"
              >
                <span class="text-sm">{{ getFolderColor(folder).emoji }}</span>
                <span class="text-sm">{{ folder.name }}</span>
                <span class="text-xs opacity-75">({{ getFolderTaskCount(folder.id) }})</span>
              </button>
            </div>

            <!-- Add Folder Button -->
            <div class="flex items-center gap-3 ml-4">
              <div v-if="showAddFolder" class="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-white/60">
                <input
                  v-model="newFolderName"
                  @keyup.enter="addFolder"
                  @keyup.esc="cancelAddFolder"
                  placeholder="Folder name"
                  class="px-2 py-1 bg-white/60 border border-white/40 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm min-w-32"
                  ref="folderInput"
                >
                
                <!-- Color Selector -->
                <div class="flex items-center gap-1">
                  <button
                    v-for="color in folderColors"
                    :key="color.value"
                    @click="newFolderColor = color.value"
                    class="w-5 h-5 rounded-lg border-2 transition-all duration-200 hover:scale-110"
                    :class="[
                      newFolderColor === color.value 
                        ? 'border-stone-800 ring-2 ring-stone-400' 
                        : 'border-white/60'
                    ]"
                    :style="{ backgroundColor: color.bg }"
                    :title="color.name"
                  >
                    <span class="text-xs">{{ color.emoji }}</span>
                  </button>
                </div>
                
                <button
                  @click="addFolder"
                  class="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-1 px-2 rounded-lg transition-all duration-200 text-sm"
                >
                  Add
                </button>
                <button
                  @click="cancelAddFolder"
                  class="bg-white/60 hover:bg-white/80 text-stone-700 font-medium py-1 px-2 rounded-lg transition-all duration-200 text-sm"
                >
                  Cancel
                </button>
              </div>
              
              <button
                v-if="!showAddFolder"
                @click="startAddFolder"
                class="bg-white/40 hover:bg-white/60 text-stone-700 font-medium py-2 px-3 rounded-xl transition-all duration-200 text-sm flex items-center gap-2"
                title="Add New Folder"
              >
                <span class="text-sm">➕</span>
                <span>New</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Folder Content -->
    <div v-if="selectedFolder" class="relative">
      <!-- Glass morphism background -->
      <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl"></div>
      
      <div class="relative z-10 p-6">
        <!-- Folder Header -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center text-stone-800 shadow-lg"
              :style="{ backgroundColor: getFolderColor(selectedFolder).bg }"
            >
              <span class="text-2xl">{{ getFolderColor(selectedFolder).emoji }}</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-stone-900">{{ selectedFolder.name }}</h2>
              <div class="text-stone-600 text-sm">
                {{ getActiveTasks(selectedFolder.id).length }} active, 
                {{ getArchivedTasks(selectedFolder.id).length }} completed
              </div>
            </div>
          </div>
          
          <!-- Folder Actions -->
          <div class="flex items-center gap-2">
            <button
              v-if="!showingArchive && !showingGoals"
              @click="openAddTaskPopup"
              class="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 rounded-xl transition-all duration-200 font-medium text-sm"
              title="Add New Tasks"
            >
              <span>➕</span>
              <span>Add Tasks</span>
            </button>
            <button
              @click="toggleGoals"
              class="flex items-center gap-2 px-3 py-2 bg-white/40 hover:bg-white/60 text-stone-700 rounded-xl transition-all duration-200 font-medium text-sm"
              :class="{ 'bg-blue-500 text-white': showingGoals }"
              :title="showingGoals ? 'Show Tasks' : 'Show Goals'"
            >
              <span>{{ showingGoals ? '📋' : '🎯' }}</span>
              <span>{{ showingGoals ? 'Tasks' : 'Goals' }}</span>
            </button>
            <button
              @click="toggleArchive"
              class="flex items-center gap-2 px-3 py-2 bg-white/40 hover:bg-white/60 text-stone-700 rounded-xl transition-all duration-200 font-medium text-sm"
              :class="{ 'bg-stone-500 text-white': showingArchive }"
              :title="showingArchive ? 'Show Active Tasks' : 'Show Archive'"
            >
              <span>{{ showingArchive ? '📋' : '📦' }}</span>
              <span>{{ showingArchive ? 'Active' : 'Archive' }}</span>
            </button>
            <button
              @click="deleteFolder(selectedFolder.id)"
              class="flex items-center gap-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-200 font-medium text-sm"
              title="Delete Folder"
            >
              <span>🗑️</span>
            </button>
          </div>
        </div>

        <!-- Compact Weekly Navigation -->
        <div v-if="!showingGoals && !showingArchive" class="mb-6">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-amber-100/50 via-amber-50/30 to-amber-100/50 rounded-xl border border-amber-200/60 shadow-md"></div>
            <div class="relative z-10 p-4">
              <div class="flex items-center justify-between">
                <button
                  @click="previousWeek"
                  class="group flex items-center gap-2 px-3 py-2 bg-white/60 hover:bg-white/80 rounded-lg transition-all duration-300 text-stone-700 hover:text-stone-900 shadow-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  <span class="font-medium text-sm">Previous</span>
                </button>
                
                <div class="text-center px-4">
                  <h3 class="text-lg font-bold text-stone-900">{{ currentWeekLabel }}</h3>
                  <p class="text-xs text-stone-600 font-medium">{{ currentWeekDateRange }}</p>
                </div>
                
                <button
                  @click="nextWeek"
                  class="group flex items-center gap-2 px-3 py-2 bg-white/60 hover:bg-white/80 rounded-lg transition-all duration-300 text-stone-700 hover:text-stone-900 shadow-sm"
                >
                  <span class="font-medium text-sm">Next</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="!showingGoals && !showingArchive" class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-stone-700">Weekly Progress</span>
            <span class="text-lg font-bold text-stone-900">{{ getCurrentWeekCompletionPercentage() }}%</span>
          </div>
          <div class="w-full bg-stone-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              class="h-full rounded-full transition-all duration-500 shadow-sm"
              :style="{ 
                width: getCurrentWeekCompletionPercentage() + '%',
                backgroundColor: getFolderColor(selectedFolder).bg
              }"
            ></div>
          </div>
        </div>

        <!-- Goals View -->
        <div v-if="showingGoals" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-bold mb-3 text-stone-700 flex items-center gap-2">
                <span>🎯</span>
                Long-term Goals
              </h3>
              <textarea 
                v-model="selectedFolder.goals" 
                @change="saveFolders"
                class="w-full p-4 border-stone-300 border bg-white/60 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none" 
                rows="6" 
                placeholder="e.g., Launch new feature, Finalize Q3 report..."
              ></textarea>
            </div>
            <div>
              <h3 class="font-bold mb-3 text-stone-700 flex items-center gap-2">
                <span>💡</span>
                Primary Focus Areas
              </h3>
              <textarea 
                v-model="selectedFolder.focus" 
                @change="saveFolders"
                class="w-full p-4 border-stone-300 border bg-white/60 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none" 
                rows="6" 
                placeholder="e.g., Content Creation, SEO Optimization..."
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Tasks List -->
        <div v-if="!showingGoals" class="space-y-3">
          <!-- Active Tasks -->
          <div v-if="!showingArchive">
            <h3 class="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span>📋</span>
              {{ currentWeekLabel }} Tasks
            </h3>
            
            <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              <TaskItem
                v-for="(task, index) in getCurrentWeekActiveTasks()"
                :key="task.id"
                :task="task"
                :all-tasks="tasks"
                @update="updateTask"
                @delete="deleteTask"
                @create-subtask="createSubtask"
                @update-subtask="updateSubtask"
                @delete-subtask="deleteSubtask"
                @move-up="() => moveTaskUp(task.id, index)"
                @move-down="() => moveTaskDown(task.id, index)"
              />
              
              <div v-if="getCurrentWeekActiveTasks().length === 0" class="text-center py-12 text-stone-600">
                <div class="text-6xl mb-4">✨</div>
                <p class="text-lg font-medium">No tasks for this week</p>
                <p class="text-stone-500 text-sm mt-2">Click "Add Tasks" to get started!</p>
              </div>
            </div>
          </div>

          <!-- Archived Tasks -->
          <div v-if="showingArchive">
            <h3 class="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <span>📦</span>
              Archived Tasks
            </h3>
            
            <div class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              <TaskItem
                v-for="task in getArchivedTasks(selectedFolder.id)"
                :key="task.id"
                :task="task"
                :all-tasks="tasks"
                :is-archived="true"
                @update="updateTask"
                @delete="deleteTask"
                @unarchive="unarchiveTask"
              />
              
              <div v-if="getArchivedTasks(selectedFolder.id).length === 0" class="text-center py-12 text-stone-600">
                <div class="text-6xl mb-4">📦</div>
                <p class="text-lg font-medium">No completed tasks yet</p>
                <p class="text-stone-500 text-sm mt-2">Complete some tasks to see them here!</p>
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

    <!-- Add Task Popup -->
    <div v-if="showAddTaskPopup" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white/95 backdrop-blur-md rounded-2xl border border-white/60 shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <!-- Popup Header -->
        <div class="p-6 border-b border-stone-200">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-stone-900 flex items-center gap-2">
              <span class="text-lg">{{ getFolderColor(selectedFolder).emoji }}</span>
              Add Tasks to {{ selectedFolder.name }}
            </h3>
            <button
              @click="closeAddTaskPopup"
              class="text-stone-400 hover:text-stone-600 transition-colors"
            >
              <span class="text-xl">✕</span>
            </button>
          </div>
          <div class="mt-2 text-sm text-stone-600">
            Adding to: {{ currentWeekLabel }} ({{ currentWeekDateRange }})
          </div>
        </div>

        <!-- Popup Content -->
        <div class="p-6 max-h-96 overflow-y-auto">
          <!-- Task Input Form -->
          <div class="space-y-4 mb-6">
            <input
              v-model="newTaskTitle"
              @keyup.enter="addTaskToPopup"
              placeholder="Enter task title..."
              class="w-full p-3 bg-white/80 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-stone-900 placeholder-stone-500"
              ref="taskInput"
            >
            <div class="flex gap-3">
              <input
                v-model="newTaskDueDate"
                type="date"
                class="flex-1 p-3 bg-white/80 border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-stone-700"
                title="Due date (optional)"
                placeholder="Optional due date"
              >
              <button
                @click="addTaskToPopup"
                :disabled="!newTaskTitle?.trim()"
                class="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-stone-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          <!-- Pending Tasks List -->
          <div v-if="pendingTasks.length > 0" class="space-y-3">
            <h4 class="text-sm font-medium text-stone-700 mb-3">Tasks to be added:</h4>
            <div class="space-y-2">
              <div
                v-for="(task, index) in pendingTasks"
                :key="index"
                class="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-200"
              >
                <div class="flex-1">
                  <div class="font-medium text-stone-900">{{ task.title }}</div>
                  <div v-if="task.dueDate" class="text-sm text-stone-600">
                    Due: {{ formatDate(task.dueDate) }}
                  </div>
                </div>
                <button
                  @click="removePendingTask(index)"
                  class="text-red-500 hover:text-red-700 transition-colors ml-2"
                  title="Remove task"
                >
                  <span class="text-sm">✕</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="pendingTasks.length === 0" class="text-center py-8 text-stone-500">
            <div class="text-4xl mb-2">📝</div>
            <p>Start adding tasks above</p>
          </div>
        </div>

        <!-- Popup Footer -->
        <div class="p-6 border-t border-stone-200 bg-stone-50/50">
          <div class="flex items-center justify-between">
            <span class="text-sm text-stone-600">
              {{ pendingTasks.length }} task{{ pendingTasks.length !== 1 ? 's' : '' }} ready
            </span>
            <div class="flex gap-3">
              <button
                @click="closeAddTaskPopup"
                class="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="saveAllTasks"
                :disabled="pendingTasks.length === 0"
                class="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-stone-900 font-medium py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
              >
                Save All Tasks
              </button>
            </div>
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
const newFolderColor = ref('blue')
const showAddFolder = ref(false)
const selectedFolderId = ref(null)
const newTaskTitle = ref('')
const newTaskDueDate = ref('')
const showingArchive = ref(false)
const showingGoals = ref(false)
const folderInput = ref(null)
const currentWeekOffset = ref(0) // 0 = current week, -1 = previous week, 1 = next week
const taskOrder = ref({}) // Store custom task ordering per folder

const showAddTaskPopup = ref(false)
const pendingTasks = ref([])
const taskInput = ref(null)

// Folder color options
const folderColors = [
  { name: 'Blue', value: 'blue', bg: '#3B82F6', emoji: '📘' },
  { name: 'Green', value: 'green', bg: '#10B981', emoji: '📗' },
  { name: 'Purple', value: 'purple', bg: '#8B5CF6', emoji: '📜' },
  { name: 'Orange', value: 'orange', bg: '#F97316', emoji: '📙' },
  { name: 'Red', value: 'red', bg: '#EF4444', emoji: '📕' },
  { name: 'Yellow', value: 'yellow', bg: '#EAB308', emoji: '📒' },
  { name: 'Teal', value: 'teal', bg: '#14B8A6', emoji: '📚' }
]

// Week navigation computed properties
const currentWeekStart = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() - date.getDay() + (currentWeekOffset.value * 7))
  return date.toISOString().split('T')[0]
})

const currentWeekEnd = computed(() => {
  const date = new Date(currentWeekStart.value)
  date.setDate(date.getDate() + 6)
  return date.toISOString().split('T')[0]
})

const currentWeekLabel = computed(() => {
  if (currentWeekOffset.value === 0) return 'This Week'
  if (currentWeekOffset.value === -1) return 'Last Week'
  if (currentWeekOffset.value === 1) return 'Next Week'
  if (currentWeekOffset.value < 0) return `${Math.abs(currentWeekOffset.value)} Weeks Ago`
  return `${currentWeekOffset.value} Weeks Ahead`
})

const currentWeekDateRange = computed(() => {
  const start = new Date(currentWeekStart.value)
  const end = new Date(currentWeekEnd.value)
  const options = { month: 'short', day: 'numeric' }
  return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}`
})

const getWeekNumber = () => {
  const start = new Date(currentWeekStart.value)
  const startOfYear = new Date(start.getFullYear(), 0, 1)
  const diff = start - startOfYear
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000))
}

// Load folders from localStorage on mount
const loadFolders = () => {
  const savedFolders = localStorage.getItem('taskFolders')
  if (savedFolders) {
    folders.value = JSON.parse(savedFolders)
  } else {
    // Create default folders
    folders.value = [
      { 
        id: 'default', 
        name: 'Personal', 
        color: 'blue',
        goals: '',
        focus: '',
        createdAt: new Date().toISOString() 
      }
    ]
    saveFolders()
  }
}

// Week navigation methods
const previousWeek = () => {
  currentWeekOffset.value--
}

const nextWeek = () => {
  currentWeekOffset.value++
}

// Task filtering for current week
const getCurrentWeekActiveTasks = () => {
  const weekStart = new Date(currentWeekStart.value)
  const weekEnd = new Date(currentWeekEnd.value)
  weekEnd.setHours(23, 59, 59, 999)

  const filteredTasks = props.tasks
    .filter(task => {
      // Filter out subtasks (tasks with parentId) and completed tasks
      if (task.folderId !== selectedFolderId.value || task.completed || task.parentId) return false
      
      // If no due date, only show in current week
      if (!task.dueDate) {
        return currentWeekOffset.value === 0
      }
      
      const dueDate = new Date(task.dueDate)
      return dueDate >= weekStart && dueDate <= weekEnd
    })

  // Apply custom ordering if it exists for this folder
  const folderKey = `${selectedFolderId.value}_${currentWeekOffset.value}`
  if (taskOrder.value[folderKey]) {
    // Sort based on custom order
    return filteredTasks.sort((a, b) => {
      const orderA = taskOrder.value[folderKey][a.id] ?? 999
      const orderB = taskOrder.value[folderKey][b.id] ?? 999
      if (orderA !== orderB) return orderA - orderB
      
      // Fall back to default sorting
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      } else if (a.dueDate) {
        return -1
      } else if (b.dueDate) {
        return 1
      }
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  } else {
    // Default sorting
    return filteredTasks.sort((a, b) => {
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
}

const getCurrentWeekCompletionPercentage = () => {
  const weekStart = new Date(currentWeekStart.value)
  const weekEnd = new Date(currentWeekEnd.value)
  weekEnd.setHours(23, 59, 59, 999)

  const weekTasks = props.tasks.filter(task => {
    // Only count main tasks (not subtasks) for completion percentage
    if (task.folderId !== selectedFolderId.value || task.parentId) return false
    
    if (!task.dueDate) {
      return currentWeekOffset.value === 0
    }
    
    const dueDate = new Date(task.dueDate)
    return dueDate >= weekStart && dueDate <= weekEnd
  })

  if (weekTasks.length === 0) return 0
  
  const completedTasks = weekTasks.filter(task => task.completed)
  return Math.round((completedTasks.length / weekTasks.length) * 100)
}

const openAddTaskPopup = async () => {
  showAddTaskPopup.value = true
  pendingTasks.value = []
  // Don't set a default due date
  newTaskDueDate.value = ''
  await nextTick()
  taskInput.value?.focus()
}

const closeAddTaskPopup = () => {
  showAddTaskPopup.value = false
  pendingTasks.value = []
  newTaskTitle.value = ''
  newTaskDueDate.value = ''
}

const addTaskToPopup = () => {
  if (!newTaskTitle.value?.trim()) return

  const task = {
    title: newTaskTitle.value.trim(),
    dueDate: newTaskDueDate.value || null
  }

  pendingTasks.value.push(task)
  
  // Reset form but keep popup open
  newTaskTitle.value = ''
  newTaskDueDate.value = ''
  
  // Focus back to input
  nextTick(() => {
    taskInput.value?.focus()
  })
}

const removePendingTask = (index) => {
  pendingTasks.value.splice(index, 1)
}

const saveAllTasks = () => {
  if (pendingTasks.value.length === 0 || !selectedFolderId.value) return

  // Create and emit all tasks
  pendingTasks.value.forEach(taskData => {
    const newTask = {
      title: taskData.title,
      folderId: selectedFolderId.value,
      dueDate: taskData.dueDate,
      completed: false,
      parentId: null,
      createdAt: new Date().toISOString()
    }
    
    emit('task-created', newTask)
  })

  // Close popup and reset
  closeAddTaskPopup()
}

const createSubtask = (parentTaskId, subtaskTitle) => {
  console.log('Creating subtask:', { parentTaskId, subtaskTitle }) // Debug log
  
  const newSubtask = {
    title: subtaskTitle,
    folderId: selectedFolderId.value,
    dueDate: null,
    completed: false,
    parentId: parentTaskId, // This should be set
    createdAt: new Date().toISOString()
  }
  
  console.log('New subtask object:', newSubtask) // Debug log
  emit('task-created', newSubtask)
}

const updateSubtask = (updatedSubtask) => {
  emit('task-updated', updatedSubtask)
}

const deleteSubtask = (subtaskId) => {
  emit('task-deleted', subtaskId)
}

const moveTaskUp = (taskId, currentIndex) => {
  if (currentIndex === 0) return // Already at top
  
  const tasks = getCurrentWeekActiveTasks()
  const folderKey = `${selectedFolderId.value}_${currentWeekOffset.value}`
  
  // Initialize order if it doesn't exist
  if (!taskOrder.value[folderKey]) {
    taskOrder.value[folderKey] = {}
    tasks.forEach((task, index) => {
      taskOrder.value[folderKey][task.id] = index
    })
  }
  
  // Swap positions
  const currentTaskId = tasks[currentIndex].id
  const aboveTaskId = tasks[currentIndex - 1].id
  
  const tempOrder = taskOrder.value[folderKey][currentTaskId]
  taskOrder.value[folderKey][currentTaskId] = taskOrder.value[folderKey][aboveTaskId]
  taskOrder.value[folderKey][aboveTaskId] = tempOrder
  
  saveTaskOrder()
}

const moveTaskDown = (taskId, currentIndex) => {
  const tasks = getCurrentWeekActiveTasks()
  if (currentIndex === tasks.length - 1) return // Already at bottom
  
  const folderKey = `${selectedFolderId.value}_${currentWeekOffset.value}`
  
  // Initialize order if it doesn't exist
  if (!taskOrder.value[folderKey]) {
    taskOrder.value[folderKey] = {}
    tasks.forEach((task, index) => {
      taskOrder.value[folderKey][task.id] = index
    })
  }
  
  // Swap positions
  const currentTaskId = tasks[currentIndex].id
  const belowTaskId = tasks[currentIndex + 1].id
  
  const tempOrder = taskOrder.value[folderKey][currentTaskId]
  taskOrder.value[folderKey][currentTaskId] = taskOrder.value[folderKey][belowTaskId]
  taskOrder.value[folderKey][belowTaskId] = tempOrder
  
  saveTaskOrder()
}

const saveTaskOrder = () => {
  localStorage.setItem('taskOrder', JSON.stringify(taskOrder.value))
}

const loadTaskOrder = () => {
  const saved = localStorage.getItem('taskOrder')
  if (saved) {
    taskOrder.value = JSON.parse(saved)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
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
  // Only count main tasks (not subtasks) for folder counts
  const activeTasks = props.tasks.filter(task => task.folderId === folderId && !task.completed && !task.parentId).length
  const completedTasks = props.tasks.filter(task => task.folderId === folderId && task.completed && !task.parentId).length
  return `${activeTasks}/${activeTasks + completedTasks}`
}

const getActiveTasks = (folderId) => {
  // Filter out subtasks from active tasks list
  return props.tasks
    .filter(task => task.folderId === folderId && !task.completed && !task.parentId)
    .sort((a, b) => {
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
  // Filter out subtasks from archived tasks list
  return props.tasks
    .filter(task => task.folderId === folderId && task.completed && !task.parentId)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
}

// Get folder color information
const getFolderColor = (folder) => {
  return folderColors.find(color => color.value === (folder?.color || 'blue')) || folderColors[0]
}

// Methods
const selectFolder = (folderId) => {
  selectedFolderId.value = folderId
  showingArchive.value = false
  showingGoals.value = false
  currentWeekOffset.value = 0 // Reset to current week when switching folders
}

const startAddFolder = async () => {
  showAddFolder.value = true
  await nextTick()
  folderInput.value?.focus()
}

const cancelAddFolder = () => {
  showAddFolder.value = false
  newFolderName.value = ''
  newFolderColor.value = 'blue'
}

const addFolder = () => {
  if (!newFolderName.value.trim()) return

  const newFolder = {
    id: Date.now().toString(),
    name: newFolderName.value.trim(),
    color: newFolderColor.value,
    goals: '',
    focus: '',
    createdAt: new Date().toISOString()
  }

  folders.value.push(newFolder)
  saveFolders()
  emit('folder-created', newFolder)

  // Auto-select the new folder
  selectedFolderId.value = newFolder.id
  
  // Reset form
  newFolderName.value = ''
  newFolderColor.value = 'blue'
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

const updateTask = (updatedTask) => {
  emit('task-updated', updatedTask)
}

const deleteTask = (taskId) => {
  emit('task-deleted', taskId)
}

const unarchiveTask = (updatedTask) => {
  emit('task-updated', updatedTask)
}

const toggleArchive = () => {
  showingArchive.value = !showingArchive.value
  showingGoals.value = false
}

const toggleGoals = () => {
  showingGoals.value = !showingGoals.value
  showingArchive.value = false
}

// Initialize folders and select first one
const initializeFolders = () => {
  loadFolders()
  loadTaskOrder() // Load saved task ordering
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