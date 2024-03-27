import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GraphqlService } from '../services/graphql.service';
import { Goal } from '../interfaces/goal';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-week-editor',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './week-editor.component.html',
  styleUrl: './week-editor.component.scss',
})
export class WeekEditorComponent {
  goalFormGroup: FormGroup;
  goals: Goal[] = []

  constructor(private fb: FormBuilder, private graphqlService: GraphqlService) {
    this.goalFormGroup = this.fb.group({
      goalForms: this.fb.array([]),
    });
  }

  async ngOnInit() {
    this.goals = [...await this.graphqlService.getGoals()];

    for (const goal of this.goals) {
      this.addFormGroup(goal);
    }
  }

  get goalForms(): FormArray {
    return this.goalFormGroup.get('goalForms') as FormArray;
  }

  addFormGroup(goal?: Goal): void {
    const formGroup = this.fb.group({
      // Define your form group structure here
      name: [goal?.name ?? '', Validators.required],
      minHours: [goal?.minHours ?? 0, [Validators.required, Validators.min(1)]],
      maxHours: [goal?.maxHours ?? undefined, [Validators.min(1)]],
    });

    formGroup.valueChanges.subscribe((value) => {
      if (formGroup.valid) {
        if (value.name && value.minHours) {
          const goalIndex = this.goals.findIndex((goal) => goal.name === value.name)
          if (goalIndex !== -1) {
            this.goals[goalIndex] = { name: value.name, minHours: value.minHours, maxHours: value.maxHours ?? undefined };
          } else {
            this.goals.push({ name: value.name, minHours: value.minHours, maxHours: value.maxHours ?? undefined });
          }
        }

        this.graphqlService.setGoals(this.goals);
      }
    });

    this.goalForms.push(formGroup);
  }

  deleteFormGroup(index: number): void {
    this.goalForms.controls.splice(index, 1);
    this.goals.splice(index, 1);

    this.graphqlService.setGoals(this.goals);
  }
}
