<template>
  <div class="parking_info active">
    <h3><i class="fas fa-coins"></i>주차정보</h3>
    <dl>
      <dt>차량번호</dt>
      <dd>
        <span>{{ lp }}</span>
      </dd>
      <dt>차종구분</dt>
      <dd>
        <span>{{ car_kind }} </span>
      </dd>
      <dt>입차시각</dt>
      <dd>
        <span> {{ in_time }}</span>
      </dd>
      <dt>출차시각</dt>
      <dd>
        <span> {{ out_time }}</span>
      </dd>
      <dt>주차시간(분)</dt>
      <dd>
        <span>{{ parking_time }}</span>
      </dd>
    </dl>
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
      registered: "방문차량",
      image_name_in: require("../assets/car01.jpg"),
      image_name_out: require("../assets/car01.jpg"),
      parking_time: 0,
      car_kind: "A(기본요금)",
      contents: "",
      parking_fee: 0,
      discounted_fee: 0,
      name: "parking_info",
      paid_fee: 0,
      location: {
        in: "",
        out: ""
      }
    }
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
    lpr_process(data) {
      if (data.location === this.location.out) {
        this.lp = data.lp
        this.out_time = format_time(new Date(data.loop_event_time))
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
          this.image_name_in =
            config.image_src + data.folder_name + "/" + "/" + data.obj_in.fname
          this.parking_time = Math.ceil(
            data.original_parking_duration / (60 * 1000)
          )
          this.parking_fee = data.fee
          this.paid_fee = data.paid_fee
        } else {
          this.contents = "입차정보 없음"
        }
      }
    },
    start() {
      console.log("config.location.in : ", config.location.in)
      this.location.in = config.location.in
      this.location.out = config.location.out
      let obj_temp = localStorage.obj_out
    //  console.log("parkingInfo obj_temp : ", obj_temp)
      let obj = JSON.parse(obj_temp)
      this.lp = obj.lp      
      this.out_time = format_time(new Date(obj.loop_event_time))
      if (obj.registered === "등록차량") {
        this.registered = "정기권"
      } else {
        this.registered = "일반권"
      }
      if (obj.car_kind !== "B") {
        this.car_kind = "A(기본요금)"
      } else {          
        this.car_kind = "B(경차)"
      }
      this.in_time = format_time(new Date(obj.obj_in.loop_event_time))
      this.parking_time = Math.ceil(obj.original_parking_duration / (60 * 1000))    
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
