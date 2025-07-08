<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-stone-900 mb-3 tracking-tight">
        Focus Timer
      </h1>
      <p class="text-xl text-stone-700 opacity-80">
        Stay focused and grow your forest, one session at a time
      </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 items-start">
      <!-- Timer Section -->
      <div class="lg:col-span-2">
        <!-- Main Timer Card -->
        <div class="relative mb-8">
          <!-- Glass morphism background -->
          <div
            class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"
          ></div>

          <div class="relative z-10 p-8 text-center">
            <!-- Today's Total Time - Top Right Corner -->
            <div
              v-if="todaySessions.length > 0"
              class="absolute top-6 right-6 text-right"
            >
              <div class="text-sm text-stone-600 mb-1">Today's Total</div>
              <div class="text-xl font-bold text-stone-900">
                {{ formatDuration(todayTotalTime) }}
              </div>
            </div>

            <!-- Progress Ring -->
            <div class="relative w-80 h-80 mx-auto ">
              <svg
                class="w-80 h-80 transform -rotate-90 drop-shadow-2xl"
                viewBox="0 0 160 160"
              >
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
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style="stop-color: #f59e0b; stop-opacity: 1"
                    />
                    <stop
                      offset="50%"
                      style="stop-color: #d97706; stop-opacity: 1"
                    />
                    <stop
                      offset="100%"
                      style="stop-color: #92400e; stop-opacity: 1"
                    />
                  </linearGradient>
                </defs>
              </svg>

              <!-- Tree and Time Display in Center -->
              <div
                class="absolute inset-0 flex flex-col items-center justify-center"
              >
                <div
                  :class="treeAnimationClass"
                  class="transition-all duration-500 mb-2"
                >
                  <img
                    v-if="!isRunning"
                    :src="getSelectedTreeType().image"
                    :alt="getSelectedTreeType().name"
                    class="w-28 h-28 object-contain"
                  />
                  <span v-else class="text-6xl">{{ currentTreeEmoji }}</span>
                </div>
                <div
                  class="text-4xl font-mono font-bold text-stone-900 tracking-wider"
                >
                  {{ formatTime(timeLeft) }}
                </div>
                <div v-if="isRunning" class="text-sm text-stone-600 mt-1">
                  {{
                    Math.round(
                      ((selectedDuration - timeLeft) / selectedDuration) * 100
                    )
                  }}% complete
                </div>
                <div v-if="isRunning" class="text-xs text-stone-500 mt-1">
                  Trees grown:
                  {{ Math.floor((selectedDuration - timeLeft) / 60) }}
                  <!-- Change from 3600 to 60 -->
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Duration Settings Card -->
        <div v-if="!isRunning" class="relative mb-8">
          <!-- Glass morphism background -->
          <div
            class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"
          ></div>

          <div class="relative z-10 p-8">
            <h3 class="text-2xl font-bold text-stone-900 mb-6 text-center">
              Choose Your Focus Duration
            </h3>

            <!-- Focus Topic Selection (Subtle) -->
            <div class="mb-6">
              <div class="relative">
                <select
                  v-model="selectedFolderId"
                  @change="loadFolderTasks"
                  class="w-full p-2.5 bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-1 focus:ring-amber-400 focus:border-amber-400 outline-none text-stone-700 text-sm shadow-sm appearance-none cursor-pointer transition-all duration-200 hover:bg-white/40"
                >
                  <option value="" class="bg-white text-stone-700">
                    Select focus topic (optional)
                  </option>
                  <option
                    v-for="folder in availableFolders"
                    :key="folder.id"
                    :value="folder.id"
                    class="bg-white text-stone-700"
                  >
                    {{ folder.name }} ({{ getActiveTasks(folder.id).length }}
                    tasks)
                  </option>
                </select>
                <!-- Custom dropdown arrow -->
                <div
                  class="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none"
                >
                  <svg
                    class="w-3.5 h-3.5 text-stone-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Slider -->
            <div class="relative px-6 mb-8">
              <input
                type="range"
                v-model="selectedDuration"
                :min="1 * 60"
                :max="5 * 60"
                :step="1 * 60"
                class="w-full h-3 bg-stone-200 rounded-lg appearance-none cursor-pointer slider"
                @input="updateTimeLeft"
              />

              <!-- Slider Labels -->
              <div
                class="flex justify-between text-xs text-stone-600 mt-2 px-2"
              >
                <span>1 min</span>
                <span>2 min</span>
                <span>3 min</span>
                <span>4 min</span>
                <span>5 min</span>
              </div>
            </div>

            <!-- Start Focus Button -->
            <div class="text-center">
              <button
                @click="startTimer"
                class="group relative overflow-hidden bg-amber-600 hover:bg-amber-700 text-stone-900 font-bold py-4 px-12 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 mx-auto"
              >
                <!-- Button glow effect -->
                <div
                  class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
                <div class="relative z-10 flex items-center gap-3">
                  <span class="text-2xl">🎯</span>
                  <span class="text-lg">Start Focus</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Focus Session Card -->
        <div v-if="isRunning" class="relative mb-8">
          <!-- Glass morphism background -->
          <div
            class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"
          ></div>

          <div class="relative z-10 p-8">
            <h3 class="text-2xl font-bold text-stone-900 mb-6 text-center">
              Focus Session
            </h3>

            <!-- Task List (Interactive during focus) -->
            <div v-if="folderTasks.length > 0">
              <label class="block text-sm font-medium text-stone-700 mb-4"
                >Tasks you can work on</label
              >
              <div
                class="space-y-3 max-h-80 overflow-y-auto custom-scrollbar mb-8"
              >
                <div
                  v-for="task in folderTasks"
                  :key="task.id"
                  class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300"
                  :class="
                    task.completed
                      ? 'bg-green-100 border-green-300'
                      : 'bg-white/60 border-white/50 hover:bg-white/80'
                  "
                >
                  <!-- Task Checkbox (Interactive) -->
                  <button
                    @click="toggleTaskCompletion(task)"
                    class="flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center"
                    :class="
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-stone-400 hover:border-green-400'
                    "
                  >
                    <svg
                      v-if="task.completed"
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </button>

                  <!-- Task Details -->
                  <div class="flex-1">
                    <div
                      class="font-medium transition-all duration-300"
                      :class="
                        task.completed
                          ? 'text-green-800 line-through'
                          : 'text-stone-900'
                      "
                    >
                      {{ task.title }}
                    </div>
                    <div
                      v-if="task.dueDate"
                      class="text-xs text-stone-600 mt-1"
                    >
                      Due: {{ formatTaskDueDate(task.dueDate) }}
                    </div>
                  </div>

                  <!-- Completion Badge -->
                  <div v-if="task.completed" class="text-lg">✓</div>
                </div>
              </div>
            </div>

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

      <!-- Sidebar: Tree Selection -->
      <div class="space-y-8">
        <!-- Tree Selection Card -->
        <div v-if="!isRunning" class="relative mb-8">
          <!-- Glass morphism background -->
          <div
            class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-3xl border border-white/40 shadow-2xl"
          ></div>

          <div class="relative z-10 p-8">
            <h3 class="text-2xl font-bold text-stone-900 mb-6 text-center">
              Choose Your Tree to Grow
            </h3>

            <div class="max-h-[37rem] overflow-y-auto custom-scrollbar">
              <div class="grid grid-cols-2 gap-4">
                <div
                  v-for="treeType in treeTypes"
                  :key="treeType.id"
                  @click="selectedTreeType = treeType.id"
                  class="relative cursor-pointer transition-all duration-300 transform hover:scale-105 m-1"
                  :class="{
                    'ring-4 ring-amber-500 ring-opacity-60':
                      selectedTreeType === treeType.id,
                    'hover:ring-2 hover:ring-amber-300':
                      selectedTreeType !== treeType.id,
                  }"
                >
                  <div
                    class="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg"
                  ></div>

                  <div class="relative z-10 p-4 text-center">
                    <div class="mb-3">
                      <img
                        :src="treeType.image"
                        :alt="treeType.name"
                        class="w-12 h-12 mx-auto object-contain"
                      />
                    </div>
                    <div class="text-sm font-medium text-stone-900 mb-1">
                      {{ treeType.name }}
                    </div>
                    <div class="text-xs text-stone-600">
                      {{ treeType.description }}
                    </div>
                  </div>

                  <div
                    v-if="selectedTreeType === treeType.id"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// Define emits
