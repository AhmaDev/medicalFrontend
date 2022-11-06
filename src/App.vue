<template>
  <v-app>
    <v-navigation-drawer
      v-if="$store.getters.isLoggedIn"
      absolute
      permanent
      app
      right
    >
      <template v-slot:prepend>
        <center>
          <br />
          <v-img src="@/assets/logo.png" width="120"></v-img>
          <br />
          <h3>مختبر رازي الكاظمية</h3>
          <br />
          <v-chip color="primary">{{ userInfo.userName }}</v-chip>
          <br />
          <br />
        </center>
      </template>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item :to="item.route" v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list dense>
          <v-list-item @click="logout()">
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>la-power-off</v-icon>
                &nbsp; &nbsp; &nbsp;&nbsp;&nbsp; تسجيل الخروج
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <br /><br />
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view v-if="$store.getters.isLoggedIn" />
      <LoginPage v-else />
    </v-main>
  </v-app>
</template>

<script>
import LoginPage from "./components/Login.vue";
export default {
  name: "App",
  components: { LoginPage },
  data: () => ({
    items: [
      { title: "الرئيسية", icon: "la-home", route: "/" },
      { title: "المرضى", icon: "la-user-injured", route: "/patients" },
      { title: "الفحصوات", icon: "la-syringe", route: "/tests" },
      { title: "الحسابات", icon: "la-money", route: "/financial" },
      { title: "المستخدمين", icon: "la-user-cog", route: "/users" },
    ],
  }),
  mounted: function () {},
  methods: {
    logout() {
      localStorage.clear();
      location.reload();
    },
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
    userInfo() {
      return this.$store.getters.getLoginInfo;
    },
  },
};
</script>
<style src="./style.css"></style>
