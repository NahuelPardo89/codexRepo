import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { PaymentmethodService } from 'src/app/Services/paymentmethod/paymentmethod.service';

@Component({
  selector: 'app-payment-method-create',
  templateUrl: './payment-method-create.component.html',
  styleUrls: ['./payment-method-create.component.css']
})
export class PaymentMethodCreateComponent {
  paymentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentmethodService,
    private dialogService: DialogService,
    private router:Router
  ) {
    this.paymentForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

 
  onSubmit(): void {
    if (this.paymentForm.valid) {
      const nameInUpperCase = this.paymentForm.get('name')?.value.toUpperCase();
    

    // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
      this.paymentForm.get('name')?.setValue(nameInUpperCase);
      this.paymentService.createPaymentMethod(this.paymentForm.value).subscribe({
        next: (response) => {
          this.dialogService.showSuccessDialog('Método de pago creado correctamente');
          this.router.navigate(['/Dashboard/reports/payment-method']);
        },
        error: (error) => {
   
          this.dialogService.showErrorDialog('Hubo un error al crear el metodo de pago');
        },
      });
    }
  }
  onCancel() {
    this.router.navigate(['/Dashboard/reports/payment-method']);
  }
}
