/* Patty Passport — "Join the crew" application flow (crew.html). A real
   inline application form, not an email link: role picker, availability,
   work details and a PDF CV upload, with client-side validation and a
   polished confirmation state. Front-end only — nothing is transmitted or
   stored anywhere, same honesty pattern as the events enquiry form and the
   investors partner-enquiry modal (see master brief §0.1). */
(function () {
  var RED = "#ec3013", YEL = "#f2b30c", BLU = "#2b76c9", INK = "#1b1a19", CREAM = "#f7f3ec";

  var ROLES = [
    "Floor crew", "Kitchen crew", "Shift lead", "Events staff", "Kids / party host",
    "Bar / drinks station", "Guest experience / desk", "Route-night performer / event support",
    "Marketing / partnerships", "Other"
  ];
  var AVAILABILITY = ["Weekday lunch", "Weekday evening", "Weekend", "Route nights & events"];
  var WORK_AUTH = ["Authorised to work in Spain", "Not yet — need sponsorship info", "Prefer to discuss with the desk"];
  var PERKS = ["Paid trial shift", "Staff meal every shift", "Route-night bonus on event nights", "Clear path to Shift Lead"];
  var MAX_CV_BYTES = 8 * 1024 * 1024;

  var FIELD_IDS = {
    name: "cr-ap-name", email: "cr-ap-email", phone: "cr-ap-phone", city: "cr-ap-city",
    start: "cr-ap-start", languages: "cr-ap-languages", portfolio: "cr-ap-portfolio",
    cover: "cr-ap-cover", experience: "cr-ap-experience"
  };

  var state = { submitted: false, role: null, availability: [], workAuth: null, cvFile: null, cvError: "", refId: "", fields: {} };

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fieldEl(id) { return document.getElementById(id); }
  function fieldVal(id) { var el = fieldEl(id); return el ? (el.value || "").trim() : ""; }
  function bytes(n) { return n >= 1024 * 1024 ? (n / (1024 * 1024)).toFixed(1) + " MB" : Math.round(n / 1024) + " KB"; }

  function renderPerks() {
    var root = document.getElementById("cr-apply-perks");
    if (!root) return;
    root.innerHTML = PERKS.map(function (p) {
      return '<span style="display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border:2px solid rgba(255,255,255,.4);font:600 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.06em"><span style="width:6px;height:6px;background:#f2b30c;display:block"></span>' + esc(p) + '</span>';
    }).join("");
  }

  function renderRoleTeasers() {
    var root = document.getElementById("cr-apply-roles");
    if (!root) return;
    root.innerHTML = ROLES.map(function (r) {
      var on = state.role === r;
      return '<button type="button" data-act="quick-role" data-val="' + esc(r) + '" style="padding:10px 13px;background:' + (on ? "#1b1a19" : "transparent") + ';border:2px solid #fff;color:' + (on ? "#f2b30c" : "#fff") + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.08em;cursor:pointer" data-hover="background:#fff;color:#2b76c9">' + esc(r) + '</button>';
    }).join("");
  }

  function fieldsData() {
    return [
      { id: FIELD_IDS.name, label: "Full name *", ph: "Your name", type: "text" },
      { id: FIELD_IDS.email, label: "Email *", ph: "you@example.com", type: "email" },
      { id: FIELD_IDS.phone, label: "Phone *", ph: "+34 …", type: "tel" },
      { id: FIELD_IDS.city, label: "City / area *", ph: "Where you're based", type: "text" },
      { id: FIELD_IDS.start, label: "Preferred start date *", ph: "e.g. Mon 6 Oct 2026, or ASAP", type: "text" },
      { id: FIELD_IDS.languages, label: "Languages spoken", ph: "e.g. Spanish, English, Arabic", type: "text" },
      { id: FIELD_IDS.portfolio, label: "Portfolio / LinkedIn / website", ph: "Optional link", type: "text" },
      { id: FIELD_IDS.cover, label: "Short intro / cover note", ph: "Why this route, why now — a few lines is plenty", type: "textarea", full: true },
      { id: FIELD_IDS.experience, label: "Work experience", ph: "Hospitality, events, kitchen, customer-facing, or other relevant work", type: "textarea", full: true }
    ];
  }

  function inputHtml(f) {
    var current = state.fields[f.id] || "";
    if (f.type === "textarea") {
      return '<textarea id="' + f.id + '" rows="3" placeholder="' + esc(f.ph) + '" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:400 14px/1.5 \'Archivo\',sans-serif;padding:0 0 8px;outline:none;resize:vertical" data-field>' + esc(current) + '</textarea>';
    }
    return '<input type="' + f.type + '" id="' + f.id + '" value="' + esc(current) + '" placeholder="' + esc(f.ph) + '" style="width:100%;background:transparent;border:0;border-bottom:2px solid #1b1a19;color:#1b1a19;font:800 15px/1.3 \'Archivo\',sans-serif;padding:0 0 8px;outline:none" data-field />';
  }

  function chipGroup(opts, selected, multi, act) {
    return opts.map(function (o) {
      var on = multi ? selected.indexOf(o) > -1 : selected === o;
      return '<button type="button" data-act="' + act + '" data-val="' + esc(o) + '" style="padding:10px 13px;background:' + (on ? INK : "transparent") + ';border:2px solid #1b1a19;color:' + (on ? CREAM : INK) + ';font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.06em;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c;color:#1b1a19">' + esc(o) + '</button>';
    }).join("");
  }

  function cvBoxHtml() {
    if (!state.cvFile) {
      return '<span style="display:flex;align-items:center;gap:10px;flex:1 1 220px"><span style="width:34px;height:34px;flex:none;border:2px solid #1b1a19;display:flex;align-items:center;justify-content:center;font:800 9px/1 \'Archivo\',sans-serif">PDF</span><span style="font:600 12.5px/1.4 \'Archivo\',sans-serif;color:#605d5d">No file selected yet — PDF only, up to 8&nbsp;MB.</span></span>'
        + '<button type="button" data-act="cv-choose" style="padding:11px 16px;background:#1b1a19;color:#f7f3ec;border:0;font:800 11px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer" data-hover="background:#ec3013">Choose PDF file</button>';
    }
    return '<span style="display:flex;align-items:center;gap:10px;flex:1 1 220px"><span style="width:34px;height:34px;flex:none;background:#1f7a3d;color:#fff;display:flex;align-items:center;justify-content:center;font:800 9px/1 \'Archivo\',sans-serif">PDF</span><span><span style="display:block;font:800 13px/1.3 \'Archivo\',sans-serif">' + esc(state.cvFile.name) + '</span><span style="display:block;font:600 10.5px/1.4 \'Archivo\',sans-serif;color:#605d5d">' + bytes(state.cvFile.size) + ' · ready to submit</span></span></span>'
      + '<button type="button" data-act="cv-choose" style="padding:11px 14px;background:transparent;color:#1b1a19;border:2px solid #1b1a19;font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer" data-hover="background:#f2b30c;border-color:#f2b30c">Change</button>'
      + '<button type="button" data-act="cv-remove" style="padding:11px 14px;background:transparent;color:#ae1800;border:2px solid rgba(27,26,25,.28);font:800 10.5px/1 \'Archivo\',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer" data-hover="border-color:#ec3013">Remove</button>';
  }

  function renderForm() {
    var fields = fieldsData().map(function (f) {
      return '<label style="display:block;margin-bottom:0;' + (f.full ? "grid-column:1/-1" : "") + '"><span style="display:block;font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7d7979;margin-bottom:9px">' + f.label + '</span>' + inputHtml(f) + '<span data-field-error style="display:none;color:#ec3013;font:600 10.5px/1.4 \'Archivo\',sans-serif;margin-top:6px"></span></label>';
    }).join("");

    return '<div style="max-width:1000px;margin:0 auto;padding:36px 32px 44px">'
      + '<div style="font:600 9.5px/1 \'Archivo\',sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#7d7979;margin-bottom:6px">Application</div>'
      + '<h3 style="font:800 26px/1.08 \'Archivo\',sans-serif;letter-spacing:-.02em;margin:0 0 26px">TELL US ABOUT YOU.</h3>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:24px 28px;margin-bottom:26px">' + fields + '</div>'

      + '<div style="margin-bottom:22px"><span style="display:block;font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7d7979;margin-bottom:10px">Role applying for *</span>'
      + '<div id="cr-ap-role-group" style="display:flex;flex-wrap:wrap;gap:8px">' + chipGroup(ROLES, state.role, false, "pick-role") + '</div>'
      + '<span data-field-error="role" style="display:none;color:#ec3013;font:600 10.5px/1.4 \'Archivo\',sans-serif;margin-top:8px"></span></div>'

      + '<div style="margin-bottom:22px"><span style="display:block;font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7d7979;margin-bottom:10px">Availability * <span style="text-transform:none;font-weight:400">(pick all that fit)</span></span>'
      + '<div id="cr-ap-avail-group" style="display:flex;flex-wrap:wrap;gap:8px">' + chipGroup(AVAILABILITY, state.availability, true, "pick-avail") + '</div>'
      + '<span data-field-error="availability" style="display:none;color:#ec3013;font:600 10.5px/1.4 \'Archivo\',sans-serif;margin-top:8px"></span></div>'

      + '<div style="margin-bottom:30px"><span style="display:block;font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7d7979;margin-bottom:10px">Right to work <span style="text-transform:none;font-weight:400">(optional — only if relevant to you)</span></span>'
      + '<div id="cr-ap-workauth-group" style="display:flex;flex-wrap:wrap;gap:8px">' + chipGroup(WORK_AUTH, state.workAuth, false, "pick-workauth") + '</div></div>'

      + '<div style="margin-bottom:8px"><span style="display:block;font:600 9px/1 \'Archivo\',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#7d7979;margin-bottom:10px">CV upload (PDF) *</span>'
      + '<div id="cr-ap-cv-box" style="border:2px dashed rgba(27,26,25,.35);padding:18px 20px;display:flex;align-items:center;flex-wrap:wrap;gap:12px">' + cvBoxHtml() + '</div>'
      + '<input type="file" id="cr-ap-cv-input" accept="application/pdf,.pdf" style="display:none" />'
      + '<span data-field-error="cv" style="display:' + (state.cvError ? "block" : "none") + ';color:#ec3013;font:600 10.5px/1.4 \'Archivo\',sans-serif;margin-top:8px">' + esc(state.cvError) + '</span></div>'

      + '<div id="cr-ap-summary" role="status" style="display:none;margin-top:22px;padding:16px 18px;background:rgba(236,48,19,.08);color:#ec3013;font:600 12.5px/1.5 \'Archivo\',sans-serif"></div>'

      + '<button type="button" data-act="submit-application" style="display:inline-flex;align-items:center;width:100%;margin-top:24px;padding:17px 20px;background:#ec3013;border:0;color:#fff;font:800 14.5px/1.1 \'Archivo\',sans-serif;letter-spacing:.04em;cursor:pointer" data-hover="background:#1b1a19">Submit application<span style="margin-left:auto">→</span></button>'
      + '<p style="font:400 11px/1.55 \'Archivo\',sans-serif;color:#7d7979;margin:14px 0 0">Front-end demo — nothing here is uploaded or transmitted yet. Prefer email right now? Write to <a href="mailto:crew@pattypassport.com" style="color:#ae1800">crew@pattypassport.com</a> with your CV attached.</p>'
      + '</div>';
  }

  function renderSuccess() {
    var roleLine = state.role ? state.role : "a role";
    var name = fieldEl(FIELD_IDS.name);
    return '<div style="max-width:760px;margin:0 auto;padding:44px 32px 52px">'
      + '<div style="width:84px;height:84px;border:3px solid #1f7a3d;color:#1f7a3d;display:flex;align-items:center;justify-content:center;font:800 12px/1 \'Archivo\',sans-serif;letter-spacing:.04em;transform:rotate(-9deg);margin-bottom:22px">FILED</div>'
      + '<h3 style="font:800 32px/1.05 \'Archivo\',sans-serif;letter-spacing:-.03em;margin:0 0 10px">Application filed — reference ' + esc(state.refId) + '</h3>'
      + '<p style="font:400 14.5px/1.6 \'Archivo\',sans-serif;color:#444141;margin:0 0 28px;max-width:60ch">Thanks for applying for <strong>' + esc(roleLine) + '</strong>. The crew desk reviews every file by hand — here is what happens next.</p>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));border-top:2px solid #1b1a19;border-left:2px solid #1b1a19;margin-bottom:28px">'
      + [
        ["01", "Crew desk review", "Your file and CV are reviewed within 3 working days."],
        ["02", "A call or email", "Shortlisted applicants hear back to book a paid trial shift."],
        ["03", "Trial, then offer", "Work a real shift on your route, then talk terms if it's a fit."]
      ].map(function (s) {
        return '<div style="border-right:2px solid #1b1a19;border-bottom:2px solid #1b1a19;padding:18px 17px 20px;background:#f7f3ec">'
          + '<div style="font:800 22px/1 \'Archivo\',sans-serif;letter-spacing:-.02em;color:#f2b30c;opacity:.8;margin-bottom:8px">' + s[0] + '</div>'
          + '<div style="font:800 13.5px/1.2 \'Archivo\',sans-serif;margin-bottom:6px">' + s[1] + '</div>'
          + '<div style="font:400 11.5px/1.45 \'Archivo\',sans-serif;color:#605d5d">' + s[2] + '</div></div>';
      }).join("")
      + '</div>'
      + '<button type="button" data-act="reset-application" style="display:inline-flex;align-items:center;padding:14px 18px;background:#1b1a19;border:0;color:#f7f3ec;font:800 12.5px/1.1 \'Archivo\',sans-serif;cursor:pointer" data-hover="background:#f2b30c;color:#1b1a19">Submit another application<span style="margin-left:auto"></span></button>'
      + '<p style="font:400 11px/1.55 \'Archivo\',sans-serif;color:#7d7979;margin:16px 0 0">Front-end demo — this reference wasn\'t actually sent anywhere. Write to <a href="mailto:crew@pattypassport.com" style="color:#ae1800">crew@pattypassport.com</a> to reach the crew desk today.</p>'
      + '</div>';
  }

  function renderPanel() {
    var root = document.getElementById("cr-apply-panel");
    if (!root) return;
    root.innerHTML = state.submitted ? renderSuccess() : renderForm();
    var cvInput = document.getElementById("cr-ap-cv-input");
    if (cvInput) cvInput.addEventListener("change", onCvChange);
    if (window.initHoverStyles) window.initHoverStyles(document.body);
  }

  function render() {
    renderPerks();
    renderRoleTeasers();
    renderPanel();
    if (window.initHoverStyles) window.initHoverStyles(document.body);
    if (window.PP_REVEAL) window.PP_REVEAL.init();
  }

  function onCvChange(e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf) { state.cvFile = null; state.cvError = "That file isn't a PDF — please choose a .pdf file."; }
    else if (file.size > MAX_CV_BYTES) { state.cvFile = null; state.cvError = "That file is over 8 MB — please choose a smaller PDF."; }
    else { state.cvFile = file; state.cvError = ""; }
    renderPanel();
  }

  function setChipError(sel, msg) {
    var el = document.querySelector('[data-field-error="' + sel + '"]');
    if (!el) return;
    el.textContent = msg;
    el.style.display = msg ? "block" : "none";
  }
  function setFieldError(id, msg) {
    var input = fieldEl(id);
    if (!input) return;
    var label = input.closest("label");
    var err = label && label.querySelector("[data-field-error]");
    input.style.borderBottomColor = msg ? "#ec3013" : "#1b1a19";
    if (err) { err.textContent = msg || ""; err.style.display = msg ? "block" : "none"; }
  }

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function trySubmit() {
    [FIELD_IDS.name, FIELD_IDS.email, FIELD_IDS.phone, FIELD_IDS.city, FIELD_IDS.start].forEach(function (id) { setFieldError(id, ""); });
    setChipError("role", ""); setChipError("availability", ""); setChipError("cv", "");

    var name = fieldVal(FIELD_IDS.name), email = fieldVal(FIELD_IDS.email), phone = fieldVal(FIELD_IDS.phone),
      city = fieldVal(FIELD_IDS.city), start = fieldVal(FIELD_IDS.start);

    var errors = [];
    if (!name) { errors.push("Add your full name."); setFieldError(FIELD_IDS.name, "Required"); }
    if (!email) { errors.push("Add an email so the desk can reply."); setFieldError(FIELD_IDS.email, "Required"); }
    else if (!EMAIL_RE.test(email)) { errors.push("That email address doesn't look right."); setFieldError(FIELD_IDS.email, "Check this address"); }
    if (!phone) { errors.push("Add a phone number."); setFieldError(FIELD_IDS.phone, "Required"); }
    if (!city) { errors.push("Add the city or area you're based in."); setFieldError(FIELD_IDS.city, "Required"); }
    if (!start) { errors.push("Add a preferred start date."); setFieldError(FIELD_IDS.start, "Required"); }
    if (!state.role) { errors.push("Pick the role you're applying for."); setChipError("role", "Pick one role above"); }
    if (!state.availability.length) { errors.push("Pick at least one availability slot."); setChipError("availability", "Pick at least one"); }
    if (!state.cvFile) { errors.push("Attach your CV as a PDF."); setChipError("cv", state.cvError || "A PDF CV is required"); }

    var summary = document.getElementById("cr-ap-summary");
    if (errors.length) {
      if (summary) {
        summary.style.display = "block";
        summary.innerHTML = '<strong style="display:block;margin-bottom:6px">Please fix the following:</strong><ul style="margin:0;padding-left:18px">' + errors.map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>";
      }
      return;
    }

    state.submitted = true;
    state.refId = "PP-CR-" + Math.floor(1000 + Math.random() * 9000);
    renderPanel();
    var panel = document.getElementById("cr-apply-panel");
    if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetApplication() {
    state = { submitted: false, role: null, availability: [], workAuth: null, cvFile: null, cvError: "", refId: "", fields: {} };
    render();
    var target = document.getElementById("cr-apply");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function onClick(e) {
    var el = e.target.closest("[data-act]");
    if (!el) return;
    var act = el.getAttribute("data-act"), val = el.getAttribute("data-val");
    switch (act) {
      case "quick-role":
        state.role = val;
        render();
        var panel = document.getElementById("cr-apply-panel");
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "pick-role":
        state.role = val; renderPanel(); break;
      case "pick-avail":
        var idx = state.availability.indexOf(val);
        if (idx > -1) state.availability.splice(idx, 1); else state.availability.push(val);
        renderPanel(); break;
      case "pick-workauth":
        state.workAuth = state.workAuth === val ? null : val; renderPanel(); break;
      case "cv-choose":
        var input = document.getElementById("cr-ap-cv-input");
        if (input) input.click();
        break;
      case "cv-remove":
        state.cvFile = null; state.cvError = "";
        var input2 = document.getElementById("cr-ap-cv-input");
        if (input2) input2.value = "";
        renderPanel(); break;
      case "submit-application":
        trySubmit(); break;
      case "reset-application":
        resetApplication(); break;
    }
  }

  function onInput(e) {
    if (!e.target.hasAttribute || !e.target.hasAttribute("data-field")) return;
    state.fields[e.target.id] = e.target.value;
  }

  window.PP_READY(function () {
    document.body.addEventListener("click", onClick);
    document.body.addEventListener("input", onInput);
    if (window.PP_TRACK) window.PP_TRACK(function () {
      document.body.removeEventListener("click", onClick);
      document.body.removeEventListener("input", onInput);
    });
    render();
    if (!window.PP_DATA) {
      var poll = setInterval(function () { if (window.PP_DATA) { clearInterval(poll); render(); } }, 60);
    }
  });
})();
