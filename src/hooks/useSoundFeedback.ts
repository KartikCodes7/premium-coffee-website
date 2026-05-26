'use client';

export function useSoundFeedback() {
  const playSound = (type: 'pip' | 'chime' | 'success') => {
    if (typeof window === 'undefined') return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      
      if (type === 'pip') {
        // Apple-grade subtle high-frequency feedback pip for cart additions
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, audioCtx.currentTime); // High frequency pip
        
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime); // Very soft
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08); // Blazing fast fade
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'chime') {
        // Subtle double-tap chime for waiter alert
        const now = audioCtx.currentTime;
        const playNote = (time: number, freq: number) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, time);
          
          gainNode.gain.setValueAtTime(0.025, time);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.start(time);
          osc.stop(time + 0.12);
        };
        
        playNote(now, 880); // A5 note
        playNote(now + 0.07, 1046.50); // C6 note
      } else if (type === 'success') {
        // Gentle low-frequency warm chord tone for order success
        const now = audioCtx.currentTime;
        const playChordNode = (freq: number, volume: number) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          
          gainNode.gain.setValueAtTime(volume, now);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.start(now);
          osc.stop(now + 0.5);
        };
        
        playChordNode(523.25, 0.015); // C5
        playChordNode(659.25, 0.015); // E5
        playChordNode(783.99, 0.015); // G5
      }
    } catch (e) {
      console.warn('Web Audio API not supported or user gesture required:', e);
    }
  };

  return { playSound };
}
