<template>
  <div class="out_car">
    <h4>출차 <span>Live</span></h4>
    <div class="car_info">
      <div class="car_img"><img src="../assets/car01.jpg" alt="" /></div>
      <dl>
        <dd>차량번호: <span>12가2123</span></dd>
        <dd>입차일시 : <span>2020-08-13 21:51:10</span></dd>
        <dd>출차일시 : <span>2020-08-13 21:51:10</span></dd>
        <dd>주차시간 : <span>17시간20분</span></dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  return {
    lp: "11가1234",
    in_time: "2020-09-02 13:15:21",
    out_time: "2020-09-02 13:15:21",
    registered: "방문차량",
    image_name_in: require("../assets/car01.jpg"),
    image_name_out: require("../assets/car01.jpg"),
    parking_time: 0,
    car_kind: "A(기본요금)",
    name: "out_car_wrap",
    contents: "",
    parking_fee: 0,
    discounted_fee: 0,
    paid_fee: 0,
    name: "outCarEnter"
    location: {
      in: "",
      out: ""
    }
  }
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
}
</script>
