import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  SeminarInscriptionAdminGetDetailInterface,
  SeminarInscriptionAdminGetFlatInterface,
  SeminarInscriptionAdminPostInterface,
  SeminarInscriptionPatientPostInterface,
} from 'src/app/Models/seminar-inscription/admin/seminarInscriptionAdminGetDetailInterface.interface';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class SeminarInscriptionService {
  private apiUrl = environment.api_Url + 'seminar/admin/seminar-inscriptions/';
  private apiPatientUrl =
    environment.api_Url + 'seminar/patient/seminar-inscription/';
  private seminarParam = '?seminar=';

  constructor(private http: HttpClient) {}

  /**
   * Gets the details of seminar inscriptions by its ID.
   *
   * @param {number} seminar_id - The ID of the seminar.
   * @returns {Observable<SeminarInscriptionAdminGetDetailInterface[]>} - An observable that emits an array of seminar inscription details.
   * @author Alvaro Olguin Armendariz
   */
  getSeminarInscriptionsDetailById(
    seminar_id: number
  ): Observable<SeminarInscriptionAdminGetDetailInterface[]> {
    const url = this.apiUrl + this.seminarParam + seminar_id + '&display=true';
    return this.http.get<SeminarInscriptionAdminGetDetailInterface[]>(url);
  }

  /**
   * Fetches a flat list of seminar inscriptions by seminar ID.
   *
   * @param {number} seminar_id - The ID of the seminar.
   * @returns {Observable<SeminarInscriptionAdminGetFlatInterface[]>} - An Observable that will emit an array of seminar inscriptions.
   */
  getSeminarInscriptionsFlatById(
    seminar_id: number
  ): Observable<SeminarInscriptionAdminGetFlatInterface[]> {
    const url = this.apiUrl + this.seminarParam + seminar_id;
    return this.http.get<SeminarInscriptionAdminGetFlatInterface[]>(url);
  }

  /**
   * Fetches a list of seminar inscriptions for a specific patient.
   *
   * @param {number} patientId - The ID of the patient.
   * @returns {Observable<SeminarInscriptionAdminGetDetailInterface[]>} - An Observable that will emit an array of seminar inscriptions.
   */
  getPatientSeminarInscriptions(
    patientId: number
  ): Observable<SeminarInscriptionAdminGetDetailInterface[]> {
    const url = this.apiUrl + '?patient=' + patientId + '&display=true';
    return this.http.get<SeminarInscriptionAdminGetDetailInterface[]>(url);
  }

  /**
   * Creates a seminar inscription.
   *
   * @param {SeminarInscriptionAdminPostInterface} body - The data for the seminar inscription.
   * @returns {Observable<SeminarInscriptionAdminGetDetailInterface>} An Observable that emits the details of the created seminar inscription.
   */
  createSeminarInscription(
    body: SeminarInscriptionAdminPostInterface
  ): Observable<SeminarInscriptionAdminGetDetailInterface> {
    return this.http.post<SeminarInscriptionAdminGetDetailInterface>(
      this.apiUrl,
      body
    );
  }

  /**
   * Creates a seminar inscription for a patient.
   * @param {SeminarInscriptionPatientPostInterface} body - The parameter `body` is of type
   * `SeminarInscriptionPatientPostInterface`. It represents the data that will be sent in the request
   * body when making a POST request to the `apiPatientUrl`.
   * @returns an Observable of type SeminarInscriptionPatientPostInterface.
   */
  createPatientSeminarInscription(
    body: SeminarInscriptionPatientPostInterface
  ): Observable<SeminarInscriptionPatientPostInterface> {
    return this.http.post<SeminarInscriptionPatientPostInterface>(
      this.apiPatientUrl,
      body
    );
  }

  /**
   * Updates a seminar inscription by its ID.
   *
   * @param {number} inscriptionId - The ID of the seminar inscription to update.
   * @param {SeminarInscriptionAdminPostInterface} body - The new data for the seminar inscription.
   * @returns {Observable<SeminarInscriptionAdminGetFlatInterface>} - An Observable that will emit the updated seminar inscription.
   */
  updateSeminarInscription(
    inscriptionId: number,
    body: SeminarInscriptionAdminPostInterface
  ): Observable<SeminarInscriptionAdminGetFlatInterface> {
    const url = this.apiUrl + inscriptionId + '/';
    return this.http.put<SeminarInscriptionAdminGetFlatInterface>(url, body);
  }

  /**
   * Deletes an inscription by its ID.
   *
   * @param {number} inscription_id - The ID of the inscription.
   * @returns {Observable<void>} - An observable that completes when the inscription has been deleted.
   * @author Alvaro Olguin Armendariz
   */
  deleteInscription(inscription_id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + inscription_id + '/');
  }

  /**
   * Cancels a patient's inscription for a seminar
   * @param {number} seminarId - The seminarId parameter is a number that represents the ID of the
   * seminar for which the patient's inscription needs to be deleted.
   * @returns an Observable of type 'any'.
   * @author Alvaro Olguin Armendariz
   */
  deletePatientInscription(seminarId: number): Observable<any> {
    const url = this.apiPatientUrl + seminarId + '/cancel/';
    return this.http.post<any>(url, {});
  }
}
