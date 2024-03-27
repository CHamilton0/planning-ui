import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Summary, SummaryDisplay } from '../interfaces/summary';
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
  summaryDisplay: SummaryDisplay[] = [];
  inf = Infinity;

  fullSpaceRepresentsHours = 0;

  constructor(private graphqlService: GraphqlService) { }

  async ngOnInit() {
    await this.getData();

    this.date.valueChanges.subscribe(async () => {
      await this.getData();
    });
  }

  async getData() {
    this.fromDate.setDate(this.date.value!.getDate() - 7);

    this.weeklySummary = await this.graphqlService.getWeeklySummary(this.date.value);

    let highestHours = 0;
    for (const summary of this.weeklySummary) {
      const summaryHighestHours = Math.max(summary.hoursDone, summary.minHours, summary.maxHours ?? 0)
      if (summaryHighestHours > highestHours) {
        highestHours = summaryHighestHours;
      }
    }
    this.fullSpaceRepresentsHours = highestHours

    this.summaryDisplay = this.weeklySummary.map((summaryData) => {
      const summaryDisplay: SummaryDisplay = { ...summaryData };
      summaryDisplay.goalStyle = this.getGoalStyle(summaryData);
      summaryDisplay.hoursDoneStyle = this.getHoursDoneStyle(summaryData);
      return summaryDisplay;
    })
  }

  getHoursDoneStyle(task: Summary) {
    const percentageOfMax = (task.hoursDone / this.fullSpaceRepresentsHours) * 100;

    return `width: ${percentageOfMax}%;`;
  }

  getGoalStyle(task: Summary) {
    const minGoalPercentage = (task.minHours / this.fullSpaceRepresentsHours) * 100;
    let width = '0';

    let style = `margin-left: ${minGoalPercentage}%;`
    if (task.maxHours) {
      width = (((task.maxHours - task.minHours) / this.fullSpaceRepresentsHours) * 100).toString();
    }
    return `${style} width: ${width}%`;
  }
}
