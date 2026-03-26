import { Injectable } from '@angular/core';

export interface TeamData {
  name: string;
  participants: string[];
  points?: number;
}

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private _teams: TeamData[] = [];
  private readonly storageKey = 'app-cantera-teams';

  constructor() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) this._teams = JSON.parse(raw) as TeamData[];
    } catch {
      this._teams = [];
    }
  }

  setTeams(teams: TeamData[]) {
    this._teams = teams.map(t => ({ ...t }));
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this._teams));
    } catch {
      // ignore storage errors
    }
  }

  getTeams(): TeamData[] {
    return this._teams;
  }

  clear() {
    this._teams = [];
    try { localStorage.removeItem(this.storageKey); } catch {}
  }
}
