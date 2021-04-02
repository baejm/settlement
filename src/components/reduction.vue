<template>
  <div class="reductionList">
    <div class="reduction_box">
      <h2><font-awesome-icon icon="coins" />할인감면</h2>
      <ul>
        <li v-for="(sl, index) in reductionLists" :key="index">
          <label>
            <input type="radio" :value="sl.contents" v-model="checkedNames" />
            <span> {{ sl.name }} </span>
            <p>
              <!--  <span class="bind_time">{{ sl.hour }}</span> <span>면제</span> -->
              <span class="bind_price"> {{ sl.contents }}</span>
              <span>할인</span>
              <span> {{ sl.keymap }}</span>
            </p></label
          >
        </li>
      </ul>

      <div class="btn_box">
        <button @click="reductCancel()">취소</button>
        <button @click="reductComfirm()">확인</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import config from "../config.js"
export default {
  name: "reduct",
  data() {
    return {
      time: ["1시간", "2시간", "3시간", "4시간", "5시간"],
      price: ["5000원", "30%", "1000원", "50%"],
      checkedNames: "60분쿠폰",
      lp: "",
      in_time: 0,
      out_time: 0,
      location: {
        in: "",
        out: ""
      },
      reductionLists: [
        // { title: "장애인", time: "1시간", price: "5000원", bt: "R01", value: "R01" },
        // { title: "고엽제 환자", time: "2시간", price: "30%", bt: "R02", value: "R02"  },
        // { title: "독립유공자", time: "1시간", price: "2000원", bt: "R03", value: "R03"  },
        // { title: "저공해 환승", time: "0시간", price: "5000원", bt: "R04", value: "R04"  },
        // { title: "전기차 충전", time: "0시간", price: "50%", bt: "R05", value: "R05"  },
        // { title: "저공해 자동차", time: "0시간", price: "1000원", bt: "R06", value: "R06"  },
        // { title: "환승", time: "1시간", price: "5000원", bt: "R07", value: "R07"  },
        // { title: "재해 부상 공무원", time: "2시간", price: "5000원", bt: "R08", value: "R08"  },
        // { title: "제로 페이", time: "3시간", price: "30%", bt: "R09", value: "R09"  },
        // { title: "투표 참여", time: "1시간", price: "300원", bt: "R10", value: "R10"  },
        // { title: "국가 유공상이자", time: "1시간", price: "5000원", bt: "R11", value: "R11"  },
        // { title: "의상자", time: "2시간", price: "50%", bt: "R12", value: "R12"  },
        // { title: "경차 환승", time: "1시간", price: "5000원", bt: "R13", value: "R13"  },
        // { title: "518 민주 유공자", time: "0시간", price: "30%", bt: "R14", value: "R14"  },
        // { title: "경차", time: "1시간", price: "50%", bt: "R15", value: "R15"  },
        // { title: "다둥이(3자녀)", time: "1시간", price: "50%", bt: "R16", value: "R16"  },
        // { title: "재해 부상 군경", time: "2시간", price: "50%", bt: "R17", value: "R17"  },
        // { title: "다둥이(2자녀)", time: "1시간", price: "5000원", bt: "R18", value: "R18"  },
        // { title: "모범납세자", time: "3시간", price: "30%", bt: "R19", value: "R19"  },
        // { title: "경로우대", time: "1시간", price: "5000원", bt: "R20", value: "R20"  }
      ]
    }
  },
  computed: {
    ...mapState(["reduction"])
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if (
        (data.kind == "fee_calculation_result" || data.kind == "lpr_payment") &&
        data.direction == "out"
      ) {
        console.log("data.kind : ", data.kind, data)
        //  this.lpr_process(data)
      } else if (data.kind == "get_reduction_product_list") {
        this.get_reduction_product_list(data)
      }
    }),
      this.start()
  },
  methods: {
    reductCancel() {
      this.$store.state.reduct = false
    },
    reductComfirm() {
      console.log("this.checkedNames : ", this.checkedNames)
      if (this.checkedNames.length !== 0) {
        console.log("discounted reductuion after: ", this.checkedNames)
        for (let i = 0; i < this.saleLists.length; i++) {
          if (this.saleLists[i].value === this.checkedNames[0]) {
            let obj = {}
            obj.title = this.saleLists[i].title
            obj.hour = this.saleLists[i].hour
            obj.value1 = this.saleLists[i].value
            obj.value = this.saleLists[i].value1
            obj.unit = this.saleLists[i].unit
            obj.str_value = this.saleLists[i].str_value
            obj.keymap = this.saleLists[i].keymap
            obj.contents = this.saleLists[i].contents
            this.lp = localStorage.lp
            this.in_time = localStorage.in_time
            this.out_time = localStorage.out_time
            obj.lp = this.lp
            obj.in_time = this.in_time
            obj.out_time = this.out_time
            obj.kind = "discounted_reduction_keypad"
            obj.cmd = "PARK_FEE_RECALC"
            obj.in_time = this.in_time
            obj.out_time = this.out_time
            obj.discounted_coupon_id = config.machineid
            obj.discounted_coupon_model = config.machinemodel
            obj.discounted_coupon_how = "요금정산원"
            obj.time = Date.now()
            this.sendMessage(obj)

            console.log("discount_coupon obj : ", obj)
          }
        }
        this.$store.state.reduct = false
      }
    },
    get_reduction_product_list(data) {
      console.log("data.docs : ", data.docs)
      this.reductionLists = []
      // for(let i = 0; i < data.docs.length; i++){
      //   let obj = {}

      // }
      this.reductionLists = data.docs
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    start() {
      //  console.log("reduction : config.discounted_coupon_policy.coupon_kind.length ", config.discounted_coupon_policy.coupon_kind.length)
      // for (let i = 0; i < config.discounted_coupon_policy.coupon_kind.length; i++) {
      //   let obj = {}
      //   obj.value = config.discounted_coupon_policy.coupon_kind[i].value
      //   obj.name = config.discounted_coupon_policy.coupon_kind[i].name
      //   obj.keymap = config.discounted_coupon_policy.coupon_kind[i].keymap
      //   obj.real_value = config.discounted_coupon_policy.coupon_kind[i].real_value
      //   obj.contents = config.discounted_coupon_policy.coupon_kind[i].contents
      //   this.couponLists.push(obj)
      // }
      this.location.in = config.location.in
      this.location.out = config.location.out
      let obj = {}
      obj.kind = "get_reduction_product_list"
      console.log("get_reduction_product_list : ", obj)
      this.sendMessage(obj)
    }
  }
}
</script>
