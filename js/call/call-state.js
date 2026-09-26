/* Conversation state machine for the KI-Sprechpartner video call (Task 48).
   One explicit state instead of scattered flags; the UI, the avatar and the audio layer subscribe to changes.

   IDLE → CONNECTING → LISTENING ⇄ USER_SPEAKING → PROCESSING → AI_SPEAKING → LISTENING …
   AI_SPEAKING/PROCESSING → INTERRUPTED (learner barges in) → USER_SPEAKING
   any live state → PAUSED / RECONNECTING / ERROR;   everything → SESSION_ENDED */
(function () {
  const STATES = ['IDLE', 'CONNECTING', 'LISTENING', 'USER_SPEAKING', 'PROCESSING', 'AI_SPEAKING', 'INTERRUPTED',
    'PAUSED', 'RECONNECTING', 'ERROR', 'SESSION_ENDED'];
  const LIVE = ['LISTENING', 'USER_SPEAKING', 'PROCESSING', 'AI_SPEAKING', 'INTERRUPTED'];
  const T = {
    IDLE: ['CONNECTING', 'SESSION_ENDED'],
    CONNECTING: ['LISTENING', 'PROCESSING', 'AI_SPEAKING', 'ERROR', 'RECONNECTING', 'SESSION_ENDED'],
    LISTENING: ['USER_SPEAKING', 'PROCESSING', 'AI_SPEAKING', 'PAUSED', 'RECONNECTING', 'ERROR', 'SESSION_ENDED'],
    USER_SPEAKING: ['LISTENING', 'PROCESSING', 'PAUSED', 'RECONNECTING', 'ERROR', 'SESSION_ENDED'],
    PROCESSING: ['AI_SPEAKING', 'LISTENING', 'INTERRUPTED', 'USER_SPEAKING', 'PAUSED', 'RECONNECTING', 'ERROR', 'SESSION_ENDED'],
    AI_SPEAKING: ['LISTENING', 'PROCESSING', 'INTERRUPTED', 'PAUSED', 'RECONNECTING', 'ERROR', 'SESSION_ENDED'],
    INTERRUPTED: ['USER_SPEAKING', 'LISTENING', 'PROCESSING', 'PAUSED', 'SESSION_ENDED'],
    PAUSED: ['LISTENING', 'PROCESSING', 'AI_SPEAKING', 'SESSION_ENDED'],
    RECONNECTING: ['LISTENING', 'PROCESSING', 'AI_SPEAKING', 'ERROR', 'PAUSED', 'SESSION_ENDED'],
    ERROR: ['CONNECTING', 'LISTENING', 'PROCESSING', 'RECONNECTING', 'SESSION_ENDED'],
    SESSION_ENDED: []
  };
  class CallStateMachine {
    constructor() { this.state = 'IDLE'; this.listeners = new Set(); this.history = []; }
    can(to) { return (T[this.state] || []).includes(to); }
    /* returns false (and records it) for a transition that is not allowed — callers never end up in an impossible state */
    go(to, info) {
      if (to === this.state) return true;
      if (!this.can(to)) { this.history.push({ from: this.state, to, rejected: true, t: Date.now() }); return false; }
      const from = this.state;
      this.state = to;
      this.history.push({ from, to, t: Date.now(), info });
      if (this.history.length > 200) this.history.shift();
      this.listeners.forEach(f => { try { f(to, from, info); } catch (e) { /* a broken listener must not stop the call */ } });
      return true;
    }
    is(...s) { return s.includes(this.state); }
    live() { return LIVE.includes(this.state); }
    on(f) { this.listeners.add(f); return () => this.listeners.delete(f); }
  }
  window.DCCall = window.DCCall || {};
  DCCall.CallStateMachine = CallStateMachine;
  DCCall.STATES = STATES;
  DCCall.TRANSITIONS = T;
})();
