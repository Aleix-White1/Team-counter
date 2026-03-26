import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private audio = new Audio('assets/ambiente.mp3');
  private audio2 = new Audio('assets/aventuras.mp3');
  private unlocked = false;

  constructor() {
    this.audio.loop = true;
    this.audio.volume = 0.3;
  }

  unlockAndPlay(audio: string) {
    if (audio === 'ambiente') {
      this.audio
        .play()
        .then(() => {
          this.unlocked = true;
        })
        .catch((err) => {
          console.log('Audio aún bloqueado:', err);
        });
    } else if (audio === 'aventuras') {
      this.audio2
        .play()
        .then(() => {
          this.unlocked = true;
        })
        .catch((err) => {
          console.log('Audio aún bloqueado:', err);
        });

      if (this.unlocked) return;
    }
  }

  pause() {
    this.audio.pause();
  }

  resume() {
    this.audio.play();
  }
}
