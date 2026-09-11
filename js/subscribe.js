(() => {
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
    });

    window.addEventListener("hashchange", checkHash);
    checkHash();
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
