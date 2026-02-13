const STORAGE_KEY = "myWeddingJourneyStateV2";
const SHARE_PARAM = "plan";

const dom = {};
let state = createDefaultState();
let activeTab = "overview";

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  bindEvents();
  loadInitialState();
  renderAll();
  updateCountdown();
  setInterval(updateCountdown, 60000); // Update countdown every minute
});

function cacheDom() {
  // Tab buttons
  dom.tabBtns = document.querySelectorAll(".tab-btn");
  dom.tabContents = document.querySelectorAll(".tab-content");
  
  // Header
  dom.coupleNameDisplay = document.getElementById("coupleNameDisplay");
  dom.shareBtn = document.getElementById("shareBtn");
  
  // Overview tab
  dom.countdownDays = document.getElementById("countdownDays");
  dom.weddingMetaForm = document.getElementById("weddingMetaForm");
  dom.coupleNameInput = document.getElementById("coupleNameInput");
  dom.primaryVenueInput = document.getElementById("primaryVenueInput");
  dom.weddingDateInput = document.getElementById("weddingDateInput");
  dom.statGuestCount = document.getElementById("statGuestCount");
  dom.statEventCount = document.getElementById("statEventCount");
  dom.statTasksDone = document.getElementById("statTasksDone");
  dom.statTasksTotal = document.getElementById("statTasksTotal");
  dom.statBudget = document.getElementById("statBudget");
  dom.shareLinkOutput = document.getElementById("shareLinkOutput");
  dom.copyLinkBtn = document.getElementById("copyLinkBtn");
  dom.resetPlanBtn = document.getElementById("resetPlanBtn");

  // Guests tab
  dom.guestForm = document.getElementById("guestForm");
  dom.guestListContainer = document.getElementById("guestListContainer");

  // Events tab
  dom.addEventForm = document.getElementById("addEventForm");
  dom.eventSelect = document.getElementById("eventSelect");
  dom.deleteEventBtn = document.getElementById("deleteEventBtn");
  dom.eventMetaForm = document.getElementById("eventMetaForm");
  dom.eventNameInput = document.getElementById("eventNameInput");
  dom.eventDateInput = document.getElementById("eventDateInput");
  dom.eventVenueInput = document.getElementById("eventVenueInput");
  dom.eventNotesInput = document.getElementById("eventNotesInput");
  dom.inviteGroupFilter = document.getElementById("inviteGroupFilter");
  dom.inviteFilteredBtn = document.getElementById("inviteFilteredBtn");
  dom.clearInvitesBtn = document.getElementById("clearInvitesBtn");
  dom.applyTraditionalScenarioBtn = document.getElementById("applyTraditionalScenarioBtn");
  dom.inviteGuestList = document.getElementById("inviteGuestList");

  // Planning tab
  dom.taskForm = document.getElementById("taskForm");
  dom.taskList = document.getElementById("taskList");
  dom.materialForm = document.getElementById("materialForm");
  dom.materialList = document.getElementById("materialList");
  dom.foodForm = document.getElementById("foodForm");
  dom.foodList = document.getElementById("foodList");
  dom.decorForm = document.getElementById("decorForm");
  dom.decorList = document.getElementById("decorList");
  dom.djForm = document.getElementById("djForm");
  dom.djList = document.getElementById("djList");
  dom.favorForm = document.getElementById("favorForm");
  dom.favorList = document.getElementById("favorList");

  // Budget tab
  dom.totalBudgetAmount = document.getElementById("totalBudgetAmount");
  dom.eventBudgetList = document.getElementById("eventBudgetList");
  dom.budgetMaterials = document.getElementById("budgetMaterials");
  dom.budgetFood = document.getElementById("budgetFood");
  dom.budgetDecor = document.getElementById("budgetDecor");
  dom.budgetEntertainment = document.getElementById("budgetEntertainment");
  dom.budgetFavors = document.getElementById("budgetFavors");

  // Toast
  dom.statusToast = document.getElementById("statusToast");
  
  // Modal
  dom.shareModal = document.getElementById("shareModal");
  dom.closeModal = document.getElementById("closeModal");
  dom.modalShareLink = document.getElementById("modalShareLink");
  dom.modalCopyBtn = document.getElementById("modalCopyBtn");
}

function bindEvents() {
  // Tab navigation
  dom.tabBtns.forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Header
  dom.shareBtn.addEventListener("click", onShareClick);
  
  // Overview tab
  dom.weddingMetaForm.addEventListener("input", onWeddingMetaChanged);
  dom.copyLinkBtn.addEventListener("click", onCopyLink);
  dom.resetPlanBtn.addEventListener("click", onResetPlan);

  // Guests tab
  dom.guestForm.addEventListener("submit", onGuestAdd);
  dom.guestListContainer.addEventListener("click", onGuestAction);

  // Events tab
  dom.addEventForm.addEventListener("submit", onEventAdd);
  dom.eventSelect.addEventListener("change", onEventSelectionChanged);
  dom.deleteEventBtn.addEventListener("click", onEventDelete);
  dom.eventMetaForm.addEventListener("input", onEventMetaChanged);
  dom.inviteGroupFilter.addEventListener("change", renderInviteGuestList);
  dom.inviteFilteredBtn.addEventListener("click", onInviteFilteredGuests);
  dom.clearInvitesBtn.addEventListener("click", onClearInvites);
  dom.applyTraditionalScenarioBtn.addEventListener("click", onApplyTraditionalScenario);
  dom.inviteGuestList.addEventListener("change", onInviteGuestToggle);

  // Planning tab
  dom.taskForm.addEventListener("submit", onTaskAdd);
  dom.taskList.addEventListener("click", onTaskAction);

  dom.materialForm.addEventListener("submit", onMaterialAdd);
  dom.materialList.addEventListener("click", onMaterialAction);

  dom.foodForm.addEventListener("submit", onFoodAdd);
  dom.foodList.addEventListener("click", onFoodAction);

  dom.decorForm.addEventListener("submit", onDecorAdd);
  dom.decorList.addEventListener("click", onDecorAction);

  dom.djForm.addEventListener("submit", onDjAdd);
  dom.djList.addEventListener("click", onDjAction);

  dom.favorForm.addEventListener("submit", onFavorAdd);
  dom.favorList.addEventListener("click", onFavorAction);
  
  // Modal
  if (dom.closeModal) {
    dom.closeModal.addEventListener("click", closeShareModal);
  }
  if (dom.modalCopyBtn) {
    dom.modalCopyBtn.addEventListener("click", onModalCopy);
  }
  if (dom.shareModal) {
    dom.shareModal.addEventListener("click", (e) => {
      if (e.target === dom.shareModal) closeShareModal();
    });
  }
}

