import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './team-edit-modal.html',
  styleUrl: './team-edit-modal.scss',
})
export class TeamEditModal implements OnChanges {
  @Input() visible = false;
  @Input() teamIndex: number | null = null;
  @Input() team: { name: string; participants: string[]; points?: number } | null = null;
  @Output() apply = new EventEmitter<{ index: number; delta: number }>();
  @Output() closed = new EventEmitter<void>();

  public delta = 0;

  public readonly presets = [
    { label: '+1',  value: 1  },
    { label: '+3',  value: 3  },
    { label: '+5',  value: 5  },
    { label: '+10', value: 10 },
    { label: '−1',  value: -1  },
    { label: '−3',  value: -3  },
    { label: '−5',  value: -5  },
    { label: '−10', value: -10 },
  ];

  get resultPoints(): number {
    return (this.team?.points ?? 0) + (Number(this.delta) || 0);
  }

  ngOnChanges(): void {
    if (this.visible) this.delta = 0;
  }

  public applyPreset(value: number): void {
    this.delta = this.delta === value ? 0 : value;
  }

  public step(dir: 1 | -1): void {
    this.delta = (Number(this.delta) || 0) + dir;
  }

  public onDeltaChange(val: any): void {
    this.delta = Number(val) || 0;
  }

  public onApply(): void {
    if (this.teamIndex === null) return;
    const d = Number(this.delta) || 0;
    this.apply.emit({ index: this.teamIndex, delta: d });
    this.delta = 0;
  }

  public onClose(): void {
    this.delta = 0;
    this.closed.emit();
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
