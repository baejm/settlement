import Vue from "vue"
import Vuex from "vuex"
// import router from "@/router"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 로그인유무
    loginSuccess: false,
    // 미인식차량이미지
    statusSignal: false,
    // 수동입차
    manualEntrySignal: false,
    // 수동출차
    manualInputSignal: false,
    // 무료운영
    freeOperation: false,
    // 할인적용
    discount: false,
    ectPop: false,
    newPopup: false,
    outSignal: false,
    reduct: false,
    calculateUse: false
  },
  mutations: {},
  actions: {},
  modules: {}
})
