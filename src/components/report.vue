<template>
  <div class="report_wrap">
    <div class="title">
      <button @click="backbtn" class="back_btn">
        <font-awesome-icon icon="angle-left" />
      </button>
      <h2>보고서</h2>
    </div>
    <form class="menu_title">
      <span class="small_title">날짜</span>
      <input type="datetime-local" id="start_time" v-model="start_time" />
      <span>~</span>
      <input type="datetime-local" id="end_time" v-model="end_time" />
      <span class="small_title">장소</span>
      <select v-model="searchLocation">
        <option v-for="(location1, index) in locations" :key="index">
          {{ location1.text }}
        </option>
      </select>

      <span class="small_title">방향</span>
      <select v-model="searchDirection">
        <option v-for="(direction1, index) in directions" :key="index">
          {{ direction1.text }}
        </option>
      </select>

      <span class="small_title">차량번호</span>
      <input
        class="search_icon"
        type="text"
        maxlength="8"
        v-model="seachNumber"
        placeholder="예) 12가3456"
      />
      <button @click.prevent="search" type="submit">
        <font-awesome-icon icon="search" />
      </button>
      <button @click.prevent="download">
        <font-awesome-icon icon="save" />
      </button>
    </form>
    <div class="list-items">
      <ul class="list-title">
        <li>번호</li>
        <li>차량출입시간</li>
        <li>장소</li>
        <li>방향</li>
        <li>차량번호</li>
        <li>구분</li>
        <li>동호수</li>
        <li>메모</li>
      </ul>
      <ul class="list-wrap">
        <li v-for="(res, index) in vehicle_obj_list" :key="index">
          <span> {{ index + 1 }}</span>
          <span class="time"
            ><input type="text" v-model="res.in_time" readonly
          /></span>
          <span class="location"
            ><input type="text" v-model="res.location" readonly
          /></span>
          <span class="direction"
            ><input type="text" v-model="res.direction" readonly
          /></span>
          <span class="lp"
            ><input
              type="text"
              v-model="res.lp"
              readonly
              v-on:change="contents_change(index)"
          /></span>
          <span class="registered"
            ><input type="text" v-model="res.registered" readonly
          /></span>
          <span class="dong_ho"
            ><input type="text" v-model="res.dong_ho" readonly
          /></span>
          <span class="contents"
            ><input
              type="text"
              v-model="res.contents"
              v-on:change="contents_change(index)"
              readonly
          /></span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import config from "../config.js"
export default {
  data() {
    return {
      vehicle_obj_list: [
        {
          in_time: "2020.09.14. 00:03:44",
          location: "정문입구",
          direction: "in",
          lp: "서울86자5051",
          registered: "등록차량",
          dong_ho: " ",
          contents: "공적차량"
        },
        {
          in_time: "2020.09.14. 00:03:44",
          location: "정문입구",
          direction: "in",
          lp: "서울86자5051",
          registered: "등록차량",
          dong_ho: " ",
          contents: "공적차량"
        },
        {
          in_time: "2020.09.14. 00:03:44",
          location: "정문입구",
          direction: "in",
          lp: "서울86자5051",
          registered: "등록차량",
          dong_ho: " ",
          contents: "공적차량"
        },
        {
          in_time: "2020.09.14. 00:03:44",
          location: "정문입구",
          direction: "in",
          lp: "서울86자5051",
          registered: "등록차량",
          dong_ho: " ",
          contents: "공적차량"
        },
        {
          in_time: "2020.09.14. 00:03:44",
          location: "정문입구",
          direction: "in",
          lp: "서울86자5051",
          registered: "등록차량",
          dong_ho: " ",
          contents: "공적차량"
        },
        {
          in_time: "2020.09.14. 00:03:44",
          location: "정문입구",
          direction: "in",
          lp: "서울86자5051",
          registered: "등록차량",
          dong_ho: " ",
          contents: "공적차량"
        },
        {
          in_time: "2020.09.14. 00:03:44",
          location: "정문입구",
          direction: "in",
          lp: "서울86자5051",
          registered: "등록차량",
          dong_ho: " ",
          contents: "공적차량"
        }
      ],
      searchLocation: "",
      searchDirection: "",
      locations: [],
      directions: []
    }
  },
  methods: {
    backbtn() {
      this.$store.state.newPopup = false
    },
    loc_dir() {
      this.locations = []
      this.directions = []
      let location_list = []
      let direction_list = []
      location_list = config.location_list
      direction_list = config.direction_list
      this.locations = location_list
      this.directions = direction_list
      let temp = {}
      this.locations.push(temp)
      this.locations.splice(this.locations.length - 1, 1)
      this.directions.push(temp)
      this.directions.splice(this.directions.length - 1, 1)
    },
    search() {
      var obj = {}
      obj.kind = ""
      obj.lp = this.seachNumber
      obj.id = window.localStorage.getItem("admin_id")
      obj.pw = window.localStorage.getItem("admin_pw")
      this.vehicle_obj_list = []
      this.sendMessage(obj)
    }
  },
  created() {
    this.$socket.on("message_from_server", data => {
      this.socket_process(data)
    })
    this.loc_dir()
  }
}
</script>
<style scoped>
.report_wrap {
  height: 100%;
}
</style>
