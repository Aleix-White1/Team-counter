import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder, FormGroup, FormArray, FormControl,
  ReactiveFormsModule, Validators, AbstractControl, ValidationErrors
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-teams',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-teams.html',
  styleUrl: './form-teams.scss',
})
export class FormTeams {

  @Input() finished = false;
  @Output() submitTeam = new EventEmitter<{ name: string; participants: string[] }>();

  public formTeam: FormGroup;
  public saved = false;

  constructor(private readonly fb: FormBuilder) {
    this.formTeam = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      participants: this.fb.array([])
    });
    const parts = this.formTeam.get('participants') as FormArray;
    parts.setValidators(this.minOneParticipantValidator);
  }

  get participants(): FormArray {
    return this.formTeam.get('participants') as FormArray;
  }

  get nameLength(): number {
    return (this.formTeam.get('name')?.value || '').length;
  }

  public addMemberTeam(): void {
    this.participants.push(new FormControl('', Validators.required));
  }

  public removeMemberTeam(index: number): void {
    this.participants.removeAt(index);
  }

  public onSubmitTeam(): void {
    if (this.formTeam.invalid) {
      this.formTeam.markAllAsTouched();
      return;
    }

    const name = this.formTeam.value.name.trim();
    const participants = (this.formTeam.value.participants || [])
      .map((p: string) => (p || '').trim())
      .filter(Boolean);

    this.submitTeam.emit({ name, participants });
    this.saved = true;
    this.formTeam.disable();
  }

  private minOneParticipantValidator(control: AbstractControl): ValidationErrors | null {
    const arr = control as FormArray;
    if (!arr?.controls) return { required: true };
    const has = arr.controls.some(c => (c.value || '').toString().trim().length > 0);
    return has ? null : { atLeastOne: true };
  }
}
