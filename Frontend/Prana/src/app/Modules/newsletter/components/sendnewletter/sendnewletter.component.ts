import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Newsletter } from 'src/app/Models/newsletter/newsletter.interface';
import { DialogService } from 'src/app/Services/dialog/dialog.service';
import { NewletterService } from 'src/app/Services/newletter/newletter.service';

@Component({
  selector: 'app-sendnewletter',
  templateUrl: './sendnewletter.component.html',
  styleUrls: ['./sendnewletter.component.css']
})
export class SendnewletterComponent {
  sendNewsletterForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private newsletterService: NewletterService, 
    private dialog: DialogService, 
    private router: Router
  ) {
    this.sendNewsletterForm = this.fb.group({
      textContent: ['', [Validators.required]],
      instagramUrl: ['', [Validators.required, Validators.pattern('https?://.+')]]
    });
  }

  onSubmit(): void {
    if (this.sendNewsletterForm.valid) {
      this.isLoading = true;
      const newsletter: Newsletter = {
        text_content: this.sendNewsletterForm.get('textContent')?.value,
        instagram_url: this.sendNewsletterForm.get('instagramUrl')?.value
      };

      this.newsletterService.sendNewsletter(newsletter).subscribe({
        next: (response) => {
          this.dialog.showSuccessDialog("Newsletter enviado con éxito");
          this.isLoading = false;
          this.sendNewsletterForm.reset();
        },
        error: (error) => {
          this.dialog.showErrorDialog(error.error.message || 'Ocurrió un error al enviar el newsletter. Inténtalo de nuevo más tarde.');
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.sendNewsletterForm.reset();
  }
 
}
