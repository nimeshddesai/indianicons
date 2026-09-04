(function () {
  "use strict";

  const BASE_PATH = "/indianmilitaryheroes";

  const app = document.getElementById("app");
  const storageKey = "indian-icons-course-progress-v2";

  // Display settings (font size + dark mode) are now handled by
  // /assets/js/settings.js which is loaded before this script.

  // ─── State ────────────────────────────────────────────────────────────────

  const state = {
    route: parseRoute(),
    course: null,
    progress: loadProgress()
  };

  window.addEventListener("hashchange", () => {
    state.route = parseRoute();
    if (state.route.name !== "modules") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    render();
  });

  init();

  // ─── Boot ────────────────────────────────────────────────────────────────

  async function init() {
    renderLoading("Loading the course…");
    try {
      state.course = await fetchJson(BASE_PATH + "/data/course.json");
      render();
    } catch (err) {
      renderError(
        "Course data could not be loaded. Make sure <code>data/course.json</code> exists, " +
        "or serve the folder with a local server (e.g. <code>npx serve .</code>)."
      );
    }
  }

  async function fetchJson(url) {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  // ─── Routing ─────────────────────────────────────────────────────────────

  function parseRoute() {
    const raw = window.location.hash.replace(/^#/, "") || "home";
    const parts = raw.split("/");
    // routes: home | modules | module/<id>[/<lessonId|summary>] | certificate
    return { name: parts[0], moduleId: parts[1], lessonId: parts[2] };
  }

  function render() {
    if (!state.course) { renderLoading("Loading…"); return; }

    const { name, moduleId, lessonId } = state.route;

    if (name === "module" && moduleId) {
      renderModulePage(moduleId, lessonId);
      return;
    }
    if (name === "certificate") {
      renderCertificate();
      return;
    }
    renderHome();
    if (name === "modules") {
      requestAnimationFrame(() => {
        const el = document.getElementById("modules");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // ─── Progress helpers ────────────────────────────────────────────────────

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) ||
        { completed: {}, scores: {}, reflections: {}, moduleQuizScores: {} };
    } catch {
      return { completed: {}, scores: {}, reflections: {}, moduleQuizScores: {} };
    }
  }

  function saveProgress() {
    localStorage.setItem(storageKey, JSON.stringify(state.progress));
  }

  function allLessons() {
    if (!state.course) return [];
    return state.course.modules
      .filter(m => !m.optional)
      .flatMap(m => m.lessons.map(l => ({ module: m, lesson: l })));
  }

  function coreModules() {
    if (!state.course) return [];
    return state.course.modules.filter(m => !m.optional);
  }

  function optionalModules() {
    if (!state.course) return [];
    return state.course.modules.filter(m => m.optional);
  }

  function completedCount() {
    return Object.values(state.progress.completed).filter(Boolean).length;
  }

  function moduleCompletedCount(mod) {
    return mod.lessons.filter(l => state.progress.completed[l.id]).length;
  }

  function isModuleSummaryUnlocked(mod) {
    return moduleCompletedCount(mod) === mod.lessons.length;
  }

  function isModuleQuizDone(moduleId) {
    return !!state.progress.moduleQuizScores[moduleId];
  }

  // A module is locked when the previous module's quiz is not yet done.
  // Module 1 (index 0) is always unlocked.
  // Optional modules unlock only after ALL core modules are completed + quizzed.
  function isModuleLocked(mod) {
    const all = state.course.modules;
    const idx = all.indexOf(mod);
    if (idx === 0) return false;
    if (mod.optional) {
      return !coreModules().every(m => isModuleQuizDone(m.id));
    }
    const prev = all[idx - 1];
    return !isModuleQuizDone(prev.id);
  }

  // ─── HOME ────────────────────────────────────────────────────────────────

  function renderHome() {
    const total = allLessons().length;
    const done = completedCount();
    const firstMod = state.course.modules[0];
    const firstLesson = firstMod.lessons[0];

    const optMods = optionalModules();
    app.innerHTML = `
      <section class="hero" id="home">
        <div>
          <p class="eyebrow">Six-week self-learning course</p>
          <h1>${esc(state.course.title)}</h1>
          <p class="lead">${esc(state.course.subtitle)}</p>
          <div class="hero-actions">
            <a class="button" href="#module/${firstMod.id}/${firstLesson.id}">Start Week 1</a>
            <a class="button secondary" href="#modules">View All Modules</a>
          </div>
        </div>
        <aside class="hero-panel" aria-label="Course progress">
          <div class="stat-grid">
            <div class="stat"><strong>${coreModules().length}</strong><span>weeks</span></div>
            <div class="stat"><strong>${total}</strong><span>stories</span></div>
            <div class="stat"><strong>${done}</strong><span>completed</span></div>
          </div>
          ${progressBar(done, total)}
          <p class="source-note">${esc(state.course.sourceNote)}</p>
        </aside>
      </section>

      <section class="section" id="modules">
        <div class="section-head">
          <div>
            <p class="eyebrow">Modules</p>
            <h2>Six weeks. Thirty stories. One nation.</h2>
            <p>Each week covers a different war India has fought. Read the stories, answer the quizzes, reflect, and earn the module badge.</p>
          </div>
          <a class="button secondary" href="#certificate">Certificate</a>
        </div>
        <div class="grid">
          ${coreModules().map(moduleCardMarkup).join("")}
        </div>
      </section>

      ${optMods.length ? `
      <section class="section optional-section">
        <div class="optional-section-inner">
          <p class="eyebrow optional-eyebrow">Optional Bonus Module</p>
          <p class="optional-desc">These stories are not required for the certificate but are well worth reading.</p>
          <div class="optional-grid">
            ${optMods.map(moduleCardMarkup).join("")}
          </div>
        </div>
      </section>` : ""}
    `;
  }

  function moduleCardMarkup(mod) {
    const total = mod.lessons.length;
    const done = moduleCompletedCount(mod);
    const quizDone = isModuleQuizDone(mod.id);
    const locked = isModuleLocked(mod);
    const lockedReason = mod.optional
      ? "Complete all 6 modules and their quizzes to unlock"
      : "Complete the previous module's quiz to unlock";

    // Determine where to navigate when the module button is clicked.
    // If progress has been made, land on the first incomplete lesson (or summary
    // if all lessons are done but the quiz hasn't been taken yet).
    const nextIncomplete = mod.lessons.find(l => !state.progress.completed[l.id]);
    const resumeTarget = done === 0
      ? mod.lessons[0].id
      : (nextIncomplete ? nextIncomplete.id : (quizDone ? mod.lessons[0].id : "summary"));
    const buttonLabel = done > 0 ? "Resume Module" : "Open Module";

    const lessonsPill = locked
      ? '<span class="pill locked-pill">🔒 Locked</span>'
      : `<span class="pill green">${done}/${total} lessons${quizDone ? " · quiz ✓" : ""}</span>`;

    return `
      <article class="card module-card${mod.optional ? " optional-card" : ""}${locked ? " locked" : ""}">
        <div class="module-meta">
          ${mod.optional ? '<span class="pill optional">Optional</span>' : `<span class="pill gold">Week ${mod.week}</span>`}
          ${lessonsPill}
        </div>
        <h3>${esc(mod.title)}</h3>
        <p class="mod-war">${esc(mod.war)} · ${esc(mod.period)}</p>
        <p class="mod-focus">${esc(mod.focus)}</p>
        <div class="pill-row">
          ${mod.lessons.map(l => `<span class="pill">${esc(l.hero)}</span>`).join("")}
        </div>
        <div class="module-card-footer">
          ${locked ? "" : progressBar(done, total)}
          ${locked
            ? `<p class="locked-msg">${esc(lockedReason)}</p>`
            : `<a class="button secondary module-open-btn" href="#module/${mod.id}/${resumeTarget}">${buttonLabel}</a>`
          }
        </div>
      </article>
    `;
  }

  // ─── MODULE PAGE ─────────────────────────────────────────────────────────

  function renderModulePage(moduleId, lessonId) {
    const mod = state.course.modules.find(m => m.id === moduleId) || state.course.modules[0];
    if (isModuleLocked(mod)) { window.location.hash = "home"; return; }
    const lesson = mod.lessons.find(l => l.id === lessonId) || null;
    const showSummary = lessonId === "summary";

    const done = moduleCompletedCount(mod);
    const quizDone = isModuleQuizDone(mod.id);

    app.innerHTML = `
      <section class="module-layout">
        <aside class="sidebar">
          <a class="button ghost" href="#modules">← All modules</a>
          <div class="card module-card">
            <span class="pill gold">Week ${mod.week}</span>
            <h2>${esc(mod.title)}</h2>
            <p class="mod-war">${esc(mod.war)}</p>
            ${progressBar(done, mod.lessons.length)}
          </div>
          <nav class="lesson-list" aria-label="Lessons">
            ${mod.lessons.map(l => `
              <button class="lesson-tab ${l.id === lessonId ? "active" : ""} ${state.progress.completed[l.id] ? "complete" : ""}"
                      data-route="#module/${mod.id}/${l.id}">
                ${esc(l.hero)}
              </button>
            `).join("")}
            <button class="lesson-tab summary-tab ${showSummary ? "active" : ""} ${quizDone ? "complete" : ""}"
                    data-route="#module/${mod.id}/summary"
                    ${done < mod.lessons.length ? "disabled title='Complete all lessons to unlock'" : ""}>
              📋 Module Summary &amp; Quiz
            </button>
          </nav>
        </aside>

        <article class="lesson" id="lesson-content">
          ${showSummary ? moduleSummaryMarkup(mod) : (lesson ? lessonMarkup(mod, lesson) : "<p>Lesson not found.</p>")}
        </article>
      </section>
    `;

    app.querySelectorAll("[data-route]").forEach(btn => {
      btn.addEventListener("click", () => { window.location.hash = btn.dataset.route; });
    });

    if (showSummary) {
      bindModuleQuiz(mod);
    } else if (lesson) {
      bindLesson(mod, lesson);
    }
  }

  // ─── LESSON ───────────────────────────────────────────────────────────────

  function lessonMarkup(mod, lesson) {
    const savedReflection = state.progress.reflections[lesson.id] || "";
    const score = state.progress.scores[`${mod.id}:${lesson.id}`];
    const idx = mod.lessons.indexOf(lesson);
    const prevLesson = idx > 0 ? mod.lessons[idx - 1] : null;
    const nextLesson = idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null;
    const isSummaryUnlocked = isModuleSummaryUnlocked(mod);
    return `
      <header class="lesson-hero">
        ${lesson.photoUrl ? `<div class="hero-photo"><img src="${escAttr(lesson.photoUrl)}" alt="${escAttr(lesson.hero)}" loading="lazy" /></div>` : ""}
        <div class="lesson-meta">
          <span class="pill gold">Week ${mod.week}</span>
          <span class="pill">${esc(lesson.award)}</span>
          <span class="pill">${esc(lesson.years)}</span>
          <span class="pill">${esc(lesson.regiment)}</span>
        </div>
        <h1>${esc(lesson.hero)}</h1>
        <p class="lead">${esc(lesson.hook)}</p>
        <div class="actions">
          ${lesson.link ? `<a class="button secondary" href="${escAttr(lesson.link)}" target="_blank" rel="noreferrer noopener">Learn More ↗</a>` : ""}
          <button class="button secondary" id="completeLesson">
            ${state.progress.completed[lesson.id] ? "✓ Marked Complete" : "Mark Complete"}
          </button>
        </div>
      </header>

      <section class="story-blocks" aria-label="Hero story">
        ${lesson.blocks.map(b => `
          <div class="story-block">
            <h3>${esc(b.title)}</h3>
            ${b.body.split("\n\n").map(para => `<p>${esc(para.trim())}</p>`).join("")}
          </div>
        `).join("")}
      </section>

      <section class="reflection" aria-label="Reflection">
        <h2>Reflect</h2>
        <p class="reflection-prompt">${esc(lesson.reflection)}</p>
        <textarea class="textarea" id="reflectionText" placeholder="Write your thoughts here. They are saved in this browser only.">${esc(savedReflection)}</textarea>
        <div class="actions">
          <button class="button secondary" id="saveReflection">Save Reflection</button>
        </div>
        <div class="feedback" id="reflectionFeedback" aria-live="polite"></div>
      </section>

      <section class="quiz" id="lessonQuiz" aria-label="Story quiz">
        <h2>Quick Quiz</h2>
        ${score ? `<p class="feedback">Last score: ${score.correct}/${score.total}</p>` : "<p>Answer all five questions, then check your score.</p>"}
        ${lesson.quiz.map((q, i) => questionMarkup(q, i, "lq")).join("")}
        <div class="actions">
          <button class="button" id="checkQuiz">Check Answers</button>
          <button class="button secondary" id="resetQuiz">Reset</button>
        </div>
        <div class="feedback" id="quizFeedback" aria-live="polite"></div>
      </section>

      <nav class="lesson-nav" aria-label="Story navigation">
        <button class="button secondary lesson-nav-btn" id="prevLesson"
          ${prevLesson ? `data-route="#module/${mod.id}/${prevLesson.id}"` : 'data-route="#modules"'}
          aria-label="${prevLesson ? "Previous story: " + prevLesson.hero : "Back to all modules"}">
          ← ${prevLesson ? esc(prevLesson.hero) : "All Modules"}
        </button>
        <span class="lesson-nav-count" aria-label="Story ${idx + 1} of ${mod.lessons.length}">
          ${idx + 1} / ${mod.lessons.length}
        </span>
        ${nextLesson ? `
        <button class="button lesson-nav-btn" id="nextLesson"
          data-route="#module/${mod.id}/${nextLesson.id}"
          aria-label="Next story: ${escAttr(nextLesson.hero)}">
          ${esc(nextLesson.hero)} →
        </button>
        ` : `
        <button class="button lesson-nav-btn" id="nextLesson"
          data-route="#module/${mod.id}/summary"
          ${!isSummaryUnlocked ? "disabled title='Complete all lessons to unlock the summary'" : ""}
          aria-label="Go to module summary">
          Module Summary →
        </button>
        `}
      </nav>
    `;
  }

  function bindLesson(mod, lesson) {
    byId("completeLesson").addEventListener("click", () => {
      state.progress.completed[lesson.id] = true;
      saveProgress();
      gtag("event", "course_story_complete", {
        week_number: mod.week,
        module_id: mod.id,
        module_title: mod.title,
        story_hero: lesson.hero,
        lesson_id: lesson.id
      });
      renderModulePage(mod.id, lesson.id);
    });

    byId("checkQuiz").addEventListener("click", () => {
      const result = evaluateQuiz("lq", lesson.quiz);
      state.progress.scores[`${mod.id}:${lesson.id}`] = result;
      if (result.correct === result.total) {
        state.progress.completed[lesson.id] = true;
        saveProgress();
        gtag("event", "course_story_quiz_passed", {
          week_number: mod.week,
          module_id: mod.id,
          module_title: mod.title,
          story_hero: lesson.hero,
          lesson_id: lesson.id,
          score: result.correct,
          total: result.total
        });
        // Re-render so the sidebar summary tab unlocks immediately.
        // Restore the feedback message after the DOM is replaced.
        renderModulePage(mod.id, lesson.id);
        byId("quizFeedback").textContent =
          `Perfect score! ${result.correct}/${result.total} — lesson complete.`;
      } else {
        saveProgress();
        byId("quizFeedback").textContent =
          `${result.correct}/${result.total} correct. Review the story and try again.`;
      }
    });

    byId("resetQuiz").addEventListener("click", () => resetQuiz("lq", lesson.quiz.length));

    byId("saveReflection").addEventListener("click", () => {
      state.progress.reflections[lesson.id] = byId("reflectionText").value.trim();
      saveProgress();
      byId("reflectionFeedback").textContent = "Reflection saved.";
      setTimeout(() => { byId("reflectionFeedback").textContent = ""; }, 2500);
    });

  }

  // ─── MODULE SUMMARY & QUIZ ────────────────────────────────────────────────

  function moduleSummaryMarkup(mod) {
    const score = state.progress.moduleQuizScores[mod.id];
    const lastLesson = mod.lessons[mod.lessons.length - 1];
    return `
      <header class="lesson-hero summary-header">
        <div class="lesson-meta">
          <span class="pill gold">Week ${mod.week} — Module Complete</span>
          <span class="pill">${esc(mod.war)}</span>
          <span class="pill">${esc(mod.period)}</span>
        </div>
        <h1>Module Summary: ${esc(mod.title)}</h1>
        <p class="lead">${esc(mod.focus)}</p>
      </header>

      <section class="story-blocks" aria-label="War summary">
        <div class="story-block summary-block">
          <h3>About This War</h3>
          ${mod.summary.split("\n\n").map(para => `<p>${esc(para.trim())}</p>`).join("")}
        </div>
      </section>

      <section class="activity-section">
        <h2>Module Activity</h2>
        <p>${esc(mod.activity)}</p>
        <p><strong>Challenge:</strong> ${esc(mod.challenge)}</p>
      </section>

      <section class="hero-roll" aria-label="Heroes of this module">
        <h2>Heroes of Week ${mod.week}</h2>
        <div class="hero-roll-grid">
          ${mod.lessons.map(l => `
            <div class="hero-roll-card ${state.progress.completed[l.id] ? "done" : ""}">
              <strong>${esc(l.hero)}</strong>
              <span>${esc(l.award)}</span>
              <span class="hero-roll-years">${esc(l.years)}</span>
              ${state.progress.completed[l.id] ? '<span class="badge-check">✓ Complete</span>' : ""}
            </div>
          `).join("")}
        </div>
      </section>

      <section class="quiz" id="moduleQuiz" aria-label="Module quiz">
        <h2>Module Quiz</h2>
        <p class="quiz-desc">Five questions on the war covered in Week ${mod.week}. All five lessons must be completed to unlock this quiz.</p>
        ${score ? `<p class="feedback">Last score: ${score.correct}/${score.total}${score.correct === score.total ? " — Module badge earned! 🏅" : ""}</p>` : ""}
        ${mod.moduleQuiz.map((q, i) => questionMarkup(q, i, "mq")).join("")}
        <div class="actions">
          <button class="button" id="checkModuleQuiz">Check Module Quiz</button>
          <button class="button secondary" id="resetModuleQuiz">Reset</button>
        </div>
        <div class="feedback" id="moduleQuizFeedback" aria-live="polite"></div>
      </section>

      <nav class="lesson-nav" aria-label="Story navigation">
        <button class="button secondary lesson-nav-btn" id="prevLesson"
          data-route="#module/${mod.id}/${lastLesson.id}"
          aria-label="Previous story: ${escAttr(lastLesson.hero)}">
          ← ${esc(lastLesson.hero)}
        </button>
        <span class="lesson-nav-count">Summary</span>
        <button class="button lesson-nav-btn" id="nextLesson"
          data-route="#modules"
          aria-label="Back to all modules">
          All Modules →
        </button>
      </nav>
    `;
  }

  function bindModuleQuiz(mod) {
    byId("checkModuleQuiz").addEventListener("click", () => {
      const result = evaluateQuiz("mq", mod.moduleQuiz);
      state.progress.moduleQuizScores[mod.id] = result;
      saveProgress();
      if (result.correct === result.total) {
        gtag("event", "course_module_complete", {
          week_number: mod.week,
          module_id: mod.id,
          module_title: mod.title,
          war: mod.war,
          score: result.correct,
          total: result.total
        });
      }
      byId("moduleQuizFeedback").textContent =
        result.correct === result.total
          ? `Outstanding! ${result.correct}/${result.total} — Module badge earned! 🏅`
          : `${result.correct}/${result.total} correct. Review the war summary and try again.`;
    });

    byId("resetModuleQuiz").addEventListener("click", () => resetQuiz("mq", mod.moduleQuiz.length));

  }

  // ─── Quiz utilities ───────────────────────────────────────────────────────

  function questionMarkup(question, index, prefix) {
    return `
      <fieldset class="question" data-qi="${index}" data-prefix="${prefix}">
        <legend><strong>${index + 1}. ${esc(question.question)}</strong></legend>
        ${question.options.map((opt, oi) => `
          <label class="option">
            <input type="radio" name="${prefix}_q${index}" value="${oi}" />
            <span>${esc(opt)}</span>
          </label>
        `).join("")}
      </fieldset>
    `;
  }

  function evaluateQuiz(prefix, questions) {
    let correct = 0;
    questions.forEach((q, i) => {
      const fieldset = app.querySelector(`.question[data-qi="${i}"][data-prefix="${prefix}"]`);
      if (!fieldset) return;
      const selected = fieldset.querySelector("input:checked");
      fieldset.querySelectorAll(".option").forEach(l => l.classList.remove("correct", "wrong"));
      const correctLabel = fieldset.querySelector(`input[value="${q.answer}"]`)?.closest(".option");
      if (correctLabel) correctLabel.classList.add("correct");
      if (selected) {
        if (Number(selected.value) === q.answer) {
          correct++;
        } else {
          selected.closest(".option").classList.add("wrong");
        }
      }
    });
    return { correct, total: questions.length };
  }

  function resetQuiz(prefix, count) {
    for (let i = 0; i < count; i++) {
      const fieldset = app.querySelector(`.question[data-qi="${i}"][data-prefix="${prefix}"]`);
      if (!fieldset) continue;
      fieldset.querySelectorAll("input").forEach(inp => { inp.checked = false; });
      fieldset.querySelectorAll(".option").forEach(l => l.classList.remove("correct", "wrong"));
    }
    const fb = byId(prefix === "lq" ? "quizFeedback" : "moduleQuizFeedback");
    if (fb) fb.textContent = "";
  }

  // ─── Certificate ──────────────────────────────────────────────────────────

  function renderCertificate() {
    const core = coreModules();
    const total = allLessons().length;
    const done = completedCount();
    const allModulesQuizzed = core.every(m => isModuleQuizDone(m.id));
    const ready = done === total && allModulesQuizzed;

    const badges = core.map(m => {
      const lessonsDone = isModuleSummaryUnlocked(m);
      const quizDone = isModuleQuizDone(m.id);
      const earned = lessonsDone && quizDone;
      return `
        <div class="badge-card ${earned ? "earned" : ""}">
          <strong>Week ${m.week}</strong>
          <span>${esc(m.title)}</span>
          <span class="badge-status">${earned ? "🏅 Earned" : lessonsDone ? "Quiz pending" : `${moduleCompletedCount(m)}/${m.lessons.length} lessons`}</span>
        </div>
      `;
    }).join("");

    const quizzedCount = core.filter(m => isModuleQuizDone(m.id)).length;

    app.innerHTML = `
      <section class="section">
        <div class="certificate">
          <p class="eyebrow">Certificate of Completion</p>
          <h1>Indian Military Heroes</h1>
          <p class="lead">Complete all 30 story lessons and all 6 module quizzes to earn your certificate.</p>
          ${progressBar(done, total)}
          <p class="cert-status">Stories: ${done}/${total} &nbsp;|&nbsp; Module quizzes: ${quizzedCount}/${core.length}</p>
          <div class="badge-wall">${badges}</div>
          <div class="actions" style="justify-content:center;margin-top:24px">
            <input class="certificate-name" id="learnerName" placeholder="Your name" />
            <button class="button" id="makeCertificate" ${ready ? "" : "disabled"}>Generate Certificate</button>
          </div>
          <div class="certificate-preview" id="certificatePreview">
            <p class="eyebrow">${ready ? "Ready to generate" : "Complete the course first"}</p>
            <h2>${ready ? "Enter your name above and click Generate." : `${done}/${total} stories · ${quizzedCount}/${core.length} module quizzes`}</h2>
          </div>
        </div>
      </section>
    `;

    const btn = byId("makeCertificate");
    if (btn) {
      btn.addEventListener("click", () => {
        const name = byId("learnerName").value.trim() || "A dedicated learner";
        const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
        byId("certificatePreview").innerHTML = `
          <p class="eyebrow">Certificate of Completion</p>
          <h2>${esc(name)}</h2>
          <p>has completed the <strong>Indian Military Heroes</strong> six-week story course,<br>
          studying 30 stories of courage, sacrifice, and service across six weeks,<br>
          completing all story quizzes and module-level assessments.</p>
          <p style="margin-top:12px;color:var(--muted);font-size:0.9rem">Issued: ${today}</p>
          <div class="badge-wall" style="justify-content:center;margin-top:16px">
            ${core.map(m => `<span class="pill green">Week ${m.week} 🏅</span>`).join("")}
          </div>
        `;
      });
    }
  }

  // ─── UI helpers ───────────────────────────────────────────────────────────

  function renderLoading(msg) {
    app.innerHTML = `
      <section class="section empty-state">
        <p class="eyebrow">Please wait</p>
        <h1>${msg}</h1>
      </section>`;
  }

  function renderError(msg) {
    app.innerHTML = `
      <section class="section empty-state">
        <p class="eyebrow">Setup needed</p>
        <h1>Course data could not load.</h1>
        <p class="lead">${msg}</p>
      </section>`;
  }

  function progressBar(done, total) {
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `
      <div class="progress-wrap">
        <div class="progress-label"><span>Progress</span><strong>${pct}%</strong></div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-bar" style="width:${pct}%"></div>
        </div>
      </div>`;
  }

  function byId(id) { return document.getElementById(id); }

  function esc(v) {
    return String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escAttr(v) { return esc(v).replace(/`/g, "&#096;"); }
})();
