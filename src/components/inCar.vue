<template>
  <div class="in_car">
     <h4>입차 <span class="live">Live</span></h4>
    <div class="car_info">
      <div class="car_img"><img :src="image_name" alt="" /></div>
      <dl>
        <dd>
          차량번호: <span>{{ lp }}</span>
        </dd>
        <dd>
          입차일시 : <span> {{ in_time }}</span>
        </dd>
        <dd>
          차종구분 : <span> {{ car_kind }} </span>
        </dd>
        <dd>
          차량구분 : <span>{{ registered }}</span>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
export default {
  data: function() {
    return {
      lp:"11가1234",
      in_time: "2020-09-02 13:15:21",
      in_loop_event_time: 0,
      registered: "방문차량",
      image_name: require("../assets/car01.jpg"),
      car_kind:"A(기본요금)",
      name: "inCar",
      regular_inVehicle: 0,
      regular_outVehicle: 0,
      general_inVehicle: 0,
      general_outVehicle: 0,
      card: 0,
      cash: 0,
      eventList: [
      
      ],
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
        in:"",
        out:""
      }
    } 
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if(data.kind == "lpr" && data.direction == "in"){
         //   
        this.lpr_process(data)
      }      
    }),
    this.start()
    
  }, 
  methods: {
    lpr_process(data){
      if(data.location === this.location.in){
        if(this.in_loop_event_time !== data.loop_event_time){
          this.in_loop_event_time = data.loop_event_time
          console.log("inCar data.kind : ", data.kind, data)
          this.lp = data.lp
          this.in_time = format_time(new Date(data.loop_event_time))
          this.image_name = config.image_src + data.folder_name + "/" + data.fname
          if(data.registered === "등록차량"){
            this.registered = "정기권"
            
            this.regular = JSON.parse(localStorage.regular)
            this.regular.inVehicle += 1
            localStorage.regular= JSON.stringify(this.regular)

            this.eventList = JSON.parse(localStorage.eventList)
            let event= this.in_time.substring(12,) + " " + this.registered + " " + this.lp + " " + "입차"
            this.eventList.unshift(event)    
            if(this.eventList.length > 10){
              this.eventList.splice(11,)
            }
            localStorage.eventList = JSON.stringify(this.eventList)
          }
          else{
            this.registered = "일반권"
            if(localStorage.general){
              this.general = JSON.parse(localStorage.general)
            }
            else{
              this.general.inVehicle = 0
            }
            this.general.inVehicle += 1
            localStorage.general = JSON.stringify(this.general)
            this.eventList = JSON.parse(localStorage.eventList)
            let event= this.in_time.substring(12,) + " " + this.registered + " " + this.lp + " " + "입차"
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
    },
    start(){
      console.log("config.location.in : ",config.location.in)
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
