// ==========================================
// Unified Progress Aggregator (read-only)
// ==========================================
// This app's learning data is split across several independent localStorage
// keys that were never designed as one system. They do NOT all share the
// same shape:
//   dc_progress_v1, na_progress_v1, vt_progress_v1  - real vocabulary SRS
//     data: { uid: { box, nextDue, timesWrong, timesSeen } }, all readable
//     via SRSEngine.Engine.
//   gp_progress_v1        - a grammar-quiz streak counter { currentStreak, bestStreak }
//   sb_progress_v1        - a sentence-building completion counter { key: count }
//   a2_studio_progress_v2, b1_studio_progress_v1 - practice-studio module
//     completion flags { completed: { moduleId: true } }
//   wmg_progress_v1, sps_progress_v1              - referenced by old code but
//     never actually written anywhere; always empty.
//
// Blending all of these into one number would misrepresent what's actually
// known, so this module only aggregates the three genuine vocabulary SRS
// stores for a "words due/difficult/mastered" figure, and exposes lesson
// completion counts as a separate, honestly-labeled figure. It never
// fabricates a number it can't support with real data, and it never writes
// to storage - existing per-page engines remain the source of truth for
// their own reads/writes.
const ProgressAggregator = (function(){
    const VOCAB_STORES = ['dc_progress_v1', 'na_progress_v1', 'vt_progress_v1'];
    const STUDIO_STORES = ['a2_studio_progress_v2', 'b1_studio_progress_v1'];

    function getVocabularyStats(){
        let due = 0, difficult = 0, mastered = 0, reviewed = 0;
        VOCAB_STORES.forEach(key => {
            try {
                if (typeof SRSEngine === 'undefined') return;
                const engine = new SRSEngine.Engine(key, null);
                const s = engine.getStats();
                due += s.due;
                difficult += s.hard;
                mastered += s.mastered;
                reviewed += s.totalSeen;
            } catch(e) { /* a malformed or missing store just contributes 0 */ }
        });
        return { due, difficult, mastered, reviewed };
    }

    function getLessonsCompleted(){
        let completed = 0;
        STUDIO_STORES.forEach(key => {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const data = JSON.parse(raw);
                if (data && data.completed) {
                    completed += Object.values(data.completed).filter(Boolean).length;
                }
            } catch(e) { /* ignore */ }
        });
        return completed;
    }

    function getStreak(){
        // dc_meta_v1 is the only place a streak is actually tracked today -
        // it only advances when studying through deutsch-coach.html.
        try {
            const raw = localStorage.getItem('dc_meta_v1');
            if (!raw) return 0;
            const meta = JSON.parse(raw);
            return meta.streak || 0;
        } catch(e) { return 0; }
    }

    return { getVocabularyStats, getLessonsCompleted, getStreak, VOCAB_STORES, STUDIO_STORES };
})();