// Tab switching
function switchTab(tabName) {
  activeTab = tabName;
  
  // Update tab buttons
  dom.tabBtns.forEach(btn => {
    if (btn.dataset.tab === tabName) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
  
  // Update tab content
  dom.tabContents.forEach(content => {
    if (content.id === `tab-${tabName}`) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });
}

// Countdown calculator
function updateCountdown() {
  const weddingDate = state.meta.weddingDate;
  if (!weddingDate) {
    dom.countdownDays.textContent = "--";
    return;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const wedding = new Date(weddingDate);
  wedding.setHours(0, 0, 0, 0);
  
  const diffTime = wedding - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    dom.countdownDays.textContent = "💕";
  } else if (diffDays === 0) {
    dom.countdownDays.textContent = "TODAY!";
  } else {
    dom.countdownDays.textContent = diffDays;
  }
}

// Toast notification
function showToast(message) {
  dom.statusToast.textContent = message;
  dom.statusToast.classList.add("show");
  setTimeout(() => {
    dom.statusToast.classList.remove("show");
  }, 3000);
}

// Share modal
function onShareClick() {
  const shareUrl = buildShareUrl();
  dom.shareLinkOutput.value = shareUrl;
  if (dom.modalShareLink) {
    dom.modalShareLink.value = shareUrl;
  }
  if (dom.shareModal) {
    dom.shareModal.classList.add("show");
  }
}

function closeShareModal() {
  if (dom.shareModal) {
    dom.shareModal.classList.remove("show");
  }
}

function onCopyLink() {
  const shareUrl = buildShareUrl();
  copyToClipboard(shareUrl);
}

function onModalCopy() {
  const shareUrl = buildShareUrl();
  copyToClipboard(shareUrl);
}

async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Link copied to clipboard!");
      closeShareModal();
      return;
    } catch (error) {
      console.error("Clipboard write failed:", error);
    }
  }
  
  // Fallback
  const input = dom.shareLinkOutput || dom.modalShareLink;
  if (input) {
    input.focus();
    input.select();
    try {
      document.execCommand('copy');
      showToast("Link copied!");
      closeShareModal();
    } catch (error) {
      showToast("Please copy the link manually");
    }
  }
}

