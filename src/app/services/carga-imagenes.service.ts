import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore'; // FireBase
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase'; // para poder usar firebase.storage

@Injectable({
  providedIn: 'root'
})
export class CargaImagenesService {

  CARPETA_IMAGENES = 'img';

  constructor( private db: AngularFirestore ) { }

  cargarImagenesFirebase( imagenes: FileItem[] ): void{
    const storageRef = firebase.storage().ref(); // hacer referencia al storage de firebase

    for ( const item of imagenes ){

      item.estaSubiendo = true;
      if ( item.progreso >= 100 ){
        continue;
      }

      const uploadTask: firebase.storage.UploadTask = storageRef
                                                      .child(`${ this.CARPETA_IMAGENES }/${ item.nombreArchivo }`)
                                                      .put( item.archivo );
      uploadTask.on( firebase.storage.TaskEvent.STATE_CHANGED, 
          ( snapshot: firebase.storage.UploadTaskSnapshot ) => item.progreso = ( snapshot.bytesTransferred / snapshot.totalBytes ) * 100,
          ( error ) => console.error('Error al subir ', error),
          () => {
            console.log('Imagen cargada correctamente ' );
            // para cargar la imagen en el storage y guardar la referencia de la ubicacion
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              item.url = url;
              item.estaSubiendo = false;
              this.guardarImagen({
              nombre: item.nombreArchivo,
              url: item.url,
             });
             });
          }
        )
    }
  }

  private guardarImagen( imagen: { nombre: string, url: string } ): void{
    this.db.collection(`/${ this.CARPETA_IMAGENES }`)
          .add( imagen );
  }

}
