(() => {
  const storageKey = "moodle-promo-key";
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const fromBase64 = text => Uint8Array.from(atob(text), char => char.charCodeAt(0));
  const toBase64 = bytes => btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(""));

  async function deriveKey(code) {
    let bytes = encoder.encode("b2cb9d018714493c8cdb2ca12f14193a:" + code);
    for (let round = 0; round < 5; round++) {
      bytes = await crypto.subtle.digest("SHA-256", bytes);
    }
    return new Uint8Array(bytes);
  }

  async function decrypt(payload, keyBytes) {
    const key = await crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["decrypt"]);
    const plaintext = await crypto.subtle.decrypt({
      name: "AES-GCM",
      iv: payload.subarray(0, 12),
    }, key, payload.subarray(12));
    return JSON.parse(decoder.decode(plaintext));
  }

  const loadStatus = document.querySelector("[data-gallery-status]");
  if (loadStatus) {
    const showGallery = async () => {
      const stored = sessionStorage.getItem(storageKey);
      if (!stored) return location.replace("../");
      const response = await fetch("./gallery.bin");
      if (!response.ok) throw new Error("Gallery download failed");
      const { html, shots } = await decrypt(new Uint8Array(await response.arrayBuffer()), fromBase64(stored));
      const imageUrls = shots.map(shot => URL.createObjectURL(
        new Blob([fromBase64(shot)], { type: "image/jpeg" }),
      ));
      const page = new DOMParser().parseFromString(
        html.replace(/SHOT_(\d{2})/g, (_, number) => imageUrls[Number(number) - 1]),
        "text/html",
      );
      document.title = page.title;
      document.body.className = page.body.className;
      document.body.replaceChildren(...page.body.children);
      const galleryScript = document.createElement("script");
      galleryScript.src = "../assets/site.js";
      document.body.append(galleryScript);
    };
    showGallery().catch(() => {
      loadStatus.textContent = "Не удалось открыть галерею. Вернитесь к списку тестов и введите промокод снова.";
    });
    return;
  }

  const dialog = document.querySelector("[data-promo-dialog]");
  if (!dialog) return;

  const form = dialog.querySelector("form");
  const field = dialog.querySelector("input");
  const cellGrid = dialog.querySelector("[data-promo-cells]");
  const codeLength = 10;
  const cells = Array.from({ length: codeLength }, () => {
    const cell = document.createElement("span");
    cell.className = "promo-code__cell";
    return cell;
  });
  cellGrid.append(...cells);

  const normalizeCode = value => value.replace(/[^a-z0-9]/gi, "").slice(0, codeLength).toUpperCase();
  const renderCells = () => {
    const start = field.selectionStart;
    const end = field.selectionEnd;
    const active = Math.min(start, cells.length - 1);
    for (const [index, cell] of cells.entries()) {
      cell.textContent = field.value[index] ?? "";
      cell.classList.toggle("is-active", index === active && start === end);
      cell.classList.toggle("is-selected", index >= start && index < end);
    }
  };
  const message = dialog.querySelector("[data-promo-message]");
  const submit = form.querySelector("[type=submit]");
  const routes = fromBase64("EEdlsnFVhYHFr962C+4dLl0ual9IxQU489CMyQ8fzmxAlZjH09gsBV3m3OKruseSXBordwDKq83MR+Ma14IBM2S+8l1jIGZuxHjicpQQuoaapDmCDmas2e5hUIB5JFJNEdiCTqGzybP9Gge8jfiagxL4UDtg9EE++Yn1KcT+n/1vI7Cfj76H/ucuVXzXtYp5RyyX+HD2u6twoOIaZub9XzrTNpH1H3FHjtfJIcaCbI5pRqm+IQ==");
  let test = 0;
  let opening = 0;

  for (const button of document.querySelectorAll("[data-promo-test]")) {
    button.addEventListener("click", () => {
      test = Number(button.dataset.promoTest);
      opening += 1;
      field.value = "";
      field.removeAttribute("aria-invalid");
      message.textContent = "";
      submit.disabled = false;
      dialog.showModal();
      renderCells();
    });
  }

  dialog.querySelector("[data-promo-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  for (const eventName of ["focus", "keyup", "select", "selectionchange"]) {
    field.addEventListener(eventName, renderCells);
  }

  field.addEventListener("click", event => {
    if (!event.detail || field.selectionStart !== field.selectionEnd) return;
    const index = cells.findIndex(cell => event.clientX <= cell.getBoundingClientRect().right);
    const position = index < 0 ? field.value.length : Math.min(index, field.value.length);
    field.setSelectionRange(position, position);
    renderCells();
  });

  field.addEventListener("input", () => {
    const normalized = normalizeCode(field.value);
    if (field.value !== normalized) {
      const position = normalizeCode(field.value.slice(0, field.selectionStart)).length;
      field.value = normalized;
      field.setSelectionRange(position, position);
    }
    renderCells();
    message.textContent = "";
    field.removeAttribute("aria-invalid");
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (field.value.length !== codeLength) {
      message.textContent = "Введите все 10 символов.";
      field.setAttribute("aria-invalid", "true");
      field.focus();
      return;
    }
    const currentOpening = opening;
    submit.disabled = true;
    message.textContent = "";

    try {
      const key = await deriveKey(field.value);
      const destinations = await decrypt(routes, key);
      if (!dialog.open || opening !== currentOpening) return;
      sessionStorage.setItem(storageKey, toBase64(key));
      location.assign(destinations[test - 5]);
    } catch {
      if (!dialog.open || opening !== currentOpening) return;
      message.textContent = "Не удалось открыть тест. Проверьте промокод.";
      field.setAttribute("aria-invalid", "true");
      field.focus();
      field.select();
    } finally {
      if (opening === currentOpening) submit.disabled = false;
    }
  });
})();