function createDefaultState() {
  const guests = [
    guestSeed("guest_family_1", "Sakshi Verma", "family", "+91-98100-1101", "No mushroom", "Bride side - elder sister"),
    guestSeed("guest_family_2", "Rajesh Verma", "family", "+91-98100-1102", "", "Bride father"),
    guestSeed("guest_family_3", "Nidhi Kapoor", "family", "+91-98100-1103", "Jain meal", "Groom mother"),
    guestSeed("guest_gf_1", "Ria Malhotra", "girlfriend", "+91-98100-2201", "", "College friend"),
    guestSeed("guest_gf_2", "Meher Arora", "girlfriend", "+91-98100-2202", "", "Dance lead"),
    guestSeed("guest_gf_3", "Kiara Bansal", "girlfriend", "+91-98100-2203", "Vegan", "Mehndi anchor"),
    guestSeed("guest_friend_1", "Arjun Sethi", "friends", "+91-98100-3301", "", "Groom friend"),
    guestSeed("guest_friend_2", "Naina Khanna", "friends", "+91-98100-3302", "", "Bride office friend"),
    guestSeed("guest_cousin_1", "Neel Sharma", "cousins", "+91-98100-4401", "", "Logistics help"),
    guestSeed("guest_vip_1", "Mr. Gupta", "vip", "+91-98100-5501", "", "Family elder"),
  ];

  const allGuestIds = guests.map((guest) => guest.id);
  const familyAndVipIds = guests.filter((guest) => guest.group === "family" || guest.group === "vip").map((guest) => guest.id);
  const girlfriendIds = guests.filter((guest) => guest.group === "girlfriend").map((guest) => guest.id);
  const friendsAndCousins = guests
    .filter((guest) => guest.group === "friends" || guest.group === "cousins")
    .map((guest) => guest.id);

  const events = [
    {
      id: "event_engagement",
      name: "Engagement",
      date: "2026-11-18",
      venue: "Grand Sapphire Banquet",
      notes: "Ring exchange, family introductions, and welcome dinner.",
      invitedGuestIds: [...familyAndVipIds, ...friendsAndCousins],
      tasks: [
        taskSeed("Ring tray setup and flowers", "Priya", "in_progress", "2026-11-15"),
        taskSeed("Confirm photographer shot list", "Rohan", "pending", "2026-11-14"),
      ],
      materials: [
        materialSeed("Ring tray", 1, "StyleCraft", "ordered", 3500),
        materialSeed("Welcome signage", 3, "Print Studio", "pending", 2200),
      ],
      food: [
        foodSeed("Chaat live counter", "Starters", "Royal Caterers", 150, 18000),
        foodSeed("Rasmalai", "Dessert", "Royal Caterers", 120, 9000),
      ],
      decor: [
        decorSeed("Pastel stage floral wall", "Bloom Decor", "Pastel", "approved", 28000),
      ],
      dj: [djSeed("7:00 PM", "DJ Ayaan", "Soft lounge", "Entry and welcome set", 12000)],
      favors: [favorSeed("Dry fruit box", 150, "All guests", "Personalized sleeve", 13500)],
    },
    {
      id: "event_haldi",
      name: "Haldi",
      date: "2026-11-19",
      venue: "Verma Residence Lawn",
      notes: "Morning ritual with marigold setup and dhol procession.",
      invitedGuestIds: [...familyAndVipIds, ...friendsAndCousins],
      tasks: [
        taskSeed("Arrange haldi platters and stools", "Neel", "pending", "2026-11-18"),
        taskSeed("Prepare turmeric-safe outfit stations", "Sakshi", "pending", "2026-11-18"),
      ],
      materials: [
        materialSeed("Haldi bowls", 12, "Pooja Bazaar", "ordered", 2400),
        materialSeed("Marigold garlands", 45, "Phool Mandi", "pending", 6700),
      ],
      food: [
        foodSeed("Poha and chai station", "Breakfast", "Home Caterers", 90, 6500),
        foodSeed("Fresh jalebi", "Snacks", "Home Caterers", 120, 4300),
      ],
      decor: [
        decorSeed("Marigold photobooth", "Bloom Decor", "Yellow + Orange", "approved", 18500),
      ],
      dj: [djSeed("10:30 AM", "Dhol Team Utsav", "Dhol", "Haldi entry beats", 9000)],
      favors: [favorSeed("Mini ubtan jars", 100, "Close guests", "Eco-friendly labels", 7500)],
    },
    {
      id: "event_mehndi",
      name: "Mehndi",
      date: "2026-11-19",
      venue: "Terrace Garden Pavilion",
      notes: "Girlfriends and close family focused celebration with artist corners and live songs.",
      invitedGuestIds: [...familyAndVipIds, ...girlfriendIds],
      tasks: [
        taskSeed("Finalize mehndi artist rotation", "Ria", "in_progress", "2026-11-17"),
        taskSeed("Create bride + bridesmaid seat chart", "Meher", "pending", "2026-11-17"),
      ],
      materials: [
        materialSeed("Mehndi cones", 220, "Henna House", "ordered", 5400),
        materialSeed("Cushion floor seating", 40, "Event Basket", "pending", 8000),
      ],
      food: [
        foodSeed("Kulhad lassi bar", "Drinks", "Royal Caterers", 140, 6400),
        foodSeed("Street-style golgappa", "Live counter", "Royal Caterers", 150, 12000),
      ],
      decor: [
        decorSeed("Boho floral umbrellas", "Bloom Decor", "Pink + Orange", "approved", 21000),
      ],
      dj: [djSeed("4:00 PM", "Live folk duo", "Live music", "Light folk and sufi", 15000)],
      favors: [favorSeed("Bangle pouches", 90, "Bride-side girls", "Color-coded by table", 8800)],
    },
    {
      id: "event_sangeet",
      name: "Sangeet",
      date: "2026-11-20",
      venue: "Crystal Ballroom",
      notes: "High-energy dance night with family performances and DJ set.",
      invitedGuestIds: [...allGuestIds],
      tasks: [
        taskSeed("Run family dance rehearsal", "Arjun", "in_progress", "2026-11-18"),
        taskSeed("Cue sheet for emcee and DJ", "Naina", "pending", "2026-11-18"),
      ],
      materials: [
        materialSeed("Wireless mic kits", 6, "AV Rentals", "ordered", 16000),
        materialSeed("LED wristbands", 180, "Glow Supply", "pending", 14500),
      ],
      food: [
        foodSeed("Paneer tikka station", "Starters", "Royal Caterers", 200, 30000),
        foodSeed("Mocktail island", "Drinks", "Royal Caterers", 220, 18500),
      ],
      decor: [
        decorSeed("Dance floor lighting truss", "LightLab Events", "Purple + Gold", "approved", 41000),
      ],
      dj: [
        djSeed("7:30 PM", "Family Performance Block", "Dance performances", "8 choreographed entries", 0),
        djSeed("9:00 PM", "DJ VibeNation", "DJ", "Bollywood + Punjabi set", 28000),
      ],
      favors: [favorSeed("Earrings gift set", 120, "Women invited from guest list", "Packed in gold pouches", 25200)],
    },
    {
      id: "event_wedding",
      name: "Wedding",
      date: "2026-11-21",
      venue: "Royal Palace Lawn",
      notes: "Baraat, varmala, pheras, and dinner reception in one flow.",
      invitedGuestIds: [...allGuestIds],
      tasks: [
        taskSeed("Mandap inspection and fire safety check", "Neel", "pending", "2026-11-20"),
        taskSeed("Baraat route and welcome teams", "Rajesh", "in_progress", "2026-11-20"),
      ],
      materials: [
        materialSeed("Mandap seating cushions", 80, "Event Basket", "ordered", 22000),
        materialSeed("Phera samagri kits", 3, "Pooja Bazaar", "pending", 7500),
      ],
      food: [
        foodSeed("North Indian buffet spread", "Dinner", "Royal Caterers", 320, 190000),
        foodSeed("Live jalebi-rabri", "Dessert", "Royal Caterers", 250, 24000),
      ],
      decor: [
        decorSeed("Mandap floral dome", "Bloom Decor", "Ivory + Red", "approved", 78000),
        decorSeed("Baraat gate entrance", "Bloom Decor", "Traditional", "pending", 22000),
      ],
      dj: [
        djSeed("6:30 PM", "Baraat dhol squad", "Dhol", "Route from gate to stage", 18000),
        djSeed("11:00 PM", "Post-phere music", "DJ", "Soft celebration set", 12000),
      ],
      favors: [favorSeed("Silver coin keepsake", 260, "All wedding guests", "Packed with thank-you card", 52000)],
    },
  ];

  return {
    meta: {
      coupleName: "Aarav and Anaya",
      primaryVenue: "Royal Palace Lawn",
      weddingDate: "2026-11-21",
    },
    guests,
    events,
    selectedEventId: events[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function guestSeed(id, name, group, phone, dietary, notes) {
  return { id, name, group, phone, dietary, notes };
}

function taskSeed(title, owner, status, deadline) {
  return { id: createId("task"), title, owner, status, deadline };
}

function materialSeed(item, qty, vendor, status, cost) {
  return { id: createId("material"), item, qty, vendor, status, cost };
}

function foodSeed(dish, course, vendor, servings, cost) {
  return { id: createId("food"), dish, course, vendor, servings, cost };
}

function decorSeed(element, vendor, theme, status, cost) {
  return { id: createId("decor"), element, vendor, theme, status, cost };
}

function djSeed(slot, performer, type, notes, cost) {
  return { id: createId("dj"), slot, performer, type, notes, cost };
}

function favorSeed(item, qty, target, notes, cost) {
  return { id: createId("favor"), item, qty, target, notes, cost };
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function loadInitialState() {
  const fromUrl = readSharedStateFromUrl();
  if (fromUrl) {
    state = normalizeState(fromUrl);
    persistState();
    showToast("Wedding plan loaded from shared link");
    return;
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    persistState();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state = normalizeState(parsed);
  } catch (error) {
    console.error("Failed to parse local storage data:", error);
    state = createDefaultState();
    persistState();
    showToast("Data corrupted. Started fresh");
  }
}

function readSharedStateFromUrl() {
  const url = new URL(window.location.href);
  const encoded = url.searchParams.get(SHARE_PARAM);
  if (!encoded) {
    return null;
  }

  try {
    const json = decodeBase64Url(encoded);
    return JSON.parse(json);
  } catch (error) {
    console.error("Failed to parse shared state:", error);
    showToast("Invalid shared link. Using local data");
    return null;
  }
}

function normalizeState(raw) {
  const fallback = createDefaultState();
  if (!raw || typeof raw !== "object") {
    return fallback;
  }

  const guests = Array.isArray(raw.guests)
    ? raw.guests.map((guest) => ({
        id: sanitizeText(guest.id) || createId("guest"),
        name: sanitizeText(guest.name),
        group: sanitizeGroup(guest.group),
        phone: sanitizeText(guest.phone),
        dietary: sanitizeText(guest.dietary),
        notes: sanitizeText(guest.notes),
      }))
    : fallback.guests;

  const guestIdSet = new Set(guests.map((guest) => guest.id));

  let events = Array.isArray(raw.events)
    ? raw.events.map((event) => normalizeEvent(event, guestIdSet))
    : fallback.events;

  if (!events.length) {
    events = fallback.events;
  }

  const selectedEventId = events.some((event) => event.id === raw.selectedEventId)
    ? raw.selectedEventId
    : events[0].id;

  return {
    meta: {
      coupleName: sanitizeText(raw.meta && raw.meta.coupleName) || fallback.meta.coupleName,
      primaryVenue: sanitizeText(raw.meta && raw.meta.primaryVenue) || fallback.meta.primaryVenue,
      weddingDate: sanitizeText(raw.meta && raw.meta.weddingDate) || fallback.meta.weddingDate,
    },
    guests,
    events,
    selectedEventId,
    createdAt: sanitizeText(raw.createdAt) || fallback.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeEvent(event, guestIdSet) {
  return {
    id: sanitizeText(event.id) || createId("event"),
    name: sanitizeText(event.name) || "Untitled Function",
    date: sanitizeText(event.date),
    venue: sanitizeText(event.venue),
    notes: sanitizeText(event.notes),
    invitedGuestIds: Array.isArray(event.invitedGuestIds)
      ? event.invitedGuestIds.filter((guestId) => guestIdSet.has(guestId))
      : [],
    tasks: normalizeTaskList(event.tasks),
    materials: normalizeMaterialList(event.materials),
    food: normalizeFoodList(event.food),
    decor: normalizeDecorList(event.decor),
    dj: normalizeDjList(event.dj),
    favors: normalizeFavorList(event.favors),
  };
}

function normalizeTaskList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((task) => ({
    id: sanitizeText(task.id) || createId("task"),
    title: sanitizeText(task.title),
    owner: sanitizeText(task.owner),
    status: sanitizeTaskStatus(task.status),
    deadline: sanitizeText(task.deadline),
  }));
}

function normalizeMaterialList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((material) => ({
    id: sanitizeText(material.id) || createId("material"),
    item: sanitizeText(material.item),
    qty: sanitizeInteger(material.qty, 1),
    vendor: sanitizeText(material.vendor),
    status: sanitizeMaterialStatus(material.status),
    cost: sanitizeNumber(material.cost),
  }));
}

function normalizeFoodList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((food) => ({
    id: sanitizeText(food.id) || createId("food"),
    dish: sanitizeText(food.dish),
    course: sanitizeText(food.course),
    vendor: sanitizeText(food.vendor),
    servings: sanitizeInteger(food.servings, 0),
    cost: sanitizeNumber(food.cost),
  }));
}

function normalizeDecorList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((decor) => ({
    id: sanitizeText(decor.id) || createId("decor"),
    element: sanitizeText(decor.element),
    vendor: sanitizeText(decor.vendor),
    theme: sanitizeText(decor.theme),
    status: sanitizeDecorStatus(decor.status),
    cost: sanitizeNumber(decor.cost),
  }));
}

function normalizeDjList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((dj) => ({
    id: sanitizeText(dj.id) || createId("dj"),
    slot: sanitizeText(dj.slot),
    performer: sanitizeText(dj.performer),
    type: sanitizeText(dj.type),
    notes: sanitizeText(dj.notes),
    cost: sanitizeNumber(dj.cost),
  }));
}

function normalizeFavorList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((favor) => ({
    id: sanitizeText(favor.id) || createId("favor"),
    item: sanitizeText(favor.item),
    qty: sanitizeInteger(favor.qty, 1),
    target: sanitizeText(favor.target),
    notes: sanitizeText(favor.notes),
    cost: sanitizeNumber(favor.cost),
  }));
}

function sanitizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeInteger(value, defaultValue) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) ? number : defaultValue;
}

function sanitizeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function sanitizeGroup(group) {
  const valid = new Set(["family", "girlfriend", "friends", "cousins", "colleagues", "vip"]);
  return valid.has(group) ? group : "friends";
}

function sanitizeTaskStatus(status) {
  const valid = new Set(["pending", "in_progress", "done"]);
  return valid.has(status) ? status : "pending";
}

function sanitizeMaterialStatus(status) {
  const valid = new Set(["pending", "ordered", "delivered"]);
  return valid.has(status) ? status : "pending";
}

function sanitizeDecorStatus(status) {
  const valid = new Set(["pending", "approved", "ready"]);
  return valid.has(status) ? status : "pending";
}

function persistState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderAll() {
  ensureSelectedEvent();
  renderWeddingMeta();
  renderGuestList();
  renderEventSelect();
  renderEventMeta();
  renderInviteGuestList();
  renderTaskList();
  renderMaterialList();
  renderFoodList();
  renderDecorList();
  renderDjList();
  renderFavorList();
  renderStats();
  renderBudget();
  renderShareLinkOutput();
  updateCountdown();
}

function ensureSelectedEvent() {
  if (!state.events.length) {
    return;
  }
  if (!state.events.some((event) => event.id === state.selectedEventId)) {
    state.selectedEventId = state.events[0].id;
  }
}

