const STORAGE_KEY = "myWeddingJourneyStateV2";
const SHARE_PARAM = "plan";

const dom = {};
let state = createDefaultState();
let activeTab = "overview";
let currentEditingGuestId = null;
let selectedPlanningEventIds = [];

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  bindEvents();
  loadInitialState();
  renderAll();
  updateCountdown();
  setInterval(updateCountdown, 1000); // Update countdown every second so day change at midnight is reflected
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
  dom.totalBudgetInput = document.getElementById("totalBudgetInput");
  dom.budgetTotal = document.getElementById("budgetTotal");
  dom.budgetSpent = document.getElementById("budgetSpent");
  dom.budgetRemaining = document.getElementById("budgetRemaining");
  dom.budgetSpentBar = document.getElementById("budgetSpentBar");
  dom.statGuestCount = document.getElementById("statGuestCount");
  dom.statEventCount = document.getElementById("statEventCount");
  dom.statTasksDone = document.getElementById("statTasksDone");
  dom.statTasksTotal = document.getElementById("statTasksTotal");
  dom.statBudget = document.getElementById("statBudget");
  dom.shareLinkOutput = document.getElementById("shareLinkOutput");
  dom.copyLinkBtn = document.getElementById("copyLinkBtn");
  dom.printMasterPlanBtn = document.getElementById("printMasterPlanBtn");
  dom.resetPlanBtn = document.getElementById("resetPlanBtn");

  // Guests tab
  dom.guestForm = document.getElementById("guestForm");
  dom.guestListContainer = document.getElementById("guestListContainer");

  // Events tab
  dom.addEventForm = document.getElementById("addEventForm");
  dom.allEventsPreview = document.getElementById("allEventsPreview");
  dom.eventSelect = document.getElementById("eventSelect");
  dom.deleteEventBtn = document.getElementById("deleteEventBtn");
  dom.eventMetaForm = document.getElementById("eventMetaForm");
  dom.eventNameInput = document.getElementById("eventNameInput");
  dom.eventDateInput = document.getElementById("eventDateInput");
  dom.eventVenueInput = document.getElementById("eventVenueInput");
  dom.eventNotesInput = document.getElementById("eventNotesInput");
  dom.inviteGroupFilter = document.getElementById("inviteGroupFilter");
  dom.inviteFilteredBtn = document.getElementById("inviteFilteredBtn");
  dom.selectAllGuestsBtn = document.getElementById("selectAllGuestsBtn");
  dom.clearInvitesBtn = document.getElementById("clearInvitesBtn");
  dom.applyTraditionalScenarioBtn = document.getElementById("applyTraditionalScenarioBtn");
  dom.inviteGuestList = document.getElementById("inviteGuestList");

  // Planning tab
  dom.planningEventCheckboxes = document.getElementById("planningEventCheckboxes");
  dom.selectedEventsDisplay = document.getElementById("selectedEventsDisplay");
  dom.taskForm = document.getElementById("taskForm");
  dom.taskList = document.getElementById("taskList");
  dom.vendorForm = document.getElementById("vendorForm");
  dom.vendorList = document.getElementById("vendorList");
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
  dom.budgetTabTotal = document.getElementById("budgetTabTotal");
  dom.budgetTabSpent = document.getElementById("budgetTabSpent");
  dom.budgetTabRemaining = document.getElementById("budgetTabRemaining");
  dom.budgetProgressBar = document.getElementById("budgetProgressBar");
  dom.budgetPercentage = document.getElementById("budgetPercentage");
  dom.vendorPaymentsList = document.getElementById("vendorPaymentsList");
  dom.eventBudgetList = document.getElementById("eventBudgetList");
  dom.budgetVendors = document.getElementById("budgetVendors");
  dom.budgetMaterials = document.getElementById("budgetMaterials");
  dom.budgetFood = document.getElementById("budgetFood");
  dom.budgetDecor = document.getElementById("budgetDecor");
  dom.budgetEntertainment = document.getElementById("budgetEntertainment");
  dom.budgetFavors = document.getElementById("budgetFavors");

  // Invitations tab
  dom.invitationsSent = document.getElementById("invitationsSent");
  dom.invitationsPending = document.getElementById("invitationsPending");
  dom.invitationsTotal = document.getElementById("invitationsTotal");
  dom.markAllSentBtn = document.getElementById("markAllSentBtn");
  dom.markAllPendingBtn = document.getElementById("markAllPendingBtn");
  dom.invitationFilterSelect = document.getElementById("invitationFilterSelect");
  dom.invitationsList = document.getElementById("invitationsList");
  dom.printInvitationsBtn = document.getElementById("printInvitationsBtn");


  // Print buttons
  dom.printGuestListBtn = document.getElementById("printGuestListBtn");
  dom.printEventsBtn = document.getElementById("printEventsBtn");
  dom.printBudgetBtn = document.getElementById("printBudgetBtn");
  dom.printExpensesBtn = document.getElementById("printExpensesBtn");

  // Toast
  dom.statusToast = document.getElementById("statusToast");
  
  // Modal
  dom.shareModal = document.getElementById("shareModal");
  dom.closeModal = document.getElementById("closeModal");
  dom.modalShareLink = document.getElementById("modalShareLink");
  dom.modalCopyBtn = document.getElementById("modalCopyBtn");
  
  // Guest Names Modal
  dom.guestNamesModal = document.getElementById("guestNamesModal");
  dom.closeGuestNamesModal = document.getElementById("closeGuestNamesModal");
  dom.closeGuestNamesBtn = document.getElementById("closeGuestNamesBtn");
  dom.guestNamesModalTitle = document.getElementById("guestNamesModalTitle");
  dom.guestNamesModalDesc = document.getElementById("guestNamesModalDesc");
  dom.editGroupCount = document.getElementById("editGroupCount");
  dom.updateGroupCountBtn = document.getElementById("updateGroupCountBtn");
  dom.countHint = document.getElementById("countHint");
  dom.addGuestNameForm = document.getElementById("addGuestNameForm");
  dom.guestNamesList = document.getElementById("guestNamesList");
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
  if (dom.weddingDateInput) {
    dom.weddingDateInput.addEventListener("change", onWeddingMetaChanged);
    dom.weddingDateInput.addEventListener("input", onWeddingMetaChanged);
  }
  dom.copyLinkBtn.addEventListener("click", onCopyLink);
  if (dom.printMasterPlanBtn) {
    dom.printMasterPlanBtn.addEventListener("click", printMasterPlan);
  }
  dom.resetPlanBtn.addEventListener("click", onResetPlan);

  // Guests tab
  dom.guestForm.addEventListener("submit", onGuestAdd);
  dom.guestListContainer.addEventListener("click", onGuestAction);

  // Events tab
  dom.addEventForm.addEventListener("submit", onEventAdd);
  if (dom.allEventsPreview) {
    dom.allEventsPreview.addEventListener("click", onEventPreviewClick);
  }
  dom.eventSelect.addEventListener("change", onEventSelectionChanged);
  dom.deleteEventBtn.addEventListener("click", onEventDelete);
  dom.eventMetaForm.addEventListener("input", onEventMetaChanged);
  if (dom.eventDateInput) {
    dom.eventDateInput.addEventListener("change", onEventMetaChanged);
  }
  if (dom.eventVenueInput) {
    dom.eventVenueInput.addEventListener("change", onEventMetaChanged);
  }
  dom.inviteGroupFilter.addEventListener("change", renderInviteGuestList);
  dom.inviteFilteredBtn.addEventListener("click", onInviteFilteredGuests);
  dom.selectAllGuestsBtn.addEventListener("click", onSelectAllGuests);
  dom.clearInvitesBtn.addEventListener("click", onClearInvites);
  dom.applyTraditionalScenarioBtn.addEventListener("click", onApplyTraditionalScenario);
  dom.inviteGuestList.addEventListener("change", onInviteGuestToggle);

  // Planning tab
  if (dom.planningEventCheckboxes) {
    dom.planningEventCheckboxes.addEventListener("change", onPlanningEventToggle);
  }
  dom.taskForm.addEventListener("submit", onTaskAdd);
  dom.taskList.addEventListener("click", onTaskAction);

  dom.vendorForm.addEventListener("submit", onVendorAdd);
  dom.vendorList.addEventListener("click", onVendorAction);

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
  
  // Invitations tab
  if (dom.markAllSentBtn) {
    dom.markAllSentBtn.addEventListener("click", onMarkAllSent);
  }
  if (dom.markAllPendingBtn) {
    dom.markAllPendingBtn.addEventListener("click", onMarkAllPending);
  }
  if (dom.invitationFilterSelect) {
    dom.invitationFilterSelect.addEventListener("change", renderInvitationsList);
  }
  if (dom.invitationsList) {
    dom.invitationsList.addEventListener("click", onInvitationAction);
  }
  if (dom.printInvitationsBtn) {
    dom.printInvitationsBtn.addEventListener("click", printInvitations);
  }
  
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
  
  // Guest Names Modal
  if (dom.closeGuestNamesModal) {
    dom.closeGuestNamesModal.addEventListener("click", closeGuestNamesModal);
  }
  if (dom.closeGuestNamesBtn) {
    dom.closeGuestNamesBtn.addEventListener("click", closeGuestNamesModal);
  }
  if (dom.guestNamesModal) {
    dom.guestNamesModal.addEventListener("click", (e) => {
      if (e.target === dom.guestNamesModal) closeGuestNamesModal();
    });
  }
  if (dom.updateGroupCountBtn) {
    dom.updateGroupCountBtn.addEventListener("click", onUpdateGroupCount);
  }
  if (dom.addGuestNameForm) {
    dom.addGuestNameForm.addEventListener("submit", onAddGuestName);
  }
  if (dom.guestNamesList) {
    dom.guestNamesList.addEventListener("click", onGuestNameAction);
  }

  // Print buttons
  if (dom.printGuestListBtn) dom.printGuestListBtn.addEventListener("click", printGuestList);
  if (dom.printEventsBtn) dom.printEventsBtn.addEventListener("click", printEvents);
  if (dom.printBudgetBtn) dom.printBudgetBtn.addEventListener("click", printBudget);
  if (dom.printExpensesBtn) dom.printExpensesBtn.addEventListener("click", printExpenses);
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
  
  // Initialize planning event selection when switching to planning tab
  if (tabName === "planning") {
    if (selectedPlanningEventIds.length === 0 && state.selectedEventId) {
      selectedPlanningEventIds = [state.selectedEventId];
      renderPlanningEventCheckboxes();
    }
  }
  
  // Refresh invitations list when switching to invitations tab
  if (tabName === "invitations") {
    renderInvitationsList();
  }
}

