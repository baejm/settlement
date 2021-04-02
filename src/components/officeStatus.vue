<template>
  <div class="office_status">
    <h3><font-awesome-icon icon="volume-down" />지하 정산소 현황</h3>
    <ul class="status_info">
      <li>
        <dl>
          <dt>구분</dt>
          <dd>정기차량</dd>
          <dd>일반차량</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>입차/출차</dt>
          <dd>{{ regular.inVehicle }}대/{{ regular.outVehicle }}대</dd>
          <dd>{{ general.inVehicle }}대/{{ general.outVehicle }}대</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>카드</dt>
          <dd>{{ regular.card }}</dd>
          <dd>{{ general.card }}원</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>현금</dt>

          <dd>{{ regular.cash }}</dd>
          <dd>{{ general.cash }}원</dd>
        </dl>
      </li>
    </ul>
    <div class="total">
      <p>결제금액</p>
      <p>{{ totalCash }}원</p>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
export default {
  name: "officeStatus",
  data() {
    return {
      regular: {
        inVehicle: 0,
        outVehicle: 0,
        card: 0,
        cash: 0
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
      },
      totalCash: 0
    }
  }, 
  created() {
    this.$socket.on("message_from_server", data => {
      if (data.kind == "lpr" || data.kind == "fee_calculation_result" || data.kind == "lpr_payment") {
      //  this.lpr_process(data)
      }
    }),
      this.start()
  },
  methods: {
    lpr_process(data) {
      if (data.kind === "lpr" && data.location === this.location.out) {
       // localStorage.obj_out = JSON.stringify(data)
      //  let obj_out_temp = localStorage.obj_out
      //  console.log("outCarWrap obj_out: ", obj_out_temp)
     //   let obj = JSON.parse(obj_out_temp)
      //  console.log("outCarWrap obj: ", obj)        
        if (data.registered === "등록차량") {
          this.registered = "정기권"
          this.regular.outVehicle += 1
        } else {
          this.registered = "일반권"
          this.general.outVehicle += 1
        }
        localStorage_send(this)        
      }
       
      if(data.kind === "lpr" && data.location === this.location.in){   
        if(data.registered === "등록차량"){
          this.registered = "정기권"
          this.regular.inVehicle += 1
        }
        else{
          this.registered = "일반권"
          this.general.inVehicle += 1
        }   
        localStorage_send(this)          
      }
    }, 
    start() {
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
      let interval = 1 * 1000;
      if(localStorage.general){
        this.general = JSON.parse(localStorage.general)
      }
      if(localStorage.regular){
        this.regular = JSON.parse(localStorage.regular)
      }
      this.totalCash = this.general.card + this.general.cash
      setInterval(() => {
        if(localStorage.regular){
          this.regular = JSON.parse(localStorage.regular)
        }
        if(localStorage.general){
          this.general = JSON.parse(localStorage.general)
        }
        this.totalCash = this.general.card + this.general.cash
      }, interval);
    }
  }
}
function localStorage_send(obj){
  console.log("officeStatus localStroage obj : ", obj)
  localStorage.regular= JSON.stringify(obj.regular)
  localStorage.general = JSON.stringify(obj.general)
}
</script>
