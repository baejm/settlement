<template>
  <div class="manual_entry">
    <div class="entry_box">
      <h2>
        <font-awesome-icon icon="car" />
        수동입차
      </h2>
      <span>차량번호 (숫자만 입력해주세요.)</span>
      <input type="text" v-model ="lp"/>
      <span>입차시각</span>
      <input type="test" v-model="nowTime" /><button
        class="time_now"
        @click="editTime()"
      >
        현재시간
      </button>
      <div class="btn_box">
        <button @click="cancel">취소</button>
        <button @click="comfirm">확인</button>
      </div>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
export default {
  name: "manual_entry",
  data() {
    return {
      nowTime: 0,
      lp: "",
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
  methods: {
    close() {
      this.$store.state.manualEntrySignal = false
    },
    cancel(){
      this.$store.state.manualEntrySignal = false
    },
    comfirm(){
      let obj = {}
      obj.lp = this.lp
      obj.loop_event_time =  get_datetime(this.nowTime)
      console.log("this.nowTime : ",this.nowTime, "obj.loop_event_time : ", obj.loop_event_time)
      obj.kind = "lpr"
      obj.cmd = "manual_vehicle_in"
      obj.contents = "수동입차"
      obj.direction = "in"
      obj.location = this.location.in
      obj.number = obj.lp
      obj.registered = "일반차량"
      obj.type = "일반차량"
      obj.vehicle_kind = "A"
      obj.time = Date.now()
      console.log("manualEntry : ", obj)
      this.sendMessage(obj)
      this.close()
    },
    editTime() {
      let now = Date.now()
      this.nowTime = format_time(new Date(now))
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    getDateAndTime(date1) {
      let hour = date1.getHours()
      let minutes = date1.getMinutes()
      let seconds = date1.getSeconds()
      // let amPm = "AM"
      let fullDate = `${date1.getFullYear()}/${date1.getMonth() +
        1}/${date1.getDate()}`

      if (hour < 10) hour = "0" + hour
      if (minutes < 10) minutes = "0" + minutes
      if (seconds < 10) seconds = "0" + seconds
      // if (date1 < 12) {
      //   amPm = "PM"
      // }
      return (this.nowTime = `${fullDate} ${hour}:${minutes}:${seconds} `)
    },
    start(){
      let now = Date.now()
      this.nowTime = format_time(new Date(now))
      console.log("maualEntry nowTime : ", this.nowTime)
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
    }
  } 
}
function get_datetime(str) {
	var res = str.split(/[-T.:\s]+/);
	var d = new Date(parseInt(res[0]), parseInt(res[1])-1, parseInt(res[2]), parseInt(res[3]), parseInt(res[4]), 0, 0);
	return d.getTime();
} 
function format_time(dat) {
  var str = ""
  str += dat.getFullYear()
  str += "." + num_to_str(dat.getMonth() + 1)
  str += "." + num_to_str(dat.getDate())
  str += ". " + num_to_str(dat.getHours())
  str += ":" + num_to_str(dat.getMinutes())
  str += ":" + num_to_str(dat.getSeconds())
  return str
}

function num_to_str($num) {
  $num < 10 ? ($num = "0" + $num) : $num
  return $num.toString()
}
</script>
