<template>
  <div class="out_car_wrap">
    <div class="out_car">
      <h4>출차<span class="live">Live</span></h4>
      <div class="car_info">
        <div class="car_img"><img :src="image_name_out" alt="" /></div>
        <dl>
          <dd>
            차량번호: <span>{{ lp }}</span>
          </dd>
          <dd>
            입차일시 : <span> {{ in_time }}</span>
          </dd>
          <dd>
            출차일시 : <span> {{ out_time }}</span>
          </dd>
          <dd>
            주차시간(분) : <span>{{ parking_time }}</span>
          </dd>
          <dd>
            비고 : <span>{{ contents }}</span>
          </dd>
        </dl>
      </div>
    </div>
    <div class="out_car_enter">
      <h4>입차장면3</h4>
      <div class="car_info">
        <div class="car_img"><img :src="image_name_in" alt="" /></div>
        <dl>
          <dd>
            차종구분 : <span>{{ car_kind }} </span>
          </dd>
          <dd>
            차량구분 : <span>{{ registered }}</span>
          </dd>
          <dd>
            주차요금(원) : <span>{{ total_fee }} </span>
          </dd>
          <dd>
            할인금액(원) : <span>{{ discounted_fee }} </span>
          </dd>
          <dd>
            결제금액(원) : <span>{{ fee }}</span>
          </dd>
        </dl>
      </div>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
