<template>
  <div class="control_wrap">
    <div class="control_top">
      <button @click="$store.push({ name: 'report' })">
        입출차 관리 <span>F2</span>
      </button>
      <button @click="newPage">정기차량 관리<span>F3</span></button>
      <!-- <router-link to="/report">보고<span>F4</span></router-link> -->
      <!-- <a target="_blank" href="/report" @click.stop="openPop">your_name</a> -->
      <button @click="openPop()">보고<span>F4</span></button>
      <!-- <a target="_blank" href="/report" @click="openPop">테스트</a> -->
      <!-- <router-link :to="link" @click="openPop">ㅇㄹ</router-link> -->
    </div>
    <div class="control_bottom">
      <h3>
        <font-awesome-icon icon="undo-alt" /><i class="fas fa-gamepad"></i
        >차단기 제어
      </h3>
      <div class="control_content">
        <div class="control_btn">
          <ul :class="{ active:active1 }">
            <h4>입구</h4>
            <li><button  @click="gate_in_close" >닫기</button></li>
            <li><button  @click="gate_in_open" >열기</button></li>
            <li>열림</li>
          </ul>
          <ul :class="{ active:active2 }">
            <h4>출구</h4>
            <li><button  @click="gate_out_close" >닫기</button></li>
            <li><button  @click="gate_out_open" >열기</button></li>
            <li>열림</li>
          </ul>
        </div>
        <button @click="freeOpen">무료운영</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import config from "../config.js"
