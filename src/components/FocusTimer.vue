<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-stone-900 mb-3 tracking-tight">Focus Timer</h1>
      <p class="text-xl text-stone-700 opacity-80">Stay focused and grow your forest, one session at a time</p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 items-start">
      <!-- Timer Section -->
      <div class="lg:col-span-2">
        <!-- Main Timer Card -->
        <div class="relative mb-8">
          <!-- Glass morphism background -->
          <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
          
          <div class="relative z-10 p-8 text-center">
            <!-- Progress Ring -->
            <div class="relative w-80 h-80 mx-auto mb-8">
              <svg class="w-80 h-80 transform -rotate-90 drop-shadow-2xl" viewBox="0 0 160 160">
                <!-- Outer glow -->
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(245, 158, 11, 0.1)"
                  stroke-width="8"
                  fill="none"
                />
                <!-- Background circle -->
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="rgba(0, 0, 0, 0.1)"
                  stroke-width="6"
                  fill="none"
                  class="drop-shadow-sm"
                />
                <!-- Progress circle -->
                <circle
                  cx="80"
                  cy="80"
                  r="65"
                  stroke="url(#gradient)"
                  stroke-width="6"
                  fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="progressOffset"
                  style="transition: stroke-dashoffset 1s ease-out"
                  class="drop-shadow-lg"
                />
                <!-- Gradient definition -->
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#d97706;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#92400e;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
              
              <!-- Tree and Time Display in Center -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div :class="treeAnimationClass" class="transition-all duration-500 mb-2">
                  {{ currentTreeEmoji }}
                </div>
                <div class="text-4xl font-mono font-bold text-stone-900 tracking-wider">
                  {{ formatTime(timeLeft) }}
                </div>
                <div v-if="isRunning" class="text-sm text-stone-600 mt-1">
                  {{ Math.round(((selectedDuration - timeLeft) / selectedDuration) * 100) }}% complete
                </div>
                <div v-if="isRunning" class="text-xs text-stone-500 mt-1">
                  Trees grown: {{ Math.floor((selectedDuration - timeLeft) / 3600) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Duration Settings Card -->
        <div v-if="!isRunning" class="relative mb-8">
          <!-- Glass morphism background -->
          <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
          
          <div class="relative z-10 p-8">
            <h3 class="text-2xl font-bold text-stone-900 mb-8 text-center">Choose Your Focus Duration</h3>
            
            <!-- Slider -->
            <div class="relative px-6 mb-8">
              <input
                type="range"
                v-model="selectedDuration"
                :min="30 * 60"
                :max="4 * 3600"
                :step="15 * 60"
                class="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer slider"
                @input="updateTimeLeft"
              />
              
              <!-- Slider Labels -->
              <div class="flex justify-between text-xs text-stone-600 mt-2 px-2">
                <span>30 min</span>
                <span>1 hour</span>
                <span>2 hours</span>
                <span>3 hours</span>
                <span>4 hours</span>
              </div>
            </div>

            <!-- Start Focus Button -->
            <div class="text-center">
              <button
                @click="startTimer"
                class="group relative overflow-hidden bg-amber-600 hover:bg-amber-700 text-stone-900 font-bold py-4 px-12 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 mx-auto"
              >
                <!-- Button glow effect -->
                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="relative z-10 flex items-center gap-3"                >
                  <span class="text-2xl">🎯</span>
                  <span class="text-lg">Start Focus</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Focus Session Tasks Card -->
        <div v-if="isRunning && selectedTaskIds.length > 0" class="relative mb-8">
          <!-- Glass morphism background -->
          <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
          
          <div class="relative z-10 p-8">
            <h3 class="text-2xl font-bold text-stone-900 mb-6 text-center">Focus Session Tasks</h3>
            
            <!-- Task Progress -->
            <div class="mb-6 text-center">
              <div class="text-lg font-semibold text-stone-900 mb-2">
                {{ completedSessionTasks.length }} / {{ selectedTaskIds.length }} tasks completed
              </div>
              <div class="w-full bg-stone-200 rounded-full h-3">
                <div 
                  class="bg-green-500 h-3 rounded-full transition-all duration-500"
                  :style="{ width: `${(completedSessionTasks.length / selectedTaskIds.length) * 100}%` }"
                ></div>
              </div>
            </div>
            
            <!-- Task List -->
            <div class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar mb-8">
              <div
                v-for="taskId in selectedTaskIds"
                :key="taskId"
                class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300"
                :class="isTaskCompleted(taskId) 
                  ? 'bg-green-100 border-green-300' 
                  : 'bg-white/60 border-white/50 hover:bg-white/80'"
              >
                <!-- Task Checkbox -->
                <button
                  @click="toggleTaskCompletion(taskId)"
                  class="flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                  :class="isTaskCompleted(taskId) 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-stone-400 hover:border-green-400'"
                >
                  <svg v-if="isTaskCompleted(taskId)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                
                <!-- Task Details -->
                <div class="flex-1">
                  <div 
                    class="font-medium transition-all duration-300"
                    :class="isTaskCompleted(taskId) 
                      ? 'text-green-800 line-through' 
                      : 'text-stone-900'"
                  >
                    {{ getTaskTitle(taskId) }}
                  </div>
                  <div v-if="getTaskDueDate(taskId)" class="text-xs text-stone-600 mt-1">
                    Due: {{ formatTaskDueDate(getTaskDueDate(taskId)) }}
                  </div>
                </div>
                
                <!-- Completion Badge -->
                <div v-if="isTaskCompleted(taskId)" class="text-lg">
                  ✓
                </div>
              </div>
            </div>
            
            <!-- Session Summary and Stop Button -->
            <div class="space-y-4">

              
              <!-- Stop Focus Button -->
              <div class="text-center">
                <button
                  @click="stopTimer"
                  class="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 mx-auto"
                >
                  <span class="text-lg">Stop Focus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar: Today's Sessions and Task Selection -->
      <div class="space-y-8">
        <!-- Session History Card -->
        <div class="relative">
          <!-- Glass morphism background -->
          <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
          
          <div class="relative z-10 p-8">
            <h3 class="text-2xl font-bold text-stone-900 mb-6">Today's Growth</h3>
            
            <div v-if="todaySessions.length === 0" class="text-center py-8 text-stone-600">
              <div class="text-5xl mb-3">🌱</div>
              <p class="font-medium">No trees grown today</p>
              <p class="text-sm mt-1">Start your first session!</p>
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="session in todaySessions.slice(-5)" 
                :key="session.id"
                class="group relative overflow-hidden bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/30 transition-all duration-300 hover:bg-white/60 hover:shadow-lg hover:scale-102"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="text-3xl group-hover:animate-pulse">
                      {{ getSessionTreeEmoji(session.duration) }}
                    </div>
                    <div>
                      <div class="font-bold text-stone-900">{{ formatDuration(session.duration) }}</div>
                      <div class="text-sm text-stone-600">{{ formatTimeStamp(session.completedAt) }}</div>
                      <div v-if="session.completed" class="text-xs text-green-600 font-medium">Completed</div>
                      <div v-else class="text-xs text-amber-600 font-medium">Early Stop</div>
                      <div v-if="session.tasksCompleted" class="text-xs text-blue-600 font-medium">
                        {{ session.tasksCompleted }} task{{ session.tasksCompleted !== 1 ? 's' : '' }} completed
                      </div>
                    </div>
                  </div>
                  <div class="text-2xl text-amber-600">✓</div>
                </div>
              </div>
            </div>
            
            <!-- Today's Summary -->
            <div v-if="todaySessions.length > 0" class="mt-6 pt-6 border-t border-white/50">
              <div class="text-center">
                <div class="text-sm text-stone-600 mb-2">Today's Total</div>
                <div class="text-2xl font-bold text-stone-900">{{ formatDuration(todayTotalTime) }}</div>
                <div class="text-xs text-stone-500 mt-1">{{ todaySessions.length }} session{{ todaySessions.length !== 1 ? 's' : '' }}</div>
                <div v-if="todayTasksCompleted > 0" class="text-xs text-blue-600 mt-1">
                  {{ todayTasksCompleted }} task{{ todayTasksCompleted !== 1 ? 's' : '' }} completed
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Task Selection Card -->
        <div v-if="!isRunning" class="relative">
          <!-- Glass morphism background -->
          <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
          
          <div class="relative z-10 p-8">
            <h3 class="text-2xl font-bold text-stone-900 mb-6">Select Tasks to Focus On</h3>
            
            <!-- Folder Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-stone-700 mb-3">Choose Folder</label>
              <div class="relative">
                <select
                  v-model="selectedFolderId"
                  @change="loadFolderTasks"
                  class="w-full p-4 bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-stone-900 font-medium shadow-lg appearance-none cursor-pointer transition-all duration-300 hover:bg-white/80 hover:shadow-xl"
                >
                  <option value="" class="bg-white text-stone-900">No folder selected</option>
                  <option 
                    v-for="folder in availableFolders" 
                    :key="folder.id" 
                    :value="folder.id"
                    class="bg-white text-stone-900"
                  >
                    {{ folder.name }} ({{ getActiveTasks(folder.id).length }} tasks)
                  </option>
                </select>
                <!-- Custom dropdown arrow -->
                <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg class="w-5 h-5 text-stone-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            <!-- Task Selection -->
            <div v-if="selectedFolderId && folderTasks.length > 0">
              <label class="block text-sm font-medium text-stone-700 mb-4">Select Tasks</label>
              <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                <div
                  v-for="task in folderTasks"
                  :key="task.id"
                  class="group relative"
                >
                  <input
                    type="checkbox"
                    :id="'task-' + task.id"
                    v-model="selectedTaskIds"
                    :value="task.id"
                    class="sr-only"
                  >
                  <label 
                    :for="'task-' + task.id" 
                    class="flex items-center gap-4 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/40 transition-all duration-300 cursor-pointer hover:bg-white/70 hover:shadow-lg hover:scale-102 group-hover:border-amber-300"
                    :class="selectedTaskIds.includes(task.id) ? 'bg-amber-100 border-amber-300 shadow-lg' : ''"
                  >
                    <!-- Custom checkbox -->
                    <div 
                      class="flex-shrink-0 w-6 h-6 rounded-xl border-2 transition-all duration-300 flex items-center justify-center"
                      :class="selectedTaskIds.includes(task.id) 
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg' 
                        : 'border-stone-400 group-hover:border-amber-400 bg-white/50'"
                    >
                      <svg v-if="selectedTaskIds.includes(task.id)" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    
                    <!-- Task content -->
                    <div class="flex-1">
                      <div 
                        class="font-medium transition-all duration-300"
                        :class="selectedTaskIds.includes(task.id) ? 'text-amber-900' : 'text-stone-900'"
                      >
                        {{ task.title }}
                      </div>
                      <div v-if="task.dueDate" class="text-xs mt-1 font-medium"
                           :class="selectedTaskIds.includes(task.id) ? 'text-amber-700' : 'text-stone-600'"
                      >
                        Due: {{ formatTaskDueDate(task.dueDate) }}
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              
              <!-- Selection summary -->
              <div v-if="selectedTaskIds.length > 0" class="mt-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl border border-amber-200 shadow-lg">
                <div class="text-center">
                  <div class="text-amber-800 font-bold text-lg mb-1">
                    {{ selectedTaskIds.length }} Task{{ selectedTaskIds.length !== 1 ? 's' : '' }} Selected
                  </div>
                  <div class="text-sm text-amber-700 font-medium">
                    Ready for focus session
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="selectedFolderId && folderTasks.length === 0" class="text-center py-8 text-stone-600">
              <div class="text-4xl mb-2">✓</div>
              <p class="font-medium">No active tasks in this folder</p>
              <p class="text-sm mt-1">All tasks are completed</p>
            </div>
            
            <div v-else-if="!selectedFolderId" class="text-center py-8 text-stone-600">
              <div class="text-4xl mb-2">📁</div>
              <p class="font-medium">Select a folder to view tasks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Define emits
const emit = defineEmits(['tree-grown', 'focus-time-updated', 'focus-state-changed', 'task-completed'])

// Define props to receive tasks data
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
})

