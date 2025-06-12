import { Component, OnInit } from '@angular/core';
import {
  Observable,
  catchError,
  firstValueFrom,
  map,
  of,
  startWith,
  tap,
} from 'rxjs';
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
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';
import { PaymentMethod } from 'src/app/Models/appointments/paymentmethod.interface';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { ReportAppDoctorResponseInterface } from 'src/app/Models/reports/reportAppDoctorResponse.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-reports',
  templateUrl: './doctor-reports.component.html',
  styleUrls: ['./doctor-reports.component.css'],
})
export class DoctorReportsComponent implements OnInit {
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
  // Selections
  selectedSpecialty: number = 0;
  selectedDoctor: number = 0;
  // Form COntrols
  specialtyControl = new FormControl({ value: 0, disabled: true });
  doctorControl = new FormControl({
    value: null as DoctorProfile | null,
    disabled: true,
  });
  patientControl = new FormControl();
  insuranceControl = new FormControl();
  // Observables to reactive filter
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
    private doctorService: DoctorprofileService,
    private patientService: PatientService,
    private paymentmethodservice: PaymentmethodService,
    private dialogService: DialogService,
    private router: Router
  ) {
    // Form
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

  /**
   * Initializes the component.
   * @author Alvaro Olguin
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   */
  async ngOnInit(): Promise<void> {
    await Promise.all([
      firstValueFrom(this.loadPatients()),
      firstValueFrom(this.loadPaymentMethods()),
    ]).then(() => {
      this.initForm();
    });
  }

  /***** INIT DATA SECTION *****/

  /**
   * Initializes the form with the given doctor data.
   * @author Alvaro Olguin
   */
  initForm(): void {
    this.doctorService
      .getMyDoctorReportProfile()
      .subscribe((data: ReportAppDoctorResponseInterface) => {
        // Specialty
        if (data.specialty.id) {
          this.specialties.push(data.specialty);
          this.specialtyControl.patchValue(data.specialty.id);
          this.selectedSpecialty = data.specialty.id;
        }

        // Branches
        this.branches = data.branches;

        // Doctor
        this.doctors.push(data.doctor);
        this.doctorControl.patchValue(data.doctor);
        this.selectedDoctor = data.doctor.id;

        // Insurances
        this.insurances = data.insurances;
        this.filterInsurances();
      });
  }

  /**
   * Loads the patients from the service.
   * @author Alvaro Olguin
   * @returns {Observable<Patient[]>} An observable of the patients.
   */
  loadPatients(): Observable<Patient[]> {
    return this.patientService.getAllPatients().pipe(
      tap((data) => {
        // Sort the patients
        data.sort((a, b) => a.user.toString().localeCompare(b.user.toString()));
        this.patients = data;
        this.filterPatients();
      })
    );
  }

  /**
   * Loads the payment methods from the service.
   * @author Alvaro Olguin
   * @returns {Observable<PaymentMethod[]>} An observable of the payment methods.
   */
  loadPaymentMethods(): Observable<PaymentMethod[]> {
    return this.paymentmethodservice.getPaymentMethods().pipe(
      tap((data) => {
        //Sort
        data.sort((a, b) => a.name.localeCompare(b.name));
        this.methods = data;
      })
    );
  }

  /**** Filter Section *******/

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

  getDoctorName(doctorId: number | 'Sin Solicitar'): string {
    if (doctorId === 'Sin Solicitar') {
      return doctorId; // Si es "Sin Solicitar", simplemente devolvemos esa cadena.
    } else {
      // Aquí asumimos que doctorId es de tipo number.
      const doctor = this.doctors.find((d) => d.id === doctorId);
      return doctor ? doctor.user.toString() : 'Sin Solicitar';
    }
  }

  getSpecialtyName(specialtyId: number): string {
    const specialty = this.specialties.find((s) => s.id === specialtyId);
    return specialty ? specialty.name : 'Sin Solicitar';
  }

  getBranchName(branchId: number): string {
    const branch = this.branches.find((b) => b.id === branchId);
    return branch ? branch.name : 'Sin Solicitar';
  }

  /***** FORM ACTIONS SECTION *****/

  /**
   * Handles the form submission. Validates the form, confirms the report details with the user, and generates the report.
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

      if (this.patientControl.value) {
        filteredBody.patient = this.patientControl.value;
      }

      if (this.insuranceControl.value) {
        filteredBody.health_insurance = this.insuranceControl.value;
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
                ['/Dashboard/reports/copayment/appointment/doctor/list-detail'],
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