function currentEvent() {
  return state.events.find((event) => event.id === state.selectedEventId);
}

function renderWeddingMeta() {
  dom.coupleNameInput.value = state.meta.coupleName || "";
  dom.primaryVenueInput.value = state.meta.primaryVenue || "";
  dom.weddingDateInput.value = state.meta.weddingDate || "";
  
  // Update header
  if (dom.coupleNameDisplay) {
    dom.coupleNameDisplay.textContent = state.meta.coupleName || "Your Special Day";
  }
}

function renderGuestList() {
  if (!state.guests.length) {
    dom.guestListContainer.innerHTML = `<div class="muted text-center">No guests yet. Add your first guest!</div>`;
    return;
  }

  dom.guestListContainer.innerHTML = state.guests
    .map(
      (guest) => `
        <div class="guest-card">
          <div class="guest-info">
            <h4>${escapeHtml(guest.name)}</h4>
            <div class="guest-meta">
              <span class="guest-badge">${formatGroupLabel(guest.group)}</span>
              ${guest.phone ? `<span>📱 ${escapeHtml(guest.phone)}</span>` : ""}
              ${guest.dietary ? `<span>🥗 ${escapeHtml(guest.dietary)}</span>` : ""}
              ${guest.notes ? `<span>📝 ${escapeHtml(guest.notes)}</span>` : ""}
            </div>
          </div>
          <button class="btn-remove" data-action="remove-guest" data-id="${guest.id}">Remove</button>
        </div>
      `,
    )
    .join("");
}

function renderEventSelect() {
  dom.eventSelect.innerHTML = state.events
    .map(
      (event) =>
        `<option value="${event.id}" ${event.id === state.selectedEventId ? "selected" : ""}>${escapeHtml(event.name)}</option>`,
    )
    .join("");
}

function renderEventMeta() {
  const event = currentEvent();
  if (!event) {
    return;
  }
  dom.eventNameInput.value = event.name;
  dom.eventDateInput.value = event.date || "";
  dom.eventVenueInput.value = event.venue || "";
  dom.eventNotesInput.value = event.notes || "";
}

function renderInviteGuestList() {
  const event = currentEvent();
  if (!event) {
    dom.inviteGuestList.innerHTML = "";
    return;
  }

  const filter = dom.inviteGroupFilter.value;
  const filteredGuests = state.guests.filter((guest) => filter === "all" || guest.group === filter);

  if (!filteredGuests.length) {
    dom.inviteGuestList.innerHTML = `<p class="muted">No guests in this filter yet.</p>`;
    return;
  }

  dom.inviteGuestList.innerHTML = filteredGuests
    .map(
      (guest) => `
        <label class="checkbox-tile">
          <input
            type="checkbox"
            data-id="${guest.id}"
            ${event.invitedGuestIds.includes(guest.id) ? "checked" : ""}
          />
          <span>
            <strong>${escapeHtml(guest.name)}</strong>
            <small>${formatGroupLabel(guest.group)}</small>
          </span>
        </label>
      `,
    )
    .join("");
}

function renderTaskList() {
  const event = currentEvent();
  if (!event || !event.tasks.length) {
    dom.taskList.innerHTML = `<div class="muted text-center">No tasks yet</div>`;
    return;
  }

  dom.taskList.innerHTML = event.tasks
    .map(
      (task) => `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(task.title)}</div>
          <button class="btn-icon" data-action="remove-task" data-id="${task.id}">✕</button>
        </div>
        <div class="tracker-item-meta">
          ${task.owner ? `<span>👤 ${escapeHtml(task.owner)}</span>` : ""}
          <span>${formatTaskStatus(task.status)}</span>
          ${task.deadline ? `<span>📅 ${escapeHtml(task.deadline)}</span>` : ""}
        </div>
      </div>
    `,
    )
    .join("");
}

function formatTaskStatus(status) {
  const statusMap = {
    pending: "⏳ To Do",
    in_progress: "🔄 In Progress",
    done: "✅ Done"
  };
  return statusMap[status] || status;
}

function renderMaterialList() {
  const event = currentEvent();
  if (!event || !event.materials.length) {
    dom.materialList.innerHTML = `<div class="muted text-center">No materials yet</div>`;
    return;
  }

  dom.materialList.innerHTML = event.materials
    .map(
      (material) => `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(material.item)}</div>
          <button class="btn-icon" data-action="remove-material" data-id="${material.id}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span>Qty: ${escapeHtml(String(material.qty))}</span>
          ${material.vendor ? `<span>🏪 ${escapeHtml(material.vendor)}</span>` : ""}
          <span>${formatMaterialStatus(material.status)}</span>
          ${material.cost ? `<span>💰 ${formatCurrency(material.cost)}</span>` : ""}
        </div>
      </div>
    `,
    )
    .join("");
}

function formatMaterialStatus(status) {
  const statusMap = {
    pending: "⏳ Pending",
    ordered: "📦 Ordered",
    delivered: "✅ Delivered"
  };
  return statusMap[status] || status;
}

