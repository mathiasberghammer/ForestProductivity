<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-stone-900 mb-3 tracking-tight">My Forest</h1>
      <p class="text-xl text-stone-700 opacity-80">Every tree represents your focus and productivity achievements</p>
    </div>

    <!-- Jungle Grid -->
    <div class="mb-12">
      <div class="relative">
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-8">
          <!-- Jungle Grid -->
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-stone-900">Your Digital Forest</h2>
            <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/50">
              <span class="text-2xl">🌳</span>
              <span class="text-lg font-bold text-stone-900">{{ totalTrees }}</span>
              <span class="text-sm text-stone-600">trees</span>
            </div>
          </div>
          
          <div 
            class="grid mx-auto p-6 rounded-2xl border-2 border-[#506c38] shadow-inner relative overflow-hidden"
            :style="{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(gridSize * 60, 600)}px`,
              backgroundColor: '#606c38',
            }"
          >
            <div
              v-for="(cell, index) in jungleGrid"
              :key="index"
              class="aspect-square transition-all duration-300 flex items-center justify-center relative group z-10"
              :class="cell.tree ? 'bg-[#606c38] hover:bg-green-900/30' : ''"
              @click="cell.tree ? selectTree(cell.tree) : null"
            >
              <!-- Tree or empty space -->
              <div v-if="cell.tree" class="cursor-pointer transform transition-transform duration-300 group-hover:scale-110">
                <div class="text-2xl sm:text-3xl drop-shadow-sm">{{ getTreeEmoji(cell.tree) }}</div>
              </div>
              
              <!-- Hover tooltip -->
              <div v-if="cell.tree" class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                {{ getTreeTypeLabel(cell.tree) }}
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="trees.length === 0" class="text-center py-16">
            <div class="text-8xl mb-6">🌱</div>
            <h3 class="text-3xl font-bold text-stone-900 mb-4">Your forest is waiting to grow!</h3>
            <p class="text-xl text-stone-700 mb-6">Complete focus sessions to plant your first trees.</p>
            <p class="text-stone-600">Each hour of focused work grows a new tree in your digital forest</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Focus Chart (Always Open) -->
    <div class="mb-12">
      <div class="relative">
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-8">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-stone-900">Weekly Focus Progress</h2>
            <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/50">
              <span class="text-2xl">⏰</span>
              <span class="text-lg font-bold text-stone-900">{{ formatTotalFocusTime }}</span>
              <span class="text-sm text-stone-600">total</span>
            </div>
          </div>
          
          <!-- Chart -->
          <div class="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
            <div class="grid grid-cols-7 gap-4 mb-4">
              <div
                v-for="(week, index) in weeklyData"
                :key="index"
                class="text-center cursor-pointer transition-all duration-200 hover:scale-105"
                @click="selectWeek(week)"
              >
                <div class="text-xs text-stone-600 mb-3 font-medium">{{ week.label }}</div>
                <div class="flex justify-center mb-3">
                  <div 
                    class="bg-gradient-to-t from-amber-400 to-amber-300 rounded-lg transition-all duration-500 shadow-sm hover:shadow-md"
                    :class="{ 'ring-2 ring-amber-600': selectedWeekData?.label === week.label }"
                    :style="{ 
                      height: `${Math.max(week.percentage * 3, 12)}px`,
                      width: '32px'
                    }"
                  ></div>
                </div>
                <div class="text-xs text-stone-700 font-bold">{{ week.display }}</div>
              </div>
            </div>
            <div class="text-center text-sm text-stone-600">
              Last 7 weeks of focus time
            </div>
          </div>
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
        class="relative max-w-lg w-full"
      >
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-8">
          <div class="text-center mb-6">
            <div class="text-6xl mb-4">📊</div>
            <h3 class="text-2xl font-bold text-stone-900">{{ selectedWeekData.label }} Statistics</h3>
            <p class="text-stone-600 mt-2">{{ selectedWeekData.dateRange }}</p>
          </div>
          
          <div class="space-y-4">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Total Focus Time:</span>
                <span class="font-bold text-stone-900">{{ selectedWeekData.display }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Focus Sessions:</span>
                <span class="font-bold text-stone-900">{{ selectedWeekData.sessionCount }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Trees Grown:</span>
                <span class="font-bold text-stone-900">{{ selectedWeekData.treesGrown }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Average Session:</span>
                <span class="font-bold text-stone-900">{{ selectedWeekData.averageSession }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Daily Average:</span>
                <span class="font-bold text-stone-900">{{ selectedWeekData.dailyAverage }}</span>
              </div>
            </div>
          </div>
          
          <button
            @click="selectedWeekData = null"
            class="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200"
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
        class="relative max-w-md w-full"
      >
        <!-- Glass morphism background -->
        <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"></div>
        
        <div class="relative z-10 p-8">
          <div class="text-center mb-6">
            <div class="text-8xl mb-4">{{ getTreeEmoji(selectedTree) }}</div>
            <h3 class="text-2xl font-bold text-stone-900">{{ getTreeTypeLabel(selectedTree) }}</h3>
          </div>
          
          <div class="space-y-4">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Source:</span>
                <span class="font-bold text-stone-900 capitalize">{{ selectedTree.source }}</span>
              </div>
            </div>
            
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Grown on:</span>
                <span class="font-bold text-stone-900">{{ formatFullDate(selectedTree.grownAt) }}</span>
              </div>
            </div>
            
            <div v-if="selectedTree.duration" class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div class="flex justify-between items-center">
                <span class="text-stone-700 font-medium">Focus time:</span>
                <span class="font-bold text-stone-900">{{ formatDuration(selectedTree.duration) }}</span>
              </div>
            </div>
          </div>
          
          <button
            @click="selectedTree = null"
            class="w-full mt-8 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  trees: {
    type: Array,
    default: () => []
  }
})

// Reactive state
const selectedTree = ref(null)
const selectedWeekData = ref(null)
const gridSize = ref(8)

// Computed properties
const totalTrees = computed(() => props.trees.length)

const totalFocusTime = computed(() => {
  return props.trees.reduce((total, tree) => total + (tree.duration || 0), 0)
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

// Weekly focus data for chart
const weeklyData = computed(() => {
  const weeks = []
  const now = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (i * 7))
    weekStart.setHours(0, 0, 0, 0)
    
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    
    // Calculate focus time for this week
    const weekTrees = props.trees.filter(tree => {
      const treeDate = new Date(tree.grownAt)
      return treeDate >= weekStart && treeDate <= weekEnd
    })
    
    const weekFocusTime = weekTrees.reduce((total, tree) => total + (tree.duration || 0), 0)
    const hours = Math.floor(weekFocusTime / 3600)
    const minutes = Math.floor((weekFocusTime % 3600) / 60)
    
    const averageSessionTime = weekTrees.length > 0 
      ? weekFocusTime / weekTrees.length 
      : 0
    const avgHours = Math.floor(averageSessionTime / 3600)
    const avgMinutes = Math.floor((averageSessionTime % 3600) / 60)
    
    const dailyAverageTime = weekFocusTime / 7
    const dailyHours = Math.floor(dailyAverageTime / 3600)
    const dailyMinutes = Math.floor((dailyAverageTime % 3600) / 60)
    
    weeks.push({
      label: i === 0 ? 'This Week' : `${i}w ago`,
      hours: hours,
      minutes: minutes,
      totalSeconds: weekFocusTime,
      display: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      percentage: Math.min(weekFocusTime / 3600, 100), // Max 100 hours for scaling
      sessionCount: weekTrees.length,
      treesGrown: weekTrees.length,
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