// Reactive state
const selectedDuration = ref(60 * 60) // 1 hour default
const timeLeft = ref(selectedDuration.value)
const isRunning = ref(false)
const sessionHistory = ref([])
const treesGrownThisSession = ref(0)
const selectedFolderId = ref('')
const selectedTaskIds = ref([])
const completedSessionTasks = ref([]) // Track tasks completed during current session
const availableFolders = ref([])
const folderTasks = ref([])
let timerId = null

// Constants
const circumference = 2 * Math.PI * 65 // radius = 65

// Utility functions
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours}h`
  } else {
    return `${mins}m`
  }
}

const formatDurationHours = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`
  } else {
    return `${mins} minutes`
  }
}

const formatTimeStamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const updateTimeLeft = () => {
  timeLeft.value = selectedDuration.value
}

// Computed properties
const progressOffset = computed(() => {
  const progress = (selectedDuration.value - timeLeft.value) / selectedDuration.value
  return circumference - (progress * circumference)
})

const currentTreeEmoji = computed(() => {
  if (!isRunning.value) return '🌱'
  
  const progress = (selectedDuration.value - timeLeft.value) / selectedDuration.value
  if (progress < 0.25) return '🌱'
  if (progress < 0.5) return '🌿'
  if (progress < 0.75) return '🌳'
  return '🌲'
})