function renderFoodList() {
  const event = currentEvent();
  if (!event || !event.food.length) {
    dom.foodList.innerHTML = `<div class="muted text-center">No food items yet</div>`;
    return;
  }

  dom.foodList.innerHTML = event.food
    .map(
      (food) => `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(food.dish)}</div>
          <button class="btn-icon" data-action="remove-food" data-id="${food.id}">✕</button>
        </div>
        <div class="tracker-item-meta">
          ${food.course ? `<span>${escapeHtml(food.course)}</span>` : ""}
          ${food.vendor ? `<span>👨‍🍳 ${escapeHtml(food.vendor)}</span>` : ""}
          ${food.servings ? `<span>🍽️ ${escapeHtml(String(food.servings))} servings</span>` : ""}
          ${food.cost ? `<span>💰 ${formatCurrency(food.cost)}</span>` : ""}
        </div>
      </div>
    `,
    )
    .join("");
}

function renderDecorList() {
  const event = currentEvent();
  if (!event || !event.decor.length) {
    dom.decorList.innerHTML = `<div class="muted text-center">No decor items yet</div>`;
    return;
  }

  dom.decorList.innerHTML = event.decor
    .map(
      (decor) => `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(decor.element)}</div>
          <button class="btn-icon" data-action="remove-decor" data-id="${decor.id}">✕</button>
        </div>
        <div class="tracker-item-meta">
          ${decor.vendor ? `<span>🎨 ${escapeHtml(decor.vendor)}</span>` : ""}
          ${decor.theme ? `<span>🎭 ${escapeHtml(decor.theme)}</span>` : ""}
          <span>${formatDecorStatus(decor.status)}</span>
          ${decor.cost ? `<span>💰 ${formatCurrency(decor.cost)}</span>` : ""}
        </div>
      </div>
    `,
    )
    .join("");
}

function formatDecorStatus(status) {
  const statusMap = {
    pending: "⏳ Pending",
    approved: "👍 Approved",
    ready: "✅ Ready"
  };
  return statusMap[status] || status;
}

function renderDjList() {
  const event = currentEvent();
  if (!event || !event.dj.length) {
    dom.djList.innerHTML = `<div class="muted text-center">No entertainment items yet</div>`;
    return;
  }

  dom.djList.innerHTML = event.dj
    .map(
      (dj) => `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">⏰ ${escapeHtml(dj.slot)}</div>
          <button class="btn-icon" data-action="remove-dj" data-id="${dj.id}">✕</button>
        </div>
        <div class="tracker-item-meta">
          ${dj.performer ? `<span>🎤 ${escapeHtml(dj.performer)}</span>` : ""}
          ${dj.type ? `<span>${escapeHtml(dj.type)}</span>` : ""}
          ${dj.notes ? `<span>📝 ${escapeHtml(dj.notes)}</span>` : ""}
          ${dj.cost ? `<span>💰 ${formatCurrency(dj.cost)}</span>` : ""}
        </div>
      </div>
    `,
    )
    .join("");
}

function renderFavorList() {
  const event = currentEvent();
  if (!event || !event.favors.length) {
    dom.favorList.innerHTML = `<div class="muted text-center">No favors yet</div>`;
    return;
  }

  dom.favorList.innerHTML = event.favors
    .map(
      (favor) => `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(favor.item)}</div>
          <button class="btn-icon" data-action="remove-favor" data-id="${favor.id}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span>Qty: ${escapeHtml(String(favor.qty))}</span>
          ${favor.target ? `<span>🎯 ${escapeHtml(favor.target)}</span>` : ""}
          ${favor.notes ? `<span>📝 ${escapeHtml(favor.notes)}</span>` : ""}
          ${favor.cost ? `<span>💰 ${formatCurrency(favor.cost)}</span>` : ""}
        </div>
      </div>
    `,
    )
    .join("");
}

function renderStats() {
  const totalBudget = state.events.reduce((sum, item) => sum + eventCost(item), 0);
  const totalTasks = state.events.reduce((sum, item) => sum + item.tasks.length, 0);
  const doneTasks = state.events.reduce(
    (sum, item) => sum + item.tasks.filter((task) => task.status === "done").length,
    0,
  );

  dom.statGuestCount.textContent = state.guests.length;
  dom.statEventCount.textContent = state.events.length;
  dom.statTasksDone.textContent = doneTasks;
  dom.statTasksTotal.textContent = totalTasks;
  dom.statBudget.textContent = formatCurrency(totalBudget);
}

function renderBudget() {
  const totalBudget = state.events.reduce((sum, item) => sum + eventCost(item), 0);
  dom.totalBudgetAmount.textContent = formatCurrency(totalBudget);
  
  // Event budget breakdown
  dom.eventBudgetList.innerHTML = state.events
    .map(
      (event) => `
      <div class="event-budget-item">
        <div class="event-budget-name">${escapeHtml(event.name)}</div>
        <div class="event-budget-amount">${formatCurrency(eventCost(event))}</div>
      </div>
    `,
    )
    .join("");
  
  // Category budget breakdown
  const materialsCost = state.events.reduce(
    (sum, event) => sum + event.materials.reduce((s, item) => s + sanitizeNumber(item.cost), 0),
    0
  );
  const foodCost = state.events.reduce(
    (sum, event) => sum + event.food.reduce((s, item) => s + sanitizeNumber(item.cost), 0),
    0
  );
  const decorCost = state.events.reduce(
    (sum, event) => sum + event.decor.reduce((s, item) => s + sanitizeNumber(item.cost), 0),
    0
  );
  const djCost = state.events.reduce(
    (sum, event) => sum + event.dj.reduce((s, item) => s + sanitizeNumber(item.cost), 0),
    0
  );
  const favorCost = state.events.reduce(
    (sum, event) => sum + event.favors.reduce((s, item) => s + sanitizeNumber(item.cost), 0),
    0
  );
  
  dom.budgetMaterials.textContent = formatCurrency(materialsCost);
  dom.budgetFood.textContent = formatCurrency(foodCost);
  dom.budgetDecor.textContent = formatCurrency(decorCost);
  dom.budgetEntertainment.textContent = formatCurrency(djCost);
  dom.budgetFavors.textContent = formatCurrency(favorCost);
}

