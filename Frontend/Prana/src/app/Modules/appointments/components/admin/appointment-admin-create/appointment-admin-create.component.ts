import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { SpecialityBranch } from 'src/app/Models/Profile/branch.interface';
import { DoctorProfile } from 'src/app/Models/Profile/doctorprofile.interface';
import { DoctorScheduleInterface } from 'src/app/Models/Profile/doctorschedule.interface';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { Medicalspeciality } from 'src/app/Models/Profile/medicalspeciality.interface';
import { Patient } from 'src/app/Models/Profile/patient.interface';
import { AppointmentAdminGetInterface } from 'src/app/Models/appointments/appointmentAdmin.interface';
import { AppointmentAdminCreateInterface } from 'src/app/Models/appointments/create-interfaces/appointmentAdminCreate.interface';
import { PaymentMethod } from 'src/app/Models/appointments/paymentmethod.interface';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { DoctorprofileService } from 'src/app/Services/Profile/doctorprofile/doctorprofile.service';
import { DoctorscheduleService } from 'src/app/Services/Profile/doctorschedule/doctorschedule.service';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { SpecialtyFilterService } from 'src/app/Services/Profile/speciality/specialty-filter/specialty-filter.service';
import { AppointmentService } from 'src/app/Services/appointments/appointment.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';

