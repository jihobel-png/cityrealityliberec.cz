const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 20);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const articleGrid = document.querySelector("[data-articles]");
const articleDialog = document.querySelector("[data-article-dialog]");
const dialogContent = document.querySelector("[data-dialog-content]");

const fallbackArticles = [
  {
    slug: "priprava-nemovitosti-na-prodej",
    category: "Prodej",
    readTime: "5 min čtení",
    title: "Jak připravit nemovitost na prodej, aby vynikla",
    summary: "První dojem se neopakuje. Co upravit, co nechat být a kde má smysl investovat před focením.",
    intro: "Dobře připravená nemovitost nepůsobí jako kulisa. Pomáhá zájemci představit si vlastní život v prostoru — a zároveň ukazuje, že je o dům či byt dobře postaráno.",
    sections: [
      { heading: "Začněte čistotou a prostorem", text: "Největší efekt mívají jednoduché kroky: důkladný úklid, méně osobních věcí a průchodné místnosti. Cílem není prostor odosobnit, ale dát mu klid a čitelnost." },
      { heading: "Opravy vybírejte podle dopadu", text: "Drobnosti jako nefunkční klika, odlupující se lišta nebo přepálená žárovka umí zbytečně snižovat dojem. Velké rekonstrukce před prodejem ale nemusí být návratné — rozhodnutí vždy stojí za to propočítat." },
      { heading: "Prezentace musí držet pohromadě", text: "Fotografie, video, text inzerátu i prohlídka mají vyprávět stejný příběh. Právě konzistentní prezentace pomáhá přivést vhodné zájemce, ne jen vysoký počet kliknutí." }
    ]
  },
  {
    slug: "realna-prodejni-cena",
    category: "Cena",
    readTime: "4 min čtení",
    title: "Prodejní cena bez dojmů: co ji skutečně určuje",
    summary: "Nabídková cena není tržní cena. Ukazujeme, jak se dobrý odhad opírá o data i zkušenost z lokality.",
    intro: "Správně nastavená cena není ani nejvyšší přání prodávajícího, ani nejnižší rychlá cesta k podpisu. Je to strategické rozhodnutí, které ovlivní celý průběh prodeje.",
    sections: [
      { heading: "Rozhodují srovnatelné prodeje", text: "Důležité nejsou jen ceny, za které se nemovitosti nabízejí, ale zejména částky, za které se skutečně prodaly. Srovnáváme typ, stav, polohu, dispozici i situaci na trhu." },
      { heading: "Lokalita je víc než město", text: "Rozdíl může vytvořit konkrétní ulice, výhled, patro, parkování nebo budoucí výstavba v okolí. Dvě podobné nemovitosti proto nemusí mít stejnou hodnotu." },
      { heading: "Cena je součást strategie", text: "Přestřelená cena často prodlouží prodej a inzerát postupně ztratí pozornost. Dobrá strategie naopak vytváří zdravý zájem a lepší vyjednávací pozici." }
    ]
  },
  {
    slug: "fotografie-ktere-prodavaji",
    category: "Prezentace",
    readTime: "6 min čtení",
    title: "Proč kvalitní fotografie nejsou jen hezký obrázek",
    summary: "Světlo, kompozice a pořadí záběrů rozhodují, jestli zájemce otevře detail nabídky a objedná se na prohlídku.",
    intro: "Fotografie jsou první prohlídkou nemovitosti. Během několika vteřin dávají zájemci odpověď na otázku, zda chce vědět víc. Proto musí být nejen pěkné, ale hlavně pravdivé a promyšlené.",
    sections: [
      { heading: "Světlo mění prostor", text: "Správný čas focení pomůže ukázat orientaci bytu, atmosféru místností i výhled. Přirozené světlo je výhoda, ale musí se pracovat i s kontrastem a barvou interiéru." },
      { heading: "Široký záběr není vždy lepší", text: "Příliš široký objektiv může prostor zkreslit a později zklamat na prohlídce. Dobrá fotografie drží proporce, vede oko a zůstává věrná realitě." },
      { heading: "Série fotografií vypráví příběh", text: "Pořadí záběrů má mít logiku: od silného úvodu přes jednotlivé místnosti až po detail a okolí. Zájemce tak získá pocit, že nemovitost opravdu poznává." }
    ]
  }
];

