import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Medicalspeciality } from 'src/app/Models/Profile/medicalspeciality.interface';
import { BranchService } from 'src/app/Services/Profile/branch/branch.service';
import { SpecialityService } from 'src/app/Services/Profile/speciality/speciality.service';
import { DialogService } from 'src/app/Services/dialog/dialog.service';

@Component({
  selector: 'app-edit-speciality-branch',
  templateUrl: './edit-speciality-branch.component.html',
  styleUrls: ['./edit-speciality-branch.component.css'],
})
export class EditSpecialityBranchComponent {
  specialties: Medicalspeciality[] = [];

  specialityName: string = '';
  branchForm: FormGroup;
  doctorProfile=false

  constructor(
    private branchService: BranchService,
    private specialtyService: SpecialityService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.branchForm = this.fb.group({
      name: ['', Validators.required],
      speciality: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSpecialties();
    if (history.state.branch) {
      this.branchForm.patchValue(history.state.branch);
      this.specialityName = history.state.branch.speciality;
    }
    if (history.state.doctor) {
      this.doctorProfile=true
    }

  }

  loadSpecialties(): void {
    this.specialtyService.getSpecialities().subscribe((data) => {
      this.specialties = data;
    });
  }

  onSubmit(): void {
    if (this.branchForm.valid) {
      // Obtén el ID del usuario que se está editando
      const specialityId = history.state.branch
        ? history.state.branch.id
        : null;
      if (specialityId) {
        const nameInUpperCase = this.branchForm
          .get('name')
          ?.value.toUpperCase();

        // Actualizar el valor del campo name en el formulario con la versión en mayúsculas
        this.branchForm.get('name')?.setValue(nameInUpperCase);
        this.branchService
          .updateSpecialityBranch(specialityId, this.branchForm.value)
          .subscribe({
            next: () => {
              this.dialogService.showSuccessDialog(
                'Rama de Especialidad Editada con éxito'
              );
              if (this.doctorProfile){
                this.router.navigate(['Dashboard/speciality/branch/me']);
              }else{
                this.router.navigate(['Dashboard/speciality/branch']);
              }

               // Ajusta la ruta según sea necesario
            },
            error: (error) => {
              console.error('Error al actualizar Rama de Especialidad', error);
              this.dialogService.showErrorDialog(
                'Error al actualizar Rama Especialidad'
              );
              // Aquí podrías añadir alguna lógica para manejar el error, como mostrar un mensaje al usuario
            },
          });
      } else {
        console.error('Error: No se pudo obtener el ID de branch.');
        // Manejar el caso en que no se tiene un ID de usuario
      }
    } else {
      console.log('El formulario no es válido');
      // Manejar el caso en que el formulario no es válido
    }
  }

  onCancel() {
    if (this.doctorProfile){
      this.router.navigate(['Dashboard/speciality/branch/me']);
    }else{
      this.router.navigate(['Dashboard/speciality/branch']);
    }
  }
}
