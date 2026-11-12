/**
 * Sikder Enterprise — Site Interactions
 * Plain vanilla JS (no build step required for GitHub Pages).
 *
 * Optional: To receive form submissions directly without opening the visitor's email client,
 * get a free access key at https://web3forms.com for akazad1531960@gmail.com and paste it below.
 */
const WEB3FORMS_KEY = "";
const RECIPIENT_EMAIL = "akazad1531960@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile navigation toggle
  const menuBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Project role filtering
  const filterBtns = document.querySelectorAll(".filter[data-filter]");
  const projects = document.querySelectorAll(".project[data-role]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const role = btn.dataset.filter;
      filterBtns.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      projects.forEach((card) => {
        const match = role === "all" || card.dataset.role === role;
        card.hidden = !match;
      });
    });
  });

  // 3. Contact form tabs & deep-link triggers ([data-open-tab])
  const tabs = document.querySelectorAll(".tab[data-tab]");
  const panels = {
    bid: document.getElementById("panel-bid"),
    owner: document.getElementById("panel-owner"),
    prequal: document.getElementById("panel-prequal"),
  };

  function activateTab(tabKey, docName) {
    if (!panels[tabKey]) return;
    tabs.forEach((t) => {
      const selected = t.dataset.tab === tabKey;
      t.setAttribute("aria-selected", String(selected));
    });
    Object.entries(panels).forEach(([key, panel]) => {
      if (panel) panel.hidden = key !== tabKey;
    });
    if (docName && tabKey === "prequal") {
      const docInput = document.getElementById("pq-docs");
      if (docInput) docInput.value = docName;
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.tab));
  });

  document.querySelectorAll("[data-open-tab]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetTab = trigger.getAttribute("data-open-tab");
      const docName = trigger.getAttribute("data-doc");
      activateTab(targetTab, docName);
    });
  });

  // 4. Form submission (Web3Forms API if configured, otherwise pre-filled mailto:)
  document.querySelectorAll("form.panel").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const statusEl = form.querySelector(".form-status");
      const inquiryType = form.dataset.inquiryType || "Website Inquiry";
      const formData = new FormData(form);
      const entries = Object.fromEntries(formData.entries());

      if (WEB3FORMS_KEY) {
        try {
          if (statusEl) {
            statusEl.className = "form-status is-ok";
            statusEl.textContent = "Sending your inquiry…";
          }
          const payload = {
            access_key: WEB3FORMS_KEY,
            subject: `[Sikder Enterprise] ${inquiryType} — ${entries.name || ""}`,
            from_name: entries.name || "Website Visitor",
            ...entries,
          };
          const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (data.success) {
            form.reset();
            if (statusEl) {
              statusEl.className = "form-status is-ok";
              statusEl.textContent = "Thank you. Your inquiry has been sent to Sikder Enterprise.";
            }
            return;
          }
          throw new Error(data.message || "Submission failed");
        } catch (err) {
          if (statusEl) {
            statusEl.className = "form-status is-err";
            statusEl.textContent = "Could not submit automatically; opening your email client instead.";
          }
        }
      }

      // Default zero-backend path: structured mailto: to akazad1531960@gmail.com
      const subject = `[Sikder Enterprise] ${inquiryType} - ${entries.name || ""}`;
      const bodyLines = [
        `Inquiry Type: ${inquiryType}`,
        ...Object.entries(entries).map(([k, v]) => `${k.replace(/_/g, " ").toUpperCase()}: ${v}`),
      ];
      const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailtoUrl;

      if (statusEl) {
        statusEl.className = "form-status is-ok";
        statusEl.innerHTML = `Your email draft to <strong>${RECIPIENT_EMAIL}</strong> is ready to send. Prefer WhatsApp? <a href="https://wa.me/8801712679656" target="_blank" rel="noopener">Message +88 01712 679 656</a>.`;
      }
    });
  });

  // 5. Scroll reveal
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // 6. Dynamic footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
});