const treeAnimationClass = computed(() => {
  if (isRunning.value) return 'text-8xl animate-pulse'
  return 'text-8xl'
})

const todaySessions = computed(() => {
  const today = new Date().toDateString()
  return sessionHistory.value.filter(session => 
    new Date(session.completedAt).toDateString() === today
  )
})

const todayTotalTime = computed(() => {
  return todaySessions.value.reduce((total, session) => total + session.duration, 0)
})

const todayTasksCompleted = computed(() => {
  return todaySessions.value.reduce((total, session) => total + (session.tasksCompleted || 0), 0)
})

// Task-related functions
const isTaskCompleted = (taskId) => {
  return completedSessionTasks.value.includes(taskId)
}

const toggleTaskCompletion = (taskId) => {
  if (isTaskCompleted(taskId)) {
    // Remove from completed tasks
    completedSessionTasks.value = completedSessionTasks.value.filter(id => id !== taskId)
  } else {
    // Add to completed tasks
    completedSessionTasks.value.push(taskId)
    
    // Emit task completion event to parent to mark task as completed in the main system
    emit('task-completed', taskId)
    
    // Show completion animation/feedback
    showTaskCompletionFeedback(taskId)
  }
}

const showTaskCompletionFeedback = (taskId) => {
  const taskTitle = getTaskTitle(taskId)
  
  // Create a temporary notification
  const notification = document.createElement('div')
  notification.innerHTML = `
    <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
      ✓ Completed: ${taskTitle}
    </div>
  `
  document.body.appendChild(notification)
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

// Timer functions
const startTimer = () => {
  console.log('Starting timer - emitting focus state: true')
  isRunning.value = true
  treesGrownThisSession.value = 0
  completedSessionTasks.value = [] // Reset completed tasks for new session
  
  // Emit focus state changed - ONLY when actually starting
  emit('focus-state-changed', true)
  
  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      
      // Check if an hour (3600 seconds) has passed and grow a tree
      const elapsed = selectedDuration.value - timeLeft.value
      const hoursCompleted = Math.floor(elapsed / 3600) // 1 hour = 3600 seconds
      
      if (hoursCompleted > treesGrownThisSession.value) {
        treesGrownThisSession.value = hoursCompleted
        growTree()
      }
    } else {
      finishSession()
    }
  }, 1000)
}

