<template>
  <div id="testsPage" class="pa-10">
    <v-app-bar elevation="0" app>
      <v-toolbar-title>الفحوصات</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined @click="addNewTestGroupDialog = true">
        اضافة مجموعة جديدة
      </v-btn>
    </v-app-bar>

    <v-card
      v-for="testGroup in testGroups"
      :key="testGroup.idTestGroup"
      class="pa-10 mb-10"
    >
      <v-row>
        <v-col>
          <h2>{{ testGroup.testGroupName }}</h2>
        </v-col>
        <v-col cols="2">
          <v-btn
            outlined
            color="primary"
            @click="
              newTest.testGroupId = testGroup.idTestGroup;
              addNewTestDialog = true;
            "
            >اضافة فحص جديد</v-btn
          >
        </v-col>
      </v-row>

      <v-data-table
        :loading="loading"
        :items="tests.filter((e) => e.testGroupId == testGroup.idTestGroup)"
        :headers="headers"
        :items-per-page="1000"
      ></v-data-table>
    </v-card>

    <v-dialog width="500" v-model="addNewTestGroupDialog">
      <v-card class="pa-10">
        <v-text-field
          outlined
          label="اسم المجموعة"
          v-model="testGroupName"
        ></v-text-field>
        <br />
        <hr style="opacity: 0.5" />
        <br />
        <v-btn
          :loading="addTestLoading"
          block
          x-large
          color="primary"
          @click="addTestGroup()"
          >اضافة المجموعة</v-btn
        >
      </v-card>
    </v-dialog>
    <v-dialog width="1000" persistent v-model="addNewTestDialog">
      <v-card class="pa-10">
        <v-btn style="float: left" @click="addNewTestDialog = false" icon>
          <v-icon>la-close</v-icon>
        </v-btn>
        <h3>اضافة فحص جديد</h3>
        <br />
        <hr style="opacity: 0.5" />

        <br />
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="newTest.testName"
              label="اسم الفحص"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              outlined
              v-model="newTest.unit"
              label="Unit"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              outlined
              v-model="newTest.price"
              label="السعر"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              :items="testTypes"
              item-text="testTypeName"
              item-value="idTestType"
              v-model="newTest.testTypeId"
              outlined
              label="نوع النتيجة"
            >
            </v-select>
          </v-col>
        </v-row>

        <v-simple-table>
          <thead>
            <tr>
              <th>Female</th>
              <th>Male</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <br />
                <v-text-field
                  v-if="newTest.testTypeId == 1"
                  outlined
                  v-model="newTest.female.min"
                  label="Min Normal Range"
                ></v-text-field>
                <v-text-field
                  v-if="newTest.testTypeId == 1"
                  outlined
                  v-model="newTest.female.max"
                  label="Max Normal Range"
                ></v-text-field>
                <v-textarea
                  v-model="newTest.female.notice"
                  outlined
                  label="Notice"
                ></v-textarea>
              </td>
              <td>
                <br />
                <v-text-field
                  v-if="newTest.testTypeId == 1"
                  outlined
                  v-model="newTest.male.min"
                  label="Min Normal Range"
                ></v-text-field>
                <v-text-field
                  v-if="newTest.testTypeId == 1"
                  outlined
                  v-model="newTest.male.max"
                  label="Max Normal Range"
                ></v-text-field>
                <v-textarea
                  v-model="newTest.male.notice"
                  outlined
                  label="Notice"
                ></v-textarea>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

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
    addNewTestGroupDialog: false,
    testGroupName: null,
    newTest: {
      testName: "",
      testGroupId: 1,
      testTypeId: 1,
      price: null,
      unit: "",
      male: {
        min: null,
        max: null,
        notice: null,
      },
      female: {
        min: null,
        max: null,
        notice: null,
      },
    },
    tests: [],
    testGroups: [],
    testTypes: [],
    headers: [
      { text: "اسم الفحص", value: "testName" },
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
        this.$axios.get("testGroups").then((res) => {
          this.testGroups = res.data;
          this.loading = false;
        });
      });
      this.$axios.get("tests/types").then((res) => {
        this.testTypes = res.data;
      });
    },
    addTestGroup() {
      this.addTestLoading = true;
      this.$axios
        .post("testGroups/new", {
          testGroupName: this.testGroupName,
        })
        .then(() => {
          this.$toasted.success("تم اضافة المجموعة");
          this.testGroupName = "";
          this.addNewTestGroupDialog = false;
          this.fetch();
        })
        .catch(() => {
          this.$toasted.error("حدث خطأ ما");
        })
        .finally(() => (this.addTestLoading = false));
    },
    addTest() {
      console.log(this.newTest);
      if (!this.validate()) {
        return;
      }
      this.addTestLoading = true;
      let testInfo = {
        testName: this.newTest.testName,
        testGroupId: this.newTest.testGroupId,
        testTypeId: this.newTest.testTypeId,
        price: this.newTest.price,
        unit: this.newTest.unit,
      };
      this.$axios
        .post("tests/new", {
          testInfo: testInfo,
          male: this.newTest.male,
          female: this.newTest.female,
        })
        .then(() => {
          this.$toasted.success("تم اضافة الفحص");
          this.newTest = {
            testName: "",
            testGroupId: 1,
            testTypeId: 1,
            price: null,
            unit: "",
            male: {
              min: null,
              max: null,
              notice: null,
            },
            female: {
              min: null,
              max: null,
              notice: null,
            },
          };
          this.addNewTestDialog = false;
          this.fetch();
        })
        .catch(() => {
          this.$toasted.error("حدث خطأ ما");
        })
        .finally(() => (this.addTestLoading = false));
    },
    validate() {
      if (this.newTest.testName == "") {
        this.$toasted.error("يرجى كتابة اسم الفحص");
        return false;
      }
      if (this.newTest.unit == "") {
        this.$toasted.error("يرجى كتابة الوحدة");
        return false;
      }
      if (this.newTest.price == null) {
        this.$toasted.error("يرجى كتابة السعر");
        return false;
      }
      if (this.newTest.male.min == null) {
        this.$toasted.error("يرجى كتابة الحد الادنى للذكر");
        return false;
      }
      if (this.newTest.male.max == null) {
        this.$toasted.error("يرجى كتابة الحد الاعلى للذكر");
        return false;
      }
      if (this.newTest.male.notice == null) {
        this.$toasted.error("يرجى كتابة الملاحظات للذكر");
        return false;
      }
      if (this.newTest.female.min == null) {
        this.$toasted.error("يرجى كتابة الحد الادنى للانثى");
        return false;
      }
      if (this.newTest.female.max == null) {
        this.$toasted.error("يرجى كتابة الحد الاعلى للانثى");
        return false;
      }
      if (this.newTest.female.notice == null) {
        this.$toasted.error("يرجى كتابة الملاحظات للانثى");
        return false;
      }
      return true;
    },
  },
};
</script>

<style>
</style>