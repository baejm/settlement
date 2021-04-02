import Vue from "vue"
import VueRouter from "vue-router"
//import store from "@/store"
Vue.use(VueRouter)
/*
const checkLogin = (to, from, next) => {
  if (localStorage.status !== "ok") {
    alert("로그인을 해야합니다.")
    this.$store.state.loginSuccess = false
   // next("/")
  } else {
    next()
    store.state.fresh = false
  }
}
*/
const routes = [
  {
    path: "/",
    name: "Home",
   // beforeEnter: checkLogin,
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue")
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

export default router
