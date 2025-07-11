<template>
  <div 
    class="relative group"
    :class="[
      task.completed && !isArchived ? 'opacity-75' : '',
      isOverdue && !task.completed ? 'ring-2 ring-red-400' : ''
    ]"
  >
    <!-- Glass morphism background -->
    <div class="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg"></div>
    
    <div class="relative z-10 p-3">
      <div class="flex items-start gap-3">
        <!-- Checkbox -->
        <button
          v-if="!isArchived"
          @click="toggleComplete"
          class="mt-0.5 w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0"
          :class="[
            task.completed 
              ? 'bg-amber-500 border-amber-500 text-stone-900 shadow-md' 
              : 'border-stone-400 hover:border-amber-500 bg-white/60'
          ]"
        >
          <span v-if="task.completed" class="text-xs font-bold">✓</span>
        </button>

        <!-- Archived checkbox/unarchive button -->
        <button
          v-if="isArchived"
          @click="unarchiveTask"
          class="mt-0.5 w-5 h-5 rounded-lg bg-stone-500 border-2 border-stone-500 hover:bg-amber-500 hover:border-amber-500 flex items-center justify-center text-white hover:text-stone-900 text-xs font-bold transition-all duration-200 flex-shrink-0"
          title="Unarchive task"
        >
          ↺
        </button>

        <!-- Task Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <!-- Title with indicators -->
              <div class="flex items-center gap-2">
                <h3 
                  class="font-medium transition-all duration-200 leading-snug text-sm"
                  :class="[
                    task.completed || isArchived
                      ? 'text-stone-600 line-through' 
                      : 'text-stone-900'
                  ]"
                >
                  {{ task.title }}
                </h3>
                
                <!-- Recurring indicator -->
                <span 
                  v-if="task.recurring && task.recurring.enabled" 
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium"
                  :title="getRecurringDescription()"
                >
                  <span>🔄</span>
                  {{ getRecurringShortLabel() }}
                </span>
                
                <!-- Subtask count indicator -->
                <span 
                  v-if="subtasks.length > 0" 
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium"
                >
                  <span>📋</span>
                  {{ completedSubtasks.length }}/{{ subtasks.length }}
                </span>
              </div>

              <!-- Due Date -->
              <div v-if="task.dueDate" class="mt-1">
                <span 
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  :class="getDueDateClass()"
                >
                  <span>📅</span>
                  {{ formatDueDate(task.dueDate) }}
                </span>
              </div>

              <!-- Completion Date (for archived tasks) -->
              <div v-if="isArchived && task.completedAt" class="mt-1">
                <span class="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-stone-200 text-stone-700 rounded-full font-medium">
                  <span>✅</span>
                  Completed {{ formatCompletionDate(task.completedAt) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
              <!-- Move Up -->
              <button
                v-if="!isArchived"
                @click="moveTaskUp"
                class="p-1.5 text-stone-600 hover:text-green-600 transition-colors rounded-lg hover:bg-white/60"
                title="Move up"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </button>

              <!-- Move Down -->
              <button
                v-if="!isArchived"
                @click="moveTaskDown"
                class="p-1.5 text-stone-600 hover:text-green-600 transition-colors rounded-lg hover:bg-white/60"
                title="Move down"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Move to Next Week -->
              <button
                v-if="!isArchived"
                @click="moveToNextWeek"
                class="p-1.5 text-stone-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-white/60"
                title="Move to next week"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>

              <!-- Add Subtask -->
              <button
                v-if="!isArchived"
                @click="toggleAddSubtask"
                class="p-1.5 text-stone-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-white/60"
                title="Add subtask"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>

              <!-- Edit -->
              <button
                v-if="!isArchived"
                @click="startEdit"
                class="p-1.5 text-stone-600 hover:text-amber-600 transition-colors rounded-lg hover:bg-white/60"
                title="Edit task"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </button>

              <!-- Delete -->
              <button
                @click="deleteTask"
                class="p-1.5 text-stone-600 hover:text-red-500 transition-colors rounded-lg hover:bg-white/60"
                :title="isArchived ? 'Delete from archive' : 'Delete task'"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="isEditing" class="mt-3 pt-3 border-t border-white/50">
        <div class="space-y-3">
          <input
            v-model="editTitle"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="w-full p-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-stone-900 text-sm"
            placeholder="Task title"
            ref="editInput"
          >
          
          <input
            v-model="editDueDate"
            type="date"
            class="w-full p-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-stone-900 text-sm"
          >

          <!-- Recurring Options -->
          <div class="bg-white/60 rounded-lg p-3 border border-white/40">
            <div class="flex items-center gap-2 mb-3">
              <input
                v-model="editRecurring.enabled"
                type="checkbox"
                id="recurring-enabled"
                class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
              >
              <label for="recurring-enabled" class="text-sm font-medium text-stone-700">
                🔄 Make this a recurring task
              </label>
            </div>

            <div v-if="editRecurring.enabled" class="space-y-2">
              <div class="grid grid-cols-2 gap-2">
                <select 
                  v-model="editRecurring.frequency" 
                  class="p-2 bg-white/80 border border-white/60 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                
                <input
                  v-model.number="editRecurring.interval"
                  type="number"
                  min="1"
                  max="30"
                  class="p-2 bg-white/80 border border-white/60 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Every X..."
                >
              </div>
              
              <div class="text-xs text-stone-600 bg-stone-100 p-2 rounded">
                <strong>Preview:</strong> {{ getRecurringPreview() }}
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="saveEdit"
              class="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-1.5 px-3 rounded-lg transition-all duration-200 text-sm"
            >
              Save
            </button>
            <button
              @click="cancelEdit"
              class="bg-white/60 hover:bg-white/80 text-stone-700 font-medium py-1.5 px-3 rounded-lg transition-all duration-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Add Subtask Form -->
      <div v-if="showAddSubtask" class="mt-3 pt-3 border-t border-white/50">
        <div class="flex gap-2">
          <input
            v-model="newSubtaskTitle"
            @keyup.enter="addSubtask"
            @keyup.esc="cancelAddSubtask"
            class="flex-1 p-2 bg-white/80 backdrop-blur-sm border border-white/60 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-stone-900 text-sm"
            placeholder="Enter subtask..."
            ref="subtaskInput"
          >
          <button
            @click="addSubtask"
            :disabled="!newSubtaskTitle?.trim()"
            class="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm disabled:cursor-not-allowed"
          >
            Add
          </button>
          <button
            @click="cancelAddSubtask"
            class="bg-white/60 hover:bg-white/80 text-stone-700 font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Subtasks within the same card -->
      <div v-if="subtasks.length > 0" class="mt-3 pt-3 border-t border-white/30">
        <div class="space-y-2">
          <div
            v-for="subtask in subtasks"
            :key="subtask.id"
            class="flex items-center gap-2 p-2 bg-white/20 rounded-lg border border-white/30"
          >
            <!-- Subtask checkbox -->
            <button
              @click="toggleSubtaskComplete(subtask)"
              class="w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0"
              :class="[
                subtask.completed 
                  ? 'bg-blue-500 border-blue-500 text-white' 
                  : 'border-stone-400 hover:border-blue-500 bg-white/60'
              ]"
            >
              <span v-if="subtask.completed" class="text-xs font-bold">✓</span>
            </button>

            <!-- Subtask title -->
            <span 
              class="flex-1 text-sm transition-all duration-200"
              :class="[
                subtask.completed 
                  ? 'text-stone-600 line-through' 
                  : 'text-stone-800'
              ]"
            >
              {{ subtask.title }}
            </span>

            <!-- Subtask delete button -->
            <button
              @click="deleteSubtask(subtask.id)"
              class="p-1 text-stone-500 hover:text-red-500 transition-colors rounded opacity-0 group-hover:opacity-100"
              title="Delete subtask"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

