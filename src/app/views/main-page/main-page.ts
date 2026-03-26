import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormTeams } from './form-teams/form-teams';
import { TeamsService } from '../../services/teams.service';
import { AudioService } from '../../services/audio';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [FormTeams],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage{

  constructor(
    private readonly router: Router,
    private readonly teamsService: TeamsService,
    private audioService: AudioService
  ) {}

  ngOnInit() {
    this.audioService.unlockAndPlay("ambiente");
  }

  // ── Estado ─────────────────────────────────────────────────
  teamForms  = signal<number[]>([0]);
  teamsData  = signal<{ name: string; participants: string[]; points: number }[]>([]);
  finished   = signal(false);

  // ── Helpers ────────────────────────────────────────────────
  readonly holes = Array(5).fill(0);

  canStart = computed(() => this.finished() && this.teamsData().length > 0);


  // ── Acciones ───────────────────────────────────────────────
  addTeamForm(): void {
    this.teamForms.update(forms => [...forms, forms.length]);
  }

  removeTeamForm(index: number): void {
    this.teamForms.update(forms => forms.filter((_, i) => i !== index));
    this.teamsData.update(data => data.filter((_, i) => i !== index));
    this.teamsService.setTeams(this.teamsData());
    if (this.teamForms().length === 0) {
      this.finished.set(false);
    }
  }

  saveTeam(index: number, data: { name: string; participants: string[] }): void {
    this.teamsData.update(current => {
      const updated = [...current];
      while (updated.length <= index) {
        updated.push({ name: '', participants: [], points: 0 });
      }
      updated[index] = { ...data, points: updated[index]?.points ?? 0 };
      return updated;
    });
    this.teamsService.setTeams(this.teamsData());
  }

  submitAllTeams(): void {
    this.finished.set(true);
    this.teamsService.setTeams(this.teamsData());
  }

  clearAllTeams(): void {
    this.teamForms.set([0]);
    this.teamsData.set([]);
    this.finished.set(false);
    this.teamsService.clear();
  }

  playTeams(): void {
    this.teamsData.update(data =>
      data.map(t => ({ ...t, points: t.points ?? 0 }))
    );
    this.teamsService.setTeams(this.teamsData());
    this.router.navigate(['/play']);
  }
}