let articles = fallbackArticles;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderArticles = (items) => {
  if (!articleGrid) return;
  articleGrid.innerHTML = items
    .slice(0, 3)
    .map(
      (article) => `
        <a class="article-card reveal is-visible" href="clanky/${escapeHtml(article.slug)}.html">
          <div class="article-meta">
            <span>${escapeHtml(article.category)}</span>
            <span>${escapeHtml(article.readTime)}</span>
          </div>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.summary)}</p>
          <span class="article-open">Přečíst článek <span>↗</span></span>
        </a>`
    )
    .join("");
};

renderArticles(articles);

const loadArticleFeed = async () => {
  if (!articleGrid) return;

  try {
    const response = await fetch("content/articles.json", { cache: "no-store" });
    if (!response.ok) return;
    const feed = await response.json();
    if (!Array.isArray(feed) || !feed.length) return;
    articles = feed;
    renderArticles(articles);
  } catch {
    // Lokální náhled přes file:// používá vestavěná data.
  }
};

loadArticleFeed();

articleGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-article]");
  if (!button || !articleDialog || !dialogContent) return;
  const article = articles.find((item) => item.slug === button.dataset.article);
  if (!article) return;

  dialogContent.innerHTML = `
    <article class="dialog-article">
      <p class="eyebrow"><span></span>${escapeHtml(article.category)} · ${escapeHtml(article.readTime)}</p>
      <h2>${escapeHtml(article.title)}</h2>
      <p class="dialog-intro">${escapeHtml(article.intro)}</p>
      ${article.sections
        .map(
          (section) => `
            <section>
              <h3>${escapeHtml(section.heading)}</h3>
              <p>${escapeHtml(section.text)}</p>
            </section>`
        )
        .join("")}
    </article>`;
  articleDialog.showModal();
  document.body.style.overflow = "hidden";
});

const closeDialog = () => {
  articleDialog?.close();
  document.body.style.overflow = "";
};

document.querySelector("[data-dialog-close]")?.addEventListener("click", closeDialog);
articleDialog?.addEventListener("click", (event) => {
  if (event.target === articleDialog) closeDialog();
});
articleDialog?.addEventListener("close", () => {
  document.body.style.overflow = "";
});

const contactForm = document.querySelector("[data-contact-form]");
const contactStatus = contactForm?.querySelector("[data-form-status]");
const contactSubmitButton = contactForm?.querySelector("[data-submit-button]");
const contactSubmitLabel = contactForm?.querySelector("[data-submit-label]");
const contactStartedAt = contactForm?.querySelector("[data-form-start]");

const setContactStartedAt = () => {
  if (contactStartedAt) contactStartedAt.value = new Date().toISOString();
};

setContactStartedAt();

const setContactStatus = (message, type = "info") => {
  if (!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.hidden = false;
  contactStatus.classList.remove("is-success", "is-error", "is-info");
  contactStatus.classList.add(`is-${type}`);
};

const clearContactStatus = () => {
  if (!contactStatus) return;
  contactStatus.hidden = true;
  contactStatus.textContent = "";
  contactStatus.classList.remove("is-success", "is-error", "is-info");
};

const setContactLoading = (isLoading) => {
  if (contactSubmitButton) contactSubmitButton.disabled = isLoading;
  if (contactSubmitLabel) contactSubmitLabel.textContent = isLoading ? "Odesílám…" : "Odeslat poptávku";
};

const clearContactFieldErrors = (form) => {
  form.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));
};

const markInvalidContactFields = (form) => {
  const invalidFields = [...form.querySelectorAll("input, select, textarea")].filter((field) => !field.checkValidity());
  invalidFields.forEach((field) => field.classList.add("is-invalid"));
  invalidFields[0]?.focus({ preventScroll: false });
};

const getContactValue = (data, key) => String(data.get(key) || "").trim();

