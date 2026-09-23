/* Patty Passport — window.PP_AUTH: a demo-only "signed in" adapter.

   This is NOT a real authentication system. There is no server, no
   password hashing, no session token — "the account" is a single JSON
   record sitting in this browser's own localStorage (key: pp_auth_v1),
   readable by anyone with access to this device. It exists so the
   passport/rewards pages have something real to sign in and out of
   (and so a stamp spread survives a reload) rather than resetting to
   nothing on every visit. Every surface that uses it says so plainly —
   never present this as a secure account to a guest.

   Other scripts read/write the account through this adapter instead of
   touching localStorage directly, so the storage key and shape only
   live in one place, and get PP_AUTH.onChange()/the native "storage"
   event for free when another open tab signs in, out, or edits the
   record. */
(function () {
  var STORAGE_KEY = "pp_auth_v1";
  var listeners = [];

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function write(rec) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rec)); } catch (e) { /* private mode / storage blocked */ }
    notify();
  }
  function notify() {
    var user = read();
    listeners.slice().forEach(function (fn) { try { fn(user); } catch (e) { /* ignore a bad listener */ } });
  }

  window.PP_AUTH = {
    current: function () { return read(); },
    isSignedIn: function () { return !!read(); },

    // Creates (or overwrites) the one demo account this browser can
    // hold — there is no multi-account support, matching a single
    // shared paper passport per browser rather than a real user system.
    signUp: function (data) {
      data = data || {};
      var rec = {
        name: String(data.name || "Traveller").trim() || "Traveller",
        email: String(data.email || "").trim(),
        passportType: data.passportType || "explorer",
        stamps: Array.isArray(data.stamps) ? data.stamps.slice() : [],
        memberSince: Date.now()
      };
      write(rec);
      return rec;
    },

    // Demo "log in": there's no password to check against a server, so
    // this only ever resumes the one account already stored on this
    // browser — if the email doesn't match (or nothing is stored yet)
    // it returns null instead of fabricating a login, and the caller is
    // expected to say so honestly rather than claim success.
    logIn: function (email) {
      var rec = read();
      if (!rec) return null;
      if (email && rec.email && rec.email.toLowerCase() !== String(email).toLowerCase()) return null;
      notify();
      return rec;
    },

    logOut: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
      notify();
    },

    // Shallow-merges a patch into the current record (used for stamp
    // edits, passport-type switches, avatar swaps) — no-ops if signed
    // out, since there is nothing to update.
    update: function (patch) {
      var rec = read();
      if (!rec) return null;
      var next = {};
      Object.keys(rec).forEach(function (k) { next[k] = rec[k]; });
      Object.keys(patch || {}).forEach(function (k) { next[k] = patch[k]; });
      write(next);
      return next;
    },

    // Subscribe to every change to the account — sign up, log in, log
    // out, or an update — whether it happened in this tab or another
    // one open on the same site. Returns an unsubscribe function.
    onChange: function (fn) {
      listeners.push(fn);
      return function () {
        var i = listeners.indexOf(fn);
        if (i > -1) listeners.splice(i, 1);
      };
    }
  };

  // Cross-tab sync: the native "storage" event only fires in OTHER tabs
  // when one tab writes to localStorage, which is exactly what lets a
  // sign-out (or a stamp added) in one tab update every other open tab
  // instead of leaving them showing a stale account.
  window.addEventListener("storage", function (e) {
    if (e.key === STORAGE_KEY) notify();
  });
})();
