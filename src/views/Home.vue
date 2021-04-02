<template>
  <div class="body_wrap">
    <popLogin v-if="loginSuccess"></popLogin>
    <report v-if="newPopup"></report>
    <manualEntry v-if="manualEntrySignal"></manualEntry>
    <freeOperation v-if="freeOperation"></freeOperation>
    <manualInput v-if="manualInputSignal"></manualInput>
    <discountList v-if="discount"></discountList>
    <calculate v-if="calculateUse"></calculate>
    <reduction v-if="reduct"></reduction>
    <header>
      <ul class="navi" v-show="newPopup === false">
        <li>
          <span>{{ verInfo }} </span>
        </li>
        <li>
          <span>{{ parking_name }} </span>
        </li>
        <li>
          <span>{{ payment_name }} </span>
        </li>
        <li>
          <span>{{ id }} </span>
        </li>
        <li>
          <a href="http://www.naver.com" target="_blank"> F1 도움말</a>
        </li>
        <li><button @click="logOut()">로그아웃</button></li>
        <li>{{ nowDate }}</li>
      </ul>
    </header>

    <article v-show="newPopup === false">
      <div class="content_top">
        <!-- 고정 컨텐츠 -->
        <controlWrap></controlWrap>
        <!-- 팝업 컨텐츠 -->
        <parkingInfo v-if="outSignal"></parkingInfo>
        <paySale v-if="outSignal" ref="test"></paySale>
        <cashWrap v-if="outSignal"></cashWrap>

        <!-- 기본 basic -->
        <officeStatus v-if="outSignal === false"></officeStatus>
        <events v-if="outSignal === false"></events>
        <noticeWrap v-if="outSignal === false"></noticeWrap>
      </div>
      <div class="content_bottom">
        <inCar></inCar>
        <outCarWrap></outCarWrap>

        <!-- 버튼 v-for이용시 -->
        <!-- <div class="btns">
          <button @click="evnet()" v-for="(btt, index) in btns" :key="index">
            {{ btt.btsTitle }}
            <span>{{ btt.btsSign }}</span>
          </button>
        </div> -->

        <div class="btns">
          <button @click="manualEntry()">수동입차 <span>M</span></button>
          <button @click="manualInput()">
            수동출차 <br />(분실건) <span>O</span>
          </button>
          <button @click="discountCheck()">할인권 <span>S</span></button>
          <button @click="reduction()">감면 <span>R</span></button>
          <button @click="calculate()">정산 <span>T</span></button>
          <button @click="previous_cancel()">직전 취소 <span>C</span></button>
          <button @click="card_cancel()">카드결제<br />취소 <span>B</span></button>
          <button>영수증<br />재발급 <span>I</span></button>
          <button>미인식 차량 <span>U</span></button>
          <button @click="open_safe()">금고 개방 <span>E</span></button>
          <button>예비버튼 <span>Q</span></button>
          <button>예비버튼 <span>W</span></button>
          <button>예비버튼 <span>Z</span></button>
          <button>예비버튼 <span>Y</span></button>
          <button>예비버튼 <span>K</span></button>
          <button>예비버튼 <span>L</span></button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from "vuex"