const stopTimer = () => {
  console.log('Stopping timer - emitting focus state: false')
  const elapsedTime = selectedDuration.value - timeLeft.value
  
  isRunning.value = false
  clearInterval(timerId)
  
  // Emit focus state changed
  emit('focus-state-changed', false)
  
  // If we focused for at least 1 hour, grow a tree and record the session
  if (elapsedTime >= 3600) { // 1 hour = 3600 seconds
    const treesToGrow = Math.floor(elapsedTime / 3600)
    
    // Grow any remaining trees that haven't been grown yet
    for (let i = treesGrownThisSession.value; i < treesToGrow; i++) {
      growTree()
    }
    
    // Record the partial session
    const session = {
      id: Date.now(),
      duration: elapsedTime,
      completedAt: new Date().toISOString(),
      treesGrown: treesToGrow,
      completed: false, // Mark as incomplete since it was stopped early
      tasksCompleted: completedSessionTasks.value.length
    }
    sessionHistory.value.push(session)
    
    // Show notification for early stop
    showEarlyStopNotification(elapsedTime, treesToGrow)
  }
  
  // Emit the elapsed time to update total focus hours
  emit('focus-time-updated', elapsedTime)
  
  // Reset for next session
  timeLeft.value = selectedDuration.value
  treesGrownThisSession.value = 0
  completedSessionTasks.value = []
}

