import { Component } from '@angular/core';
import { WeekViewComponent } from './week-view/week-view.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    WeekViewComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'planning-ui';
}