// Props
const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  allTasks: {
    type: Array,
    default: () => []
  },
  isArchived: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update', 'delete', 'unarchive', 'create-subtask', 'update-subtask', 'delete-subtask', 'move-up', 'move-down', 'create-recurring'])

// Reactive state
const isEditing = ref(false)
const editTitle = ref('')
const editDueDate = ref('')
const editRecurring = ref({
  enabled: false,
  frequency: 'weekly',
  interval: 1
})
const editInput = ref(null)
const showAddSubtask = ref(false)
const newSubtaskTitle = ref('')
const subtaskInput = ref(null)

// Computed properties
const subtasks = computed(() => {
  return props.allTasks.filter(task => task.parentId === props.task.id)
})

const completedSubtasks = computed(() => {
  return subtasks.value.filter(subtask => subtask.completed)
})

const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.completed) return false
  return new Date(props.task.dueDate) < new Date()
})

// Methods
const getDueDateClass = () => {
  if (props.task.completed || props.isArchived) {
    return 'bg-stone-200 text-stone-600'
  }
  
  if (isOverdue.value) {
    return 'bg-red-100 text-red-700 ring-1 ring-red-200'
  }
  
  const today = new Date()
  const dueDate = new Date(props.task.dueDate)
  const diffTime = dueDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 1000))
  
  if (diffDays === 0) {
    return 'bg-orange-100 text-orange-700 ring-1 ring-orange-200'
  } else if (diffDays <= 3) {
    return 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200'
  } else {
    return 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
  }
}

