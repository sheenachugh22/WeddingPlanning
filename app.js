const STORAGE_KEY = "northIndianWeddingPlannerStateV1";
const SHARE_PARAM = "plan";

const dom = {};
let state = createDefaultState();

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  bindEvents();
  loadInitialState();
  renderAll();
});

function cacheDom() {
  dom.weddingMetaForm = document.getElementById("weddingMetaForm");
  dom.coupleNameInput = document.getElementById("coupleNameInput");
  dom.primaryVenueInput = document.getElementById("primaryVenueInput");
  dom.weddingDateInput = document.getElementById("weddingDateInput");
  dom.sharePlanBtn = document.getElementById("sharePlanBtn");
  dom.exportPlanBtn = document.getElementById("exportPlanBtn");
  dom.importPlanBtn = document.getElementById("importPlanBtn");
  dom.resetPlanBtn = document.getElementById("resetPlanBtn");
  dom.importFileInput = document.getElementById("importFileInput");
  dom.shareLinkOutput = document.getElementById("shareLinkOutput");
  dom.statusMessage = document.getElementById("statusMessage");

  dom.guestForm = document.getElementById("guestForm");
  dom.guestTableBody = document.getElementById("guestTableBody");

  dom.eventSelect = document.getElementById("eventSelect");
  dom.addEventForm = document.getElementById("addEventForm");
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

  dom.taskForm = document.getElementById("taskForm");
  dom.taskTableBody = document.getElementById("taskTableBody");
  dom.materialForm = document.getElementById("materialForm");
  dom.materialTableBody = document.getElementById("materialTableBody");
  dom.foodForm = document.getElementById("foodForm");
  dom.foodTableBody = document.getElementById("foodTableBody");
  dom.decorForm = document.getElementById("decorForm");
  dom.decorTableBody = document.getElementById("decorTableBody");
  dom.djForm = document.getElementById("djForm");
  dom.djTableBody = document.getElementById("djTableBody");
  dom.favorForm = document.getElementById("favorForm");
  dom.favorTableBody = document.getElementById("favorTableBody");

  dom.globalSummary = document.getElementById("globalSummary");
  dom.eventSummary = document.getElementById("eventSummary");
  
  dom.navGuestCount = document.getElementById("navGuestCount");
  dom.navEventCount = document.getElementById("navEventCount");
  dom.navBudget = document.getElementById("navBudget");
}

function bindEvents() {
  dom.weddingMetaForm.addEventListener("input", onWeddingMetaChanged);
  dom.sharePlanBtn.addEventListener("click", onSharePlan);
  dom.exportPlanBtn.addEventListener("click", onExportPlan);
  dom.importPlanBtn.addEventListener("click", () => dom.importFileInput.click());
  dom.importFileInput.addEventListener("change", onImportPlan);
  dom.resetPlanBtn.addEventListener("click", onResetPlan);

  dom.guestForm.addEventListener("submit", onGuestAdd);
  dom.guestTableBody.addEventListener("click", onGuestTableAction);

  dom.eventSelect.addEventListener("change", onEventSelectionChanged);
  dom.addEventForm.addEventListener("submit", onEventAdd);
  dom.deleteEventBtn.addEventListener("click", onEventDelete);
  dom.eventMetaForm.addEventListener("input", onEventMetaChanged);
  dom.inviteGroupFilter.addEventListener("change", renderInviteGuestList);
  dom.inviteFilteredBtn.addEventListener("click", onInviteFilteredGuests);
  dom.clearInvitesBtn.addEventListener("click", onClearInvites);
  dom.applyTraditionalScenarioBtn.addEventListener("click", onApplyTraditionalScenario);
  dom.inviteGuestList.addEventListener("change", onInviteGuestToggle);

  dom.taskForm.addEventListener("submit", onTaskAdd);
  dom.taskTableBody.addEventListener("click", onTaskTableAction);
  dom.taskTableBody.addEventListener("change", onTaskTableAction);

  dom.materialForm.addEventListener("submit", onMaterialAdd);
  dom.materialTableBody.addEventListener("click", onMaterialTableAction);
  dom.materialTableBody.addEventListener("change", onMaterialTableAction);

  dom.foodForm.addEventListener("submit", onFoodAdd);
  dom.foodTableBody.addEventListener("click", onFoodTableAction);

  dom.decorForm.addEventListener("submit", onDecorAdd);
  dom.decorTableBody.addEventListener("click", onDecorTableAction);
  dom.decorTableBody.addEventListener("change", onDecorTableAction);

  dom.djForm.addEventListener("submit", onDjAdd);
  dom.djTableBody.addEventListener("click", onDjTableAction);

  dom.favorForm.addEventListener("submit", onFavorAdd);
  dom.favorTableBody.addEventListener("click", onFavorTableAction);
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
    setStatus("Loaded wedding plan from shared link.");
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
    setStatus("Stored data was corrupted. Reset to template.");
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
    setStatus("Shared link data was invalid. Continuing with local plan.");
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
  renderGuestTable();
  renderEventSelect();
  renderEventMeta();
  renderInviteGuestList();
  renderTaskTable();
  renderMaterialTable();
  renderFoodTable();
  renderDecorTable();
  renderDjTable();
  renderFavorTable();
  renderSummary();
  renderShareLinkOutput();
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
}

