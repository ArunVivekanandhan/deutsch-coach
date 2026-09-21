const SRSEngine = (function() {
    const BOX_SCHEDULE = {0:0, 1:1, 2:3, 3:7, 4:14, 5:30};

    function todayISO(){
        const d = new Date();
        return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    }

    function addDaysISO(days){
        const d = new Date();
        d.setDate(d.getDate()+days);
        return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    }

    class Engine {
        constructor(storageKey, metaKey = null) {
            this.storageKey = storageKey;
            this.metaKey = metaKey;
            this.db = this.load();
            this.meta = this.loadMeta();
        }

        load() {
            try {
                const raw = localStorage.getItem(this.storageKey);
                return raw ? JSON.parse(raw) : {};
            } catch(e) { return {}; }
        }

        save() {
            try { localStorage.setItem(this.storageKey, JSON.stringify(this.db)); } catch(e) {}
        }
        
        loadMeta() {
            if (!this.metaKey) return null;
            try {
                const raw = localStorage.getItem(this.metaKey);
                return raw ? JSON.parse(raw) : {streak:0, lastStudyDate:null, totalReviewed:0};
            } catch(e) { return {streak:0, lastStudyDate:null, totalReviewed:0}; }
        }
        
        saveMeta() {
            if (!this.metaKey) return;
            try { localStorage.setItem(this.metaKey, JSON.stringify(this.meta)); } catch(e) {}
        }

        bumpStreak() {
            if(!this.meta) return;
            const today = todayISO();
            if(this.meta.lastStudyDate === today) return;
            const yesterday = addDaysISO(-1);
            if(this.meta.lastStudyDate === yesterday){
                this.meta.streak = (this.meta.streak||0)+1;
            } else {
                this.meta.streak = 1;
            }
            this.meta.lastStudyDate = today;
        }

        getProg(uid) {
            if (!this.db[uid]) {
                // Support both nextDue (string) and nextReview (timestamp) for backwards compatibility
                this.db[uid] = { box: 1, nextDue: todayISO(), timesSeen: 0, timesWrong: 0 };
            }
            // Ensure nextDue exists
            if (!this.db[uid].nextDue && this.db[uid].nextReview) {
                const d = new Date(this.db[uid].nextReview);
                this.db[uid].nextDue = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
            } else if (!this.db[uid].nextDue) {
                this.db[uid].nextDue = todayISO();
            }
            return this.db[uid];
        }

        isDue(uid) {
            const p = this.db[uid];
            if (!p) return true;
            return (p.nextDue && p.nextDue <= todayISO()) || (p.nextReview && p.nextReview <= Date.now());
        }

        recordResult(uid, correct, qType = null) {
            const p = this.getProg(uid);
            p.timesSeen = (p.timesSeen || 0) + 1;
            if (correct) {
                p.box = Math.min(5, (p.box || 0) + 1);
            } else {
                p.box = 0;
                p.timesWrong = (p.timesWrong || 0) + 1;
            }
            const days = BOX_SCHEDULE[p.box] !== undefined ? BOX_SCHEDULE[p.box] : 30;
            p.nextDue = addDaysISO(days === 0 ? 0 : days);
            
            if (qType) p.lastQType = qType;
            this.save();
            this.bumpStreak();
            if(this.meta) {
                this.meta.totalReviewed = (this.meta.totalReviewed || 0) + 1;
                this.saveMeta();
            }
        }

        markMastered(uid, qType = null) {
            const p = this.getProg(uid);
            p.box = 5;
            p.nextDue = addDaysISO(30);
            if (qType) p.lastQType = qType;
            this.save();
            this.bumpStreak();
        }

        getStats() {
            let due = 0, hard = 0, mastered = 0, totalSeen = 0;
            const today = todayISO();
            const now = Date.now();
            
            for (const k in this.db) {
                totalSeen++;
                const p = this.db[k];
                if ((p.nextDue && p.nextDue <= today) || (p.nextReview && p.nextReview <= now)) {
                    due++;
                }
                if (p.box <= 1) hard++;
                if (p.box >= 4) mastered++;
            }
            return { due, hard, mastered, totalSeen };
        }
    }

    return {
        Engine,
        todayISO,
        addDaysISO
    };
})();
