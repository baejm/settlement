<template>
  <div class="pay_sale">
    <h3><i class="fas fa-coins"></i>금액 및 할인</h3>
    <div class="saleBtns">
      <button>쿠폰</button>
      <button>감면</button>
    </div>

    <dl>
      <dt>주차요금</dt>
      <dd>
        <span>{{ total_fee }} </span>
      </dd>
      <dt>할인요금1</dt>
      <dd>
        <span>{{ str_discounted_fee1 }} </span>
      </dd>
      <dt>할인요금2</dt>
      <dd>
        <span>{{ str_discounted_fee2 }} </span>
      </dd>
      <dt>할인요금3</dt>
      <dd>
        <span>{{ str_discounted_fee3 }} </span>
      </dd>
      <dt @click.prevent="bar">할인권</dt>
      <!-- <button @click.prevent="bar">바코드</button> -->
      <input id = "barcode" type="text" ref="barcode" @keyup.enter = "sumit" v-model = "barcode"/>
    </dl>
    <div class="total">
      <p>정산금액(원)</p>
      <p>{{ fee }}</p>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
import { mapState } from "vuex"
export default {
  name: "pay_sale",
  computed: {
    ...mapState(["outSignal"])
  },
  data() {
    return {
      lp: "11가1234",
      in_time: "2020-09-02 13:15:21",
      out_time: "2020-09-02 13:15:21",
      in_loop_event_time: Date.now(),
      out_loop_event_time: Date.now(),
      registered: "방문차량",
      image_name_in: require("../assets/car01.jpg"),
      image_name_out: require("../assets/car01.jpg"),
      parking_time: 0,
      car_kind: "A(기본요금)",
      name: "out_car_wrap",
      contents: "",
      parking_fee: 0,
      fee: 0,
      total_fee: 0,
      discounted_fee: 0,
      discounted_fee1: 0,
      discounted_fee2: 0,
      discounted_fee3: 0,
      str_discounted_fee1: "",
      str_discounted_fee2: "",
      str_discounted_fee3: "",
      barcode:"",
      paid_fee: 0,
      location: {
        in: "",
        out: ""
      }
    }
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if ((data.kind == "fee_calculation_result" ||  data.kind == "lpr_payment" || data.kind == "lpr_payment_final") && data.direction == "out") {
        console.log("data.kind : ", data.kind, data)
        this.lpr_process(data)
      }
    }),
      this.start()
  },
  methods: {
    bar() {
      this.$refs.barcode.focus()
    },   
    lpr_process(data) {
      if (data.kind == "fee_calculation_result" ||  data.kind == "lpr_payment") {
        let total_discounted_list = 0
        let toatl_discounted_coupon_list = 0
        let discounted_reduction_value = 0
        let discounted_reduction_hour = 0
        let discounted_reduction_unit =""        
        let discounted_reduction_name = ""
        let discounted_list_flag = false
        let discounted_coupon_list_flag = false
        let discounted_reduction_list_flag = false
        this.lp = data.lp
        this.out_time = format_time(new Date(data.loop_event_time))
        this.out_loop_event_time = data.loop_event_time
        this.image_name_out =
          config.image_src + data.folder_name + "/" + data.fname
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
          this.in_loop_event_time = data.obj_in.loop_event_time
          this.image_name_in =
            config.image_src + data.folder_name + "/" + "/" + data.obj_in.fname
          this.parking_time = Math.ceil(
            data.original_parking_duration / (60 * 1000)
          )
          this.total_fee = data.total_fee
          this.fee = data.fee
          this.paid_fee = data.paid_fee
        } else {
          this.contents = "입차정보 없음"
        }
        if(data.obj_in.discounted_list){         
          for(let i = 0; i < data.obj_in.discounted_list.length; i++ ){
            let total_discounted_parking_time = data.obj_in.discounted_list[i].total_discounted_parking_time
            console.log("total_discounted_parking_time : ", total_discounted_parking_time)
            total_discounted_list =  total_discounted_list + total_discounted_parking_time         
          }
          total_discounted_list = total_discounted_list / (60*1000)
          discounted_list_flag = true
        }
        if(data.obj_in.discounted_coupon_list){
          for(let i = 0; i < data.obj_in.discounted_coupon_list.length; i++){
            toatl_discounted_coupon_list += data.obj_in.discounted_coupon_list[i].real_value
          }
          discounted_coupon_list_flag = true
        }
        if(data.obj_in.discounted_reduction_list){
          discounted_reduction_name = data.obj_in.discounted_reduction_list[0].title
          discounted_reduction_value = data.obj_in.discounted_reduction_list[0].value
          discounted_reduction_hour = data.obj_in.discounted_reduction_list[0].hour
          discounted_reduction_unit = data.obj_in.discounted_reduction_list[0].unit
          discounted_reduction_list_flag = true
        }
        if(discounted_list_flag === true){          
          this.str_discounted_fee1 = "웹 할인 : " + total_discounted_list + "분"
          if(discounted_coupon_list_flag === true){
            this.str_discounted_fee2 = "할인쿠폰 : " + toatl_discounted_coupon_list + "분"
            if(discounted_reduction_list_flag === true){
              if(discounted_reduction_unit === "percent"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee3 =  discounted_reduction_name + ": " + discounted_reduction_value + "%"
                }
                else{
                  this.str_discounted_fee3 = discounted_reduction_name + ": " + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "%"
                }
               
              }
              else if(discounted_reduction_unit === "won"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee3 =  discounted_reduction_name + ": " + discounted_reduction_value + "원"
                }
                else{
                  this.str_discounted_fee3 = discounted_reduction_name + ": " + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "원"
                  }               
              }
              else if(discounted_reduction_unit === "minutes"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee3 =  discounted_reduction_name + ": "   + discounted_reduction_value + "분"
                }
                else{
                  this.str_discounted_fee3 =  discounted_reduction_name + ": "  + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "분"
                }               
              }              
            }
          }
          else{
            if(discounted_reduction_list_flag === true){
              if(discounted_reduction_unit === "percent"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee2 =  discounted_reduction_name + ": "  + discounted_reduction_value + "%"
                }
                else{
                  this.str_discounted_fee2 =  discounted_reduction_name + ": "  + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "%"
                }
               
              }
              else if(discounted_reduction_unit === "won"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee2 =  discounted_reduction_name + ": "  + discounted_reduction_value + "원"
                }
                else{
                  this.str_discounted_fee2 =  discounted_reduction_name + ": "  + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "원"
                  }               
              }
              else if(discounted_reduction_unit === "minutes"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee2 =  discounted_reduction_name + ": "  + discounted_reduction_value + "분"
                }
                else{
                  this.str_discounted_fee2 =  discounted_reduction_name + ": "  + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "분"
                }               
              }
            }               
          }  
        }
        else {
          if(discounted_coupon_list_flag === true){
            this.str_discounted_fee1 = "할인쿠폰 : " + toatl_discounted_coupon_list + "분"
          }
          else{
            if(discounted_reduction_list_flag === true){
             if(discounted_reduction_unit === "percent"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee1 =  discounted_reduction_name + ": "  + discounted_reduction_value + "%"
                }
                else{
                  this.str_discounted_fee1 =  discounted_reduction_name + ": "  + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "%"
                }               
              }
              else if(discounted_reduction_unit === "won"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee1 =  discounted_reduction_name + ": "  + discounted_reduction_value + "원"
                }
                else{
                  this.str_discounted_fee1 =  discounted_reduction_name + ": "  + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "원"
                  }               
              }
              else if(discounted_reduction_unit === "minutes"){
                if(discounted_reduction_hour === 0){
                   this.str_discounted_fee1 =  discounted_reduction_name + ": "  + discounted_reduction_value + "분"
                }
                else{
                  this.str_discounted_fee1 =  discounted_reduction_name + ": "  + discounted_reduction_hour + "시간할인, " + discounted_reduction_value + "분"
                }               
              }              
            }
          }  
        } 
        if(data.fee === 0){
          this.$store.state.outSignal = false
        }      
       // this.$refs.barcode.focus()
      }
      else if(data.kind === "lpr_payment_final"){ 
        console.log("payment_list", "data.fee : ", data.fee)     
        if(data.fee === 0 || data.fee === '0'){
          this.$store.state.outSignal = false
        }        
      }
    },
    sumit(){
      let obj = {}
      console.log( "barcode : ", this.barcode)
      obj.barcode = this.barcode.substring(0,12);
      obj.out_time = this.out_loop_event_time
      obj.in_time = this.in_loop_event_time
      obj.lp = this.lp
      obj.cmd =  "PARK_FEE_RECALC"
      obj.counpon_time = Date.now()
      obj.kind =  "discounted_coupon_barcode"
      obj.discounted_coupon_id = config.machineid
      obj.discounted_coupon_model = config.machinemodel
      obj.discounted_coupon_how = "요금정산소 바코드 리더기"
      console.log( "obj : ", obj)
      this.barcode = ""
      this.sendMessage(obj)
      //this.$refs.barcode.focus()
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    start() {
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
      let obj_temp = localStorage.obj_out
    //  console.log("parkingInfo obj_temp : ", obj_temp)
      let obj = JSON.parse(obj_temp)
      this.lpr_process(obj)
    }
  }
  // mounted() {
  //   if (this.outSignal === true) {
  //     this.bar()
  //   }
  // }
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
