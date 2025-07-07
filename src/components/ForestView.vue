<template>
  <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div class="text-center mb-8 sm:mb-10 lg:mb-12">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-2 sm:mb-3 tracking-tight">My Forest</h1>
      <p class="text-base sm:text-lg lg:text-xl text-stone-700 opacity-80 px-4">Every tree represents your focus and productivity achievements</p>
    </div>

    <!-- Jungle Grid -->
    <div class="mb-8 sm:mb-10 lg:mb-12">
      <div class="relative">
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-6 sm:p-8">
          <!-- Jungle Grid Header -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <h2 class="text-xl sm:text-2xl font-bold text-stone-900">Your Digital Forest</h2>
            <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 self-start sm:self-auto">
              <span class="text-xl sm:text-2xl">🌳</span>
              <span class="text-base sm:text-lg font-bold text-stone-900">{{ totalTrees }}</span>
              <span class="text-sm text-stone-600">trees</span>
            </div>
          </div>
          
          <div 
            class="grid mx-auto p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-green-800 shadow-inner relative overflow-hidden bg-green-700"
            :style="{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(gridSize * 50, 600)}px`
            }"
          >
            <div
              v-for="(cell, index) in jungleGrid"
              :key="index"
              class="aspect-square transition-all duration-300 flex items-center justify-center relative group z-10"
              :class="cell.tree ? 'hover:bg-green-900/30' : ''"
              @click="cell.tree ? selectTree(cell.tree) : null"
            >
              <!-- Tree or empty space -->
              <div v-if="cell.tree" class="cursor-pointer transform transition-transform duration-300 group-hover:scale-110">
                <div class="text-lg sm:text-2xl lg:text-3xl drop-shadow-sm">{{ getTreeEmoji(cell.tree) }}</div>
              </div>
              
              <!-- Hover tooltip -->
              <div v-if="cell.tree" class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                {{ getTreeTypeLabel(cell.tree) }}
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="trees.length === 0" class="text-center py-12 sm:py-16">
            <div class="text-6xl sm:text-8xl mb-4 sm:mb-6">🌱</div>
            <h3 class="text-2xl sm:text-3xl font-bold text-stone-900 mb-3 sm:mb-4">Your forest is waiting to grow!</h3>
            <p class="text-lg sm:text-xl text-stone-700 mb-4 sm:mb-6">Complete focus sessions to plant your first trees.</p>
            <p class="text-stone-600 text-sm sm:text-base">Each hour of focused work grows a new tree in your digital forest</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Week Daily Breakdown -->
    <div class="mb-8 sm:mb-10 lg:mb-12">
      <div class="relative">
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <h2 class="text-xl sm:text-2xl font-bold text-stone-900">This Week's Daily Focus</h2>
            <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 self-start sm:self-auto">
              <span class="text-xl sm:text-2xl">📅</span>
              <span class="text-base sm:text-lg font-bold text-stone-900">{{ formatTotalWeekTime }}</span>
              <span class="text-sm text-stone-600">this week</span>
            </div>
          </div>
          
          <!-- Daily Chart -->
          <div class="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50">
            <div class="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
              <div
                v-for="(day, index) in currentWeekData"
                :key="index"
                class="text-center cursor-pointer transition-all duration-200 hover:scale-105"
                @click="selectDay(day)"
              >
                <div class="text-xs text-stone-600 mb-2 sm:mb-3 font-medium truncate">{{ day.dayLabel }}</div>
                <div class="flex justify-center mb-2 sm:mb-3">
                  <div 
                    class="bg-gradient-to-t from-green-500 to-green-400 rounded-lg transition-all duration-500 shadow-sm hover:shadow-md relative"
                    :class="{ 
                      'ring-2 ring-green-600': selectedDayData?.date === day.date,
                      'opacity-50': day.hours === 0 
                    }"
                    :style="{ 
                      height: `${Math.max(day.hours * 20, 8)}px`,
                      width: '20px'
                    }"
                  >
                    <!-- Today indicator -->
                    <div v-if="day.isToday" class="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"></div>
                  </div>
                </div>
                <div class="text-xs text-stone-700 font-bold">{{ day.display }}</div>
                <div v-if="day.isToday" class="text-xs text-amber-600 font-medium mt-1">Today</div>
              </div>
            </div>
            <div class="text-center text-xs sm:text-sm text-stone-600">
              Daily focus hours for current week
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Focus Chart (Historical) -->
    <div class="mb-8 sm:mb-10 lg:mb-12">
      <div class="relative">
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <h2 class="text-xl sm:text-2xl font-bold text-stone-900">Weekly Focus Progress</h2>
            <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 self-start sm:self-auto">
              <span class="text-xl sm:text-2xl">⏰</span>
              <span class="text-base sm:text-lg font-bold text-stone-900">{{ formatTotalFocusTime }}</span>
              <span class="text-sm text-stone-600">total</span>
            </div>
          </div>
          
          <!-- Chart -->
          <div class="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50">
            <div class="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
              <div
                v-for="(week, index) in weeklyData"
                :key="index"
                class="text-center cursor-pointer transition-all duration-200 hover:scale-105"
                @click="selectWeek(week)"
              >
                <div class="text-xs text-stone-600 mb-2 sm:mb-3 font-medium">{{ week.label }}</div>
                <div class="flex justify-center mb-2 sm:mb-3">
                  <div 
                    class="bg-gradient-to-t from-amber-400 to-amber-300 rounded-lg transition-all duration-500 shadow-sm hover:shadow-md"
                    :class="{ 'ring-2 ring-amber-600': selectedWeekData?.label === week.label }"
                    :style="{ 
                      height: `${Math.max(week.percentage * 3, 12)}px`,
                      width: '20px'
                    }"
                  ></div>
                </div>
                <div class="text-xs text-stone-700 font-bold">{{ week.display }}</div>
              </div>
            </div>
            <div class="text-center text-xs sm:text-sm text-stone-600">
              Last 7 weeks of focus time
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Folder Focus Statistics -->
<div class="mb-8 sm:mb-10 lg:mb-12">
  <div class="relative">
    <!-- Glass morphism background -->
    <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"></div>
    
    <div class="relative z-10 p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <h2 class="text-xl sm:text-2xl font-bold text-stone-900">Focus by Project</h2>
        <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 self-start sm:self-auto">
          <span class="text-xl sm:text-2xl">📊</span>
          <span class="text-base sm:text-lg font-bold text-stone-900">{{ Object.keys(folderFocusTime).length }}</span>
          <span class="text-sm text-stone-600">projects</span>
        </div>
      </div>
      
      <!-- Folder Stats -->
      <div class="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50">
        <div v-if="Object.keys(folderFocusTime).length === 0" class="text-center py-8 text-stone-600">
          <div class="text-4xl sm:text-6xl mb-4">📁</div>
          <p class="font-medium text-base sm:text-lg">No project focus time yet</p>
          <p class="text-sm mt-1">Start focusing on projects to see your time breakdown</p>
        </div>
        
        <div v-else class="space-y-3 sm:space-y-4">
          <div
            v-for="(focusTime, folderId) in sortedFolderFocusTime"
            :key="folderId"
            class="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 transition-all duration-300 hover:bg-white/60 hover:shadow-lg"
          >
            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span class="text-white text-sm sm:text-base">📁</span>
              </div>
              <div class="min-w-0">
                <div class="font-medium text-stone-900 text-sm sm:text-base truncate">{{ getFolderNameById(folderId) }}</div>
                <div class="text-xs sm:text-sm text-stone-600">{{ formatDuration(focusTime) }} total</div>
              </div>
            </div>
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="text-right">
                <div class="text-lg sm:text-xl font-bold text-stone-900">{{ Math.floor(focusTime / 3600) }}h</div>
                <div class="text-xs text-stone-500">{{ Math.floor((focusTime % 3600) / 60) }}m</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    <!-- Day Detail Modal -->
    <div
      v-if="selectedDayData"
      @click="selectedDayData = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        @click.stop
        class="relative max-w-sm sm:max-w-lg w-full"
      >
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-6 sm:p-8">
          <div class="text-center mb-6">
            <div class="text-4xl sm:text-6xl mb-4">📊</div>
            <h3 class="text-xl sm:text-2xl font-bold text-stone-900">{{ selectedDayData.fullDate }}</h3>
            <p class="text-stone-600 mt-2 text-sm sm:text-base">Daily Focus Summary</p>
          </div>
          
          <div class="space-y-3 sm:space-y-4">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Total Focus Time:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedDayData.display }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Focus Sessions:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedDayData.sessionCount }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Trees Grown:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedDayData.treesGrown }}</span>
              </div>
            </div>
            
            <div v-if="selectedDayData.sessionCount > 0" class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Average Session:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedDayData.averageSession }}</span>
              </div>
            </div>
          </div>
          
          <button
            @click="selectedDayData = null"
            class="w-full mt-6 sm:mt-8 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Week Detail Modal -->
    <div
      v-if="selectedWeekData"
      @click="selectedWeekData = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        @click.stop
        class="relative max-w-sm sm:max-w-lg w-full"
      >
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-6 sm:p-8">
          <div class="text-center mb-6">
            <div class="text-4xl sm:text-6xl mb-4">📊</div>
            <h3 class="text-xl sm:text-2xl font-bold text-stone-900">{{ selectedWeekData.label }} Statistics</h3>
            <p class="text-stone-600 mt-2 text-sm sm:text-base">{{ selectedWeekData.dateRange }}</p>
          </div>
          
          <div class="space-y-3 sm:space-y-4">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Total Focus Time:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedWeekData.display }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Focus Sessions:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedWeekData.sessionCount }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Trees Grown:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedWeekData.treesGrown }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Average Session:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedWeekData.averageSession }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Daily Average:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ selectedWeekData.dailyAverage }}</span>
              </div>
            </div>
          </div>
          
          <button
            @click="selectedWeekData = null"
            class="w-full mt-6 sm:mt-8 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Tree Detail Modal -->
    <div
      v-if="selectedTree"
      @click="selectedTree = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        @click.stop
        class="relative max-w-sm sm:max-w-md w-full"
      >
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-6 sm:p-8">
          <div class="text-center mb-6">
            <div class="text-6xl sm:text-8xl mb-4">{{ getTreeEmoji(selectedTree) }}</div>
            <h3 class="text-xl sm:text-2xl font-bold text-stone-900">{{ getTreeTypeLabel(selectedTree) }}</h3>
          </div>
          
          <div class="space-y-3 sm:space-y-4">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Source:</span>
                <span class="font-bold text-stone-900 capitalize text-sm sm:text-base">{{ selectedTree.source }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Grown on:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ formatFullDate(selectedTree.grownAt) }}</span>
              </div>
            </div>
            
            <div v-if="selectedTree.duration" class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium text-sm sm:text-base">Focus time:</span>
                <span class="font-bold text-stone-900 text-sm sm:text-base">{{ formatDuration(selectedTree.duration) }}</span>
              </div>
            </div>
          </div>
          
          <button
            @click="selectedTree = null"
            class="w-full mt-6 sm:mt-8 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200 text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  trees: {
    type: Array,
    default: () => []
  },
  folderFocusTime: {
    type: Object,
    default: () => ({})
  },
  focusSessions: {
    type: Array,
    default: () => []
  }
})
// Reactive state
const selectedTree = ref(null)
const selectedWeekData = ref(null)
const selectedDayData = ref(null)
const gridSize = ref(8)

