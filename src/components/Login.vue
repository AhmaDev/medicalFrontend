<template>
  <div id="login">
    <center>
      <v-card max-width="500" class="pa-10" style="margin-top: 100px">
        <center>
          <v-img src="@/assets/logo.png" width="200"></v-img>
          <br />
          <h2>مختبر رازي الكاظمية</h2>
          <br />
        </center>
        <v-text-field
          outlined
          append-icon="la-user"
          v-model="username"
          @keypress.enter="login()"
          label="اسم المستخدم"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="password"
          append-icon="la-key"
          type="password"
          @keypress.enter="login()"
          label="كلمة المرور"
        ></v-text-field>
        <v-btn
          :loading="isLoading"
          x-large
          block
          color="primary"
          @click="login()"
          >دخول</v-btn
        >
        <br /><br />
        <small>Lab system v1.0.0</small>
      </v-card>
    </center>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data: () => ({
    isLoading: false,
    username: "",
    password: "",
  }),
  methods: {
    login() {
      this.isLoading = true;
      this.$axios
        .post("users/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          this.$toasted.success("اهلاً بك , " + this.username);
          localStorage.setItem("userInfo", JSON.stringify(res.data));
          this.$store.commit("setLoginInfo", res.data);
        })
        .catch(() => {
          this.$toasted.error("المعلومات غير صحيحة");
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>

<style>
#login {
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: url("../assets/cool-background.svg");
  background-size: 100% 100%;
}
</style>