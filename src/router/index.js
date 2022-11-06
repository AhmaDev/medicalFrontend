import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/patients",
    name: "patients",
    component: () => import("../views/Patients.vue"),
  },
  {
    path: "/tests",
    name: "tests",
    component: () => import("../views/Tests.vue"),
  },
  {
    path: "/patient/:id",
    name: "patient",
    component: () => import("../views/Patient.vue"),
  },
  {
    path: "/addPatientTest/:id",
    name: "addPatientTest",
    component: () => import("../views/AddPatientTest.vue"),
  },
  {
    path: "/testResults/:id",
    name: "testResults",
    component: () => import("../views/TestResults.vue"),
  },
  {
    path: "/testResultsPrint/:id",
    name: "testResultsPrint",
    component: () => import("../views/TestResultsPrint.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
