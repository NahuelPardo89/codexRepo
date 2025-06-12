/**
 * Component for creating seminar inscriptions in the admin panel.
 * @component
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
  SeminarInscriptionAdminPostInterface,
} from 'src/app/Models/seminar-inscription/admin/seminarInscriptionAdminGetDetailInterface.interface';
import { SeminarAdminInterface } from 'src/app/Models/seminar/seminarAdminInterface.interface';
import { HealthinsuranceService } from 'src/app/Services/Profile/healthinsurance/insurance/healthinsurance.service';
import { PatientService } from 'src/app/Services/Profile/patient/patient.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';
import { SeminarInscriptionService } from 'src/app/Services/seminar/seminar-inscription.service';
import { SeminarService } from 'src/app/Services/seminar/seminar.service';

@Component({
  selector: 'app-seminar-inscription-admin-create',
  templateUrl: './seminar-inscription-admin-create.component.html',
  styleUrls: ['./seminar-inscription-admin-create.component.css'],
})
export class SeminarInscriptionAdminCreateComponent {
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
      seminar_status: [1, Validators.required],
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
      //patient_copayment: [null, Validators.required],
      // hi_copayment: [
      //   null,
      //   [Validators.pattern(/^[0-9]\d*$/), Validators.min(1)],
      // ],
      payment_status: [1, [Validators.required]],
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
  }

  /***** INIT DATA SECTION *****/

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
  onPatientSelect(patient: Patient): void {
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
   * Handles the form submission for creating a new seminar inscription.
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
      };

      if (
        formValues.payment_method !== undefined &&
        formValues.payment_method !== null
      ) {
        filteredBody.payment_method = formValues.payment_method;
      }

      if (formValues.insurance !== undefined && formValues.insurance !== null) {
        filteredBody.insurance = formValues.insurance;
      }

      //console.log('BODY: ', filteredBody);
      const confirmAppointment = this.dialogService.openConfirmDialog(
        'Confirma la inscripción al taller'
      );
      confirmAppointment.afterClosed().subscribe((confirmResult) => {
        if (confirmResult) {
          this.seminarInscriptionService
            .createSeminarInscription(filteredBody)
            .pipe(
              catchError((error) => {
                console.error('Error en la solicitud:', error);

                // Checks "non_field_errors"
                if (error.error && error.error.non_field_errors) {
                  const errorMessage = error.error.non_field_errors[0];
                  this.dialogService.showErrorDialog(
                    'Error al crear la inscripción: ' + errorMessage
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
            .subscribe((data: SeminarInscriptionAdminGetDetailInterface) => {
              const successDialog = this.dialogService.showSuccessDialog(
                'Inscripción creada exitosamente'
              );

              successDialog.afterClosed().subscribe(() => {
                const createAnotherAppointment =
                  this.dialogService.openConfirmDialog(
                    '¿Desea realizar otra inscripción a este taller?'
                  );
                createAnotherAppointment
                  .afterClosed()
                  .subscribe((confirmResult) => {
                    if (confirmResult) {
                      // reset form or reload?
                      window.location.reload();
                    } else {
                      // Redirect to inscription list
                      const seminar = this.currentSeminar;
                      this.router.navigate(
                        ['/Dashboard/seminar/admin/seminar-inscription/list'],
                        {
                          state: { seminar },
                        }
                      );
                    }
                  });
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