export default {
  name: "control_wrap",
  data() {
    return {
      url: "",
      link: "report",
      gate: {
        in:{
            open: 0,
            close: 0,
        },
        out: {
            open: 0,
            close: 0,
        }
      },
      eventList: [
      
      ],
      location: {
        in: "",
        out: ""
      },
     // active: false,
      active1: false,
      active2: false
    }
  },
  created() {  
   this.$socket.on("message_from_server", data => {
      if (data.kind === "bar_status") {
        console.log("data.kind : ", data.kind, data)
        this.bar_status(data)
      }
      else if(data.kind === "barrier_status"){
        console.log("data.kind : ", data.kind, data)
        this.barrier_status(data)
      }
    }),
    this.start()
  },
  computed: {
    ...mapState(["freeOperation"])
  },
  methods: {    
    newPage() {
      // let route = this.$router.resolve({ path: "/report" })
      // window.open(route.href)
      // this.$store.etcPop = true
      // console.log(this.$store.etcPop, "값")
      // window.open("/report", "_blank")
      // window.location.href = "/report"
    },
    gate_in_close(){
      let obj = {}
      obj.location = this.location.in
      obj.kind = "control"
      obj.id = localStorage.id
      obj.how = "manual close"
      obj.contents = obj.location + " 입구 게이트 닫음"
      obj.value = "close"
      obj.time = Date.now()
      console.log("cotrolwrap gate in close : ", obj)
      if(localStorage.gate){
        this.gate = JSON.parse(localStorage.gate)
      }
      this.gate.in.close += 1
      localStorage.gate = JSON.stringify(this.gate)
      if(localStorage.eventList){
        this.eventList = JSON.parse(localStorage.eventList)
      }
      let event= format_time(new Date(Date.now())).substring(12,) + " " +  "입구 게이트 닫음"
      this.eventList.unshift(event)    
      if(this.eventList.length > 10){
        this.eventList.splice(11,)
      }
      localStorage.eventList = JSON.stringify(this.eventList)
      this.sendMessage(obj)
    },
    gate_in_open(){
      let obj = {}
      obj.location = this.location.in
      obj.kind = "control"
      obj.id = localStorage.id
      obj.how = "manual open"
      obj.contents = obj.location + "  입구 게이트 개방"
      obj.value = "open"
      obj.time = Date.now()
      console.log("cotrolwrap gate in open : ", obj)
      if(localStorage.gate){
        this.gate = JSON.parse(localStorage.gate)
      }
      this.gate.in.open += 1
      localStorage.gate = JSON.stringify(this.gate)
      if(localStorage.eventList){
        this.eventList = JSON.parse(localStorage.eventList)
      }
      let event= format_time(new Date(Date.now())).substring(12,) + " " +  "입구 게이트 개방"
      this.eventList.unshift(event)    
      if(this.eventList.length > 10){
        this.eventList.splice(11,)
      }
      localStorage.eventList = JSON.stringify(this.eventList)
      this.sendMessage(obj)
    },
    gate_out_close(){
      let obj = {}
      obj.location = this.location.out
      obj.kind = "control"
      obj.id = localStorage.id
      obj.how = "manual close"
      obj.contents = obj.location + "  출구 게이트 닫음"
      obj.value = "close"
      obj.time = Date.now()
      console.log("cotrolwrap gate out close : ", obj)
      if(localStorage.gate){
        this.gate = JSON.parse(localStorage.gate)
      }
      this.gate.out.close += 1
      localStorage.gate = JSON.stringify(this.gate)
      if(localStorage.eventList){
        this.eventList = JSON.parse(localStorage.eventList)
      }
      let event= format_time(new Date(Date.now())).substring(12,) + " " +  "출구 게이트 닫음"
      this.eventList.unshift(event)    
      if(this.eventList.length > 10){
        this.eventList.splice(11,)
      }
      localStorage.eventList = JSON.stringify(this.eventList)
      this.sendMessage(obj)
    },
    gate_out_open(){
      let obj = {}
      obj.location = this.location.out
      obj.kind = "control"
      obj.id = localStorage.id
      obj.how = "manual open"
      obj.contents = obj.location + "  출구 게이트 개방"
      obj.value = "open"
      obj.time = Date.now()
      console.log("cotrolwrap gate out open : ", obj)
      if(localStorage.gate){
        this.gate = JSON.parse(localStorage.gate)
      }
      this.gate.out.open += 1
      localStorage.gate = JSON.stringify(this.gate)
      if(localStorage.eventList){
        this.eventList = JSON.parse(localStorage.eventList)
      }
      let event= format_time(new Date(Date.now())).substring(12,) + " " +  "출구 게이트 개방"
      this.eventList.unshift(event)    
      if(this.eventList.length > 10){
        this.eventList.splice(11,)
      }
      localStorage.eventList = JSON.stringify(this.eventList)
      this.sendMessage(obj)
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    openPop() {
      // alert("ㄷ")
      this.$store.state.newPopup = true
      console.log(this.$store.state.newPopup, "이거")
    },
    freeOpen(){
      let obj = {}
      obj.cmd = "update_barrier_policy"
      obj.kind = "barrier_policy"
      obj.location = this.location.out
      obj.direction = "out"
      obj.value = "일반차량"
      obj.time = Date.now()
      this.sendMessage(obj)
      this.$store.state.freeOperation = true
    },
    bar_status_query() {
      var obj = {}
      obj.kind = "bar_status"
      obj.control_id = "admin001"
      console.log("bar_status_query")
      this.sendMessage(obj)
    },
    barrier_status(data1){           
      console.log("barrier_status", data1)
      if(data1.location === this.location.in){
        if(data1.status === "up" || data1.status === "UP"){
          this.active1 = true
        }
        else if(data1.status === "down" || data1.status === "DOWN"){
          this.active1 = false
        }        
      }
      else if(data1.location === this.location.out){
        if(data1.status === "up" || data1.status === "UP"){
          this.active2 = true
        }
        else if(data1.status === "down" || data1.status === "DOWN"){
          this.active2= false
        }        
      }
    },
    bar_status(data1){
      console.log("bar_status", data1)
      for (let i = 0; i < data1.docs.length; i++) {
        let bar_status = data1.docs[i]
        if(bar_status.location === this.location.in){
          if(bar_status.status === "up" || bar_status.status === "UP"){
            this.active1 = true
          }
          else if(bar_status.status === "down" || bar_status.status === "DOWN"){
            this.active1 = false
          }
        } 
        else if(bar_status.location === this.location.out){
          if(bar_status.status === "up" || bar_status.status === "UP"){
            this.active2 = true
          }
          else if(bar_status.status === "down" || bar_status.status === "DOWN"){
            this.active2 = false
          }
        }
      }     
    },
    start(){
      // let now = Date.now()
      // this.nowTime = format_time(new Date(now))
      console.log("maualEntry nowTime : ", this.nowTime)
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
      this.bar_status_query()
      if(localStorage.gate){
        this.gate = JSON.parse(localStorage.gate)
      }
      
    }
  },
  mount() {
    this.url = `${window.location.origin}/report`
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