function renderShareLinkOutput() {
  dom.shareLinkOutput.value = buildShareUrl();
}

function eventCost(event) {
  return (
    event.materials.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.food.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.decor.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.dj.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.favors.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0)
  );
}

function onWeddingMetaChanged() {
  state.meta.coupleName = dom.coupleNameInput.value.trim();
  state.meta.primaryVenue = dom.primaryVenueInput.value.trim();
  state.meta.weddingDate = dom.weddingDateInput.value;
  saveAndRender();
}


function onResetPlan() {
  if (!window.confirm("Start fresh with a new wedding plan? This will delete all your current data.")) {
    return;
  }
  state = createDefaultState();
  saveAndRender("Fresh plan created");
}

function onGuestAdd(event) {
  event.preventDefault();
  const formData = new FormData(dom.guestForm);
  const name = sanitizeText(formData.get("name"));
  if (!name) {
    return;
  }

  state.guests.push({
    id: createId("guest"),
    name,
    group: sanitizeGroup(String(formData.get("group") || "")),
    phone: sanitizeText(formData.get("phone")),
    dietary: sanitizeText(formData.get("dietary")),
    notes: sanitizeText(formData.get("notes")),
  });

  dom.guestForm.reset();
  saveAndRender("Guest added");
}

function onGuestAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.action !== "remove-guest") {
    return;
  }

  const guestId = target.dataset.id;
  if (!guestId) {
    return;
  }

  state.guests = state.guests.filter((guest) => guest.id !== guestId);
  state.events.forEach((item) => {
    item.invitedGuestIds = item.invitedGuestIds.filter((id) => id !== guestId);
  });
  saveAndRender("Guest removed");
}

function onEventSelectionChanged() {
  state.selectedEventId = dom.eventSelect.value;
  saveAndRender();
}

function onEventAdd(event) {
  event.preventDefault();
  const formData = new FormData(dom.addEventForm);
  const name = sanitizeText(formData.get("name"));
  if (!name) {
    return;
  }

  const newEvent = {
    id: createId("event"),
    name,
    date: sanitizeText(formData.get("date")),
    venue: sanitizeText(formData.get("venue")),
    notes: "",
    invitedGuestIds: [],
    tasks: [],
    materials: [],
    food: [],
    decor: [],
    dj: [],
    favors: [],
  };

  state.events.push(newEvent);
  state.selectedEventId = newEvent.id;
  dom.addEventForm.reset();
  saveAndRender("Event added");
}

function onEventDelete() {
  if (state.events.length <= 1) {
    showToast("Need at least one event");
    return;
  }

  const event = currentEvent();
  if (!event) {
    return;
  }

  if (!window.confirm(`Delete "${event.name}"?`)) {
    return;
  }

  state.events = state.events.filter((item) => item.id !== event.id);
  state.selectedEventId = state.events[0].id;
  saveAndRender("Event deleted");
}

function onEventMetaChanged() {
  const event = currentEvent();
  if (!event) {
    return;
  }

  event.name = dom.eventNameInput.value.trim() || "Untitled Function";
  event.date = dom.eventDateInput.value;
  event.venue = dom.eventVenueInput.value.trim();
  event.notes = dom.eventNotesInput.value.trim();
  saveAndRender();
}

function onInviteFilteredGuests() {
  const event = currentEvent();
  if (!event) {
    return;
  }

  const filter = dom.inviteGroupFilter.value;
  const filtered = state.guests
    .filter((guest) => filter === "all" || guest.group === filter)
    .map((guest) => guest.id);

  event.invitedGuestIds = Array.from(new Set([...event.invitedGuestIds, ...filtered]));
  saveAndRender("Guests invited");
}

function onClearInvites() {
  const event = currentEvent();
  if (!event) {
    return;
  }
  event.invitedGuestIds = [];
  saveAndRender("Invites cleared");
}

function onApplyTraditionalScenario() {
  const mehndi = state.events.find((event) => event.name.toLowerCase().includes("mehndi"));
  const sangeet = state.events.find((event) => event.name.toLowerCase().includes("sangeet"));

  if (!mehndi && !sangeet) {
    showToast("No Mehndi or Sangeet events found");
    return;
  }

  const girlfriendIds = state.guests
    .filter((guest) => guest.group === "girlfriend")
    .map((guest) => guest.id);

  if (mehndi) {
    mehndi.invitedGuestIds = Array.from(new Set([...mehndi.invitedGuestIds, ...girlfriendIds]));
    mehndi.notes = appendLine(mehndi.notes, "Scenario: girlfriends invited for Mehndi.");
    const hasMehndiTask = mehndi.tasks.some((task) => task.title.toLowerCase().includes("girlfriends"));
    if (!hasMehndiTask) {
      mehndi.tasks.push(taskSeed("Confirm girlfriend invite calls and arrivals", "Bride squad", "pending", mehndi.date));
    }
  }

  if (sangeet) {
    sangeet.invitedGuestIds = Array.from(new Set([...sangeet.invitedGuestIds, ...girlfriendIds]));
    sangeet.notes = appendLine(
      sangeet.notes,
      "Scenario: earring party favors for invited women from guest list.",
    );

    const hasEarringFavor = sangeet.favors.some((favor) => favor.item.toLowerCase().includes("earring"));
    if (!hasEarringFavor) {
      sangeet.favors.push(
        favorSeed(
          "Earrings gift set",
          Math.max(girlfriendIds.length, 1),
          "Women invited from guest list",
          "Pack by group and reserve extras",
          0,
        ),
      );
    }
  }

  saveAndRender("Auto-invite applied");
}

function onInviteGuestToggle(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const guestId = target.dataset.id;
  const eventItem = currentEvent();
  if (!guestId || !eventItem) {
    return;
  }

  if (target.checked) {
    eventItem.invitedGuestIds = Array.from(new Set([...eventItem.invitedGuestIds, guestId]));
  } else {
    eventItem.invitedGuestIds = eventItem.invitedGuestIds.filter((id) => id !== guestId);
  }
  saveAndRender();
}

