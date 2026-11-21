import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  private http = inject(HttpClient);

  apiUrl = 'https://www.hvtdpstainz.at/api/uploadFile.php';

  upload(file: File): Observable<unknown> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('file', file); //, file.name);

    console.log('upload: ' + file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.apiUrl, formData);
  }
}
