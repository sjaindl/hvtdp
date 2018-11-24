import { Component, OnInit } from '@angular/core';
import { MysqlService } from '../services/mysql.service';
import { baseUrlDocuments } from '../shared/baseurls';
import { HvtdpDocument } from '../shared/document';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  documentBaseUrl: String
  documents: HvtdpDocument[]

  constructor(private mysqlService: MysqlService) { 
  }

  ngOnInit() {
    this.documentBaseUrl = baseUrlDocuments

    this.mysqlService.getDocuments().subscribe(documents => {
      this.documents = documents
    })
  }

}