const emit = defineEmits([
  "tree-grown",
  "focus-time-updated",
  "focus-state-changed",
  "task-completed",
]);

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  focusSessions: {
    type: Array,
    default: () => [],
  },
});

// Reactive state
const selectedDuration = ref(1 * 60); // Change from 60 * 60 to 1 * 60 (1 minute default)
const timeLeft = ref(selectedDuration.value);
const isRunning = ref(false);
const treesGrownThisSession = ref(0);
const selectedFolderId = ref("");
const availableFolders = ref([]);
const folderTasks = ref([]);
let timerId = null;

// Add these to your reactive state section:
const showDebugControls = ref(true); // Set to false in production

// Add these debug methods to your script:

const debugAddTree = () => {
  console.log("🐛 Debug: Adding tree manually");

  // Use the current selected folder or default to first available
  const folderId =
    selectedFolderId.value ||
    (availableFolders.value.length > 0
      ? availableFolders.value[0].id
      : "debug");

  emit("tree-grown", {
    type: selectedTreeType.value,
    treeType: selectedTreeType.value,
    duration: 60, // 1 minute tree
    source: "debug",
    folderId: folderId,
    grownAt: new Date().toISOString(),
  });

  // Show feedback
  showDebugNotification("🌳 Debug tree added!");
};