const formatDueDate = (dateString) => {
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

const formatCompletionDate = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 1000))
  
  if (diffDays === 1) return 'today'
  if (diffDays === 2) return 'yesterday'
  if (diffDays <= 7) return `${diffDays - 1} days ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const getRecurringShortLabel = () => {
  if (!props.task.recurring?.enabled) return ''
  
  const { frequency, interval } = props.task.recurring
  
  if (frequency === 'daily') {
    return interval === 1 ? 'Daily' : `${interval}d`
  } else if (frequency === 'weekly') {
    return interval === 1 ? 'Weekly' : `${interval}w`
  } else if (frequency === 'monthly') {
    return interval === 1 ? 'Monthly' : `${interval}m`
  }
  
  return 'Recurring'
}

const getRecurringDescription = () => {
  if (!props.task.recurring?.enabled) return ''
  
  const { frequency, interval } = props.task.recurring
  
  if (frequency === 'daily') {
    return interval === 1 ? 'Repeats every day' : `Repeats every ${interval} days`
  } else if (frequency === 'weekly') {
    return interval === 1 ? 'Repeats every week' : `Repeats every ${interval} weeks`
  } else if (frequency === 'monthly') {
    return interval === 1 ? 'Repeats every month' : `Repeats every ${interval} months`
  }
  
  return 'Recurring task'
}

const getRecurringPreview = () => {
  const { frequency, interval } = editRecurring.value
  
  if (frequency === 'daily') {
    return interval === 1 ? 'This task will repeat every day' : `This task will repeat every ${interval} days`
  } else if (frequency === 'weekly') {
    return interval === 1 ? 'This task will repeat every week' : `This task will repeat every ${interval} weeks`
  } else if (frequency === 'monthly') {
    return interval === 1 ? 'This task will repeat every month' : `This task will repeat every ${interval} months`
  }
  
  return 'This task will repeat'
}

const toggleComplete = () => {
  const updatedTask = {
    ...props.task,
    completed: !props.task.completed,
    completedAt: !props.task.completed ? new Date().toISOString() : null
  }

  // If completing the main task, also complete all subtasks
  if (updatedTask.completed) {
    subtasks.value.forEach(subtask => {
      if (!subtask.completed) {
        emit('update-subtask', {
          ...subtask,
          completed: true,
          completedAt: new Date().toISOString()
        })
      }
    })
    
    // If this is a recurring task, create the next instance
    if (props.task.recurring?.enabled) {
      emit('create-recurring', props.task)
    }
  }

  emit('update', updatedTask)
}

const unarchiveTask = () => {
  emit('unarchive', {
    ...props.task,
    completed: false,
    completedAt: null
  })
}

const startEdit = async () => {
  editTitle.value = props.task.title
  editDueDate.value = props.task.dueDate || ''
  
  // Initialize recurring settings
  if (props.task.recurring) {
    editRecurring.value = { ...props.task.recurring }
  } else {
    editRecurring.value = {
      enabled: false,
      frequency: 'weekly',
      interval: 1
    }
  }
  
  isEditing.value = true
  
  await nextTick()
  editInput.value?.focus()
}

const saveEdit = () => {
  if (!editTitle.value.trim()) return

  const updatedTask = {
    ...props.task,
    title: editTitle.value.trim(),
    dueDate: editDueDate.value || null,
    recurring: editRecurring.value.enabled ? { ...editRecurring.value } : null
  }

  emit('update', updatedTask)
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editTitle.value = ''
  editDueDate.value = ''
  editRecurring.value = {
    enabled: false,
    frequency: 'weekly',
    interval: 1
  }
}

const deleteTask = () => {
  const message = props.isArchived 
    ? 'Are you sure you want to permanently delete this completed task?' 
    : 'Are you sure you want to delete this task?'
    
  if (confirm(message)) {
    // Delete all subtasks first
    subtasks.value.forEach(subtask => {
      emit('delete-subtask', subtask.id)
    })
    
    // Then delete the main task
    emit('delete', props.task.id)
  }
}

const toggleAddSubtask = async () => {
  showAddSubtask.value = !showAddSubtask.value
  if (showAddSubtask.value) {
    await nextTick()
    subtaskInput.value?.focus()
  }
}

const addSubtask = () => {
  if (!newSubtaskTitle.value?.trim()) return

  emit('create-subtask', props.task.id, newSubtaskTitle.value.trim())
  
  newSubtaskTitle.value = ''
  showAddSubtask.value = false
}

const cancelAddSubtask = () => {
  showAddSubtask.value = false
  newSubtaskTitle.value = ''
}

const toggleSubtaskComplete = (subtask) => {
  emit('update-subtask', {
    ...subtask,
    completed: !subtask.completed,
    completedAt: !subtask.completed ? new Date().toISOString() : null
  })
}

const deleteSubtask = (subtaskId) => {
  if (confirm('Are you sure you want to delete this subtask?')) {
    emit('delete-subtask', subtaskId)
  }
}

const moveTaskUp = () => {
  emit('move-up', props.task.id)
}

const moveTaskDown = () => {
  emit('move-down', props.task.id)
}

const moveToNextWeek = () => {
  // Calculate next week's date
  const currentDate = props.task.dueDate ? new Date(props.task.dueDate) : new Date()
  const nextWeek = new Date(currentDate)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  const updatedTask = {
    ...props.task,
    dueDate: nextWeek.toISOString().split('T')[0] // Format as YYYY-MM-DD
  }
  
  emit('update', updatedTask)
}
</script>