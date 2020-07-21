export class Archivos {
  public Id: number;
  public file: File;
  public name: string;
  public url: string;
  public progress: number;
  public createdAt: Date = new Date();
  constructor(  file: File
    ) {this.file = file; }
  }