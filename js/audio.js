class AudioManager {
  constructor() {
    this.context = null;
    this.gainNode = null;
    this.currentSource = null;
    this.currentTrackIndex = -1;
    this.isPlaying = false;
    this.isMuted = false;
    this.userActivated = false;
    this.tracks = [
      { id: 'era1', src: 'assets/audio/ambient-1.mp3', volume: 0.3, sections: [1,2,3] },
      { id: 'era2', src: 'assets/audio/ambient-2.mp3', volume: 0.25, sections: [4,5] },
      { id: 'era3', src: 'assets/audio/ambient-3.mp3', volume: 0.2, sections: [6,7,8,9] }
    ];
    this.lastSection = 0;
    this.button = document.getElementById('audio-toggle');
    this.init();
  }

  init() {
    this.button.addEventListener('click', () => this.toggle());
    document.addEventListener('scroll', () => this.activate(), { once: true });
    document.addEventListener('click', () => this.activate(), { once: true });
    document.addEventListener('keydown', () => this.activate(), { once: true });
  }

  async activate() {
    if (this.userActivated) return;
    this.userActivated = true;
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    if (this.context.state === 'suspended') await this.context.resume();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0;
    this.gainNode.connect(this.context.destination);
    this.button.classList.remove('muted');
    this.tryPlayTrack(this.getTrackForSection(1));
  }

  toggle() {
    if (!this.userActivated) return;
    this.isMuted = !this.isMuted;
    this.button.classList.toggle('muted', this.isMuted);
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : (this.tracks[this.currentTrackIndex]?.volume || 0.3);
    }
  }

  getTrackForSection(section) {
    return this.tracks.find(t => t.sections.includes(section)) || this.tracks[0];
  }

  async tryPlayTrack(track) {
    if (!this.context || !this.userActivated) return;
    if (this.currentSource && this.currentSource._trackId === track.id) return;
    if (this.currentSource) {
      await this.fadeOut(this.gainNode, 500);
      try { this.currentSource.stop(); } catch(e) {}
      this.currentSource.disconnect();
    }
    this.currentTrackIndex = this.tracks.indexOf(track);
    try {
      const response = await fetch(track.src);
      if (!response.ok) throw new Error('Audio file not found');
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      const source = this.context.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;
      source._trackId = track.id;
      source.connect(this.gainNode);
      source.start(0);
      this.currentSource = source;
      this.isPlaying = true;
      await this.fadeIn(this.gainNode, track.volume, 800);
    } catch (err) {
      console.warn('AudioManager: track not available —', track.src, err.message);
      this.currentTrackIndex = -1;
    }
  }

  fadeOut(gain, duration) {
    return new Promise(resolve => {
      if (!gain) { resolve(); return; }
      const current = gain.gain.value;
      gain.gain.linearRampToValueAtTime(0, this.context.currentTime + duration / 1000);
      setTimeout(resolve, duration + 50);
    });
  }

  fadeIn(gain, target, duration) {
    return new Promise(resolve => {
      if (!gain) { resolve(); return; }
      gain.gain.setValueAtTime(0, this.context.currentTime);
      gain.gain.linearRampToValueAtTime(this.isMuted ? 0 : target, this.context.currentTime + duration / 1000);
      setTimeout(resolve, duration + 50);
    });
  }

  onSectionChange(section) {
    if (this.lastSection === section) return;
    this.lastSection = section;
    const track = this.getTrackForSection(section);
    if (track && this.tracks.indexOf(track) !== this.currentTrackIndex) {
      this.tryPlayTrack(track);
    }
  }
}
