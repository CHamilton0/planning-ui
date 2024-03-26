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

  dayForm: FormGroup;

  options: string[] = [];
  selectedOptions: string[] = [];

  dayItems: Map<string, Item> = new Map();

  constructor(private fb: FormBuilder, private graphqlService: GraphqlService) {
    this.dayForm = this.fb.group({
      itemForms: this.fb.array([]),
    });
  }

  async ngOnInit() {
    // Get the goals for the option names
    const goals = await this.graphqlService.getGoals();
    this.options = goals.map((goal) => goal.name);

    // Get the current day items and add a form group for each
    const day = await this.graphqlService.loadDay(this.date.value);
    for (const item of day.items) {
      this.dayItems.set(item.name, item);
      this.addFormGroup(item);
    }

    // Set the selected options based on currently selected items in forms
    this.selectedOptions = this.itemForms.controls.map(
      (control) => control.get('name')?.value
    );
  }

  get itemForms(): FormArray {
    return this.dayForm.get('itemForms') as FormArray;
  }

  addFormGroup(item?: Item): void {
    const formGroup = this.fb.group({
      name: [item?.name ?? '', Validators.required],
      hours: [item?.hours ?? 0, [Validators.required, Validators.min(1)]],
    });

    // When a form's value changes, update the day item
    formGroup.valueChanges.subscribe((value) => {
      if (formGroup.valid && value.hours && value.name) {
        this.updateDayItems({
          name: value.name,
          hours: value.hours,
        });
      }
    });

    formGroup.get('name')?.valueChanges.subscribe((value) => {
      this.selectedOptions = this.itemForms.controls.map(
        (control) => control.get('name')?.value
      );
    });

    this.itemForms.push(formGroup);
  }

  updateDayItems(item: Item) {
    this.dayItems.set(item.name, item);

    this.graphqlService.setDayItems(this.date.value, Array.from(this.dayItems.values()));
  }

  deleteFormGroup(index: number): void {
    const itemToDelete: Item = this.itemForms.controls[index].value;
    const selectedOptionIndex = this.selectedOptions.findIndex((option) => option === itemToDelete.name)

    this.selectedOptions.splice(selectedOptionIndex, 1);
    this.itemForms.controls.splice(index, 1);

    this.dayItems.delete(itemToDelete.name);
    this.graphqlService.setDayItems(this.date.value, Array.from(this.dayItems.values()));
  }
}