// Countdown calculator
function updateCountdown() {
  if (!dom.countdownDays) {
    console.log("Countdown element not found");
    return;
  }
  
  // Use value from input if available (in case state not yet synced), then state, then Wedding event date
  let weddingDateStr = (dom.weddingDateInput && dom.weddingDateInput.value) || state.meta.weddingDate || "";
  console.log("Initial wedding date:", weddingDateStr);
  
  if (!weddingDateStr || !weddingDateStr.trim()) {
    if (state.events && Array.isArray(state.events)) {
      const weddingEvent = state.events.find((e) => e.name && e.name.toLowerCase().includes("wedding"));
      if (weddingEvent && weddingEvent.date) {
        weddingDateStr = weddingEvent.date;
        console.log("Using Wedding event date:", weddingDateStr);
      }
    }
  }
  
  const weddingDate = typeof weddingDateStr === "string" ? weddingDateStr.trim() : "";
  if (!weddingDate) {
    console.log("No wedding date found");
    dom.countdownDays.textContent = "--";
    return;
  }
  
  console.log("Processing date:", weddingDate);
  
  // Parse as local date (YYYY-MM-DD) to avoid timezone issues
  const parts = weddingDate.split("-");
  if (parts.length !== 3) {
    console.error("Invalid date format:", weddingDate);
    dom.countdownDays.textContent = "--";
    return;
  }
  
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    console.error("Invalid date parts:", { y, m, d });
    dom.countdownDays.textContent = "--";
    return;
  }
  
  const wedding = new Date(y, m, d);
  if (Number.isNaN(wedding.getTime())) {
    console.error("Invalid date object");
    dom.countdownDays.textContent = "--";
    return;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  wedding.setHours(0, 0, 0, 0);
  
  const diffTime = wedding - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  console.log("Countdown calculated:", { wedding: wedding.toDateString(), today: today.toDateString(), diffDays });
  
  if (Number.isNaN(diffDays)) {
    dom.countdownDays.textContent = "--";
    return;
  }
  
  if (diffDays < 0) {
    dom.countdownDays.textContent = "✓";
  } else if (diffDays === 0) {
    dom.countdownDays.textContent = "TODAY";
  } else {
    dom.countdownDays.textContent = String(diffDays);
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
  const guests = [];

  const events = [
    {
      id: "event_engagement",
      name: "Engagement",
      date: "",
      venue: "",
      notes: "",
      invitedGuestIds: [],
      tasks: [],
      vendors: [],
      materials: [],
      food: [],
      decor: [],
      dj: [],
      favors: [],
    },
    {
      id: "event_haldi",
      name: "Haldi",
      date: "",
      venue: "",
      notes: "",
      invitedGuestIds: [],
      tasks: [],
      vendors: [],
      materials: [],
      food: [],
      decor: [],
      dj: [],
      favors: [],
    },
    {
      id: "event_mehndi",
      name: "Mehndi",
      date: "",
      venue: "",
      notes: "",
      invitedGuestIds: [],
      tasks: [],
      vendors: [],
      materials: [],
      food: [],
      decor: [],
      dj: [],
      favors: [],
    },
    {
      id: "event_sangeet",
      name: "Sangeet",
      date: "",
      venue: "",
      notes: "",
      invitedGuestIds: [],
      tasks: [],
      vendors: [],
      materials: [],
      food: [],
      decor: [],
      dj: [],
      favors: [],
    },
    {
      id: "event_wedding",
      name: "Wedding",
      date: "",
      venue: "",
      notes: "",
      invitedGuestIds: [],
      tasks: [],
      vendors: [],
      materials: [],
      food: [],
      decor: [],
      dj: [],
      favors: [],
    },
  ];

  return {
    meta: {
      coupleName: "",
      primaryVenue: "",
      weddingDate: "",
      totalBudget: 20000,
    },
    guests,
    events,
    selectedEventId: events[0].id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function guestSeed(id, name, group, count, phone, notes) {
  return { id, name, group, count: count || 1, phone, notes };
}

function taskSeed(title, owner, status, deadline) {
  return { id: createId("task"), title, owner, status, deadline };
}

function materialSeed(item, qty, vendor, status, cost, advance = 0) {
  return { id: createId("material"), item, qty, vendor, status, cost, advance };
}

function foodSeed(dish, course, vendor, servings, cost, advance = 0) {
  return { id: createId("food"), dish, course, vendor, servings, cost, advance };
}

function decorSeed(element, vendor, theme, status, cost, advance = 0) {
  return { id: createId("decor"), element, vendor, theme, status, cost, advance };
}

function djSeed(slot, performer, type, notes, cost, advance = 0) {
  return { id: createId("dj"), slot, performer, type, notes, cost, advance };
}

function favorSeed(item, qty, target, notes, cost, advance = 0, vendor = "") {
  return { id: createId("favor"), item, qty, vendor, target, notes, cost, advance };
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
        count: sanitizeInteger(guest.count, 1),
        group: sanitizeGroup(guest.group),
        phone: sanitizeText(guest.phone),
        notes: sanitizeText(guest.notes),
        names: Array.isArray(guest.names) ? guest.names.map(n => sanitizeText(n)).filter(Boolean) : [],
        invitationSent: guest.invitationSent === true,
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
      totalBudget: sanitizeNumber(raw.meta && raw.meta.totalBudget) || fallback.meta.totalBudget,
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
    vendors: normalizeVendorList(event.vendors),
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

function normalizeVendorList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((vendor) => ({
    id: sanitizeText(vendor.id) || createId("vendor"),
    vendor: sanitizeText(vendor.vendor),
    service: sanitizeText(vendor.service),
    contact: sanitizeText(vendor.contact),
    cost: sanitizeNumber(vendor.cost),
    advance: sanitizeNumber(vendor.advance),
    status: sanitizeVendorStatus(vendor.status),
    notes: sanitizeText(vendor.notes),
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
    advance: sanitizeNumber(material.advance),
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
    advance: sanitizeNumber(food.advance),
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
    advance: sanitizeNumber(decor.advance),
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
    advance: sanitizeNumber(dj.advance),
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
    vendor: sanitizeText(favor.vendor),
    target: sanitizeText(favor.target),
    notes: sanitizeText(favor.notes),
    cost: sanitizeNumber(favor.cost),
    advance: sanitizeNumber(favor.advance),
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

function sanitizeVendorStatus(status) {
  const valid = new Set(["pending", "contacted", "booked", "confirmed", "completed"]);
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
  renderAllEventsPreview();
  renderEventSelect();
  renderEventMeta();
  renderInviteGuestList();
  renderPlanningEventCheckboxes();
  renderTaskList();
  renderVendorList();
  renderMaterialList();
  renderFoodList();
  renderDecorList();
  renderDjList();
  renderFavorList();
  renderInvitationsList();
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
  dom.totalBudgetInput.value = state.meta.totalBudget || 20000;
  
  // Update header
  if (dom.coupleNameDisplay) {
    dom.coupleNameDisplay.textContent = state.meta.coupleName || "Professional Event Management";
  }
  
  // Update budget tracker
  updateBudgetTracker();
}

function updateBudgetTracker() {
  const totalBudget = sanitizeNumber(state.meta.totalBudget) || 20000;
  const totalSpent = calculateTotalSpent();
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  
  if (dom.budgetTotal) {
    dom.budgetTotal.textContent = formatCAD(totalBudget);
  }
  if (dom.budgetSpent) {
    dom.budgetSpent.textContent = formatCAD(totalSpent);
  }
  if (dom.budgetRemaining) {
    dom.budgetRemaining.textContent = formatCAD(remaining);
    if (remaining < 0) {
      dom.budgetRemaining.style.color = '#ef4444';
    } else {
      dom.budgetRemaining.style.color = '';
    }
  }
  if (dom.budgetSpentBar) {
    dom.budgetSpentBar.style.width = percentSpent + '%';
  }
}

function calculateTotalSpent() {
  let total = 0;
  state.events.forEach(event => {
    if (event.vendors) {
      event.vendors.forEach(item => total += sanitizeNumber(item.advance || item.cost));
    }
    event.materials.forEach(item => total += sanitizeNumber(item.advance || item.cost));
    event.food.forEach(item => total += sanitizeNumber(item.advance || item.cost));
    event.decor.forEach(item => total += sanitizeNumber(item.advance || item.cost));
    event.dj.forEach(item => total += sanitizeNumber(item.advance || item.cost));
    event.favors.forEach(item => total += sanitizeNumber(item.advance || item.cost));
  });
  return total;
}

function formatCAD(amount) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function renderGuestList() {
  if (!state.guests.length) {
    dom.guestListContainer.innerHTML = `<div class="muted text-center">No guest groups yet. Add your first group</div>`;
    return;
  }

  dom.guestListContainer.innerHTML = state.guests
    .map(
      (guest) => {
        const count = guest.count || 1;
        const countLabel = count === 1 ? '1 person' : `${count} people`;
        const namesCount = guest.names ? guest.names.length : 0;
        const namesList = guest.names && guest.names.length > 0 
          ? `<div class="guest-names-preview"><strong>Names:</strong> ${guest.names.map(escapeHtml).join(', ')}</div>` 
          : '';
        
        return `
        <div class="guest-card">
          <div class="guest-info">
            <div class="guest-header">
              <h4>${escapeHtml(guest.name)}</h4>
              <span class="guest-count">${countLabel}${namesCount > 0 ? ` (${namesCount} named)` : ''}</span>
            </div>
            <div class="guest-meta">
              <span class="guest-badge">${formatGroupLabel(guest.group)}</span>
              ${guest.phone ? `<span>Phone: ${escapeHtml(guest.phone)}</span>` : ""}
              ${guest.notes ? `<span>Notes: ${escapeHtml(guest.notes)}</span>` : ""}
            </div>
            ${namesList}
            <button class="manage-names-btn" data-action="manage-names" data-id="${guest.id}">
              ${namesCount > 0 ? 'Edit Names' : 'Add Names'} (${namesCount}/${count})
            </button>
          </div>
          <button class="btn-remove" data-action="remove-guest" data-id="${guest.id}">Remove</button>
        </div>
      `;
      }
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

function renderAllEventsPreview() {
  if (!dom.allEventsPreview) return;
  
  if (state.events.length === 0) {
    dom.allEventsPreview.innerHTML = `<p class="muted">No events added yet. Add your first event above!</p>`;
    return;
  }
  
  dom.allEventsPreview.innerHTML = state.events
    .map((event) => {
      const invitedCount = event.invitedGuestIds.length;
      const totalHeadCount = event.invitedGuestIds
        .map((id) => state.guests.find((g) => g.id === id))
        .filter(Boolean)
        .reduce((sum, guest) => sum + (guest.count || 1), 0);
      const isSelected = event.id === state.selectedEventId;
      
      return `
        <div class="event-preview-card ${isSelected ? 'selected' : ''}" data-event-id="${event.id}">
          <div class="event-preview-title">${escapeHtml(event.name)}</div>
          <div class="event-preview-info">
            ${event.date ? `<div class="event-preview-stat">📅 ${escapeHtml(event.date)}</div>` : ''}
            ${event.venue ? `<div class="event-preview-stat">📍 ${escapeHtml(event.venue)}</div>` : ''}
            <div class="event-preview-stat">👥 ${invitedCount} ${invitedCount === 1 ? 'group' : 'groups'} • ${totalHeadCount} ${totalHeadCount === 1 ? 'person' : 'people'}</div>
          </div>
        </div>
      `;
    })
    .join("");
}

function onEventPreviewClick(e) {
  const card = e.target.closest('.event-preview-card');
  if (!card) return;
  
  const eventId = card.dataset.eventId;
  if (eventId && eventId !== state.selectedEventId) {
    state.selectedEventId = eventId;
    saveAndRender();
  }
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
      (guest) => {
        const count = guest.count || 1;
        const countLabel = count === 1 ? '1 person' : `${count} people`;
        return `
        <label class="checkbox-tile">
          <input
            type="checkbox"
            data-id="${guest.id}"
            ${event.invitedGuestIds.includes(guest.id) ? "checked" : ""}
          />
          <span>
            <strong>${escapeHtml(guest.name)}</strong>
            <small>${formatGroupLabel(guest.group)} • ${countLabel}</small>
          </span>
        </label>
      `;
      }
    )
    .join("");
}

function renderPlanningEventCheckboxes() {
  if (!dom.planningEventCheckboxes) return;
  
  if (state.events.length === 0) {
    dom.planningEventCheckboxes.innerHTML = '<p class="muted">No events available</p>';
    return;
  }
  
  // Initialize selectedPlanningEventIds with current event if empty
  if (selectedPlanningEventIds.length === 0 && state.selectedEventId) {
    selectedPlanningEventIds = [state.selectedEventId];
  }
  
  dom.planningEventCheckboxes.innerHTML = state.events
    .map(event => {
      const isChecked = selectedPlanningEventIds.includes(event.id);
      return `
        <label class="event-checkbox-item ${isChecked ? 'selected' : ''}" data-event-id="${event.id}">
          <input 
            type="checkbox" 
            value="${event.id}" 
            ${isChecked ? 'checked' : ''}
          />
          <span class="event-checkbox-label">${escapeHtml(event.name)}</span>
        </label>
      `;
    })
    .join('');
  
  updateSelectedEventsDisplay();
}

function updateSelectedEventsDisplay() {
  if (!dom.selectedEventsDisplay) return;
  
  if (selectedPlanningEventIds.length === 0) {
    dom.selectedEventsDisplay.textContent = 'None - Please select at least one event';
    dom.selectedEventsDisplay.style.color = 'var(--danger)';
    return;
  }
  
  const selectedNames = selectedPlanningEventIds
    .map(id => {
      const event = state.events.find(e => e.id === id);
      return event ? event.name : null;
    })
    .filter(Boolean)
    .join(', ');
  
  dom.selectedEventsDisplay.textContent = selectedNames;
  dom.selectedEventsDisplay.style.color = 'var(--text-secondary)';
}

function onPlanningEventToggle(e) {
  const checkbox = e.target;
  if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== 'checkbox') {
    return;
  }
  
  const eventId = checkbox.value;
  const label = checkbox.closest('.event-checkbox-item');
  
  if (checkbox.checked) {
    if (!selectedPlanningEventIds.includes(eventId)) {
      selectedPlanningEventIds.push(eventId);
    }
    if (label) label.classList.add('selected');
  } else {
    selectedPlanningEventIds = selectedPlanningEventIds.filter(id => id !== eventId);
    if (label) label.classList.remove('selected');
  }
  
  updateSelectedEventsDisplay();
}

function getSelectedEvents() {
  return selectedPlanningEventIds
    .map(id => state.events.find(e => e.id === id))
    .filter(Boolean);
}

function renderTaskList() {
  const selectedEvents = getSelectedEvents();
  
  if (selectedEvents.length === 0) {
    dom.taskList.innerHTML = `<div class="muted text-center">Please select at least one event to view/add tasks</div>`;
    return;
  }
  
  // Collect all tasks from selected events
  const allTasks = [];
  selectedEvents.forEach(event => {
    if (event.tasks && event.tasks.length > 0) {
      event.tasks.forEach(task => {
        allTasks.push({
          ...task,
          eventName: event.name,
          eventId: event.id
        });
      });
    }
  });
  
  if (allTasks.length === 0) {
    dom.taskList.innerHTML = `<div class="muted text-center">No tasks yet for selected events</div>`;
    return;
  }

  dom.taskList.innerHTML = allTasks
    .map(
      (task) => `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(task.title)}</div>
          <button class="btn-icon" data-action="remove-task" data-id="${task.id}" data-event-id="${task.eventId}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span class="event-tag">${escapeHtml(task.eventName)}</span>
          ${task.owner ? `<span>Owner: ${escapeHtml(task.owner)}</span>` : ""}
          <span>${formatTaskStatus(task.status)}</span>
          ${task.deadline ? `<span>Due: ${escapeHtml(task.deadline)}</span>` : ""}
        </div>
      </div>
    `,
    )
    .join("");
}

function formatTaskStatus(status) {
  const statusMap = {
    pending: "To Do",
    in_progress: "In Progress",
    done: "Done"
  };
  return statusMap[status] || status;
}

function renderVendorList() {
  const event = currentEvent();
  if (!event || !event.vendors || !event.vendors.length) {
    dom.vendorList.innerHTML = `<div class="muted text-center">No vendor bookings yet</div>`;
    return;
  }

  dom.vendorList.innerHTML = event.vendors
    .map(
      (vendor) => {
        const cost = sanitizeNumber(vendor.cost);
        const advance = sanitizeNumber(vendor.advance);
        const pending = cost - advance;
        return `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(vendor.vendor)}</div>
          <button class="btn-icon" data-action="remove-vendor" data-id="${vendor.id}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span><strong>${escapeHtml(vendor.service)}</strong></span>
          ${vendor.contact ? `<span>Contact: ${escapeHtml(vendor.contact)}</span>` : ""}
          <span>${formatVendorStatus(vendor.status)}</span>
          ${vendor.notes ? `<span>Notes: ${escapeHtml(vendor.notes)}</span>` : ""}
        </div>
        ${cost > 0 ? `
        <div class="payment-details">
          <span class="payment-label">Total: ${formatCAD(cost)}</span>
          ${advance > 0 ? `<span class="payment-paid">Paid: ${formatCAD(advance)}</span>` : ""}
          ${pending > 0 ? `<span class="payment-pending">Pending: ${formatCAD(pending)}</span>` : ""}
        </div>
        ` : ""}
      </div>
    `;
      }
    )
    .join("");
}

function formatVendorStatus(status) {
  const statusMap = {
    pending: "Pending",
    contacted: "Contacted",
    booked: "Booked",
    confirmed: "Confirmed",
    completed: "Completed"
  };
  return statusMap[status] || status;
}


function renderMaterialList() {
  const selectedEvents = getSelectedEvents();
  
  if (selectedEvents.length === 0) {
    dom.materialList.innerHTML = `<div class="muted text-center">Please select at least one event to view/add materials</div>`;
    return;
  }
  
  // Collect all materials from selected events
  const allMaterials = [];
  selectedEvents.forEach(event => {
    if (event.materials && event.materials.length > 0) {
      event.materials.forEach(material => {
        allMaterials.push({
          ...material,
          eventName: event.name,
          eventId: event.id
        });
      });
    }
  });
  
  if (allMaterials.length === 0) {
    dom.materialList.innerHTML = `<div class="muted text-center">No materials yet for selected events</div>`;
    return;
  }

  dom.materialList.innerHTML = allMaterials
    .map(
      (material) => {
        const cost = sanitizeNumber(material.cost);
        const advance = sanitizeNumber(material.advance);
        const pending = cost - advance;
        return `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(material.item)}</div>
          <button class="btn-icon" data-action="remove-material" data-id="${material.id}" data-event-id="${material.eventId}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span class="event-tag">${escapeHtml(material.eventName)}</span>
          <span>Qty: ${escapeHtml(String(material.qty))}</span>
          ${material.vendor ? `<span>Vendor: ${escapeHtml(material.vendor)}</span>` : ""}
          <span>${formatMaterialStatus(material.status)}</span>
        </div>
        ${cost > 0 ? `
        <div class="payment-details">
          <span class="payment-label">Total: ${formatCAD(cost)}</span>
          ${advance > 0 ? `<span class="payment-paid">Paid: ${formatCAD(advance)}</span>` : ""}
          ${pending > 0 ? `<span class="payment-pending">Pending: ${formatCAD(pending)}</span>` : ""}
        </div>
        ` : ""}
      </div>
    `;
      }
    )
    .join("");
}

function formatMaterialStatus(status) {
  const statusMap = {
    pending: "Pending",
    ordered: "Ordered",
    delivered: "Delivered"
  };
  return statusMap[status] || status;
}

function renderFoodList() {
  const selectedEvents = getSelectedEvents();

  if (selectedEvents.length === 0) {
    dom.foodList.innerHTML = `<div class="muted text-center">Please select at least one event to view/add food items</div>`;
    return;
  }

  const allFood = [];
  selectedEvents.forEach(event => {
    if (event.food && event.food.length > 0) {
      event.food.forEach(food => {
        allFood.push({
          ...food,
          eventName: event.name,
          eventId: event.id
        });
      });
    }
  });

  if (allFood.length === 0) {
    dom.foodList.innerHTML = `<div class="muted text-center">No food items yet for selected events</div>`;
    return;
  }

  dom.foodList.innerHTML = allFood
    .map(
      (food) => {
        const cost = sanitizeNumber(food.cost);
        const advance = sanitizeNumber(food.advance);
        const pending = cost - advance;
        return `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(food.dish)}</div>
          <button class="btn-icon" data-action="remove-food" data-id="${food.id}" data-event-id="${food.eventId}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span class="event-tag">${escapeHtml(food.eventName)}</span>
          ${food.course ? `<span>${escapeHtml(food.course)}</span>` : ""}
          ${food.vendor ? `<span>Caterer: ${escapeHtml(food.vendor)}</span>` : ""}
          ${food.servings ? `<span>Servings: ${escapeHtml(String(food.servings))}</span>` : ""}
        </div>
        ${cost > 0 ? `
        <div class="payment-details">
          <span class="payment-label">Total: ${formatCAD(cost)}</span>
          ${advance > 0 ? `<span class="payment-paid">Paid: ${formatCAD(advance)}</span>` : ""}
          ${pending > 0 ? `<span class="payment-pending">Pending: ${formatCAD(pending)}</span>` : ""}
        </div>
        ` : ""}
      </div>
    `;
      }
    )
    .join("");
}

function renderDecorList() {
  const selectedEvents = getSelectedEvents();

  if (selectedEvents.length === 0) {
    dom.decorList.innerHTML = `<div class="muted text-center">Please select at least one event to view/add decor items</div>`;
    return;
  }

  const allDecor = [];
  selectedEvents.forEach(event => {
    if (event.decor && event.decor.length > 0) {
      event.decor.forEach(decor => {
        allDecor.push({
          ...decor,
          eventName: event.name,
          eventId: event.id
        });
      });
    }
  });

  if (allDecor.length === 0) {
    dom.decorList.innerHTML = `<div class="muted text-center">No decor items yet for selected events</div>`;
    return;
  }

  dom.decorList.innerHTML = allDecor
    .map(
      (decor) => {
        const cost = sanitizeNumber(decor.cost);
        const advance = sanitizeNumber(decor.advance);
        const pending = cost - advance;
        return `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(decor.element)}</div>
          <button class="btn-icon" data-action="remove-decor" data-id="${decor.id}" data-event-id="${decor.eventId}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span class="event-tag">${escapeHtml(decor.eventName)}</span>
          ${decor.vendor ? `<span>Decorator: ${escapeHtml(decor.vendor)}</span>` : ""}
          ${decor.theme ? `<span>Theme: ${escapeHtml(decor.theme)}</span>` : ""}
          <span>${formatDecorStatus(decor.status)}</span>
        </div>
        ${cost > 0 ? `
        <div class="payment-details">
          <span class="payment-label">Total: ${formatCAD(cost)}</span>
          ${advance > 0 ? `<span class="payment-paid">Paid: ${formatCAD(advance)}</span>` : ""}
          ${pending > 0 ? `<span class="payment-pending">Pending: ${formatCAD(pending)}</span>` : ""}
        </div>
        ` : ""}
      </div>
    `;
      }
    )
    .join("");
}

function formatDecorStatus(status) {
  const statusMap = {
    pending: "Pending",
    approved: "Approved",
    ready: "Ready"
  };
  return statusMap[status] || status;
}

function renderDjList() {
  const selectedEvents = getSelectedEvents();

  if (selectedEvents.length === 0) {
    dom.djList.innerHTML = `<div class="muted text-center">Please select at least one event to view/add entertainment items</div>`;
    return;
  }

  const allDj = [];
  selectedEvents.forEach(event => {
    if (event.dj && event.dj.length > 0) {
      event.dj.forEach(dj => {
        allDj.push({
          ...dj,
          eventName: event.name,
          eventId: event.id
        });
      });
    }
  });

  if (allDj.length === 0) {
    dom.djList.innerHTML = `<div class="muted text-center">No entertainment items yet for selected events</div>`;
    return;
  }

  dom.djList.innerHTML = allDj
    .map(
      (dj) => {
        const cost = sanitizeNumber(dj.cost);
        const advance = sanitizeNumber(dj.advance);
        const pending = cost - advance;
        return `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">Time: ${escapeHtml(dj.slot)}</div>
          <button class="btn-icon" data-action="remove-dj" data-id="${dj.id}" data-event-id="${dj.eventId}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span class="event-tag">${escapeHtml(dj.eventName)}</span>
          ${dj.performer ? `<span>Vendor: ${escapeHtml(dj.performer)}</span>` : ""}
          ${dj.type ? `<span>Type: ${escapeHtml(dj.type)}</span>` : ""}
          ${dj.notes ? `<span>Notes: ${escapeHtml(dj.notes)}</span>` : ""}
        </div>
        ${cost > 0 ? `
        <div class="payment-details">
          <span class="payment-label">Total: ${formatCAD(cost)}</span>
          ${advance > 0 ? `<span class="payment-paid">Paid: ${formatCAD(advance)}</span>` : ""}
          ${pending > 0 ? `<span class="payment-pending">Pending: ${formatCAD(pending)}</span>` : ""}
        </div>
        ` : ""}
      </div>
    `;
      }
    )
    .join("");
}

function renderFavorList() {
  const selectedEvents = getSelectedEvents();

  if (selectedEvents.length === 0) {
    dom.favorList.innerHTML = `<div class="muted text-center">Please select at least one event to view/add favors</div>`;
    return;
  }

  const allFavors = [];
  selectedEvents.forEach(event => {
    if (event.favors && event.favors.length > 0) {
      event.favors.forEach(favor => {
        allFavors.push({
          ...favor,
          eventName: event.name,
          eventId: event.id
        });
      });
    }
  });

  if (allFavors.length === 0) {
    dom.favorList.innerHTML = `<div class="muted text-center">No favors yet for selected events</div>`;
    return;
  }

  dom.favorList.innerHTML = allFavors
    .map(
      (favor) => {
        const cost = sanitizeNumber(favor.cost);
        const advance = sanitizeNumber(favor.advance);
        const pending = cost - advance;
        return `
      <div class="tracker-item">
        <div class="tracker-item-header">
          <div class="tracker-item-title">${escapeHtml(favor.item)}</div>
          <button class="btn-icon" data-action="remove-favor" data-id="${favor.id}" data-event-id="${favor.eventId}">✕</button>
        </div>
        <div class="tracker-item-meta">
          <span class="event-tag">${escapeHtml(favor.eventName)}</span>
          <span>Qty: ${escapeHtml(String(favor.qty))}</span>
          ${favor.vendor ? `<span>Vendor: ${escapeHtml(favor.vendor)}</span>` : ""}
          ${favor.target ? `<span>For: ${escapeHtml(favor.target)}</span>` : ""}
          ${favor.notes ? `<span>Notes: ${escapeHtml(favor.notes)}</span>` : ""}
        </div>
        ${cost > 0 ? `
        <div class="payment-details">
          <span class="payment-label">Total: ${formatCAD(cost)}</span>
          ${advance > 0 ? `<span class="payment-paid">Paid: ${formatCAD(advance)}</span>` : ""}
          ${pending > 0 ? `<span class="payment-pending">Pending: ${formatCAD(pending)}</span>` : ""}
        </div>
        ` : ""}
      </div>
    `;
      }
    )
    .join("");
}

function renderStats() {
  const totalSpent = calculateTotalSpent();
  const totalTasks = state.events.reduce((sum, item) => sum + item.tasks.length, 0);
  const doneTasks = state.events.reduce(
    (sum, item) => sum + item.tasks.filter((task) => task.status === "done").length,
    0,
  );
  
  // Sum all guest counts
  const totalGuestCount = state.guests.reduce((sum, guest) => sum + (guest.count || 1), 0);

  dom.statGuestCount.textContent = totalGuestCount;
  dom.statEventCount.textContent = state.events.length;
  dom.statTasksDone.textContent = doneTasks;
  dom.statTasksTotal.textContent = totalTasks;
  dom.statBudget.textContent = formatCAD(totalSpent);
}

function renderBudget() {
  const totalBudget = sanitizeNumber(state.meta.totalBudget) || 20000;
  const totalSpent = calculateTotalSpent();
  const totalCost = calculateTotalCost();
  const remaining = totalBudget - totalSpent;
  const percentSpent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  
  // Budget overview
  if (dom.budgetTabTotal) {
    dom.budgetTabTotal.textContent = formatCAD(totalBudget);
  }
  if (dom.budgetTabSpent) {
    dom.budgetTabSpent.textContent = formatCAD(totalSpent);
  }
  if (dom.budgetTabRemaining) {
    dom.budgetTabRemaining.textContent = formatCAD(remaining);
    if (remaining < 0) {
      dom.budgetTabRemaining.style.color = '#ef4444';
    } else {
      dom.budgetTabRemaining.style.color = '';
    }
  }
  if (dom.budgetProgressBar) {
    dom.budgetProgressBar.style.width = percentSpent + '%';
  }
  if (dom.budgetPercentage) {
    dom.budgetPercentage.textContent = Math.round(percentSpent) + '%';
  }
  
  // Vendor payments list
  const vendors = getAllVendorPayments();
  if (dom.vendorPaymentsList) {
    if (vendors.length === 0) {
      dom.vendorPaymentsList.innerHTML = '<div class="muted text-center">No vendor payments yet</div>';
    } else {
      dom.vendorPaymentsList.innerHTML = vendors
        .map(v => {
          const pending = v.total - v.paid;
          return `
          <div class="vendor-payment-item">
            <div class="vendor-payment-info">
              <div class="vendor-name">${escapeHtml(v.vendor)}</div>
              <div class="vendor-category">${escapeHtml(v.category)} - ${escapeHtml(v.event)}</div>
            </div>
            <div class="vendor-payment-amounts">
              <div class="payment-row">
                <span class="payment-label-sm">Total:</span>
                <span class="payment-value">${formatCAD(v.total)}</span>
              </div>
              <div class="payment-row">
                <span class="payment-label-sm">Paid:</span>
                <span class="payment-value paid">${formatCAD(v.paid)}</span>
              </div>
              ${pending > 0 ? `
              <div class="payment-row">
                <span class="payment-label-sm">Pending:</span>
                <span class="payment-value pending">${formatCAD(pending)}</span>
              </div>
              ` : ''}
            </div>
          </div>
        `;
        })
        .join('');
    }
  }
  
  // Event budget breakdown
  dom.eventBudgetList.innerHTML = state.events
    .map(
      (event) => {
        const eventTotal = eventCost(event);
        const eventPaid = eventSpent(event);
        return `
      <div class="event-budget-item">
        <div class="event-budget-name">${escapeHtml(event.name)}</div>
        <div class="event-budget-amounts">
          <div class="event-budget-amount">${formatCAD(eventTotal)}</div>
          <div class="event-budget-spent">Paid: ${formatCAD(eventPaid)}</div>
        </div>
      </div>
    `;
      }
    )
    .join("");
  
  // Category budget breakdown
  const vendorsCost = state.events.reduce(
    (sum, event) => sum + (event.vendors ? event.vendors.reduce((s, item) => s + sanitizeNumber(item.cost), 0) : 0),
    0
  );
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
  
  if (dom.budgetVendors) {
    dom.budgetVendors.textContent = formatCAD(vendorsCost);
  }
  dom.budgetMaterials.textContent = formatCAD(materialsCost);
  dom.budgetFood.textContent = formatCAD(foodCost);
  dom.budgetDecor.textContent = formatCAD(decorCost);
  dom.budgetEntertainment.textContent = formatCAD(djCost);
  dom.budgetFavors.textContent = formatCAD(favorCost);
}

function calculateTotalCost() {
  let total = 0;
  state.events.forEach(event => {
    if (event.vendors) {
      event.vendors.forEach(item => total += sanitizeNumber(item.cost));
    }
    event.materials.forEach(item => total += sanitizeNumber(item.cost));
    event.food.forEach(item => total += sanitizeNumber(item.cost));
    event.decor.forEach(item => total += sanitizeNumber(item.cost));
    event.dj.forEach(item => total += sanitizeNumber(item.cost));
    event.favors.forEach(item => total += sanitizeNumber(item.cost));
  });
  return total;
}

function eventSpent(event) {
  let spent = 0;
  if (event.vendors) {
    event.vendors.forEach(item => spent += sanitizeNumber(item.advance));
  }
  event.materials.forEach(item => spent += sanitizeNumber(item.advance));
  event.food.forEach(item => spent += sanitizeNumber(item.advance));
  event.decor.forEach(item => spent += sanitizeNumber(item.advance));
  event.dj.forEach(item => spent += sanitizeNumber(item.advance));
  event.favors.forEach(item => spent += sanitizeNumber(item.advance));
  return spent;
}

function getAllVendorPayments() {
  const vendors = [];
  
  state.events.forEach(event => {
    // Vendor bookings
    if (event.vendors) {
      event.vendors.forEach(item => {
        if (item.vendor && item.cost > 0) {
          vendors.push({
            vendor: item.vendor,
            category: item.service || 'Vendor',
            event: event.name,
            item: item.service,
            total: sanitizeNumber(item.cost),
            paid: sanitizeNumber(item.advance)
          });
        }
      });
    }
    
    event.materials.forEach(item => {
      if (item.vendor && item.cost > 0) {
        vendors.push({
          vendor: item.vendor,
          category: 'Materials',
          event: event.name,
          item: item.item,
          total: sanitizeNumber(item.cost),
          paid: sanitizeNumber(item.advance)
        });
      }
    });
    
    event.food.forEach(item => {
      if (item.vendor && item.cost > 0) {
        vendors.push({
          vendor: item.vendor,
          category: 'Food',
          event: event.name,
          item: item.dish,
          total: sanitizeNumber(item.cost),
          paid: sanitizeNumber(item.advance)
        });
      }
    });
    
    event.decor.forEach(item => {
      if (item.vendor && item.cost > 0) {
        vendors.push({
          vendor: item.vendor,
          category: 'Decor',
          event: event.name,
          item: item.element,
          total: sanitizeNumber(item.cost),
          paid: sanitizeNumber(item.advance)
        });
      }
    });
    
    event.dj.forEach(item => {
      if (item.performer && item.cost > 0) {
        vendors.push({
          vendor: item.performer,
          category: 'Entertainment',
          event: event.name,
          item: item.type || item.slot,
          total: sanitizeNumber(item.cost),
          paid: sanitizeNumber(item.advance)
        });
      }
    });
    
    event.favors.forEach(item => {
      if (item.vendor && item.cost > 0) {
        vendors.push({
          vendor: item.vendor,
          category: 'Favors',
          event: event.name,
          item: item.item,
          total: sanitizeNumber(item.cost),
          paid: sanitizeNumber(item.advance)
        });
      }
    });
  });
  
  return vendors;
}

function renderShareLinkOutput() {
  dom.shareLinkOutput.value = buildShareUrl();
}

function eventCost(event) {
  let total = 0;
  if (event.vendors) {
    total += event.vendors.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0);
  }
  return (
    total +
    event.materials.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.food.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.decor.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.dj.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0) +
    event.favors.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0)
  );
}

function onWeddingMetaChanged() {
  state.meta.coupleName = dom.coupleNameInput.value;
  state.meta.primaryVenue = dom.primaryVenueInput.value;
  state.meta.weddingDate = dom.weddingDateInput.value;
  state.meta.totalBudget = sanitizeNumber(dom.totalBudgetInput.value) || 20000;
  saveAndRender();
  updateCountdown(); // Force countdown update when date changes
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

  const count = sanitizeInteger(formData.get("count"), 1);

  state.guests.push({
    id: createId("guest"),
    name,
    count: count,
    group: sanitizeGroup(String(formData.get("group") || "")),
    phone: sanitizeText(formData.get("phone")),
    notes: sanitizeText(formData.get("notes")),
    names: [], // Array to store individual guest names
    invitationSent: false, // Track if invitation was sent
  });

  dom.guestForm.reset();
  // Reset count to 1
  const countInput = dom.guestForm.querySelector('input[name="count"]');
  if (countInput) countInput.value = "1";
  
  saveAndRender(`Guest group added (${count} ${count === 1 ? 'person' : 'people'})`);
}

function onGuestAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const guestId = target.dataset.id;
  
  if (!action || !guestId) {
    return;
  }

  if (action === "manage-names") {
    openGuestNamesModal(guestId);
    return;
  }

  if (action === "remove-guest") {
    state.guests = state.guests.filter((guest) => guest.id !== guestId);
    state.events.forEach((item) => {
      item.invitedGuestIds = item.invitedGuestIds.filter((id) => id !== guestId);
    });
    saveAndRender("Guest removed");
  }
}

function openGuestNamesModal(guestId) {
  const guest = state.guests.find(g => g.id === guestId);
  if (!guest) return;
  
  currentEditingGuestId = guestId;
  
  dom.guestNamesModalTitle.textContent = `Manage Names - ${guest.name}`;
  dom.guestNamesModalDesc.textContent = `Edit group count and add individual names`;
  
  // Set current count
  if (dom.editGroupCount) {
    dom.editGroupCount.value = guest.count || 1;
  }
  
  updateCountHint();
  renderGuestNamesList();
  
  if (dom.guestNamesModal) {
    dom.guestNamesModal.classList.add("show");
  }
}

function updateCountHint() {
  if (!currentEditingGuestId || !dom.countHint) return;
  
  const guest = state.guests.find(g => g.id === currentEditingGuestId);
  if (!guest) return;
  
  const namesCount = guest.names ? guest.names.length : 0;
  const capacity = guest.count || 1;
  const remaining = capacity - namesCount;
  
  if (remaining > 0) {
    dom.countHint.textContent = `${namesCount} names added • ${remaining} slots available`;
    dom.countHint.style.color = 'var(--text-secondary)';
  } else if (remaining === 0) {
    dom.countHint.textContent = `${namesCount} names added • All slots filled`;
    dom.countHint.style.color = 'var(--success)';
  } else {
    dom.countHint.textContent = `⚠️ ${namesCount} names but only ${capacity} slots! Remove ${-remaining} name${-remaining > 1 ? 's' : ''}`;
    dom.countHint.style.color = 'var(--danger)';
  }
}

function onUpdateGroupCount() {
  if (!currentEditingGuestId) return;
  
  const guest = state.guests.find(g => g.id === currentEditingGuestId);
  if (!guest) return;
  
  const newCount = sanitizeInteger(dom.editGroupCount.value, 1);
  const oldCount = guest.count || 1;
  const namesCount = guest.names ? guest.names.length : 0;
  
  if (newCount < 1) {
    showToast("Count must be at least 1");
    dom.editGroupCount.value = oldCount;
    return;
  }
  
  // Check if decreasing and there are too many names
  if (newCount < namesCount) {
    showToast(`Cannot decrease to ${newCount}. Please remove ${namesCount - newCount} name${namesCount - newCount > 1 ? 's' : ''} first.`);
    dom.editGroupCount.value = oldCount;
    return;
  }
  
  guest.count = newCount;
  persistState();
  updateCountHint();
  renderGuestNamesList();
  
  if (newCount > oldCount) {
    showToast(`Count increased to ${newCount}. You can now add ${newCount - namesCount} more name${newCount - namesCount > 1 ? 's' : ''}.`);
  } else if (newCount < oldCount) {
    showToast(`Count decreased to ${newCount}`);
  } else {
    showToast("Count updated");
  }
}

function closeGuestNamesModal() {
  currentEditingGuestId = null;
  if (dom.guestNamesModal) {
    dom.guestNamesModal.classList.remove("show");
  }
  // Refresh the guest list to show updated names
  renderGuestList();
}

function renderGuestNamesList() {
  if (!currentEditingGuestId) return;
  
  const guest = state.guests.find(g => g.id === currentEditingGuestId);
  if (!guest) return;
  
  if (!guest.names) {
    guest.names = [];
  }
  
  updateCountHint();
  
  if (guest.names.length === 0) {
    dom.guestNamesList.innerHTML = `<div class="muted text-center">No names added yet. Add names above.</div>`;
    return;
  }
  
  dom.guestNamesList.innerHTML = guest.names
    .map((name, index) => `
      <div class="guest-name-item">
        <span class="guest-name-text">${escapeHtml(name)}</span>
        <button class="btn-icon" data-action="remove-name" data-index="${index}">✕</button>
      </div>
    `)
    .join("");
}

function onAddGuestName(event) {
  event.preventDefault();
  
  if (!currentEditingGuestId) return;
  
  const guest = state.guests.find(g => g.id === currentEditingGuestId);
  if (!guest) return;
  
  const formData = new FormData(dom.addGuestNameForm);
  const name = sanitizeText(formData.get("guestName"));
  
  if (!name) return;
  
  if (!guest.names) {
    guest.names = [];
  }
  
  if (guest.names.length >= guest.count) {
    showToast(`Maximum ${guest.count} names allowed. Increase group count to add more.`);
    return;
  }
  
  guest.names.push(name);
  persistState();
  
  dom.addGuestNameForm.reset();
  renderGuestNamesList();
  showToast("Name added");
}

function onGuestNameAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  
  if (target.dataset.action !== "remove-name") {
    return;
  }
  
  const index = parseInt(target.dataset.index, 10);
  if (!Number.isFinite(index) || !currentEditingGuestId) {
    return;
  }
  
  const guest = state.guests.find(g => g.id === currentEditingGuestId);
  if (!guest || !guest.names) return;
  
  guest.names.splice(index, 1);
  persistState();
  renderGuestNamesList();
  showToast("Name removed");
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

  const oldName = event.name;
  event.name = dom.eventNameInput.value || "Untitled Function";
  event.date = dom.eventDateInput.value;
  event.venue = dom.eventVenueInput.value;
  event.notes = dom.eventNotesInput.value;
  
  persistState();
  
  // If name changed, update the select dropdown
  if (oldName !== event.name) {
    renderEventSelect();
  }
  
  // Update countdown if Wedding event date changed
  if (event.name.toLowerCase().includes("wedding")) {
    updateCountdown();
  }
  
  renderStats();
  renderBudget();
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

function onSelectAllGuests() {
  const event = currentEvent();
  if (!event) {
    return;
  }

  const allGuestIds = state.guests.map((guest) => guest.id);
  event.invitedGuestIds = Array.from(new Set(allGuestIds));
  saveAndRender("All guests invited");
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

function onInviteGuestToggle(e) {
  const target = e.target;
  
  // Only handle checkbox inputs
  if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") {
    return;
  }

  const guestId = target.dataset.id;
  const eventItem = currentEvent();
  
  if (!guestId || !eventItem) {
    console.error("Missing guestId or eventItem", { guestId, eventItem });
    return;
  }

  console.log("Toggle guest invitation", { guestId, checked: target.checked });

  if (target.checked) {
    // Add guest to invited list
    if (!eventItem.invitedGuestIds.includes(guestId)) {
      eventItem.invitedGuestIds.push(guestId);
    }
  } else {
    // Remove guest from invited list
    eventItem.invitedGuestIds = eventItem.invitedGuestIds.filter((id) => id !== guestId);
  }
  
  persistState();
  // Don't re-render everything, just update stats and keep checkboxes as-is
  renderStats();
  renderBudget();
  showToast(target.checked ? "Guest invited" : "Guest removed");
}

function onTaskAdd(event) {
  event.preventDefault();
  
  const selectedEvents = getSelectedEvents();
  if (selectedEvents.length === 0) {
    showToast("Please select at least one event");
    return;
  }

  const formData = new FormData(dom.taskForm);
  const title = sanitizeText(formData.get("title"));
  if (!title) {
    return;
  }

  const taskData = {
    title,
    owner: sanitizeText(formData.get("owner")),
    status: sanitizeTaskStatus(formData.get("status")),
    deadline: sanitizeText(formData.get("deadline")),
  };

  selectedEvents.forEach(eventItem => {
    eventItem.tasks.push({
      id: createId("task"),
      ...taskData
    });
  });

  dom.taskForm.reset();
  const eventNames = selectedEvents.map(e => e.name).join(', ');
  saveAndRender(`Task added to: ${eventNames}`);
}

function onTaskAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  const eventId = target.dataset.eventId;
  
  if (!action || !id) {
    return;
  }

  if (action === "remove-task") {
    const eventItem = state.events.find(e => e.id === eventId);
    if (eventItem) {
      eventItem.tasks = eventItem.tasks.filter((task) => task.id !== id);
      saveAndRender("Task removed");
    }
  }
}

function onVendorAdd(event) {
  event.preventDefault();
  
  const selectedEvents = getSelectedEvents();
  if (selectedEvents.length === 0) {
    showToast("Please select at least one event");
    return;
  }

  const formData = new FormData(dom.vendorForm);
  const vendor = sanitizeText(formData.get("vendor"));
  const service = sanitizeText(formData.get("service"));
  if (!vendor || !service) {
    return;
  }

  const vendorData = {
    vendor,
    service,
    contact: sanitizeText(formData.get("contact")),
    cost: sanitizeNumber(formData.get("cost")),
    advance: sanitizeNumber(formData.get("advance")),
    status: sanitizeVendorStatus(formData.get("status")),
    notes: sanitizeText(formData.get("notes")),
  };

  selectedEvents.forEach(eventItem => {
    if (!eventItem.vendors) {
      eventItem.vendors = [];
    }
    eventItem.vendors.push({
      id: createId("vendor"),
      ...vendorData
    });
  });

  dom.vendorForm.reset();
  const eventNames = selectedEvents.map(e => e.name).join(', ');
  saveAndRender(`Vendor booking added to: ${eventNames}`);
}

function onVendorAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  const eventId = target.dataset.eventId;
  
  if (!action || !id) {
    return;
  }

  if (action === "remove-vendor") {
    const eventItem = state.events.find(e => e.id === eventId);
    if (eventItem && eventItem.vendors) {
      eventItem.vendors = eventItem.vendors.filter((vendor) => vendor.id !== id);
      saveAndRender("Vendor booking removed");
    }
  }
}


function onMaterialAdd(event) {
  event.preventDefault();
  
  const selectedEvents = getSelectedEvents();
  if (selectedEvents.length === 0) {
    showToast("Please select at least one event");
    return;
  }

  const formData = new FormData(dom.materialForm);
  const item = sanitizeText(formData.get("item"));
  if (!item) {
    return;
  }

  const materialData = {
    item,
    qty: sanitizeInteger(formData.get("qty"), 1),
    vendor: sanitizeText(formData.get("vendor")),
    status: sanitizeMaterialStatus(formData.get("status")),
    cost: sanitizeNumber(formData.get("cost")),
    advance: sanitizeNumber(formData.get("advance")),
  };

  selectedEvents.forEach(eventItem => {
    eventItem.materials.push({
      id: createId("material"),
      ...materialData
    });
  });

  dom.materialForm.reset();
  const eventNames = selectedEvents.map(e => e.name).join(', ');
  saveAndRender(`Material added to: ${eventNames}`);
}

function onMaterialAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  const eventId = target.dataset.eventId;
  if (!action || !id) {
    return;
  }

  if (action === "remove-material") {
    const eventItem = state.events.find(e => e.id === eventId);
    if (eventItem) {
      eventItem.materials = eventItem.materials.filter((material) => material.id !== id);
      saveAndRender("Material removed");
    }
  }
}

