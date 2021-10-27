import { HttpClient } from '@angular/common/http';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { ErrorHandler, Injectable } from '@angular/core';
import { BlobClient, BlobServiceClient, ContainerClient } from '@azure/storage-blob';

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
    public deleteNotes(sas: string, name: string, url:string, handler: () => void) {
        this.deleteBlob(name, this.containerClient(sas), url, handler)
      }

    private blobClient(containerClient:ContainerClient,name:string):BlobClient{
        return containerClient.getBlobClient(name);
    }

    public async verifyNotes(sas:string,name:string,metadata:any){
       let blob=this.blobClient(this.containerClient(sas),name);
       metadata["verified"]="true";
       console.log(metadata);
       await blob.setMetadata(metadata);
    }
    public async downloadPDF(url:string,sas:string,name:string,handler: (blob: Blob) => void){
      this.downloadBlob(name, this.containerClient(sas), handler);
  }

  private downloadBlob(name: string, client: ContainerClient, handler: (blob: Blob) => void) {
    const blobClient = client.getBlobClient(name);
    blobClient.download().then(resp => {resp.blobBody?.then(blob => {
        handler(blob)
      })
    })
  }
}
