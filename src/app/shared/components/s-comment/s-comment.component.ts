import { Component, input, InputSignal, signal, inject, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from './services/comments.service';

@Component({
  selector: 'app-s-comment',
  imports: [DatePipe, FormsModule],
  templateUrl: './s-comment.component.html',
  styleUrl: './s-comment.component.css'
})
export class SCommentComponent {
  private readonly commentsService = inject(CommentsService);
  
  Comment: InputSignal<any> = input.required();
  
  // Outputs to notify parent component
  commentUpdated = output<any>();
  commentDeleted = output<string>();

  isDropdownOpen = signal(false);
  isEditing = signal(false);
  editContent = signal('');
  isSubmitting = signal(false);
  errorMessage = signal('');

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  startEdit() {
    this.isEditing.set(true);
    this.editContent.set(this.Comment().content);
    this.isDropdownOpen.set(false);
    this.errorMessage.set('');
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editContent.set('');
    this.errorMessage.set('');
  }

  saveEdit() {
    const content = this.editContent().trim();
    
    if (!content) {
      this.errorMessage.set('Comment cannot be empty');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.commentsService.updateComment(this.Comment()._id, content).subscribe({
      next: (response) => {
        console.log('Comment updated successfully', response);
        
        // Update local comment content
        this.Comment().content = content;
        
        this.isSubmitting.set(false);
        this.isEditing.set(false);
        this.editContent.set('');
        
        // Notify parent component
        this.commentUpdated.emit(response);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set('Failed to update comment. Please try again.');
        console.error('Error updating comment:', error);
      }
    });
  }

  deleteComment() {
    this.isDropdownOpen.set(false);

    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentsService.deleteComment(this.Comment()._id).subscribe({
        next: (response) => {
          console.log('Comment deleted successfully', response);
          
          // Notify parent component to remove this comment
          this.commentDeleted.emit(this.Comment()._id);
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          alert('Failed to delete comment. Please try again.');
        }
      });
    }
  }
}