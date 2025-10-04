import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient)



  createComment(content: string, postId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `comments`, {
      "content": content,
      "post": postId
    })
  }

  getPostComments(idPost: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/${idPost}/comments`)
  }

  updateComment(idPost:string,content:string):Observable<any>{
    return this.httpClient.put(environment.baseUrl+`comments/${idPost}`,{content:content})
  }

  deleteComment(idPost:string):Observable<any>{
    return this.httpClient.delete(environment.baseUrl+`comments/${idPost}`)
  }
}
