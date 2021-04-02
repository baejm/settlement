import Vue from "vue"
import Home from "./views/Home.vue"
import router from "./router"
import store from "./store"
import config from "./config.js"
import { library } from "@fortawesome/fontawesome-svg-core"
import { fas } from "@fortawesome/free-solid-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import io from "socket.io-client"
const socket = io(config.web_server_address)
Vue.prototype.$socket = socket

library.add(fas)
library.add(far)

Vue.component("font-awesome-icon", FontAwesomeIcon)
// 첫글자 대문자로
Vue.filter("capitalize", value => {
  if (!value) return ""
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

//숫자에 ,(콤마)표시
Vue.filter("currency", value => {
  var num = new Number(value)
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,")
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(Home)
}).$mount("#app")
