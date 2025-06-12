import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';

@Component({
  selector: 'app-payment-method-edit',
  templateUrl: './payment-method-edit.component.html',
  styleUrls: ['./payment-method-edit.component.css']
})
export class PaymentMethodEditComponent {
  paymentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paymentService: PaymentmethodService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (history.state.payment) {
      this.paymentForm.patchValue(history.state.payment);
    }
  }

  private initForm() {
    this.paymentForm = this.fb.group({

      name: ['', Validators.required],

    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      // Obtén el ID del usuario que se está editando
      const paymentId = history.state.payment ? history.state.payment.id : null;
      if (paymentId) {
        const nameInUpperCase = this.paymentForm.get('name')?.value.toUpperCase();

        // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
        this.paymentForm.get('name')?.setValue(nameInUpperCase);
        this.paymentService.updatePaymentMethod(paymentId, this.paymentForm.value).subscribe({
          next: () => {
            
            this.dialogService.showSuccessDialog('Método de pago Editado con éxito');

            this.router.navigate(['/Dashboard/reports/payment-method']); // Ajusta la ruta según sea necesario
          },
          error: (error) => {
            
            this.dialogService.showErrorDialog(
              'Error al actualizar Método de pago'
            );
            // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
          },
        });
      } 
    } else {
      console.log('El formulario no es válido');
      // Manejar el caso en que el formulario no es válido
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/reports/payment-method']);
  }
}
