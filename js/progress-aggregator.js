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

    // Extracts a CEFR level from a progress-store uid, using each store's own
    // known uid scheme (see each owner page's `.forEach(v => v.uid = ...)`
    // line). Returns null if it can't be determined honestly rather than
    // guessing - e.g. Nomen_Adjektiv_Trainer's adjective entries ('a|word',
    // no level segment) simply aren't attributable to a level and are
    // excluded from the by-level breakdown (they still count in the totals
    // from getVocabularyStats()).
    //
    // Verb data (vt_progress_v1) only distinguishes A1/A2/B1/B2 - it has no
    // B1.1/B1.2 split the way dc_progress_v1/na_progress_v1 do - so B1.1 and
    // B1.2 are combined into one "B1" bucket here for a consistent, honest
    // breakdown across all three stores rather than guessing which half a
    // verb belongs to.
    function levelFromUid(key, uid){
        let level = null;
        if (key === 'dc_progress_v1') {
            level = uid.split('|')[0]; // "level|topic|word"
        } else if (key === 'vt_progress_v1') {
            level = uid.split('|')[0]; // "level|inf"
        } else if (key === 'na_progress_v1') {
            const parts = uid.split('|');
            if (parts[0] === 'n' && parts.length >= 2) level = parts[1]; // "n|level|sg"
            // 'a|word' (adjectives) has no level segment - stays null
        }
        if (!level) return null;
        if (level === 'B1.1' || level === 'B1.2') return 'B1';
        if (level === 'A1' || level === 'A2' || level === 'B1' || level === 'B2') return level;
        return null;
    }

    function getVocabularyStatsByLevel(){
        const byLevel = { A1: { mastered: 0, reviewed: 0 }, A2: { mastered: 0, reviewed: 0 }, B1: { mastered: 0, reviewed: 0 }, B2: { mastered: 0, reviewed: 0 } };
        VOCAB_STORES.forEach(key => {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;
                const db = JSON.parse(raw);
                for (const uid in db) {
                    const level = levelFromUid(key, uid);
                    if (!level || !byLevel[level]) continue;
                    byLevel[level].reviewed++;
                    if ((db[uid].box || 0) >= 4) byLevel[level].mastered++;
                }
            } catch(e) { /* a malformed store just contributes 0 for that key */ }
        });
        return byLevel;
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

    return { getVocabularyStats, getVocabularyStatsByLevel, getLessonsCompleted, getStreak, VOCAB_STORES, STUDIO_STORES };
})();
