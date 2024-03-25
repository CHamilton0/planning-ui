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
  ],
  templateUrl: './week-editor.component.html',
  styleUrl: './week-editor.component.scss',
})
export class WeekEditorComponent {
  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      formGroups: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.addFormGroup();
  }

  get formGroups(): FormArray {
    return this.myForm.get('formGroups') as FormArray;
  }

  addFormGroup(): void {
    const formGroup = this.fb.group({
      // Define your form group structure here
      name: ['', Validators.required],
      minGoal: [0, [Validators.required, Validators.min(1)]],
      maxGoal: undefined,
    });

    formGroup.valueChanges.subscribe((value) => {
      if (formGroup.valid) {
        console.log(value);
      }
    });

    this.formGroups.push(formGroup);
  }

  deleteFormGroup(index: number): void {
    this.formGroups.controls.splice(index, 1);
  }
}
