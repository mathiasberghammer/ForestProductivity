<template>
  <!-- Isometric Game Board Style Grid -->
  <div class="mb-8 sm:mb-10 lg:mb-12">
    <div class="relative">
      <!-- Glass morphism background -->
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6 sm:p-8">
        <!-- Grid Header -->
        <!-- Updated Grid Header with Density Indicator -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
  <h2 class="text-xl sm:text-2xl font-bold text-stone-900">
    Your Digital Forest
  </h2>
  <div class="flex items-center gap-4 flex-wrap">
    <!-- Jungle Generation Selector -->
    <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 cursor-pointer hover:bg-white/70 transition-all duration-200" 
     @click="showJungleSelector = true">
  <span class="text-lg">🌍</span>
  <span class="text-sm font-medium text-stone-900">{{ getCurrentJungle()?.name || 'Current Jungle' }}</span>
  <span v-if="getCurrentJungle()?.completedAt" class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">VIEWING</span>
  <span class="text-xs text-stone-600">({{ totalTrees }}/{{ MAX_JUNGLE_CAPACITY }})</span>
  <span class="text-xs">▼</span>
</div>

    
    
    <!-- Total trees counter with completion progress -->
    <div class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50">
      <span class="text-xl sm:text-2xl">🌳</span>
      <span class="text-base sm:text-lg font-bold text-stone-900">{{ totalTrees }}</span>
      <span class="text-sm text-stone-600">trees</span>
      <div v-if="isCurrentJungleFull" class="ml-2 px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
        FULL
      </div>
    </div>
  </div>
