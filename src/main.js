import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "line-awesome/dist/line-awesome/css/line-awesome.css";
import Toasted from "vue-toasted";
import VueQRCodeComponent from "vue-qr-generator";

Vue.use(Toasted, {
  duration: 5000,
  iconPack: "mdi",
  theme: "bubble",
  position: "bottom-center",
});
Vue.component("qr-code", VueQRCodeComponent);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