const buildContactMailto = (form, data) => {
  const email = form.dataset.fallbackEmail || "info@cityrealityliberec.cz";
  const subject = `Poptávka z webu — ${getContactValue(data, "interest") || "nezadaný zájem"}`;
  const body = [
    "Dobrý den,",
    "",
    "posílám poptávku z webu City Reality Liberec.",
    "",
    `Jméno: ${getContactValue(data, "name")}`,
    `Telefon: ${getContactValue(data, "phone") || "neuveden"}`,
    `E-mail: ${getContactValue(data, "email")}`,
    `Zájem: ${getContactValue(data, "interest")}`,
    "",
    "Zpráva:",
    getContactValue(data, "message") || "Bez další zprávy.",
    "",
    "Souhlas se zpracováním osobních údajů: ano"
  ].join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

const sendContactToEndpoint = async (form, data) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      signal: controller.signal
    });

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Serverový endpoint není na tomto hostingu dostupný.");
    }

    const payload = await response.json();

    if (!response.ok || payload.success !== true) {
      const error = new Error(payload.message || "Formulář se nepodařilo odeslat.");
      error.isValidationError = response.status >= 400 && response.status < 500;
      throw error;
    }

    return payload;
  } finally {
    window.clearTimeout(timeout);
  }
};

contactForm?.addEventListener("input", (event) => {
  event.target.closest("input, select, textarea")?.classList.remove("is-invalid");
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);

  clearContactStatus();
  clearContactFieldErrors(form);

  if (getContactValue(data, "website")) {
    form.reset();
    setContactStartedAt();
    setContactStatus("Děkujeme, zpráva byla přijata. Ozveme se vám co nejdříve.", "success");
    return;
  }

  if (!form.checkValidity()) {
    markInvalidContactFields(form);
    setContactStatus("Zkontrolujte prosím zvýrazněná pole a potvrzení zásad osobních údajů.", "error");
    form.reportValidity();
    return;
  }

  setContactLoading(true);
  setContactStatus("Odesílám poptávku…", "info");

  try {
    const payload = await sendContactToEndpoint(form, data);
    form.reset();
    setContactStartedAt();
    setContactStatus(payload.message || "Děkujeme, poptávka byla odeslána. Ozveme se vám co nejdříve.", "success");
  } catch (error) {
    if (error?.isValidationError) {
      setContactStatus(error.message, "error");
      return;
    }

    const mailto = buildContactMailto(form, data);
    setContactStatus(
      "Serverové odeslání teď není dostupné, proto jsme vám připravili e-mail s vyplněnou poptávkou.",
      "info"
    );
    window.location.href = mailto;
  } finally {
    setContactLoading(false);
  }
});

const consentStorageKey = "cityRealityCookieConsent";
const consentVersion = "2026-06-30";
const consentMaxAgeDays = 365;
const defaultConsent = {
  necessary: true,
  analytics: false,
  marketing: false,
  version: consentVersion
};

const readCookieConsent = () => {
  try {
    const stored = localStorage.getItem(consentStorageKey);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
      localStorage.removeItem(consentStorageKey);
      return null;
    }
    return { ...defaultConsent, ...parsed, necessary: true };
  } catch {
    return null;
  }
};

const saveCookieConsent = (consent) => {
  const normalizedConsent = {
    ...defaultConsent,
    ...consent,
    necessary: true,
    version: consentVersion,
    updatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + consentMaxAgeDays * 24 * 60 * 60 * 1000).toISOString()
  };

  try {
    localStorage.setItem(consentStorageKey, JSON.stringify(normalizedConsent));
  } catch {
    // Souhlas se nepodařilo uložit — web zůstane bez volitelných nástrojů.
  }

  document.documentElement.dataset.analyticsConsent = String(Boolean(normalizedConsent.analytics));
  document.documentElement.dataset.marketingConsent = String(Boolean(normalizedConsent.marketing));
  window.dispatchEvent(new CustomEvent("cityreality:consentchange", { detail: normalizedConsent }));
  return normalizedConsent;
};

