<template>
  <div class="min-h-screen bg-stone-50 font-sans">
    <div class="flex h-screen">
      <!-- Sidebar -->
      <nav
        class="w-80 bg-stone-800 border-r border-stone-700 p-6 flex flex-col"
      >
        <!-- Logo Section -->
        <div
          class="flex items-center gap-3 mb-10 pb-6 border-b border-stone-600 relative"
        >
          <!-- Hanging Pothos -->
          <img
            src="/pothos.png"
            alt="Hanging Pothos"
            class="absolute -top-2 -left-2 w-16 h-24 object-cover z-10 pointer-events-none opacity-90"
            style="transform: scaleX(-1)"
          />

          <!-- Original Logo -->
          <div
            class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-stone-800 shadow-lg"
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6">
              <path fill="currentColor" d="M12 2L8 8h8l-4-6z" />
              <path
                fill="currentColor"
                d="M10 8L6 14h12l-4-6H10z"
                opacity="0.8"
              />
              <rect
                x="11"
                y="14"
                width="2"
                height="8"
                fill="currentColor"
                opacity="0.6"
              />
            </svg>
          </div>

          <div class="flex-1">
            <h1 class="text-2xl font-bold text-amber-100 leading-none">
              FocusForest
            </h1>
            <span class="text-sm text-amber-300 font-medium block mt-0.5"
              >Productivity Studio</span
            >
          </div>

          <!-- Tiny Reset Button -->
          <button
            @click="confirmResetProfile"
            class="w-6 h-6 flex items-center justify-center rounded-lg bg-red-900 hover:bg-red-800 text-red-300 hover:text-red-200 transition-all duration-200 opacity-50 hover:opacity-100"
            title="Reset all data"
          >
            <svg
              class="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          </button>
        </div>

