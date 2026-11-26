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

    const referenceWidth = Math.min(Number(image.getAttribute("width")), 1120);
    const width = Math.max(referenceWidth, Math.ceil(image.clientWidth * 1.5));
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

const countdownUnits = [
  { seconds: 86400 },
  { seconds: 3600, cycle: 24 },
  { seconds: 60, cycle: 60 },
  { seconds: 1, cycle: 60 },
];

const countdowns = Array.from(document.querySelectorAll("[data-countdown]"), clock => ({
  deadline: Date.parse(clock.dateTime),
  fields: Array.from(clock.querySelectorAll("b"), element => ({ element })),
}));

if (countdowns.length) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateCountdowns = () => {
    const now = Date.now();
    let nextTick = Infinity;

    for (const { deadline, fields } of countdowns) {
      const remaining = Math.max(0, deadline - now);
      if (remaining > 0) nextTick = Math.min(nextTick, remaining % 1000 || 1000);
      const secondsLeft = Math.ceil(remaining / 1000);

      fields.forEach((field, index) => {
        const { seconds, cycle } = countdownUnits[index];
        const total = Math.floor(secondsLeft / seconds);
        const value = cycle ? total % cycle : total;
        const label = String(value).padStart(field.slots?.length ?? 2, "0");
        if (field.label !== label) {
          field.label = label;
          field.element.setAttribute("aria-label", label);
        }

        if (!field.slots || field.slots.length !== label.length) {
          field.slots = Array.from(label, () => {
            const element = document.createElement("span");
            element.className = "release-clock__slot";
            element.setAttribute("aria-hidden", "true");
            return { element };
          });
          field.element.replaceChildren(...field.slots.map(slot => slot.element));
        }

        field.slots.forEach((slot, position) => {
          const place = 10 ** (label.length - position - 1);
          const lower = Math.floor(value / place) * place;
          const upper = Math.min(lower + place, cycle ?? Infinity);
          const group = total - value + lower;
          const animate = group > 0 && !reducedMotion.matches;
          if (slot.group === group && slot.animate === animate) return;

          slot.group = group;
          slot.animate = animate;
          const currentDigit = document.createElement("span");
          currentDigit.textContent = label[position];
          slot.element.replaceChildren(currentDigit);
          if (!animate) return;

          const nextTotal = group - 1;
          const nextValue = cycle ? nextTotal % cycle : nextTotal;
          const nextDigit = document.createElement("span");
          nextDigit.className = "release-clock__incoming";
          nextDigit.textContent = String(Math.floor(nextValue / place) % 10);
          slot.element.append(nextDigit);

          // Each digit finishes its own roll at the lower boundary of its group.
          const duration = (upper - lower) * seconds * 1000;
          const elapsed = ((total - value + upper) * seconds - 1) * 1000 - remaining;
          const timing = { duration, easing: "linear", fill: "both" };
          const roll = currentDigit.animate({ transform: ["translateY(0)", "translateY(-100%)"] }, timing);
          const enter = nextDigit.animate({ transform: ["translateY(100%)", "translateY(0)"] }, timing);
          roll.currentTime = elapsed;
          enter.currentTime = elapsed;
        });
      });
    }

    if (Number.isFinite(nextTick)) window.setTimeout(updateCountdowns, nextTick);
  };

  updateCountdowns();
}
