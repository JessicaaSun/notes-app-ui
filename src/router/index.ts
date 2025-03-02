import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import NoteDetail from "../components/NoteDetail.vue";
import EditNote from "../views/EditNoteView.vue";
import Login from "../views/LoginView.vue";
import Register from "../views/RegisterView.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/note/:id", component: NoteDetail },
  { path: "/edit/:id", component: EditNote, props: true },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

export default router;
