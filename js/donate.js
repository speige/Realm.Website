(() => {
  const copyBtn = document.getElementById("copy-solana-btn");
  const addressInput = document.getElementById("solana-address");

  if (!copyBtn || !addressInput) return;

  const originalHtml = copyBtn.innerHTML;

  function doCopy() {
    const text = copyBtn.getAttribute("data-address") || addressInput.value;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copied!</span>
      `;
      copyBtn.classList.add("is-copied");

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.classList.remove("is-copied");
      }, 2500);
    }).catch(() => {
      addressInput.select();
    });
  }

  copyBtn.addEventListener("click", (e) => {
    e.preventDefault();
    doCopy();
  });

  addressInput.addEventListener("click", () => {
    addressInput.select();
  });
})();
