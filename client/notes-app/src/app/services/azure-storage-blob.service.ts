import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { BlobClient, BlobServiceClient, ContainerClient, Pipeline } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root'
})
export class AzureBlobStorageService {
    account = "noteitdown";
    containerName = "uploadednotes";
    constructor(private http:HttpClient) {}
    private containerClient(sas: string): ContainerClient {
        return new BlobServiceClient(`https://${this.account}.blob.core.windows.net?${sas}`)
                .getContainerClient(this.containerName);
      }

    private  deleteBlob(name: string, client:ContainerClient, url:string, handler: () => void) {
        
        client.deleteBlob(name).then(() => {
            handler();
          })
      }
    public deleteNotes(sas: string, name: string, url:string, id:any, handler: () => void) {
      //console.log(id);
      this.http.post(`http://localhost:4000/api/${id}/delete`, {responseType: 'json'}).subscribe();
      this.deleteBlob(name, this.containerClient(sas), url, handler);
       
      }

    private blobClient(containerClient:ContainerClient,name:string):BlobClient{
        return containerClient.getBlobClient(name);
    }

    public async verifyNotes(sas:string,name:string,metadata:any,id:any){
       let blob=this.blobClient(this.containerClient(sas),name);
       metadata["verified"]="true";
       console.log(metadata);
       await blob.setMetadata(metadata);
       this.http.post(`http://localhost:4000/api/${id}/verify`, {documentid:id},{responseType: 'json'}).subscribe({
        next: data => {
      },
      error: error => {
          console.error('There was an error!', error);
      }}
       );
    }
    public  downloadPDF(url:string,sas:string,name:string,handler: (blob: Blob) => void){
       this.downloadBlob(name, this.containerClient(sas), handler);
  }

  private async downloadBlob(name: string, client: ContainerClient, handler: (blob: Blob) => void) {
    const blobClient =  client.getBlobClient(name);
    await blobClient.download().then(resp => {resp.blobBody?.then(blob => {
        handler(blob)
      })
    })
  }

  public getBlob(url:string){
     
  }
}
