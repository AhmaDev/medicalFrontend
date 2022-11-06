<template>
  <div id="addPatientTestPage" class="pa-10">
    <v-app-bar elevation="0" app>
      <v-toolbar-title>تعديل نتائج الفحوصات</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        :loading="addPatientTestLoading"
        :to="'/testResultsPrint/' + $route.params.id"
        color="primary"
      >
        <v-icon left>la-print</v-icon>
        <span>طباعة</span>
      </v-btn>
    </v-app-bar>

    <v-card class="pa-10">
      <br />
      <hr />
      <v-simple-table>
        <thead>
          <tr>
            <th>اسم الفحص</th>
            <th>السعر</th>
            <th>النتيجة</th>
            <th>Normal Range</th>
            <th>الاجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="test in patientTest.content" :key="test.testId">
            <td>
              {{ tests.filter((e) => e.idTest == test.testId)[0].testName }}
            </td>
            <td>
              {{ test.amount.toLocaleString() }}
            </td>
            <td>
              <v-text-field
                outlined
                dense
                :value="test.testResult"
                hide-details
                @change="editResult(test.idPatientTestContent, $event)"
              ></v-text-field>
            </td>
            <td>
              ({{ tests.filter((e) => e.idTest == test.testId)[0].rangeFrom }} -
              {{ tests.filter((e) => e.idTest == test.testId)[0].rangeTo }})
              {{ tests.filter((e) => e.idTest == test.testId)[0].unit }}
            </td>
            <td></td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    tests: [],
    selectedTestId: 0,
    addPatientTestLoading: false,
    patientTest: {},
    patientTests: [],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios
        .get("patientTests/" + this.$route.params.id)
        .then((res) => (this.patientTest = res.data));
      this.$axios.get("tests").then((res) => (this.tests = res.data));
    },
    addTest() {
      this.patientTests.push({
        testId: this.selectedTestId,
        amount: 0,
      });
    },
    editResult(id, e) {
      this.$axios
        .put("patientTests/content/edit/" + id, {
          testResult: e,
        })
        .then(() => {
          this.$toasted.success("تم تعديل النتيجة");
        });
    },
  },
};
</script>

<style>
</style>