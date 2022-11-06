<template>
  <div id="addPatientTestPage" class="pa-10">
    <v-app-bar elevation="0" app>
      <v-toolbar-title>{{ patient.patientName }}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-card class="pa-10">
      <v-simple-table>
        <thead>
          <tr>
            <th>تاريخ الفحوصات</th>
            <th>وقت الفحوصات</th>
            <th>السعر</th>
            <th>الاجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="test in tests" :key="test.testId">
            <td>
              {{ test.creationFixedDate }}
            </td>
            <td>
              {{ test.creationFixedTime }}
            </td>
            <td>
              <v-chip color="success">
                {{ test.total.toLocaleString() }} د.ع
              </v-chip>
            </td>
            <td>
              <v-btn
                rounded
                elevation="0"
                color="primary"
                small
                :to="'/testResults/' + test.idPatientTest"
              >
                <v-icon left>la-edit</v-icon>
                <span>ادخال النتائج</span>
              </v-btn>
            </td>
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
    patient: {
      patientName: "",
    },
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios
        .get("patients/" + this.$route.params.id)
        .then((res) => (this.patient = res.data));
      this.$axios
        .get("patientTests/patient/" + this.$route.params.id)
        .then((res) => (this.tests = res.data));
    },
    addTest() {
      this.patientTests.push({
        testId: this.selectedTestId,
        amount: 0,
      });
    },
    total() {
      let total = 0;
      for (let i = 0; i < this.patientTests.length; i++) {
        const test = this.patientTests[i];
        total = total + parseFloat(test.amount);
      }
      return total;
    },
    addPatientTest() {
      this.addPatientTestLoading = true;
      this.$axios
        .post("patientTests/new", {
          patientTest: {
            patientId: this.$route.params.id,
            total: this.total(),
            createdBy: JSON.parse(localStorage.getItem("userInfo")).idUser,
          },
          patientTestContents: this.patientTests,
        })
        .then(() => {
          this.$toasted.success("تم اضافة الفحوصات الى المريض");
          this.$router.push("/patients");
        })
        .catch(() => {
          this.$toasted.error("حدث خطأ ما");
        })
        .finally(() => (this.addPatientTestLoading = false));
    },
  },
};
</script>

<style>
</style>