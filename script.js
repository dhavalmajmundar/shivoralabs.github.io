/* Core Interactivity Script - Shivora Labs */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Sticky Navigation Scroll Effect
  const header = document.querySelector(".site-header");
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check

  // Keep in-page navigation landing positions consistent with the sticky header.
  const legacyHashMap = {
    "#work": "#home",
    "#services": "#studio",
    "#apps": "#pipeline"
  };

  function scrollToAnchor(targetId, updateHash = true, behavior = "smooth") {
    if (!targetId || targetId === "#") return;
    targetId = legacyHashMap[targetId] || targetId;
    const target = document.querySelector(targetId);
    if (!target) return;

    const visibleTarget = target;
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const offset = headerHeight;
    const top = visibleTarget.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior });
    if (updateHash) {
      history.pushState(null, "", targetId);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      event.preventDefault();
      scrollToAnchor(targetId);
    });
  });

  if (window.location.hash) {
    if (legacyHashMap[window.location.hash]) {
      history.replaceState(null, "", legacyHashMap[window.location.hash]);
    }
    window.setTimeout(() => scrollToAnchor(window.location.hash, false, "auto"), 80);
    window.setTimeout(() => scrollToAnchor(window.location.hash, false, "auto"), 260);
    window.setTimeout(() => scrollToAnchor(window.location.hash, false, "auto"), 700);
    window.addEventListener("load", () => scrollToAnchor(window.location.hash, false, "auto"));
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => scrollToAnchor(window.location.hash, false, "auto"));
    }
  }

  window.addEventListener("hashchange", () => {
    if (legacyHashMap[window.location.hash]) {
      history.replaceState(null, "", legacyHashMap[window.location.hash]);
    }
    scrollToAnchor(window.location.hash, false);
  });

  // 2. Mobile Drawer Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");
  const drawerLinks = document.querySelectorAll(".mobile-drawer a");

  if (hamburger && drawer) {
    const toggleMenu = () => {
      const isOpen = drawer.classList.contains("open");
      drawer.classList.toggle("open");
      
      // Update hamburger SVG icon based on state
      if (!isOpen) {
        hamburger.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        `;
      } else {
        hamburger.innerHTML = `
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        `;
      }
    };

    hamburger.addEventListener("click", toggleMenu);

    // Close drawer when link clicked
    drawerLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (drawer.classList.contains("open")) {
          toggleMenu();
        }
      });
    });
  }

  // 3. Scroll Reveal System using IntersectionObserver
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Optionally stop observing once revealed
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px" // Triggers slightly before element enters viewport
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // 4. Back to Top Button
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 5. Copy Email Helper Function
  window.copyEmailHelper = (text, successMsg, statusElId) => {
    const statusEl = document.getElementById(statusElId);
    navigator.clipboard.writeText(text).then(() => {
      if (statusEl) {
        statusEl.textContent = successMsg;
        statusEl.style.display = "block";
        statusEl.classList.add("is-visible");
        setTimeout(() => {
          statusEl.classList.remove("is-visible");
          statusEl.style.display = "none";
        }, 4000);
      } else {
        alert(successMsg);
      }
    }).catch(() => {
      const fallbackMsg = "Could not automatically copy. Please copy manually: " + text;
      if (statusEl) {
        statusEl.textContent = fallbackMsg;
        statusEl.style.display = "block";
        statusEl.classList.add("is-visible");
      } else {
        alert(fallbackMsg);
      }
    });
  };

  // 6. Shivora Assistant FAQ Widget
  const assistantFaqs = [
    {
      id: "services",
      label: "What do you build?",
      keywords: ["services", "build", "make", "apps", "websites", "website", "workflow", "automation", "ai"],
      answer: 'Shivora Labs designs and builds premium websites, focused apps, dashboards, workflow tools, and practical AI-assisted systems. The goal is software that feels polished, useful, and ready for real users.'
    },
    {
      id: "cadens",
      label: "What is Cadens?",
      keywords: ["cadens", "app", "routine", "fitness", "tracker", "rhythm"],
      answer: "Cadens is Shivora Labs' in-house routine and fitness rhythm app. It shows the level of product polish, privacy care, and interface quality we bring to client work."
    },
    {
      id: "process",
      label: "How does a project start?",
      keywords: ["process", "start", "begin", "timeline", "steps", "roadmap", "project"],
      answer: 'Most projects start with a short discovery conversation: what you want to build, who it is for, what is already in place, and what success should look like. From there, Shivora Labs can shape a clear design and build plan.'
    },
    {
      id: "fit",
      label: "What projects fit best?",
      keywords: ["fit", "good fit", "custom", "dashboard", "portal", "founder", "startup", "business"],
      answer: 'Good fits include apps, product MVPs, premium company websites, internal dashboards, client portals, workflow automation, and AI-assisted tools for founders, small teams, and growing businesses.'
    },
    {
      id: "pricing",
      label: "Do you list pricing?",
      keywords: ["price", "pricing", "cost", "budget", "quote", "estimate"],
      answer: 'Pricing depends on scope, complexity, integrations, timeline, and how much design or product strategy is needed. The fastest path is to share a few project notes so Shivora Labs can respond with a realistic next step.'
    },
    {
      id: "contact",
      label: "How do I contact Shivora Labs?",
      keywords: ["contact", "email", "support", "message", "reach", "talk"],
      answer: 'You can use the Request a Quote form on this page or email support@shivoralabs.com. If this conversation is useful, you can also send the transcript from this assistant.'
    },
    {
      id: "privacy",
      label: "Where are Cadens policies?",
      keywords: ["privacy", "policy", "terms", "safety", "legal"],
      answer: 'Cadens policy pages are available here: <a href="/cadens/privacy/">Privacy Policy</a> and <a href="/cadens/terms/">Terms and Safety</a>.'
    }
  ];

  const assistantRoot = document.createElement("div");
  assistantRoot.className = "assistant-widget";
  assistantRoot.innerHTML = `
    <button class="assistant-launcher" type="button" aria-label="Open Shivora Assistant">
      <img src="/Icons/favicon-120.png" alt="" />
      <span>Shivora Assistant</span>
    </button>
    <div class="assistant-panel" aria-label="Shivora Assistant" aria-live="polite">
      <div class="assistant-header">
        <div class="assistant-title">
          <img src="/Icons/favicon-120.png" alt="" />
          <div>
            <strong>Shivora Assistant</strong>
            <span>Common questions, quick answers</span>
          </div>
        </div>
        <button class="assistant-close" type="button" aria-label="Close assistant">&times;</button>
      </div>
      <div class="assistant-messages" id="assistant-messages"></div>
      <div class="assistant-footer">
        <form class="assistant-input-row" id="assistant-form">
          <input id="assistant-input" type="text" autocomplete="off" placeholder="Ask about services, Cadens, pricing..." />
          <button type="submit">Ask</button>
        </form>
        <div class="assistant-actions">
          <button class="assistant-secondary" type="button" id="assistant-send-transcript">Send conversation</button>
          <button class="assistant-secondary" type="button" id="assistant-start-project">Request a quote</button>
        </div>
        <form class="assistant-handoff" id="assistant-handoff" action="https://formsubmit.co/ajax/support@shivoralabs.com" method="POST">
          <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" />
          <input type="hidden" name="_subject" value="Shivora Assistant conversation" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input name="name" autocomplete="name" placeholder="Your name" required />
          <input name="email" type="email" autocomplete="email" placeholder="Your email" required />
          <textarea name="note" placeholder="Optional note for Shivora Labs"></textarea>
          <button type="submit">Send to Shivora Labs</button>
        </form>
        <p class="assistant-status" id="assistant-status"></p>
      </div>
    </div>
  `;
  document.body.appendChild(assistantRoot);

  const assistantLauncher = assistantRoot.querySelector(".assistant-launcher");
  const assistantClose = assistantRoot.querySelector(".assistant-close");
  const assistantMessages = assistantRoot.querySelector("#assistant-messages");
  const assistantForm = assistantRoot.querySelector("#assistant-form");
  const assistantInput = assistantRoot.querySelector("#assistant-input");
  const transcriptButton = assistantRoot.querySelector("#assistant-send-transcript");
  const projectButton = assistantRoot.querySelector("#assistant-start-project");
  const handoffForm = assistantRoot.querySelector("#assistant-handoff");
  const assistantStatus = assistantRoot.querySelector("#assistant-status");
  const assistantTranscript = [];

  function recordAssistantMessage(speaker, text) {
    assistantTranscript.push({
      speaker,
      text: text.replace(/<[^>]*>/g, ""),
      time: new Date().toLocaleString()
    });
  }

  function addAssistantMessage(text, speaker) {
    const message = document.createElement("div");
    message.className = "assistant-message " + speaker;
    message.innerHTML = text;
    assistantMessages.appendChild(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
    recordAssistantMessage(speaker === "user" ? "Visitor" : "Shivora Assistant", text);
  }

  function addQuickQuestions() {
    const quick = document.createElement("div");
    quick.className = "assistant-quick";
    assistantFaqs.slice(0, 6).forEach((faq) => {
      const button = document.createElement("button");
      button.className = "assistant-chip";
      button.type = "button";
      button.textContent = faq.label;
      button.addEventListener("click", () => answerAssistantQuestion(faq.label));
      quick.appendChild(button);
    });
    assistantMessages.appendChild(quick);
  }

  function findAssistantAnswer(question) {
    const normalized = question.toLowerCase();
    return assistantFaqs.find((faq) => faq.keywords.some((keyword) => normalized.includes(keyword))) || null;
  }

  function answerAssistantQuestion(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    addAssistantMessage(cleanQuestion, "user");

    const match = findAssistantAnswer(cleanQuestion);
    if (match) {
      addAssistantMessage(match.answer, "bot");
      return;
    }

    addAssistantMessage("I can help with Shivora Labs services, Cadens, project fit, pricing, policies, and contact details. For a specific project answer, send this conversation and Shivora Labs can review the details.", "bot");
  }

  function openAssistant() {
    assistantRoot.classList.add("is-open");
    assistantInput.focus();
    if (!assistantMessages.dataset.started) {
      assistantMessages.dataset.started = "true";
      addAssistantMessage("Hi, I am Shivora Assistant. I can answer common questions about Shivora Labs, Cadens, services, project fit, and how to get in touch.", "bot");
      addQuickQuestions();
    }
  }

  assistantLauncher.addEventListener("click", () => {
    if (assistantRoot.classList.contains("is-open")) {
      assistantRoot.classList.remove("is-open");
    } else {
      openAssistant();
    }
  });

  assistantClose.addEventListener("click", () => assistantRoot.classList.remove("is-open"));

  document.addEventListener("click", (event) => {
    if (!assistantRoot.classList.contains("is-open")) return;
    if (assistantRoot.contains(event.target)) return;
    assistantRoot.classList.remove("is-open");
  });

  assistantForm.addEventListener("submit", (event) => {
    event.preventDefault();
    answerAssistantQuestion(assistantInput.value);
    assistantInput.value = "";
  });

  transcriptButton.addEventListener("click", () => {
    openAssistant();
    handoffForm.classList.toggle("is-visible");
    assistantStatus.textContent = handoffForm.classList.contains("is-visible")
      ? "Add your details to send this conversation to Shivora Labs."
      : "";
  });

  projectButton.addEventListener("click", () => {
    scrollToAnchor("#contact");
    assistantRoot.classList.remove("is-open");
  });

  handoffForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = handoffForm.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const transcriptText = assistantTranscript
      .map((entry) => `${entry.time} - ${entry.speaker}: ${entry.text}`)
      .join("\n\n");

    const data = {
      name: handoffForm.elements.name.value.trim(),
      email: handoffForm.elements.email.value.trim(),
      note: handoffForm.elements.note.value.trim(),
      transcript: transcriptText,
      _subject: "Shivora Assistant conversation from " + handoffForm.elements.name.value.trim(),
      _template: "table",
      _captcha: "false",
      _honey: handoffForm.elements._honey.value
    };

    fetch(handoffForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then(() => {
        handoffForm.reset();
        handoffForm.classList.remove("is-visible");
        assistantStatus.textContent = "Thank you. The conversation has been sent to Shivora Labs.";
      })
      .catch(() => {
        assistantStatus.textContent = "The conversation could not be sent right now. Please email support@shivoralabs.com directly.";
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Send to Shivora Labs";
      });
  });
});