// Computed properties
const totalTrees = computed(() => props.trees.length)


const totalFocusTime = computed(() => {
  return props.focusSessions.reduce((total, session) => {
    const duration = typeof session.duration === 'string' 
      ? parseInt(session.duration, 10) 
      : (session.duration || 0)
    return total + duration
  }, 0)
})

const sortedFolderFocusTime = computed(() => {
  return Object.entries(props.folderFocusTime)
    .map(([folderId, focusTime]) => {
      // Convert string values to numbers
      const time = typeof focusTime === 'string' ? parseInt(focusTime, 10) : focusTime
      return [folderId, time]
    })
    .sort(([,a], [,b]) => b - a) // Sort by focus time descending
    .reduce((obj, [folderId, focusTime]) => {
      obj[folderId] = focusTime
      return obj
    }, {})
})

const formatTotalFocusTime = computed(() => {
  const totalSeconds = totalFocusTime.value
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
})

// Calculate dynamic grid size based on number of trees
const calculateGridSize = () => {
  const treeCount = props.trees.length
  if (treeCount === 0) return 8
  
  // Start with 8x8, grow as needed
  const minSize = 8
  const cellsNeeded = treeCount + Math.floor(treeCount * 0.3) // Add 30% empty space
  const size = Math.max(minSize, Math.ceil(Math.sqrt(cellsNeeded)))
  
  return Math.min(size, 12) // Max 12x12 grid
}

