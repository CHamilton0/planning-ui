import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Task } from '../interfaces/task';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Summary } from '../interfaces/summary';
import { GraphqlService } from '../services/graphql.service';

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
  styleUrl: './week-view.component.scss',
})
export class WeekViewComponent {
  date = new FormControl(new Date());
  fromDate = new Date(); // TODO: Can I initialise this to a week before the above date? Or is this better done in NgOnInit?

  weeklySummary: Summary[] = [];

  constructor(private graphqlService: GraphqlService) {}

  async ngOnInit() {
    await this.getData();

    this.date.valueChanges.subscribe(async () => {
      await this.getData();
    });
  }

  async getData() {
    this.fromDate.setDate(this.date.value!.getDate() - 7);

    this.weeklySummary = await this.graphqlService.getWeeklySummary(this.date.value);
  }
}