const createCookieConsent = () => {
  if (document.querySelector("[data-cookie-consent]")) return;

  const banner = document.createElement("section");
  banner.className = "cookie-consent";
  banner.setAttribute("data-cookie-consent", "");
  banner.setAttribute("aria-label", "Nastavení cookies");
  banner.innerHTML = `
    <div class="cookie-consent__box" role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title">
      <h2 id="cookie-consent-title">Cookies a soukromí</h2>
      <p>
        Web používá nezbytné technické uložení pro fungování stránky a zapamatování vaší volby.
        Analytické nebo marketingové nástroje spustíme jen po vašem souhlasu.
      </p>

      <div class="cookie-consent__settings" data-cookie-settings-panel>
        <label class="cookie-option">
          <input type="checkbox" checked disabled />
          <span><strong>Nezbytné</strong>Umožňují fungování webu a uložení nastavení cookies.</span>
        </label>
        <label class="cookie-option">
          <input type="checkbox" data-cookie-category="analytics" />
          <span><strong>Analytické</strong>Pomáhají pochopit návštěvnost webu. Aktuálně nejsou napojené na žádný externí nástroj.</span>
        </label>
        <label class="cookie-option">
          <input type="checkbox" data-cookie-category="marketing" />
          <span><strong>Marketingové</strong>Slouží pro měření kampaní nebo propojení s reklamními systémy. Aktuálně nejsou aktivní.</span>
        </label>
      </div>

      <div class="cookie-consent__actions">
        <button class="cookie-consent__button cookie-consent__button--primary" type="button" data-cookie-action="accept-all">Přijmout vše</button>
        <button class="cookie-consent__button" type="button" data-cookie-action="reject">Odmítnout volitelné</button>
        <button class="cookie-consent__button cookie-consent__button--plain" type="button" data-cookie-action="customize">Nastavení</button>
        <button class="cookie-consent__button cookie-consent__button--primary" type="button" data-cookie-action="save" hidden>Uložit nastavení</button>
      </div>

      <div class="cookie-consent__links">
        <a href="cookies.html">Zásady cookies</a>
        <a href="ochrana-osobnich-udaju.html">Ochrana osobních údajů</a>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
};

const setCookieBannerVisibility = (visible) => {
  const banner = document.querySelector("[data-cookie-consent]");
  banner?.classList.toggle("is-visible", visible);
};

const openCookieSettings = () => {
  createCookieConsent();
  const banner = document.querySelector("[data-cookie-consent]");
  const consent = readCookieConsent() || defaultConsent;
  banner?.classList.add("is-customizing");
  banner?.querySelectorAll("[data-cookie-category]").forEach((input) => {
    input.checked = Boolean(consent[input.dataset.cookieCategory]);
  });
  banner?.querySelector('[data-cookie-action="save"]')?.removeAttribute("hidden");
  setCookieBannerVisibility(true);
};

const initCookieConsent = () => {
  createCookieConsent();
  const banner = document.querySelector("[data-cookie-consent]");
  const storedConsent = readCookieConsent();

  if (storedConsent) {
    saveCookieConsent(storedConsent);
  } else {
    setCookieBannerVisibility(true);
  }

  banner?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cookie-action]");
    if (!button) return;

    if (button.dataset.cookieAction === "accept-all") {
      saveCookieConsent({ analytics: true, marketing: true });
      setCookieBannerVisibility(false);
      return;
    }

    if (button.dataset.cookieAction === "reject") {
      saveCookieConsent({ analytics: false, marketing: false });
      setCookieBannerVisibility(false);
      return;
    }

    if (button.dataset.cookieAction === "customize") {
      openCookieSettings();
      return;
    }

    if (button.dataset.cookieAction === "save") {
      const analytics = Boolean(banner.querySelector('[data-cookie-category="analytics"]')?.checked);
      const marketing = Boolean(banner.querySelector('[data-cookie-category="marketing"]')?.checked);
      saveCookieConsent({ analytics, marketing });
      setCookieBannerVisibility(false);
    }
  });

  document.querySelectorAll("[data-cookie-settings]").forEach((button) => {
    button.addEventListener("click", openCookieSettings);
  });
};

initCookieConsent();