</div>


        <!-- Updated Grid Container with Dynamic Sizing -->
        <div
          class="flex justify-center items-center"
          style="perspective: 1500px"
        >
          <div
            class="relative grid transition-all duration-700 ease-in-out"
            :style="{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
              transform: 'rotateX(60deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d',
            }"
          >
            <!-- Isometric 3D Tiles with Dynamic Sizing -->
            <div
              v-for="(cell, index) in jungleGrid"
              :key="index"
              class="relative transition-all duration-700 ease-in-out"
              :class="getGridCellSize(displayedTrees.length)"
              style="transform-style: preserve-3d"
            >
              <!-- Tile Container -->
              <div class="relative w-full h-full">
                <!-- Top surface with image background -->
                <div
                  class="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
                  style="
                    background-image: url('/bg.png');
                    background-size: cover;
                    background-position: center;
                    transform: translateZ(6px);
                  "
                >
                  <!-- Optional texture overlay -->
                  <div
                    class="w-full h-full opacity-20"
                    style="
                      background-image: radial-gradient(
                          circle at 25% 25%,
                          rgba(85, 139, 47, 0.8) 1px,
                          transparent 2px
                        ),
                        radial-gradient(
                          circle at 75% 75%,
                          rgba(107, 142, 35, 0.6) 1px,
                          transparent 2px
                        );
                      background-size: 8px 8px, 12px 12px;
                    "
                  ></div>
                </div>
              </div>
            </div>

            <!-- Trees positioned on top with Dynamic Sizing -->
            <div
              v-for="(cell, index) in jungleGrid.filter((cell) => cell.tree)"
              :key="`tree-${index}`"
              class="absolute flex items-center justify-center transition-all duration-700 ease-in-out"
              :class="getGridCellSize(totalTrees)"
              :style="{
                gridColumn: (jungleGrid.indexOf(cell) % gridSize) + 1,
                gridRow: Math.floor(jungleGrid.indexOf(cell) / gridSize) + 1,
                transform: 'rotateZ(-45deg) rotateX(-60deg) translateZ(25px)',
                zIndex: 1000 + index,
              }"
            >
              <img
                :src="getTreeImage(cell.tree)"
                :alt="getTreeName(cell.tree)"
                class="transition-all duration-700 ease-in-out"
                :class="getTreeImageSize(displayedTrees.length, cell.tree.treeType || cell.tree.type)"
                :style="{
                  filter: getTreeFilter(cell.tree),
                }"
                :title="`${getTreeName(cell.tree)} - ${formatDuration(
                  cell.tree.duration || 0
                )}`"
              />
            </div>
          </div>
        </div>

        <!-- Optional: Forest Growth Milestone Notifications -->
        <div v-if="shouldShowMilestone()" class="mt-6 text-center">
          <div
            class="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-xl p-4 mx-auto max-w-md"
          >
            <div class="text-2xl mb-2">🎉</div>
            <div class="text-sm font-bold text-green-800">
              Forest Milestone Reached!
            </div>
            <div class="text-xs text-green-700 mt-1">
              Your forest expanded to {{ gridSize }}×{{ gridSize }} grid
            </div>
          </div>
        </div>

        <!-- Proper Isometric 3D Game Board - Corner View, No Gaps 
        <div
          class="flex justify-center items-center"
          style="perspective: 1500px"
        >
          <div
            class="relative grid"
            :style="{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
              transform: 'rotateX(60deg) rotateZ(45deg)',
              transformStyle: 'preserve-3d',
            }"
          >
            <div
              v-for="(cell, index) in jungleGrid"
              :key="index"
              class="relative w-16 h-16 sm:w-20 sm:h-20"
              style="transform-style: preserve-3d"
            >
              <div class="relative w-full h-full">
                <div
                  class="absolute inset-0 w-full h-full"
                  style="
                    background-image: url('/bg.png');
                    background-size: cover;
                    background-position: center;
                    
                    transform: translateZ(6px);
                  "
                >
                  <div
                    class="w-full h-full opacity-20"
                    style="
                      background-image: radial-gradient(
                          circle at 25% 25%,
                          rgba(85, 139, 47, 0.8) 1px,
                          transparent 2px
                        ),
                        radial-gradient(
                          circle at 75% 75%,
                          rgba(107, 142, 35, 0.6) 1px,
                          transparent 2px
                        );
                      background-size: 8px 8px, 12px 12px;
                    "
                  ></div>
                </div>
              </div>
            </div>


            <div
              v-for="(cell, index) in jungleGrid.filter((cell) => cell.tree)"
              :key="`tree-${index}`"
              class="absolute w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
              :style="{
                gridColumn: (jungleGrid.indexOf(cell) % gridSize) + 1,
                gridRow: Math.floor(jungleGrid.indexOf(cell) / gridSize) + 1,
                transform: 'rotateZ(-45deg) rotateX(-60deg) translateZ(25px)',
                zIndex: 1000 + index,
              }"
            >
              <img
                :src="getTreeImage(cell.tree)"
                :alt="getTreeName(cell.tree)"
                class="transition-all duration-200"
                :class="[
                  cell.tree.treeType === 'pothos' ||
                  cell.tree.type === 'pothos' ||
                  cell.tree.treeType === 'monstera' ||
                  cell.tree.type === 'monstera' ||
                  cell.tree.treeType === 'mushroom' ||
                  cell.tree.type === 'mushroom' ||
                  cell.tree.treeType === 'fern' ||
                  cell.tree.type === 'fern'
                    ? 'mb-8 w-14 h-14 sm:w-8 sm:h-8 lg:w-14 lg:h-14'
                    : 'mb-24 w-24 h-24 sm:w-14 sm:h-14 lg:w-44 lg:h-40',
                  'transition-all duration-200',
                ]"
                :style="{
                  filter: getTreeFilter(cell.tree),
                }"
                :title="`${getTreeName(cell.tree)} - ${formatDuration(
                  cell.tree.duration || 0
                )}`"
              />
            </div>
          </div>
        </div>-->

        <!-- Empty State -->
        <div v-if="displayedTrees.length === 0" class="text-center py-8 mt-8">
          <div class="text-6xl mb-4">🌱</div>
          <h3 class="text-2xl font-bold text-stone-900 mb-3">
            Your forest is waiting to grow!
          </h3>
          <p class="text-lg text-stone-700 mb-4">
            Complete focus sessions to plant your first trees.
          </p>
          <p class="text-stone-600 text-sm">
            Each hour of focused work grows a new tree in your digital forest
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Current Week Daily Breakdown -->
  <div class="mb-8 sm:mb-10 lg:mb-12">
    <div class="relative">
      <!-- Glass morphism background -->
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6 sm:p-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4"
        >
          <h2 class="text-xl sm:text-2xl font-bold text-stone-900">
            This Week's Daily Focus
          </h2>
          <div
            class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 self-start sm:self-auto"
          >
            <span class="text-xl sm:text-2xl">📅</span>
            <span class="text-base sm:text-lg font-bold text-stone-900">{{
              formatTotalWeekTime
            }}</span>
            <span class="text-sm text-stone-600">this week</span>
          </div>
        </div>

        <!-- Daily Chart -->
        <div
          class="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50"
        >
          <div class="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
            <div
              v-for="(day, index) in currentWeekData"
              :key="index"
              class="text-center cursor-pointer transition-all duration-200 hover:scale-105"
              @click="selectDay(day)"
            >
              <div
                class="text-xs text-stone-600 mb-2 sm:mb-3 font-medium truncate"
              >
                {{ day.dayLabel }}
              </div>
              <div class="flex justify-center mb-2 sm:mb-3">
                <div
                  class="bg-gradient-to-t from-green-500 to-green-400 rounded-lg transition-all duration-500 shadow-sm hover:shadow-md relative"
                  :class="{
                    'ring-2 ring-green-600': selectedDayData?.date === day.date,
                    'opacity-50': day.hours === 0,
                  }"
                  :style="{
                    height: `${Math.max(day.hours * 20, 8)}px`,
                    width: '20px',
                  }"
                >
                  <!-- Today indicator -->
                  <div
                    v-if="day.isToday"
                    class="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full"
                  ></div>
                </div>
              </div>
              <div class="text-xs text-stone-700 font-bold">
                {{ day.display }}
              </div>
              <div
                v-if="day.isToday"
                class="text-xs text-amber-600 font-medium mt-1"
              >
                Today
              </div>
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
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6 sm:p-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4"
        >
          <h2 class="text-xl sm:text-2xl font-bold text-stone-900">
            Weekly Focus Progress
          </h2>
          <div
            class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 self-start sm:self-auto"
          >
            <span class="text-xl sm:text-2xl">⏰</span>
            <span class="text-base sm:text-lg font-bold text-stone-900">{{
              formatTotalFocusTime
            }}</span>
            <span class="text-sm text-stone-600">total</span>
          </div>
        </div>

        <!-- Chart -->
        <div
          class="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50"
        >
          <div class="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
            <div
              v-for="(week, index) in weeklyData"
              :key="index"
              class="text-center cursor-pointer transition-all duration-200 hover:scale-105"
              @click="selectWeek(week)"
            >
              <div class="text-xs text-stone-600 mb-2 sm:mb-3 font-medium">
                {{ week.label }}
              </div>
              <div class="flex justify-center mb-2 sm:mb-3">
                <div
                  class="bg-gradient-to-t from-amber-400 to-amber-300 rounded-lg transition-all duration-500 shadow-sm hover:shadow-md"
                  :class="{
                    'ring-2 ring-amber-600':
                      selectedWeekData?.label === week.label,
                  }"
                  :style="{
                    height: `${Math.max(week.percentage * 3, 12)}px`,
                    width: '20px',
                  }"
                ></div>
              </div>
              <div class="text-xs text-stone-700 font-bold">
                {{ week.display }}
              </div>
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
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6 sm:p-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4"
        >
          <h2 class="text-xl sm:text-2xl font-bold text-stone-900">
            Focus by Project
          </h2>
          <div
            class="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 sm:px-4 py-2 border border-white/50 self-start sm:self-auto"
          >
            <span class="text-xl sm:text-2xl">📊</span>
            <span class="text-base sm:text-lg font-bold text-stone-900">{{
              Object.keys(folderFocusTime).length
            }}</span>
            <span class="text-sm text-stone-600">projects</span>
          </div>
        </div>

        <!-- Folder Stats -->
        <div
          class="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50"
        >
          <!-- Empty State -->
          <div
            v-if="Object.keys(folderFocusTime).length === 0"
            class="text-center py-8 text-stone-600"
          >
            <div class="relative mb-4">
              <div
                class="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span class="text-3xl">📊</span>
              </div>
              <div
                class="absolute -top-1 -right-1 w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center"
              >
                <span class="text-sm">📁</span>
              </div>
            </div>
            <h3 class="text-lg font-bold text-stone-900 mb-2">
              No project focus time yet
            </h3>
            <p class="text-stone-600 mb-3">
              Start focusing on projects to see your detailed time breakdown
            </p>
            <div
              class="inline-flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200"
            >
              <span>💡</span>
              <span>Select a project when you start your focus timer</span>
            </div>
          </div>

          <!-- Focus Statistics -->
          <div v-else class="divide-y divide-white/40 space-y-0">
            <div
              v-for="(focusTime, folderId, index) in sortedFolderFocusTime"
              :key="folderId"
              class="py-4"
              :class="{ 'pt-0': index === 0 }"
            >
              <div class="px-2">
                <div class="flex items-center justify-between">
                  <!-- Left side: Folder info -->
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <!-- Folder icon with dynamic color -->
                    <div
                      class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md transition-transform duration-300"
                      :style="{
                        backgroundColor: getFolderColorById(folderId),
                      }"
                    >
                      <span class="text-white text-base sm:text-lg">{{
                        getFolderEmojiById(folderId)
                      }}</span>
                    </div>

                    <!-- Folder details -->
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h4
                          class="font-bold text-stone-900 text-sm sm:text-base truncate"
                        >
                          {{ getFolderNameById(folderId) }}
                        </h4>
                        <div
                          class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
                          title="Recently active"
                        ></div>
                      </div>
                      <div class="text-xs text-stone-600">
                        {{ formatDuration(focusTime) }} total
                      </div>
                    </div>
                  </div>

                  <!-- Right side: Time display -->
                  <div class="flex flex-col items-end gap-1 ml-3">
                    <!-- Large time display -->
                    <div class="text-right">
                      <div
                        class="text-xl sm:text-2xl font-bold text-stone-900 leading-none"
                      >
                        {{ Math.floor(focusTime / 3600)
                        }}<span class="text-sm text-stone-600">h</span>
                      </div>
                      <div class="text-xs text-stone-500">
                        {{ Math.floor((focusTime % 3600) / 60) }}m
                      </div>
                    </div>

                    <!-- Focus sessions indicator -->
                    <div
                      class="flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full"
                    >
                      <span>🎯</span>
                      <span>{{ getFocusSessionCount(folderId) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Progress Bar -->
                <div class="mt-3 pt-2 border-t border-white/30">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs text-stone-600">Project share</span>
                    <span class="text-xs font-bold text-stone-900"
                      >{{ getProjectPercentage(focusTime) }}%</span
                    >
                  </div>
                  <div
                    class="w-full bg-white/40 rounded-full h-2 overflow-hidden shadow-inner mb-3"
                  >
                    <div
                      class="h-full rounded-full transition-all duration-500 shadow-sm"
                      :style="{
                        width: getProjectPercentage(focusTime) + '%',
                        backgroundColor: getFolderColorById(folderId),
                      }"
                    ></div>
                  </div>
                </div>

                <!-- Stats always visible -->
                <div class="border-t border-white/30 pt-3">
                  <div class="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div class="text-sm font-bold text-stone-900">
                        {{ getAverageSessionTime(folderId) }}
                      </div>
                      <div class="text-xs text-stone-600">Avg session</div>
                    </div>
                    <div
                      class="cursor-pointer hover:bg-white/20 rounded-lg p-1 transition-colors duration-200"
                      @click="showMonthlyHistory(folderId)"
                      title="View monthly history"
                    >
                      <div class="text-sm font-bold text-stone-900">
                        {{ getThisMonthFocus(folderId) }}
                      </div>
                      <div class="text-xs text-stone-600 text-center mt-1">
                        <span>This month</span>
                      </div>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-stone-900">
                        {{ getTreesGrown(folderId) }}
                      </div>
                      <div class="text-xs text-stone-600">Trees grown</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary stats at bottom -->
            <div class="mt-6 pt-4 border-t border-white/50">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div class="bg-white/40 rounded-lg p-2.5">
                  <div class="text-lg font-bold text-stone-900">
                    {{ Object.keys(sortedFolderFocusTime).length }}
                  </div>
                  <div class="text-xs text-stone-600">Active Projects</div>
                </div>
                <div class="bg-white/40 rounded-lg p-2.5">
                  <div class="text-lg font-bold text-stone-900">
                    {{ getTotalFocusTime() }}
                  </div>
                  <div class="text-xs text-stone-600">Total Time</div>
                </div>
                <div class="bg-white/40 rounded-lg p-2.5">
                  <div class="text-lg font-bold text-stone-900">
                    {{ getMostProductiveProject() }}
                  </div>
                  <div class="text-xs text-stone-600">Top Project</div>
                </div>
                <div class="bg-white/40 rounded-lg p-2.5">
                  <div class="text-lg font-bold text-stone-900">
                    {{ getAverageDaily() }}
                  </div>
                  <div class="text-xs text-stone-600">Daily Avg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Monthly History Modal -->
    <div
      v-if="selectedProjectHistory"
      @click="selectedProjectHistory = null"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        @click.stop
        class="relative max-w-md w-full max-h-[80vh] overflow-hidden"
      >
        <!-- Glass morphism background -->
        <div
          class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl"
        ></div>

        <div class="relative z-10 p-6">
          <div class="text-center mb-6">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-bold text-stone-900">
              {{ getFolderNameById(selectedProjectHistory) }}
            </h3>
            <p class="text-stone-600 mt-2 text-sm">Monthly Focus History</p>
          </div>

          <div class="max-h-60 overflow-y-auto space-y-3 mb-6">
            <div
              v-for="monthData in getMonthlyHistory(selectedProjectHistory)"
              :key="monthData.key"
              class="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/50"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-stone-900 text-sm">{{
                  monthData.label
                }}</span>
                <span class="font-bold text-stone-900 text-sm">{{
                  monthData.display
                }}</span>
              </div>
              <div class="w-full bg-white/40 rounded-full h-2 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{
                    width: monthData.percentage + '%',
                    backgroundColor: getFolderColorById(selectedProjectHistory),
                  }"
                ></div>
              </div>
              <div
                class="flex justify-between items-center mt-1 text-xs text-stone-600"
              >
                <span>{{ monthData.sessions }} sessions</span>
                <span>{{ monthData.percentage }}% of peak</span>
              </div>
            </div>

            <div
              v-if="getMonthlyHistory(selectedProjectHistory).length === 0"
              class="text-center py-8 text-stone-600"
            >
              <div class="text-4xl mb-3">📅</div>
              <p class="text-sm">No focus history yet</p>
            </div>
          </div>

          <button
            @click="selectedProjectHistory = null"
            class="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Close
          </button>
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
    <div @click.stop class="relative max-w-sm sm:max-w-lg w-full">
      <!-- Glass morphism background -->
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6 sm:p-8">
        <div class="text-center mb-6">
          <div class="text-4xl sm:text-6xl mb-4">📊</div>
          <h3 class="text-xl sm:text-2xl font-bold text-stone-900">
            {{ selectedDayData.fullDate }}
          </h3>
          <p class="text-stone-600 mt-2 text-sm sm:text-base">
            Daily Focus Summary
          </p>
        </div>

        <div class="space-y-3 sm:space-y-4">
          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Total Focus Time:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedDayData.display
              }}</span>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Focus Sessions:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedDayData.sessionCount
              }}</span>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Trees Grown:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedDayData.treesGrown
              }}</span>
            </div>
          </div>

          <div
            v-if="selectedDayData.sessionCount > 0"
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Average Session:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedDayData.averageSession
              }}</span>
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
    <div @click.stop class="relative max-w-sm sm:max-w-lg w-full">
      <!-- Glass morphism background -->
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6 sm:p-8">
        <div class="text-center mb-6">
          <div class="text-4xl sm:text-6xl mb-4">📊</div>
          <h3 class="text-xl sm:text-2xl font-bold text-stone-900">
            {{ selectedWeekData.label }} Statistics
          </h3>
          <p class="text-stone-600 mt-2 text-sm sm:text-base">
            {{ selectedWeekData.dateRange }}
          </p>
        </div>

        <div class="space-y-3 sm:space-y-4">
          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Total Focus Time:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedWeekData.display
              }}</span>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Focus Sessions:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedWeekData.sessionCount
              }}</span>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Trees Grown:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedWeekData.treesGrown
              }}</span>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Average Session:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedWeekData.averageSession
              }}</span>
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Daily Average:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                selectedWeekData.dailyAverage
              }}</span>
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

  <!-- Tree Varieties Modal -->
  <div
    v-if="showVarietiesModal"
    @click="showVarietiesModal = false"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      @click.stop
      class="relative max-w-md w-full max-h-[80vh] overflow-hidden"
    >
      <!-- Glass morphism background -->
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6">
        <div class="text-center mb-6">
          <div class="text-4xl mb-4">🌿</div>
          <h3 class="text-xl font-bold text-stone-900">Your Tree Varieties</h3>
          <p class="text-stone-600 mt-2 text-sm">
            {{ getTreeVarietyCount() }} different species in your forest
          </p>
        </div>

        <div class="max-h-60 overflow-y-auto space-y-3 mb-6">
          <div
            v-for="variety in getTreeVarieties()"
            :key="variety.id"
            class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 transition-all duration-200 hover:bg-white/70"
          >
            <div class="flex items-center gap-4">
              <!-- Tree Image -->
              <div class="flex-shrink-0">
                <img
                  :src="variety.image"
                  :alt="variety.name"
                  class="w-12 h-12 object-contain rounded-lg"
                />
              </div>

              <!-- Tree Info -->
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-bold text-stone-900 text-sm">
                    {{ variety.name }}
                  </h4>
                  <span
                    class="text-xs text-stone-600 bg-stone-100 px-2 py-1 rounded-full font-medium"
                  >
                    {{ variety.count }}
                  </span>
                </div>
                <div class="text-xs text-stone-600">
                  {{
                    variety.count === 1 ? "1 tree" : `${variety.count} trees`
                  }}
                  grown
                </div>

                <!-- Progress bar showing percentage of total trees -->
                <div class="mt-2">
                  <div
                    class="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden"
                  >
                    <div
                      class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                      :style="{
                        width: (variety.count / totalTrees) * 100 + '%',
                      }"
                    ></div>
                  </div>
                  <div class="text-xs text-stone-500 mt-1">
                    {{ Math.round((variety.count / totalTrees) * 100) }}% of
                    your forest
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="getTreeVarieties().length === 0"
            class="text-center py-8 text-stone-600"
          >
            <div class="text-4xl mb-3">🌱</div>
            <p class="text-sm">No trees grown yet</p>
            <p class="text-xs text-stone-500 mt-1">
              Start focusing to grow your first tree!
            </p>
          </div>
        </div>

        <!-- Summary Stats -->
        <div
          v-if="getTreeVarieties().length > 0"
          class="bg-white/40 rounded-xl p-3 mb-4"
        >
          <div class="grid grid-cols-3 gap-3 text-center">
            <div>
              <div class="text-lg font-bold text-stone-900">
                {{ totalTrees }}
              </div>
              <div class="text-xs text-stone-600">Total Trees</div>
            </div>
            <div>
              <div class="text-lg font-bold text-stone-900">
                {{ getTreeVarietyCount() }}
              </div>
              <div class="text-xs text-stone-600">Varieties</div>
            </div>
            <div>
              <div class="text-lg font-bold text-stone-900">
                {{ getMostCommonVariety() }}
              </div>
              <div class="text-xs text-stone-600">Most Common</div>
            </div>
          </div>
        </div>

        <button
          @click="showVarietiesModal = false"
          class="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>



<!-- Jungle Collection Modal -->
<div v-if="showJungleSelector" @click="showJungleSelector = false" 
     class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div @click.stop class="relative max-w-2xl w-full max-h-[80vh] overflow-hidden">
    <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40 shadow-2xl"></div>
    
    <div class="relative z-10 p-6">
      <div class="text-center mb-6">
        <div class="text-4xl mb-4">🌍</div>
        <h3 class="text-xl font-bold text-stone-900">Your Jungle Collection</h3>
        <p class="text-stone-600 mt-2 text-sm">{{ jungleGenerations.length }} jungle{{ jungleGenerations.length !== 1 ? 's' : '' }} created</p>
      </div>

      <div class="max-h-96 overflow-y-auto space-y-3 mb-6">
        <div v-for="jungle in jungleGenerations.slice().reverse()" :key="jungle.id"
             @click="selectJungle(jungle.id)"
             class="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 transition-all duration-200 hover:bg-white/70 cursor-pointer"
             :class="{ 'ring-2 ring-amber-500': currentJungleId === jungle.id }">
          
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <div class="text-2xl">{{ jungle.completedAt ? '🌳' : '🌱' }}</div>
              <div>
                <h4 class="font-bold text-stone-900 text-sm">{{ jungle.name }}</h4>
                <div class="text-xs text-stone-600">
  {{ jungle.completedAt ? 'Completed' : 'Active' }} • {{ getJungleTreeCount(jungle) }}/{{ jungle.maxCapacity }} trees
</div>
              </div>
            </div>
            <div v-if="currentJungleId === jungle.id" class="text-amber-500 text-lg">✓</div>
          </div>
          
          <div class="grid grid-cols-3 gap-2 text-xs text-center mt-3">
            <div>
              <div class="font-bold text-stone-900">{{ getJungleDuration(jungle) }}</div>
              <div class="text-stone-600">Duration</div>
            </div>
            <div>
  <div class="font-bold text-stone-900">{{ getJungleTreeCount(jungle) }}</div>
  <div class="text-stone-600">Trees</div>
</div>
            <div>
              <div class="font-bold text-stone-900">{{ getJungleCompletionPercentage(jungle) }}%</div>
              <div class="text-stone-600">Complete</div>
            </div>
          </div>
          
          <div class="mt-2 text-xs text-stone-500">
            Started: {{ formatDate(jungle.startedAt) }}
            <span v-if="jungle.completedAt"> • Completed: {{ formatDate(jungle.completedAt) }}</span>
          </div>
        </div>
      </div>

      <button @click="showJungleSelector = false"
              class="w-full bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold py-3 px-6 rounded-xl transition-all duration-200">
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
    <div @click.stop class="relative max-w-sm sm:max-w-md w-full">
      <!-- Glass morphism background -->
      <div
        class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/40 shadow-2xl"
      ></div>

      <div class="relative z-10 p-6 sm:p-8">
        <div class="text-center mb-6">
          <div class="text-6xl sm:text-8xl mb-4">
            {{ getTreeEmoji(selectedTree) }}
          </div>
          <h3 class="text-xl sm:text-2xl font-bold text-stone-900">
            {{ getTreeTypeLabel(selectedTree) }}
          </h3>
        </div>

        <div class="space-y-3 sm:space-y-4">
          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Source:</span
              >
              <span
                class="font-bold text-stone-900 capitalize text-sm sm:text-base"
                >{{ selectedTree.source }}</span
              >
            </div>
          </div>

          <div
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Grown on:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                formatFullDate(selectedTree.grownAt)
              }}</span>
            </div>
          </div>

          <div
            v-if="selectedTree.duration"
            class="bg-white/60 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/50"
          >
            <div class="flex justify-between items-center">
              <span class="text-stone-700 font-medium text-sm sm:text-base"
                >Focus time:</span
              >
              <span class="font-bold text-stone-900 text-sm sm:text-base">{{
                formatDuration(selectedTree.duration)
              }}</span>
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";


const props = defineProps({
  trees: {
    type: Array,
    default: () => [],
  },
  folderFocusTime: {
    type: Object,
    default: () => ({}),
  },
  focusSessions: {
    type: Array,
    default: () => [],
  },
});
// Reactive state
const selectedTree = ref(null);
const selectedWeekData = ref(null);
const selectedDayData = ref(null);
const gridSize = ref(4);
const selectedProjectHistory = ref(null);

const MAX_JUNGLE_CAPACITY = 289; // 17x17 grid
const currentJungleId = ref(1);
const showJungleSelector = ref(false);
const jungleGenerations = ref([]);

const showVarietiesModal = ref(false); // Add this line

const emit = defineEmits(['jungle-completed', 'jungle-changed']);
// Tree type definitions (same as timer)
const treeTypes = [
  { id: "fern", name: "Fern", image: "/fern.png", emoji: "🌿" },
  { id: "monstera", name: "Monstera", image: "/monstera.png", emoji: "🍃" },
  { id: "alocasia", name: "Alocasia", image: "/alocasia.png", emoji: "🌱" },
  { id: "philodendron", name: "Philodendron", image: "/philodendron.png", emoji: "🌱" },
  { id: "treee", name: "Oak Tree", image: "/treee.png", emoji: "🌳" },
  { id: "tree3", name: "Overgrown Tree", image: "/tree4.png", emoji: "🌳" },
  { id: "tree2", name: "Jungle Tree", image: "/tree2.png", emoji: "🌲" },
  { id: "tree4", name: "Tree of Life", image: "/tree5.png", emoji: "🌲" },
  { id: "pothos", name: "Pothos", image: "/pothos.png", emoji: "🌱" },
  { id: "elefant", name: "Elefant Ear", image: "/elefant.png", emoji: "🌱" },
  { id: "ayahuasca", name: "Ayahuasca", image: "/ayahuasca.png", emoji: "🌱" },
  { id: "peperomia", name: "Peperomia", image: "/peperomia.png", emoji: "🌱" },
  { id: "caladium", name: "Caladium", image: "/caladium.png", emoji: "🌱" },
  { id: "mushroom", name: "Mushroom", image: "/mushroom.png", emoji: "🍄" },
];

onMounted(() => {
  initializeJungleSystem();
});

const getTreeImage = (tree) => {
  // Check multiple possible properties for tree type
  const treeTypeId = tree.treeType || tree.type || "fern";
  const treeType = treeTypes.find((type) => type.id === treeTypeId);
  return treeType ? treeType.image : "/fern.png"; // Default to fern
};

const getTreeName = (tree) => {
  // Check multiple possible properties for tree type
  const treeTypeId = tree.treeType || tree.type || "fern";
  const treeType = treeTypes.find((type) => type.id === treeTypeId);
  return treeType ? treeType.name : "Fern"; // Default to Fern
};

const getTreeVarieties = () => {
  const varieties = {};
  props.trees.forEach((tree) => {
    const type = tree.treeType || tree.type || "mushroom";
    const treeType = treeTypes.find((t) => t.id === type);
    if (treeType) {
      if (!varieties[type]) {
        varieties[type] = { ...treeType, count: 0 };
      }
      varieties[type].count++;
    }
  });
  return Object.values(varieties);
};

const getTreeVarietyCount = () => {
  return getTreeVarieties().length;
};

const showMonthlyHistory = (folderId) => {
  selectedProjectHistory.value = folderId;
};

const isCurrentJungleFull = computed(() => {
  return props.trees.length >= MAX_JUNGLE_CAPACITY;
});

// Add these new methods:
const initializeJungleSystem = () => {
  const savedGenerations = localStorage.getItem('jungleGenerations');
  if (savedGenerations) {
    jungleGenerations.value = JSON.parse(savedGenerations);
  }
  
  if (jungleGenerations.value.length === 0) {
    createNewJungle();
  }
  
  const activeJungle = jungleGenerations.value.find(jungle => !jungle.completedAt);
  if (activeJungle) {
    currentJungleId.value = activeJungle.id;
  }
};

const createNewJungle = () => {
  const newJungle = {
    id: Date.now(),
    name: `Jungle ${jungleGenerations.value.length + 1}`,
    startedAt: new Date().toISOString(),
    completedAt: null,
    trees: [],
    totalFocusTime: 0,
    maxCapacity: MAX_JUNGLE_CAPACITY,
    stats: {
      sessionsCompleted: 0,
      averageSessionTime: 0,
      treesGrown: 0,
      daysActive: 0
    }
  };
  
  jungleGenerations.value.push(newJungle);
  currentJungleId.value = newJungle.id;
  
  return newJungle; // Return the jungle but don't save here (parent function saves)
};

const completeCurrentJungle = () => {
  console.log('Auto-completing jungle and creating new one');
  const currentJungle = getCurrentJungle();
  
  if (!currentJungle || currentJungle.completedAt) {
    return;
  }
  
  // Mark current jungle as completed
  currentJungle.completedAt = new Date().toISOString();
  currentJungle.trees = [...props.trees];
  
  const duration = new Date(currentJungle.completedAt) - new Date(currentJungle.startedAt);
  const totalDays = Math.ceil(duration / (1000 * 60 * 60 * 24));
  
  currentJungle.stats = {
    ...currentJungle.stats,
    treesGrown: props.trees.length,
    totalDays: totalDays,
    completionPercentage: 100
  };
  
  // Automatically create a new jungle
  const newJungle = createNewJungle();
  
  // Save everything
  saveJungleGenerations();
  
  // Show a subtle notification instead of a modal
  showJungleCompletionNotification(currentJungle, newJungle);
  
  // Emit event to parent to clear trees and start fresh
  emit('jungle-completed', {
    completedJungle: currentJungle,
    newJungle: newJungle
  });
};

const showJungleCompletionNotification = (completedJungle, newJungle) => {
  // Create a subtle toast notification
  const notification = document.createElement('div');
  notification.innerHTML = `
    <div class="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-sm border border-green-400">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🌟</span>
        <div>
          <div class="font-bold text-sm">Jungle Completed!</div>
          <div class="text-xs opacity-90 mt-1">${completedJungle.name} → ${newJungle.name}</div>
          <div class="text-xs opacity-75 mt-1">${completedJungle.trees.length} trees preserved</div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  const notificationEl = notification.firstElementChild;
  notificationEl.style.transform = 'translateX(100%)';
  notificationEl.style.transition = 'transform 0.3s ease-out';
  
  setTimeout(() => {
    notificationEl.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notificationEl.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
};

const getCurrentJungle = () => {
  return jungleGenerations.value.find(jungle => jungle.id === currentJungleId.value);
};

const formatJungleDuration = () => {
  const jungle = getCurrentJungle();
  if (!jungle) return '';
  
  const start = new Date(jungle.startedAt);
  const end = jungle.completedAt ? new Date(jungle.completedAt) : new Date();
  const duration = end - start;
  
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
};

const getJungleDuration = (jungle) => {
  const start = new Date(jungle.startedAt);
  const end = jungle.completedAt ? new Date(jungle.completedAt) : new Date();
  const duration = end - start;
  
  const days = Math.floor(duration / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days}d` : '<1d';
};

const getJungleCompletionPercentage = (jungle) => {
  let treeCount;
  
  // If it's the current active jungle, use live tree count from props
  if (jungle.id === currentJungleId.value && !jungle.completedAt) {
    treeCount = props.trees.length;
  } else {
    // If it's a completed jungle, use stored tree count
    treeCount = jungle.trees?.length || 0;
  }
  
  return Math.round((treeCount / jungle.maxCapacity) * 100);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const selectJungle = (jungleId) => {
  currentJungleId.value = jungleId;
  showJungleSelector.value = false;
  
  const selectedJungle = jungleGenerations.value.find(j => j.id === jungleId);
  console.log('Selected jungle:', selectedJungle);
  
  // Emit event to parent to switch jungle view
  emit('jungle-changed', {
    jungleId: jungleId,
    jungle: selectedJungle
  });
};


const saveJungleGenerations = () => {
  localStorage.setItem('jungleGenerations', JSON.stringify(jungleGenerations.value));
};


const getMonthlyHistory = (folderId) => {
  const now = new Date();
  const history = [];

  // Get last 6 months including current month
  for (let i = 0; i < 6; i++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    );
    monthStart.setHours(0, 0, 0, 0);

    const monthEnd = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0
    );
    monthEnd.setHours(23, 59, 59, 999);

    // Filter sessions for this folder within this month
    const monthSessions = props.focusSessions.filter((session) => {
      if (!session || !session.completedAt || session.folderId !== folderId) {
        return false;
      }

      const sessionDate = new Date(session.completedAt);
      return sessionDate >= monthStart && sessionDate <= monthEnd;
    });

    // Calculate total focus time for this month
    const monthFocusTime = monthSessions.reduce((total, session) => {
      let duration = session.duration || 0;

      if (typeof duration === "string") {
        duration = parseInt(duration, 10) || 0;
      }

      if (duration > 86400) duration = 86400;
      if (duration < 0) duration = 0;

      return total + duration;
    }, 0);

    // Format the month label
    const isCurrentMonth = i === 0;
    const monthLabel = isCurrentMonth
      ? "This Month"
      : monthDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

    // Format duration
    const hours = Math.floor(monthFocusTime / 3600);
    const minutes = Math.floor((monthFocusTime % 3600) / 60);
    const display = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    history.push({
      key: `${monthDate.getFullYear()}-${monthDate.getMonth()}`,
      label: monthLabel,
      display: display,
      hours: hours,
      minutes: minutes,
      totalSeconds: monthFocusTime,
      sessions: monthSessions.length,
      isCurrentMonth: isCurrentMonth,
    });
  }

  // Calculate percentages based on peak month
  const peakTime = Math.max(...history.map((h) => h.totalSeconds));
  history.forEach((month) => {
    month.percentage =
      peakTime > 0 ? Math.round((month.totalSeconds / peakTime) * 100) : 0;
  });

  // Filter out months with no activity and return
  return history.filter((month) => month.totalSeconds > 0);
};

// Computed properties
const totalTrees = computed(() => displayedTrees.value.length);

const getTreeFilter = (tree) => {
  const duration = tree.duration || 0;
  const hours = Math.floor(duration / 3600);

  // Use CSS filters to create variations of the same tree image
  if (hours < 1) return "brightness(1.2) saturate(0.7)"; // Lighter, less saturated (young)
  if (hours < 2) return "brightness(1.1) saturate(0.9)"; // Slightly lighter (growing)
  if (hours < 4) return "brightness(1.0) saturate(1.0)"; // Normal (mature)
  return "brightness(0.9) saturate(1.2) contrast(1.1)"; // Darker, more saturated (ancient)
};

const totalFocusTime = computed(() => {
  return props.focusSessions.reduce((total, session) => {
    const duration =
      typeof session.duration === "string"
        ? parseInt(session.duration, 10)
        : session.duration || 0;
    return total + duration;
  }, 0);
});

const sortedFolderFocusTime = computed(() => {
  return Object.entries(props.folderFocusTime)
    .map(([folderId, focusTime]) => {
      // Convert string values to numbers
      const time =
        typeof focusTime === "string" ? parseInt(focusTime, 10) : focusTime;
      return [folderId, time];
    })
    .sort(([, a], [, b]) => b - a) // Sort by focus time descending
    .reduce((obj, [folderId, focusTime]) => {
      obj[folderId] = focusTime;
      return obj;
    }, {});
});

const formatTotalFocusTime = computed(() => {
  const totalSeconds = totalFocusTime.value;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Calculate dynamic grid size based on number of trees
// Add these functions to your script setup section in ForestView.vue

const getGridCellSize = (treeCount) => {
  // Use displayedTrees.value.length instead of totalTrees
  const actualTreeCount = displayedTrees.value.length;
  
  if (actualTreeCount <= 16) return 'w-20 h-20 sm:w-24 sm:h-24';
  if (actualTreeCount <= 36) return 'w-18 h-18 sm:w-20 sm:h-20';
  if (actualTreeCount <= 64) return 'w-16 h-16 sm:w-18 sm:h-18';
  if (actualTreeCount <= 81) return 'w-14 h-14 sm:w-16 sm:h-16';
  if (actualTreeCount <= 121) return 'w-12 h-12 sm:w-14 sm:h-14';
  if (actualTreeCount <= 169) return 'w-10 h-10 sm:w-12 sm:h-12';
  return 'w-8 h-8 sm:w-10 sm:h-10';
};

const getTreeImageSize = (treeCount, treeType) => {
  const isSmallTree = ["pothos", "monstera", "mushroom", "fern", "alocasia", "philodendron", "elefant", "caladium"].includes(
    treeType
  );
  const actualTreeCount = displayedTrees.value.length; // Use displayedTrees


  // For forests up to 81 trees, use your original sizing
  if (treeCount <= 81) {
    return isSmallTree
      ? "mb-8 w-14 h-14 sm:w-8 sm:h-8 lg:w-14 lg:h-14"
      : "mb-24 w-24 h-24 sm:w-14 sm:h-14 lg:w-28 lg:h-28";
  }

  // Only start scaling down after 81 trees
  if (treeCount <= 121) {
    return isSmallTree
      ? "mb-6 w-10 h-10 sm:w-6 sm:h-6 lg:w-10 lg:h-10"
      : "mb-20 w-18 h-18 sm:w-10 sm:h-10 lg:w-32 lg:h-28";
  }
  if (treeCount <= 169) {
    return isSmallTree
      ? "mb-4 w-8 h-8 sm:w-4 sm:h-4 lg:w-8 lg:h-8"
      : "mb-16 w-12 h-12 sm:w-8 sm:h-8 lg:w-20 lg:h-20";
  }

  // Very dense forests
  return isSmallTree
    ? "mb-2 w-6 h-6 sm:w-3 sm:h-3 lg:w-6 lg:h-6"
    : "mb-12 w-8 h-8 sm:w-6 sm:h-6 lg:w-16 lg:h-16";
};

// Update your existing calculateGridSize function to this:
const calculateGridSize = () => {
  const treeCount = displayedTrees.value.length; // Use displayedTrees instead of props.trees.length
  if (treeCount === 0) return 4;

  // Progressive grid sizes
  if (treeCount <= 16) return 4;   // 4x4 = 16 trees max
  if (treeCount <= 36) return 6;   // 6x6 = 36 trees max  
  if (treeCount <= 64) return 8;   // 8x8 = 64 trees max
  if (treeCount <= 81) return 9;   // 9x9 = 81 trees max
  if (treeCount <= 121) return 11; // 11x11 = 121 trees max
  if (treeCount <= 169) return 13; // 13x13 = 169 trees max
  if (treeCount <= 225) return 15; // 15x15 = 225 trees max
  if (treeCount <= 289) return 17; // 17x17 = 289 trees max
  
  return 17; // Cap at 17x17
};


const shouldShowMilestone = () => {
  const treeCount = props.trees.length;
  // Show milestone when hitting exact grid expansion points
  return (
    treeCount === 16 ||
    treeCount === 36 ||
    treeCount === 64 ||
    treeCount === 81 ||
    treeCount === 121 ||
    treeCount === 169
  );
};

// Create jungle grid with trees in random positions
const jungleGrid = computed(() => {
  const size = calculateGridSize();
  gridSize.value = size;

  const totalCells = size * size;
  const grid = Array(totalCells)
    .fill(null)
    .map(() => ({ tree: null }));

  // Shuffle trees into random positions
  const shuffledTrees = [...displayedTrees.value].sort(() => Math.random() - 0.5);

  shuffledTrees.forEach((tree, index) => {
    if (index < totalCells) {
      grid[index].tree = tree;
    }
  });

  // Shuffle the entire grid to randomize empty spaces too
  return grid.sort(() => Math.random() - 0.5);
});

const getMostCommonVariety = () => {
  const varieties = getTreeVarieties();
  if (varieties.length === 0) return "-";

  const mostCommon = varieties.reduce((prev, current) =>
    prev.count > current.count ? prev : current
  );

  return mostCommon.name;
};

const getFolderNameById = (folderId) => {
  const savedFolders = localStorage.getItem("taskFolders");
  if (savedFolders) {
    const folders = JSON.parse(savedFolders);
    const folder = folders.find((f) => f.id === folderId);
    return folder ? folder.name : "Unknown Project";
  }
  return "Unknown Project";
};
// Current week daily data
const currentWeekData = computed(() => {
  const days = [];
  const now = new Date();

  // Get start of current week (Monday)
  const weekStart = new Date(now);
  const dayOfWeek = now.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  weekStart.setDate(now.getDate() - daysFromMonday);
  weekStart.setHours(0, 0, 0, 0);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart);
    currentDay.setDate(weekStart.getDate() + i);

    const dayEnd = new Date(currentDay);
    dayEnd.setHours(23, 59, 59, 999);

    // Calculate focus time for this day using sessions
    const daySessions = (props.focusSessions || []).filter((session) => {
      if (!session || !session.completedAt) return false;

      const sessionDate = new Date(session.completedAt);
      return sessionDate >= currentDay && sessionDate <= dayEnd;
    });

    // Ensure duration is a valid number and reasonable (max 24 hours = 86400 seconds)
    const dayFocusTime = daySessions.reduce((total, session) => {
      let duration = session.duration || 0;

      // Convert to number if it's a string
      if (typeof duration === "string") {
        duration = parseInt(duration, 10) || 0;
      }

      // Sanity check: duration should be reasonable (max 24 hours)
      if (duration > 86400) {
        console.warn(
          `Suspicious session duration detected: ${duration} seconds for session ${session.id}. Capping at 24 hours.`
        );
        duration = 86400;
      }

      if (duration < 0) {
        console.warn(
          `Negative duration detected: ${duration} seconds for session ${session.id}. Setting to 0.`
        );
        duration = 0;
      }

      return total + duration;
    }, 0);

    const hours = Math.floor(dayFocusTime / 3600);
    const minutes = Math.floor((dayFocusTime % 3600) / 60);

    const averageSessionTime =
      daySessions.length > 0 ? dayFocusTime / daySessions.length : 0;
    const avgHours = Math.floor(averageSessionTime / 3600);
    const avgMinutes = Math.floor((averageSessionTime % 3600) / 60);

    const isToday = currentDay.toDateString() === now.toDateString();

    days.push({
      date: currentDay.toDateString(),
      dayLabel: dayLabels[i],
      hours: hours,
      minutes: minutes,
      totalSeconds: dayFocusTime,
      display: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      sessionCount: daySessions.length,
      treesGrown: (props.trees || []).filter((tree) => {
        if (!tree || !tree.grownAt) return false;
        const treeDate = new Date(tree.grownAt);
        return treeDate >= currentDay && treeDate <= dayEnd;
      }).length,
      averageSession:
        avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes}m`,
      fullDate: currentDay.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      isToday,
    });
  }

  return days;
});
const getProjectPercentage = (projectFocusTime) => {
  // Calculate total focus time across all projects
  const totalFocusTime = Object.values(props.folderFocusTime).reduce(
    (sum, time) => sum + time,
    0
  );

  // Avoid division by zero
  if (totalFocusTime === 0) return 0;

  // Calculate percentage and round to 1 decimal place
  const percentage = (projectFocusTime / totalFocusTime) * 100;
  return Math.round(percentage * 10) / 10; // Rounds to 1 decimal place
};
// Also add this data cleanup function to your component:
const cleanupFocusData = () => {
  // Check for corrupted focus sessions
  if (props.focusSessions) {
    const corruptedSessions = props.focusSessions.filter((session) => {
      const duration =
        typeof session.duration === "string"
          ? parseInt(session.duration, 10)
          : session.duration;
      return duration > 86400 || duration < 0 || isNaN(duration);
    });

    if (corruptedSessions.length > 0) {
      console.warn("Found corrupted focus sessions:", corruptedSessions);
      alert(
        `Found ${corruptedSessions.length} corrupted focus sessions. Please check your data or reset if needed.`
      );
    }
  }
};

