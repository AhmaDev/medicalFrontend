<template>
  <div id="addPatientTestPage" class="pa-10">
    <v-app-bar elevation="0" app>
      <v-toolbar-title>{{ patient.patientName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        :loading="addPatientTestLoading"
        @click="addPatientTest()"
        color="primary"
      >
        <v-icon left>la-check</v-icon>
        <span>متابعة</span>
      </v-btn>
    </v-app-bar>

    <v-card class="pa-10">
      <v-row>
        <v-col cols="3">
          <v-autocomplete
            outlined
            :items="testGroups"
            item-text="testGroupName"
            item-value="idTestGroup"
            v-model="selectedTestGroupId"
            dense
            @change="selectGroup($event)"
            hide-details
            label="اختيار المجموعة"
          ></v-autocomplete>
        </v-col>
        <v-col cols="3">
          <v-autocomplete
            outlined
            :items="tests.filter((e) => e.testGroupId == selectedTestGroupId)"
            item-text="testName"
            item-value="idTest"
            @change="showValue()"
            v-model="selectedTestId"
            dense
            multiple
            hide-details
            label="اختيار فحص"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-btn @click="addTest()" color="success">اضافة</v-btn>
        </v-col>
      </v-row>
      <br />
      <hr />
      <v-simple-table>
        <thead>
          <tr>
            <th>اسم الفحص</th>
            <th>السعر</th>
            <th>الاجراءات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(test, index) in patientTests" :key="test.testId">
            <td>
              {{ tests.filter((e) => e.idTest == test.testId)[0].testName }}
            </td>
            <td>
              <v-text-field
                dense
                outlined
                hide-details
                type="number"
                v-model="patientTests[index].amount"
              ></v-text-field>
            </td>
            <td>
              <v-btn color="error" @click="patientTests.splice(index, 1)">
                <v-icon left>la-trash</v-icon>
                <span>حذف</span>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-simple-table>

      <v-alert color="success" dark>
        <h3>
          المجموع:
          {{ total().toLocaleString() }}
          IQD
        </h3>
      </v-alert>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    tests: [],
    testGroups: [],
    selectedTestId: [],
    selectedTestGroupId: 0,
    addPatientTestLoading: false,
    patient: {
      patientName: "",
    },
    patientTests: [],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios
        .get("patients/" + this.$route.params.id)
        .then((res) => (this.patient = res.data));
      this.$axios.get("tests").then((res) => (this.tests = res.data));
      this.$axios.get("testGroups").then((res) => (this.testGroups = res.data));
    },
    addTest() {
      for (let i = 0; i < this.selectedTestId.length; i++) {
        const test = this.selectedTestId[i];
        this.patientTests.push({
          testId: test,
          amount: this.tests.filter((e) => e.idTest == test)[0].price,
        });
      }
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
          this.$router.push("/patient/" + this.$route.params.id);
        })
        .catch(() => {
          this.$toasted.error("حدث خطأ ما");
        })
        .finally(() => (this.addPatientTestLoading = false));
    },
    selectGroup(id) {
      this.selectedTestId = this.tests
        .filter((e) => e.testGroupId == id)
        .map((e) => e.idTest);
      console.log(this.selectedTestId);
    },
    showValue() {
      console.log(this.selectedTestId);
    },
  },
};
</script>

<style>
</style>