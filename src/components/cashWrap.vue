<template>
  <div class="cash_wrap">
    <h3><i class="fas fa-coins"></i>결제 거스름돈</h3>
    <dl>
      <dt>1,000원</dt>
      <dd>
        {{ r1000}}원
      </dd>
      <dt>5,000원</dt>
      <dd>
        {{ r5000 }}원
      </dd>
      <dt>10,000원</dt>
      <dd>
        {{ r10000 }}원
      </dd>
      <dt>50,000원</dt>
      <dd>
         {{ r50000 }}원
      </dd>
    </dl>
    <div class="total">
      <button>영수증 미발급</button>
      <button @click="cash_comfirm">현금마감 <span>Enter</span></button>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
import { mapState } from "vuex"
export default {
  name: "cash_wrap",
 data() {
    return {
      lp: "",
      in_time: 0,
      out_time: 0,
      r1000: 0,
      r5000: 0,
      r10000: 0,
      r50000: 0,
      fee : 0,
      paid_fee: 0,
      location: {
        in: "",
        out: ""
      }
    }
  },
  created() {    
    this.start()
  },
  computed: {
    ...mapState([      
      "outSignal"
    ])
  },
  methods: {
    start() {
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
      let obj_temp = localStorage.obj_out
      //console.log("parkingInfo obj_temp : ", obj_temp)
      let obj = JSON.parse(obj_temp)
    //  let obj_temp = window.localStroage.obj_out
     // let obj = JSON.parse(obj_temp)
     if(obj.paid_fee){
       this.paid_fee = obj.paid_fee
     }
      this.lp = obj.lp      
      this.in_time = obj.obj_in.loop_event_time
      this.out_time =obj.loop_event_time
      this.fee = obj.fee
      //this.paid_fee = obj.paid_fee
     // this.fee = 8500
      this.r1000 = 1000 - this.fee
      if(this.r1000 < 0){
        this.r1000 = 0
      } 
      this.r5000 = 5000 - this.fee
      if(this.r5000 < 0){
        this.r5000 = 0
      } 
      this.r10000 = 10000 - this.fee
      if(this.r10000 < 0){
        this.r10000 = 0
      } 
      this.r50000 = 50000 - this.fee
      if(this.r50000 < 0){
        this.r50000 = 0
      } 
    }, 
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    cash_comfirm(){
      let obj = {}
      obj.kind = "lpr_payment_final"
      obj.cmd = "cash_payment"
      obj.paid_fee = this.paid_fee + this.fee
      this.fee = 0
      obj.fee = 0
      obj.lp = this.lp
      obj.in_time = this.in_time
      obj.out_time = this.out_time
      obj.how = "cash"
      obj.who = "요금정산원"
      obj.id = localStorage.id
      obj.cash_time = Date.now()
      console.log("cashWrap obj : ", obj);
      this.sendMessage(obj)
      localStorage.removeItem("obj_out")
      localStorage.removeItem("in_time")
      localStorage.removeItem("out_time")
      localStorage.removeItem("lp")
      this.$store.state.outSignal = false
    }
    
  }
}
</script>
