import { Component } from '@angular/core';
import { WeekViewComponent } from './week-view/week-view.component';
import { WeekEditorComponent } from './week-editor/week-editor.component';
import { DayEditorComponent } from './day-editor/day-editor.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    WeekViewComponent,
    WeekEditorComponent,
    DayEditorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
