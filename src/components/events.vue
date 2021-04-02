<template>
  <div class="events">
    <h3><font-awesome-icon icon="calendar-check" />이벤트</h3>
    <div>{{ countEvent }}</div>
    <ul>
      <li v-for="(el, index) in eventList" :key="index">
        {{ el }} <span>New</span>
      </li>
    </ul>
  </div>
</template>
<script>
import config from "../config.js"
export default {
  name: "events",
  data() {
    return {
      in_time: 0,
      out_time: 0,
      lp: "",
      registered: "",
      location: {
        in: "",
        out: ""
      },
      eventList: [
      
      ]
    }
  },
  computed: {
    countEvent() {
      return this.eventList.length
    }
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if (data.kind == "lpr") {
        console.log("data.kind : ", data.kind, data)
      //  this.lpr_process(data)
      }
      // if (data.kind == "lpr" || data.kind == "fee_calculation_result" || data.kind == "lpr_payment") {
      //   console.log("data.kind : ", data.kind, data)
      //   this.lpr_process(data)
      // }       
    }),
    this.start()
    
  }, 
  methods: {
    lpr_process(data){
      if(data.location === this.location.in){
        this.lp = data.lp
        this.in_time = format_time(new Date(data.loop_event_time))
        if(data.registered === "등록차량"){
          this.registered = "정기권"
        }
        else{
          this.registered = "일반권"
        }
        if(data.car_kind && data.car_kind !== "A"){
          this.car_kind = "B(경차)"
        }
        else{
           this.car_kind = "A(기본요금)"
        }
        let event = {}
        
        event= this.in_time.substring(12,) + " " + this.registered + " " + this.lp + " " + "입차"
        this.eventList.unshift(event)    
        if(this.eventList.length > 10){
          this.eventList.splice(11,)
        }
        localStorage.eventList = JSON.stringify(this.eventList)

      }
      else if(data.location === this.location.out){
        this.lp = data.lp
        this.out_time = format_time(new Date(data.loop_event_time))
        if(data.registered === "등록차량"){
          this.registered = "정기권"
        }
        else{
          this.registered = "일반권"
        }
        if(data.car_kind && data.car_kind !== "A"){
          this.car_kind = "B(경차)"
        }
        else{
           this.car_kind = "A(기본요금)"
        }
        let event = {}
        
        event = this.out_time.substring(12,) + " " + this.registered + " " + this.lp + " " + "출차"
        this.eventList.unshift(event)   
        if(this.eventList.length > 10){
          this.eventList.splice(11,)
        } 
        localStorage.eventList = JSON.stringify(this.eventList)

      }
    },
    start(){
      console.log("config.location.in : ",config.location.in)
      let interval = 1 * 1000;
      this.location.in = config.location.in
      this.location.out = config.location.out
      this.eventList = JSON.parse(localStorage.eventList)
      setInterval(() => {
        this.eventList = JSON.parse(localStorage.eventList)
      }, interval);

    }
  }
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
