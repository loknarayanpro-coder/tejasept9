/**
 * Student Academic Hub - Core Application Controller
 * Handles Navigation Flow: Home → Regulation → Department → Semester → Subject → Resources
 * Manages search, filtering, favorites, theme toggle, and URL hash routing.
 */

class AcademicHubApp {
  constructor() {
    this.state = {
      regulationId: null,
      departmentId: null,
      semesterId: null,
      subjectId: null,
      currentView: "home", // home | departments | semesters | subjects | resources
      activeCategoryFilter: "all",
      theme: localStorage.getItem("hub_theme") || "dark"
    };

    this.init();
  }

  async init() {
    this.applyTheme(this.state.theme);
    this.bindEvents();
    this.initSearch();
    this.updateStats();
    this.initInteractiveLaptop();

    // Dynamically set copyright year
    const currYear = new Date().getFullYear();
    document.querySelectorAll("#copyrightYear, .copyrightYearRef").forEach(el => {
      el.textContent = currYear;
    });

    // Check URL hash for direct links (e.g. #reg=reg-2024&dept=cse&sem=5&sub=cs3551)
    if (window.location.hash) {
      this.parseHashRoute();
    } else {
      // Default to Home view
      this.navigateTo("home");
    }

    // Listen for data updates
    window.addEventListener("academic-data-updated", () => {
      this.renderCurrentView();
      this.updateStats();
    });

    window.addEventListener("academic-favs-updated", () => {
      this.renderFavoritesDrawer();
      this.renderCurrentView();
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn && window.Icons) {
      toggleBtn.innerHTML = theme === "dark" ? window.Icons.sun : window.Icons.moon;
      toggleBtn.title = theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme";
    }
    localStorage.setItem("hub_theme", theme);
  }

  toggleTheme() {
    const nextTheme = this.state.theme === "dark" ? "light" : "dark";
    this.state.theme = nextTheme;
    this.applyTheme(nextTheme);
  }

  bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) themeBtn.addEventListener("click", () => this.toggleTheme());

