import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Task } from '../task';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-week-view',
  standalone: true,
  imports: [
    RouterOutlet,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    MatTableModule,
  ],
  templateUrl: './week-view.component.html',
  styleUrl: './week-view.component.scss'
})
export class WeekViewComponent {
  date = new FormControl(new Date());
  fromDate = new Date(); // TODO: Can I initialise this to a week before the above date? Or is this better done in NgOnInit?

  tasks: Task[] = []
  
  ngOnInit() {
    this.fromDate.setDate(this.date.value!.getDate() - 7);
    
    this.tasks = [
      {
        name: 'Testing 1',
        hoursDone: 1,
        minGoal: 5,
      },
      {
        name: 'Testing 2',
        hoursDone: 20,
        minGoal: 10,
      },
      {
        name: 'Testing 3',
        hoursDone: 7,
        minGoal: 5,
        maxGoal: 10,
      }
    ]
  }
}
