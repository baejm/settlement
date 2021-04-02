<template>
  <div class="calculate">
    <div class="calculate_box">
      <h2><font-awesome-icon icon="coins" />정산</h2>
      <button @click.prevent="print">
        <font-awesome-icon icon="print" />
      </button>
      <ul>
        <h3>일마감</h3>
        <li v-for="(d, index) in deadline" :key="index">
          {{ d.title }}
          <p>{{ d.sub }}</p>
        </li>
      </ul>
      <ul>
        <h3>수입금 현황</h3>
        <li v-for="(p, index) in proceeds" :key="index">
          {{ p.title }}
          <p>{{ p.sub }}</p>
        </li>
      </ul>
      <ul>
        <h3>요금 종별 키별 수입금 현황</h3>
        <li v-for="(pc, index) in proceedsClass" :key="index">
          {{ pc.title }}
          <p>{{ pc.sub }}</p>
        </li>
      </ul>

      <button class="confirm" @click="manualInput()">확인</button>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
export default {
  name: "calculate",
  data() {
    return {
      deadline: [
        { title: "주차장명", sub: "하계테크노" },   //0
        { title: "정산소명", sub: "지하주차장" },   //1
        { title: "근무자명", sub: "나이름" },       //2
        { title: "근무일자", sub: "2020-09-23" },   //3
        { title: "근무시작시각", sub: "09:01" },    //4
        { title: "근무종료시각", sub: "18:01" }     //5
      ],
      proceeds: [
        { title: "총주차건수", sub: 0 },        //0
        { title: "총주차요금", sub: 0 },        //1
        { title: "주차요금할인건수", sub: 0 },  //2
        { title: "주차요금할인액", sub: 0 },    //3
         { title: "현금수입건수", sub: 0 },     //4
        { title: "현금수입금액", sub: 0 },      //5
        { title: "신용카드수입건수", sub: 0 },   //6
        { title: "신용카드수입금액", sub: 0 },  //7
        { title: "신용카드취소건수", sub: 0 },  //8
        { title: "신용카드취소금액", sub: 0 },  //9
        { title: "총수입건수", sub: 0 },        //10
        { title: "총수입금액", sub: 0 }         //11
      ],
      proceedsClass: [
        { title: "일반요금건수", sub: 0 },      //0
        { title: "일반요금", sub: 0 },   //1
        { title: "입구열기", sub: 0 },          //2        
        { title: "입구닫기", sub: 0 },          //3
        { title: "출구열기", sub: 0 },          //4
        { title: "출구닫기", sub: 0 },          //5
        { title: "수동정산건수", sub: 0 },      //6
        { title: "수동정산금액", sub: 0 },      //7
        { title: "취소키건수", sub: 0 },        //8
        { title: "취소키금액", sub: 0 }         //9
      ]
    }
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if ((data.kind === "lpr" || data.kind === "fee_calculation_result" || data.kind === "lpr_payment" || data.kind === "lpr_payment_final")&& data.direction === "out") {
        console.log("outCarWrap sockst.on data.kind : ", data.kind, data)
     //   this.lpr_process(data)
      }
    }),
      this.start()
  },
  methods: {
    manualInput() {
      this.$store.state.calculateUse = false
      this.print()
    },
    print(){
      let obj = {}
      obj.kind = "REQPRINT"
      obj.location = config.location.out
      obj.data = "\n\n\n\u0013         일일  마감 집계표\u0014"
      obj.data +="\n"
      obj.data +="----------------------------------------------"
      obj.data +="\n"
      obj.data += "1. 기본정보 "
      obj.data += "\n"
      obj.data += "주차장명: " + this.deadline[0].sub 
      obj.data += "\n"
      obj.data += "정산소명: " +  this.deadline[1].sub 
      obj.data += "\n"
      obj.data += "근무자명: " +  this.deadline[2].sub 
      obj.data += "\n"
      obj.data += "근무일자: " +  this.deadline[3].sub 
      obj.data += "\n"
      obj.data += "근무시작시각: " +  this.deadline[4].sub 
      obj.data += "\n"
      obj.data += "근무종료시각: " +  this.deadline[5].sub 
      obj.data += "\n"
      obj.data += "----------------------------------------------"
      obj.data += "\n"
      obj.data += "2. 수입금 현황 " 
      obj.data += "\n"
      obj.data += "총주차건수: " +  this.proceeds[0].sub 
      obj.data += "\n"
      obj.data += "총주차요금(원): " +  this.proceeds[1].sub 
      obj.data += "\n"
      obj.data += "주차요금할인건수: " +  this.proceeds[2].sub 
      obj.data += "\n"
      obj.data += "주차요금할인금액(원): " +  this.proceeds[3].sub 
      obj.data += "\n"
      obj.data += "현금수입건수: " +  this.proceeds[4].sub 
      obj.data += "\n"
      obj.data += "형금수입금액(원): " +  this.proceeds[5].sub 
      obj.data += "\n"
      obj.data += "신용카드수입건수: " +  this.proceeds[6].sub 
      obj.data += "\n"
      obj.data += "신용카드수입금액(원): "  + this.proceeds[7].sub 
      obj.data += "\n"
      obj.data += "신용카드취소건수: " +  this.proceeds[8].sub 
      obj.data += "\n"
      obj.data += "신용카드취소금액(원): " +  this.proceeds[9].sub 
      obj.data += "\n"
      obj.data += "총수입건수: " + this.proceeds[10].sub 
      obj.data += "\n"
      obj.data += "총수입금액(원): " + this.proceeds[11].sub 
      obj.data += "\n"
      obj.data += "----------------------------------------------"
      obj.data += "\n"
      obj.data += "3. 기타사항 " 
      obj.data += "\n"
      obj.data += "일반요금건수: " +  this.proceedsClass[0].sub 
      obj.data += "\n"
      obj.data += "일반요금(원): " +  this.proceedsClass[1].sub 
      obj.data += "\n"
      obj.data += "수동입구열기: " +  this.proceedsClass[2].sub 
      obj.data += "\n"
      obj.data += "수동입구닫기: " +  this.proceedsClass[3].sub 
      obj.data += "\n"
      obj.data += "수동출구열기: " +  this.proceedsClass[4].sub 
      obj.data += "\n"
      obj.data += "수동출구닫기: " +  this.proceedsClass[5].sub 
      obj.data += "\n"
      obj.data += "수동정산건수: " +  this.proceedsClass[6].sub 
      obj.data += "\n"
      obj.data += "수동정산금액(원): " +  this.proceedsClass[7].sub 
      obj.data += "\n"
      obj.data += "취소키건수: " +  this.proceedsClass[8].sub 
      obj.data += "\n"
      obj.data += "취소키금액(원): " +  this.proceedsClass[9].sub 
      obj.data += "\n\n\n\n"
      obj.data += "\u001d\u001d\u001d"
       this.sendMessage(obj)

    },
     sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    start(){
      let regular = JSON.parse(localStorage.regular)
      let general = JSON.parse(localStorage.general)
      let gate = JSON.parse(localStorage.gate)
      let vehicle_in_quantity = regular.inVehicle + general.inVehicle
      let vehicle_out_quantity = regular.outVehicle + general.outVehicle 
      let login_time = parseInt(localStorage.login_time, 10)
      let login_date = format_time(new Date(login_time)).substring(0, 12)
      let login_in_time = format_time(new Date(login_time)).substring(12, )
      console.log("login_date : ", login_date, "login_time : ", login_time,"login_in_time : ", login_in_time)
      let logout_time = format_time(new Date(Date.now())).substring(12, )
      this.deadline[0].sub = config.parking_name   //주차장명
      this.deadline[1].sub = config.payment_name    //정산소명
      this.deadline[2].sub = localStorage.id        //근무자명
      this.deadline[3].sub = login_date //근무일자
      this.deadline[4].sub = login_in_time  //근무시작시각
      this.deadline[5].sub = logout_time //근무종료시각
      this.proceeds[0].sub = vehicle_in_quantity + vehicle_out_quantity //총주차건수
      if(localStorage.total_fee){
        this.proceeds[1].sub = parseInt(localStorage.total_fee,10)   //총주차요금      
      }
      else{
        this.proceeds[1].sub = 0
      }     
      if(localStorage.discounted_quantity){
        this.proceeds[2].sub = parseInt(localStorage.discounted_quantity, 10)  //주차요금할인건수
      }
      else{
        this.proceeds[2].sub = 0
      }
      if(localStorage.discounted_fee){
        this.proceeds[3].sub = parseInt(localStorage.discounted_fee, 10)  //주차요금할인액
      }
      else{
        this.proceeds[3].sub = 0
      }
      if(localStorage.cash_quantity){
        this.proceeds[4].sub = parseInt(localStorage.cash_quantity, 10)  //현금수입건수
      }
      else{
        this.proceeds[4].sub = 0
      }
      if(localStorage.cash_paid_fee ){
        this.proceeds[5].sub = parseInt(localStorage.cash_paid_fee , 10)  //현금수입액
      }
      else{
        this.proceeds[5].sub = 0
      }
      if(localStorage.card_quantity){
        this.proceeds[6].sub = parseInt(localStorage.card_quantity, 10)  //신용카드수입건수
      }
      else{
        this.proceeds[6].sub = 0
      }
      if(localStorage.card_paid_fee){
        this.proceeds[7].sub = parseInt(localStorage.card_paid_fee, 10)  //신용카드수입액
      }
      else{
        this.proceeds[7].sub = 0
      }
      if(localStorage.card_cancel_quantity ){
        this.proceeds[8].sub = parseInt(localStorage.card_cancel_quantity , 10)  //신용카드취소건수
      }
      else{
        this.proceeds[8].sub = 0
      }
      if(localStorage.card_cancel_paid_fee){
        this.proceeds[9].sub = parseInt(localStorage.card_cancel_paid_fee, 10)  //신용카드취소금액
      }
      else{
        this.proceeds[9].sub = 0
      }
      if(localStorage.cash_quantity || localStorage.card_quantity ){
        if(localStorage.cash_quantity && !localStorage.card_quantity){
          this.proceeds[10].sub = parseInt(localStorage.cash_quantity, 10)  //총수입건수
        }
        else if(!localStorage.cash_quantity && localStorage.card_quantity){
          this.proceeds[10].sub = parseInt(localStorage.card_quantity, 10)  //총수입액
        }
        else if(localStorage.cash_quantity && localStorage.card_quantity){
           this.proceeds[10].sub = parseInt(localStorage.card_quantity, 10)  +   parseInt(localStorage.cash_quantity, 10)
        }
      }
      else{
        this.proceeds[10].sub = 0
      }
      if(localStorage.cash_paid_fee || localStorage.card_paid_fee ){
        if(localStorage.cash_paid_fee && !localStorage.card_paid_fee){
          this.proceeds[11].sub = parseInt(localStorage.cash_paid_fee, 10)  //주차요금할인건수
        }
        else if(!localStorage.cash_paid_fee && localStorage.card_paid_fee){
          this.proceeds[11].sub = parseInt(localStorage.card_paid_fee, 10)  //주차요금할인건수
        }
        else if(localStorage.cash_paid_fee && localStorage.card_paid_fee){
           this.proceeds[11].sub = parseInt(localStorage.cash_paid_fee, 10)  +   parseInt(localStorage.card_paid_fee, 10)
        }
      }
      else{
        this.proceeds[11].sub = 0
      }
     // if(localStorage.discounted_quantity){
        this.proceedsClass[0].sub = parseInt(localStorage.card_quantity,10)  + parseInt(localStorage.cash_quantity,10)  //일반요금건수
     // }
      // else{
      //   this.proceedsClass[0].sub = 0
      // }
      if(localStorage.cash_paid_fee || localStorage.card_paid_fee ){
        if(localStorage.cash_paid_fee && !localStorage.card_paid_fee){
          this.proceedsClass[1].sub = parseInt(localStorage.cash_paid_fee, 10)  //일반요금
        }
        else if(!localStorage.cash_paid_fee && localStorage.card_paid_fee){
          this.proceedsClass[1].sub = parseInt(localStorage.card_paid_fee, 10)  //일반요금
        }
        else if(localStorage.cash_paid_fee && localStorage.card_paid_fee){
           this.proceedsClass[1].sub = parseInt(localStorage.cash_paid_fee, 10)  +   parseInt(localStorage.card_paid_fee, 10)
        }
      }
      else{
         this.proceedsClass[1].sub = 0
      }
      this.proceedsClass[2].sub = gate.in.open  //입구열기
      this.proceedsClass[3].sub = gate.in.close   //입구닫기
      this.proceedsClass[4].sub = gate.out.open    //출구열기
      this.proceedsClass[5].sub = gate.out.close   //출구닫기
      if(localStorage.manual_payment_quantity){
        this.proceedsClass[6].sub = parseInt(localStorage.manual_payment_quantity, 10) //수동정산건수
      }
      else{
        this.proceedsClass[6].sub = 0
      }
      if(localStorage.manual_payment_fee){
          this.proceedsClass[7].sub = parseInt(localStorage.manual_payment_fee, 10)  //수동정산금액
      }
      else{
        this.proceedsClass[7].sub = 0
      }
      if(localStorage.cancel_quantity){
        this.proceedsClass[8].sub = parseInt(localStorage.cancel_quantity, 10) //취소키건수
      }
      else{
        this.proceedsClass[8].sub = 0
      }
      if(localStorage.cancel_fee){
          this.proceedsClass[9].sub = parseInt(localStorage.cancel_fee, 10)  //취소키금액
      }
      else{
        this.proceedsClass[9].sub = 0
      }
      let temp = {}
      this.deadline.push(temp)
      this.deadline.splice(this.deadline.length - 1, 1)
      this.proceeds.push(temp)
      this.proceeds.splice(this.proceeds.length - 1, 1)
      this.proceedsClass.push(temp)
      this.proceedsClass.splice(this.proceedsClass.length - 1, 1)
      console.log("deadline :", this.deadline)
      console.log("proceeds :", this.proceeds)
      console.log("proceedsClass", this.proceedsClass)
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