const debugAddMultipleTrees = () => {
  console.log("🐛 Debug: Adding 5 trees");

  const folderId =
    selectedFolderId.value ||
    (availableFolders.value.length > 0
      ? availableFolders.value[0].id
      : "debug");

  // Add 5 trees with slight delays to see them grow
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      emit("tree-grown", {
        type: selectedTreeType.value,
        treeType: selectedTreeType.value,
        duration: 60,
        source: "debug-bulk",
        folderId: folderId,
        grownAt: new Date().toISOString(),
      });
    }, i * 200); // 200ms delay between each tree
  }

  showDebugNotification("🌲 Added 5 debug trees!");
};

const debugCompleteSession = () => {
  console.log("🐛 Debug: Simulating completed session");

  const folderId =
    selectedFolderId.value ||
    (availableFolders.value.length > 0
      ? availableFolders.value[0].id
      : "debug");

  // Simulate a 5-minute completed session
  const sessionDuration = 5 * 60; // 5 minutes
  const treesToGrow = Math.floor(sessionDuration / 60); // 5 trees

  // Grow all the trees
  for (let i = 0; i < treesToGrow; i++) {
    setTimeout(() => {
      emit("tree-grown", {
        type: selectedTreeType.value,
        treeType: selectedTreeType.value,
        duration: 60,
        source: "debug-session",
        folderId: folderId,
        grownAt: new Date().toISOString(),
      });
    }, i * 100);
  }

  // Emit the focus time update
  setTimeout(() => {
    emit("focus-time-updated", sessionDuration, folderId);
    showDebugNotification(
      `⏱️ Simulated ${formatDuration(
        sessionDuration
      )} focus session with ${treesToGrow} trees!`
    );
  }, treesToGrow * 100 + 500);
};

