(() => {
  const dialog = document.getElementById("lightbox");
  if (!(dialog instanceof HTMLDialogElement)) return;

  const img = dialog.querySelector(".lightbox__img");
  const closeBtn = dialog.querySelector(".lightbox__close");
  const prevBtn = dialog.querySelector(".lightbox__nav--prev");
  const nextBtn = dialog.querySelector(".lightbox__nav--next");
  if (
    !(img instanceof HTMLImageElement) ||
    !(closeBtn instanceof HTMLButtonElement) ||
    !(prevBtn instanceof HTMLButtonElement) ||
    !(nextBtn instanceof HTMLButtonElement)
  ) {
    return;
  }

  const gallery = Array.from(document.querySelectorAll(".shot-expand")).map(
    (button) => {
      const thumb = button.querySelector("img");
      const src =
        (thumb instanceof HTMLImageElement &&
          (thumb.getAttribute("src") || thumb.currentSrc || thumb.src)) ||
        "";
      const alt =
        (thumb instanceof HTMLImageElement && (thumb.getAttribute("alt") || "")) ||
        "";
      return { src, alt };
    }
  ).filter((item) => item.src);

  if (gallery.length === 0) return;

  let index = 0;

  function showAt(nextIndex) {
    index = ((nextIndex % gallery.length) + gallery.length) % gallery.length;
    const item = gallery[index];
    // Clear first so the browser always applies a visible change.
    img.removeAttribute("src");
    img.src = item.src;
    img.alt = item.alt;
  }

  function openLightbox(startIndex) {
    showAt(startIndex);
    if (!dialog.open) dialog.showModal();
    // Keep focus in the dialog so arrow keys are received.
    nextBtn.focus();
  }

  function closeLightbox() {
    if (dialog.open) dialog.close();
  }

  function step(delta) {
    showAt(index + delta);
  }

  document.querySelectorAll(".shot-expand").forEach((button, i) => {
    button.addEventListener("click", () => {
      openLightbox(i);
    });
  });

  closeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeLightbox();
  });

  prevBtn.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  nextBtn.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  prevBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    step(-1);
  });

  nextBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    step(1);
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeLightbox();
  });

  function onKeydown(event) {
    if (!dialog.open) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  }

  document.addEventListener("keydown", onKeydown);

  dialog.addEventListener("close", () => {
    img.removeAttribute("src");
    img.alt = "";
  });
})();
