<template>
  <div class="free_operation">
    <div class="free_box">
      <h2>무료운영중</h2>
      <span>무료운영시에는 차단기가 열려 있습니다.</span>

      <button @click="freeClose">무료운영 해제</button>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import config from "../config.js"
export default {
  name: "free_operation",
  data() {
    return {
      location: {
        in: "",
        out: ""
      },
    }
  },
  created() {  
   this.$socket.on("message_from_server", data => {
      if ((data.kind == "fee_calculation_result" || data.kind == "lpr_payment")&& data.direction == "out") {
        console.log("data.kind : ", data.kind, data)
      //  this.lpr_process(data)
      }
    }),
    this.start()
  },
  computed: {
    ...mapState(["freeOperation"])
  },
  methods: {
    freeClose() {
      let obj = {}
      obj.cmd = "update_barrier_policy"
      obj.kind = "barrier_policy"
      obj.location = this.location.out
      obj.direction = "out"
      obj.value = "등록차량"
      obj.time = Date.now()
      this.sendMessage(obj)      
      console.log(this.freeOperation)
      this.$store.state.freeOperation = false
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    start(){
      // let now = Date.now()
      // this.nowTime = format_time(new Date(now))
     // console.log("maualEntry nowTime : ", this.nowTime)
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
    }
  }
}
</script>
