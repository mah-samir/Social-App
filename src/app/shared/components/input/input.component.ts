import { Component, input, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() control!: any
  @Input() typeInput!: string
  @Input() idInput!: string
  @Input() labelInput!: string
  @Input() placeholder!:string
  @Input() element: string = 'input'
  flag: boolean = true
}