function renderGuestTable() {
  if (!state.guests.length) {
    dom.guestTableBody.innerHTML = `<tr><td colspan="6" class="muted">No guests yet.</td></tr>`;
    return;
  }

  dom.guestTableBody.innerHTML = state.guests
    .map(
      (guest) => `
        <tr>
          <td>${escapeHtml(guest.name)}</td>
          <td>${formatGroupLabel(guest.group)}</td>
          <td>${escapeHtml(guest.phone || "-")}</td>
          <td>${escapeHtml(guest.dietary || "-")}</td>
          <td>${escapeHtml(guest.notes || "-")}</td>
          <td><button data-action="remove-guest" data-id="${guest.id}" type="button" class="danger">Remove</button></td>
        </tr>
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

function renderTaskTable() {
  const event = currentEvent();
  if (!event || !event.tasks.length) {
    dom.taskTableBody.innerHTML = `<tr><td colspan="5" class="muted">No tasks added for this function.</td></tr>`;
    return;
  }

  dom.taskTableBody.innerHTML = event.tasks
    .map(
      (task) => `
      <tr>
        <td>${escapeHtml(task.title)}</td>
        <td>${escapeHtml(task.owner || "-")}</td>
        <td>
          <select data-action="task-status" data-id="${task.id}">
            <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="in_progress" ${task.status === "in_progress" ? "selected" : ""}>In Progress</option>
            <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
          </select>
        </td>
        <td>${escapeHtml(task.deadline || "-")}</td>
        <td><button type="button" class="danger" data-action="remove-task" data-id="${task.id}">Remove</button></td>
      </tr>
    `,
    )
    .join("");
}

function renderMaterialTable() {
  const event = currentEvent();
  if (!event || !event.materials.length) {
    dom.materialTableBody.innerHTML = `<tr><td colspan="6" class="muted">No materials tracked for this function.</td></tr>`;
    return;
  }

  dom.materialTableBody.innerHTML = event.materials
    .map(
      (material) => `
      <tr>
        <td>${escapeHtml(material.item)}</td>
        <td>${escapeHtml(String(material.qty))}</td>
        <td>${escapeHtml(material.vendor || "-")}</td>
        <td>
          <select data-action="material-status" data-id="${material.id}">
            <option value="pending" ${material.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="ordered" ${material.status === "ordered" ? "selected" : ""}>Ordered</option>
            <option value="delivered" ${material.status === "delivered" ? "selected" : ""}>Delivered</option>
          </select>
        </td>
        <td>${formatCurrency(material.cost)}</td>
        <td><button type="button" class="danger" data-action="remove-material" data-id="${material.id}">Remove</button></td>
      </tr>
    `,
    )
    .join("");
}

function renderFoodTable() {
  const event = currentEvent();
  if (!event || !event.food.length) {
    dom.foodTableBody.innerHTML = `<tr><td colspan="6" class="muted">No food items for this function yet.</td></tr>`;
    return;
  }

  dom.foodTableBody.innerHTML = event.food
    .map(
      (food) => `
      <tr>
        <td>${escapeHtml(food.dish)}</td>
        <td>${escapeHtml(food.course || "-")}</td>
        <td>${escapeHtml(food.vendor || "-")}</td>
        <td>${escapeHtml(String(food.servings || 0))}</td>
        <td>${formatCurrency(food.cost)}</td>
        <td><button type="button" class="danger" data-action="remove-food" data-id="${food.id}">Remove</button></td>
      </tr>
    `,
    )
    .join("");
}

function renderDecorTable() {
  const event = currentEvent();
  if (!event || !event.decor.length) {
    dom.decorTableBody.innerHTML = `<tr><td colspan="6" class="muted">No decor entries for this function yet.</td></tr>`;
    return;
  }

  dom.decorTableBody.innerHTML = event.decor
    .map(
      (decor) => `
      <tr>
        <td>${escapeHtml(decor.element)}</td>
        <td>${escapeHtml(decor.vendor || "-")}</td>
        <td>${escapeHtml(decor.theme || "-")}</td>
        <td>
          <select data-action="decor-status" data-id="${decor.id}">
            <option value="pending" ${decor.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="approved" ${decor.status === "approved" ? "selected" : ""}>Approved</option>
            <option value="ready" ${decor.status === "ready" ? "selected" : ""}>Ready</option>
          </select>
        </td>
        <td>${formatCurrency(decor.cost)}</td>
        <td><button type="button" class="danger" data-action="remove-decor" data-id="${decor.id}">Remove</button></td>
      </tr>
    `,
    )
    .join("");
}

function renderDjTable() {
  const event = currentEvent();
  if (!event || !event.dj.length) {
    dom.djTableBody.innerHTML = `<tr><td colspan="6" class="muted">No DJ/performance entries for this function yet.</td></tr>`;
    return;
  }

  dom.djTableBody.innerHTML = event.dj
    .map(
      (dj) => `
      <tr>
        <td>${escapeHtml(dj.slot)}</td>
        <td>${escapeHtml(dj.performer || "-")}</td>
        <td>${escapeHtml(dj.type || "-")}</td>
        <td>${escapeHtml(dj.notes || "-")}</td>
        <td>${formatCurrency(dj.cost)}</td>
        <td><button type="button" class="danger" data-action="remove-dj" data-id="${dj.id}">Remove</button></td>
      </tr>
    `,
    )
    .join("");
}

function renderFavorTable() {
  const event = currentEvent();
  if (!event || !event.favors.length) {
    dom.favorTableBody.innerHTML = `<tr><td colspan="6" class="muted">No party favors configured for this function yet.</td></tr>`;
    return;
  }

  dom.favorTableBody.innerHTML = event.favors
    .map(
      (favor) => `
      <tr>
        <td>${escapeHtml(favor.item)}</td>
        <td>${escapeHtml(String(favor.qty))}</td>
        <td>${escapeHtml(favor.target || "-")}</td>
        <td>${escapeHtml(favor.notes || "-")}</td>
        <td>${formatCurrency(favor.cost)}</td>
        <td><button type="button" class="danger" data-action="remove-favor" data-id="${favor.id}">Remove</button></td>
      </tr>
    `,
    )
    .join("");
}

function renderSummary() {
  const event = currentEvent();
  const totalBudget = state.events.reduce((sum, item) => sum + eventCost(item), 0);
  const totalInvites = state.events.reduce((sum, item) => sum + item.invitedGuestIds.length, 0);
  const pendingTasks = state.events.reduce(
    (sum, item) => sum + item.tasks.filter((task) => task.status !== "done").length,
    0,
  );

  // Update navbar stats
  if (dom.navGuestCount) {
    dom.navGuestCount.textContent = state.guests.length;
  }
  if (dom.navEventCount) {
    dom.navEventCount.textContent = state.events.length;
  }
  if (dom.navBudget) {
    dom.navBudget.textContent = formatCurrency(totalBudget);
  }

  dom.globalSummary.innerHTML = `
    <div class="summary-card">
      <span>Total Guests</span>
      <strong>${state.guests.length}</strong>
    </div>
    <div class="summary-card">
      <span>Total Functions</span>
      <strong>${state.events.length}</strong>
    </div>
    <div class="summary-card">
      <span>Total Invite Slots</span>
      <strong>${totalInvites}</strong>
    </div>
    <div class="summary-card">
      <span>Open Tasks</span>
      <strong>${pendingTasks}</strong>
    </div>
    <div class="summary-card">
      <span>Planned Spend</span>
      <strong>${formatCurrency(totalBudget)}</strong>
    </div>
  `;

  if (!event) {
    dom.eventSummary.innerHTML = "";
    return;
  }

  const taskOpen = event.tasks.filter((task) => task.status !== "done").length;
  const materialCost = event.materials.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0);
  const foodCost = event.food.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0);
  const decorCost = event.decor.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0);
  const djCost = event.dj.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0);
  const favorCost = event.favors.reduce((sum, item) => sum + sanitizeNumber(item.cost), 0);

  dom.eventSummary.innerHTML = `
    <div class="summary-card">
      <span>Selected Function</span>
      <strong>${escapeHtml(event.name)}</strong>
    </div>
    <div class="summary-card">
      <span>Invited Guests</span>
      <strong>${event.invitedGuestIds.length}</strong>
    </div>
    <div class="summary-card">
      <span>Open Tasks</span>
      <strong>${taskOpen}</strong>
    </div>
    <div class="summary-card">
      <span>Materials Cost</span>
      <strong>${formatCurrency(materialCost)}</strong>
    </div>
    <div class="summary-card">
      <span>Food Cost</span>
      <strong>${formatCurrency(foodCost)}</strong>
    </div>
    <div class="summary-card">
      <span>Decor Cost</span>
      <strong>${formatCurrency(decorCost)}</strong>
    </div>
    <div class="summary-card">
      <span>DJ Cost</span>
      <strong>${formatCurrency(djCost)}</strong>
    </div>
    <div class="summary-card">
      <span>Favors Cost</span>
      <strong>${formatCurrency(favorCost)}</strong>
    </div>
    <div class="summary-card">
      <span>Total Function Cost</span>
      <strong>${formatCurrency(eventCost(event))}</strong>
    </div>
  `;
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

async function onSharePlan() {
  const shareUrl = buildShareUrl();
  dom.shareLinkOutput.value = shareUrl;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus("Share link copied to clipboard.");
      return;
    } catch (error) {
      console.error("Clipboard write failed:", error);
    }
  }

  dom.shareLinkOutput.focus();
  dom.shareLinkOutput.select();
  setStatus("Share link ready. Copy it manually.");
}

function onExportPlan() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "north-indian-wedding-plan.json";
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus("Wedding plan exported.");
}

function onImportPlan(event) {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      state = normalizeState(parsed);
      saveAndRender("Wedding plan imported.");
    } catch (error) {
      console.error("Import failed:", error);
      setStatus("Import failed. Please upload a valid JSON file.");
    } finally {
      dom.importFileInput.value = "";
    }
  };

  reader.readAsText(file);
}

function onResetPlan() {
  if (!window.confirm("Reset plan to default North Indian wedding template?")) {
    return;
  }
  state = createDefaultState();
  saveAndRender("Template restored.");
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
  saveAndRender("Guest added.");
}

function onGuestTableAction(event) {
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
  saveAndRender("Guest removed.");
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
  saveAndRender("Function added.");
}

function onEventDelete() {
  if (state.events.length <= 1) {
    setStatus("At least one function must exist.");
    return;
  }

  const event = currentEvent();
  if (!event) {
    return;
  }

  if (!window.confirm(`Delete function "${event.name}"?`)) {
    return;
  }

  state.events = state.events.filter((item) => item.id !== event.id);
  state.selectedEventId = state.events[0].id;
  saveAndRender("Function deleted.");
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
  saveAndRender("Filtered guests invited.");
}

function onClearInvites() {
  const event = currentEvent();
  if (!event) {
    return;
  }
  event.invitedGuestIds = [];
  saveAndRender("Invites cleared for selected function.");
}

function onApplyTraditionalScenario() {
  const mehndi = state.events.find((event) => event.name.toLowerCase().includes("mehndi"));
  const sangeet = state.events.find((event) => event.name.toLowerCase().includes("sangeet"));

  if (!mehndi && !sangeet) {
    setStatus("No Mehndi or Sangeet functions found.");
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

  saveAndRender("Traditional Mehndi + Sangeet scenario applied.");
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
  saveAndRender("Task added.");
}

function onTaskTableAction(event) {
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
    saveAndRender("Task removed.");
    return;
  }

  if (action === "task-status" && target instanceof HTMLSelectElement) {
    const item = eventItem.tasks.find((task) => task.id === id);
    if (!item) {
      return;
    }
    item.status = sanitizeTaskStatus(target.value);
    saveAndRender();
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
  saveAndRender("Material added.");
}

function onMaterialTableAction(event) {
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
    saveAndRender("Material removed.");
    return;
  }

  if (action === "material-status" && target instanceof HTMLSelectElement) {
    const item = eventItem.materials.find((material) => material.id === id);
    if (!item) {
      return;
    }
    item.status = sanitizeMaterialStatus(target.value);
    saveAndRender();
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
  saveAndRender("Food item added.");
}

function onFoodTableAction(event) {
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
  saveAndRender("Food item removed.");
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
  saveAndRender("Decor item added.");
}

function onDecorTableAction(event) {
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
    saveAndRender("Decor item removed.");
    return;
  }

  if (action === "decor-status" && target instanceof HTMLSelectElement) {
    const item = eventItem.decor.find((decor) => decor.id === id);
    if (!item) {
      return;
    }
    item.status = sanitizeDecorStatus(target.value);
    saveAndRender();
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
  saveAndRender("DJ/performance item added.");
}

function onDjTableAction(event) {
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
  saveAndRender("DJ/performance item removed.");
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
  saveAndRender("Favor item added.");
}

function onFavorTableAction(event) {
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
  saveAndRender("Favor item removed.");
}

function saveAndRender(statusText) {
  persistState();
  renderAll();
  if (statusText) {
    setStatus(statusText);
  }
}

function setStatus(message) {
  dom.statusMessage.textContent = message;
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
