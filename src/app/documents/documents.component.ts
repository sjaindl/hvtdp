import { Component, OnInit } from '@angular/core';
import { MysqlService } from '../services/mysql.service';
import { baseUrlDocuments } from '../shared/baseurls';
import { HvtdpDocument } from '../shared/document';
import { Title, Meta } from '@angular/platform-browser'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { PassworddialogComponent } from '../passworddialog/passworddialog.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documentBaseUrl: String
  documents: HvtdpDocument[]

  constructor(
    private mysqlService: MysqlService, 
    private titleService: Title, 
    private metaTagService: Meta,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { 
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

  downloadProtectedDocument(document: HvtdpDocument) {
    console.log(document.protected)

    const dialogRef = this.dialog.open(PassworddialogComponent)

    dialogRef.afterClosed().subscribe(password => {
      console.log(`password: ${password}`)
      this.mysqlService.checkPassword(password).subscribe(result => {
        if (result.length != 1 || !result[0].valid) {
          this.snackBar.open("Passwort ungültig")
        } else {
          const link = this.documentBaseUrl + document.link
          window.location.href = link
        }
      }) 
    })
  }
}