function onFoodAdd(event) {
  event.preventDefault();
  
  const selectedEvents = getSelectedEvents();
  if (selectedEvents.length === 0) {
    showToast("Please select at least one event");
    return;
  }

  const formData = new FormData(dom.foodForm);
  const dish = sanitizeText(formData.get("dish"));
  if (!dish) {
    return;
  }

  const foodData = {
    dish,
    course: sanitizeText(formData.get("course")),
    vendor: sanitizeText(formData.get("vendor")),
    servings: sanitizeInteger(formData.get("servings"), 0),
    cost: sanitizeNumber(formData.get("cost")),
    advance: sanitizeNumber(formData.get("advance")),
  };

  selectedEvents.forEach(eventItem => {
    eventItem.food.push({
      id: createId("food"),
      ...foodData
    });
  });

  dom.foodForm.reset();
  const eventNames = selectedEvents.map(e => e.name).join(', ');
  saveAndRender(`Food item added to: ${eventNames}`);
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
  const eventId = target.dataset.eventId;
  if (!id) {
    return;
  }

  const eventItem = state.events.find(e => e.id === eventId);
  if (eventItem) {
    eventItem.food = eventItem.food.filter((food) => food.id !== id);
    saveAndRender("Food item removed");
  }
}

function onDecorAdd(event) {
  event.preventDefault();
  
  const selectedEvents = getSelectedEvents();
  if (selectedEvents.length === 0) {
    showToast("Please select at least one event");
    return;
  }

  const formData = new FormData(dom.decorForm);
  const element = sanitizeText(formData.get("element"));
  if (!element) {
    return;
  }

  const decorData = {
    element,
    vendor: sanitizeText(formData.get("vendor")),
    theme: sanitizeText(formData.get("theme")),
    status: sanitizeDecorStatus(formData.get("status")),
    cost: sanitizeNumber(formData.get("cost")),
    advance: sanitizeNumber(formData.get("advance")),
  };

  selectedEvents.forEach(eventItem => {
    eventItem.decor.push({
      id: createId("decor"),
      ...decorData
    });
  });

  dom.decorForm.reset();
  const eventNames = selectedEvents.map(e => e.name).join(', ');
  saveAndRender(`Decor added to: ${eventNames}`);
}

function onDecorAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;
  const eventId = target.dataset.eventId;
  if (!action || !id) {
    return;
  }

  if (action === "remove-decor") {
    const eventItem = state.events.find(e => e.id === eventId);
    if (eventItem) {
      eventItem.decor = eventItem.decor.filter((decor) => decor.id !== id);
      saveAndRender("Decor item removed");
    }
  }
}

function onDjAdd(event) {
  event.preventDefault();
  
  const selectedEvents = getSelectedEvents();
  if (selectedEvents.length === 0) {
    showToast("Please select at least one event");
    return;
  }

  const formData = new FormData(dom.djForm);
  const slot = sanitizeText(formData.get("slot"));
  if (!slot) {
    return;
  }

  const djData = {
    slot,
    performer: sanitizeText(formData.get("performer")),
    type: sanitizeText(formData.get("type")),
    notes: sanitizeText(formData.get("notes")),
    cost: sanitizeNumber(formData.get("cost")),
    advance: sanitizeNumber(formData.get("advance")),
  };

  selectedEvents.forEach(eventItem => {
    eventItem.dj.push({
      id: createId("dj"),
      ...djData
    });
  });

  dom.djForm.reset();
  const eventNames = selectedEvents.map(e => e.name).join(', ');
  saveAndRender(`Entertainment added to: ${eventNames}`);
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
  const eventId = target.dataset.eventId;
  if (!id) {
    return;
  }

  const eventItem = state.events.find(e => e.id === eventId);
  if (eventItem) {
    eventItem.dj = eventItem.dj.filter((dj) => dj.id !== id);
    saveAndRender("Entertainment item removed");
  }
}

