import { NgClass } from '@angular/common';
import { Component, OnDestroy, signal, computed, inject, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import { AudioService } from '../../services/audio';

@Component({
  selector: 'app-present',
  imports: [NgClass],
  templateUrl: './present-page.html',
  styleUrls: ['./present-page.scss'],
})
export class PresentPage implements OnDestroy, OnInit {
  private routes = inject(Router);
  private audio = inject(AudioService);

  ngOnInit() {
    this.audio.pause();
    this.audio.unlockAndPlay("aventuras");
  }
  // ── Datos ──────────────────────────────────────────────────
  teams = signal<{ name: string; points: number; participants: string[] }[]>(
    JSON.parse(localStorage.getItem('app-cantera-teams') ?? '[]'),
  );

  // ── Estado ceremonia (signals) ─────────────────────────────
  ceremonyStarted = signal(false);
  curtainsVisible = signal(false);
  curtainsOpen = signal(false);
  showCountdown = signal(false);
  countdownValue = signal<number | string>(3);
  countFlicker = signal(false);
  headerVisible = signal(false);
  showDrum = signal(false);
  revealedIndexes = signal(new Set<number>());
  particles = signal<{ style: string }[]>([]);

  // ── Computados ─────────────────────────────────────────────
  sortedTeams = computed(() => [...this.teams()].sort((a, b) => (b.points ?? 0) - (a.points ?? 0)));

  maxPoints = computed(() => Math.max(...this.teams().map((t) => t.points ?? 0), 1));

  filmHoles = Array(8).fill(0);

  private subs = new Subscription();

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getBarPct(team: { points: number }): number {
    return Math.round(((team.points ?? 0) / this.maxPoints()) * 100);
  }

  medalClass(i: number): string {
    return (['gold', 'silver', 'bronze'][i] ?? 'other') as string;
  }

  backToPlay() {
    this.routes.navigate(['/play']);
  }

  private spawnParticles() {
    this.particles.set(
      Array.from({ length: 20 }, () => ({
        style:
          `left:${Math.random() * 100}%;` +
          `top:${Math.random() * 100}%;` +
          `animation-delay:${(Math.random() * 3).toFixed(2)}s;` +
          `animation-duration:${(2 + Math.random() * 4).toFixed(2)}s`,
      })),
    );
  }

  private t(ms: number, fn: () => void) {
    this.subs.add(timer(ms).subscribe(fn));
  }

  beginCeremony() {
    this.ceremonyStarted.set(true);
    this.spawnParticles();

    // 3
    this.showCountdown.set(true);
    this.countdownValue.set(3);
    this.countFlicker.set(true);
    this.t(80, () => {
      this.countFlicker.set(false);

      // 2
      this.t(920, () => {
        this.countdownValue.set(2);
        this.countFlicker.set(true);
        this.t(80, () => {
          this.countFlicker.set(false);

          // 1
          this.t(920, () => {
            this.countdownValue.set(1);
            this.countFlicker.set(true);
            this.t(80, () => {
              this.countFlicker.set(false);

              // 🎬
              this.t(920, () => {
                this.countdownValue.set('Acción');

                this.t(800, () => {
                  this.showCountdown.set(false);

                  // Cortinas aparecen cerradas
                  this.t(100, () => {
                    this.curtainsVisible.set(true);

                    // Cortinas se abren
                    this.t(300, () => {
                      this.curtainsOpen.set(true);

                      // Header
                      this.t(1800, () => {
                        this.headerVisible.set(true);

                        // Revelar equipos
                        this.t(600, () => {
                          this.revealNext(this.sortedTeams().length - 1);
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  private revealNext(i: number) {
    if (i < 0) return;
    const rank = i + 1;

    if (rank <= 3) {
      this.showDrum.set(true);
      this.t(rank === 1 ? 3000 : 1200, () => {
        this.showDrum.set(false);
        this.t(250, () => {
          this.revealedIndexes.set(new Set(this.revealedIndexes()).add(i));
          this.t(rank === 1 ? 2500 : 1500, () => this.revealNext(i - 1));
        });
      });
    } else {
      this.revealedIndexes.set(new Set(this.revealedIndexes()).add(i));
      this.t(1000, () => this.revealNext(i - 1));
    }
  }
}