import popLogin from "../components/popLogin"
import officeStatus from "../components/officeStatus"
import events from "../components/events"
import noticeWrap from "../components/noticeWrap"
import inCar from "../components/inCar"
import outCarWrap from "../components/outCarWrap"
import parkingInfo from "../components/parkingInfo"
import paySale from "../components/paySale"
import cashWrap from "../components/cashWrap"
import manualEntry from "../components/manualEntry"
import controlWrap from "../components/controlWrap"
import freeOperation from "../components/freeOperation"
import manualInput from "../components/manualInput"
import discountList from "../components/discountList"
import report from "../components/report"
import reduction from "../components/reduction"
import calculate from "../components/calculate"
import config from "../config.js"
export default {
  components: {
    officeStatus,
    events,
    noticeWrap,
    inCar,
    outCarWrap,
    popLogin,
    parkingInfo,
    paySale,
    cashWrap,
    manualEntry,
    controlWrap,
    freeOperation,
    manualInput,
    discountList,
    report,
    reduction,
    calculate
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeyPress)
  },
  data() {
    return {
      active: false,
      nowDate: "현재시간",
      dis: true,
      etcPop: false,
      //outSignal: false,
      verInfo: "",
      id: "",
      pw: "",
      status:"",
      manager:"",
      parking_name: "",
      payment_name: "",
      job_start_time: 0,
      appronvo: "",
      entry: [{ signal: true }],
      exit: [{ signal: true }, { signal: true }],
      location: {
        in: "",
        out: ""
      },
       eventList: [
      
      ],
      btns: [
        { btsTitle: "수동입차", btsSign: "A" },
        { btsTitle: "수동입차", btsSign: "B" },
        { btsTitle: "수동입차", btsSign: "C" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" },
        { btsTitle: "수동입차", btsSign: "D" }
      ]
    }
  },
  computed: {
    ...mapState([
      "freeOperation",
      "manualEntrySignal",
      "manualInputSignal",
      "discount",
      "loginSuccess",
      "newPopup",
      "outSignal",
      "reduct",
      "calculateUse"
    ])
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if (
        (data.kind == "fee_calculation_result" || data.kind == "lpr_payment") &&
        data.direction == "out"
      ) {
        console.log("data.kind : ", data.kind, data)
        this.lpr_process(data)
      }
      if (data.kind == "create_announce_list" || data.kind == "update_announce_list" || data.kind == "delete_announce_list") {
        console.log("data.kind : ", data.kind, data)
        this.text_process(data)
      }
      else if (data.kind === "socket_error") {  
        console.log("socket error : ", data)      
        this.socket_error(data)
      }
      else if (data.kind === "socket_normal") {
         console.log("socket normal : ", data)
          this.socket_normal(data)
      }
    }),
      this.start()
    if (typeof window !== "undefined") {
      document.addEventListener("keydown", this.handleKeyPress)
    }  
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      document.removeEventListener("keydown", this.handleKeyPress)
    }
  },
  methods: {
    handleKeyPress(e) {
      // e.stopPropagation()
      if (e.keyCode === 73) {
        // this.discountCheck()
      } else if (e.keyCode === 77) {
        // m
        this.$store.state.manualInputSignal = false
        this.$store.state.discount = false
        this.$store.state.reduct = false
        this.$store.state.calculateUse = false
        this.manualEntry()
      } else if (e.keyCode === 79) {
        // o
        this.$store.state.manualEntrySignal = false
        this.$store.state.discount = false
        this.$store.state.reduct = false
        this.$store.state.calculateUse = false
        this.manualInput()
      } else if (e.keyCode === 83) {
        // s
        this.$store.state.calculateUse = false
        this.reduction()
      } else if (e.keyCode === 82) {
        // r
        this.discountCheck()
        e.stopPropagation()
        e.stoplmmediatePropagation()
      } else if (e.keyCode === 84) {
        // t
        this.$store.state.manualInputSignal = false
        this.$store.state.manualEntrySignal = false
        this.$store.state.discount = false
        this.$store.state.reduct = false
        this.$store.state.calculateUse = false
        this.calculate()
      }

      // if (e.ctrlKey && e.keyCode === 37) {
      //   alert("되")
      // } else if (e.ctrlKey && e.keyCode === 39) {
      //   alert("안되")
      // }
    },
    nextPage() {
      this.$router.push({ name: "about" })
    },
    prevPage() {
      this.$router.push({ name: "home" })
    },
    clickSpace() {
      this.$store.state.manualEntrySignal = true
    },
    manualEntry() {
      this.$store.state.manualEntrySignal = true
    },
    manualInput() {
      this.$store.state.manualInputSignal = true
    },
    discountCheck() {
      this.$store.state.discount = true
    },
    reduction() {
      this.$store.state.reduct = true
    },
    calculate() {
      this.$store.state.calculateUse = true
    },
    timeCheck: function() {
      this.intervalid1 = setInterval(() => {
        this.nowDate = this.getDateAndTime(new Date())
        // console.log(this.changes)
      }, 1000)
    },
    previous_cancel(){
       let obj = {}
      obj.kind = "previous_cancel"
      //obj.location = this.location_out
      obj.location =  config.location.out
      obj.time = Date.now()
      console.log("previous_cancel : ", obj)
      this.sendMessage(obj)

    },
    card_cancel(){
       let obj = {}
      obj.kind = "card_cancel"
      //obj.location = this.location_out
      obj.location =  config.location.out
      obj.appronvo = this.appronvo
      obj.time = Date.now()
      console.log("card_cancel : ", obj)
      this.sendMessage(obj)

    },
    open_safe(){
      let obj = {}
      obj.kind = "open_safe"
      //obj.location = this.location_out
      obj.location = config.location.out
      obj.time = Date.now()
      console.log("open_safe : ", obj)
      this.sendMessage(obj)
    },
    lpr_process(data) {
      console.log("home data :", data.fee)
      if (data.location === this.location.out) {
        if ((data.fee !== 999999 && data.fee !== 999998) && data.fee > 0) {
          console.log("home data after:", data.fee)
          this.$store.state.outSignal = true 
        }
      }
    },
    text_process(data){
      if(data.kind !== "delete_announce_list"){
        if(data.location === this.location.in){
          this.text = data.text 
          localStorage.announce_text = data.text        
        }
        else if(data.location === this.location.out){
          this.text = data.text 
          localStorage.announce_text = data.text        
        } 
      }
      else{
        this.text = ""
        localStorage.announce_text = ""
      }
    },
    socket_error(obj){
      if(obj.machine === "payment_terminal" && this.location.out === obj.location){
        this.exit[1].signal = true
      }
      else if(obj.location === this.location.in ){
        this.entry[0].signal = true         
      }
      else if(obj.location === this.location.out ){
        this.exit[0].signal = true          
      }
      localStorage.entry = JSON.stringify(this.entry)
      localStorage.exit = JSON.stringify(this.exit)
      
      let event = {}
        this.eventList = JSON.parse(localStorage.eventList)
        let now = Date.now()
        event = format_time(new Date(now)).substring(12,) + " " + obj.location + " " + "장비 고장"
        this.eventList.unshift(event)   
        if(this.eventList.length > 10){
          this.eventList.splice(11,)
        } 
        localStorage.eventList = JSON.stringify(this.eventList)
    },
    socket_normal(obj){
      if(obj.machine === "payment_terminal" && this.location.out === obj.location){
        this.exit[1].signal = false
      }
      else if(obj.location === this.location.in ){
        this.entry[0].signal = false       
      }
      else if(obj.location === this.location.out ){
        this.exit[0].signal = false        
      }
      localStorage.entry = JSON.stringify(this.entry)
      localStorage.exit = JSON.stringify(this.exit)
      let event = {}
      this.eventList = JSON.parse(localStorage.eventList)  
      let now = Date.now()     
       event = format_time(new Date(now)).substring(12,) + " " + obj.location + " " + "장비 정상"
      this.eventList.unshift(event)   
      if(this.eventList.length > 10){
        this.eventList.splice(11,)
      } 
      localStorage.eventList = JSON.stringify(this.eventList)
    },
    start() {
      if(localStorage.status !== "ok"){
          this.$store.state.loginSuccess = true
      }
      else{
        console.log("config.location.in : ", config.location.in)
        this.location.in = config.location.in
        this.location.out = config.location.out
        this.verInfo = config.verInfo
        this.parking_name = config.parking_name
        this.payment_name = config.payment_name
        this.id = localStorage.id
        this.text = localStorage.announce_text  
        localStorage.login_time = Date.now()          
        this.entry = JSON.parse(localStorage.entry)
        this.exit = JSON.parse(localStorage.exit)
        this.timeCheck()
        this.exit[1].signal = false
        this.exit[0].signal = false
        this.entry[0].signal = false
      }  
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
      return `${fullDate} ${hour}:${minutes}:${seconds} `
    },
    logOut() {
      this.id = localStorage.id
      this.pw = localStorage.pw
      this.status = localStorage.status
      this.manager = localStorage.manager
      localStorage.status = ""
      localStorage.id = ""
      localStorage.pw = ""
      localStorage.manager = ""
      let gate = {}
      gate = JSON.parse(localStorage.gate)
      gate.in.open = 0
      gate.in.close = 0
      gate.out.open = 0
      gate.out.close = 0
      localStorage.gate = JSON.stringify(gate)
      localStorage.total_fee = 0
      localStorage.card_paid_fee = 0
      let general = {}
      general.inVehicle = 0
      general.outVehicle = 0
      general.card = 0
      general.cash = 0
      localStorage.general = JSON.stringify(general)
      localStorage.paid_fee = 0
      localStorage.quantity = 0
      let regular = {}
      regular.inVeicle = 0
      regular.outVehicle = 0
      localStorage.card_quantity = 0
      localStorage.discounted_quantity = 0
      localStorage.discounted_fee = 0
      let eventList = []
      localStorage.eventList = JSON.stringify(eventList)
      localStorage.cash_quantity = 0
      localStorage.cash_paid_fee = 0
      let obj = {}
      obj.kind = 'employee_logout'
      obj.id = this.id
      obj.pw = this.pw
      obj.class = this.manager
      this.sendMessage(obj)
      this.$store.state.loginSuccess = true
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    barCode() {
      const el = this.$refs.test.$el
      this.$refs.test.bar()
      console.log("테그?", el)
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
<style>
@import "../assets/css/layout.css";
@import "../assets/css/default.css";
@import "../assets/css/main.css";
</style>
