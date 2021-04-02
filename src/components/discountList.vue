<template>
  <div class="discountList">
    <div class="discount_box">
      <h2><font-awesome-icon icon="coins" />주차 할인</h2>
      <ul>
        <li v-for="(sl, index) in couponLists" :key="index">
          <label>
            <input type="radio" :value="sl.coupon_name" v-model="checked" />
            <span> {{ sl.title }} </span>
            <p>
              <!--  <span class="bind_time">{{ sl.hour }}</span> <span>면제</span> -->
              <span class="bind_price"> {{ sl.str_value }}</span>
              <span>할인</span>
              <span> {{ sl.keymap }}</span>
            </p></label
          >
        </li>
      </ul>

      <div class="btn_box">
        <button @click="discountCancel()">취소</button>
        <button @click="discountComfirm()">확인</button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex"
import config from "../config.js"
export default {
  name: "discountList",
  data() {
    return {
      checked: "",
      time: ["1시간", "2시간", "3시간", "4시간", "5시간"],
      price: ["5000원", "30%", "1000원", "50%"],
      checkedNames: [],
      lp: "",
      in_time: 0,
      out_time: 0,
      location: {
        in: "",
        out: ""
      },
      couponLists: []
    }
  },
  computed: {
    ...mapState(["discount"])
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if (
        (data.kind == "fee_calculation_result" || data.kind == "lpr_payment") &&
        data.direction == "out"
      ) {
        console.log("data.kind : ", data.kind, data)
        //  this.lpr_process(data)
      } else if (data.kind == "get_coupon_product_list") {
        this.get_coupon_product_list(data)
      }
    }),
      this.start()
  },
  methods: {
    discountCancel() {
      this.$store.state.discount = false
    },
    discountComfirm() {
      this.$store.state.discount = false

      console.log("discounted reductuion : ", this.checkedNames)
      for (let i = 0; i < this.couponLists.length; i++) {
        console.log(
          "this.checkedNames after: ",
          this.checkedNames,
          "this.couponLists[i].value : ",
          this.couponLists[i].value
        )
        if (this.couponLists[i].name === this.checkedNames) {
          console.log(
            "this.checkedNames after: ",
            this.checkedNames,
            "this.couponLists[i].value : ",
            this.couponLists[i].name
          )
          let obj = {}
          obj.value = this.couponLists[i].value
          obj.name = this.couponLists[i].name
          obj.keymap = this.couponLists[i].keymap
          obj.real_value = this.couponLists[i].real_value
          obj.contents = this.couponLists[i].contents
          obj.lp = this.lp
          obj.in_time = this.in_time
          obj.out_time = this.out_time
          obj.kind = "discounted_coupon_keypad"
          obj.cmd = "PARK_FEE_RECALC"
          obj.time = Date.now()
          obj.discounted_coupon_id = config.machineid
          obj.discounted_coupon_model = config.machinemodel
          obj.discounted_coupon_how = "요금정산원"
          obj.time = Date.now()
          console.log("reduction.vue obj : ", obj)
          this.sendMessage(obj)
        }
      }
    },
    get_coupon_product_list(data) {
      console.log("get+coupon_product_list : ", data)
      this.couponLists = []
      for (let i = 0; i < data.docs.length; i++) {
        let obj = {}
        obj = data.docs[i]
        let coupon_name = data.docs[i].coupon_name.replace("할인", "")
        obj.str_value = coupon_name + "( " + data.docs[i].value + "분" + ") "
      }
      this.couponLists = data.docs
    },
    sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    start() {
      // for (
      //   let i = 0;
      //   i < config.discounted_reductuion_policy_list.length;
      //   i++
      // ) {
      //   let obj = {}
      //   obj.title = config.discounted_reductuion_policy_list[i].title
      //   obj.hour = config.discounted_reductuion_policy_list[i].hour
      //   obj.value1 = config.discounted_reductuion_policy_list[i].value1
      //   obj.value = config.discounted_reductuion_policy_list[i].value
      //   obj.unit = config.discounted_reductuion_policy_list[i].unit
      //   obj.str_value = config.discounted_reductuion_policy_list[i].str_value
      //   obj.keymap = config.discounted_reductuion_policy_list[i].keymap
      //   obj.contents = config.discounted_reductuion_policy_list[i].contents
      //   this.saleLists.push(obj)
      // }

      this.location.in = config.location.in
      this.location.out = config.location.out
      let obj = {}
      obj.kind = "get_coupon_product_list"
      console.log("get_coupon_product_list : ", obj)
      this.sendMessage(obj)
    }
  }
}
</script>