export default {
 data() {
    return {
      lp: "11가1234",
      in_time: "2020-09-02 13:15:21",
      out_time: "2020-09-02 13:15:21",
      out_loop_event_time: 0,
      registered: "방문차량",
      image_name_in: require("../assets/car01.jpg"),
      image_name_out: require("../assets/car01.jpg"),
      parking_time: 0,
      car_kind: "A(기본요금)",
      name: "out_car_wrap",
      contents: "",
      total_fee: 0,
      parking_fee: 0,
      fee : 0,
      discounted_fee: 0,
      paid_fee: 0,
       regular: {
        inVehicle: 0,
        outVehicle: 0,
        card: "-",
        cash: "-"
      },
      general: {
        inVehicle: 0,
        outVehicle: 0,
        card: 0,
        cash: 0
      },
      location: {
        in: "",
        out: ""
      }
    }
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if ((data.kind === "lpr" || data.kind === "fee_calculation_result" || data.kind === "lpr_payment" || data.kind === "lpr_payment_final")&& data.direction === "out") {
        console.log("outCarWrap sockst.on data.kind : ", data.kind, data)
        this.lpr_process(data)
      }
    }),
      this.start()
  },
  methods: {
    lpr_process(data) {
      if (data.kind === "fee_calculation_result" || data.kind === "lpr_payment") {
        if(data.cmd === "PARK_FEE_RECALC" && data.fee === 0){
          
          let discounted_fee = 0
          if(data.paid_fee){
            discounted_fee = data.total_fee - data.paid_fee
          }
          else{
            discounted_fee = data.total_fee
          }
          if(discounted_fee > 0){
            if(localStorage.discounted_fee){
              discounted_fee += parseInt(localStorage.discounted_fee)
              localStorage.discounted_fee = discounted_fee
            }
            else{
              localStorage.discounted_fee = discounted_fee
            }
            let discounted_quantity = 0
            discounted_quantity = parseInt(localStorage.discounted_quantity) + 1
            localStorage.discounted_quantity = discounted_quantity
          }  
        }
        localStorage.obj_out = JSON.stringify(data)
      //  let obj_out_temp = localStorage.obj_out
      //  console.log("outCarWrap obj_out: ", obj_out_temp)
     //   let obj = JSON.parse(obj_out_temp)
      //  console.log("outCarWrap obj: ", obj)
        this.lp = data.lp
        this.out_time = format_time(new Date(data.loop_event_time))
        if(data.fname){
          this.image_name_out =
          config.image_src + data.folder_name + "/" + data.fname
        }
        else{
          this.image_name_out = require("../assets/car01.jpg")
        }  
        if (data.registered === "등록차량") {
          this.registered = "정기권"
        } else {
          this.registered = "일반권"
        }
        if (data.car_kind && data.car_kind !== "A") {
          this.car_kind = "B(경차)"
        } else {
          this.car_kind = "A(기본요금)"
        }
        if (data.obj_in) {
          this.in_time = format_time(new Date(data.obj_in.loop_event_time))
          if( data.obj_in.fname){
            this.image_name_in =
            config.image_src + data.folder_name + "/" + "/" + data.obj_in.fname
          }
          else{
            this.image_name_in = require("../assets/car01.jpg")
          }          
          this.parking_time = Math.ceil(
          data.original_parking_duration / (60 * 1000))
          this.fee = data.fee
          if(data.paid_fee){
            this.paid_fee = data.paid_fee
            this.discounted_fee = data.total_fee - data.fee - data.paid_fee
          }
          else{
            this.discounted_fee = data.total_fee - data.fee
          }
          this.total_fee = data.total_fee
          localStorage.lp = this.lp
          localStorage.in_time = data.obj_in.loop_event_time
          localStorage.out_time = data.loop_event_time
          this.contents = ""
        } 
        else {
          this.contents = "입차정보 없음"
        }
      }      
      else if (data.kind ==="lpr") {
        if(this.out_loop_event_time !== data.loop_event_time){
          this.out_loop_event_time = data.loop_event_time
          console.log("outCarWrap kind == lpr, ", data.kind)
          this.lp = data.lp
          this.out_time = format_time(new Date(data.loop_event_time))
          this.image_name = config.image_src + data.folder_name + "/" + data.fname
          if(data.registered === "등록차량"){
            this.registered = "정기권"         
            this.regular = JSON.parse(localStorage.regular)
            this.regular.outVehicle += 1
            localStorage.regular= JSON.stringify(this.regular)

            this.eventList = JSON.parse(localStorage.eventList)
            let event= this.out_time.substring(12,) + " " + this.registered + " " + this.lp + " " + "출차"
            this.eventList.unshift(event)    
            if(this.eventList.length > 10){
              this.eventList.splice(11,)
            }
            localStorage.eventList = JSON.stringify(this.eventList)
          }
          else{
            this.registered = "일반권"
            this.general = JSON.parse(localStorage.general) 
            this.general.outVehicle += 1
            localStorage.general = JSON.stringify(this.general)
            this.eventList = JSON.parse(localStorage.eventList)
            let event= this.out_time.substring(12,) + " " + this.registered + " " + this.lp + " " + "출차"
            this.eventList.unshift(event)    
            if(this.eventList.length > 10){
              this.eventList.splice(11,)
            }
            localStorage.eventList = JSON.stringify(this.eventList)
          }
          if(data.car_kind && data.car_kind !== "A"){
            this.car_kind = "B(경차)"
          }
          else{
            this.car_kind = "A(기본요금)"
          }
        }
      }
      else if (data.kind === "lpr_payment_final") {
        console.log("outCarWrap lpr_payment")
        if(data.obj_in.cash_payment_list){
          if(localStorage.general){
            this.general = JSON.parse(localStorage.general)
          }
          this.general.cash += data.obj_in.cash_payment_list.paid_fee
          localStorage.general =JSON.stringify(this.general)
          this.fee = data.obj_in.cash_payment_list.fee
          let total_fee = 0
          if(localStorage.total_fee){
            total_fee = parseInt(localStorage.total_fee, 10)
          }
          else{
            total_fee = 0
          }
          total_fee += data.total_fee
          localStorage.total_fee = total_fee
          let cash_quantity = 0
          if(localStorage.cash_quantity){
            cash_quantity = parseInt(localStorage.cash_quantity, 10) + 1
            localStorage.cash_quantity = cash_quantity
          }
          else{
            cash_quantity =  1
            localStorage.cash_quantity = cash_quantity
          }
          let cash_paid_fee = 0
          if(localStorage.cash_paid_fee){
            cash_paid_fee = parseInt(localStorage.cash_paid_fee, 10) + data.obj_in.cash_payment_list.paid_fee
            localStorage. cash_paid_fee =  cash_paid_fee
          }
          else{
            cash_quantity =  data.obj_in.cash_payment_list.paid_fee
            localStorage. cash_paid_fee =  cash_paid_fee
          }
        }
        if(data.obj_in.payment_list){
          console.log("payment_list")
          if(localStorage.general){
            this.general = JSON.parse(localStorage.general)
          }
          else{
            this.general = 0
          }
          this.general.card += data.obj_in.payment_list.paid_fee
          localStorage.general = JSON.stringify(this.general)
          let card_quantity = 0;
          if(localStorage.card_quantity){
            card_quantity = parseInt(localStorage.card_quantity, 10) + 1
            localStorage.card_quantity = card_quantity
          }
          else{
            card_quantity = 1
            localStorage.card_quantity = card_quantity
          }
          let card_paid_fee = 0;
          if(localStorage.card_paid_fee){
            card_paid_fee= parseInt(localStorage.card_paid_fee, 10) + data.obj_in.payment_list.paid_fee
            localStorage.card_paid_fee = card_paid_fee
          }
          else{
            card_paid_fee = data.obj_in.payment_list.paid_fee
            localStorage.card_paid_fee = card_paid_fee
          }
          let total_fee = 0
          if(localStorage.total_fee){
             total_fee = parseInt(localStorage.total_fee, 10)
          }
          else{
            total_fee = 0
          }
          total_fee += data.total_fee
          localStorage.total_fee = total_fee
        }
        if(data.obj_in.discounted_list || data.obj_in.discounted_coupon_list || data.obj_in.discounted_reduction_list){
          let discounted_quantity = 0;
          if(localStorage.discounted_quantity){
            discounted_quantity = parseInt(localStorage.discounted_quantity, 10) + 1
            localStorage.discounted_quantity = discounted_quantity
          }
          else{
            discounted_quantity = 1
            localStorage.discounted_quantity = discounted_quantity
          }
          let discounted_fee = 0
          discounted_fee = data.total_fee - data.obj_in.payment_list.paid_fee
          if(localStorage.discounted_fee){
            discounted_fee += parseInt(localStorage.discounted_fee)
            localStorage.discounted_fee = discounted_fee
          }
          else{
            localStorage.discounted_fee = discounted_fee
          }
        }
      }
    },
    start() {
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
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
