/**
 * Student Academic Hub - Admin Dashboard & Content Management System
 * Enables adding/editing/deleting subjects, managing links under the 9 categories,
 * running batch link health verification, and database backup/restore.
 */

class AdminPortal {
  constructor() {
    this.adminModal = document.getElementById("adminModal");
    this.activeTab = "subjects";
    this.editingSubjectId = null;
    this.initEventListeners();
  }

  initEventListeners() {
    // Open Admin Modal
    const openBtn = document.getElementById("openAdminBtn");
    if (openBtn) {
      openBtn.addEventListener("click", () => this.open());
    }

    // Close buttons
    const closeBtns = document.querySelectorAll(".close-admin-modal");
    closeBtns.forEach(btn => {
      btn.addEventListener("click", () => this.close());
    });

    // Tab switcher inside Admin Modal
    const tabs = document.querySelectorAll(".admin-tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.switchTab(tab.dataset.tab);
      });
    });

    // Subject Form Submit
    const subjectForm = document.getElementById("adminSubjectForm");
    if (subjectForm) {
      subjectForm.addEventListener("submit", (e) => this.handleSubjectSubmit(e));
    }

    // Add Link Form Submit
    const linkForm = document.getElementById("adminLinkForm");
    if (linkForm) {
      linkForm.addEventListener("submit", (e) => this.handleLinkSubmit(e));
    }

    // Run Batch Link Verification
    const verifyAllBtn = document.getElementById("btnRunBatchVerification");
    if (verifyAllBtn) {
      verifyAllBtn.addEventListener("click", () => this.runBatchVerification());
    }

    // Reset Data
    const resetBtn = document.getElementById("btnResetDefaults");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        if (confirm("Reset academic database to initial sample dataset? Any custom additions will be overwritten.")) {
          window.academicService.resetToDefaults();
          window.app.showToast("Database reset to defaults successfully", "success");
          this.renderAdminSubjectsList();
          window.app.renderCurrentView();
        }
      });
    }

    // Export JSON
    const exportBtn = document.getElementById("btnExportJson");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const json = window.academicService.exportDataJson();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `academic_hub_backup_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        window.app.showToast("Database exported as JSON backup", "success");
      });
    }

    // Import JSON
    const importInput = document.getElementById("importJsonInput");
    if (importInput) {
      importInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = window.academicService.importDataJson(event.target.result);
          if (res.success) {
            window.app.showToast(`Imported ${res.count} subjects successfully!`, "success");
            this.renderAdminSubjectsList();
            window.app.renderCurrentView();
          } else {
            window.app.showToast(`Import error: ${res.error}`, "error");
          }
        };
        reader.readAsText(file);
      });
    }
  }

  open() {
    if (!this.adminModal) return;
    this.adminModal.classList.add("open");
    this.renderAdminSubjectsList();
    this.populateDropdowns();
  }

  close() {
    if (!this.adminModal) return;
    this.adminModal.classList.remove("open");
    this.resetSubjectForm();
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll(".admin-tab-content").forEach(c => c.style.display = "none");
    const target = document.getElementById(`adminTab_${tabName}`);
    if (target) target.style.display = "block";

    if (tabName === "subjects") {
      this.renderAdminSubjectsList();
    } else if (tabName === "addLink") {
      this.populateDropdowns();
    }
  }

  async populateDropdowns() {
    const regSelect = document.getElementById("adminSubRegSelect");
    const deptSelect = document.getElementById("adminSubDeptSelect");
    const semSelect = document.getElementById("adminSubSemSelect");
    const linkSubSelect = document.getElementById("adminLinkSubjectSelect");

    const regs = await window.academicService.getRegulations();
    const depts = await window.academicService.getDepartments();
    const sems = await window.academicService.getSemesters();
    const subs = await window.academicService.getSubjects();

    if (regSelect) {
      regSelect.innerHTML = regs.map(r => `<option value="${r.id}">${r.name}</option>`).join("");
    }
    if (deptSelect) {
      deptSelect.innerHTML = depts.map(d => `<option value="${d.id}">${d.code} - ${d.name}</option>`).join("");
    }
    if (semSelect) {
      semSelect.innerHTML = sems.map(s => `<option value="${s.id}">${s.name} (${s.badge})</option>`).join("");
    }
    if (linkSubSelect) {
      linkSubSelect.innerHTML = subs.map(s => `<option value="${s.id}">[${s.code}] ${s.name}</option>`).join("");
    }
  }

  async renderAdminSubjectsList() {
    const listEl = document.getElementById("adminSubjectsTableBody");
    if (!listEl) return;

    const subjects = await window.academicService.getSubjects();
    if (!subjects.length) {
      listEl.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">No subjects found. Add one above!</td></tr>`;
      return;
    }

    listEl.innerHTML = subjects.map(s => {
      let linkCount = 0;
      if (s.resources) {
        Object.values(s.resources).forEach(links => linkCount += links.length);
      }
      return `
        <tr>
          <td style="font-weight:700; color:var(--primary-light);">${s.code}</td>
          <td>${s.name}</td>
          <td><span class="meta-chip">${s.departmentId.toUpperCase()} • Sem ${s.semesterId}</span></td>
          <td><span class="meta-chip">${linkCount} links</span></td>
          <td style="text-align:right;">
            <button class="btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.78rem;" onclick="window.adminPortal.editSubject('${s.id}')">Edit</button>
            <button class="btn-danger" style="padding: 0.25rem 0.6rem; font-size: 0.78rem; margin-left: 0.3rem;" onclick="window.adminPortal.deleteSubject('${s.id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join("");
  }

  async handleSubjectSubmit(e) {
    e.preventDefault();
    const code = document.getElementById("adminSubCode").value.trim();
    const name = document.getElementById("adminSubName").value.trim();
    const regId = document.getElementById("adminSubRegSelect").value;
    const deptId = document.getElementById("adminSubDeptSelect").value;
    const semId = parseInt(document.getElementById("adminSubSemSelect").value, 10);
    const credits = parseInt(document.getElementById("adminSubCredits").value, 10) || 3;
    const category = document.getElementById("adminSubCategory").value;
    const summary = document.getElementById("adminSubSummary").value.trim();

    if (!code || !name) {
      alert("Subject code and name are required.");
      return;
    }

    if (this.editingSubjectId) {
      await window.academicService.updateSubject(this.editingSubjectId, {
        code, name, regulationId: regId, departmentId: deptId, semesterId: semId, credits, category, summary
      });
      window.app.showToast(`Updated subject ${code}`, "success");
      this.editingSubjectId = null;
    } else {
      await window.academicService.addSubject({
        code, name, regulationId: regId, departmentId: deptId, semesterId: semId, credits, category, summary
      });
      window.app.showToast(`Added new subject ${code}`, "success");
    }

    this.resetSubjectForm();
    this.renderAdminSubjectsList();
    this.populateDropdowns();
    window.app.renderCurrentView();
  }

  async editSubject(id) {
    const s = await window.academicService.getSubjectById(id);
    if (!s) return;

    this.editingSubjectId = id;
    document.getElementById("adminSubCode").value = s.code;
    document.getElementById("adminSubName").value = s.name;
    document.getElementById("adminSubRegSelect").value = s.regulationId;
    document.getElementById("adminSubDeptSelect").value = s.departmentId;
    document.getElementById("adminSubSemSelect").value = s.semesterId;
    document.getElementById("adminSubCredits").value = s.credits || 3;
    document.getElementById("adminSubCategory").value = s.category || "Professional Core";
    document.getElementById("adminSubSummary").value = s.summary || "";

    const submitBtn = document.getElementById("adminSubjectSubmitBtn");
    if (submitBtn) submitBtn.textContent = "Save Changes";
    document.getElementById("adminSubCancelEditBtn").style.display = "inline-block";

    // Switch to subject tab
    const subTab = document.querySelector('.admin-tab-btn[data-tab="subjects"]');
    if (subTab) subTab.click();
  }

  resetSubjectForm() {
    this.editingSubjectId = null;
    const form = document.getElementById("adminSubjectForm");
    if (form) form.reset();
    const submitBtn = document.getElementById("adminSubjectSubmitBtn");
    if (submitBtn) submitBtn.textContent = "Add Subject";
    const cancelBtn = document.getElementById("adminSubCancelEditBtn");
    if (cancelBtn) cancelBtn.style.display = "none";
  }

  async deleteSubject(id) {
    if (confirm("Are you sure you want to delete this subject and all its links?")) {
      await window.academicService.deleteSubject(id);
      window.app.showToast("Subject deleted", "warning");
      this.renderAdminSubjectsList();
      this.populateDropdowns();
      window.app.renderCurrentView();
    }
  }

  async handleLinkSubmit(e) {
    e.preventDefault();
    const subId = document.getElementById("adminLinkSubjectSelect").value;
    const category = document.getElementById("adminLinkCategorySelect").value;
    const title = document.getElementById("adminLinkTitle").value.trim();
    const url = document.getElementById("adminLinkUrl").value.trim();
    const isOfficial = document.getElementById("adminLinkIsOfficial").checked;
    const source = document.getElementById("adminLinkSource").value.trim();
    const description = document.getElementById("adminLinkDesc").value.trim();

    if (!subId || !title || !url) {
      alert("Subject, title, and valid URL are required.");
      return;
    }

    const newLink = await window.academicService.addResourceLink(subId, category, {
      title, url, isOfficial, source, description
    });

    if (newLink) {
      window.app.showToast(`Added resource to ${category}`, "success");
      document.getElementById("adminLinkForm").reset();
      window.app.renderCurrentView();
    }
  }

  async runBatchVerification() {
    const progressBox = document.getElementById("verificationProgressBox");
    const progressBar = document.getElementById("verificationProgressBar");
    const progressText = document.getElementById("verificationProgressText");
    const statusText = document.getElementById("verificationStatusText");

    if (progressBox) progressBox.style.display = "block";

    const results = await window.academicService.verifyAllLinks((checked, total, title) => {
      const pct = Math.round((checked / total) * 100);
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (progressText) progressText.textContent = `${pct}% (${checked}/${total})`;
      if (statusText) statusText.textContent = `Testing: ${title}`;
    });

    if (statusText) {
      statusText.innerHTML = `<strong>Done!</strong> Verified ${results.total} links. <span style="color:var(--status-verified);">${results.active} Active</span> • <span style="color:var(--status-broken);">${results.broken} Inactive</span>`;
    }

    window.app.showToast(`Batch Link Verification Completed: ${results.active} active links.`, "success");
    window.app.renderCurrentView();
  }
}

// Global exposure
window.adminPortal = new AdminPortal();
