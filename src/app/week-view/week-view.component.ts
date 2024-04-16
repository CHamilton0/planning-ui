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
  range = new FormControl(7);
  fromDate = new Date();

  summary: Summary[] = [];
  summaryDisplay: SummaryDisplay[] = [];
  inf = Infinity;

  fullSpaceRepresentsHours = 0;

  constructor(private graphqlService: GraphqlService) {}

  async ngOnInit() {
    await this.getData();

    this.date.valueChanges.subscribe(async () => {
      await this.getData();
    });

    this.range.valueChanges.subscribe(async () => {
      await this.getData();
    });
  }

  async getData() {
    if (this.range.value) {
      this.fromDate.setDate(this.date.value!.getDate() - this.range.value);
    }

    this.summary = await this.graphqlService.getSummary(
      this.date.value,
      this.range.value
    );

    let highestHours = 0;
    for (const summary of this.summary) {
      const summaryHighestHours = Math.max(
        summary.hoursDone,
        summary.minHours,
        summary.maxHours ?? 0
      );
      if (summaryHighestHours > highestHours) {
        highestHours = summaryHighestHours;
      }
    }
    this.fullSpaceRepresentsHours = highestHours;

    this.summaryDisplay = this.summary.map((summaryData) => {
      const summaryDisplay: SummaryDisplay = { ...summaryData };
      summaryDisplay.goalStyle = this.getGoalStyle(summaryData);
      summaryDisplay.hoursDoneStyle = this.getHoursDoneStyle(summaryData);
      if (summaryDisplay.maxHours && this.inRange(summaryDisplay)) {
        summaryDisplay.percentageDifference = 0;
      } else {
        const midpoint = summaryData.maxHours
          ? (summaryData.maxHours + summaryData.minHours) / 2
          : summaryData.minHours;
          console.log(midpoint)
        const diff = Math.abs(midpoint - summaryData.hoursDone);

        summaryDisplay.percentageDifference = diff / midpoint;
      }
      return summaryDisplay;
    });
  }

  inRange(summary: SummaryDisplay) {
    return (
      summary.hoursDone >= summary.minHours &&
      summary.hoursDone <= (summary.maxHours || Infinity)
    );
  }

  getHoursDoneStyle(task: Summary) {
    const percentageOfMax =
      (task.hoursDone / this.fullSpaceRepresentsHours) * 100;

    return `width: ${percentageOfMax}%;`;
  }

  getGoalStyle(task: Summary) {
    const minGoalPercentage =
      (task.minHours / this.fullSpaceRepresentsHours) * 100;
    let width = '0';

    let style = `margin-left: ${minGoalPercentage}%;`;
    if (task.maxHours) {
      width = (
        ((task.maxHours - task.minHours) / this.fullSpaceRepresentsHours) *
        100
      ).toString();
    }
    return `${style} width: ${width}%`;
  }
}
