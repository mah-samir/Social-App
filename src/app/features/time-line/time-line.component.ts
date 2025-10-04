import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CreatePostComponent } from "../../shared/components/create-post/create-post.component";
import { SPostComponent } from "../../shared/components/s-post/s-post.component";
import { PostsService } from '../../shared/components/s-post/services/posts.service';
import { Post } from '../../shared/components/s-post/models/post';

@Component({
  selector: 'app-time-line',
  imports: [CreatePostComponent, SPostComponent],
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.css'
})
export class TimeLineComponent implements OnInit {
  
  private readonly postsService = inject(PostsService)
  allPosts: WritableSignal<Post[]> = signal([])


  ngOnInit(): void {
    this.getAllPostsData()
  }


  getAllPostsData(): void {
    this.postsService.getPostsWithLimit().subscribe({
      next: (res) => {
        console.log(res)
        this.allPosts.set(res.posts)
      }
      , error: (err) => { console.log(err) }
    })
  }
}