<!-- Navigation -->
<div class="flex-1 flex flex-col gap-2 mb-8">
          <router-link
            v-for="item in navItems"
            :key="item.id"
            :to="{ name: item.id }"
            class="w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 text-sm font-medium text-left group relative overflow-hidden"
            :class="[
              $route.name === item.id
                ? 'bg-amber-600 text-stone-900 shadow-lg transform scale-105'
                : focusing && $route.name === 'timer' && item.id !== 'timer'
                ? 'text-amber-200 opacity-50 cursor-not-allowed'
                : 'text-amber-200 hover:bg-stone-700 hover:translate-x-2 hover:shadow-md hover:text-amber-100',
            ]"
            @click="handleNavClick($event, item.id)"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0 z-10" />
            <span class="flex-1 z-10">{{ item.label }}</span>
            <!-- Active indicator -->
            <div
              v-if="$route.name === item.id"
              class="absolute left-0 top-0 w-1 h-full bg-amber-400 rounded-r"
            ></div>
            <!-- Focus lock indicator -->
            <div
              v-if="
                focusing && $route.name === 'timer' && $route.name !== item.id
              "
              class="absolute inset-0 bg-stone-900 bg-opacity-50 rounded-xl flex items-center justify-center"
            >
              <svg
                class="w-4 h-4 text-amber-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 616 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          </router-link>
          
        </div>

        <!-- Focus Status Banner -->
        <div
          v-if="focusing && $route.name === 'timer'"
          class="mb-6 p-4 bg-amber-800 border border-amber-600 rounded-xl"
        >
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            <div>
              <div class="text-sm font-bold text-amber-100">
                Focus Mode Active
              </div>
              <div class="text-xs text-amber-300">
                Navigation is locked during focus sessions
              </div>
            </div>
          </div>
        </div>

                  <!-- Pothos Pot Image -->
        <div class="flex justify-center mt-2 ">
          <img
              src="/pothosPot.png"
              alt="Pothos in Pot"
              class="w-24 h-24 object-contain opacity-80"
            />
          <img
              src="/mushroom.png"
              alt="Pothos in Pot"
              class="w-24 h-24 object-contain opacity-80"
            />

            <img
              src="/alocasia.png"
              alt="Pothos in Pot"
              class="w-24 h-24 object-contain opacity-80"
            />
          </div>

        <!-- Stats Panel -->
        <div class="border-t border-stone-600 pt-6">
          <h3
            class="text-sm font-bold text-amber-100 mb-6 uppercase tracking-wider"
          >
            Your Progress
          </h3>
          <div class="space-y-4">
            <div
              class="flex items-center justify-between p-4 bg-stone-700 rounded-xl border border-stone-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-stone-600"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center"
                >
                  <span class="text-green-200 text-sm">🌳</span>
                </div>
                <div>
                  <div
                    class="text-xs text-amber-300 font-medium uppercase tracking-wider"
                  >
                    Trees
                  </div>
                  <div class="text-xl font-bold text-amber-100">
                    {{ totalTrees }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between p-4 bg-stone-700 rounded-xl border border-stone-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-stone-600"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-amber-700 rounded-lg flex items-center justify-center"
                >
                  <span class="text-amber-200 text-sm">⏰</span>
                </div>
                <div>
                  <div
                    class="text-xs text-amber-300 font-medium uppercase tracking-wider"
                  >
                    Hours
                  </div>
                  <div class="text-xl font-bold text-amber-100">
                    {{ totalFocusHours }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex items-center justify-between p-4 bg-stone-700 rounded-xl border border-stone-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-stone-600"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-orange-700 rounded-lg flex items-center justify-center"
                >
                  <span class="text-orange-200 text-sm">✓</span>
                </div>
                <div>
                  <div
                    class="text-xs text-amber-300 font-medium uppercase tracking-wider"
                  >
                    Tasks
                  </div>
                  <div class="text-xl font-bold text-amber-100">
                    {{ completedTasksCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-1 h-screen overflow-hidden bg-amber-500">
        <div
          class="h-full overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent"
        >
          <router-view
            :trees="trees"
            :tasks="tasks"
            :folder-focus-time="folderFocusTime"
            :focus-sessions="focusSessions"
            @tree-grown="handleTreeGrown"
            @task-created="handleTaskCreated"
            @task-updated="handleTaskUpdated"
            @task-deleted="handleTaskDeleted"
            @task-completed="handleTaskCompleted"
            @focus-time-updated="handleFocusTimeUpdated"
            @focus-state-changed="handleFocusUpdated"
            @folder-created="handleFolderCreated"
            @folder-deleted="handleFolderDeleted"
            @jungle-completed="handleJungleCompleted"
            @jungle-changed="handleJungleChanged"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
// Complete corrected script section for App.vue

import { ref, computed, onMounted, h } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// Fixed icon components using render functions
const TimerIcon = {
  render() {
    return h(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
      },
      [
        h("circle", { cx: "12", cy: "12", r: "10" }),
        h("polyline", { points: "12,6 12,12 16,14" }),
      ]
    );
  },
};

const TasksIcon = {
  render() {
    return h(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
      },
      [
        h("path", { d: "M9 11l3 3L22 4" }),
        h("path", {
          d: "M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
        }),
      ]
    );
  },
};

const ForestIcon = {
  render() {
    return h(
      "svg",
      {
        viewBox: "0 0 24 24",
        fill: "currentColor",
      },
      [
        h("path", { d: "M12 2L8 8h8l-4-6z" }),
        h("path", { d: "M10 8L6 14h12l-4-6H10z", opacity: "0.8" }),
        h("rect", {
          x: "11",
          y: "14",
          width: "2",
          height: "8",
          opacity: "0.6",
        }),
      ]
    );
  },
};

// Reactive data
const trees = ref([]);
const tasks = ref([]);
const focusing = ref(false);
const folderFocusTime = ref({});
const focusSessions = ref([]);

// Computed properties (don't try to write to these)
const totalFocusTime = computed(() => {
  return focusSessions.value.reduce((total, session) => {
    const duration =
      typeof session.duration === "string"
        ? parseInt(session.duration, 10)
        : session.duration || 0;
    return total + duration;
  }, 0);
});

const totalTrees = computed(() => {
  // Get current active jungle trees
  const currentTrees = trees.value.length;

  // Get completed jungle trees from localStorage
  let completedJungleTrees = 0;
  try {
    const savedGenerations = localStorage.getItem("jungleGenerations");
    if (savedGenerations) {
      const generations = JSON.parse(savedGenerations);
      completedJungleTrees = generations
        .filter((jungle) => jungle.completedAt) // Only completed jungles
        .reduce((total, jungle) => total + (jungle.trees?.length || 0), 0);
    }
  } catch (error) {
    console.error("Error loading jungle generations for tree count:", error);
  }

  const totalCount = currentTrees + completedJungleTrees;
  console.log(
    `Total trees: ${currentTrees} (current) + ${completedJungleTrees} (completed) = ${totalCount}`
  );

  return totalCount;
});
const totalFocusHours = computed(() => Math.floor(totalFocusTime.value / 3600));
const completedTasksCount = computed(() => {
  // Only count main tasks (not subtasks) in the total
  return tasks.value.filter((task) => task.completed && !task.parentId).length;
});

// Navigation items
const navItems = [
  { id: "timer", label: "Focus Timer", icon: TimerIcon },
  { id: "todos", label: "Tasks", icon: TasksIcon },
  { id: "forest", label: "My Forest", icon: ForestIcon },
];

// Event handlers - FIXED: Don't assign to computed properties
const handleFocusTimeUpdated = (focusTime, folderId = null) => {
  console.log("=== FOCUS TIME UPDATE ===");
  console.log("Received focusTime:", focusTime, "seconds");
  console.log("Received folderId:", folderId);

  // IMPORTANT: Ensure focusTime is a number
  const duration =
    typeof focusTime === "string" ? parseInt(focusTime, 10) : focusTime;

  // Track focus session (regardless of trees grown)
  if (duration > 0) {
    const session = {
      id: Date.now() + Math.random(),
      duration: duration, // Store as number, not string
      folderId: folderId,
      completedAt: new Date().toISOString(),
      source: "timer",
    };
    focusSessions.value.push(session);
    console.log("Added session:", session);
  }

  // Track focus time per folder
  if (folderId && duration > 0) {
    if (!folderFocusTime.value[folderId]) {
      folderFocusTime.value[folderId] = 0;
    }

    // IMPORTANT: Ensure we're adding numbers, not strings
    const currentTime =
      typeof folderFocusTime.value[folderId] === "string"
        ? parseInt(folderFocusTime.value[folderId], 10)
        : folderFocusTime.value[folderId];

    folderFocusTime.value[folderId] = currentTime + duration;

    console.log(
      `Folder ${folderId} time: ${currentTime} + ${duration} = ${folderFocusTime.value[folderId]} seconds`
    );

    // Save to localStorage
    localStorage.setItem(
      "folderFocusTime",
      JSON.stringify(folderFocusTime.value)
    );
  }

  console.log("Current folderFocusTime:", folderFocusTime.value);
  console.log("Total focus sessions:", focusSessions.value.length);
  console.log("=== END FOCUS TIME UPDATE ===");

  saveData();
};

const handleJungleCompleted = (data) => {
  trees.value = [];

  // Save the cleared state
  saveData();
};

// Navigation handler
const handleNavClick = (event, itemId) => {
  if (focusing.value && route.name === "timer" && itemId !== "timer") {
    event.preventDefault();
    event.stopPropagation();
    console.log("Navigation blocked - Focus mode is active");
    return false;
  }
};

// Other event handlers remain the same...
const handleTreeGrown = (treeData) => {
  const newTree = {
    id: Date.now() + Math.random(),
    type: treeData.type || "oak",
    grownAt: new Date().toISOString(),
    duration: treeData.duration || 0,
    source: treeData.source || "timer",
    folderId: treeData.folderId || null,
  };
  trees.value.push(newTree);
  saveData();
};

const handleTaskCreated = (taskData) => {
  
  const newTask = {
    id: Date.now() + Math.random(),
    title: taskData.title,
    folderId: taskData.folderId,
    dueDate: taskData.dueDate || null,
    completed: false,
    completedAt: null,
    parentId: taskData.parentId || null,
    createdAt: new Date().toISOString(),
  };
  
  tasks.value.push(newTask);
  saveData();
};

const handleTaskUpdated = (updatedTask) => {
  const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = { ...updatedTask };

    if (updatedTask.completed && !tasks.value[index].completedAt) {
      tasks.value[index].completedAt = new Date().toISOString();
    }

    saveData();
  }
};

const handleTaskDeleted = (taskId) => {
  tasks.value = tasks.value.filter((task) => task.id !== taskId);
  saveData();
};

const handleTaskCompleted = (taskId) => {
  console.log("Task completed from focus timer:", taskId);

  const taskIndex = tasks.value.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks.value[taskIndex] = {
      ...tasks.value[taskIndex],
      completed: true,
      completedAt: new Date().toISOString(),
    };

    console.log("Task marked as completed:", tasks.value[taskIndex]);
    saveData();
    showTaskCompletionMessage(tasks.value[taskIndex].title);
  }
};

