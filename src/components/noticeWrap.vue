<template>
  <div class="notice_wrap">
    <div class="notice">
      <h3><font-awesome-icon icon="exclamation-triangle" />알림</h3>
      <div>
        <p>{{ text }}</p>
      </div>
    </div>
    <div class="unrecognized">
      <div class="unknown_wrap active" v-if="statusSignal">
        <h3><font-awesome-icon icon="camera" />입차 미인식 차량 이미지</h3>
        <span>Auto</span>
        <div class="unkonw_imgs">
          <img src="../assets/unknow.jpg" alt="" />
        </div>
        <div class="unkonw_info">
          <p>입구 : 지하 주차장</p>
          <p>시간 : 8월 27일 13시 11분 30초</p>
        </div>
      </div>
      <ul v-else>
        <h3><font-awesome-icon icon="info-circle" />장비 상태 정보</h3>
        <li>
          <dl>
            <dd>위치/종류</dd>
            <dd>LPR</dd>
            <dd>무인기</dd>
          </dl>
        </li>
        <li>
          <dl>
            <dd>입구</dd>
            <!-- <dd><span class="lpr"></span></dd> -->
            <!-- <dd><span class="lpr none"></span></dd> -->
            <dd v-for="(e, index) in entry" :key="index">
              <span class="lpr" :class="{ error: e.signal }"></span>
            </dd>
          </dl>
        </li>
        <li>
          <dl>
            <dd>출구</dd>
            <dd v-for="(e, index) in exit" :key="index">
              <span class="lpr" :class="{ error: e.signal }"></span>
            </dd>
          </dl>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import config from "../config.js"
export default {
  name: "notice_wrap",
  data() {
    return {
      text: "코로나19로 인해 전직원 마스크 착용 바랍니다.",
      // entry: { signal: [false, true], error: [true, false] }
      entry: [{ signal: true }],
      exit: [{ signal: true }, { signal: true }],
       location: {
        in: "",
        out: ""
      },
    }
  },
  computed: {
    ...mapState(["statusSignal"])
  }, created() {
    this.$socket.on("message_from_server", data => {
      if (data.kind == "create_announce_list" || data.kind == "update_announce_list" || data.kind == "delete_announce_list") {
        console.log("data.kind : ", data.kind, data)
      //  this.text_process(data)
      }
      else if (data.kind === "socket_error") {        
      //  this.socket_error(data)
      }
      else if (data.kind === "socket_normal") {
        // console.log("socket normal : ", data1)
        //  this.socket_normal(data)
      }
      // if (data.kind == "lpr" || data.kind == "fee_calculation_result" || data.kind == "lpr_payment") {
      //   console.log("data.kind : ", data.kind, data)
      //   this.lpr_process(data)
      // }       
    }),
    this.start()
    
  }, 
  methods: {
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
      if(obj.location === this.location.in ){
        this.entry[0].signal = true         
      }
      else if(obj.location === this.location.out ){
        this.exit[0].signal = true          
      }
      localStorage.entry = JSON.stringify(this.entry)
      localStorage.exit = JSON.stringify(this.exit)
    },
    socket_normal(obj){
       if(obj.location === this.location.in ){
        this.entry[0].signal = false       
      }
      else if(obj.location === this.location.out ){
        this.exit[0].signal = false        
      }
      localStorage.entry = JSON.stringify(this.entry)
      localStorage.exit = JSON.stringify(this.exit)
    },
    start(){
      console.log("config.location.in : ",config.location.in)
       let interval = 1 * 1000;
      this.location.in = config.location.in
      this.location.out = config.location.out
      this.text = localStorage.announce_text      
      this.entry = JSON.parse(localStorage.entry)
      this.exit = JSON.parse(localStorage.exit)
      setInterval(() => {
        this.entry = JSON.parse(localStorage.entry)
        this.exit = JSON.parse(localStorage.exit)
        this.text = localStorage.announce_text
      }, interval);
     // this.entry[0].signal = false
    }
  }
}
</script>
