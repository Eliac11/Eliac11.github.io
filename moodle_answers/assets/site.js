const tiltMotion = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");

for (const card of document.querySelectorAll(".test-card")) {
  card.addEventListener("pointermove", event => {
    if (!tiltMotion.matches) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--spot-x", (x * 100).toFixed(1) + "%");
    card.style.setProperty("--spot-y", (y * 100).toFixed(1) + "%");
    card.style.setProperty("--turn-x", ((0.5 - y) * 5).toFixed(1) + "deg");
    card.style.setProperty("--turn-y", ((x - 0.5) * 7).toFixed(1) + "deg");
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--turn-x");
    card.style.removeProperty("--turn-y");
  });
}

const questionJump = document.querySelector(".question-jump");

if (questionJump) {
  questionJump.hidden = false;
  questionJump.querySelector("select").addEventListener("change", event => {
    const id = event.target.value;
    window.location.hash = id;
    event.target.selectedIndex = 0;
  });
}

const viewer = document.querySelector(".viewer");

if (viewer && typeof viewer.showModal === "function") {
  document.body.classList.add("has-viewer");

  const shots = [...document.querySelectorAll(".question-shot")];
  const media = viewer.querySelector(".viewer__media");
  const image = media.querySelector("img");
  const position = viewer.querySelector(".viewer__position");
  const next = viewer.querySelector("[data-next]");
  const previous = viewer.querySelector("[data-previous]");
  const zoom = viewer.querySelector("[data-zoom]");
  const close = viewer.querySelector("[data-close]");
  let current = 0;
  let opener;

  function resetZoom() {
    media.classList.remove("is-zoomed");
    media.scrollTo(0, 0);
    zoom.textContent = "Увеличить";
    zoom.setAttribute("aria-pressed", "false");
  }

  function showShot(index) {
    current = index;
    const link = shots[current];
    const thumbnail = link.querySelector("img");
    image.src = link.href;
    image.alt = thumbnail.alt;
    image.width = thumbnail.getAttribute("width");
    image.height = thumbnail.getAttribute("height");
    position.textContent = (current + 1) + " / " + shots.length;
    previous.disabled = current === 0;
    next.disabled = current === shots.length - 1;
    resetZoom();
  }

  shots.forEach((link, index) => {
    link.addEventListener("click", event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      opener = link;
      showShot(index);
      viewer.showModal();
      document.body.classList.add("viewer-open");
    });
  });

  previous.addEventListener("click", () => showShot(current - 1));
  next.addEventListener("click", () => showShot(current + 1));
  close.addEventListener("click", () => viewer.close());

  zoom.addEventListener("click", () => {
    if (media.classList.contains("is-zoomed")) {
      resetZoom();
      return;
    }

    const width = Math.max(Number(image.getAttribute("width")), Math.ceil(image.clientWidth * 1.5));
    media.style.setProperty("--zoom-width", width + "px");
    media.classList.add("is-zoomed");
    zoom.textContent = "По ширине";
    zoom.setAttribute("aria-pressed", "true");
  });

  viewer.addEventListener("keydown", event => {
    if (media.classList.contains("is-zoomed")) return;

    if (event.key === "ArrowLeft" && !previous.disabled) {
      event.preventDefault();
      showShot(current - 1);
    } else if (event.key === "ArrowRight" && !next.disabled) {
      event.preventDefault();
      showShot(current + 1);
    }
  });

  viewer.addEventListener("click", event => {
    if (event.target !== viewer) return;

    const rect = viewer.getBoundingClientRect();
    const inside = event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom;
    if (!inside) viewer.close();
  });

  viewer.addEventListener("close", () => {
    document.body.classList.remove("viewer-open");
    opener.focus({preventScroll: true});
  });
}
