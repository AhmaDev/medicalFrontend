<template>
  <div id="resultPrint" class="pa-10">
    <v-sheet id="printableArea" dir="ltr" v-if="patient != null" class="pa-10">
      <br />
      <v-row>
        <v-col>
          <div>
            <b>Patient Name:</b>
            <b style="color: blue"> {{ patient.patientName }}</b>
          </div>
          <div><b>Age :</b> {{ patient.age }} Year(s)</div>
          <div><b>Sex :</b> {{ patient.sex.capitalize() }}</div>
          <div>
            <b>Consultant : </b>
            <b style="color: blue">{{ patient.doctorName }}</b>
          </div>
          <div><b>Total Tests :</b> {{ patientTest.content.length }}</div>
        </v-col>
        <v-col>
          <div><b>Sample Date :</b> {{ patientTest.creationFixedDate }}</div>
          <div><b>Sample Time :</b> {{ patientTest.creationFixedTime }}</div>
        </v-col>
        <v-col cols="2">
          <qr-code
            :size="100"
            :text="'patientTestSampleId' + patientTest.idPatientTest"
          ></qr-code>
        </v-col>
      </v-row>

      <br />
      <table width="100%">
        <thead>
          <tr>
            <td>Test</td>
            <td>Result</td>
            <td>Normal Range</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="test in patientTest.content"
            :key="test.idPatientTestContent"
          >
            <td>
              {{ tests.filter((e) => e.idTest == test.testId)[0].testName }}
            </td>
            <td>{{ test.testResult }}</td>
            <td v-if="patient.sex == 'male'">
              <template
                v-if="
                  tests.filter((e) => e.idTest == test.testId)[0].male
                    .rangeFrom == 0 &&
                  tests.filter((e) => e.idTest == test.testId)[0].male
                    .rangeTo == 0
                "
              >
                <pre
                  >{{
                    tests.filter((e) => e.idTest == test.testId)[0].male.notice
                  }}
                </pre>
              </template>
              <template v-else>
                ({{
                  tests.filter((e) => e.idTest == test.testId)[0].male.rangeFrom
                }}
                -
                {{
                  tests.filter((e) => e.idTest == test.testId)[0].male.rangeTo
                }})
                {{ tests.filter((e) => e.idTest == test.testId)[0].unit }}
              </template>
            </td>
            <td v-if="patient.sex == 'female'">
              <template
                v-if="
                  tests.filter((e) => e.idTest == test.testId)[0].female
                    .rangeFrom == 0 &&
                  tests.filter((e) => e.idTest == test.testId)[0].female
                    .rangeTo == 0
                "
              >
                <pre>{{
                  tests.filter((e) => e.idTest == test.testId)[0].female.notice
                }}</pre>
              </template>
              <template v-else>
                ({{
                  tests.filter((e) => e.idTest == test.testId)[0].female
                    .rangeFrom
                }}
                -
                {{
                  tests.filter((e) => e.idTest == test.testId)[0].female
                    .rangeTo
                }})
                {{ tests.filter((e) => e.idTest == test.testId)[0].unit }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
    </v-sheet>
  </div>
</template>

<script>
export default {
  data: () => ({
    tests: [],
    selectedTestId: 0,
    addPatientTestLoading: false,
    patientTest: null,
    patient: null,
    patientTests: [],
  }),
  created: function () {
    this.fetch();
    Object.defineProperty(String.prototype, "capitalize", {
      value: function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
      },
      enumerable: false,
    });
  },
  methods: {
    fetch() {
      this.$axios.get("patientTests/" + this.$route.params.id).then((res) => {
        this.patientTest = res.data;
        this.$axios
          .get("patients/" + this.patientTest.patientId)
          .then((res) => {
            this.patient = res.data;
            setTimeout(() => {
              // window.print();
            }, 1000);
          });
      });
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

<style scoped>
table thead td {
  font-weight: bold;
}
td {
  border-bottom: 1px #000 solid;
  font-size: 17px;
}
.notInRange {
  color: red;
  text-decoration: underline;
  font-weight: bold;
}
</style>