const getLastSession = (folderId) => {
  // Get all sessions for this folder
  const folderSessions = props.focusSessions.filter(
    (session) => session.folderId === folderId && session.completedAt
  );

  if (folderSessions.length === 0) return "Never";

  // Find the most recent session
  const lastSession = folderSessions.reduce((latest, session) => {
    const sessionDate = new Date(session.completedAt);
    const latestDate = new Date(latest.completedAt);
    return sessionDate > latestDate ? session : latest;
  });

  const lastSessionDate = new Date(lastSession.completedAt);
  const now = new Date();

  // Calculate time difference
  const diffInMs = now - lastSessionDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  // Return human-readable format
  if (diffInMinutes < 60) {
    if (diffInMinutes < 5) return "Just now";
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1w ago" : `${weeks}w ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1mo ago" : `${months}mo ago`;
  }
};

const formatTotalWeekTime = computed(() => {
  const totalSeconds = currentWeekData.value.reduce(
    (total, day) => total + day.totalSeconds,
    0
  );
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

const debugWeekData = computed(() => {
  console.log("Current week data:", currentWeekData.value);
  console.log("Focus sessions:", props.focusSessions);
  const totalSeconds = currentWeekData.value.reduce(
    (total, day) => total + day.totalSeconds,
    0
  );
  console.log("Total seconds this week:", totalSeconds);
  return totalSeconds;
});

const getFolderColorById = (folderId) => {
  const savedFolders = localStorage.getItem("taskFolders");
  if (savedFolders) {
    const folders = JSON.parse(savedFolders);
    const folder = folders.find((f) => f.id === folderId);
    if (folder && folder.color) {
      const folderColors = [
        { value: "blue", bg: "#3B82F6" },
        { value: "green", bg: "#10B981" },
        { value: "purple", bg: "#8B5CF6" },
        { value: "pink", bg: "#EC4899" },
        { value: "orange", bg: "#F97316" },
        { value: "red", bg: "#EF4444" },
        { value: "yellow", bg: "#EAB308" },
        { value: "teal", bg: "#14B8A6" },
      ];
      const colorInfo = folderColors.find((c) => c.value === folder.color);
      return colorInfo ? colorInfo.bg : "#8B5CF6";
    }
  }
  return "#8B5CF6"; // Default purple
};

const getFolderEmojiById = (folderId) => {
  const savedFolders = localStorage.getItem("taskFolders");
  if (savedFolders) {
    const folders = JSON.parse(savedFolders);
    const folder = folders.find((f) => f.id === folderId);
    if (folder && folder.color) {
      const folderColors = [
        { value: "blue", emoji: "📘" },
        { value: "green", emoji: "📗" },
        { value: "purple", emoji: "📜" },
        { value: "pink", emoji: "🌸" },
        { value: "orange", emoji: "📙" },
        { value: "red", emoji: "📕" },
        { value: "yellow", emoji: "📒" },
        { value: "teal", emoji: "📚" },
      ];
      const colorInfo = folderColors.find((c) => c.value === folder.color);
      return colorInfo ? colorInfo.emoji : "📜";
    }
  }
  return "📁"; // Default folder
};

const getTasksCompleted = (folderId) => {
  // Count completed tasks for this folder from your tasks data
  // Assuming you have access to tasks through props or a similar mechanism
  if (props.tasks) {
    return props.tasks.filter(
      (task) => task.folderId === folderId && task.completed
    ).length;
  }

  // Alternative: if you don't have direct access to tasks, you might need to
  // get them from localStorage or another data source
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    const tasks = JSON.parse(savedTasks);
    return tasks.filter((task) => task.folderId === folderId && task.completed)
      .length;
  }

  return 0;
};

const getFocusSessionCount = (folderId) => {
  return props.focusSessions.filter((session) => session.folderId === folderId)
    .length;
};

const getAverageSessionTime = (folderId) => {
  const sessions = props.focusSessions.filter(
    (session) => session.folderId === folderId
  );
  if (sessions.length === 0) return "0m";

  const totalTime = sessions.reduce(
    (total, session) => total + (session.duration || 0),
    0
  );
  const avgTime = totalTime / sessions.length;
  const minutes = Math.floor(avgTime / 60);

  return minutes > 60
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    : `${minutes}m`;
};

const getDaysActive = (folderId) => {
  const sessions = props.focusSessions.filter(
    (session) => session.folderId === folderId
  );
  const uniqueDays = new Set(
    sessions.map((session) => new Date(session.completedAt).toDateString())
  );
  return uniqueDays.size;
};

// Add this method to your existing Vue component script

const getThisMonthFocus = (folderId) => {
  const now = new Date();

  // Get the first day of current month (always starts on the 1st)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  // Get the last day of current month
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  // Filter sessions for this folder within the current month
  const monthSessions = props.focusSessions.filter((session) => {
    if (!session || !session.completedAt || session.folderId !== folderId) {
      return false;
    }

    const sessionDate = new Date(session.completedAt);
    return sessionDate >= monthStart && sessionDate <= monthEnd;
  });

  // Calculate total focus time for this month
  const monthFocusTime = monthSessions.reduce((total, session) => {
    let duration = session.duration || 0;

    // Convert to number if it's a string
    if (typeof duration === "string") {
      duration = parseInt(duration, 10) || 0;
    }

    // Sanity check: duration should be reasonable (max 24 hours)
    if (duration > 86400) {
      duration = 86400;
    }

    if (duration < 0) {
      duration = 0;
    }

    return total + duration;
  }, 0);

  // Format the duration
  const hours = Math.floor(monthFocusTime / 3600);
  const minutes = Math.floor((monthFocusTime % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return "0m";
  }
};

const getProductivityScore = (folderId) => {
  const sessions = props.focusSessions.filter(
    (session) => session.folderId === folderId
  );
  if (sessions.length === 0) return 0;

  // Calculate based on consistency and session length
  const avgDuration =
    sessions.reduce((total, session) => total + (session.duration || 0), 0) /
    sessions.length;
  const daysActive = getDaysActive(folderId);
  const score = Math.min(
    100,
    Math.round((avgDuration / 3600) * 30 + daysActive * 10)
  );

  return score;
};

const getTotalFocusTime = () => {
  const total = Object.values(props.folderFocusTime).reduce(
    (sum, time) => sum + time,
    0
  );
  const hours = Math.floor(total / 3600);
  return hours > 0 ? `${hours}h` : `${Math.floor(total / 60)}m`;
};

const getMostProductiveProject = () => {
  if (Object.keys(props.folderFocusTime).length === 0) return "-";

  const topFolderId = Object.entries(props.folderFocusTime).sort(
    ([, a], [, b]) => b - a
  )[0][0];

  return getFolderNameById(topFolderId).split(" ")[0]; // First word only
};

const getTreesGrown = (folderId) => {
  // Count trees grown for this folder
  return (props.trees || []).filter((tree) => tree.folderId === folderId)
    .length;
};

const getAverageDaily = () => {
  const total = Object.values(props.folderFocusTime).reduce(
    (sum, time) => sum + time,
    0
  );
  const daysWithActivity = Math.max(
    1,
    new Set(
      props.focusSessions.map((session) =>
        new Date(session.completedAt).toDateString()
      )
    ).size
  );

  const dailyAvg = total / daysWithActivity;
  const minutes = Math.floor(dailyAvg / 60);

  return minutes > 60 ? `${Math.floor(minutes / 60)}h` : `${minutes}m`;
};

// Weekly focus data for chart
const weeklyData = computed(() => {
  const weeks = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const weekStart = new Date(now);
    const currentDayOfWeek = now.getDay();
    const daysFromMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    weekStart.setDate(now.getDate() - daysFromMonday - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday is 6 days after Monday
    weekEnd.setHours(23, 59, 59, 999);

    // Calculate focus time for this week
    const weekSessions = (props.focusSessions || []).filter((session) => {
      if (!session || !session.completedAt) return false;
      const sessionDate = new Date(session.completedAt);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    // FIXED: Ensure durations are valid numbers
    const weekFocusTime = weekSessions.reduce((total, session) => {
      let duration = session.duration || 0;

      // Convert to number if it's a string
      if (typeof duration === "string") {
        duration = parseInt(duration, 10) || 0;
      }

      // Sanity check: duration should be reasonable (max 24 hours)
      if (duration > 86400) {
        console.warn(
          `Suspicious session duration detected: ${duration} seconds for session ${session.id}. Capping at 24 hours.`
        );
        duration = 86400;
      }

      if (duration < 0) {
        console.warn(
          `Negative duration detected: ${duration} seconds for session ${session.id}. Setting to 0.`
        );
        duration = 0;
      }

      return total + duration;
    }, 0);

    const hours = Math.floor(weekFocusTime / 3600);
    const minutes = Math.floor((weekFocusTime % 3600) / 60);

    const averageSessionTime =
      weekSessions.length > 0 ? weekFocusTime / weekSessions.length : 0;
    const avgHours = Math.floor(averageSessionTime / 3600);
    const avgMinutes = Math.floor((averageSessionTime % 3600) / 60);

    const dailyAverageTime = weekFocusTime / 7;
    const dailyHours = Math.floor(dailyAverageTime / 3600);
    const dailyMinutes = Math.floor((dailyAverageTime % 3600) / 60);

    // FIXED: Better percentage calculation for chart height
    // Use minutes for better scaling of small durations
    const totalMinutes = Math.floor(weekFocusTime / 60);
    const maxMinutesForChart = 240; // 4 hours max for chart scaling
    const percentage = Math.min((totalMinutes / maxMinutesForChart) * 100, 100);

    console.log(
      `Week ${i}: ${weekFocusTime} seconds = ${hours}h ${minutes}m, percentage: ${percentage}`
    );

    weeks.push({
      label: i === 0 ? "This Week" : `${i}w ago`,
      hours: hours,
      minutes: minutes,
      totalSeconds: weekFocusTime,
      display: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      percentage: percentage, // This is just for chart height, not the actual time
      sessionCount: weekSessions.length,
      treesGrown: (props.trees || []).filter((tree) => {
        if (!tree || !tree.grownAt) return false;
        const treeDate = new Date(tree.grownAt);
        return treeDate >= weekStart && treeDate <= weekEnd;
      }).length,
      averageSession:
        avgHours > 0 ? `${avgHours}h ${avgMinutes}m` : `${avgMinutes}m`,
      dailyAverage:
        dailyHours > 0 ? `${dailyHours}h ${dailyMinutes}m` : `${dailyMinutes}m`,
      dateRange: `${weekStart.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${weekEnd.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
    });
  }

  return weeks;
});
// Methods
const getTreeEmoji = (tree) => {
  const duration = tree.duration || 0;
  const hours = Math.floor(duration / 3600);

  if (hours < 1) return "🌱";
  if (hours < 2) return "🌿";
  if (hours < 4) return "🌳";
  return "🌲";
};

const getTreeTypeLabel = (tree) => {
  const duration = tree.duration || 0;
  const hours = Math.floor(duration / 3600);

  if (hours < 1) return "Young Sprout";
  if (hours < 2) return "Growing Sapling";
  if (hours < 4) return "Mature Tree";
  return "Ancient Oak";
};

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatFullDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const displayedTrees = computed(() => {
  const currentJungle = getCurrentJungle();
  if (!currentJungle) return [];
  
  // If viewing a completed jungle, show its stored trees
  if (currentJungle.completedAt) {
    return currentJungle.trees || [];
  }
  
  // If viewing active jungle, show live trees from props
  return props.trees;
});

const selectTree = (tree) => {
  selectedTree.value = tree;
};

const selectWeek = (week) => {
  selectedWeekData.value = week;
};

const selectDay = (day) => {
  selectedDayData.value = day;
};

const getJungleTreeCount = (jungle) => {
  // If it's the current active jungle, show live count
  if (jungle.id === currentJungleId.value && !jungle.completedAt) {
    return props.trees.length;
  }
  // If it's a completed jungle, show stored count
  return jungle.trees?.length || 0;
};

// Add this watcher:
watch(totalTrees, (newCount, oldCount) => {
  console.log(`Trees: ${oldCount} → ${newCount}`);
  
  if (newCount >= MAX_JUNGLE_CAPACITY) {
    const currentJungle = getCurrentJungle();
    if (currentJungle && !currentJungle.completedAt) {
      console.log(`🌟 Jungle "${currentJungle.name}" completed! Auto-creating new jungle...`);
      completeCurrentJungle();
    }
  }
});
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

.perspective-1000 {
  perspective: 1000px;
}

/* Enhanced 3D transforms */
.transform-gpu {
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

/* Smooth animations for the 3D board */
@keyframes float {
  0%,
  100% {
    transform: rotateX(45deg) rotateY(-15deg) rotateZ(5deg) translateY(0px);
  }
  50% {
    transform: rotateX(45deg) rotateY(-15deg) rotateZ(5deg) translateY(-2px);
  }
}

.transform-gpu:hover {
  animation: float 3s ease-in-out infinite;
}
</style>
