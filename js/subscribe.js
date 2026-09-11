(() => {
  let senderInitialized = false;

  function initSender() {
    if (senderInitialized) return;
    senderInitialized = true;
    (function (s, e, n, d, er) {
      s['Sender'] = er;
      s[er] = s[er] || function () {
        (s[er].q = s[er].q || []).push(arguments);
      };
      s[er].l = 1 * new Date();
      s[er].on = function(event, callback) {
        s[er].listeners = s[er].listeners || {};
        (s[er].listeners[event] = s[er].listeners[event] || []).push(callback);
      };
      var a = e.createElement(n),
          m = e.getElementsByTagName(n)[0];
      a.async = 1;
      a.src = d;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', 'https://cdn.sender.net/accounts_resources/universal.js', 'sender');
    if (typeof window.sender === "function") {
      window.sender('b50790ab2b4780');
    }
  }

  function clearSenderCooldownCookies() {
    try {
      document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        if (name.startsWith("sender_popup_shown_")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
      });
    } catch (e) {}
  }

  function tryOpenSenderPopup() {
    clearSenderCooldownCookies();

    let opened = false;

    // 1. Look for Sender iframes (full-screen modal overlay created by Sender)
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      try {
        const isSender =
          iframe.style.zIndex === "999999" ||
          iframe.title === "Subscription form" ||
          iframe.src?.includes("sender.net") ||
          iframe.contentWindow?.document?.querySelector?.(".sender-form-modal") ||
          iframe.contentWindow?.document?.querySelector?.('[class*="sender-subs-"]');

        if (isSender) {
          iframe.style.display = "block";
          const doc = iframe.contentWindow?.document;
          if (doc) {
            const popupWrapper = doc.querySelector('[class*="sender-subs-"]');
            if (popupWrapper) {
              const modal = popupWrapper.closest(".sender-form-modal") || popupWrapper.parentElement;
              if (modal) modal.style.display = "block";
              popupWrapper.style.display = "block";
            }
            const modalGeneric = doc.querySelector(".sender-form-modal, .sender-form-box");
            if (modalGeneric) {
              modalGeneric.style.display = "block";
              modalGeneric.classList.add("is-active");
            }
          }
          opened = true;
        }
      } catch (e) {
        // Cross-origin fallback: if z-index is 999999, show iframe
        if (iframe.style.zIndex === "999999") {
          iframe.style.display = "block";
          opened = true;
        }
      }
    });

    // 2. If Sender forms are loaded in window.senderForms, ask it to render/enable
    if (window.senderForms && typeof window.senderForms.render === "function") {
      try {
        window.senderForms.render("all", { initialStatus: "enabled" });
        window.senderForms.enable("all");
      } catch (e) {}
    }

    return opened;
  }

  function openSubscribeModal(e) {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    // Ensure Sender is initialized
    initSender();

    // Update URL hash without causing a page jump
    if (window.location.hash !== "#subscribe") {
      history.pushState(null, "", "#subscribe");
    }

    if (!tryOpenSenderPopup()) {
      // Retry for up to 3 seconds in case Sender is currently loading
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (tryOpenSenderPopup() || attempts > 15) {
          clearInterval(interval);
        }
      }, 200);
    }
  }

  function checkHash() {
    if (window.location.hash === "#subscribe") {
      initSender();
      // Give Sender script an initial moment to initialize
      setTimeout(openSubscribeModal, 150);
    }
  }

  function setupSubscribeTriggers() {
    const subscribeLinks = document.querySelectorAll(
      'a[href="#subscribe"], [data-sender-trigger="subscribe"], .nav__subscribe, .site-footer__subscribe'
    );

    subscribeLinks.forEach((link) => {
      link.addEventListener("click", openSubscribeModal);
      link.addEventListener("mouseenter", initSender, { once: true, passive: true });
      link.addEventListener("focus", initSender, { once: true, passive: true });
      link.addEventListener("touchstart", initSender, { once: true, passive: true });
    });

    window.addEventListener("hashchange", checkHash);
    checkHash();

    // Initialize Sender on user interaction or scroll
    if (window.location.hash !== "#subscribe") {
      const onFirstInteraction = () => {
        initSender();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pointerdown", onFirstInteraction);
        window.removeEventListener("keydown", onFirstInteraction);
      };
      const onScroll = () => {
        if (window.scrollY > 400) {
          onFirstInteraction();
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("pointerdown", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("keydown", onFirstInteraction, { passive: true, once: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupSubscribeTriggers);
  } else {
    setupSubscribeTriggers();
  }

  // Also listen for Sender's custom event when forms are ready
  window.addEventListener("onSenderFormsLoaded", () => {
    if (window.location.hash === "#subscribe") {
      tryOpenSenderPopup();
    }
  });
})();
