import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomAdminInterface } from 'src/app/Models/room/admin/roomAdminInterface.interface';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})

/**
 * Service for managing rooms.
 * @author Alvaro Olguin Armendariz
 */
export class RoomService {
  private apiUrl = environment.api_Url+'seminar/admin/rooms/';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves all rooms.
   * @returns {Observable<RoomAdminInterface[]>} An observable with the list of rooms.
   * @author Alvaro Olguin Armendariz
   */
  getRooms(): Observable<RoomAdminInterface[]> {
    return this.http.get<RoomAdminInterface[]>(this.apiUrl);
  }

  /**
   * Retrieves a room by its ID.
   * @param {number} roomId - The ID of the room.
   * @returns {Observable<RoomAdminInterface>} An observable with the room data.
   * @author Alvaro Olguin Armendariz
   */
  getRoomById(roomId: number): Observable<RoomAdminInterface> {
    return this.http.get<RoomAdminInterface>(this.apiUrl + roomId + '/');
  }

  /**
   * Creates a room.
   * @param {RoomAdminInterface} data - The data of the room to create.
   * @returns {Observable<RoomAdminInterface>} An observable with the data of the created room.
   * @author Alvaro Olguin Armendariz
   */
  createAdminRoom(data: RoomAdminInterface): Observable<RoomAdminInterface> {
    return this.http.post<RoomAdminInterface>(this.apiUrl, data);
  }

  /**
   * Updates a room.
   * @param {number} roomId - The ID of the room to update.
   * @param {RoomAdminInterface} data - The new data of the room.
   * @returns {Observable<RoomAdminInterface>} An observable with the data of the updated room.
   * @author Alvaro Olguin Armendariz
   */
  updateAdminRoom(
    roomId: number,
    data: RoomAdminInterface
  ): Observable<RoomAdminInterface> {
    return this.http.put<RoomAdminInterface>(this.apiUrl + roomId + '/', data);
  }

  /**
   * Deletes a room.
   * @param {number} roomId - The ID of the room to delete.
   * @returns {Observable<any>} An observable that completes once the room has been deleted.
   * @author Alvaro Olguin Armendariz
   */
  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + roomId + '/');
  }
}