function onTaskAdd(event) {
  event.preventDefault();
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const formData = new FormData(dom.taskForm);
  const title = sanitizeText(formData.get("title"));
  if (!title) {
    return;
  }

  eventItem.tasks.push({
    id: createId("task"),
    title,
    owner: sanitizeText(formData.get("owner")),
    status: sanitizeTaskStatus(formData.get("status")),
    deadline: sanitizeText(formData.get("deadline")),
  });

  dom.taskForm.reset();
  saveAndRender("Task added");
}

function onTaskAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) {
    return;
  }

  if (action === "remove-task") {
    eventItem.tasks = eventItem.tasks.filter((task) => task.id !== id);
    saveAndRender("Task removed");
  }
}

function onMaterialAdd(event) {
  event.preventDefault();
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const formData = new FormData(dom.materialForm);
  const item = sanitizeText(formData.get("item"));
  if (!item) {
    return;
  }

  eventItem.materials.push({
    id: createId("material"),
    item,
    qty: sanitizeInteger(formData.get("qty"), 1),
    vendor: sanitizeText(formData.get("vendor")),
    status: sanitizeMaterialStatus(formData.get("status")),
    cost: sanitizeNumber(formData.get("cost")),
  });

  dom.materialForm.reset();
  saveAndRender("Material added");
}

function onMaterialAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) {
    return;
  }

  if (action === "remove-material") {
    eventItem.materials = eventItem.materials.filter((material) => material.id !== id);
    saveAndRender("Material removed");
  }
}

function onFoodAdd(event) {
  event.preventDefault();
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const formData = new FormData(dom.foodForm);
  const dish = sanitizeText(formData.get("dish"));
  if (!dish) {
    return;
  }

  eventItem.food.push({
    id: createId("food"),
    dish,
    course: sanitizeText(formData.get("course")),
    vendor: sanitizeText(formData.get("vendor")),
    servings: sanitizeInteger(formData.get("servings"), 0),
    cost: sanitizeNumber(formData.get("cost")),
  });

  dom.foodForm.reset();
  saveAndRender("Food item added");
}

function onFoodAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.dataset.action !== "remove-food") {
    return;
  }

  const id = target.dataset.id;
  const eventItem = currentEvent();
  if (!id || !eventItem) {
    return;
  }

  eventItem.food = eventItem.food.filter((food) => food.id !== id);
  saveAndRender("Food item removed");
}

function onDecorAdd(event) {
  event.preventDefault();
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const formData = new FormData(dom.decorForm);
  const element = sanitizeText(formData.get("element"));
  if (!element) {
    return;
  }

  eventItem.decor.push({
    id: createId("decor"),
    element,
    vendor: sanitizeText(formData.get("vendor")),
    theme: sanitizeText(formData.get("theme")),
    status: sanitizeDecorStatus(formData.get("status")),
    cost: sanitizeNumber(formData.get("cost")),
  });

  dom.decorForm.reset();
  saveAndRender("Decor added");
}

function onDecorAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) {
    return;
  }

  if (action === "remove-decor") {
    eventItem.decor = eventItem.decor.filter((decor) => decor.id !== id);
    saveAndRender("Decor item removed");
  }
}

function onDjAdd(event) {
  event.preventDefault();
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const formData = new FormData(dom.djForm);
  const slot = sanitizeText(formData.get("slot"));
  if (!slot) {
    return;
  }

  eventItem.dj.push({
    id: createId("dj"),
    slot,
    performer: sanitizeText(formData.get("performer")),
    type: sanitizeText(formData.get("type")),
    notes: sanitizeText(formData.get("notes")),
    cost: sanitizeNumber(formData.get("cost")),
  });

  dom.djForm.reset();
  saveAndRender("Entertainment added");
}

function onDjAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.dataset.action !== "remove-dj") {
    return;
  }

  const id = target.dataset.id;
  const eventItem = currentEvent();
  if (!id || !eventItem) {
    return;
  }

  eventItem.dj = eventItem.dj.filter((dj) => dj.id !== id);
  saveAndRender("Entertainment item removed");
}

function onFavorAdd(event) {
  event.preventDefault();
  const eventItem = currentEvent();
  if (!eventItem) {
    return;
  }

  const formData = new FormData(dom.favorForm);
  const item = sanitizeText(formData.get("item"));
  if (!item) {
    return;
  }

  eventItem.favors.push({
    id: createId("favor"),
    item,
    qty: sanitizeInteger(formData.get("qty"), 1),
    target: sanitizeText(formData.get("target")),
    notes: sanitizeText(formData.get("notes")),
    cost: sanitizeNumber(formData.get("cost")),
  });

  dom.favorForm.reset();
  saveAndRender("Favor added");
}

function onFavorAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  if (target.dataset.action !== "remove-favor") {
    return;
  }

  const id = target.dataset.id;
  const eventItem = currentEvent();
  if (!id || !eventItem) {
    return;
  }

  eventItem.favors = eventItem.favors.filter((favor) => favor.id !== id);
  saveAndRender("Favor removed");
}

function saveAndRender(statusText) {
  persistState();
  renderAll();
  if (statusText) {
    showToast(statusText);
  }
}

function appendLine(base, line) {
  if (!base) {
    return line;
  }
  return base.includes(line) ? base : `${base} ${line}`;
}

function buildShareUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encodeBase64Url(JSON.stringify(state)));
  return url.toString();
}

function encodeBase64Url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${base64}${"=".repeat((4 - (base64.length % 4)) % 4)}`;
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function formatGroupLabel(group) {
  const labels = {
    family: "Family",
    girlfriend: "Girlfriends",
    friends: "Friends",
    cousins: "Cousins",
    colleagues: "Colleagues",
    vip: "VIP",
  };
  return labels[group] || group;
}

function formatCurrency(value) {
  const amount = sanitizeNumber(value);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    amount,
  );
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
