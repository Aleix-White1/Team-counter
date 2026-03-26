import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamEditModal } from './team-edit-modal/team-edit-modal';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, TeamEditModal],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss',
})
export class TeamsList {
  @Input() teams: { name: string; participants: string[]; points?: number }[] = [];
  @Output() changed = new EventEmitter<void>();

  public modalVisible = false;
  public editingIndex: number | null = null;

  get rankedTeams() {
    return [...this.teams]
      .map(t => ({ ...t, points: t.points ?? 0 }))
      .sort((a, b) => b.points - a.points);
  }

  get maxPoints(): number {
    return Math.max(...this.teams.map(t => t.points ?? 0), 1);
  }

  get leadingTeam() {
    if (!this.teams.length) return null;
    const leader = [...this.teams].sort((a, b) => (b.points ?? 0) - (a.points ?? 0))[0];
    return (leader.points ?? 0) > 0 ? leader : null;
  }

  public getRank(team: { name: string; points?: number }): number {
    const sorted = [...this.teams].sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    return sorted.findIndex(t => t.name === team.name) + 1;
  }

  public isLeader(index: number): boolean {
    const team = this.teams[index];
    if (!team || (team.points ?? 0) === 0) return false;
    return this.teams.every(t => (team.points ?? 0) >= (t.points ?? 0));
  }

  public openEdit(index: number): void {
    this.editingIndex = index;
    this.modalVisible = true;
  }

  public onApply(event: { index: number; delta: number }): void {
    const i = event.index;
    if (i < 0 || i >= this.teams.length) return;
    this.teams[i].points = (this.teams[i].points ?? 0) + event.delta;
    this.modalVisible = false;
    this.editingIndex = null;
    this.changed.emit();
  }

  public onClose(): void {
    this.modalVisible = false;
    this.editingIndex = null;
  }
}
