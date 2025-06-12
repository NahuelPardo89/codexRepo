/**
 * Component for handling the creation of seminar inscriptions in the admin panel.
 *
 * @remarks
 * This component provides a form for creating new seminar inscriptions, allowing selection of patients,
 * setting meeting details, choosing health insurance, and specifying payment information.
 * It also includes the functionality to filter and display relevant data, and handles form submission and cancellation.
 *
 * @export
 * @class SeminarInscriptionAdminCreateComponent
 * @author Alvaro Olguin Armendariz
 */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { HealthInsurance } from 'src/app/Models/Profile/healthinsurance.interface';
import { Patient, PatientView } from 'src/app/Models/Profile/patient.interface';
import { PaymentMethod } from 'src/app/Models/appointments/paymentmethod.interface';
import {
  SeminarInscriptionAdminGetDetailInterface,
  SeminarInscriptionAdminGetFlatInterface,
  SeminarInscriptionAdminPostInterface,
} from 'src/app/Models/seminar-inscription/admin/seminarInscriptionAdminGetDetailInterface.interface';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';
import { SeminarInscriptionService } from 'src/app/Services/seminar/seminar-inscription.service';

@Component({
  selector: 'app-seminar-inscription-admin-update',
  templateUrl: './seminar-inscription-admin-update.component.html',
  styleUrls: ['./seminar-inscription-admin-update.component.css'],
})
export class SeminarInscriptionAdminUpdateComponent {
  // Form
  seminarInscriptionForm: FormGroup;
  // Data
  patients: PatientView[] = [];
  insurances: HealthInsurance[] = [];
  paymentMethods: PaymentMethod[] = [];
  //Formcontrols
  //patientControl = new FormControl();
  // Observables for reactive filter
  filteredPatients: Observable<PatientView[]> = new Observable<PatientView[]>();
  // Auxiliar
  payment_status_choices = [
    { value: 1, viewValue: 'Adeuda' },
    { value: 2, viewValue: 'Pagado' },
  ];

