const CACHE_KEY = 'florescendo_cache';
const FAV_KEY = 'florescendo_favs';
const HIST_KEY = 'florescendo_hist';
const NOTIF_KEY = 'florescendo_notif';

export const storage = {
  getCached(date) {
    try { const a = JSON.parse(localStorage.getItem(CACHE_KEY)||'{}'); return a[date]||null; } catch { return null; }
  },
  setCached(date, data) {
    try {
      const a = JSON.parse(localStorage.getItem(CACHE_KEY)||'{}');
      const keys = Object.keys(a);
      if (keys.length > 7) delete a[keys[0]];
      a[date] = data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(a));
    } catch {}
  },
  getFavs() { try { return JSON.parse(localStorage.getItem(FAV_KEY)||'[]'); } catch { return []; } },
  saveFav(devo, date) {
    const f = this.getFavs();
    if (f.find(x => x.date === date)) return f;
    const u = [{ date, palavra: devo.palavra, tema: devo.tema, versiculo: devo.versiculo, referencia: devo.referencia, climax: devo.climax }, ...f].slice(0,50);
    localStorage.setItem(FAV_KEY, JSON.stringify(u)); return u;
  },
  removeFav(date) { const u = this.getFavs().filter(f=>f.date!==date); localStorage.setItem(FAV_KEY,JSON.stringify(u)); return u; },
  isFav(date) { return this.getFavs().some(f=>f.date===date); },
  getHist() { try { return JSON.parse(localStorage.getItem(HIST_KEY)||'[]'); } catch { return []; } },
  addHist(devo, date) {
    const h = this.getHist();
    if (h.find(x=>x.date===date)) return h;
    const u = [{ date, palavra: devo.palavra, tema: devo.tema, referencia: devo.referencia }, ...h].slice(0,90);
    localStorage.setItem(HIST_KEY, JSON.stringify(u)); return u;
  },
  getNotif() { return localStorage.getItem(NOTIF_KEY)||'07:00'; },
  setNotif(t) { localStorage.setItem(NOTIF_KEY, t); }
};