@Component({
  selector: 'app-appointment-create',
  templateUrl: './appointment-admin-create.component.html',
  styleUrls: ['./appointment-admin-create.component.css'],
})
export class AppointmentAdminCreateComponent implements OnInit {
  // Form
  appointmentForm: FormGroup;
  // Response data
  appointmentResponse: AppointmentAdminGetInterface;
  // Data
  patients: Patient[] = [];
  doctors: DoctorProfile[] = [];
  specialties: Medicalspeciality[] = [];
  methods: PaymentMethod[] = [];
  insurances: HealthInsurance[] = [];
  // Filtered Data
  doctorSchedule: DoctorScheduleInterface[] = [];
  specialtyFilteredDoctors: DoctorProfile[] = [];
  specialtyFilteredBranches: SpecialityBranch[] = [];
  //Selections
  selectedSpecialty: number = 0;
  selectedBranch: number = 0;
  selectedPatient: number = 0;
  selectedDoctor: number = 0;
  // Auxiliar Variables
  isPaid: boolean | null = null;
  formattedDates: string[] = [];
  availableTimes: string[] = [];
  finalJsonDate: string = '';
  finalJsonHour: string = '';
  appointment_type_choices = [
    { value: 1, viewValue: 'Presencial' },
    { value: 2, viewValue: 'Virtual' },
  ];
  appointment_status_choices = [
    { value: 1, viewValue: 'Pendiente' },
    { value: 2, viewValue: 'Confirmado' },
    { value: 3, viewValue: 'Finalizado' },
  ];
  payment_status_choices = [
    { value: 1, viewValue: 'Adeuda' },
    { value: 2, viewValue: 'Pagado' },
  ];
  //FormControls
  doctorControl = new FormControl();
  patientControl = new FormControl();
  specialtyControl = new FormControl();
  // Observables to reactive filter
  filteredSpecialties: Observable<Medicalspeciality[]> = of([]);
  filteredDoctors: Observable<DoctorProfile[]> = of([]);
  filteredPatients: Observable<Patient[]> = of([]);
  // Preview Variables
  patientName: string = '';
  doctorName: string = '';
  specialtytName: string = '';
  branchName: string = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorprofileService,
    private branchService: BranchService,
    private specialtyService: SpecialityService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private paymentmethodservice: PaymentmethodService,
    private insuranceService: HealthinsuranceService,
    private specialtyFilterService: SpecialtyFilterService,
    private doctorScheduleService: DoctorscheduleService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      day: ['', Validators.required],
      hour: ['', Validators.required],
      doctor: [null, Validators.required],
      patient: [null, Validators.required],
      duration: [null],
      specialty: [null, Validators.required],
      branch: [null],
      appointment_type: [null],
      appointment_status: [null],
      payment_status: [null],
      payment_method: [null],
      full_cost: [null, [Validators.min(0)]],
      health_insurance: [null],
      patient_copayment: [null, [Validators.min(0)]],
    });
    this.appointmentResponse = {
      id: 0,
      day: new Date(),
      hour: '',
      patient: 0,
      doctor: 0,
      payment_method: 0,
      full_cost: 0,
      hi_copayment: 0,
      patient_copayment: 0,
      specialty: 0,
      branch: 0,
      health_insurance: 0,
      duration: '',
      appointment_type: 0,
      appointment_status: 0,
      payment_status: 0,
    };
  }

  /**
   * Initializes the component.
   * @author Alvaro Olguin
   */
  ngOnInit(): void {
    this.loadDoctors();
    this.loadSpecialties();
    this.loadPatients();
    this.loadPaymentMethods();
  }

  /***** INIT DATA SECTION *****/

  /**
   * Fetches a list of doctors from the doctor service, sorts them alphabetically by user,
   * and assigns them to the 'doctors' property.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching or sorting the data.
   * @returns {void}
   */
  loadDoctors(): void {
    this.doctorService.getDoctors().subscribe((data) => {
      // Filter active doctors and sort them
      let activeDoctors = data.filter((doctor) => doctor.is_active);
      activeDoctors.sort((a, b) =>
        a.user.toString().localeCompare(b.user.toString())
      );
      this.doctors = activeDoctors;
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
      // Filter active specialties and sort them
      let activeSpecialties = data.filter((specialty) => specialty.is_active);
      activeSpecialties.sort((a, b) => a.name.localeCompare(b.name));
      this.specialties = activeSpecialties;
      this.filterSpecialties();
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
      // Filter active patients and sort them
      let activePatients = data.filter((patient) => patient.is_active);
      activePatients.sort((a, b) =>
        a.user.toString().localeCompare(b.user.toString())
      );
      this.patients = activePatients;
      this.filterPatients();
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

  /***** ON SELECT SECTION *****/

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
      this.resetForm(this.appointmentForm, {
        doctor: true,
        day: true,
        branch: true,
      });
      this.loadfilteredDoctors(this.selectedSpecialty);
      this.filterDoctors();
    } else {
      //Reset doctor, and in consecuence day and hour
      this.resetForm(this.appointmentForm, {
        doctor: true,
        day: true,
        branch: true,
      });
    }
  }

  /**
   * Handles the event when a doctor is selected.
   * Resets the form and loads the schedule for the selected doctor.
   * @param doctorId The selected doctor's ID.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in resetting the form or loading the doctor's schedule.
   * @returns {void}
   */
  onDoctorSelect(doctorId: number): void {
    this.selectedDoctor = doctorId;
    if (this.selectedDoctor !== null) {
      this.resetForm(this.appointmentForm, { day: true, branch: true });
      this.doctorScheduleService
        .getDoctorSchedule(doctorId)
        .subscribe((data) => {
          this.doctorSchedule = data;
          this.formattedDates = this.formatDates(this.doctorSchedule);
          // reloads the branches of the new doctor
          this.loadfilteredBranches(doctorId);
        });
    } else {
      //Reset fields
      this.resetForm(this.appointmentForm, { day: true, branch: true });
    }
  }

  /**
   * Handles the event when a day is selected.
   * Resets the form and loads the available times for the selected day.
   * @param day The selected day.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in resetting the form or loading the available times.
   * @returns {void}
   */
  onDaySelect(day: string): void {
    // Works good, but i want to review why i have to compare so many values
    if (
      this.selectedDoctor !== null &&
      day !== '' &&
      day !== null &&
      day !== undefined
    ) {
      // If a modification is maded on day, reset de hour
      this.resetForm(this.appointmentForm, { hour: true });
      // Parse de day
      this.finalJsonDate = this.parseDateStringToDate(day);
      this.doctorScheduleService
        .getDoctorAvailableTime(this.selectedDoctor, this.finalJsonDate)
        .subscribe((data) => {
          this.availableTimes = data.available_times;
        });
    }
    //If no day selected ('Sin Solicitar') reset the hour field
    else {
      this.resetForm(this.appointmentForm, { hour: true });
    }
  }

  /**
   * Handles the event when an hour is selected. Sets the final appointment hour.
   * @param hour The selected hour.
   * @author Alvaro Olguin
   * @returns {void}
   */
  onHourSelect(hour: string): void {
    if (hour !== '' && hour !== undefined) {
      this.finalJsonHour = this.getStartAppointmentHour(hour);
    } else {
      this.finalJsonHour = '';
    }
  }

  /**
   * Handles the event when a patient is selected.
   * Resets the form and loads the common insurances for the selected patient.
   * @param patientId The selected patient's ID.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in resetting the form or loading the common insurances.
   * @returns {void}
   */
  onPatientSelect(patientId: number): void {
    // Save the patient to calculate common insurances
    this.selectedPatient = patientId;
    if (!this.selectedPatient) {
      // reset all
      this.resetForm(this.appointmentForm, { specialty: true });
    } else if (this.selectedDoctor && this.selectedBranch) {
      // Reset hi, and status
      this.resetForm(this.appointmentForm, { hi: true });
      // So far, patient isn't null, and we check that doctor and branch have a value
      // Recalculate common insurances value
      this.loadCommonInsurances(
        this.selectedDoctor,
        this.selectedPatient,
        this.selectedBranch
      );
    }
  }

  /**
   * Handles the event when a branch is selected. Loads the common insurances for the selected branch.
   * @param branchId The selected branch's ID.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in loading the common insurances.
   * @returns {void}
   */

  onBranchSelect(branchId: number): void {
    // Save the BRANCH to calculate common insurances
    this.selectedBranch = branchId;
    let branch = this.specialtyFilteredBranches.find(
      (branch) => branch.id === branchId
    );
    // its neccesary to reset full_cost, status and health insurances fields, since on branch selection could change the cost of the appointment
    this.resetForm(this.appointmentForm, { hi: true });
    if (branch) {
      this.branchName = branch.name;
    }
    // It is guaranteed that patient and doctor have values, no need to conditional
    this.loadCommonInsurances(
      this.selectedDoctor,
      this.selectedPatient,
      this.selectedBranch
    );
  }

  /**
   * Updates the visibility of the payment method based on the selected value.
   * @param selectedValue The selected value.
   * @author Alvaro Olguin
   * @returns {void}
   */
  updatePaymentVisibility(selectedValue: number | null): void {
    this.isPaid = selectedValue === 2;
    if (!this.isPaid) {
      this.appointmentForm.patchValue({
        payment_method: null,
      });
    }
  }

  /***** FILTER SECTION *****/

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

  // Doctors
  /**
   * Loads the doctors filtered by specialty.
   * @param specialtyId The specialty to filter by.
   * @author Alvaro Olguin
   * @returns {void}
   */
  loadfilteredDoctors(specialtyId: number): void {
    this.specialtyFilteredDoctors =
      this.specialtyFilterService.filterDoctorsBySpecialty(
        this.doctors,
        specialtyId
      );
  }

  /**
   * Filters the doctors based on the value changes of the doctor control.
   * @author Alvaro Olguin
   * @returns {void}
   */
  filterDoctors(): void {
    this.filteredDoctors = this.doctorControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        typeof value === 'string' ? value : value ? value.name : ''
      ),
      map((name) =>
        name
          ? this.filterDoctorsBySpecialty(name)
          : this.specialtyFilteredDoctors.slice()
      )
    );
  }

  /**
   * Filters the doctors by specialty.
   * @param name The specialty to filter by.
   * @author Alvaro Olguin
   * @returns {DoctorProfile[]} The filtered doctors.
   */
  filterDoctorsBySpecialty(name: string): DoctorProfile[] {
    if (name) {
      const filterValue = name.toLowerCase();
      return this.specialtyFilteredDoctors.filter((option) =>
        option.user.toString().toLowerCase().includes(filterValue)
      );
    } else {
      return this.specialtyFilteredDoctors;
    }
  }

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
      const isSpecialtyName = this.specialties.some(
        (specialty) => specialty.name.toLowerCase() === filterValue
      );
      if (isSpecialtyName) {
        return this.specialties;
      } else {
        return this.specialties.filter((option) =>
          option.name.toString().toLowerCase().includes(filterValue)
        );
      }
    } else {
      return this.specialties;
    }
  }

  // Branches
  /**
   * Loads the branches filtered by doctor.
   * @param doctorId The doctor to filter by.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in loading the branches.
   * @returns {void}
   */
  loadfilteredBranches(doctorId: number): void {
    this.branchService.getDoctorBranches(doctorId).subscribe((data) => {
      // Filter active branches
      this.specialtyFilteredBranches = data.filter(
        (branch) => branch.is_active
      );
      if (this.specialtyFilteredBranches.length > 0) {
        let generalBranch = this.specialtyFilteredBranches.find(
          (branch) => branch.name.toUpperCase() === 'GENERAL'
        );
        // Exists the general branch, the id property its only for interface validation (id?)
        if (generalBranch && generalBranch.id) {
          this.selectedBranch = generalBranch.id;
        } else {
          this.selectedBranch = 0;
        }
      } else {
        this.selectedBranch = 0;
      }
      this.appointmentForm.patchValue({
        branch: this.selectedBranch,
      });
      this.loadCommonInsurances(
        doctorId,
        this.selectedPatient,
        this.selectedBranch
      );
    });
  }

  // Insurances
  /**
   * Loads the common insurances for the given doctor, patient, and branch.
   * @param doctorId The doctor's ID.
   * @param patientId The patient's ID.
   * @param branchId The branch's ID.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in loading the common insurances.
   * @returns {void}
   */
  loadCommonInsurances(
    doctorId: number,
    patientId: number,
    branchId: number
  ): void {
    this.insuranceService
      .getDoctorPatientCommonHI(doctorId, patientId, branchId)
      .subscribe((data) => {
        //Sort
        data.sort((a, b) => a.name.localeCompare(b.name));
        this.insurances = data;
      });
  }

  /***** UTILS SECTION *****/

  /**
   * Formats the dates of the doctor's schedule.
   * @param doctorSchedule The doctor's schedule.
   * @author Alvaro Olguin
   * @returns {string[]} The formatted dates.
   */
  formatDates(doctorSchedule: any): string[] {
    const daysOfWeekSpanish = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    const monthsSpanish = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const formattedDates: string[] = [];
    const today = new Date();

    // Loops over the current month and the next one
    for (let m = 0; m < 2; m++) {
      const currentDate = new Date();
      currentDate.setDate(1);
      currentDate.setMonth(currentDate.getMonth() + m);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      for (let i = 0; i < daysInMonth; i++) {
        const date = new Date(year, month, i + 1); // Create a new date for every day

        // Continue if the date is older than today
        if (date < today && date.toDateString() !== today.toDateString()) {
          continue;
        }

        const dayOfWeek = daysOfWeekSpanish[date.getDay()];
        const dayOfMonth = date.getDate();
        const monthName = monthsSpanish[month];

        const formattedDate = `${dayOfWeek} ${dayOfMonth} de ${monthName} de ${year}`; // Agrega el año aquí

        // Format day (mon, tue, wed...)
        const englishShortDay = date
          .toDateString()
          .toLocaleLowerCase()
          .slice(0, 3);
        // Find the actual day on the doctor schedule
        const matchingDay = doctorSchedule.find(
          (day: DoctorScheduleInterface) => day.day === englishShortDay
        );
        if (matchingDay) {
          // If match with the schedule, add the date
          formattedDates.push(`${formattedDate}`);
        }
      }
    }

    return formattedDates;
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
    options?: {
      specialty?: boolean;
      doctor?: boolean;
      day?: boolean;
      hour?: boolean;
      branch?: boolean;
      hi?: boolean;
    }
  ): void {
    if (options && options.specialty) {
      this.specialtyControl.setValue(0);
    }

    if (options && options.doctor) {
      this.doctorControl.setValue(null);
    }

    if (options && options.day) {
      form.patchValue({
        day: '',
      });
      this.formattedDates = [];
      this.finalJsonDate = '';
    }

    if (options && options.hour) {
      form.patchValue({
        hour: '',
      });
      this.availableTimes = [];
      this.finalJsonHour = '';
    }

    if (options && options.branch) {
      form.patchValue({
        branch: 0,
      });
    }

    if (options && options.hi) {
      form.patchValue({
        health_insurance: null,
      });
    }

    // Reset the remaining fields
    form.patchValue({
      appointment_status: null,
      payment_status: null,
      payment_method: null,
      appointment_type: null,
      full_cost: null,
      patient_copayment: null,
    });
  }

  /**
   * Validates the form and alerts the user if any field is empty.
   * @author Alvaro Olguin
   * @returns {boolean} Whether the form is valid or not.
   */
  validateForm(): boolean {
    let dayControl = this.appointmentForm.get('day');
    let hourControl = this.appointmentForm.get('hour');
    if (!this.patientControl.value) {
      this.dialogService.showErrorDialog(
        'El campo "Paciente "no puede ser vacío, por favor, asigne un valor'
      );
      return false;
    }

    if (!this.specialtyControl.value) {
      this.dialogService.showErrorDialog(
        'El campo "Especialidad "no puede ser vacío, por favor, asigne un valor'
      );
      return false;
    }

    if (!this.doctorControl.value) {
      this.dialogService.showErrorDialog(
        'El campo "Profesional "no puede ser vacío, por favor, asigne un valor'
      );
      return false;
    }

    if (!dayControl || !dayControl.value) {
      this.dialogService.showErrorDialog(
        'El campo "Día "no puede ser vacío, por favor, asigne un valor'
      );
      return false;
    }

    if (!hourControl || !hourControl.value) {
      this.dialogService.showErrorDialog(
        'El campo "Hora "no puede ser vacío, por favor, asigne un valor'
      );
      return false;
    }

    return true;
  }

  /**
   * Parses a date string to a date.
   * @param dateString The date string to parse.
   * @author Alvaro Olguin
   * @throws {Error} If the date string is incorrectly formatted.
   * @returns {string} The parsed date.
   */
  parseDateStringToDate(dateString: string): string {
    // Get words in string
    const words = dateString.split(' ');

    if (words.length < 6) {
      throw new Error(
        'Cadena de fecha incorrecta. Debe tener el formato "Día número de Mes de Año".'
      );
    }

    const months: { [key: string]: string } = {
      Enero: '01',
      Febrero: '02',
      Marzo: '03',
      Abril: '04',
      Mayo: '05',
      Junio: '06',
      Julio: '07',
      Agosto: '08',
      Septiembre: '09',
      Octubre: '10',
      Noviembre: '11',
      Diciembre: '12',
    };

    // Get number, month and year
    const number = words[1];
    const month = words[3];
    const year = words[5];

    // Parse month
    const monthNumber = months[month];

    // Parse date
    const formattedDate = `${year}-${monthNumber}-${number}`;

    return formattedDate;
  }

  /**
   * Gets the start hour of an appointment from a range.
   * @param range The range to get the start hour from.
   * @author Alvaro Olguin
   * @throws {Error} If the range is incorrectly formatted.
   * @returns {string} The start hour of the appointment.
   */
  getStartAppointmentHour(range: string): string {
    const parts = range.split('-');
    if (parts.length !== 2) {
      throw new Error(
        'Datos de entrada incorrectos al querer formatear el horario del turno '
      );
    } else {
      return parts[0].trim();
    }
  }

  /***** DISPLAY SECTION *****/

  /**
   * Displays the doctor's name for a given doctor ID.
   * @param doctorId The doctor's ID.
   * @author Alvaro Olguin
   * @returns {any} The doctor's name.
   */
  displayDoctorFn = (doctorId: number): any => {
    if (this.specialtyFilteredDoctors !== undefined) {
      let doctor = this.specialtyFilteredDoctors.find(
        (doctor) => doctor.id === doctorId
      );
      this.doctorName = doctor ? doctor.user.toString() : '';
      return this.doctorName;
    }
  };

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
   * Displays the specialty's name for a given specialty name.
   * @param specialtyName The specialty's name.
   * @author Alvaro Olguin
   * @returns {any} The specialty's name.
   */
  displaySpecialtyFn = (specialtyName: string): any => {
    if (this.specialties !== undefined) {
      let specialty = this.specialties.find(
        (specialty) => specialty.name === specialtyName
      );
      this.specialtytName = specialty ? specialty.name : '';
      return this.specialtytName;
    }
  };

  /***** TEMPORAL UNTIL MODAL CREATION *****/

  /**
   * Displays a preview of the appointment.
   * @author Alvaro Olguin
   * @returns {string} The appointment preview.
   */
  displayPreviewAppointment(): string {
    let preview = `Desea confirmar el turno con los siguientes datos?: <br>
    <strong>Paciente:</strong> ${this.patientName} <br>
    <strong>Profesional:</strong> ${this.doctorName} <br>
    <strong>Día:</strong> ${this.appointmentForm.get('day')?.value} <br>
    <strong>Hora:</strong> ${this.appointmentForm.get('hour')?.value} <br>
    <strong>Especialidad:</strong> ${this.specialtytName} <br>
    <strong>Rama:</strong> ${this.branchName} <br>
    <strong>Obra Social:</strong> ${this.findFormHi()} <br>
    <strong>Tipo de Encuentro:</strong> ${this.findFormAppointmentType()} <br>
    <strong>Estado del Turno:</strong> ${this.findFormAppointmentStatus()} <br>
    <strong>Estado del Pago:</strong> ${this.findFormPaymentStatus()} <br>
    <strong>Costo:</strong> ${this.findFormFullCost()} <br>
    <strong>Coseguro Paciente:</strong> ${this.findFormPatientCopayment()} <br>
    <strong>Método de Pago:</strong> ${this.findFormPaymentMethod()} <br>`;
    return preview;
  }

  /**
   * Finds the health insurance from the form.
   * @author Alvaro Olguin
   * @returns {string} The health insurance name or 'Sin Especificar' if not found.
   */
  findFormHi(): string {
    const formHI = this.appointmentForm.get('health_insurance')?.value;
    if (formHI) {
      const hi = this.insurances.find((insurance) => insurance.id === formHI);
      return hi ? hi.name : 'Sin Especificar';
    }
    return 'Sin Especificar';
  }

  /**
   * Finds the appointment type from the form.
   * @author Alvaro Olguin
   * @returns {string} The appointment status view value or 'Presencial' if not found.
   */
  findFormAppointmentType(): string {
    const formAppointmentType =
      this.appointmentForm.get('appointment_type')?.value;
    if (formAppointmentType) {
      const app_type = this.appointment_type_choices.find(
        (app_type) => app_type.value === formAppointmentType
      );
      return app_type ? app_type.viewValue : 'Presencial';
    }
    return 'Presencial';
  }

  /**
   * Finds the appointment status from the form.
   * @author Alvaro Olguin
   * @returns {string} The appointment status view value or 'Pendiente' if not found.
   */
  findFormAppointmentStatus(): string {
    const formAppointmentStatus =
      this.appointmentForm.get('appointment_status')?.value;
    if (formAppointmentStatus) {
      const app_status = this.appointment_status_choices.find(
        (app_status) => app_status.value === formAppointmentStatus
      );
      return app_status ? app_status.viewValue : 'Pendiente';
    }
    return 'Pendiente';
  }

  /**
   * Finds the payment status from the form.
   * @author Alvaro Olguin
   * @returns {string} The payment status view value or 'Pendiente' if not found.
   */
  findFormPaymentStatus(): string {
    const formPaymentStatus = this.appointmentForm.get('payment_status')?.value;
    if (formPaymentStatus) {
      const pay_status = this.payment_status_choices.find(
        (pay_status) => pay_status.value === formPaymentStatus
      );
      return pay_status ? pay_status.viewValue : 'Adeuda';
    }
    return 'Adeuda';
  }

  /**
   * Finds the payment method from the form.
   * @author Alvaro Olguin
   * @returns {string} The payment method name or 'Sin Especificar' if not found.
   */
  findFormPaymentMethod(): string {
    const formPaymentMethod = this.appointmentForm.get('payment_method')?.value;
    if (formPaymentMethod) {
      const method = this.methods.find(
        (method) => method.id === formPaymentMethod
      );
      return method ? method.name : 'Sin Especificar';
    }
    return 'Sin Especificar';
  }

  /**
   * Finds the full cost from the form.
   * @author Alvaro Olguin
   * @returns {string} The full cost or 'Sin especificar' if not found.
   */
  findFormFullCost(): string {
    const formFullCost = this.appointmentForm.get('full_cost')?.value;
    return formFullCost ? formFullCost.toString() : 'Sin especificar';
  }

  /**
   * Finds the patient copayment from the form.
   * @author Alvaro Olguin
   * @returns {string} The value or 'Sin especificar' if not found.
   */
  findFormPatientCopayment(): string {
    const formPatientCopayment =
      this.appointmentForm.get('patient_copayment')?.value;
    return formPatientCopayment
      ? formPatientCopayment.toString()
      : 'Sin especificar';
  }

  /* FORM ACTIONS SECTION */

  /**
   * Handles the form submission. Validates the form, confirms the appointment details with the user, and creates the appointment.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in validating the form, confirming the appointment, or creating the appointment.
   * @returns {void}
   */
  onSubmit(): void {
    if (this.validateForm()) {
      const formValues = this.appointmentForm.value;

      const filteredBody: AppointmentAdminCreateInterface = {
        day: this.finalJsonDate,
        hour: this.finalJsonHour,
        doctor: this.selectedDoctor,
        patient: this.selectedPatient,
      };

      if (formValues.branch !== undefined && formValues.branch !== null) {
        filteredBody.branch = formValues.branch;
      }

      if (
        formValues.payment_method !== undefined &&
        formValues.payment_method !== null
      ) {
        filteredBody.payment_method = formValues.payment_method;
      }

      if (formValues.full_cost !== undefined && formValues.full_cost !== null) {
        filteredBody.full_cost = formValues.full_cost;
      }

      if (
        formValues.patient_copayment !== undefined &&
        formValues.patient_copayment !== null
      ) {
        filteredBody.patient_copayment = formValues.patient_copayment;
      }

      if (formValues.duration !== undefined && formValues.duration !== null) {
        filteredBody.duration = formValues.duration;
      }

      if (
        formValues.appointment_type !== undefined &&
        formValues.appointment_type !== null
      ) {
        filteredBody.appointment_type = formValues.appointment_type;
      }

      if (
        formValues.appointment_status !== undefined &&
        formValues.appointment_status !== null
      ) {
        filteredBody.appointment_status = formValues.appointment_status;
      }

      if (
        formValues.payment_status !== undefined &&
        formValues.payment_status !== null
      ) {
        filteredBody.payment_status = formValues.payment_status;
      }

      if (
        formValues.health_insurance !== undefined &&
        formValues.health_insurance !== null
      ) {
        filteredBody.health_insurance = formValues.health_insurance;
      }
      //console.log('BODY: ', filteredBody);
      const confirmAppointment = this.dialogService.openConfirmDialog(
        `${this.displayPreviewAppointment()}`
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          // Show the loading dialog
          const loadingDialog = this.dialogService.showSuccessDialog(
            'Se está enviando un correo con los datos del turno al paciente, por favor espere...'
          );

          this.appointmentService
            .createAdminAppointment(filteredBody)
            .pipe(
              catchError((error) => {
                console.error('Error en la solicitud:', error);

                loadingDialog.close();
                // Checks "non_field_errors"
                if (error.error && error.error.non_field_errors) {
                  const errorMessage = error.error.non_field_errors[0];
                  this.dialogService.showErrorDialog(
                    'Error al generar el turno: ' + errorMessage
                  );
                } else {
                  // Show a general error
                  this.dialogService.showErrorDialog(
                    'Ha ocurrido un error en la solicitud.'
                  );
                }

                throw error;
              })
            )
            .subscribe((data: AppointmentAdminGetInterface) => {
              this.appointmentResponse = data;

              loadingDialog.close();
              const successDialog = this.dialogService.showSuccessDialog(
                'Turno generado exitosamente'
              );

              successDialog.afterClosed().subscribe(() => {
                const createAnotherAppointment =
                  this.dialogService.openConfirmDialog(
                    '¿Desea generar otro turno?'
                  );
                createAnotherAppointment
                  .afterClosed()
                  .subscribe((confirmResult) => {
                    if (confirmResult) {
                      // reset form or reload?
                      //this.appointmentForm.reset();
                      window.location.reload();
                    } else {
                      // Redirect to apointment list
                      this.router.navigate([
                        'Dashboard/appointments/admin/list',
                      ]);
                    }
                  });
              });
            });
        }
      });
    }
  }

  /**
   * Handles the cancellation of the appointment creation.
   *
   * @method
   */
  onCancel() {
    this.router.navigate(['/Dashboard/appointments/admin/list']);
  }
}
