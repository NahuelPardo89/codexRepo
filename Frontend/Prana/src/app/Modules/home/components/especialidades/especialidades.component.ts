import { Component, OnInit } from '@angular/core';
import { EspecialidadesService } from 'src/app/Services/especialidades.service';

@Component({
  selector: 'app-especialidades',
  templateUrl: './especialidades.component.html',
  styleUrls: ['./especialidades.component.css']
})
export class EspecialidadesComponent implements OnInit {
  especialidades = [];

  constructor(private _especialidadesService : EspecialidadesService) {}

  ngOnInit(): void {
      this._especialidadesService.getEspecialidades().subscribe(data => {
        this.especialidades = data.especialidades;
   
      })
  }

}