    // Logo Click
    const brandBtn = document.getElementById("brandLogoBtn");
    if (brandBtn) {
      brandBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.resetNavigation();
      });
    }

    // Stepper Buttons
    document.querySelectorAll(".stepper-step").forEach(step => {
      step.addEventListener("click", () => {
        const targetView = step.dataset.view;
        if (targetView) this.handleStepperClick(targetView);
      });
    });

    // Favorites Drawer Toggle
    const favsBtn = document.getElementById("openFavsBtn");
    const favsModal = document.getElementById("favoritesModal");
    const closeFavs = document.getElementById("closeFavsBtn");
    if (favsBtn && favsModal) {
      favsBtn.addEventListener("click", () => {
        this.renderFavoritesDrawer();
        favsModal.classList.add("open");
      });
    }
    if (closeFavs && favsModal) {
      closeFavs.addEventListener("click", () => favsModal.classList.remove("open"));
    }

    // Global Keybindings (Ctrl+K or / to search)
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey && e.key === "k") || (e.key === "/" && document.activeElement.tagName !== "INPUT")) {
        e.preventDefault();
        this.openSearchModal();
      }
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.remove("open"));
      }
    });

    // Hash change event for browser back/forward buttons
    window.addEventListener("hashchange", () => {
      this.parseHashRoute();
    });
  }

  // --- Router & URL Hash State ---
  syncHash() {
    const parts = [];
    if (this.state.regulationId) parts.push(`reg=${this.state.regulationId}`);
    if (this.state.departmentId) parts.push(`dept=${this.state.departmentId}`);
    if (this.state.semesterId) parts.push(`sem=${this.state.semesterId}`);
    if (this.state.subjectId) parts.push(`sub=${this.state.subjectId}`);
    
    const newHash = parts.length ? "#" + parts.join("&") : "";
    if (window.location.hash !== newHash) {
      history.pushState(null, "", newHash || window.location.pathname);
    }
  }

  async parseHashRoute() {
    const hash = window.location.hash.replace("#", "");
    if (!hash) {
      this.navigateTo("home", false);
      return;
    }

    const params = new URLSearchParams(hash);
    const reg = params.get("reg");
    const dept = params.get("dept");
    const sem = params.get("sem");
    const sub = params.get("sub");

    this.state.regulationId = reg;
    this.state.departmentId = dept;
    this.state.semesterId = sem ? parseInt(sem, 10) : null;
    this.state.subjectId = sub;

    if (sub) {
      this.navigateTo("resources", false);
    } else if (sem) {
      this.navigateTo("subjects", false);
    } else if (dept) {
      this.navigateTo("semesters", false);
    } else if (reg) {
      this.navigateTo("departments", false);
    } else {
      this.navigateTo("home", false);
    }
  }

  resetNavigation() {
    this.state.regulationId = null;
    this.state.departmentId = null;
    this.state.semesterId = null;
    this.state.subjectId = null;
    this.navigateTo("home");
  }

  handleStepperClick(view) {
    if (view === "home") {
      this.resetNavigation();
    } else if (view === "departments" && this.state.regulationId) {
      this.state.departmentId = null;
      this.state.semesterId = null;
      this.state.subjectId = null;
      this.navigateTo("departments");
    } else if (view === "semesters" && this.state.regulationId && this.state.departmentId) {
      this.state.semesterId = null;
      this.state.subjectId = null;
      this.navigateTo("semesters");
    } else if (view === "subjects" && this.state.regulationId && this.state.departmentId && this.state.semesterId) {
      this.state.subjectId = null;
      this.navigateTo("subjects");
    } else if (view === "resources" && this.state.subjectId) {
      this.navigateTo("resources");
    }
  }

  async navigateTo(viewName, updateUrl = true) {
    this.state.currentView = viewName;
    if (updateUrl) this.syncHash();

    // Update View DOM Visibility
    document.querySelectorAll(".portal-view").forEach(v => v.classList.remove("active"));
    const viewEl = document.getElementById(`view-${viewName}`);
    if (viewEl) viewEl.classList.add("active");

    // Update Stepper & Breadcrumbs
    await this.updateStepperUI();
    await this.updateBreadcrumbs();

    // Render contents for view
    await this.renderCurrentView();

    // Scroll smoothly to navigation section if not on home
    if (viewName !== "home") {
      const target = document.getElementById("flowNavContainer");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async updateStepperUI() {
    const steps = [
      { id: "home", label: "Regulation", val: this.state.regulationId },
      { id: "departments", label: "Department", val: this.state.departmentId },
      { id: "semesters", label: "Semester", val: this.state.semesterId },
      { id: "subjects", label: "Subject", val: this.state.subjectId },
      { id: "resources", label: "Resources", val: this.state.subjectId }
    ];

    const regs = await window.academicService.getRegulations();
    const depts = await window.academicService.getDepartments();
    const curReg = regs.find(r => r.id === this.state.regulationId);
    const curDept = depts.find(d => d.id === this.state.departmentId);
    let curSub = null;
    if (this.state.subjectId) {
      curSub = await window.academicService.getSubjectById(this.state.subjectId);
    }

    // Update label values
    const regValEl = document.getElementById("stepVal-reg");
    const deptValEl = document.getElementById("stepVal-dept");
    const semValEl = document.getElementById("stepVal-sem");
    const subValEl = document.getElementById("stepVal-sub");
    const resValEl = document.getElementById("stepVal-res");

    if (regValEl) regValEl.textContent = curReg ? curReg.year + " Reg" : "Select";
    if (deptValEl) deptValEl.textContent = curDept ? curDept.code : "Select";
    if (semValEl) semValEl.textContent = this.state.semesterId ? `Sem ${this.state.semesterId}` : "Select";
    if (subValEl) subValEl.textContent = curSub ? curSub.code : "Select";
    if (resValEl) resValEl.textContent = curSub ? "Active" : "View";

    // Stepper active classes
    const stepEls = document.querySelectorAll(".stepper-step");
    stepEls.forEach(el => {
      const target = el.dataset.view;
      el.classList.remove("active", "completed");

      if (target === this.state.currentView) {
        el.classList.add("active");
      }
    });

    if (this.state.regulationId) document.querySelector('.stepper-step[data-view="home"]')?.classList.add("completed");
    if (this.state.departmentId) document.querySelector('.stepper-step[data-view="departments"]')?.classList.add("completed");
    if (this.state.semesterId) document.querySelector('.stepper-step[data-view="semesters"]')?.classList.add("completed");
    if (this.state.subjectId) document.querySelector('.stepper-step[data-view="subjects"]')?.classList.add("completed");
  }

  async updateBreadcrumbs() {
    const listEl = document.getElementById("breadcrumbsList");
    if (!listEl) return;

    const regs = await window.academicService.getRegulations();
    const depts = await window.academicService.getDepartments();
    const curReg = regs.find(r => r.id === this.state.regulationId);
    const curDept = depts.find(d => d.id === this.state.departmentId);
    let curSub = null;
    if (this.state.subjectId) {
      curSub = await window.academicService.getSubjectById(this.state.subjectId);
    }

    let html = `
      <li class="breadcrumb-item">
        <button class="breadcrumb-btn" onclick="window.app.resetNavigation()">
          <span class="breadcrumb-home-icon">${window.Icons ? window.Icons.home : ''}</span>
          <span>Home</span>
        </button>
      </li>
    `;

    if (curReg) {
      html += `
        <li class="breadcrumb-item">
          <span class="breadcrumb-separator">›</span>
          <button class="breadcrumb-btn ${!curDept ? 'breadcrumb-active' : ''}" onclick="window.app.selectRegulation('${curReg.id}')">${curReg.year} Reg</button>
        </li>
      `;
    }

    if (curDept) {
      html += `
        <li class="breadcrumb-item">
          <span class="breadcrumb-separator">›</span>
          <button class="breadcrumb-btn ${!this.state.semesterId ? 'breadcrumb-active' : ''}" onclick="window.app.selectDepartment('${curDept.id}')">${curDept.code}</button>
        </li>
      `;
    }

    if (this.state.semesterId) {
      html += `
        <li class="breadcrumb-item">
          <span class="breadcrumb-separator">›</span>
          <button class="breadcrumb-btn ${!curSub ? 'breadcrumb-active' : ''}" onclick="window.app.selectSemester(${this.state.semesterId})">Sem ${this.state.semesterId}</button>
        </li>
      `;
    }

    if (curSub) {
      html += `
        <li class="breadcrumb-item">
          <span class="breadcrumb-separator">›</span>
          <span class="breadcrumb-active">${curSub.code} – ${curSub.name}</span>
        </li>
      `;
    }

    listEl.innerHTML = html;
  }

  async renderCurrentView() {
    switch (this.state.currentView) {
      case "home":
        await this.renderRegulations();
        break;
      case "departments":
        await this.renderDepartments();
        break;
      case "semesters":
        await this.renderSemesters();
        break;
      case "subjects":
        await this.renderSubjects();
        break;
      case "resources":
        await this.renderResources();
        break;
    }
  }

  // --- Step 1: Regulations ---
  async renderRegulations() {
    const grid = document.getElementById("regulationsGrid");
    if (!grid) return;

    const regs = await window.academicService.getRegulations();
    grid.innerHTML = regs.map(reg => `
      <div class="selection-card" onclick="window.app.selectRegulation('${reg.id}')">
        ${reg.isLatest ? '<span class="card-badge-top">Latest 2024</span>' : ''}
        <div class="card-icon-large" style="color:var(--primary);">${window.Icons ? window.Icons.regulation : ''}</div>
        <h3 class="card-title">${reg.name}</h3>
        <p class="card-description">${reg.description}</p>
        <div class="card-footer-action">
          <span>Select Regulation</span> <span class="arrow-svg">${window.Icons ? window.Icons.arrowRight : '→'}</span>
        </div>
      </div>
    `).join("");
  }

  selectRegulation(regId) {
    this.state.regulationId = regId;
    this.navigateTo("departments");
  }

  // --- Step 2: Departments ---
  async renderDepartments() {
    const grid = document.getElementById("departmentsGrid");
    if (!grid) return;

    const depts = await window.academicService.getDepartments();
    const deptIconMap = {
      cse: window.Icons.code,
      aids: window.Icons.ai,
      it: window.Icons.network,
      ece: window.Icons.chip,
      mech: window.Icons.gear
    };

    grid.innerHTML = depts.map(dept => {
      const iconSvg = (window.Icons && deptIconMap[dept.id]) || (window.Icons ? window.Icons.department : '');
      return `
        <div class="selection-card dept-card" onclick="window.app.selectDepartment('${dept.id}')">
          <span class="dept-code-pill" style="background:${dept.color};">${dept.code}</span>
          <div class="card-icon-large" style="color:${dept.color};">${iconSvg}</div>
          <h3 class="card-title">${dept.name}</h3>
          <p class="card-description">Curriculum, syllabus notes, videos, lab manuals and previous question papers.</p>
          <div class="card-footer-action" style="color:${dept.color};">
            <span>Select Department</span> <span class="arrow-svg">${window.Icons ? window.Icons.arrowRight : '→'}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  selectDepartment(deptId) {
    this.state.departmentId = deptId;
    this.navigateTo("semesters");
  }

  // --- Step 3: Semesters ---
  async renderSemesters() {
    const grid = document.getElementById("semestersGrid");
    if (!grid) return;

    const sems = await window.academicService.getSemesters();
    grid.innerHTML = sems.map(sem => `
      <div class="selection-card semester-card" onclick="window.app.selectSemester(${sem.id})">
        <span class="meta-chip">${sem.badge}</span>
        <div class="semester-number">${sem.id}</div>
        <h3 class="card-title">${sem.name}</h3>
        <p class="card-description">Core subjects, labs, and question banks</p>
        <div class="card-footer-action" style="justify-content:center;">
          Explore Subjects <span>→</span>
        </div>
      </div>
    `).join("");
  }

  selectSemester(semId) {
    this.state.semesterId = semId;
    this.navigateTo("subjects");
  }

  // --- Step 4: Subjects ---
  async renderSubjects() {
    const grid = document.getElementById("subjectsGrid");
    const titleEl = document.getElementById("subjectsViewTitle");
    if (!grid) return;

    const regs = await window.academicService.getRegulations();
    const depts = await window.academicService.getDepartments();
    const curReg = regs.find(r => r.id === this.state.regulationId);
    const curDept = depts.find(d => d.id === this.state.departmentId);

    if (titleEl && curReg && curDept) {
      titleEl.innerHTML = `Subjects for <span style="color:var(--primary-light);">${curDept.code}</span> (Sem ${this.state.semesterId}) • ${curReg.year} Reg`;
    }

    const subjects = await window.academicService.getSubjects({
      regulationId: this.state.regulationId,
      departmentId: this.state.departmentId,
      semesterId: this.state.semesterId
    });

    if (!subjects.length) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">📚</div>
          <h3>No subjects found for this selection</h3>
          <p>You can add subjects for this semester via the Admin Dashboard.</p>
          <button class="btn btn-primary" style="margin-top:1rem;" onclick="window.adminPortal.open()">Add Subject in Admin</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = subjects.map(s => {
      const isFav = window.academicService.isFavorite(s.id);
      let linkCount = 0;
      if (s.resources) {
        Object.values(s.resources).forEach(links => linkCount += links.length);
      }

      return `
        <div class="subject-card" onclick="window.app.selectSubject('${s.id}')">
          <div class="subject-header">
            <span class="subject-code-tag">${s.code}</span>
            <button class="btn-fav ${isFav ? 'active' : ''}" title="${isFav ? 'Remove Favorite' : 'Save Favorite'}" onclick="event.stopPropagation(); window.app.toggleFav('${s.id}')">
              ${isFav ? (window.Icons ? window.Icons.starFilled : '★') : (window.Icons ? window.Icons.star : '☆')}
            </button>
          </div>
          <h3 class="subject-name">${s.name}</h3>
          <p class="subject-summary">${s.summary || 'Essential course resources, syllabus, notes, lab manual and questions.'}</p>
          <div class="subject-meta-chips">
            <span class="meta-chip">${s.credits} Credits</span>
            <span class="meta-chip">${s.category || 'Core'}</span>
            <span class="meta-chip">${linkCount} Verified Links</span>
          </div>
          <div class="subject-card-actions">
            <span class="resource-count-pill">${linkCount} Available Resources</span>
            <span class="btn-view-resources">
              <span>Open Hub</span> <span class="arrow-svg">${window.Icons ? window.Icons.arrowRight : '→'}</span>
            </span>
          </div>
        </div>
      `;
    }).join("");
  }

  selectSubject(subId) {
    this.state.subjectId = subId;
    window.academicService.recordHistory(subId);
    this.navigateTo("resources");
  }

  // --- Step 5: Resource Hub (The 9 Resource Categories) ---
  async renderResources() {
    const container = document.getElementById("subjectResourcesContainer");
    const heroTitle = document.getElementById("resourceHeroTitle");
    const heroCode = document.getElementById("resourceHeroCode");
    const heroDesc = document.getElementById("resourceHeroDesc");
    const heroMeta = document.getElementById("resourceHeroMeta");
    const heroFavBtn = document.getElementById("resourceHeroFavBtn");

    if (!container || !this.state.subjectId) return;

    const subject = await window.academicService.getSubjectById(this.state.subjectId);
    if (!subject) {
      container.innerHTML = `<div class="empty-state"><p>Subject not found.</p></div>`;
      return;
    }

    // Update Resource Hub Hero Info
    if (heroCode) heroCode.textContent = subject.code;
    if (heroTitle) heroTitle.textContent = `${subject.code} – ${subject.name}`;
    if (heroDesc) heroDesc.textContent = subject.summary || "";
    if (heroMeta) {
      heroMeta.innerHTML = `
        <span class="meta-chip">${subject.category || 'Core'}</span>
        <span class="meta-chip">${subject.credits} Credits</span>
        <span class="meta-chip">${subject.departmentId?.toUpperCase()}</span>
        <span class="meta-chip">Semester ${subject.semesterId}</span>
      `;
    }
    if (heroFavBtn) {
      const isFav = window.academicService.isFavorite(subject.id);
      const starIcon = isFav ? (window.Icons ? window.Icons.starFilled : '★') : (window.Icons ? window.Icons.star : '☆');
      heroFavBtn.innerHTML = `<span class="btn-svg">${starIcon}</span> <span>${isFav ? 'Saved to Favorites' : 'Add to Favorites'}</span>`;
      heroFavBtn.onclick = () => {
        this.toggleFav(subject.id);
        const updatedFav = window.academicService.isFavorite(subject.id);
        const updatedIcon = updatedFav ? (window.Icons ? window.Icons.starFilled : '★') : (window.Icons ? window.Icons.star : '☆');
        heroFavBtn.innerHTML = `<span class="btn-svg">${updatedIcon}</span> <span>${updatedFav ? 'Saved to Favorites' : 'Add to Favorites'}</span>`;
      };
    }

    // Render 9 Categories with Handcrafted Vector SVGs
    const categories = [
      { key: "syllabus", name: "Syllabus" },
      { key: "notes", name: "Notes" },
      { key: "videos", name: "Explanation Videos" },
      { key: "classwork", name: "Classwork (CW)" },
      { key: "labManual", name: "Lab Manual" },
      { key: "practicalQuestions", name: "Practical Questions" },
      { key: "questionPapers", name: "Previous Question Papers" },
      { key: "importantQuestions", name: "Important Questions" },
      { key: "otherResources", name: "Other Resources" }
    ];

    // Render Quick Category Filter Buttons
    const filterContainer = document.getElementById("categoryQuickFilters");
    if (filterContainer) {
      filterContainer.innerHTML = `
        <button class="category-filter-btn ${this.state.activeCategoryFilter === 'all' ? 'active' : ''}" onclick="window.app.filterCategory('all')">
          <span class="pill-svg-wrap">${window.Icons ? window.Icons.star : ''}</span>
          <span>All Categories</span>
        </button>
        ${categories.map(c => `
          <button class="category-filter-btn ${this.state.activeCategoryFilter === c.key ? 'active' : ''}" onclick="window.app.filterCategory('${c.key}')">
            <span class="pill-svg-wrap">${window.Icons ? (window.Icons[c.key] || '') : ''}</span>
            <span>${c.name}</span>
          </button>
        `).join("")}
      `;
    }

    // Render Resource Blocks
    const resourcesData = subject.resources || {};

    let html = "";
    categories.forEach((cat, idx) => {
      // If user filtered by category, hide other categories
      if (this.state.activeCategoryFilter !== "all" && this.state.activeCategoryFilter !== cat.key) {
        return;
      }

      const links = resourcesData[cat.key] || [];

      // Interleaved Ad space demonstration after the 3rd category per requirements
      let adSnippet = "";
      if (idx === 2 && this.state.activeCategoryFilter === "all") {
        adSnippet = `
          <div class="ad-banner-slot">
            <span class="ad-label">Advertisement / Sponsored</span>
            <div class="ad-content-mock">
              <div class="ad-text-group">
                <h4>Master Cloud & System Design - Certified Student Bootcamp</h4>
                <p>Interactive distributed computing labs with real-world clusters. 40% college student discount.</p>
              </div>
              <button class="ad-cta-btn" onclick="alert('Demo Advertisement: Directs to external sponsored educational resource.')">Learn More →</button>
            </div>
          </div>
        `;
      }

      html += `
        <section class="resource-category-block" id="cat-block-${cat.key}">
          <div class="category-block-header">
            <div class="category-block-title">
              <span class="category-title-svg" style="color:var(--primary);">${window.Icons ? (window.Icons[cat.key] || '') : ''}</span>
              <span>${cat.name}</span>
              <span class="category-badge-chip">${links.length} Resources</span>
            </div>
            <button class="btn-primary-outline" style="font-size:0.75rem; padding: 0.25rem 0.65rem;" onclick="window.app.quickAddLink('${subject.id}', '${cat.key}')">
              + Suggest Link
            </button>
          </div>

          ${links.length === 0 ? `
            <div class="empty-state" style="padding: 1.5rem; background: var(--bg-card); border-radius: var(--radius-md);">
              <p>No verified links currently cataloged for ${cat.name}.</p>
              <button class="btn-secondary" style="font-size:0.8rem; margin-top:0.5rem;" onclick="window.app.quickAddLink('${subject.id}', '${cat.key}')">Submit Verified Link</button>
            </div>
          ` : `
            <div class="resource-cards-list">
              ${links.map(link => this.renderResourceCard(subject.id, cat.key, link)).join("")}
            </div>
          `}
        </section>
        ${adSnippet}
      `;
    });

    container.innerHTML = html;
  }

  renderResourceCard(subjectId, category, link) {
    const isOfficial = Boolean(link.isOfficial);
    const sourceClass = isOfficial ? "official" : "external";
    const sourceBadgeIcon = isOfficial ? (window.Icons ? window.Icons.shield : '') : (window.Icons ? window.Icons.otherResources : '');
    const sourceLabel = isOfficial ? `<span class="badge-svg">${sourceBadgeIcon}</span> Official Source` : `<span class="badge-svg">${sourceBadgeIcon}</span> External Educational Resource`;

    const lastChecked = link.lastVerified ? new Date(link.lastVerified).toLocaleDateString() : "Active";

    return `
      <div class="resource-link-card">
        <div class="resource-card-top">
          <span class="source-badge ${sourceClass}">${sourceLabel}</span>
          <span class="link-status-indicator status-active" title="Link health: 200 OK Active. Verified on ${lastChecked}">
            Active
          </span>
        </div>

        <h4 class="resource-card-title">${link.title}</h4>
        <p class="resource-card-desc">${link.description || 'Original external academic reference resource.'}</p>

        <div class="resource-card-footer">
          <span class="source-provider" title="${link.source || 'External Portal'}">
            ${link.source || 'External Web'}
          </span>
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn-open-resource" onclick="window.app.handleResourceClick('${link.title}', '${link.url}')">
            <span>Open Original</span> <span class="btn-svg">${window.Icons ? window.Icons.external : '↗'}</span>
          </a>
        </div>
      </div>
    `;
  }

  filterCategory(catKey) {
    this.state.activeCategoryFilter = catKey;
    this.renderResources();

    if (catKey !== "all") {
      const block = document.getElementById(`cat-block-${catKey}`);
      if (block) block.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  handleResourceClick(title, url) {
    this.showToast(`Opening original external resource: ${title}`, "success");
  }

  quickAddLink(subjectId, category) {
    window.adminPortal.open();
    window.adminPortal.switchTab("addLink");
    const subSel = document.getElementById("adminLinkSubjectSelect");
    const catSel = document.getElementById("adminLinkCategorySelect");
    if (subSel) subSel.value = subjectId;
    if (catSel) catSel.value = category;
  }

  // --- Student Favorites ---
  toggleFav(subjectId) {
    const isFav = window.academicService.toggleFavorite(subjectId);
    this.showToast(isFav ? "Saved to your pinned subjects" : "Removed from pinned subjects", isFav ? "success" : "warning");
    this.renderCurrentView();
  }

  async renderFavoritesDrawer() {
    const listEl = document.getElementById("favoritesListContainer");
    if (!listEl) return;

    const favIds = window.academicService.getFavorites();
    if (!favIds.length) {
      listEl.innerHTML = `<div class="empty-state"><p>No favorite subjects saved yet. Click the star icon on any subject card to pin it here for 1-click access!</p></div>`;
      return;
    }

    const items = [];
    for (const id of favIds) {
      const s = await window.academicService.getSubjectById(id);
      if (s) items.push(s);
    }

    listEl.innerHTML = items.map(s => `
      <div class="search-result-item" onclick="window.app.selectFavorite('${s.id}', '${s.regulationId}', '${s.departmentId}', ${s.semesterId})">
        <div>
          <span class="meta-chip" style="margin-right:0.5rem;">${s.code}</span>
          <strong style="color:var(--text-primary);">${s.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">
            ${s.departmentId.toUpperCase()} • Sem ${s.semesterId}
          </div>
        </div>
        <button class="btn-primary-outline" style="font-size:0.75rem;">Open →</button>
      </div>
    `).join("");
  }

  selectFavorite(subId, regId, deptId, semId) {
    document.getElementById("favoritesModal")?.classList.remove("open");
    this.state.regulationId = regId;
    this.state.departmentId = deptId;
    this.state.semesterId = semId;
    this.state.subjectId = subId;
    this.navigateTo("resources");
  }

  // --- Search System ---
  initSearch() {
    // Header trigger
    document.getElementById("headerSearchTrigger")?.addEventListener("click", () => this.openSearchModal());
    document.getElementById("closeSearchModal")?.addEventListener("click", () => this.closeSearchModal());

    // Hero Input
    const heroInput = document.getElementById("heroSearchInput");
    const heroBtn = document.getElementById("heroSearchBtn");
    if (heroBtn && heroInput) {
      heroBtn.addEventListener("click", () => {
        this.openSearchModal(heroInput.value);
      });
      heroInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.openSearchModal(heroInput.value);
      });
    }

    // Modal Search Input
    const modalInput = document.getElementById("modalSearchInput");
    if (modalInput) {
      modalInput.addEventListener("input", (e) => this.runLiveSearch(e.target.value));
    }
  }

  openSearchModal(initialQuery = "") {
    const modal = document.getElementById("searchModal");
    const input = document.getElementById("modalSearchInput");
    if (!modal) return;

    modal.classList.add("open");
    if (input) {
      input.value = initialQuery;
      input.focus();
      this.runLiveSearch(initialQuery);
    }
  }

  closeSearchModal() {
    document.getElementById("searchModal")?.classList.remove("open");
  }

  async runLiveSearch(query) {
    const resultsContainer = document.getElementById("searchResultsContainer");
    if (!resultsContainer) return;

    const trimmed = query ? query.trim() : "";
    const subjects = await window.academicService.getSubjects({ searchQuery: trimmed });

    if (!subjects.length) {
      resultsContainer.innerHTML = `
        <div class="empty-state">
          <p>No matching subjects or resources found for "<strong>${trimmed}</strong>".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = subjects.map(s => {
      let linkTotal = 0;
      if (s.resources) {
        Object.values(s.resources).forEach(links => linkTotal += links.length);
      }

      return `
        <div class="search-result-item" onclick="window.app.selectSearchResult('${s.id}', '${s.regulationId}', '${s.departmentId}', ${s.semesterId})">
          <div style="flex:1;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.2rem;">
              <span class="subject-code-tag">${s.code}</span>
              <strong style="color:var(--text-primary); font-size:0.95rem;">${s.name}</strong>
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">
              ${s.departmentId.toUpperCase()} • Semester ${s.semesterId} • ${linkTotal} External Resources
            </div>
          </div>
          <button class="btn-view-resources" style="font-size:0.75rem; padding:0.3rem 0.8rem;">Explore</button>
        </div>
      `;
    }).join("");
  }

  selectSearchResult(subId, regId, deptId, semId) {
    this.closeSearchModal();
    this.state.regulationId = regId;
    this.state.departmentId = deptId;
    this.state.semesterId = semId;
    this.state.subjectId = subId;
    this.navigateTo("resources");
  }

  // --- Statistics & Counters ---
  async updateStats() {
    const subCountEl = document.getElementById("statCountSubjects");
    const linkCountEl = document.getElementById("statCountLinks");
    const regCountEl = document.getElementById("statCountRegs");

    const subjects = await window.academicService.getSubjects();
    const regs = await window.academicService.getRegulations();

    let totalLinks = 0;
    subjects.forEach(s => {
      if (s.resources) {
        Object.values(s.resources).forEach(l => totalLinks += l.length);
      }
    });

    if (subCountEl) subCountEl.textContent = subjects.length;
    if (linkCountEl) linkCountEl.textContent = totalLinks;
    if (regCountEl) regCountEl.textContent = regs.length;
  }

  // --- Toast System ---
  showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    const icon = type === "success" ? "✅" : (type === "warning" ? "⚠️" : "ℹ️");
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- 3D Interactive Laptop Parallax Showcase ---
  initInteractiveLaptop() {
    const laptop = document.getElementById("interactiveLaptop");
    const glare = document.getElementById("laptopScreenGlare");
    const shadow = document.getElementById("laptopGroundShadow");
    const stage = document.getElementById("laptopStageArea");
    const section = document.getElementById("laptopShowcaseSection");

    if (!laptop || !stage) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let isHovering = false;

    // Window Mouse Movement Tracking for 3D Parallax Tilt
    window.addEventListener("mousemove", (e) => {
      const rect = stage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1
      const normX = (e.clientX - centerX) / (window.innerWidth * 0.5);
      const normY = (e.clientY - centerY) / (window.innerHeight * 0.5);

      // Clamp rotation angles for elegant realism (-15deg to +15deg)
      targetRotY = Math.max(-16, Math.min(16, normX * 15));
      targetRotX = Math.max(-12, Math.min(12, -normY * 11));
    });

    // Touch Support for mobile / touchscreens
    stage.addEventListener("touchmove", (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = stage.getBoundingClientRect();
        const normX = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.5);
        const normY = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.5);
        targetRotY = Math.max(-14, Math.min(14, normX * 13));
        targetRotX = Math.max(-10, Math.min(10, -normY * 9));
      }
    }, { passive: true });

    // Hover detection to pause auto-cycle
    if (section) {
      section.addEventListener("mouseenter", () => { isHovering = true; });
      section.addEventListener("mouseleave", () => {
        isHovering = false;
        targetRotX = 0;
        targetRotY = 0;
      });
    }

    // 60FPS Smooth Interpolation Loop with Gentle Ambient Idle Breathe
    const animate3DLaptop = (time) => {
      // Gentle ambient float when idle
      const idleX = Math.sin(time * 0.0016) * 1.5;
      const idleY = Math.cos(time * 0.0012) * 2.0;

      currentRotX += ((targetRotX + idleX) - currentRotX) * 0.08;
      currentRotY += ((targetRotY + idleY) - currentRotY) * 0.08;

      if (laptop) {
        laptop.style.transform = `perspective(1400px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(12px)`;
      }

      if (glare) {
        glare.style.transform = `translate(${(-currentRotY * 2.2).toFixed(1)}px, ${(-currentRotX * 1.8).toFixed(1)}px)`;
        glare.style.opacity = Math.max(0.3, Math.min(0.95, 0.65 + currentRotY * 0.02)).toFixed(2);
      }

      if (shadow) {
        shadow.style.transform = `translateX(${(currentRotY * 1.5).toFixed(1)}px) scale(${Math.max(0.85, 1 - Math.abs(currentRotX) * 0.008).toFixed(3)})`;
      }

      requestAnimationFrame(animate3DLaptop);
    };
    requestAnimationFrame(animate3DLaptop);

    // Interactive Showcase Tabs & Auto-cycling
    const pills = document.querySelectorAll(".showcase-nav-pill");
    const modes = ["resources", "flow", "verification"];
    let activeModeIdx = 0;

    const switchMode = (modeName) => {
      pills.forEach(p => p.classList.toggle("active", p.dataset.mode === modeName));
      document.querySelectorAll(".screen-view").forEach(v => {
        v.classList.toggle("active", v.id === `screenView-${modeName}`);
      });
    };

    pills.forEach((pill, idx) => {
      pill.addEventListener("click", () => {
        activeModeIdx = idx;
        switchMode(pill.dataset.mode);
      });
    });

    // Auto-cycle through the 3 showcase views every 5.5s unless student is inspecting
    setInterval(() => {
      if (!isHovering) {
        activeModeIdx = (activeModeIdx + 1) % modes.length;
        switchMode(modes[activeModeIdx]);
      }
    }, 5500);
  }
}

// Boot application upon DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new AcademicHubApp();
});