const showTaskCompletionMessage = (taskTitle) => {
  console.log(`Task "${taskTitle}" has been moved to archive!`);
};

const handleFocusUpdated = (isFocusing) => {
  console.log("Focus state updated:", isFocusing);
  focusing.value = isFocusing;
  saveData();
};

const handleFolderCreated = (folderData) => {
  console.log("Folder created:", folderData);
};

const handleFolderDeleted = (folderId) => {
  tasks.value = tasks.value.filter((task) => task.folderId !== folderId);
  saveData();
  console.log("Folder deleted:", folderId);
};

// Data persistence - FIXED: Don't save computed values
const saveData = async () => {
  try {
    if (window.electronAPI) {
      await window.electronAPI.store.set("trees", trees.value);
      await window.electronAPI.store.set("tasks", tasks.value);
      // Don't save totalFocusTime - it's computed from focusSessions
      await window.electronAPI.store.set(
        "folderFocusTime",
        folderFocusTime.value
      );
      await window.electronAPI.store.set("focusSessions", focusSessions.value);
    } else {
      localStorage.setItem("forestApp_trees", JSON.stringify(trees.value));
      localStorage.setItem("forestApp_tasks", JSON.stringify(tasks.value));
      // Don't save totalFocusTime - it's computed from focusSessions
      localStorage.setItem(
        "forestApp_folderFocusTime",
        JSON.stringify(folderFocusTime.value)
      );
      localStorage.setItem(
        "forestApp_focusSessions",
        JSON.stringify(focusSessions.value)
      );
    }
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const loadData = async () => {
  try {
    if (window.electronAPI) {
      const savedTrees = (await window.electronAPI.store.get("trees")) || [];
      const savedTasks = (await window.electronAPI.store.get("tasks")) || [];
      const savedFolderFocusTime =
        (await window.electronAPI.store.get("folderFocusTime")) || {};
      const savedFocusSessions =
        (await window.electronAPI.store.get("focusSessions")) || [];

      trees.value = savedTrees;
      tasks.value = savedTasks;
      folderFocusTime.value = savedFolderFocusTime;
      focusSessions.value = savedFocusSessions;
      // Don't load totalFocusTime - it's computed
    } else {
      const savedTrees = localStorage.getItem("forestApp_trees");
      const savedTasks = localStorage.getItem("forestApp_tasks");
      const savedFolderFocusTime = localStorage.getItem(
        "forestApp_folderFocusTime"
      );
      const savedFocusSessions = localStorage.getItem(
        "forestApp_focusSessions"
      );

      if (savedTrees) trees.value = JSON.parse(savedTrees);
      if (savedTasks) tasks.value = JSON.parse(savedTasks);
      if (savedFolderFocusTime)
        folderFocusTime.value = JSON.parse(savedFolderFocusTime);
      if (savedFocusSessions)
        focusSessions.value = JSON.parse(savedFocusSessions);
      // Don't load totalFocusTime - it's computed
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
};

// Reset function - FIXED
const confirmResetProfile = () => {
  const confirmMessage = `⚠️ WARNING: This will permanently delete ALL your data:

• ${totalTrees.value} trees in your forest
• ${tasks.value.length} tasks (active and completed)  
• ${totalFocusHours.value} hours of focus time
• All folders and progress

This action cannot be undone. Are you absolutely sure?`;

  if (confirm(confirmMessage)) {
    if (
      confirm(
        "Last chance! Are you really sure you want to delete everything and start fresh?"
      )
    ) {
      resetProfile();
    }
  }
};

const handleJungleChanged = (data) => {
  console.log("Jungle view changed:", data);

  if (data.jungle.completedAt) {
    // Viewing a completed jungle - load its trees temporarily for display
    console.log("Viewing completed jungle:", data.jungle.name);
    console.log("Trees in this jungle:", data.jungle.trees?.length || 0);
    // ForestView will handle displaying the stored trees
  } else {
    // Viewing active jungle - should show current trees
    console.log("Viewing active jungle:", data.jungle.name);
    console.log("Current active trees:", trees.value.length);
  }
};

const resetProfile = async () => {
  try {
    // Clear all reactive data
    trees.value = [];
    tasks.value = [];
    focusing.value = false;
    folderFocusTime.value = {};
    focusSessions.value = [];
    // Don't clear totalFocusTime - it's computed

    // Clear storage
    if (window.electronAPI) {
      await window.electronAPI.store.clear();
    } else {
      localStorage.removeItem("forestApp_trees");
      localStorage.removeItem("forestApp_tasks");
      localStorage.removeItem("forestApp_totalFocusTime"); // Remove this from storage
      localStorage.removeItem("forestApp_folderFocusTime");
      localStorage.removeItem("forestApp_focusSessions");
      localStorage.removeItem("taskFolders");
      localStorage.removeItem("focusSessionHistory");
      localStorage.removeItem("jungleGenerations"); // Add this line to clear all jungle data
    }

    console.log(
      "✅ Profile reset complete - all data cleared including jungle generations"
    );
  } catch (error) {
    console.error("Error resetting profile:", error);
    alert("Error resetting profile. Please try again.");
  }
};

// Lifecycle hooks
onMounted(() => {
  loadData();

  router.beforeEach((to, from, next) => {
    if (focusing.value && from.name === "timer" && to.name !== from.name) {
      console.log("Router guard blocking navigation from timer while focusing");
      next(false);
    } else {
      next();
    }
  });
});
</script>
