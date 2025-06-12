import { Component, OnInit } from '@angular/core';
import { Observable, catchError, filter, map, of, startWith } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ReportAppAdminPostInterface } from 'src/app/Models/reports/reportAppAdminPost.interface';
import { ReportAppAdminResponseInterface } from 'src/app/Models/reports/reportAppAdminResponse.interface';
import { ReportService } from 'src/app/Services/reports/report.service';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { Medicalspeciality } from 'src/app/Models/Profile/medicalspeciality.interface';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';
import { PaymentMethod } from 'src/app/Models/appointments/paymentmethod.interface';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { SpecialtyFilterService } from 'src/app/Services/Profile/speciality/specialty-filter/specialty-filter.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.css'],
})
export class AdminReportsComponent implements OnInit {
  // Form
  reportForm: FormGroup;
  // Response
  reportData: ReportAppAdminResponseInterface;
  // Data
  doctors: DoctorProfile[] = [];
  patients: Patient[] = [];
  specialties: Medicalspeciality[] = [];
  branches: SpecialityBranch[] = [];
  insurances: HealthInsurance[] = [];
  methods: PaymentMethod[] = [];
  // Filtered Data
  specialtyFilteredDoctors: DoctorProfile[] = [];
  specialtyFilteredBranches: SpecialityBranch[] = [];
  // Selections
  selectedSpecialty: number = 0;
  selectedDoctor: number = 0;
  selectedPatient: number = 0;
  selectedInsurance: number = 0;
  // Form COntrols
  specialtyControl = new FormControl();
  doctorControl = new FormControl();
  patientControl = new FormControl();
  insuranceControl = new FormControl();
  // Observables to reactive filter
  filteredSpecialties: Observable<Medicalspeciality[]> = of([]);
  filteredDoctors: Observable<DoctorProfile[]> = of([]);
  filteredPatients: Observable<Patient[]> = of([]);
  filteredInsurances: Observable<HealthInsurance[]> = of([]);
  // Display data
  specialtytName: string = '';
  doctorName: string = '';
  patientName: string = '';
  insuranceName: string = '';

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private branchService: BranchService,
    private doctorService: DoctorprofileService,
    private specialtyService: SpecialityService,
    private patientService: PatientService,
    private insuranceService: HealthinsuranceService,
    private specialtyFilterService: SpecialtyFilterService,
    private paymentmethodservice: PaymentmethodService,
    private dialogService: DialogService,
    private router: Router
  ) {
    // Init form
    this.reportForm = this.fb.group({
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      doctor: [null],
      patient: [null],
      specialty: [null],
      branch: [null],
      health_insurance: [null],
      payment_method: [null],
    });
    this.reportData = {
      summary: {
        doctor: 0,
        specialty: 0,
        branch: 0,
        payment_method: 0,
        num_patients: 0,
        num_doctors: 0,
        num_particular_insurances: 0,
        num_other_insurances: 0,
        num_appointments: 0,
        total_patient_copayment: 0,
        total_hi_copayment: 0,
      },
      appointments: [],
    };
  }

  ngOnInit(): void {
    // Initialize data
    this.loadDoctors();
    this.loadPatients();
    this.loadInsurances();
    this.loadSpecialties();
    this.loadBranches();
    this.loadPaymentMethods();
  }

  /***** Init Data Section *****/

  /**
   * Fetches a list of doctors from the doctor service, sorts them alphabetically by user,
   * and assigns them to the 'doctors' property.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching or sorting the data.
   * @returns {void}
   */
  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe((data) => {
      data.sort((a, b) => a.user.toString().localeCompare(b.user.toString()));
      this.doctors = data;
      this.filterDoctors();
    });
  }

  /**
   * Fetches a list of patients from the patient service, sorts them alphabetically by user,
   * assigns them to the 'patients' property, and filters them.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching, sorting, or filtering the data.
   * @returns {void}
   */
  loadPatients(): void {
    this.patientService.getAllPatients().subscribe((data) => {
      data.sort((a, b) => a.user.toString().localeCompare(b.user.toString()));
      this.patients = data;
      this.filterPatients();
    });
  }

  /**
   * Fetches a list of specialties from the specialty service, sorts them alphabetically by name,
   * assigns them to the 'specialties' property, and filters them.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching, sorting, or filtering the data.
   * @returns {void}
   */
  loadSpecialties(): void {
    this.specialtyService.getSpecialities().subscribe((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.specialties = data;
      this.filterSpecialties();
    });
  }

  /**
   * Fetches a list of branches from the branch service, sorts them alphabetically by name,
   * and assigns them to the 'branches' property.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching or sorting the data.
   * @returns {void}
   */
  loadBranches(): void {
    this.branchService.getSpecialityBranches().subscribe((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.branches = data;
    });
  }

  /**
   * Fetches a list of insurances from the insurance service, sorts them alphabetically by name,
   * and assigns them to the 'insurances' property.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching or sorting the data.
   * @returns {void}
   */
  loadInsurances(): void {
    this.insuranceService.getAll().subscribe((data) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.insurances = data;
      this.filterInsurances();
    });
  }

  /**
   * Fetches a list of payment methods from the payment method service, sorts them alphabetically by name,
   * and assigns them to the 'methods' property.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching, sorting, or filtering the data.
   * @returns {void}
   */
  loadPaymentMethods(): void {
    this.paymentmethodservice.getPaymentMethods().subscribe((data) => {
      //Sort
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.methods = data;
    });
  }

  /***** OnSelect Section *****/

  /**
   * Handles the event when a specialty is selected.
   * Resets the form and loads the doctors for the selected specialty.
   * @param selectedValue The selected specialty.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in resetting the form or loading the doctors.
   * @returns {void}
   */
  onSpecialtySelect(selectedValue: number): void {
    this.selectedSpecialty = selectedValue;
    if (selectedValue !== null) {
      this.resetForm(this.reportForm, { doctor: true, branch: true });
      this.loadfilteredDoctors(this.selectedSpecialty);
      this.filterDoctors();
      this.loadfilteredBranches(this.selectedSpecialty);
    } else {
      //Reset doctor, and in consecuence day and hour
      this.resetForm(this.reportForm, { doctor: true, branch: true });
      this.filterDoctors();
    }
  }

  /**
   * Handles the event when a doctor is selected.
   * @param doctorId The selected doctor's ID.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in resetting the form or loading the doctor's schedule.
   * @returns {void}
   */
  onDoctorSelect(doctor: DoctorProfile): void {
    if (doctor && doctor.id) this.selectedDoctor = doctor.id;
    else {
      this.selectedDoctor = 0;
    }
  }

  /**
   * Handles the event when a patient is selected.
   * @param patientId The selected patient's ID.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in resetting the form or loading the common insurances.
   * @returns {void}
   */
  onPatientSelect(patientId: number): void {
    // Really necesary? maybe just use this.patientControl.value to send to back (remove from html)
    this.selectedPatient = patientId;
  }

  /**
   * Handles the event when a patient is selected.
   * Resets the form and loads the common insurances for the selected patient.
   * @param patientId The selected patient's ID.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in resetting the form or loading the common insurances.
   * @returns {void}
   */
  onInsuranceSelect(insuranceId: number): void {
    // Really necesary? maybe just use this.patientControl.value to send to back (remove from html)
    this.selectedInsurance = insuranceId;
  }

  /**** Filter Section *******/

  //Specialties
  /**
   * Filters the specialties based on the value changes of the specialty control.
   * @author Alvaro Olguin
   * @returns {void}
   */
  filterSpecialties(): void {
    this.filteredSpecialties = this.specialtyControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : value ? value.name : ''
      ),
      map((name) =>
        name ? this.filterSpecialtiesByName(name) : this.specialties.slice()
      )
    );
  }

  /**
   * Filters the specialties by name.
   * @param name The name to filter by.
   * @author Alvaro Olguin
   * @returns {Medicalspeciality[]} The filtered specialties.
   */
  filterSpecialtiesByName(name: string): Medicalspeciality[] {
    if (name) {
      const filterValue = name.toLowerCase();
      return this.specialties.filter((specialty) =>
        specialty.name.toLowerCase().includes(filterValue)
      );
    } else {
      return this.specialties;
    }
  }

  // Doctors
  /**
   * Loads the doctors filtered by specialty.
   * @param specialtyId The specialty to filter by.
   * @author Alvaro Olguin
   * @returns {void}
   */
  loadfilteredDoctors(specialtyId: number): void {
    this.specialtyFilteredDoctors =
      this.specialtyFilterService.filterDoctorsBySpecialtyName(
        this.doctors,
        this.getSpecialtyName(specialtyId)
      );
  }

  /**
   * Filters the doctors based on the value changes of the doctor control.
   * @author Alvaro Olguin
   * @returns {void}
   */
  filterDoctors(): void {
    let doctorsArray = this.specialtyFilteredDoctors;
    if (!this.selectedSpecialty) {
      doctorsArray = this.doctors;
    }
    this.filteredDoctors = this.doctorControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : value ? value.name : ''
      ),
      map((name) => {
        if (name) {
          return this.filterDoctorsBySpecialty(name, doctorsArray);
        } else {
          return doctorsArray;
        }
      })
    );
  }

  /**
   * Filters the doctors by specialty.
   * @param name The specialty to filter by.
   * @author Alvaro Olguin
   * @returns {DoctorProfile[]} The filtered doctors.
   */
  filterDoctorsBySpecialty(
    name: string,
    doctors: DoctorProfile[]
  ): DoctorProfile[] {
    const filterValue = name.toLowerCase();
    return doctors.filter((option) =>
      option.user.toString().toLowerCase().includes(filterValue)
    );
  }

  // Branches
  /**
   * Loads the branches filtered by specialty.
   * @param specialtyId The specialty to filter by.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in loading the branches.
   * @returns {void}
   */
  loadfilteredBranches(specialtyId: number): void {
    this.specialtyFilteredBranches =
      this.specialtyFilterService.filterBranchesBySpecialtyName(
        this.branches,
        this.getSpecialtyName(specialtyId)
      );
  }

  //Patients
  /**
   * Filters the patients based on the value changes of the patient control.
   * @author Alvaro Olguin
   * @returns {void}
   */
  filterPatients(): void {
    this.filteredPatients = this.patientControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : value ? value.name : ''
      ),
      map((name) =>
        name ? this.filterPatientsByName(name) : this.patients.slice()
      )
    );
  }

  /**
   * Filters the patients by name.
   * @param name The name to filter by.
   * @author Alvaro Olguin
   * @returns {Patient[]} The filtered patients.
   */
  filterPatientsByName(name: string): Patient[] {
    if (name) {
      const filterValue = name.toLowerCase();
      return this.patients.filter((patient) =>
        patient.user.toString().toLowerCase().includes(filterValue)
      );
    } else {
      return this.patients;
    }
  }

  //Insurances
  /**
   * Filters the insurances based on the value changes of the patient control.
   * @author Alvaro Olguin
   * @returns {void}
   */
  filterInsurances(): void {
    this.filteredInsurances = this.insuranceControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : value ? value.name : ''
      ),
      map((name) =>
        name ? this.filterInsurancesByName(name) : this.insurances.slice()
      )
    );
  }

  /**
   * Filters the insurances by name.
   * @param name The name to filter by.
   * @author Alvaro Olguin
   * @returns {HealthInsurance[]} The filtered patients.
   */
  filterInsurancesByName(name: string): HealthInsurance[] {
    if (name) {
      const filterValue = name.toLowerCase();
      return this.insurances.filter((insurance) =>
        insurance.name.toLowerCase().includes(filterValue)
      );
    } else {
      return this.insurances;
    }
  }

  /***** Display Section *****/
  /**
   * Displays the specialty's name for a given specialty id.
   * @param specialtyName The specialty's name.
   * @author Alvaro Olguin
   * @returns {any} The specialty's name.
   */
  displaySpecialtyFn = (specialtyId: number): any => {
    if (this.specialties !== undefined) {
      let specialty = this.specialties.find(
        (specialty) => specialty.id === specialtyId
      );
      this.specialtytName = specialty ? specialty.name : '';
      return this.specialtytName;
    }
  };

  /**
   * Displays the doctor's name for a given doctor ID.
   * @param doctorId The doctor's ID.
   * @author Alvaro Olguin
   * @returns {any} The doctor's name.
   */

  displayDoctorFn(doctor: DoctorProfile): string {
    return doctor ? doctor.user.toString() : '';
  }

  /**
   * Displays the patient's name for a given patient ID.
   * @param patientId The patient's ID.
   * @author Alvaro Olguin
   * @returns {any} The patient's name.
   */
  displayPatientFn = (patientId: number): any => {
    if (this.patients !== undefined) {
      let patient = this.patients.find((patient) => patient.id === patientId);
      this.patientName = patient ? patient.user.toString() : '';
      return this.patientName;
    }
  };

  /**
   * Displays the patient's name for a given patient ID.
   * @param patientId The patient's ID.
   * @author Alvaro Olguin
   * @returns {any} The patient's name.
   */
  displayInsuranceFn = (insuranceId: number): any => {
    if (this.insurances !== undefined) {
      let insurance = this.insurances.find(
        (insurance) => insurance.id === insuranceId
      );
      this.insuranceName = insurance ? insurance.name : '';
      return this.insuranceName;
    }
  };

  /***** Utils *****/

  /**
   * Returns the name of a doctor based on their ID, or 'Sin Solicitar'
   * @param {number | 'Sin Solicitar'} doctorId - The `doctorId` parameter can be either a number or
   * the string 'Sin Solicitar'.
   * @returns string.
   */
  getDoctorName(doctorId: number | 'Sin Solicitar'): string {
    if (doctorId === 'Sin Solicitar') {
      return doctorId;
    } else {
      const doctor = this.doctors.find((d) => d.id === doctorId);
      return doctor ? doctor.user.toString() : 'Sin Solicitar';
    }
  }

  /**
   * Takes a specialty ID as input and returns the corresponding
   * specialty name, or 'Sin Solicitar' if no specialty is found.
   * @param {number} specialtyId - The ID of a specialty.
   * @returns the name of the specialty corresponding to the given specialtyId. Otherwise'Sin Solicitar'.
   */
  getSpecialtyName(specialtyId: number): string {
    const specialty = this.specialties.find((s) => s.id === specialtyId);
    return specialty ? specialty.name : 'Sin Solicitar';
  }

  /**
   * Returns the name of a branch based on its ID, or 'Sin Solicitar' if the
   * branch is not found.
   * @param {number} branchId - the unique identifier of a branch.
   * @returns {string} The branch name.
   */
  getBranchName(branchId: number): string {
    const branch = this.branches.find((b) => b.id === branchId);
    return branch ? branch.name : 'Sin Solicitar';
  }

  /**
   * Resets the form based on the provided options.
   * @param form The form to reset.
   * @param options The options for resetting the form.
   * @author Alvaro Olguin
   * @returns {void}
   */
  resetForm(
    form: FormGroup,
    options?: { specialty?: boolean; doctor?: boolean; branch?: boolean }
  ): void {
    if (options && options.specialty) {
      this.specialtyControl.setValue(null);
    }

    if (options && options.doctor) {
      this.doctorControl.setValue(null);
      this.filteredDoctors = of([]);
      form.patchValue({
        doctor: null,
      });
      this.selectedDoctor = 0;
    }

    if (options && options.branch) {
      form.patchValue({
        branch: null,
      });
    }
  }

  /***** FORM ACTIONS SECTION *****/

  /**
   * Handles the form submission. Validates the form, confirms the appointment details with the user, and creates the appointment.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in validating the form, confirming the appointment, or creating the appointment.
   * @returns {void}
   */
  onSubmit(): void {
    if (this.reportForm.valid) {
      // Get form values
      const formValues = this.reportForm.value;

      const filteredBody: ReportAppAdminPostInterface = {
        start_date: formValues.start_date,
        end_date: formValues.end_date,
      };

      if (this.selectedDoctor) {
        filteredBody.doctor = this.selectedDoctor;
      }

      if (this.selectedPatient) {
        filteredBody.patient = this.selectedPatient;
      }

      if (this.selectedInsurance) {
        filteredBody.health_insurance = this.selectedInsurance;
      }

      if (this.selectedSpecialty) {
        filteredBody.specialty = this.selectedSpecialty;
      }

      if (formValues.branch !== undefined && formValues.branch !== null) {
        filteredBody.branch = formValues.branch;
      }

      if (
        formValues.payment_method !== undefined &&
        formValues.payment_method !== null
      ) {
        filteredBody.payment_method = formValues.payment_method;
      }
      //console.log('BODY: ', filteredBody);
      this.reportService
        .getAdminAppointmentReport(filteredBody)
        .pipe(
          catchError((error) => {
            console.error('Error en la solicitud:', error);

            // Checks for specific error on "non_field_errors"
            if (error.error && error.error.non_field_errors) {
              // Get and display the error
              const errorMessage = error.error.non_field_errors[0];
              this.dialogService.showErrorDialog('Error: ' + errorMessage);
              this.reportData = {
                summary: {
                  doctor: 0,
                  specialty: 0,
                  branch: 0,
                  payment_method: 0,
                  num_patients: 0,
                  num_doctors: 0,
                  num_particular_insurances: 0,
                  num_other_insurances: 0,
                  num_appointments: 0,
                  total_patient_copayment: 0,
                  total_hi_copayment: 0,
                },
                appointments: [],
              };
            } else {
              // Generic error
              this.dialogService.showErrorDialog(
                'Ha ocurrido un error en la solicitud.'
              );
              this.reportData = {
                summary: {
                  doctor: 0,
                  specialty: 0,
                  branch: 0,
                  payment_method: 0,
                  num_patients: 0,
                  num_doctors: 0,
                  num_particular_insurances: 0,
                  num_other_insurances: 0,
                  num_appointments: 0,
                  total_patient_copayment: 0,
                  total_hi_copayment: 0,
                },
                appointments: [],
              };
            }

            throw error;
          })
        )
        .subscribe((data: ReportAppAdminResponseInterface) => {
          this.reportData = data;
          //console.log(data);
          this.dialogService
            .showSuccessDialog(
              `Reporte generado con éxito! <br> se redireccionará a la pantalla de resultados`
            )
            .afterClosed()
            .subscribe(() => {
              this.router.navigate(
                ['/Dashboard/reports/copayment/appointment/admin/list-detail'],
                {
                  state: { report: this.reportData },
                }
              );
            });
        });
    } else {
      this.dialogService.showErrorDialog(
        'Ingrese un rango de fechas para poder generar un reporte'
      );
    }
  }

  /**
   * Handles the cancellation of the report creation.
   *
   * @method
   */
  onCancel() {
    this.router.navigate(['/Dashboard/']);
  }
}
