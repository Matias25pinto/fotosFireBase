import { Component, OnInit } from '@angular/core';
import { CargaImagenesService } from '../../services/carga-imagenes.service';
import { FileItem } from '../../models/file-item';



@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styleUrls: ['./carga.component.css']
})
export class CargaComponent implements OnInit {

  archivos: FileItem[] = [];

  estaSobreElemento = false;

  constructor( public cargaImagenes: CargaImagenesService ) { }

  ngOnInit(): void {
  }

  cargarImagenes(): void{
    this.cargaImagenes.cargarImagenesFirebase( this.archivos );
  }

 limpiarArchivos(): void{
   this.archivos = [];
 }

}
