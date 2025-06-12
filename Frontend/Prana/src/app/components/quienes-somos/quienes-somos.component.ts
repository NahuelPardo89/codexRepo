import { Component, OnInit } from '@angular/core';
import { EspecialidadesService } from '../../Services/especialidades.service';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent implements OnInit {

  especialidades = [];

  constructor(private _especialidadesService : EspecialidadesService) {}

  ngOnInit(): void {
      this._especialidadesService.getEspecialidades().subscribe(data => {
        this.especialidades = data.especialidades
      })
  }
}
