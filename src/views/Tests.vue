<template>
  <div id="testsPage" class="pa-10">
    <v-app-bar elevation="0" app>
      <v-toolbar-title>الفحوصات</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined @click="addNewTestDialog = true">
        اضافة فحص جديد
      </v-btn>
    </v-app-bar>

    <v-card class="pa-10">
      <v-data-table
        :loading="loading"
        :items="tests"
        :headers="headers"
      ></v-data-table>
    </v-card>

    <v-dialog width="600" v-model="addNewTestDialog">
      <v-card class="pa-10">
        <h3>اضافة فحص جديد</h3>
        <br />
        <hr style="opacity: 0.5" />

        <br />
        <v-text-field
          outlined
          v-model="newTest.testName"
          label="اسم الفحص"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="newTest.rangeFrom"
          label="Normal Range الحد الادنى"
          type="number"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="newTest.rangeTo"
          type="number"
          label="Normal Range الحد الاقصى"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="newTest.unit"
          label="Unit"
        ></v-text-field>

        <br />
        <hr style="opacity: 0.5" />
        <br />
        <v-btn
          :loading="addTestLoading"
          block
          x-large
          color="primary"
          @click="addTest()"
          >اضافة الفحص</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    addTestLoading: false,
    addNewTestDialog: false,
    newTest: {
      testName: "",
      rangeFrom: null,
      rangeTo: null,
      testTypeId: 1,
      unit: "",
    },
    tests: [],
    headers: [
      { text: "اسم الفحص", value: "testName" },
      { text: "الحد الادنى", value: "rangeFrom" },
      { text: "الحد الاقصى", value: "rangeTo" },
      { text: "Unit", value: "unit" },
    ],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios.get("tests").then((res) => {
        this.tests = res.data;
        this.loading = false;
      });
    },
    addTest() {
      this.addTestLoading = true;
      this.$axios
        .post("tests/new", this.newTest)
        .then(() => {
          this.$toasted.success("تم اضافة الفحص");
          this.newTest = {
            testName: "",
            rangeFrom: 0,
            rangeTo: 0,
            unit: "",
          };
          this.addNewTestDialog = false;
          this.fetch();
        })
        .catch(() => {
          this.$toasted.error("حدث خطأ ما");
        })
        .finally(() => (this.addTestLoading = false));
    },
  },
};
</script>

<style>
</style>