const finishSession = () => {
  console.log('Finishing session - emitting focus state: false')
  isRunning.value = false
  clearInterval(timerId)
  
  // Emit focus state changed - ONLY when actually finishing
  emit('focus-state-changed', false)
  
  // Record session
  const session = {
    id: Date.now(),
    duration: selectedDuration.value,
    completedAt: new Date().toISOString(),
    treesGrown: Math.floor(selectedDuration.value / 3600),
    completed: true, // Mark as completed
    tasksCompleted: completedSessionTasks.value.length
  }
  sessionHistory.value.push(session)
  
  // Emit focus time updated
  emit('focus-time-updated', selectedDuration.value)
  
  // Reset for next session
  timeLeft.value = selectedDuration.value
  treesGrownThisSession.value = 0
  
  // Show success notification
  showSuccessNotification(session.treesGrown, completedSessionTasks.value.length)
  
  // Reset completed tasks
  completedSessionTasks.value = []
}

const growTree = () => {
  emit('tree-grown', {
    type: 'oak',
    duration: 3600, // 1 hour
    source: 'timer'
  })
}

const showSuccessNotification = (treesGrown, tasksCompleted) => {
  setTimeout(() => {
    let message = `🌳 Congratulations! You completed your focus session!`
    
    if (treesGrown > 0) {
      message += ` You grew ${treesGrown} tree${treesGrown !== 1 ? 's' : ''}!`
    }
    
    if (tasksCompleted > 0) {
      message += ` You also completed ${tasksCompleted} task${tasksCompleted !== 1 ? 's' : ''}!`
    }
    
    alert(message)
  }, 500)
}

const showEarlyStopNotification = (elapsedTime, treesGrown) => {
  setTimeout(() => {
    const minutes = Math.floor(elapsedTime / 60)
    let message = `⏰ You focused for ${minutes} minutes.`
    
    if (treesGrown > 0) {
      message += ` You grew ${treesGrown} tree${treesGrown !== 1 ? 's' : ''}!`
    } else {
      message += ` Keep going for 60+ minutes to grow your first tree!`
    }
    
    if (completedSessionTasks.value.length > 0) {
      message += ` You completed ${completedSessionTasks.value.length} task${completedSessionTasks.value.length !== 1 ? 's' : ''}!`
    }
    
    alert(message)
  }, 500)
}

const getSessionTreeEmoji = (duration) => {
  const hours = Math.floor(duration / 3600)
  
  if (hours < 1) return '🌱'
  if (hours < 2) return '🌿'
  if (hours < 4) return '🌳'
  return '🌲'
}

// Task-related methods
const loadFolders = () => {
  const savedFolders = localStorage.getItem('taskFolders')
  if (savedFolders) {
    availableFolders.value = JSON.parse(savedFolders)
  }
}

const getActiveTasks = (folderId) => {
  return props.tasks.filter(task => task.folderId === folderId && !task.completed)
}

const loadFolderTasks = () => {
  if (selectedFolderId.value) {
    folderTasks.value = getActiveTasks(selectedFolderId.value)
  } else {
    folderTasks.value = []
  }
  selectedTaskIds.value = [] // Clear selected tasks when changing folder
}

const getTaskTitle = (taskId) => {
  const task = props.tasks.find(t => t.id === taskId)
  return task ? task.title : 'Unknown Task'
}

const getTaskDueDate = (taskId) => {
  const task = props.tasks.find(t => t.id === taskId)
  return task ? task.dueDate : null
}

const formatTaskDueDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow'
  } else if (date < today) {
    return 'Overdue'
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

// Lifecycle hooks
onMounted(() => {
  // Load session history from storage if available
  const savedHistory = localStorage.getItem('focusSessionHistory')
  if (savedHistory) {
    sessionHistory.value = JSON.parse(savedHistory)
  }
  
  // Load available folders
  loadFolders()
  
  // DO NOT emit focus state changed on mount - this was causing the issue
  console.log('Timer component mounted - NOT emitting focus state')
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId)
  }
  // Save session history
  localStorage.setItem('focusSessionHistory', JSON.stringify(sessionHistory.value))
  
  // ONLY emit focus state changed if we were actually running
  if (isRunning.value) {
    console.log('Timer component unmounting while running - emitting focus state: false')
    emit('focus-state-changed', false)
  }
})
</script>

<style scoped>
.slider {
  background: linear-gradient(to right, #f59e0b 0%, #d97706 50%, #92400e 100%);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #fbbf24;
  border: 3px solid #92400e;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #fbbf24;
  border: 3px solid #92400e;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

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