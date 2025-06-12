import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Newsletter } from 'src/app/Models/newsletter/newsletter.interface';

@Injectable({
  providedIn: 'root'
})
export class NewletterService {
  private subscribeUrl: string = environment.api_Url+'newletter/subscribe/';
  private sendUrl: string = environment.api_Url+'newletter/send/';
  constructor(private http: HttpClient) { }

  subscribe(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ email });
    return this.http.post<any>(this.subscribeUrl, body, { headers });
  }

  sendNewsletter(newsletter: Newsletter): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify(newsletter);
    return this.http.post<any>(this.sendUrl, body, { headers });
  }

}
