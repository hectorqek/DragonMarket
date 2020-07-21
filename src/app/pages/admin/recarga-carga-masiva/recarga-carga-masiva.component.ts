import { Component, OnInit } from '@angular/core';
import { Archivos } from '../../../model/Archivos';
import { CargaArchivosService } from 'app/services/carga-archivos.service';
import { Subscription, empty } from 'rxjs';
import { MensajeRespuestaCargaMasiva } from 'app/model/ErrorCargaMasiva';
import { ExcelServicesService } from 'app/services/excel-services.service';

declare var $: any;
declare let swal: any;

enum TipoCarga {
  Recarga = 2,
}

@Component({
  selector: 'app-recarga-carga-masiva',
  templateUrl: './recarga-carga-masiva.component.html',
  styleUrls: ['./recarga-carga-masiva.component.css']
})
export class RecargaCargaMasivaComponent implements OnInit {

  
  public isLoading: boolean;
  public fileName: String;
  public mostarErrores: Boolean;
  public archivoActual: any;
  public listadoErrores: any[];
  private cararArchivoSubcription: Subscription;
  usuario: string;
  fileToUpload: File;
  mensajeRespuesta: MensajeRespuestaCargaMasiva;


  constructor(
    private _archivo: CargaArchivosService,
    private excelService: ExcelServicesService
  ) { }

  ngOnInit() {
    this.mostarErrores = false;
    this.usuario = sessionStorage.getItem('Usuario');
    $("#archivoCargaMasiva").focus();
  }

  //Modal cargar archivo
  abrirModalCargarArchivo() {
    if (this.fileToUpload == undefined) {
      swal('Error', 'Debe seleccionar un archivo para cargar.', 'error');
      return false;
    }
    $('#cargarArchivoModal').modal({
      keyboard: false,
      backdrop: 'static'
    });
  }

  cerrarModalCargarArchivo() {
    $('#cargarArchivoModal').modal('hide');
  }

  //Modal Errores
  cerrarErrorArchivo() {
    this.mostarErrores = false;
    $("#archivoCargaMasiva").focus();
  }

  updateFileName(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      $("#archivoCargaMasiva").val('');
      swal('Archivo no permitido', 'Solo se aceptan formatos de excel XLSX', 'warning');
      $("#archivoCargaMasiva").focus();
      return false;
    }
    if (this.fileToUpload == undefined) {
      this.fileName = null
    } else {
      this.fileName = this.fileToUpload.name;
    }
    $("#archivoCargaMasiva").focus();
    return false;
  }

  subirArchivoCargaMasiva() {
    this.isLoading = true;
    this.cararArchivoSubcription = this._archivo.cargaMasiva(this.fileToUpload, this.usuario, TipoCarga.Recarga).subscribe(data => {
      this.mensajeRespuesta = data;
      if (this.mensajeRespuesta.codigo === "ADT0000") {
        $("#archivoCargaMasiva").focus();
        swal('Carga exitosa!', 'El archivo fue cargado exitosamente', 'success');
      } else if (this.mensajeRespuesta.codigo === "ADCR001") {
        $("#archivoCargaMasiva").focus();
        swal('Error!', 'Archivo está vacío', 'error');
      } else if (this.mensajeRespuesta.codigo === "ADT9998") {
        $("#archivoCargaMasiva").focus();
        swal('Error!', 'Archivo no tiene formato esperado.  Por favor comunicarse con la mesa de ayuda', 'error');
      } else if (this.mensajeRespuesta.codigo === "ADT9997") {
        $("#archivoCargaMasiva").focus();
        this.listadoErrores = this.mensajeRespuesta.mensaje;
        this.mostarErrores = true;
      }
      else if (this.mensajeRespuesta.codigo === "ADT9999") {
        $("#archivoCargaMasiva").focus();
        swal('Error!', 'Ocurrió un error inesperado, por favor intente mas tarde', 'error');
      }
      $("#archivoCargaMasiva").val('');
      this.cerrarModalCargarArchivo();
      this.isLoading = false;
      $("#archivoCargaMasiva").focus();
      this.fileToUpload = null;
    }, error => {
      $("#archivoCargaMasiva").focus();
      this.cerrarModalCargarArchivo();
      swal('Error!', 'Ocurrió un error inesperado, por favor intente mas tarde', 'error');
      $("#archivoCargaMasiva").val('');
      this.isLoading = false;
      this.fileToUpload = null;
    });
  }

  exportar(): void {
    this.excelService.exportAsExcelFile(this.listadoErrores, 'sample');
    $("#archivoCargaMasiva").focus();
  }

}
