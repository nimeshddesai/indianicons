/* assets/js/settings.js
 * Shared display-settings module for both the main portal and the
 * Indian Military Heroes course.  Handles font-size stepping and
 * the dark/light theme toggle, persisted in localStorage.
 *
 * Usage: include this script on any page that has the settings panel
 * HTML in the DOM (see _includes/settings-panel.html).
 */
(function (root, factory) {
  /* CommonJS export for Jest; plain IIFE in browser */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = factory();
  } else {
    factory();
  }
}(this, function () {
  "use strict";

  var FONT_SIZES    = [14, 16, 18, 20, 22];
  var DEFAULT_IDX   = 1; // 16 px
  var STORAGE_KEY   = "indian-icons-settings-v1";

  // ── Load ────────────────────────────────────────────────────────────────

  var settings = (function () {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch (e) { return {}; }
  })();

  // ── Apply ───────────────────────────────────────────────────────────────

  function applySettings() {
    var idx = typeof settings.fontIdx === "number" ? settings.fontIdx : DEFAULT_IDX;
    document.documentElement.style.setProperty("--base-font-size", FONT_SIZES[idx] + "px");
    document.documentElement.setAttribute("data-theme", settings.dark ? "dark" : "");
  }

  function saveSettings() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
    catch (e) {}
  }

  // Apply immediately to prevent flash of wrong theme / font size.
  applySettings();

  // ── UI wiring ────────────────────────────────────────────────────────────

  function initUI() {
    var trigger  = document.getElementById("settingsToggle");
    var panel    = document.getElementById("settingsPanel");
    var fontDec  = document.getElementById("fontDecrease");
    var fontInc  = document.getElementById("fontIncrease");
    var fontVal  = document.getElementById("fontSizeVal");
    var themeTgl = document.getElementById("themeToggle");

    if (!trigger || !panel) return;

    // ── Panel open / close ───────────────────────────────────────────────

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !panel.hidden;
      panel.hidden = open;
      trigger.setAttribute("aria-expanded", String(!open));
    });

    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && e.target !== trigger) {
        panel.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      }
    });

    // ── Font size ────────────────────────────────────────────────────────

    function refreshFontUI() {
      var idx = typeof settings.fontIdx === "number" ? settings.fontIdx : DEFAULT_IDX;
      if (fontVal) fontVal.textContent = FONT_SIZES[idx] + "px";
      if (fontDec) fontDec.disabled = idx <= 0;
      if (fontInc) fontInc.disabled = idx >= FONT_SIZES.length - 1;
    }

    refreshFontUI();

    if (fontDec) {
      fontDec.addEventListener("click", function () {
        var idx = typeof settings.fontIdx === "number" ? settings.fontIdx : DEFAULT_IDX;
        if (idx > 0) {
          settings.fontIdx = idx - 1;
          applySettings(); saveSettings(); refreshFontUI();
        }
      });
    }

    if (fontInc) {
      fontInc.addEventListener("click", function () {
        var idx = typeof settings.fontIdx === "number" ? settings.fontIdx : DEFAULT_IDX;
        if (idx < FONT_SIZES.length - 1) {
          settings.fontIdx = idx + 1;
          applySettings(); saveSettings(); refreshFontUI();
        }
      });
    }

    // ── Theme toggle ─────────────────────────────────────────────────────

    function refreshThemeUI() {
      var icon  = document.getElementById("themeIcon");
      var label = themeTgl ? themeTgl.querySelector(".theme-label") : null;
      if (icon)  icon.textContent = settings.dark ? "☀️" : "🌙";
      if (label) label.textContent = settings.dark ? "Light mode" : "Dark mode";
      if (themeTgl) {
        themeTgl.setAttribute("aria-label",
          settings.dark ? "Switch to light mode" : "Switch to dark mode");
      }
    }

    if (themeTgl) {
      // Seed inner HTML on first load
      themeTgl.innerHTML =
        '<span id="themeIcon">' + (settings.dark ? "☀️" : "🌙") + '</span>' +
        '<span class="theme-label">' + (settings.dark ? "Light mode" : "Dark mode") + '</span>';

      themeTgl.addEventListener("click", function () {
        settings.dark = !settings.dark;
        applySettings(); saveSettings(); refreshThemeUI();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initUI);

  // Expose initUI for testing (CommonJS path only)
  return { initUI: initUI, applySettings: applySettings };
}));
