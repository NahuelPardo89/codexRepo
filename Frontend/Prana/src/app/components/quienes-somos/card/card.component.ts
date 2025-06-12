import { Component, OnInit } from '@angular/core';
import { EspecialidadesService } from '../../../Services/especialidades.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  especialidades: any[] = [];

  constructor(private _especialidadesService : EspecialidadesService) {}
  
  

  ngOnInit(): void {
      this._especialidadesService.getEspecialidades().subscribe(data => {
        this.especialidades = data.especialidades
      })
      

      setTimeout(() => {
        
        
      }, 500);
  }
}