function onFavorAdd(event) {
  event.preventDefault();
  
  const selectedEvents = getSelectedEvents();
  if (selectedEvents.length === 0) {
    showToast("Please select at least one event");
    return;
  }

  const formData = new FormData(dom.favorForm);
  const item = sanitizeText(formData.get("item"));
  if (!item) {
    return;
  }

  const favorData = {
    item,
    qty: sanitizeInteger(formData.get("qty"), 1),
    vendor: sanitizeText(formData.get("vendor")),
    target: sanitizeText(formData.get("target")),
    notes: sanitizeText(formData.get("notes")),
    cost: sanitizeNumber(formData.get("cost")),
    advance: sanitizeNumber(formData.get("advance")),
  };

  selectedEvents.forEach(eventItem => {
    eventItem.favors.push({
      id: createId("favor"),
      ...favorData
    });
  });

  dom.favorForm.reset();
  const eventNames = selectedEvents.map(e => e.name).join(', ');
  saveAndRender(`Favor added to: ${eventNames}`);
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
  const eventId = target.dataset.eventId;
  if (!id) {
    return;
  }

  const eventItem = state.events.find(e => e.id === eventId);
  if (eventItem) {
    eventItem.favors = eventItem.favors.filter((favor) => favor.id !== id);
    saveAndRender("Favor removed");
  }
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

// Print helper: open window with content and trigger print
function openPrintWindow(title, bodyHtml) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("Please allow pop-ups to print");
    return;
  }
  printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 20px; color: #1a1a1a; max-width: 1200px; margin: 0 auto; }
    h1 { font-size: 1.5rem; margin-bottom: 8px; }
    h2 { font-size: 1.2rem; margin: 16px 0 8px; }
    h3 { font-size: 1.1rem; margin: 12px 0 6px; }
    h4 { font-size: 1rem; margin: 10px 0 5px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background: #f5f5f5; font-weight: 600; }
    .muted { color: #666; }
    .text-right { text-align: right; }
    ul { margin: 5px 0; padding-left: 20px; }
    .print-controls { 
      position: fixed; 
      top: 10px; 
      right: 10px; 
      background: white; 
      padding: 10px; 
      border: 2px solid #00d4ff; 
      border-radius: 8px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
    }
    .print-btn {
      background: #00d4ff;
      color: #1a1a1a;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
      margin-right: 5px;
    }
    .print-btn:hover {
      background: #00b8e6;
    }
    .close-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
    }
    .close-btn:hover {
      background: #dc2626;
    }
    @media print { 
      body { padding: 0; max-width: 100%; }
      .print-controls { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-controls">
    <button class="print-btn" onclick="window.print()">🖨️ Print</button>
    <button class="close-btn" onclick="window.close()">✕ Close</button>
  </div>
  ${bodyHtml}
</body>
</html>`);
  printWindow.document.close();
  printWindow.focus();
}

// ========== INVITATIONS MANAGEMENT ==========

function renderInvitationsList() {
  if (!dom.invitationsList) return;
  
  const filter = dom.invitationFilterSelect ? dom.invitationFilterSelect.value : "all";
  let guests = state.guests;
  
  // Apply filters
  if (filter === "sent") {
    guests = guests.filter(g => g.invitationSent === true);
  } else if (filter === "pending") {
    guests = guests.filter(g => g.invitationSent !== true);
  } else if (filter !== "all") {
    guests = guests.filter(g => g.group === filter);
  }
  
  // Update stats
  const totalGuests = state.guests.length;
  const sentCount = state.guests.filter(g => g.invitationSent === true).length;
  const pendingCount = totalGuests - sentCount;
  
  if (dom.invitationsSent) dom.invitationsSent.textContent = sentCount;
  if (dom.invitationsPending) dom.invitationsPending.textContent = pendingCount;
  if (dom.invitationsTotal) dom.invitationsTotal.textContent = totalGuests;
  
  if (!guests.length) {
    dom.invitationsList.innerHTML = `<div class="empty-state">
      <p>No guests match the current filter.</p>
    </div>`;
    return;
  }
  
  let html = "";
  guests.forEach(g => {
    const statusClass = g.invitationSent ? "sent" : "pending";
    const statusText = g.invitationSent ? "Sent" : "Pending";
    const toggleText = g.invitationSent ? "Mark Pending" : "Mark Sent";
    const groupLabel = getGroupLabel(g.group);
    
    html += `
    <div class="invitation-item ${statusClass}" data-guest-id="${g.id}">
      <div class="invitation-info">
        <div class="invitation-name">${escapeHtml(g.name)}</div>
        <div class="invitation-details">
          <span>👥 ${g.count} ${g.count === 1 ? 'guest' : 'guests'}</span>
          <span>•</span>
          <span>${groupLabel}</span>
          ${g.phone ? `<span>•</span><span>📞 ${escapeHtml(g.phone)}</span>` : ''}
        </div>
      </div>
      <div class="invitation-actions">
        <span class="invitation-status ${statusClass}">${statusText}</span>
        <button 
          class="btn-toggle-sent" 
          data-action="toggle-sent" 
          data-guest-id="${g.id}">
          ${toggleText}
        </button>
      </div>
    </div>`;
  });
  
  dom.invitationsList.innerHTML = html;
}

function onInvitationAction(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  
  const action = btn.dataset.action;
  const guestId = btn.dataset.guestId;
  
  if (action === "toggle-sent") {
    const guest = state.guests.find(g => g.id === guestId);
    if (!guest) return;
    
    guest.invitationSent = !guest.invitationSent;
    persistState();
    renderInvitationsList();
    
    const status = guest.invitationSent ? "sent" : "pending";
    showToast(`Invitation marked as ${status} for ${guest.name}`);
  }
}

function onMarkAllSent() {
  state.guests.forEach(g => {
    g.invitationSent = true;
  });
  persistState();
  renderInvitationsList();
  showToast("All invitations marked as sent!");
}

function onMarkAllPending() {
  state.guests.forEach(g => {
    g.invitationSent = false;
  });
  persistState();
  renderInvitationsList();
  showToast("All invitations marked as pending!");
}

function getGroupLabel(group) {
  const labels = {
    family: "Family",
    girlfriend: "Friends (Bride)",
    friends: "Friends (Groom)",
    cousins: "Extended Family",
    colleagues: "Colleagues",
    vip: "Special Guests"
  };
  return labels[group] || "Other";
}

function printInvitations() {
  const title = (state.meta.coupleName || "Wedding") + " – Invitation Tracking";
  
  const totalGuests = state.guests.length;
  const sentCount = state.guests.filter(g => g.invitationSent === true).length;
  const pendingCount = totalGuests - sentCount;
  
  let rows = "";
  if (!state.guests.length) {
    rows = "<tr><td colspan='5' class='muted'>No guests added yet.</td></tr>";
  } else {
    state.guests.forEach((g) => {
      const statusText = g.invitationSent ? "✅ Sent" : "⏳ Pending";
      const groupLabel = getGroupLabel(g.group);
      
      rows += `<tr>
        <td>${escapeHtml(g.name)}</td>
        <td>${g.count}</td>
        <td>${groupLabel}</td>
        <td>${g.phone ? escapeHtml(g.phone) : '—'}</td>
        <td><strong>${statusText}</strong></td>
      </tr>`;
    });
  }
  
  const bodyHtml = `
  <div class="print-section">
    <h1>${escapeHtml(title)}</h1>
    <div class="summary-box">
      <p><strong>Total Groups:</strong> ${totalGuests}</p>
      <p><strong>Invitations Sent:</strong> ${sentCount}</p>
      <p><strong>Pending:</strong> ${pendingCount}</p>
      <p><strong>Completion:</strong> ${totalGuests > 0 ? Math.round((sentCount / totalGuests) * 100) : 0}%</p>
    </div>
    <table>
      <thead>
        <tr>
          <th>Guest Group</th>
          <th>Count</th>
          <th>Group</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>`;
  
  openPrintWindow(title, bodyHtml);
}

function printGuestList() {
  const title = (state.meta.coupleName || "Wedding") + " – Guest List";
  let rows = "";
  if (!state.guests.length) {
    rows = "<tr><td colspan='5' class='muted'>No guests added yet.</td></tr>";
  } else {
    state.guests.forEach((g) => {
      const count = g.count || 1;
      const names = g.names && g.names.length > 0 ? g.names.join(', ') : '—';
      rows += `<tr>
        <td>${escapeHtml(g.name)}</td>
        <td>${count}</td>
        <td>${escapeHtml(formatGroupLabel(g.group))}</td>
        <td style="max-width: 300px; word-wrap: break-word;">${escapeHtml(names)}</td>
        <td>${escapeHtml(g.phone || "—")}</td>
      </tr>`;
    });
  }
  const bodyHtml = `
    <h1>${escapeHtml(title)}</h1>
    <p class="muted">Printed ${new Date().toLocaleDateString()}</p>
    <table>
      <thead><tr><th>Group Name</th><th>Count</th><th>Group</th><th>Individual Names</th><th>Phone</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p><strong>Total: ${state.guests.reduce((s, g) => s + (g.count || 1), 0)} guests</strong></p>`;
  openPrintWindow(title, bodyHtml);
}

function printEvents() {
  const title = (state.meta.coupleName || "Wedding") + " – Events & Invitees";
  let sections = "";
  state.events.forEach((event) => {
    const invitedGuests = event.invitedGuestIds
      .map((id) => state.guests.find((g) => g.id === id))
      .filter(Boolean);
    
    const totalHeadCount = invitedGuests.reduce((sum, guest) => sum + (guest.count || 1), 0);
    const invitedGroupsCount = invitedGuests.length;
    
    let inviteesTable = "";
    if (invitedGuests.length > 0) {
      let rows = invitedGuests
        .map((guest) => {
          const count = guest.count || 1;
          return `<tr>
            <td>${escapeHtml(guest.name)}</td>
            <td>${escapeHtml(formatGroupLabel(guest.group))}</td>
            <td class="text-right">${count}</td>
            <td>${escapeHtml(guest.phone || "—")}</td>
          </tr>`;
        })
        .join("");
      
      inviteesTable = `
        <table>
          <thead>
            <tr>
              <th>Guest Group</th>
              <th>Group</th>
              <th class="text-right">Head Count</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="font-weight: bold; background: #f0f0f0;">
              <td colspan="2">Total</td>
              <td class="text-right">${totalHeadCount}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>`;
    } else {
      inviteesTable = `<p class="muted">No guests invited yet</p>`;
    }
    
    sections += `
    <div style="page-break-inside: avoid; margin-bottom: 30px;">
      <h2>${escapeHtml(event.name)}</h2>
      <p><strong>Date:</strong> ${escapeHtml(event.date || "—")} &nbsp;&nbsp; <strong>Venue:</strong> ${escapeHtml(event.venue || "—")}</p>
      ${event.notes ? `<p><strong>Notes:</strong> ${escapeHtml(event.notes)}</p>` : ""}
      <p><strong>Invited:</strong> ${invitedGroupsCount} ${invitedGroupsCount === 1 ? 'group' : 'groups'} • ${totalHeadCount} ${totalHeadCount === 1 ? 'person' : 'people'}</p>
      ${inviteesTable}
    </div>`;
  });
  const bodyHtml = `<h1>${escapeHtml(title)}</h1><p class="muted">Printed ${new Date().toLocaleDateString()}</p>${sections}`;
  openPrintWindow(title, bodyHtml);
}

function printBudget() {
  const title = (state.meta.coupleName || "Wedding") + " – Budget Summary";
  const totalBudget = sanitizeNumber(state.meta.totalBudget) || 20000;
  const totalSpent = calculateTotalSpent();
  const remaining = totalBudget - totalSpent;
  const percent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  let eventRows = "";
  state.events.forEach((event) => {
    const total = eventCost(event);
    const spent = eventSpent(event);
    eventRows += `<tr><td>${escapeHtml(event.name)}</td><td class="text-right">${formatCAD(total)}</td><td class="text-right">${formatCAD(spent)}</td></tr>`;
  });
  const bodyHtml = `
    <h1>${escapeHtml(title)}</h1>
    <p class="muted">Printed ${new Date().toLocaleDateString()}</p>
    <table>
      <tr><th>Total Budget</th><td class="text-right">${formatCAD(totalBudget)}</td></tr>
      <tr><th>Total Spent</th><td class="text-right">${formatCAD(totalSpent)}</td></tr>
      <tr><th>Remaining</th><td class="text-right">${formatCAD(remaining)}</td></tr>
      <tr><th>% Used</th><td class="text-right">${percent}%</td></tr>
    </table>
    <h2>By Event</h2>
    <table>
      <thead><tr><th>Event</th><th class="text-right">Total</th><th class="text-right">Paid</th></tr></thead>
      <tbody>${eventRows}</tbody>
    </table>
    <h2>By Category</h2>
    <table>
      <tr><td>Vendors</td><td class="text-right">${formatCAD(state.events.reduce((s, e) => s + (e.vendors ? e.vendors.reduce((sum, i) => sum + sanitizeNumber(i.cost), 0) : 0), 0))}</td></tr>
      <tr><td>Materials</td><td class="text-right">${formatCAD(state.events.reduce((s, e) => s + e.materials.reduce((sum, i) => sum + sanitizeNumber(i.cost), 0), 0))}</td></tr>
      <tr><td>Food</td><td class="text-right">${formatCAD(state.events.reduce((s, e) => s + e.food.reduce((sum, i) => sum + sanitizeNumber(i.cost), 0), 0))}</td></tr>
      <tr><td>Decor</td><td class="text-right">${formatCAD(state.events.reduce((s, e) => s + e.decor.reduce((sum, i) => sum + sanitizeNumber(i.cost), 0), 0))}</td></tr>
      <tr><td>Entertainment</td><td class="text-right">${formatCAD(state.events.reduce((s, e) => s + e.dj.reduce((sum, i) => sum + sanitizeNumber(i.cost), 0), 0))}</td></tr>
      <tr><td>Favors</td><td class="text-right">${formatCAD(state.events.reduce((s, e) => s + e.favors.reduce((sum, i) => sum + sanitizeNumber(i.cost), 0), 0))}</td></tr>
    </table>`;
  openPrintWindow(title, bodyHtml);
}

function printExpenses() {
  const title = (state.meta.coupleName || "Wedding") + " – Expenses / Vendor Payments";
  const vendors = getAllVendorPayments();
  let rows = "";
  if (!vendors.length) {
    rows = "<tr><td colspan='5' class='muted'>No vendor payments recorded.</td></tr>";
  } else {
    vendors.forEach((v) => {
      const pending = v.total - v.paid;
      rows += `<tr>
        <td>${escapeHtml(v.vendor)}</td>
        <td>${escapeHtml(v.category)}</td>
        <td>${escapeHtml(v.event)}</td>
        <td class="text-right">${formatCAD(v.total)}</td>
        <td class="text-right">${formatCAD(v.paid)}</td>
        <td class="text-right">${formatCAD(pending)}</td>
      </tr>`;
    });
  }
  const bodyHtml = `
    <h1>${escapeHtml(title)}</h1>
    <p class="muted">Printed ${new Date().toLocaleDateString()}</p>
    <table>
      <thead><tr><th>Vendor</th><th>Category</th><th>Event</th><th class="text-right">Total</th><th class="text-right">Paid</th><th class="text-right">Pending</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  openPrintWindow(title, bodyHtml);
}

function printMasterPlan() {
  const title = (state.meta.coupleName || "Wedding") + " – Master Wedding Plan";
  const weddingDate = state.meta.weddingDate || "Not set";
  const venue = state.meta.primaryVenue || "Not set";
  const totalBudget = sanitizeNumber(state.meta.totalBudget) || 20000;
  const totalSpent = calculateTotalSpent();
  const totalCost = calculateTotalCost();
  const remaining = totalBudget - totalSpent;
  const totalGuests = state.guests.reduce((s, g) => s + (g.count || 1), 0);
  
  // Keep events in the order they were added (not sorted by date)
  const sortedEvents = state.events;
  
  // Budget Overview
  const budgetOverview = `
    <div style="page-break-inside: avoid; margin-bottom: 30px;">
      <h2 style="color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 8px;">Budget Overview</h2>
      <table>
        <tr><th>Total Budget</th><td class="text-right"><strong>${formatCAD(totalBudget)}</strong></td></tr>
        <tr><th>Total Cost (Estimated)</th><td class="text-right">${formatCAD(totalCost)}</td></tr>
        <tr><th>Total Spent (Paid)</th><td class="text-right">${formatCAD(totalSpent)}</td></tr>
        <tr><th>Remaining Budget</th><td class="text-right" style="color: ${remaining < 0 ? '#ef4444' : '#10b981'}"><strong>${formatCAD(remaining)}</strong></td></tr>
        <tr><th>Budget Used</th><td class="text-right">${Math.round((totalSpent / totalBudget) * 100)}%</td></tr>
      </table>
    </div>`;
  
  // Guest Summary
  const guestSummary = `
    <div style="page-break-inside: avoid; margin-bottom: 30px;">
      <h2 style="color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 8px;">Guest Summary</h2>
      <p><strong>Total Guests:</strong> ${totalGuests} people across ${state.guests.length} groups</p>
      <table>
        <thead><tr><th>Group Name</th><th>Count</th><th>Group</th><th>Names</th></tr></thead>
        <tbody>
          ${state.guests.map(g => {
            const names = g.names && g.names.length > 0 ? g.names.join(', ') : '—';
            return `<tr>
              <td>${escapeHtml(g.name)}</td>
              <td>${g.count || 1}</td>
              <td>${escapeHtml(formatGroupLabel(g.group))}</td>
              <td style="max-width: 300px; word-wrap: break-word;">${escapeHtml(names)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  
  // Events Detail
  let eventsDetail = '';
  sortedEvents.forEach(event => {
    const eventDate = event.date || 'Date not set';
    const eventVenue = event.venue || 'Venue not set';
    const invitedGuests = event.invitedGuestIds
      .map(id => state.guests.find(g => g.id === id))
      .filter(Boolean);
    const totalHeadCount = invitedGuests.reduce((sum, g) => sum + (g.count || 1), 0);
    const eventTotal = eventCost(event);
    const eventPaid = eventSpent(event);
    const eventPending = eventTotal - eventPaid;
    
    eventsDetail += `
      <div style="page-break-inside: avoid; margin-bottom: 40px; border: 2px solid #00d4ff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #a855f7; margin-top: 0;">${escapeHtml(event.name)}</h2>
        <p><strong>📅 Date:</strong> ${escapeHtml(eventDate)} &nbsp;&nbsp; <strong>📍 Venue:</strong> ${escapeHtml(eventVenue)}</p>
        ${event.notes ? `<p><strong>📝 Notes:</strong> ${escapeHtml(event.notes)}</p>` : ''}
        
        <h3 style="color: #00d4ff; margin-top: 20px;">👥 Invited Guests (${totalHeadCount} people)</h3>
        ${invitedGuests.length > 0 ? `
          <table>
            <thead><tr><th>Group</th><th>Count</th><th>Names</th></tr></thead>
            <tbody>
              ${invitedGuests.map(g => {
                const names = g.names && g.names.length > 0 ? g.names.join(', ') : '—';
                return `<tr>
                  <td>${escapeHtml(g.name)}</td>
                  <td>${g.count || 1}</td>
                  <td style="max-width: 250px; word-wrap: break-word;">${escapeHtml(names)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        ` : '<p class="muted">No guests invited yet</p>'}
        
        <h3 style="color: #00d4ff; margin-top: 20px;">💰 Budget & Expenses</h3>
        <table>
          <tr><th>Total Cost</th><td class="text-right">${formatCAD(eventTotal)}</td></tr>
          <tr><th>Paid</th><td class="text-right">${formatCAD(eventPaid)}</td></tr>
          <tr><th>Pending</th><td class="text-right">${formatCAD(eventPending)}</td></tr>
        </table>
        
        ${event.vendors && event.vendors.length > 0 ? `
          <h4 style="margin-top: 15px;">📞 Vendors</h4>
          <table>
            <thead><tr><th>Vendor</th><th>Service</th><th>Contact</th><th>Status</th><th class="text-right">Cost</th></tr></thead>
            <tbody>
              ${event.vendors.map(v => `<tr>
                <td>${escapeHtml(v.vendor)}</td>
                <td>${escapeHtml(v.service)}</td>
                <td>${escapeHtml(v.contact || '—')}</td>
                <td>${formatVendorStatus(v.status)}</td>
                <td class="text-right">${formatCAD(v.cost)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        ` : ''}
        
        ${event.tasks && event.tasks.length > 0 ? `
          <h4 style="margin-top: 15px;">✅ Tasks</h4>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${event.tasks.map(t => `<li>${escapeHtml(t.title)} - <em>${formatTaskStatus(t.status)}</em>${t.owner ? ` (${escapeHtml(t.owner)})` : ''}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${event.food && event.food.length > 0 ? `
          <h4 style="margin-top: 15px;">🍽️ Food & Catering</h4>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${event.food.map(f => `<li>${escapeHtml(f.dish)}${f.course ? ` (${escapeHtml(f.course)})` : ''} - ${formatCAD(f.cost)}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${event.decor && event.decor.length > 0 ? `
          <h4 style="margin-top: 15px;">🌸 Decor</h4>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${event.decor.map(d => `<li>${escapeHtml(d.element)}${d.theme ? ` (${escapeHtml(d.theme)})` : ''} - ${formatCAD(d.cost)}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${event.dj && event.dj.length > 0 ? `
          <h4 style="margin-top: 15px;">🎵 Entertainment</h4>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${event.dj.map(dj => `<li>${escapeHtml(dj.slot)} - ${escapeHtml(dj.performer)} (${escapeHtml(dj.type)}) - ${formatCAD(dj.cost)}</li>`).join('')}
          </ul>
        ` : ''}
        
        ${event.favors && event.favors.length > 0 ? `
          <h4 style="margin-top: 15px;">🎁 Party Favors</h4>
          <ul style="margin: 5px 0; padding-left: 20px;">
            ${event.favors.map(f => `<li>${escapeHtml(f.item)} (Qty: ${f.qty}) - ${formatCAD(f.cost)}</li>`).join('')}
          </ul>
        ` : ''}
      </div>
    `;
  });
  
  // Collect all materials from all events for separate page
  const allMaterials = [];
  state.events.forEach(event => {
    if (event.materials && event.materials.length > 0) {
      event.materials.forEach(material => {
        allMaterials.push({
          ...material,
          eventName: event.name
        });
      });
    }
  });
  
  const materialsPage = allMaterials.length > 0 ? `
    <div style="page-break-before: always; margin-top: 40px;">
      <h2 style="color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 8px;">📦 Materials & Supplies Master List</h2>
      <p style="margin-bottom: 20px;"><strong>Total Items:</strong> ${allMaterials.length}</p>
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Vendor</th>
            <th>Status</th>
            <th class="text-right">Total Cost</th>
            <th class="text-right">Advance Paid</th>
            <th class="text-right">Pending</th>
          </tr>
        </thead>
        <tbody>
          ${allMaterials.map(m => {
            const cost = sanitizeNumber(m.cost);
            const advance = sanitizeNumber(m.advance);
            const pending = cost - advance;
            return `<tr>
              <td><strong>${escapeHtml(m.eventName)}</strong></td>
              <td>${escapeHtml(m.item)}</td>
              <td>${m.qty}</td>
              <td>${escapeHtml(m.vendor || '—')}</td>
              <td>${formatMaterialStatus(m.status)}</td>
              <td class="text-right">${formatCAD(cost)}</td>
              <td class="text-right">${formatCAD(advance)}</td>
              <td class="text-right">${formatCAD(pending)}</td>
            </tr>`;
          }).join('')}
        </tbody>
        <tfoot>
          <tr style="font-weight: bold; background: #f0f0f0;">
            <td colspan="5">Total</td>
            <td class="text-right">${formatCAD(allMaterials.reduce((sum, m) => sum + sanitizeNumber(m.cost), 0))}</td>
            <td class="text-right">${formatCAD(allMaterials.reduce((sum, m) => sum + sanitizeNumber(m.advance), 0))}</td>
            <td class="text-right">${formatCAD(allMaterials.reduce((sum, m) => sum + (sanitizeNumber(m.cost) - sanitizeNumber(m.advance)), 0))}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  ` : '';
  
  const bodyHtml = `
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 2rem; color: #00d4ff; margin: 0;">${escapeHtml(title)}</h1>
      <p style="font-size: 1.1rem; color: #a855f7; margin: 10px 0 5px;">${escapeHtml(state.meta.coupleName || 'Wedding Planning')}</p>
      <p style="color: #666; margin: 0;">📅 ${escapeHtml(weddingDate)} &nbsp;•&nbsp; 📍 ${escapeHtml(venue)}</p>
      <p class="muted" style="margin-top: 10px;">Generated ${new Date().toLocaleDateString()}</p>
    </div>
    
    ${budgetOverview}
    ${guestSummary}
    
    <h2 style="color: #00d4ff; border-bottom: 2px solid #00d4ff; padding-bottom: 8px; margin-top: 40px;">Event Details</h2>
    ${eventsDetail}
    
    ${materialsPage}
  `;
  
  openPrintWindow(title, bodyHtml);
}
