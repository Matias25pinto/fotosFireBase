import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FileItem } from '../models/file-item';

@Directive({
  selector: '[appNgDropFiles]',
})
export class NgDropFilesDirective {
  constructor() {}

  @Input() archivos: FileItem[] = [];

  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter(); // para que el padre escuche al hijo

  // de esta forma se dispara un evento cuando el mouse este sobre el objeto

  @HostListener('dragover', ['$event'])
  public onDrapEnter(event: any): void {
    this.mouseSobre.emit(true); // emite true
    this.prevenirDetener(event);
  }
  // cuando el mouse sale
  @HostListener('dragleave', ['$event'])
  public onDrapLeave(event: any): void {
    this.mouseSobre.emit(false); // emite false
  }

  // cuando se suelta el mouse
  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    const transferencia = this.getTransferencia(event);

    if (!transferencia) {
      return;
    } else {
      this.extraerArchivos(transferencia.files);
      this.prevenirDetener(event);
      this.mouseSobre.emit(false); // emite false
    }
  }

  private getTransferencia(event: any): any {
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  private extraerArchivos(archivosLista: FileList): any {
    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];

      if (this.archivoPuedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }
    console.log(this.archivos);
  }

  // validaciones
  // si el archivo ya fue dropeado y si ya es una imagen
  private archivoPuedeSerCargado(archivo: File): boolean {
    if (
      !this.archivoYaFueDroppeado(archivo.name) &&
      this.esImagen(archivo.type)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // evitar que se abra la imagen por defecto
  private prevenirDetener(event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // validar que el archivo no exista en mi arreglo de archivos
  private archivoYaFueDroppeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        console.log('El archivo ' + nombreArchivo + ' ya existe');
        return true;
      }
    }

    return false;
  }

  // validar que sea imagen
  private esImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image');
  }
}
