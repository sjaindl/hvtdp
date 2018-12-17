import { Component, OnInit } from '@angular/core';
import { MysqlService } from '../services/mysql.service';
import { baseUrlDocuments } from '../shared/baseurls';
import { HvtdpDocument } from '../shared/document';
import { Title, Meta } from '@angular/platform-browser'

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documentBaseUrl: String
  documents: HvtdpDocument[]

  constructor(private mysqlService: MysqlService, private titleService: Title, private metaTagService: Meta) { 
  }

  ngOnInit() {
    this.documentBaseUrl = baseUrlDocuments

    this.mysqlService.getDocuments().subscribe(documents => {
      this.documents = documents
    })

    this.titleService.setTitle("HV TDP Stainz: Dokumente")
    this.metaTagService.updateTag({
      name: 'description', content: "Dokumente rund um den HV TDP Stainz für Mitglieder und Fans: Download."
    })
  }

}
