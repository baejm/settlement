<template>
  <div class="manual_input">
    <div class="manual_box">
      <h2><font-awesome-icon icon="coins" />주차정보 수동입력</h2>
      <span>차량번호</span>
      <input type="text" v-model = "lp"/>
      <span>차종</span>
      <input type="text"  v-model = "vehicle_kind"/>

     <!-- <span>입차시각</span>
      <div class="in_time">
        <select>
          <option value="">오전</option>
          <option value="">오후</option>
        </select>
        <input type="text" />
      </div> -->

      <span>출차시각</span>
      <input type="text" v-model="nowTime" readonly />
      <button @click="manualInput()">계산하기</button>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
export default {
  name: "manual_input",
  data() {
    return {
      //nowTime: this.getDateAndTime(new Date())
      nowTime: 0,
      lp: "",
      vehicle_kind:"A",
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
    editTime() {
      this.getDateAndTime(new Date())
    },
    manualInput() {
      let obj = {}
      obj.vehicle_kind = this.vehicle_kind
      obj.lp = this.lp
      obj.number = obj.lp
      obj.loop_event_time =  get_datetime(this.nowTime)
      obj.time = Date.now()
      obj.kind = "lpr"
      obj.cmd = "manual_vehicle_out"
      obj.contents = "수동출차"
      obj.registered = "일반차량"
      obj.type = "일반차량"
      obj.direction = "out"
      obj.location = this.location.out
      console.log("manuaInputEntry : ", obj)
      this.sendMessage(obj)
      this.$store.state.manualInputSignal = false
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    getDateAndTime(date1) {
      let hour = date1.getHours()
      let minutes = date1.getMinutes()
      // let amPm = "AM"

      if (hour < 10) hour = "0" + hour
      if (minutes < 10) minutes = "0" + minutes
      // if (date1 < 12) {
      //   amPm = "PM"
      // }
      return (this.nowTime = ` ${hour}:${minutes} `)
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