const showDebugNotification = (message) => {
  // Create a temporary debug notification
  const notification = document.createElement("div");
  notification.innerHTML = `
    <div class="fixed top-4 left-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce border-2 border-red-600">
      🐛 ${message}
    </div>
  `;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

// Constants
const circumference = 2 * Math.PI * 65; // radius = 65

const selectedTreeType = ref("philodendron"); // Default tree type

const treeTypes = [
{
    id: "philodendron",
    name: "Philodendron",
    image: "/philodendron.png",
    emoji: "🍃",
    description: "Lush and vibrant",
  },
  {
    id: "monstera",
    name: "Monstera",
    image: "/monstera.png",
    emoji: "🍃",
    description: "Bold and tropical",
  },
  {
    id: "alocasia",
    name: "Alocasia",
    image: "/alocasia.png",
    emoji: "🍃",
    description: "Exotic and striking",
  },
  {
    id: "ayahuasca",
    name: "Ayahuasca",
    image: "/ayahuasca.png",
    emoji: "🌱",
    description: "Trippy and spiritual",
  },
  {
    id: "tree3",
    name: "Overgrown Tree",
    image: "/tree4.png",
    emoji: "🌳",
    description: "Overgrown and wild",
  },
  {
    id: "tree2",
    name: "Jungle Tree",
    image: "/tree2.png",
    emoji: "🌲",
    description: "Tall and majestic",
  },
  {
    id: "tree4",
    name: "Tree of Life",
    image: "/tree5.png",
    emoji: "🌲",
    description: "Life and growth",
  },
  {
    id: "pothos",
    name: "Pothos",
    image: "/pothos.png",
    emoji: "🌱",
    description: "Big and Beautiful",
  },
  {
    id: "elefant",
    name: "Elefant Ear",
    image: "/elefant.png",
    emoji: "🌱",
    description: "Large and leafy",
  },

  {
    id: "peperomia",
    name: "Peperomia",
    image: "/peperomia.png",
    emoji: "🌱",
    description: "Small and charming",
  },
  {
    id: "caladium",
    name: "Caladium",
    image: "/caladium.png",
    emoji: "🌱",
    description: "Colorful and vibrant",
  },
  {
    id: "fern",
    name: "Fern",
    image: "/fern.png",
    emoji: "🌿",
    description: "Delicate and graceful",
  },
  {
    id: "mushroom",
    name: "Mushroom",
    image: "/mushroom.png",
    emoji: "🍄",
    description: "Unique and mysterious",
  },
  {
    id: "treee",
    name: "Oak Tree",
    image: "/treee.png",
    emoji: "🌳",
    description: "Strong and enduring",
  },
];

const getSelectedTreeType = () => {
  return (
    treeTypes.find((type) => type.id === selectedTreeType.value) || treeTypes[0]
  );
};

const getTreeTypeById = (treeTypeId) => {
  return treeTypes.find((type) => type.id === treeTypeId) || treeTypes[0];
};
// Utility functions
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  } else {
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
};

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}m`;
  }
};

const formatTimeStamp = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatTaskDueDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  } else if (date < today) {
    return "Overdue";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

const updateTimeLeft = () => {
  timeLeft.value = selectedDuration.value;
};

// Computed properties
const progressOffset = computed(() => {
  const progress =
    (selectedDuration.value - timeLeft.value) / selectedDuration.value;
  return circumference - progress * circumference;
});

const currentTreeEmoji = computed(() => {
  if (!isRunning.value) return "🌱";

  const progress =
    (selectedDuration.value - timeLeft.value) / selectedDuration.value;
  if (progress < 0.25) return "🌱";
  if (progress < 0.5) return "🌿";
  if (progress < 0.75) return "🌳";
  return "🌳";
});

const treeAnimationClass = computed(() => {
  if (isRunning.value) return "text-8xl animate-pulse";
  return "text-8xl";
});

const todaySessions = computed(() => {
  // Get today's sessions from App.vue data instead of local sessionHistory
  const today = new Date().toDateString();
  return props.focusSessions
    ? props.focusSessions.filter(
        (session) => new Date(session.completedAt).toDateString() === today
      )
    : [];
});

const todayTotalTime = computed(() => {
  return todaySessions.value.reduce(
    (total, session) => total + (session.duration || 0),
    0
  );
});

// Folder-related functions
const getFolderName = (folderId) => {
  const folder = availableFolders.value.find((f) => f.id === folderId);
  return folder ? folder.name : "Unknown";
};

const getActiveTasks = (folderId) => {
  return props.tasks.filter(
    (task) => task.folderId === folderId && !task.completed
  );
};

const loadFolders = () => {
  const savedFolders = localStorage.getItem("taskFolders");
  if (savedFolders) {
    availableFolders.value = JSON.parse(savedFolders);
  }
};

const loadFolderTasks = () => {
  if (selectedFolderId.value) {
    folderTasks.value = getActiveTasks(selectedFolderId.value);
  } else {
    folderTasks.value = [];
  }
};

// Timer functions
const startTimer = () => {
  console.log("Starting timer - emitting focus state: true");
  isRunning.value = true;
  treesGrownThisSession.value = 0;

  // Emit focus state changed
  emit("focus-state-changed", true);

  timerId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;

      // Check if a minute (60 seconds) has passed and grow a tree
      const elapsed = selectedDuration.value - timeLeft.value;
      const minutesCompleted = Math.floor(elapsed / 60); // Change from 3600 to 60 (1 minute = 60 seconds)

      if (minutesCompleted > treesGrownThisSession.value) {
        treesGrownThisSession.value = minutesCompleted;
        growTree();
      }
    } else {
      finishSession();
    }
  }, 1000);
};

const stopTimer = () => {
  console.log("Stopping timer - emitting focus state: false");
  const elapsedTime = selectedDuration.value - timeLeft.value;

  isRunning.value = false;
  clearInterval(timerId);

  // Emit focus state changed
  emit("focus-state-changed", false);

  // If we focused for at least 1 minute, grow a tree and record the session
  if (elapsedTime >= 60) {
    // 1 minute = 60 seconds
    const treesToGrow = Math.floor(elapsedTime / 60);

    // Grow any remaining trees that haven't been grown yet
    for (let i = treesGrownThisSession.value; i < treesToGrow; i++) {
      growTree();
    }

    // Show notification for early stop - but don't call showEarlyStopNotification
    console.log(`Focus session stopped after ${elapsedTime} seconds`);
  }

  // IMPORTANT: Always emit focus time with folderId, even if no trees grown
  console.log(
    "Emitting focus time update:",
    elapsedTime,
    "for folder:",
    selectedFolderId.value
  );
  emit("focus-time-updated", elapsedTime, selectedFolderId.value); // Pass the folder ID!

  // Reset for next session
  timeLeft.value = selectedDuration.value;
  treesGrownThisSession.value = 0;
};

const toggleTaskCompletion = (task) => {
  // Emit task completion to parent component
  emit("task-completed", task.id);

  // Update local task list immediately for UI feedback
  const taskIndex = folderTasks.value.findIndex((t) => t.id === task.id);
  if (taskIndex !== -1) {
    folderTasks.value[taskIndex] = {
      ...folderTasks.value[taskIndex],
      completed: !folderTasks.value[taskIndex].completed,
      completedAt: !folderTasks.value[taskIndex].completed
        ? new Date().toISOString()
        : null,
    };
  }

  // Show completion feedback
  if (!task.completed) {
    showTaskCompletionFeedback(task.title);
  }
};

const showTaskCompletionFeedback = (taskTitle) => {
  // Create a temporary notification
  const notification = document.createElement("div");
  notification.innerHTML = `
    <div class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
      ✓ Completed: ${taskTitle}
    </div>
  `;
  document.body.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
};

const finishSession = () => {
  console.log("Finishing session - emitting focus state: false");
  isRunning.value = false;
  clearInterval(timerId);

  // Emit focus state changed
  emit("focus-state-changed", false);

  // IMPORTANT: Always emit focus time with folderId
  console.log(
    "Emitting focus time update:",
    selectedDuration.value,
    "for folder:",
    selectedFolderId.value
  );
  emit("focus-time-updated", selectedDuration.value, selectedFolderId.value); // Pass the folder ID!

  // Reset for next session
  timeLeft.value = selectedDuration.value;
  treesGrownThisSession.value = 0;

  // Show success notification
  const treesGrown = Math.floor(selectedDuration.value / 60); // Calculate trees grown
  showSuccessNotification(treesGrown);
};

const growTree = () => {
  emit("tree-grown", {
    type: selectedTreeType.value, // Keep this for backward compatibility
    treeType: selectedTreeType.value, // Add this for consistency
    duration: 60,
    source: "timer",
    folderId: selectedFolderId.value,
    grownAt: new Date().toISOString(), // Add timestamp
  });
};

const showSuccessNotification = (treesGrown) => {
  setTimeout(() => {
    let message = `🌳 Congratulations! You completed your focus session!`;

    if (treesGrown > 0) {
      message += ` You grew ${treesGrown} tree${treesGrown !== 1 ? "s" : ""}!`;
    }

    if (selectedFolderId.value) {
      message += ` You focused on "${getFolderName(selectedFolderId.value)}".`;
    }

    alert(message);
  }, 500);
};

const getSessionTreeEmoji = (duration) => {
  const hours = Math.floor(duration / 3600);

  if (hours < 1) return "🌱";
  if (hours < 2) return "🌿";
  if (hours < 4) return "🌳";
  return "🌲";
};

// Lifecycle hooks
onMounted(() => {
  // Load session history from storage if available

  // Load available folders
  loadFolders();

  console.log("Timer component mounted");
});

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId);
  }
  // Save session history

  // ONLY emit focus state changed if we were actually running
  if (isRunning.value) {
    console.log(
      "Timer component unmounting while running - emitting focus state: false"
    );
    emit("focus-state-changed", false);
  }
});
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
  padding: 4px;
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
