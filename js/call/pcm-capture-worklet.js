/* AudioWorklet: hands the microphone signal to the main thread in blocks of 2048 samples (Task 48).
   Used for the OpenAI transcription STT (utterance audio incl. 0.4 s pre-roll). */
class DCPcmCapture extends AudioWorkletProcessor {
  constructor() { super(); this.buf = new Float32Array(2048); this.n = 0; }
  process(inputs) {
    const ch = inputs[0] && inputs[0][0];
    if (ch) {
      for (let i = 0; i < ch.length; i++) {
        this.buf[this.n++] = ch[i];
        if (this.n === this.buf.length) { this.port.postMessage(this.buf.slice(0)); this.n = 0; }
      }
    }
    return true;
  }
}
registerProcessor('dc-pcm-capture', DCPcmCapture);
