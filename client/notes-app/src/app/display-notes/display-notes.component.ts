import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { AzureBlobStorageService } from '../services/azure-storage-blob.service';
import { DisplayNotesService } from '../services/displayNotes.service';
@Component({
  selector: 'app-display-notes',
  templateUrl: './display-notes.component.html',
  styleUrls: ['./display-notes.component.css']
})
export class DisplayNotesComponent implements OnInit {
  resultsArray:any []=[];
  subject!:string|null;
  constructor(private route: ActivatedRoute, private displayNotesService:DisplayNotesService, private azureService:AzureBlobStorageService) { }

  ngOnInit(): void {
    this.subject = this.route.snapshot.paramMap.get('subject');
    console.log(this.subject);
    this.displayNotesService.getNotes(this.subject).subscribe((res) => {
      console.log(res.blobs);
      this.resultsArray=res.blobs;
    }, (err) => {
      console.error(err);}
    );
  }
  openFile(file:any){
    this.azureService.downloadPDF(file.url,file.sasToken, file.name, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

}
