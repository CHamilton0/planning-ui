import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'planning-ui';

  date = new FormControl(new Date());

  field1 = 0;
  field2 = 0;
  field3 = 0;
}
