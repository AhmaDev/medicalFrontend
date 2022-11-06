<template>
  <div id="patientsPage" class="pa-10">
    <v-app-bar elevation="0" app>
      <v-toolbar-title>المرضى</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined @click="addNewPatientDialog = true">
        اضافة مريض جديد
      </v-btn>
    </v-app-bar>

    <v-card class="pa-10">
      <v-data-table :loading="loading" :items="patients" :headers="headers">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            elevation="0"
            color="success"
            small
            rounded
            :to="'addPatientTest/' + item.idPatient"
          >
            اضافة فحص جديد
          </v-btn>
          &nbsp; &nbsp;
          <v-btn
            elevation="0"
            rounded
            color="primary"
            small
            :to="'patient/' + item.idPatient + ''"
          >
            الملف الشخصي
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog width="600" v-model="addNewPatientDialog">
      <v-card class="pa-10">
        <h3>اضافة مريض جديد</h3>
        <br />
        <hr style="opacity: 0.5" />

        <br />
        <v-text-field
          outlined
          v-model="newPatient.patientName"
          label="اسم المريض"
          append-icon="la-user"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="newPatient.phone"
          append-icon="la-phone"
          label="رقم الهاتف"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="newPatient.age"
          append-icon="la-calendar"
          type="number"
          label="العمر"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="newPatient.doctorName"
          append-icon="la-stethoscope"
          label="اسم الدكتور"
        ></v-text-field>
        <v-item-group v-model="newPatient.sex">
          <v-container>
            <v-row>
              <v-col cols="6" md="6">
                <v-item value="male" v-slot="{ active, toggle }">
                  <v-card
                    :color="active ? 'primary' : ''"
                    class="d-flex align-center"
                    :dark="active"
                    height="150"
                    @click="toggle"
                  >
                    <v-scroll-y-transition>
                      <h2 class="flex-grow-1 text-center">
                        <v-icon size="50">la-mars</v-icon>
                        <br />
                        <span>ذكر</span>
                      </h2>
                    </v-scroll-y-transition>
                  </v-card>
                </v-item>
              </v-col>
              <v-col cols="6" md="6">
                <v-item value="female" v-slot="{ active, toggle }">
                  <v-card
                    :color="active ? 'pink' : ''"
                    class="d-flex align-center"
                    :dark="active"
                    height="150"
                    @click="toggle"
                  >
                    <v-scroll-y-transition>
                      <h2 class="flex-grow-1 text-center">
                        <v-icon size="50">la-venus</v-icon>
                        <br />
                        <span>انثى</span>
                      </h2>
                    </v-scroll-y-transition>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
        <br />
        <hr style="opacity: 0.5" />
        <br />
        <v-btn
          :loading="addPatientLoading"
          block
          x-large
          color="primary"
          @click="addPatient()"
          >اضافة المريض</v-btn
        >
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    addPatientLoading: false,
    addNewPatientDialog: false,
    newPatient: {
      patientName: "",
      phone: "",
      age: null,
      doctorName: "",
      sex: "male",
    },
    patients: [],
    headers: [
      { text: "اسم المريض", value: "patientName" },
      { text: "رقم الهاتف", value: "phone" },
      { text: "العمر", value: "age" },
      { text: "الجنس", value: "sex" },
      { text: "الدكتور", value: "doctorName" },
      { text: "الاجراءات", value: "actions" },
    ],
  }),
  created: function () {
    this.fetch();
  },
  methods: {
    fetch() {
      this.$axios.get("patients").then((res) => {
        this.patients = res.data;
        this.loading = false;
      });
    },
    addPatient() {
      this.addPatientLoading = true;
      this.$axios
        .post("patients/new", this.newPatient)
        .then(() => {
          this.$toasted.success("تم اضافة المريض");
          this.newPatient = {
            patientName: "",
            phone: "",
            age: null,
            doctorName: "",
            sex: "male",
          };
          this.addNewPatientDialog = false;
          this.fetch();
        })
        .catch(() => {
          this.$toasted.error("حدث خطأ ما");
        })
        .finally(() => (this.addPatientLoading = false));
    },
  },
};
</script>

<style>
</style>