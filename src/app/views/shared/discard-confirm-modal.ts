import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsService } from '../../services/teams.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discard-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discard-confirm-modal.html',
  styleUrl: './discard-confirm-modal.scss',
})
export class DiscardConfirmModal {
  @Input() visible = false;
  @Output() confirmed = new EventEmitter<boolean>();

  constructor(private readonly router: Router, private readonly teamsService: TeamsService) {}


  public onYes() {
    this.visible = false;
    const ok = Boolean(confirm);
    if (ok) {
      this.teamsService.clear();
      this.router.navigate(['/']);
    }
  }

  public onNo() {
    this.confirmed.emit(false);
  }
}
