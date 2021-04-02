<template>
  <div class="body_wrap">
    <popLogin v-if="loginSuccess"></popLogin>
    <report v-if="newPopup"></report>
    <manualEntry v-if="manualEntrySignal"></manualEntry>
    <freeOperation v-if="freeOperation"></freeOperation>
    <manualInput v-if="manualInputSignal"></manualInput>
    <discountList v-if="discount"></discountList>
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
      <button @click="barCode()" @keyup.enter="barCode()">커서인풋</button>
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
          <button @click="manualEntry()">수동입차 <span>I</span></button>
          <button @click="manualInput()">
            수동출차 <br />(분실건) <span>A</span>
          </button>
          <button>카드결제취소 <span>B</span></button>
          <button>카드결제취소 <span>C</span></button>
          <button @click="discountCheck()">할인적용 <span>I</span></button>
          <button>영수증 재발급 <span>I</span></button>
          <button>미인식 차량 <span>I</span></button>
          <button>환전 <span>I</span></button>
          <button>점검 <span>I</span></button>
          <button>정산 <span>I</span></button>
          <button>주차할인 <span>I</span></button>
          <button>예비버튼 <span>I</span></button>
          <button>예비버튼 <span>I</span></button>
          <button>예비버튼 <span>I</span></button>
          <button>예비버튼 <span>I</span></button>
          <button>예비버튼 <span>I</span></button>
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
    report
  },
  data() {
    return {
      active: false,
      nowDate: "현재시간",
      dis: true,
      etcPop: false,
      //outSignal: true,
      verInfo:"",
      id: "",
      parking_name: "",
      payment_name: "",
      location: {
        in: "",
        out: ""
      },
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
      "outSignal"
    ])
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if ((data.kind == "fee_calculation_result" || data.kind == "lpr_payment")&& data.direction == "out") {
        console.log("data.kind : ", data.kind, data)
        this.lpr_process(data)
      }
    }),
      this.start()
  },
  methods: {
    manualEntry() {
      this.$store.state.manualEntrySignal = true
    },
    manualInput() {
      this.$store.state.manualInputSignal = true
    },
    discountCheck() {
      this.$store.state.discount = true
    },
    timeCheck: function() {
      this.intervalid1 = setInterval(() => {
        this.nowDate = this.getDateAndTime(new Date())
       // console.log(this.changes)
      }, 1000)
    },
    lpr_process(data) {
      if (data.location === this.location.out) {
       if((data.fee !== 999999 || data.fee) !== 999998 && data.fee > 0){
          this.$store.state.outSignal = true
        }
        else{
          this.$store.state.outSignal  = false
         } 
      }
    },
    start() {
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
      this.verInfo = config.verInfo
      this.parking_name = config.parking_name
      this.payment_name = config.payment_name
      this.id = localStorage.id
      this.timeCheck()

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
      this.$store.state.loginSuccess = true
    },
    barCode() {
      const el = this.$refs.test.$el
      this.$refs.test.bar()
      console.log("테그?", el)
    }
  }
}
// function format_time(dat) {
//   var str = ""
//   str += dat.getFullYear()
//   str += "." + num_to_str(dat.getMonth() + 1)
//   str += "." + num_to_str(dat.getDate())
//   str += ". " + num_to_str(dat.getHours())
//   str += ":" + num_to_str(dat.getMinutes())
//   str += ":" + num_to_str(dat.getSeconds())
//   return str
// }

// function num_to_str($num) {
//   $num < 10 ? ($num = "0" + $num) : $num
//   return $num.toString()
// }
</script>
<style>
@import "../assets/css/layout.css";
@import "../assets/css/default.css";
@import "../assets/css/main.css";
</style>
