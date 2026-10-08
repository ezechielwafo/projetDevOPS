import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private url = '/api/users';

  list(): Observable<User[]> { return this.http.get<User[]>(this.url); }
  create(u: User): Observable<User> { return this.http.post<User>(this.url, u); }
  update(id: number, u: User): Observable<User> { return this.http.put<User>(`${this.url}/${id}`, u); }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
