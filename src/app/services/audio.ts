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

  private started = false;

  initUserInteraction() {
    if (this.started) return;

    const startAudio = () => {
      this.audio.loop = true;
      this.audio.volume = 0.5;

      this.audio.play()
        .then(() => {
          this.started = true;
          window.removeEventListener('click', startAudio);
        })
        .catch(err => console.error(err));
    };

    window.addEventListener('click', startAudio);
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
