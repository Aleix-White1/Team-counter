import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TeamsList } from '../teams/teams-list';
import { TeamsService } from '../../services/teams.service';
import { DiscardConfirmModal } from '../shared/discard-confirm-modal';
import { AudioService } from '../../services/audio';

@Component({
  selector: 'app-play-page',
  standalone: true,
  imports: [CommonModule, TeamsList, DiscardConfirmModal],
  templateUrl: './play-page.html',
  styleUrl: './play-page.scss',
})
export class PlayPage implements AfterViewInit {
  public modalVisible = false;

  private readonly router = inject(Router);
  private readonly teamsService = inject(TeamsService);
  private readonly audio = inject(AudioService);

  ngAfterViewInit() {
    console.log('PlayPage initialized, unlocking audio...', this.audio);
    this.audio.pause();
    this.audio.unlockAndPlay('ambiente');
  }
  get teams() {
    return this.teamsService.getTeams();
  }

  public back(): void {
    this.onDiscardConfirm(true);
    this.router.navigate(['/']);
  }

  public goToPresent(): void {
    this.router.navigate(['/present']);
  }

  public onDiscardConfirm(confirm: any) {
    this.modalVisible = true;
    const ok = Boolean(confirm);
    if (ok) {
      this.teamsService.clear();
      this.router.navigate(['/']);
    }
  }

  public onTeamsChanged(): void {
    this.teamsService.setTeams(this.teams);
  }
}
