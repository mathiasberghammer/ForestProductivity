import { createRouter, createWebHashHistory } from 'vue-router'
import FocusTimer from '../components/FocusTimer.vue'
import TodoList from '../components/TodoList.vue'
import ForestView from '../components/ForestView.vue'

const routes = [
  {
    path: '/',
    redirect: '/timer'
  },
  {
    path: '/timer',
    name: 'timer',
    component: FocusTimer
  },

  {
    path: '/todos',
    name: 'todos',
    component: TodoList
  },
  {
    path: '/forest',
    name: 'forest',
    component: ForestView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router