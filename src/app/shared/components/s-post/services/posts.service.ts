import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProfileComponent } from './../../../../features/profile/profile.component';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private readonly httpClient = inject(HttpClient)

  createPost(data:object):Observable<any>{
    return this.httpClient.post('https://linked-posts.routemisr.com/posts',data)
  }

  getAllPosts():Observable<any>{
    return this.httpClient.get(environment.baseUrl+`posts?limit=50`)
  }

  getPostsWithLimit(limit: number = 50, page: number = 1, sort: string = '-createdAt'): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts?limit=${limit}&page=${page}&sort=${sort}`);
  }

  getUserPosts(id:string|null):Observable<any>{
    return this.httpClient.get(environment.baseUrl+`users/${id}/posts?limit=2`)
  }

  updatePost(id:string,data:object):Observable<any>{
    return this.httpClient.put(environment.baseUrl+`posts/${id}`,data)
  }

  deletePost(id:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl+`posts/${id}`)
  }
}