  seminar_status_choices = [
    { value: 1, viewValue: 'EN ESPERA' },
    { value: 2, viewValue: 'CONFIRMADO' },
    { value: 3, viewValue: 'BAJA SOLICITADA' },
    { value: 4, viewValue: 'BAJA CONFIRMADA' },
  ];
  isPaid: boolean | null = null;
  currentInscription: SeminarInscriptionAdminGetDetailInterface =
    history.state.seminarInscription;
  currentSeminar: SeminarAdminInterface = history.state.seminar;
  constructor(
    private fb: FormBuilder,
    private seminarInscriptionService: SeminarInscriptionService,
    private insuranceService: HealthinsuranceService,
    private paymentMethodService: PaymentmethodService,
    private patientService: PatientService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.seminarInscriptionForm = this.fb.group({
      patient: [null, Validators.required],
      seminar_status: [null, Validators.required],
      meetingNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.min(1),
          Validators.max(30),
        ],
      ],
      insurance: [null],
      patient_copayment: [null, [Validators.min(0)]],
      // validator deleted Validators.pattern(/^[0-9]\d*$/),
      hi_copayment: [null, [Validators.min(0)]],
      payment_status: [null, [Validators.required]],
      payment_method: [null],
    });
  }

  /**
   * Lifecycle hook called after component initialization.
   *
   * @method
   * @throws {Error} If there is an error in fetching initial data.
   */
  ngOnInit(): void {
    this.loadPatients();
    this.loadPaymentMethods();
    //this.initform(this.currentSeminar);
  }

  /***** INIT DATA SECTION *****/

  /**
   * Initializes the form with the data of a given seminar.
   *
   * @param {SeminarAdminInterface} seminar - The seminar to initialize the form with.
   *
   * This method first checks if there are any patients. If there are, and the seminar has an ID,
   * it fetches the seminar inscriptions by the seminar's ID. It then finds the inscription that matches
   * the current inscription's ID. If such an inscription is found, it finds the patient with the same ID
   * as the patient in the found inscription.
   *
   * The method then updates the seminar inscription form with the data from the found inscription.
   * If a patient was found, it also selects this patient in the form. Finally, it updates the insurance
   * field in the form with the insurance data from the found inscription.
   *
   * @returns {void}
   */
  initform(seminar: SeminarAdminInterface): void {
    if (this.patients.length > 0) {
      if (seminar.id) {
        this.seminarInscriptionService
          .getSeminarInscriptionsFlatById(seminar.id)
          .subscribe((data) => {
            let editInscription = data.find(
              (inscription) => inscription.id === this.currentInscription.id
            );
            if (editInscription) {
              let patchPatient = this.patients.find(
                (patient) => patient.id === editInscription?.patient
              );
              this.seminarInscriptionForm.patchValue({
                patient: patchPatient,
                seminar_status: editInscription.seminar_status,
                meetingNumber: editInscription.meetingNumber,
                payment_status: editInscription.payment_status,
                payment_method: editInscription.payment_method,
                patient_copayment: editInscription.patient_copayment,
                hi_copayment: editInscription.hi_copayment,
              });
              if (patchPatient) {
                this.onPatientSelect(patchPatient);
              }
              this.seminarInscriptionForm.patchValue({
                insurance: editInscription.insurance,
              });
            }
          });
      }
    }
  }

  /**
   * Fetches a list of patients from the patient service, sorts them alphabetically by user,
   * assigns them to the 'patients' property, and filters them.
   * @author Alvaro Olguin
   * @throws {Error} If there is an error in fetching, sorting, or filtering the data.
   * @returns {void}
   */
  loadPatients(): void {
    this.patientService.getAllPatientsView().subscribe((data) => {
      // Filter active patients and sort them
      let activePatients = data.filter((patient) => patient.is_active);
      activePatients.sort((a, b) =>
        a.user.toString().localeCompare(b.user.toString())
      );
      this.patients = activePatients;
      this.initform(this.currentSeminar);
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
    this.paymentMethodService.getPaymentMethods().subscribe((data) => {
      //Sort
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.paymentMethods = data;
    });
  }

  /***** ON SELECT SECTION *****/

  /**
   * Handles the selection of a patient in the form.
   *
   * @method
   * @param {Patient} patient - Selected patient.
   * @throws {Error} If there is an error in handling the selection.
   */
  onPatientSelect(patient: PatientView): void {
    let selectedPatient = this.patients.find((p) => p.id === patient.id);
    if (selectedPatient) {
      let selectedPatientInsurance = selectedPatient.insurances;
      this.insuranceService.getAll().subscribe((data) => {
        // Filter active insurances and sort them
        let activeHI = data.filter((insurance) => insurance.is_active);
        activeHI.sort((a, b) =>
          a.name.toString().localeCompare(b.name.toString())
        );

        if (selectedPatientInsurance) {
          activeHI = activeHI.filter((insurance) =>
            selectedPatientInsurance.includes(insurance.name)
          );
        }
        this.insurances = activeHI;

        // Find the insurance with name 'PARTICULAR' and set it as the default value for the 'insurance' form control
        let particularInsurance = this.insurances.find(
          (insurance) => insurance.name.toUpperCase() === 'PARTICULAR'
        );
        if (particularInsurance) {
          this.seminarInscriptionForm
            .get('insurance')!
            .setValue(particularInsurance.id);
        }
      });
    }
  }

  /***** FILTER SECTION *****/

  /**
   * Filters patients based on the user input in the form.
   *
   * @method
   */
  filterPatients() {
    this.filteredPatients = this.seminarInscriptionForm
      .get('patient')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterPatients(name) : this.patients.slice()
        )
      );
  }

  /**
   * Private method to filter patients based on the input string.
   *
   * @private
   * @method
   * @param {string} value - Input string.
   * @returns {PatientView[]} - Filtered list of patients.
   */
  private _filterPatients(value: string): PatientView[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter((patient) =>
      patient.user.toString()!.toLowerCase().includes(filterValue)
    );
  }

  /***** DISPLAY SECTION *****/

  /**
   * Displays the selected patient in the form.
   *
   * @method
   * @param {Patient} patient - Selected patient.
   * @returns {string} - Display value for the selected patient.
   */
  displayPatient(patient: Patient): string {
    return patient ? `${patient.user.toString()}` : '';
  }

  /**
   * Updates the visibility of the payment method based on the selected value.
   * resets de payment_method attribute
   * @param selectedValue The selected value.
   * @author Alvaro Olguin
   * @returns {void}
   */
  updatePaymentVisibility(selectedValue: number | null): void {
    this.isPaid = selectedValue === 2;
    if (!this.isPaid) {
      this.seminarInscriptionForm.patchValue({
        payment_method: null,
      });
    }
  }

  /**
   * Handles the form submission for update a seminar inscription.
   *
   * @method
   * @throws {Error} If there is an error in submitting the form.
   */
  onSubmit() {
    if (this.seminarInscriptionForm.valid) {
      const formValues = this.seminarInscriptionForm.value;

      const filteredBody: SeminarInscriptionAdminPostInterface = {
        seminar: history.state.seminar.id,
        patient: formValues.patient.id,
        meetingNumber: formValues.meetingNumber,
        seminar_status: formValues.seminar_status,
        payment_status: formValues.payment_status,
        payment_method: formValues.payment_method,
      };

      if (formValues.insurance !== undefined && formValues.insurance !== null) {
        filteredBody.insurance = formValues.insurance;
      }

      //console.log('BODY: ', filteredBody);
      const confirmAppointment = this.dialogService.openConfirmDialog(
        'Confirma la actualización de esta inscripción'
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          this.seminarInscriptionService
            .updateSeminarInscription(this.currentInscription.id, filteredBody)
            .pipe(
              catchError((error) => {
                console.error('Error en la solicitud:', error);

                // Checks "non_field_errors"
                if (error.error && error.error.non_field_errors) {
                  const errorMessage = error.error.non_field_errors[0];
                  this.dialogService.showErrorDialog(
                    'Error al actualizar la inscripción: ' + errorMessage
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
            .subscribe((data: SeminarInscriptionAdminGetFlatInterface) => {
              const successDialog = this.dialogService.showSuccessDialog(
                'Inscripción actualizada exitosamente'
              );

              successDialog.afterClosed().subscribe(() => {
                const seminar = this.currentSeminar;
                this.router.navigate(
                  ['/Dashboard/seminar/admin/seminar-inscription/list'],
                  {
                    state: { seminar },
                  }
                );
              });
            });
        }
      });
    }
  }

  /**
   * Handles the cancellation of the inscription.
   *
   * @method
   */
  onCancel() {
    const seminar = this.currentSeminar;
    this.router.navigate(
      ['/Dashboard/seminar/admin/seminar-inscription/list'],
      {
        state: { seminar },
      }
    );
  }
}
