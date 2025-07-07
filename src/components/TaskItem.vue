<template>
  <div 
    class="relative group transition-all duration-300 hover:scale-102"
    :class="[
      task.completed && !isArchived ? 'opacity-75' : '',
      isOverdue && !task.completed ? 'ring-2 ring-red-400' : ''
    ]"
  >
    <!-- Glass morphism background -->
    <div class="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-300"></div>
    
    <div class="relative z-10 p-4">
      <div class="flex items-start gap-3">
        <!-- Checkbox -->
        <button
          v-if="!isArchived"
          @click="toggleComplete"
          class="mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-sm"
          :class="[
            task.completed 
              ? 'bg-amber-500 border-amber-500 text-stone-900 shadow-md' 
              : 'border-stone-400 hover:border-amber-500 bg-white/60'
          ]"
        >
          <span v-if="task.completed" class="text-sm font-bold">✓</span>
        </button>

        <!-- Archived indicator -->
        <div v-if="isArchived" class="mt-1 w-6 h-6 rounded-lg bg-stone-500 border-2 border-stone-500 flex items-center justify-center text-white text-sm font-bold">
          ✓
        </div>

        <!-- Task Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1">
              <!-- Title -->
              <h3 
                class="font-medium transition-all duration-200 leading-tight"
                :class="[
                  task.completed || isArchived
                    ? 'text-stone-600 line-through' 
                    : 'text-stone-900'
                ]"
              >
                {{ task.title }}
              </h3>

              <!-- Due Date -->
              <div v-if="task.dueDate" class="mt-2">
                <span 
                  class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                  :class="getDueDateClass()"
                >
                  <span>📅</span>
                  {{ formatDueDate(task.dueDate) }}
                </span>
              </div>

              <!-- Completion Date (for archived tasks) -->
              <div v-if="isArchived && task.completedAt" class="mt-2">
                <span class="inline-flex items-center gap-1 text-xs px-2 py-1 bg-stone-200 text-stone-700 rounded-full font-medium">
                  <span>✅</span>
                  Completed {{ formatCompletionDate(task.completedAt) }}
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="!isArchived" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <!-- Edit -->
              <button
                @click="startEdit"
                class="p-2 text-stone-600 hover:text-amber-600 transition-colors rounded-lg hover:bg-white/60"
                title="Edit task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </button>

              <!-- Delete -->
              <button
                @click="deleteTask"
                class="p-2 text-stone-600 hover:text-red-500 transition-colors rounded-lg hover:bg-white/60"
                title="Delete task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>

            <!-- Delete for archived tasks -->
            <div v-if="isArchived" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                @click="deleteTask"
                class="p-2 text-stone-600 hover:text-red-500 transition-colors rounded-lg hover:bg-white/60"
                title="Delete from archive"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-if="isEditing" class="mt-4 pt-4 border-t border-white/50">
        <div class="space-y-3">
          <input
            v-model="editTitle"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            class="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-stone-900"
            placeholder="Task title"
            ref="editInput"
          >
          
          <input
            v-model="editDueDate"
            type="date"
            class="w-full p-3 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-stone-900"
          >

          <div class="flex gap-2">
            <button
              @click="saveEdit"
              class="bg-amber-500 hover:bg-amber-600 text-stone-900 font-medium py-2 px-4 rounded-xl transition-all duration-200"
            >
              Save
            </button>
            <button
              @click="cancelEdit"
              class="bg-white/60 hover:bg-white/80 text-stone-700 font-medium py-2 px-4 rounded-xl transition-all duration-200"
            >
              Cancel
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
  isArchived: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update', 'delete'])

// Reactive state
const isEditing = ref(false)
const editTitle = ref('')
const editDueDate = ref('')
const editInput = ref(null)

// Computed properties
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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'today'
  if (diffDays === 2) return 'yesterday'
  if (diffDays <= 7) return `${diffDays - 1} days ago`
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const toggleComplete = () => {
  emit('update', {
    ...props.task,
    completed: !props.task.completed,
    completedAt: !props.task.completed ? new Date().toISOString() : null
  })
}

const startEdit = async () => {
  editTitle.value = props.task.title
  editDueDate.value = props.task.dueDate || ''
  isEditing.value = true
  
  await nextTick()
  editInput.value?.focus()
}

const saveEdit = () => {
  if (!editTitle.value.trim()) return

  emit('update', {
    ...props.task,
    title: editTitle.value.trim(),
    dueDate: editDueDate.value || null
  })
  
  isEditing.value = false
}

const cancelEdit = () => {
  isEditing.value = false
  editTitle.value = ''
  editDueDate.value = ''
}

const deleteTask = () => {
  const message = props.isArchived 
    ? 'Are you sure you want to permanently delete this completed task?' 
    : 'Are you sure you want to delete this task?'
    
  if (confirm(message)) {
    emit('delete', props.task.id)
  }
}
</script>