// Create jungle grid with trees in random positions
const jungleGrid = computed(() => {
  const size = calculateGridSize()
  gridSize.value = size
  
  const totalCells = size * size
  const grid = Array(totalCells).fill(null).map(() => ({ tree: null }))
  
  // Shuffle trees into random positions
  const shuffledTrees = [...props.trees].sort(() => Math.random() - 0.5)
  
  shuffledTrees.forEach((tree, index) => {
    if (index < totalCells) {
      grid[index].tree = tree
    }
  })
  
  // Shuffle the entire grid to randomize empty spaces too
  return grid.sort(() => Math.random() - 0.5)
})

const getFolderNameById = (folderId) => {
  const savedFolders = localStorage.getItem('taskFolders')
  if (savedFolders) {
    const folders = JSON.parse(savedFolders)
    const folder = folders.find(f => f.id === folderId)
    return folder ? folder.name : 'Unknown Project'
  }
  return 'Unknown Project'
}
// Current week daily data
const currentWeekData = computed(() => {
  const days = []
  const now = new Date()
  
  // Get start of current week (Monday)
  const weekStart = new Date(now)
  const dayOfWeek = now.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  weekStart.setDate(now.getDate() - daysFromMonday)
  weekStart.setHours(0, 0, 0, 0)
  
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart)
    currentDay.setDate(weekStart.getDate() + i)
    
    const dayEnd = new Date(currentDay)
    dayEnd.setHours(23, 59, 59, 999)
    
    // Calculate focus time for this day using sessions
    const daySessions = (props.focusSessions || []).filter(session => {
      if (!session || !session.completedAt) return false
      
      const sessionDate = new Date(session.completedAt)
      return sessionDate >= currentDay && sessionDate <= dayEnd
    })
    
    // Ensure duration is a valid number and reasonable (max 24 hours = 86400 seconds)
    const dayFocusTime = daySessions.reduce((total, session) => {
      let duration = session.duration || 0
      
      // Convert to number if it's a string
      if (typeof duration === 'string') {
        duration = parseInt(duration, 10) || 0
      }
      
      // Sanity check: duration should be reasonable (max 24 hours)
      if (duration > 86400) {
        console.warn(`Suspicious session duration detected: ${duration} seconds for session ${session.id}. Capping at 24 hours.`)
        duration = 86400
      }
      
      if (duration < 0) {
        console.warn(`Negative duration detected: ${duration} seconds for session ${session.id}. Setting to 0.`)
        duration = 0
      }
      
      return total + duration
    }, 0)
    
    const hours = Math.floor(dayFocusTime / 3600)
    const minutes = Math.floor((dayFocusTime % 3600) / 60)
    
    const averageSessionTime = daySessions.length > 0 
      ? dayFocusTime / daySessions.length 
      : 0
    const avgHours = Math.floor(averageSessionTime / 3600)
    const avgMinutes = Math.floor((averageSessionTime % 3600) / 60)
    
    const isToday = currentDay.toDateString() === now.toDateString()
    
    days.push({
      date: currentDay.toDateString(),
      dayLabel: dayLabels[i],
      hours: hours,
      minutes: minutes,
      totalSeconds: dayFocusTime,
      display: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      sessionCount: daySessions.length,
      treesGrown: (props.trees || []).filter(tree => {
        if (!tree || !tree.grownAt) return false
        const treeDate = new Date(tree.grownAt)
        return treeDate >= currentDay && treeDate <= dayEnd
      }).length,
      averageSession: avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes}m`,
      fullDate: currentDay.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric'
      }),
      isToday
    })
  }
  
  return days
})

// Also add this data cleanup function to your component:
const cleanupFocusData = () => {
  // Check for corrupted focus sessions
  if (props.focusSessions) {
    const corruptedSessions = props.focusSessions.filter(session => {
      const duration = typeof session.duration === 'string' ? parseInt(session.duration, 10) : session.duration
      return duration > 86400 || duration < 0 || isNaN(duration)
    })
    
    if (corruptedSessions.length > 0) {
      console.warn('Found corrupted focus sessions:', corruptedSessions)
      alert(`Found ${corruptedSessions.length} corrupted focus sessions. Please check your data or reset if needed.`)
    }
  }
}

const formatTotalWeekTime = computed(() => {
  const totalSeconds = currentWeekData.value.reduce((total, day) => total + day.totalSeconds, 0)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
})

const debugWeekData = computed(() => {
  console.log('Current week data:', currentWeekData.value)
  console.log('Focus sessions:', props.focusSessions)
  const totalSeconds = currentWeekData.value.reduce((total, day) => total + day.totalSeconds, 0)
  console.log('Total seconds this week:', totalSeconds)
  return totalSeconds
})


// Weekly focus data for chart
const weeklyData = computed(() => {
  const weeks = []
  const now = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const weekStart = new Date(now)
    const currentDayOfWeek = now.getDay()
    const daysFromMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1
    weekStart.setDate(now.getDate() - daysFromMonday - (i * 7))
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6) // Sunday is 6 days after Monday
    weekEnd.setHours(23, 59, 59, 999)
    
    // Calculate focus time for this week
    const weekSessions = (props.focusSessions || []).filter(session => {
      if (!session || !session.completedAt) return false
      const sessionDate = new Date(session.completedAt)
      return sessionDate >= weekStart && sessionDate <= weekEnd
    })

    // FIXED: Ensure durations are valid numbers
    const weekFocusTime = weekSessions.reduce((total, session) => {
      let duration = session.duration || 0
      
      // Convert to number if it's a string
      if (typeof duration === 'string') {
        duration = parseInt(duration, 10) || 0
      }
      
      // Sanity check: duration should be reasonable (max 24 hours)
      if (duration > 86400) {
        console.warn(`Suspicious session duration detected: ${duration} seconds for session ${session.id}. Capping at 24 hours.`)
        duration = 86400
      }
      
      if (duration < 0) {
        console.warn(`Negative duration detected: ${duration} seconds for session ${session.id}. Setting to 0.`)
        duration = 0
      }
      
      return total + duration
    }, 0)

    const hours = Math.floor(weekFocusTime / 3600)
    const minutes = Math.floor((weekFocusTime % 3600) / 60)
    
    const averageSessionTime = weekSessions.length > 0 
      ? weekFocusTime / weekSessions.length 
      : 0
    const avgHours = Math.floor(averageSessionTime / 3600)
    const avgMinutes = Math.floor((averageSessionTime % 3600) / 60)
    
    const dailyAverageTime = weekFocusTime / 7
    const dailyHours = Math.floor(dailyAverageTime / 3600)
    const dailyMinutes = Math.floor((dailyAverageTime % 3600) / 60)
    
    // FIXED: Better percentage calculation for chart height
    // Use minutes for better scaling of small durations
    const totalMinutes = Math.floor(weekFocusTime / 60)
    const maxMinutesForChart = 240 // 4 hours max for chart scaling
    const percentage = Math.min((totalMinutes / maxMinutesForChart) * 100, 100)
    
    console.log(`Week ${i}: ${weekFocusTime} seconds = ${hours}h ${minutes}m, percentage: ${percentage}`)
    
    weeks.push({
      label: i === 0 ? 'This Week' : `${i}w ago`,
      hours: hours,
      minutes: minutes,
      totalSeconds: weekFocusTime,
      display: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      percentage: percentage, // This is just for chart height, not the actual time
      sessionCount: weekSessions.length,
      treesGrown: (props.trees || []).filter(tree => {
        if (!tree || !tree.grownAt) return false
        const treeDate = new Date(tree.grownAt)
        return treeDate >= weekStart && treeDate <= weekEnd
      }).length,
      averageSession: avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes}m`,
      dailyAverage: dailyHours > 0 ? `${dailyHours}h ${dailyMinutes}m` : `${dailyMinutes}m`,
      dateRange: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    })
  }
  
  return weeks
})
// Methods
const getTreeEmoji = (tree) => {
  const duration = tree.duration || 0
  const hours = Math.floor(duration / 3600)
  
  if (hours < 1) return '🌱'
  if (hours < 2) return '🌿'
  if (hours < 4) return '🌳'
  return '🌲'
}

const getTreeTypeLabel = (tree) => {
  const duration = tree.duration || 0
  const hours = Math.floor(duration / 3600)
  
  if (hours < 1) return 'Young Sprout'
  if (hours < 2) return 'Growing Sapling'
  if (hours < 4) return 'Mature Tree'
  return 'Ancient Oak'
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

const formatFullDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

const selectTree = (tree) => {
  selectedTree.value = tree
}

const selectWeek = (week) => {
  selectedWeekData.value = week
}

const selectDay = (day) => {
  selectedDayData.value = day
}
</script>

<style scoped>
.grid {
  display: grid;
}

/* Custom scrollbar for modals */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(245, 158, 11, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(245, 158, 11, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(245, 158, 11, 0.5);
}
</style>