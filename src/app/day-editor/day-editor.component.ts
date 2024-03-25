import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Apollo } from 'apollo-angular';
import { GET_DAY } from '../services/graphql.operations';
import { GraphqlService } from '../services/graphql.service';
import { Item } from '../interfaces/item';

@Component({
  selector: 'app-day-editor',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
  templateUrl: './day-editor.component.html',
  styleUrl: './day-editor.component.scss',
})
export class DayEditorComponent {
  date = new FormControl(new Date());

  myForm: FormGroup;

  options: string[] = ['Task 1', 'Task 2', 'Task 3'];
  selectedOptions: string[] = [];

  constructor(private fb: FormBuilder, private graphqlService: GraphqlService) {
    this.myForm = this.fb.group({
      formGroups: this.fb.array([]),
    });
  }

  async ngOnInit() {
    const day = await this.graphqlService.loadDay(this.date.value);
    for (const item of day.items) {
      this.addFormGroup(item);
    }
  }

  get formGroups(): FormArray {
    return this.myForm.get('formGroups') as FormArray;
  }

  addFormGroup(item?: Item): void {
    const formGroup = this.fb.group({
      // Define your form group structure here
      name: [item?.name ?? '', Validators.required],
      hours: [item?.hours ?? 0, [Validators.required, Validators.min(1)]],
    });

    formGroup.valueChanges.subscribe((value) => {
      if (formGroup.valid) {
        console.log(value);
      }
    });

    formGroup.get('name')?.valueChanges.subscribe((value) => {
      this.selectedOptions = this.formGroups.controls.map(
        (control) => control.get('name')?.value
      );
    });

    this.formGroups.push(formGroup);
  }

  deleteFormGroup(index: number): void {
    this.formGroups.controls.splice(index, 1);
  }
}
