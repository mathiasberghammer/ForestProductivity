<template>
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-8">
      <h1 class="text-5xl font-bold text-stone-900 mb-3 tracking-tight">Project Goals</h1>
      <p class="text-xl text-stone-700 opacity-80">Set long-term goals and focus areas for each project.</p>
    </div>

    <!-- Folder Selection -->
    <div class="mb-6">
      <div class="relative">
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl"></div>
        <div class="relative z-10 p-4">
          <div class="flex items-center justify-center">
            <div class="flex items-center gap-2 overflow-x-auto">
              <button
                v-for="folder in folders"
                :key="folder.id"
                @click="selectFolder(folder.id)"
                class="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 font-medium whitespace-nowrap"
                :class="[
                  selectedFolderId === folder.id
                    ? 'text-stone-900 shadow-lg transform scale-105'
                    : 'text-stone-700 hover:bg-white/60'
                ]"
                :style="{ 
                  backgroundColor: selectedFolderId === folder.id 
                    ? getFolderColor(folder).bg 
                    : 'rgba(255, 255, 255, 0.4)' 
                }"
              >
                <span class="text-lg">{{ getFolderColor(folder).emoji }}</span>
                <span>{{ folder.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Folder Goals -->
    <div v-if="selectedFolder" class="relative">
      <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
      
      <div class="relative z-10 p-8">
        <!-- Folder Header -->
        <div class="flex items-center gap-4 mb-8">
          <div 
            class="w-16 h-16 rounded-2xl flex items-center justify-center text-stone-800 shadow-lg"
            :style="{ backgroundColor: getFolderColor(selectedFolder).bg }"
          >
            <span class="text-3xl">{{ getFolderColor(selectedFolder).emoji }}</span>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-stone-900">{{ selectedFolder.name }} Goals</h2>
            <p class="text-stone-600">Define your long-term vision and focus areas</p>
          </div>
        </div>

        <!-- Goals Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Long-term Goals -->
          <div class="space-y-4">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-stone-900">
                <span class="text-xl">🎯</span>
              </div>
              <h3 class="text-xl font-bold text-stone-900">Long-term Goals</h3>
            </div>
            
            <div class="relative">
              <div class="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50"></div>
              <textarea 
                v-model="selectedFolder.goals" 
                @input="saveFolders"
                class="relative z-10 w-full p-4 bg-transparent border-0 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-stone-900 placeholder-stone-500" 
                rows="8" 
                placeholder="What are your big-picture objectives for this project?

Examples:
• Launch new product feature by Q3
• Increase user engagement by 25%
• Complete certification program
• Build a sustainable workflow"
              ></textarea>
            </div>
          </div>

          <!-- Focus Areas -->
          <div class="space-y-4">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white">
                <span class="text-xl">💡</span>
              </div>
              <h3 class="text-xl font-bold text-stone-900">Primary Focus Areas</h3>
            </div>
            
            <div class="relative">
              <div class="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50"></div>
              <textarea 
                v-model="selectedFolder.focus" 
                @input="saveFolders"
                class="relative z-10 w-full p-4 bg-transparent border-0 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none text-stone-900 placeholder-stone-500" 
                rows="8" 
                placeholder="What areas should you prioritize your time and energy on?

Examples:
• Content creation and marketing
• Technical skill development
• Network building and partnerships
• Process optimization
• Research and learning"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Progress Overview -->
        <div class="mt-8 pt-6 border-t border-white/30">
          <h3 class="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span>📊</span>
            Progress Overview
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50">
              <div class="text-2xl font-bold text-amber-600">{{ getProjectStats(selectedFolder.id).activeTasks }}</div>
              <div class="text-sm font-medium text-stone-600">Active Tasks</div>
            </div>
            
            <div class="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50">
              <div class="text-2xl font-bold text-green-600">{{ getProjectStats(selectedFolder.id).completedTasks }}</div>
              <div class="text-sm font-medium text-stone-600">Completed Tasks</div>
            </div>
            
            <div class="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50">
              <div class="text-2xl font-bold text-blue-600">{{ getProjectStats(selectedFolder.id).completionRate }}%</div>
              <div class="text-sm font-medium text-stone-600">Completion Rate</div>
            </div>
            
            <div class="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-white/50">
              <div class="text-2xl font-bold text-purple-600">{{ getProjectStats(selectedFolder.id).focusHours }}</div>
              <div class="text-sm font-medium text-stone-600">Focus Hours</div>
            </div>
          </div>
        </div>

        <!-- Action Items -->
        <div class="mt-8">
          <h3 class="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
            <span>⚡</span>
            Next Action Items
          </h3>
          
          <div class="relative">
            <div class="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/50"></div>
            <div class="relative z-10 p-4">
              <textarea 
                v-model="selectedFolder.actionItems" 
                @input="saveFolders"
                class="w-full bg-transparent border-0 focus:ring-0 outline-none resize-none text-stone-900 placeholder-stone-500" 
                rows="4" 
                placeholder="What specific actions will you take next to move toward your goals?

Examples:
• Research competitor strategies this week
• Set up analytics dashboard by Friday
• Schedule 3 user interviews next month
• Create content calendar for Q2"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Selection State -->
    <div v-if="!selectedFolder" class="text-center py-16">
      <div class="relative">
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
        <div class="relative z-10 p-12">
          <div class="text-8xl mb-6">🎯</div>
          <h3 class="text-3xl font-bold text-stone-900 mb-4">Select a Project</h3>
          <p class="text-xl text-stone-700">Choose a project above to view and edit its goals</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  tasks: {
    type: Array,
    default: () => []
  },
  focusSessions: {
    type: Array,
    default: () => []
  }
})

// Reactive state
const folders = ref([])
const selectedFolderId = ref(null)

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

// Computed properties
const selectedFolder = computed(() => {
  return folders.value.find(folder => folder.id === selectedFolderId.value) || null
})

// Methods
const loadFolders = () => {
  const savedFolders = localStorage.getItem('taskFolders')
  if (savedFolders) {
    folders.value = JSON.parse(savedFolders).map(folder => ({
      ...folder,
      goals: folder.goals || '',
      focus: folder.focus || '',
      actionItems: folder.actionItems || ''
    }))
  }
}

const saveFolders = () => {
  localStorage.setItem('taskFolders', JSON.stringify(folders.value))
}

const selectFolder = (folderId) => {
  selectedFolderId.value = folderId
}

const getFolderColor = (folder) => {
  return folderColors.find(color => color.value === (folder?.color || 'blue')) || folderColors[0]
}

const getProjectStats = (folderId) => {
  const projectTasks = props.tasks.filter(task => task.folderId === folderId)
  const activeTasks = projectTasks.filter(task => !task.completed).length
  const completedTasks = projectTasks.filter(task => task.completed).length
  const totalTasks = projectTasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  
  // Calculate focus hours for this project
  const projectSessions = props.focusSessions.filter(session => session.folderId === folderId)
  const focusHours = Math.floor(
    projectSessions.reduce((total, session) => {
      const duration = typeof session.duration === 'string' 
        ? parseInt(session.duration, 10) 
        : session.duration || 0
      return total + duration
    }, 0) / 3600
  )
  
  return {
    activeTasks,
    completedTasks,
    completionRate,
    focusHours
  }
}

// Initialize
onMounted(() => {
  loadFolders()
  if (folders.value.length > 0) {
    selectedFolderId.value = folders.value[0].id
  }
})
</script>