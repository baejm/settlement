<template>
  <div class="pop_login">
    <div class="login_box">
      <h2>로그인</h2>
      <span>아이디</span>
      <input type="text" v-model="id" />
      <span>비밀번호</span>
      <input type="password" v-model="pw" />
      <button @click="login()">로그인</button>
      <span>{{ idError }}{{ pwError }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: "pop_login",
  data() {
    return {
      id: "",
      pw: "",
      idError: "",
      pwError: "",
      userDb: [{ id: "admin", pw: "1234", status: "ok" }]
    }
  },
  created() {
    this.$socket.on("message_from_server", data => {
      if (data.kind === "employee_login"){
        this.login_process(data)
      }
    })

  },
  methods: {
    login() {     
      // let manager = ""
      // let status = ""      
      let obj = {}
      obj.kind = "employee_login"
      obj.id = this.id
      obj.pw = this.pw
      this.sendMessage(obj)

      // let selectedUser = ""
      // this.userDb.forEach(user => {
      //   if (user.id === this.id) selectedUser = user
      // })
      // if (selectedUser === "") {
      //   this.idError = "아이디가 틀렸습니다."
      //   this.pwError = ""
      // } else {
      //   if (selectedUser.pw !== this.pw) {
      //     this.idError = ""
      //     this.pwError = "비밀번호가 틀렸습니다."
      //   } else {
      //     this.$store.state.loginSuccess = false
      //   }
      // }

    },
     sendMessage(c) {
      this.$socket.emit("message_from_web_client", c)
    },
    login_process(data){
      console.log("login :", data)
      if(data.code_no === 200){
        localStorage.id = data.doc.id
        localStorage.pw = data.doc.pw
        localStorage.status = "ok"
        localStorage.manager = data.doc.class
        localStorage.login_time = Date.now()
        this.$store.state.loginSuccess = false
      }
    }
  }
}
</script>
