const STORAGE_KEYS = {
    session: "packplot.session",
    profile: "packplot.profile",
    savedTrips: "packplot.savedTrips",
    usage: "packplot.usage",
    subscription: "packplot.subscription"
};

const state = {
    page: document.body.dataset.page || "home",
    session: loadJSON(STORAGE_KEYS.session, null),
    profile: loadJSON(STORAGE_KEYS.profile, {}),
    savedTrips: loadJSON(STORAGE_KEYS.savedTrips, []),
    usage: loadJSON(STORAGE_KEYS.usage, { month: "", count: 0 }),
    subscription: loadJSON(STORAGE_KEYS.subscription, { plan: "free" }),
    currentTrip: null,
    draggedActivityId: null
};

const destinationCatalog = {
    Baguio: {
        tags: ["Culture", "Food Trip", "Relaxing"],
        attractions: [
            "Burnham Park bike ride",
            "Session Road cafe circuit",
            "BenCab Museum visit",
            "Camp John Hay eco-trail",
            "Mines View food stop",
            "Night market stroll",
            "Botanical Garden walk",
            "Strawberry taho snack break"
        ],
        food: ["cordillera breakfast", "strawberry dessert stop", "local coffee tasting"],
        logistics: "Cool-weather city routing with clustered urban attractions"
    },
    Siargao: {
        tags: ["Adventure", "Relaxing"],
        attractions: [
            "Cloud 9 surf session",
            "Magpupungko rock pools",
            "Sugba Lagoon paddle trip",
            "Island hopping charter",
            "Sunset boardwalk stop",
            "Coconut road scenic drive",
            "Beachfront brunch block",
            "General Luna dinner crawl"
        ],
        food: ["seafood lunch stop", "beach cafe dinner", "fresh smoothie break"],
        logistics: "Island-based routing with water activity buffers"
    },
    Cebu: {
        tags: ["Adventure", "Culture", "Food Trip"],
        attractions: [
            "Historic downtown walk",
            "Temple of Leah viewpoint",
            "Lechon lunch feature",
            "Mountain ridge scenic drive",
            "Museum and heritage circuit",
            "Island ferry planning block",
            "Carbon Market visit",
            "Business district dinner"
        ],
        food: ["lechon tasting", "seafood grill dinner", "coffee roastery break"],
        logistics: "Mixed urban and day-trip scheduling with transit windows"
    },
    Manila: {
        tags: ["Culture", "Business", "Food Trip"],
        attractions: [
            "Intramuros heritage walk",
            "National Museum circuit",
            "Makati business meeting block",
            "Binondo food crawl",
            "Rizal Park photo stop",
            "BGC dinner and nightlife",
            "Mall or retail break",
            "Sunset Baywalk stop"
        ],
        food: ["binondo tasting route", "rooftop dinner", "specialty coffee break"],
        logistics: "Traffic-aware routing with clustered district scheduling"
    },
    Palawan: {
        tags: ["Relaxing", "Adventure"],
        attractions: [
            "Island hopping expedition",
            "Limestone lagoon visit",
            "Beach recovery block",
            "Seafood market dinner",
            "Sunrise coastal walk",
            "Kayak and snorkeling session",
            "Scenic viewpoint climb",
            "Resort free-time block"
        ],
        food: ["grilled seafood lunch", "harbor cafe breakfast", "sunset dinner setup"],
        logistics: "Boat-transfer planning with weather-friendly pacing"
    },
    Boracay: {
        tags: ["Relaxing", "Food Trip"],
        attractions: [
            "White Beach sunrise walk",
            "D'Mall food and retail stop",
            "Puka Beach quiet escape",
            "Paraw sunset sailing",
            "Station 1 lounge block",
            "Water activity sampler",
            "Beachfront dinner route",
            "Nightlife or dessert crawl"
        ],
        food: ["beachfront brunch", "seafood dinner", "mango dessert stop"],
        logistics: "Walkable beach routing with sunset-first scheduling"
    },
    Batanes: {
        tags: ["Culture", "Relaxing"],
        attractions: [
            "Rolling Hills viewpoint",
            "Basco lighthouse stop",
            "Ivatan stone house visit",
            "Marlboro Country scenic drive",
            "Honesty Coffee Shop break",
            "Valugan Boulder Beach walk",
            "Quiet village lunch stop",
            "Sunset cliff viewpoint"
        ],
        food: ["Ivatan lunch plate", "local coffee stop", "homestyle dinner"],
        logistics: "Slow scenic routing with weather and viewpoint buffers"
    }
};

const moodTemplates = {
    Relaxing: [
        "slow breakfast with a scenic stop",
        "light sightseeing and lounge time",
        "wellness or spa session",
        "sunset walk and low-key dinner"
    ],
    Adventure: [
        "early active outing",
        "equipment prep and safety buffer",
        "high-energy outdoor session",
        "recovery dinner and free time"
    ],
    "Food Trip": [
        "breakfast tasting route",
        "market or specialty stop",
        "signature lunch feature",
        "evening dining crawl"
    ],
    Culture: [
        "heritage district walk",
        "museum or gallery block",
        "local craft or food history stop",
        "cultural evening activity"
    ]
};

const behaviorStyles = {
    "Fast-paced": {
        times: ["07:30", "09:30", "12:30", "15:00", "18:30"],
        label: "High-momentum schedule with efficient transitions"
    },
    Balanced: {
        times: ["08:00", "10:30", "13:00", "15:30", "18:30"],
        label: "Balanced schedule with activity and buffer time"
    },
    Chill: {
        times: ["09:00", "11:30", "14:00", "16:30", "19:00"],
        label: "Relaxed schedule with longer breaks"
    }
};

const lifestyleNotes = {
    Budget: "Budget-conscious choices with practical transport and value stops",
    "Mid-range": "Comfort-forward planning with curated dining and smooth pacing",
    Luxury: "Premium experiences, polished dining, and higher convenience routing"
};

const purposeNotes = {
    Vacation: "Prioritizes leisure, signature spots, and memorable downtime",
    Business: "Adds meeting-friendly pacing, work blocks, and efficient district routing",
    Adventure: "Focuses on active outings, movement, and destination highlights"
};

const travelerNotes = {
    Solo: "Designed for flexible solo exploration",
    Family: "Includes family-friendly pacing and comfort stops",
    Couple: "Includes intimate stops and scenic downtime",
    Friends: "Supports shared energy, social meals, and group-friendly timing"
};

const refs = {};

init();

function init() {
    resetMonthlyUsageIfNeeded();
    cacheRefs();
    bindGlobalActions();

    if (state.page === "login" || state.page === "signup") {
        bindAuthPage();
    }

    if (state.page === "planner") {
        seedPlannerDefaults();
        restoreProfileForm();
        bindPlannerPage();
        hydrateSharedTrip();
        renderPlannerState();
    }
}

//a dded today 5/28
const marketplaceItems = {
    "walking-tour-baguio": {
        type:"tour",
        title: "Baguio Creative Walking Tour",
        time: "10:00",
        detail: "Guided cultural walking tour featuring creative spots and local stories in Baguio."
    },

    "hotel-john-hay": {
        type:"hotel",
        title: "John Hay Hotels Reservation",
        time: "14:00",
        detail: "Hotel check-in reservation inside Camp John Hay."
    },

    "four-points-palawan": {
        title: "Four Points by Sheraton Palawan",
        time: "15:00",
        detail: "Beachfront resort stay in Palawan."
    },

    "harana-surf-resort": {
        title: "Harana Surf Resort Stay",
        time: "14:00",
        detail: "Relaxing surf resort accommodation in Siargao."
    },

    "shangrila-mactan": {
        title: "Shangri-La Mactan Cebu",
        time: "15:00",
        detail: "Luxury beachfront Cebu resort booking."
    },

    "fundacion-pacita": {
        title: "Fundacion Pacita Batanes",
        time: "14:00",
        detail: "Hilltop heritage hotel experience in Batanes."
    },

    "henann-regency": {
        title: "Henann Regency Resort & Spa",
        time: "15:00",
        detail: "Beachfront Boracay resort accommodation."
    },

    "south-shore-siargao": {
        title: "South Shore Siargao Tours",
        time: "09:00",
        detail: "Island hopping and guided Siargao tour."
    },

    "island-trek-cebu": {
        title: "Island Trek Tours Cebu",
        time: "08:30",
        detail: "Cebu city and mountain guided tour."
    },

    "ivatan-guides": {
        title: "Ivatan Cultural Guides",
        time: "09:00",
        detail: "Cultural Batanes guided experience."
    },

    "sky-ranch-baguio": {
        title: "Sky Ranch Baguio Visit",
        time: "16:00",
        detail: "Enjoy rides and scenic attractions in Baguio."
    },

    "harana-surf-school": {
        title: "Harana Surf School",
        time: "07:00",
        detail: "Surf lessons and board rental in Siargao."
    },

    "7-wonders-palawan": {
        title: "7 Wonders Adventures Tour",
        time: "08:00",
        detail: "Island and land tours around Palawan."
    },

    "badian-canyoneering": {
        title: "Badian Cebu Canyoneering",
        time: "06:00",
        detail: "Adventure canyoneering activity in Cebu."
    },

    "underground-river": {
        title: "Puerto Princesa Underground River Tour",
        time: "08:00",
        detail: "Guided underground river eco-tour."
    },

    "batanes-island-hopping": {
        title: "Batanes Island Hopping",
        time: "09:00",
        detail: "Scenic island hopping activity in Batanes."
    },

    "boracay-adventures": {
        title: "Boracay Adventures Travel N Tours",
        time: "11:00",
        detail: "Island activities and beach adventures."
    },

    "edrues-boracay": {
        title: "Edrue's Travel and Tours",
        time: "10:00",
        detail: "Guided Boracay local experience."
    },

    "elnido-artcafe": {
        title: "El Nido Boutique ArtCafe",
        time: "12:00",
        detail: "Lunch stop at El Nido ArtCafe."
    },

    "chocolate-batirol": {
        title: "Choco-late de Batirol",
        time: "08:00",
        detail: "Traditional Baguio breakfast and hot chocolate."
    },

    "kermit-siargao": {
        title: "Kermit Siargao Restaurant",
        time: "18:00",
        detail: "Dinner stop at popular Siargao restaurant."
    },

    "creative-cuisine-cebu": {
        title: "Creative Cuisine Catering",
        time: "12:00",
        detail: "Catering and food service schedule."
    },

    "sea-breeze-boracay": {
        title: "Sea Breeze Restaurant",
        time: "19:00",
        detail: "Beachfront dinner buffet in Boracay."
    },

    "honesty-coffee-batanes": {
        title: "Honesty Coffee Shop & Restaurant",
        time: "08:30",
        detail: "Breakfast and coffee stop in Batanes."
    }
};

window.addToItinerary = function(id) {
    const item = marketplaceItems[id];
    if (!item) return;

    localStorage.setItem("pendingMarketplaceItem", JSON.stringify(item));

    window.location.href = "planner.html";
};

function hydrateMarketplacePick() {
    const raw = localStorage.getItem("packplot.marketplacePick");
    if (!raw) return;

    const item = JSON.parse(raw);
    localStorage.removeItem("packplot.marketplacePick");

    if (!state.currentTrip) {
        toast("Generate a trip first before adding marketplace item.");
        return;
    }

    const day = state.currentTrip.days[0];

    day.activities.push({
        id: createId("activity"),
        time: item.time || "12:00",
        title: item.title,
        detail: item.detail
    });

    renderCurrentTrip();
    toast("Marketplace item added!");
} //added

function generateMarketplaceActivities(item) {
    const base = {
        id: createId("activity"),
        time: item.time || "12:00",
    };

    switch (item.type) {

        case "hotel":
            return [
                {
                    ...base,
                    title: "Check-in / Rest",
                    detail: item.detail
                },
                {
                    id: createId("activity"),
                    time: "18:00",
                    title: "Light walk / hotel surroundings",
                    detail: "Relaxed exploration near accommodation."
                }
            ];

        case "tour":
            return [
                {
                    ...base,
                    title: item.title,
                    detail: "Guided activity start"
                },
                {
                    id: createId("activity"),
                    time: "13:00",
                    title: "Free exploration / photo stops",
                    detail: "Leisure walking and optional stops."
                }
            ];

        default:
            return [{
                ...base,
                title: item.title,
                detail: item.detail
            }];
    }
}

function cacheRefs() {
    [
        "authForm",
        "authMode",
        "authName",
        "authEmail",
        "authPassword",
        "authConfirmPassword",
        "googleLoginBtn",
        "toast",
        "logoutBtn",
        "accountGreeting",
        "subscriptionBadge",
        "usageCount",
        "savedCount",
        "profileForm",
        "profileName",
        "profileEmail",
        "profileHomeBase",
        "profileTravelerType",
        "profileLifestyle",
        "profileMood",
        "profileNotes",
        "plannerForm",
        "destination",
        "startDate",
        "endDate",
        "budget",
        "duration",
        "travelerType",
        "mood",
        "behavior",
        "lifestyle",
        "purpose",
        "fillSampleBtn",
        "upgradeBtn",
        "starterPlanBtn",
        "addDayBtn",
        "saveTripBtn",
        "downloadBtn",
        "shareBtn",
        "itineraryTitle",
        "itinerarySummary",
        "itineraryDays",
        "savedTrips",
        "tripInsights",
        "routePreview"
    ].forEach((id) => {
        refs[id] = document.getElementById(id);
    });
}

function bindGlobalActions() {
    if (refs.googleLoginBtn) {
        refs.googleLoginBtn.addEventListener("click", mockGoogleLogin);
    }

    if (refs.logoutBtn) {
        refs.logoutBtn.addEventListener("click", logout);
    }
}

function bindAuthPage() {
    refs.authForm?.addEventListener("submit", handleAuthSubmit);
}

function bindPlannerPage() {
    refs.profileForm?.addEventListener("submit", handleProfileSubmit);
    refs.plannerForm?.addEventListener("submit", handleGenerateTrip);
    refs.fillSampleBtn?.addEventListener("click", fillSampleTrip);
    refs.destination?.addEventListener("input", () => {
        if (!state.currentTrip) {
            renderRoutePreviewForDestination(refs.destination.value);
        }
    });
    refs.upgradeBtn?.addEventListener("click", upgradeToPremium);
    refs.starterPlanBtn?.addEventListener("click", downgradeToFree);
    refs.addDayBtn?.addEventListener("click", addManualDay);
    refs.saveTripBtn?.addEventListener("click", saveCurrentTrip);
    refs.downloadBtn?.addEventListener("click", downloadCurrentTrip);
    refs.shareBtn?.addEventListener("click", shareCurrentTrip);
    document.querySelectorAll("[data-destination-choice]").forEach((card) => {
        card.addEventListener("click", () => selectDestinationCard(card));
    });
}

function selectDestinationCard(card) {
    const destination = card.dataset.destinationChoice;
    const mood = card.dataset.moodChoice;

    refs.destination.value = destination;
    refs.mood.value = mood;
    state.currentTrip = null;

    document.querySelectorAll("[data-destination-choice]").forEach((item) => {
        item.classList.toggle("is-selected", item === card);
    });

    renderCurrentTrip();
    renderRoutePreviewForDestination(destination);
    toast(`${destination} selected. Trip mood set to ${mood}.`);
}

function handleAuthSubmit(event) {
    event.preventDefault();

    const mode = refs.authMode?.value || "login";
    const name = refs.authName?.value.trim() || "Traveler";
    const email = refs.authEmail?.value.trim() || "";
    const password = refs.authPassword?.value || "";
    const confirmPassword = refs.authConfirmPassword?.value || "";

    if (!email || !password) {
        toast("Please complete the required account fields.");
        return;
    }

    if (mode === "signup" && confirmPassword !== password) {
        toast("Password confirmation does not match.");
        return;
    }

    state.session = {
        name,
        email,
        mode,
        loginProvider: "email"
    };
    persist(STORAGE_KEYS.session, state.session);

    state.profile = {
        ...state.profile,
        name: state.profile.name || name,
        email: state.profile.email || email
    };
    persist(STORAGE_KEYS.profile, state.profile);

    toast(mode === "signup" ? "Account created. Redirecting to planner..." : "Login successful. Redirecting to planner...");
    window.setTimeout(() => {
        window.location.href = "planner.html";
    }, 700);
}

function handleProfileSubmit(event) {
    event.preventDefault();

    state.profile = {
        name: refs.profileName?.value.trim() || "",
        email: refs.profileEmail?.value.trim() || "",
        homeBase: refs.profileHomeBase?.value.trim() || "",
        travelerType: refs.profileTravelerType?.value || "Solo",
        lifestyle: refs.profileLifestyle?.value || "Budget",
        mood: refs.profileMood?.value || "Relaxing",
        notes: refs.profileNotes?.value.trim() || ""
    };

    persist(STORAGE_KEYS.profile, state.profile);
    renderPlannerHeader();
    toast("Traveler profile saved.");
}

function handleGenerateTrip(event) {
    event.preventDefault();

    if (!canGenerateTrip()) {
        return;
    }

    const input = readPlannerInput();
    if (!input.destination || !input.startDate || !input.endDate) {
        toast("Please complete the trip details first.");
        return;
    }

    state.currentTrip = buildTrip(input);
    incrementUsage();
    renderPlannerState();
    document.getElementById("itinerarySection")?.scrollIntoView({ behavior: "smooth" });
    toast(`Generated a realistic itinerary for ${input.destination}.`);
}

function canGenerateTrip() {
    if (state.subscription.plan === "premium") {
        return true;
    }

    if (state.usage.count >= 2) {
        toast("Free plan limit reached. Upgrade to Premium for unlimited itinerary generation.");
        return false;
    }

    return true;
}

function renderPlannerState() {
    renderPlannerHeader();
    renderCurrentTrip();
    renderSavedTrips();
    syncPremiumUI();
}

function renderPlannerHeader() {
    if (!refs.accountGreeting) {
        return;
    }

    const userName = state.session?.name || state.profile.name || "Guest mode";
    refs.accountGreeting.textContent = state.session ? `Welcome, ${userName}` : userName;
    refs.subscriptionBadge.textContent = state.subscription.plan === "premium" ? "Premium Plan" : "Free Plan";
    refs.usageCount.textContent = state.subscription.plan === "premium" ? `${state.usage.count} / Unlimited` : `${state.usage.count} / 2`;
    refs.savedCount.textContent = String(state.savedTrips.length);

    if (refs.logoutBtn) {
        refs.logoutBtn.hidden = !state.session;
    }
}

function renderCurrentTrip() {
    if (!refs.itineraryDays) {
        return;
    }

    const trip = state.currentTrip;
    const hasTrip = Boolean(trip);

    refs.addDayBtn.disabled = !hasTrip;
    refs.saveTripBtn.disabled = !hasTrip;
    refs.downloadBtn.disabled = !hasTrip;
    refs.shareBtn.disabled = !hasTrip;

    if (!hasTrip) {
        refs.itineraryTitle.textContent = "Your itinerary will appear here";
        refs.itinerarySummary.textContent = "Generate a trip to unlock drag-and-drop editing and smarter travel planning.";
        refs.tripInsights.innerHTML = "";
        renderRoutePreviewForDestination(refs.destination?.value || "");
        refs.itineraryDays.innerHTML = `
            <div class="empty-state">
                <h3>No itinerary yet</h3>
                <p>Use the generator above to create a realistic trip plan.</p>
            </div>
        `;
        return;
    }

    refs.itineraryTitle.textContent = `${trip.destination} ${trip.durationLabel} itinerary`;
    refs.itinerarySummary.textContent = `${trip.dateLabel} | ${trip.travelerType} | ${trip.mood} | ${trip.planNote}`;
    renderInsights(trip);
    renderRoutePreview(trip);

    refs.itineraryDays.innerHTML = trip.days.map((day, index) => `
        <article class="day-card">
            <header>
                <div>
                    <p class="eyebrow">Day ${index + 1}</p>
                    <h3>${day.title}</h3>
                    <p class="trip-meta">${day.note}</p>
                </div>
                <button class="small-btn" type="button" data-remove-day="${day.id}">-</button>
            </header>
            <div class="activity-list" data-day-dropzone="${day.id}">
                ${day.activities.map((activity) => `
                    <div class="activity-item" draggable="true" data-activity-id="${activity.id}" data-day-parent="${day.id}">
                        <div class="activity-copy">
                            <strong>${activity.time} - ${activity.title}</strong>
                            <span>${activity.detail}</span>
                        </div>
                        <div class="activity-controls">
                            <button class="small-btn" type="button" data-remove-activity="${activity.id}">x</button>
                        </div>
                    </div>
                `).join("")}
            </div>
            <form class="activity-form" data-add-activity-form="${day.id}">
                <input type="text" name="activityTitle" placeholder="Add attraction or schedule block" required>
                <button type="submit" class="btn secondary">Add</button>
            </form>
        </article>
    `).join("");

    bindTripEditorEvents();
}

function renderInsights(trip) {
    const cards = [
        { label: "Route Style", value: trip.routeLogic },
        { label: "Budget Fit", value: trip.budgetBand },
        { label: "Travel Match", value: trip.travelerSummary },
        { label: "Destination Logic", value: trip.destinationNote }
    ];

    refs.tripInsights.innerHTML = cards.map((card) => `
        <article class="insight-card">
            <span>${card.label}</span>
            <strong>${card.value}</strong>
        </article>
    `).join("");
}

function renderRoutePreviewForDestination(destination) {
    if (!refs.routePreview) {
        return;
    }

    const normalized = toTitleCase(destination) || "Sample";
    const catalog = getDestinationData(normalized);
    const routeStops = [
        `${normalized} arrival area`,
        catalog.attractions[0] || `${normalized} activity cluster`,
        catalog.attractions[1] || `${normalized} departure point`
    ];
    const transportOptions = buildTransportOptions({ destination: normalized });

    renderRoutePreviewContent({
        title: normalized === "Sample" ? "Sample route preview" : `${normalized} sample route`,
        label: normalized === "Sample" ? "Static route map preview" : `Static route map preview for ${normalized}`,
        routeStops,
        transportOptions
    });
}

function renderRoutePreview(trip) {
    if (!refs.routePreview) {
        return;
    }

    const transportOptions = buildTransportOptions(trip);
    const routeStops = buildRouteStops(trip);

    renderRoutePreviewContent({
        title: `${trip.destination} sample route`,
        label: `Static route map preview for ${trip.destination}`,
        routeStops,
        transportOptions
    });
}

function renderRoutePreviewContent({ title, label, routeStops, transportOptions }) {
    const routePoints = buildRoutePoints(routeStops);

    refs.routePreview.hidden = false;
    refs.routePreview.innerHTML = `
        <article class="route-map-card">
            <div class="route-map-head">
                <div>
                    <p class="eyebrow">Route Map</p>
                    <h3>${title}</h3>
                </div>
                <span class="pill">Static Preview</span>
            </div>
            <div class="mock-map" aria-label="${label}">
                <div class="map-grid"></div>
                <div class="map-road road-main"></div>
                <div class="map-road road-secondary"></div>
                <div class="map-road road-tertiary"></div>
                ${routePoints.map((point, index) => `
                    <div class="map-pin" style="left: ${point.left}%; top: ${point.top}%;">
                        <span>${String.fromCharCode(65 + index)}</span>
                        <small>${point.stop}</small>
                    </div>
                `).join("")}
            </div>
            <div class="route-stops">
                ${routeStops.map((stop, index) => `
                    <div>
                        <span>${String.fromCharCode(65 + index)}</span>
                        <strong>${stop}</strong>
                    </div>
                `).join("")}
            </div>
        </article>
        <article class="transport-card">
            <div class="route-map-head">
                <div>
                    <p class="eyebrow">Transportation</p>
                    <h3>Available options</h3>
                </div>
            </div>
            <div class="transport-list">
                ${transportOptions.map((option) => `
                    <div class="transport-option">
                        <div class="transport-icon">${option.icon}</div>
                        <div>
                            <strong>${option.name}</strong>
                            <span>${option.detail}</span>
                        </div>
                        <p>${option.estimate}</p>
                    </div>
                `).join("")}
            </div>
        </article>
    `;
}

function buildRoutePoints(routeStops) {
    const positions = [
        { left: 16, top: 66 },
        { left: 34, top: 40 },
        { left: 52, top: 58 },
        { left: 68, top: 32 },
        { left: 82, top: 62 },
        { left: 58, top: 78 }
    ];

    return routeStops.slice(0, positions.length).map((stop, index) => ({
        ...positions[index],
        stop
    }));
}

function buildRouteStops(trip) {

    const stops = [];

    stops.push(`${trip.destination} Arrival`);

    const allActivities = [];

    trip.days.forEach((day) => {
        day.activities.forEach((act) => {
            allActivities.push(act.title);
        });
    });

    // remove duplicates + empty
    const unique = [...new Set(allActivities)].filter(Boolean);

    // B - D (force at least 3 extra stops)
    for (let i = 0; i < 3; i++) {
        stops.push(unique[i] || `${trip.destination} Activity ${i + 1}`);
    }

    return stops.slice(0, 4); // A–D lang
}

/*function buildRouteStops(trip) {
    const dayStops = trip.days.map((day, index) => {
        const highlight = day.activities[2] || day.activities[0];
        return `Day ${index + 1}: ${highlight?.title || day.title}`;
    });

    return dayStops.slice(0, 6);
}*/

function buildTransportOptions(trip) {
    const destinationModes = {
        Baguio: [
            { icon: "BUS", name: "Provincial bus", detail: "Good for Manila to Baguio transfers.", estimate: "4-6 hrs" },
            { icon: "TAXI", name: "Taxi or ride-hailing", detail: "Best for city-to-city stops and hotel transfers.", estimate: "15-35 mins" },
            { icon: "WALK", name: "Walking route", detail: "Useful around parks, cafes, and Session Road.", estimate: "5-20 mins" }
        ],
        Siargao: [
            { icon: "VAN", name: "Airport van", detail: "Prototype option for airport to General Luna.", estimate: "45-60 mins" },
            { icon: "BIKE", name: "Motorbike rental", detail: "Common island option for beaches and cafes.", estimate: "Flexible" },
            { icon: "BOAT", name: "Boat transfer", detail: "For lagoons and island hopping activities.", estimate: "Half day" }
        ],
        Palawan: [
            { icon: "VAN", name: "Shared van", detail: "For airport, hotel, and port transfers.", estimate: "30-90 mins" },
            { icon: "BOAT", name: "Island boat", detail: "Used for lagoon, reef, and beach routes.", estimate: "Half day" },
            { icon: "TRI", name: "Tricycle", detail: "Short local hops around town areas.", estimate: "10-25 mins" }
        ],
        Cebu: [
            { icon: "CAR", name: "Private car", detail: "Best for city routes and mountain viewpoints.", estimate: "20-60 mins" },
            { icon: "BUS", name: "Bus or coach", detail: "Budget option for north or south Cebu day trips.", estimate: "1-4 hrs" },
            { icon: "FERRY", name: "Ferry", detail: "For island transfers and nearby coastal routes.", estimate: "1-2 hrs" }
        ],
        Boracay: [
            { icon: "BOAT", name: "Caticlan boat", detail: "Prototype transfer from port to island.", estimate: "10-20 mins" },
            { icon: "E-TRI", name: "E-tricycle", detail: "Station-to-station beach area transport.", estimate: "5-20 mins" },
            { icon: "WALK", name: "Beach walk", detail: "Best for White Beach and D'Mall routes.", estimate: "5-30 mins" }
        ],
        Batanes: [
            { icon: "VAN", name: "Tour van", detail: "Common for scenic loops and viewpoint routes.", estimate: "Half day" },
            { icon: "BIKE", name: "Bike rental", detail: "For short, slow scenic routes near town.", estimate: "Flexible" },
            { icon: "WALK", name: "Walking route", detail: "Good for village stops and lighthouse areas.", estimate: "10-30 mins" }
        ]
    };

    return destinationModes[trip.destination] || [
        { icon: "CAR", name: "Private car", detail: `Flexible option for ${trip.destination} route stops.`, estimate: "20-60 mins" },
        { icon: "BUS", name: "Public transport", detail: "Budget-friendly option for main roads and terminals.", estimate: "30-90 mins" },
        { icon: "WALK", name: "Walking route", detail: "Useful for clustered attractions and food stops.", estimate: "5-25 mins" }
    ];
}

function bindTripEditorEvents() {
    document.querySelectorAll("[data-remove-day]").forEach((button) => {
        button.addEventListener("click", () => removeDay(button.dataset.removeDay));
    });

    document.querySelectorAll("[data-remove-activity]").forEach((button) => {
        button.addEventListener("click", () => removeActivity(button.dataset.removeActivity));
    });

    document.querySelectorAll("[data-add-activity-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const dayId = form.dataset.addActivityForm;
            const title = form.elements.activityTitle.value.trim();
            addActivity(dayId, title);
            form.reset();
        });
    });

    document.querySelectorAll("[data-activity-id]").forEach((item) => {
        item.addEventListener("dragstart", () => {
            state.draggedActivityId = item.dataset.activityId;
            item.classList.add("dragging");
        });

        item.addEventListener("dragend", () => {
            state.draggedActivityId = null;
            item.classList.remove("dragging");
            document.querySelectorAll(".activity-item").forEach((node) => node.classList.remove("drop-target"));
        });

        item.addEventListener("dragover", (event) => {
            event.preventDefault();
            item.classList.add("drop-target");
        });

        item.addEventListener("dragleave", () => item.classList.remove("drop-target"));

        item.addEventListener("drop", (event) => {
            event.preventDefault();
            item.classList.remove("drop-target");
            moveActivityBefore(state.draggedActivityId, item.dataset.dayParent, item.dataset.activityId);
        });
    });

    document.querySelectorAll("[data-day-dropzone]").forEach((zone) => {
        zone.addEventListener("dragover", (event) => event.preventDefault());
        zone.addEventListener("drop", (event) => {
            event.preventDefault();
            if (event.target === zone) {
                moveActivityToDayEnd(state.draggedActivityId, zone.dataset.dayDropzone);
            }
        });
    });
}

function renderSavedTrips() {
    if (!refs.savedTrips) {
        return;
    }

    if (!state.savedTrips.length) {
        refs.savedTrips.innerHTML = `
            <div class="empty-state compact">
                <h3>No saved plans</h3>
                <p>Save a generated itinerary to build your travel planning portfolio.</p>
            </div>
        `;
        return;
    }

    refs.savedTrips.innerHTML = state.savedTrips.map((trip) => `
        <article class="saved-card">
            <header>
                <div>
                    <p class="eyebrow">${trip.destination}</p>
                    <h3>${trip.title}</h3>
                </div>
                <span class="pill">${trip.plan}</span>
            </header>
            <p class="trip-meta">${trip.summary}</p>
            <p>${trip.dateLabel}</p>
            <div class="trip-actions">
                <button class="btn secondary" type="button" data-load-trip="${trip.id}">Load</button>
                <button class="btn secondary" type="button" data-share-trip="${trip.id}">Share</button>
                <button class="btn ghost" type="button" data-delete-trip="${trip.id}">Delete</button>
            </div>
        </article>
    `).join("");

    document.querySelectorAll("[data-load-trip]").forEach((button) => {
        button.addEventListener("click", () => loadSavedTrip(button.dataset.loadTrip));
    });

    document.querySelectorAll("[data-share-trip]").forEach((button) => {
        button.addEventListener("click", () => shareSavedTrip(button.dataset.shareTrip));
    });

    document.querySelectorAll("[data-delete-trip]").forEach((button) => {
        button.addEventListener("click", () => deleteSavedTrip(button.dataset.deleteTrip));
    });
}

function readPlannerInput() {
    const isPremium = state.subscription.plan === "premium";
    return {
        destination: refs.destination.value.trim(),
        startDate: refs.startDate.value,
        endDate: refs.endDate.value,
        budget: Number(refs.budget.value || 0),
        duration: refs.duration.value,
        travelerType: refs.travelerType.value,
        mood: refs.mood.value,
        behavior: isPremium ? refs.behavior.value : "Balanced",
        lifestyle: isPremium ? refs.lifestyle.value : (state.profile.lifestyle || "Budget"),
        purpose: isPremium ? refs.purpose.value : "Vacation",
        premiumApplied: isPremium
    };
}

function buildTrip(input) {
    const totalDays = computeTripDays(input.startDate, input.endDate, input.duration);
    const catalog = getDestinationData(input.destination);
    const schedule = behaviorStyles[input.behavior];
    const budgetBand = resolveBudgetBand(input.budget);
    const dates = buildDateList(input.startDate, totalDays);
    const travelerSummary = travelerNotes[input.travelerType];
    const planNote = input.premiumApplied
        ? `${lifestyleNotes[input.lifestyle]} | ${purposeNotes[input.purpose]}`
        : "Free mode using core filters, realistic routing, and basic planning intelligence";

    const days = dates.map((date, dayIndex) => buildDayPlan({
        date,
        dayIndex,
        totalDays,
        input,
        catalog,
        schedule,
        budgetBand,
        travelerSummary
    }));

    return {
        id: createId("trip"),
        destination: toTitleCase(input.destination),
        durationLabel: `${totalDays} day${totalDays > 1 ? "s" : ""}`,
        dateLabel: `${formatReadableDate(input.startDate)} to ${formatReadableDate(dates[dates.length - 1])}`,
        travelerType: input.travelerType,
        mood: input.mood,
        plan: state.subscription.plan,
        title: `${toTitleCase(input.destination)} ${totalDays}-day itinerary`,
        summary: planNote,
        planNote,
        budgetBand,
        routeLogic: schedule.label,
        travelerSummary,
        destinationNote: catalog.logistics,
        days
    };
}

function buildDayPlan({ date, dayIndex, totalDays, input, catalog, schedule, budgetBand, travelerSummary }) {
    const attractionPool = [...catalog.attractions];
    const moodPool = moodTemplates[input.mood] || moodTemplates.Relaxing;
    const dayLabel = dayIndex === 0 ? "Arrival and local orientation" : dayIndex === totalDays - 1 ? "Wrap-up and departure rhythm" : "Core exploration day";

    const activities = schedule.times.map((time, slotIndex) => {
        const attraction = attractionPool[(dayIndex + slotIndex) % attractionPool.length];
        const moodText = moodPool[slotIndex % moodPool.length];

        return {
            id: createId("activity"),
            time,
            title: buildRealisticTitle({
                slotIndex,
                dayIndex,
                totalDays,
                attraction,
                moodText,
                destination: input.destination,
                purpose: input.purpose
            }),
            detail: buildActivityDetail({
                input,
                budgetBand,
                travelerSummary,
                attraction,
                moodText,
                catalog,
                slotIndex
            })
        };
    });

    return {
        id: createId("day"),
        title: formatReadableDate(date),
        note: `${dayLabel} | ${schedule.label}`,
        activities
    };
}

function buildRealisticTitle({ slotIndex, dayIndex, totalDays, attraction, moodText, destination, purpose }) {
    if (dayIndex === 0 && slotIndex === 0) {
        return `Arrival in ${toTitleCase(destination)} and hotel check-in`;
    }

    if (dayIndex === totalDays - 1 && slotIndex === 4) {
        return `Departure prep and final stop in ${toTitleCase(destination)}`;
    }

    if (purpose === "Business" && slotIndex === 1) {
        return "Work block or business meeting window";
    }

    if (slotIndex === 2) {
        return attraction;
    }

    return toTitleCase(moodText);
}

function buildActivityDetail({ input, budgetBand, travelerSummary, attraction, moodText, catalog, slotIndex }) {
    const details = [
        `${travelerSummary}.`,
        `${budgetBand}.`,
        `${catalog.logistics}.`,
        `Suggested focus: ${attraction.toLowerCase()}.`,
        `Mood cue: ${moodText}.`
    ];

    if (slotIndex === 3 && catalog.food.length) {
        return `Dining suggestion: ${catalog.food[slotIndex % catalog.food.length]}.`;
    }

    if (slotIndex === 1 && state.profile.notes) {
        return `Profile note considered: ${state.profile.notes}.`;
    }

    if (input.premiumApplied && slotIndex === 4) {
        return `${lifestyleNotes[input.lifestyle]}. ${purposeNotes[input.purpose]}.`;
    }

    return details[slotIndex % details.length];
}

function addManualDay() {
    if (!state.currentTrip) {
        return;
    }

    state.currentTrip.days.push({
        id: createId("day"),
        title: `Custom Day ${state.currentTrip.days.length + 1}`,
        note: "Manually added day for custom planning",
        activities: [
            {
                id: createId("activity"),
                time: "09:00",
                title: "Custom attraction block",
                detail: "Add your own meeting, attraction, or transport segment."
            }
        ]
    });

    state.currentTrip.durationLabel = `${state.currentTrip.days.length} days`;
    renderCurrentTrip();
    toast("New day added to the itinerary.");
}

function removeDay(dayId) {
    if (!state.currentTrip || state.currentTrip.days.length <= 1) {
        toast("The itinerary needs at least one day.");
        return;
    }

    state.currentTrip.days = state.currentTrip.days.filter((day) => day.id !== dayId);
    state.currentTrip.durationLabel = `${state.currentTrip.days.length} days`;
    renderCurrentTrip();
    toast("Day removed.");
}

function addActivity(dayId, title) {
    if (!title || !state.currentTrip) {
        return;
    }

    const day = state.currentTrip.days.find((entry) => entry.id === dayId);
    if (!day) {
        return;
    }

    day.activities.push({
        id: createId("activity"),
        time: suggestNextTime(day.activities),
        title,
        detail: "Manual custom activity"
    });

    renderCurrentTrip();
    toast("Activity added.");
}

function removeActivity(activityId) {
    if (!state.currentTrip) {
        return;
    }

    state.currentTrip.days.forEach((day) => {
        day.activities = day.activities.filter((activity) => activity.id !== activityId);
    });

    renderCurrentTrip();
    toast("Activity removed.");
}

function moveActivityBefore(activityId, targetDayId, beforeActivityId) {
    if (!activityId || !state.currentTrip) {
        return;
    }

    const activity = detachActivity(activityId);
    const targetDay = state.currentTrip.days.find((day) => day.id === targetDayId);
    if (!activity || !targetDay) {
        return;
    }

    const targetIndex = targetDay.activities.findIndex((item) => item.id === beforeActivityId);
    targetDay.activities.splice(targetIndex >= 0 ? targetIndex : targetDay.activities.length, 0, activity);
    renderCurrentTrip();
}

function moveActivityToDayEnd(activityId, targetDayId) {
    if (!activityId || !state.currentTrip) {
        return;
    }

    const activity = detachActivity(activityId);
    const targetDay = state.currentTrip.days.find((day) => day.id === targetDayId);
    if (!activity || !targetDay) {
        return;
    }

    targetDay.activities.push(activity);
    renderCurrentTrip();
}

function detachActivity(activityId) {
    for (const day of state.currentTrip.days) {
        const index = day.activities.findIndex((activity) => activity.id === activityId);
        if (index >= 0) {
            return day.activities.splice(index, 1)[0];
        }
    }
    return null;
}

function saveCurrentTrip() {
    if (!state.currentTrip) {
        return;
    }

    const saved = structuredClone(state.currentTrip);
    const existingIndex = state.savedTrips.findIndex((trip) => trip.id === saved.id);

    if (existingIndex >= 0) {
        state.savedTrips[existingIndex] = saved;
    } else {
        state.savedTrips.unshift(saved);
    }

    persist(STORAGE_KEYS.savedTrips, state.savedTrips);
    renderPlannerState();
    toast("Travel plan saved locally.");
}

function loadSavedTrip(tripId) {
    const trip = state.savedTrips.find((entry) => entry.id === tripId);
    if (!trip) {
        return;
    }

    state.currentTrip = structuredClone(trip);
    renderCurrentTrip();
    document.getElementById("itinerarySection")?.scrollIntoView({ behavior: "smooth" });
    toast(`Loaded saved trip for ${trip.destination}.`);
}

function deleteSavedTrip(tripId) {
    state.savedTrips = state.savedTrips.filter((trip) => trip.id !== tripId);
    persist(STORAGE_KEYS.savedTrips, state.savedTrips);
    renderPlannerState();
    toast("Saved trip deleted.");
}

async function shareCurrentTrip() {
    if (!state.currentTrip) {
        return;
    }

    await copyTripLink(state.currentTrip);
}

async function shareSavedTrip(tripId) {
    const trip = state.savedTrips.find((entry) => entry.id === tripId);
    if (!trip) {
        return;
    }

    await copyTripLink(trip);
}

async function copyTripLink(trip) {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(trip))));
    const url = `${window.location.origin}${window.location.pathname}#trip=${payload}`;

    try {
        await navigator.clipboard.writeText(url);
        toast("Share link copied to clipboard.");
    } catch (error) {
        window.prompt("Copy this share link:", url);
    }
}

function hydrateSharedTrip() {
    const hash = window.location.hash || "";
    if (!hash.startsWith("#trip=")) {
        return;
    }

    try {
        const payload = hash.replace("#trip=", "");
        const trip = JSON.parse(decodeURIComponent(escape(atob(payload))));
        state.currentTrip = trip;
    } catch (error) {
        console.warn("Unable to load shared trip.", error);
    }
}

function downloadCurrentTrip() {
    if (!state.currentTrip) {
        return;
    }

    window.print();
    toast("Use your browser's Save as PDF option.");
}

function fillSampleTrip() {
    refs.destination.value = "Palawan";
    refs.budget.value = "32000";
    refs.travelerType.value = state.profile.travelerType || "Couple";
    refs.mood.value = state.profile.mood || "Relaxing";
    refs.behavior.value = "Balanced";
    refs.lifestyle.value = state.profile.lifestyle || "Mid-range";
    refs.purpose.value = "Vacation";
    refs.duration.value = "4-7 days";

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 10);
    const end = new Date(start);
    end.setDate(start.getDate() + 4);

    refs.startDate.value = toDateInputValue(start);
    refs.endDate.value = toDateInputValue(end);
    state.currentTrip = null;
    renderCurrentTrip();
    renderRoutePreviewForDestination("Palawan");
    toast("Sample trip loaded.");
}

function upgradeToPremium() {
    state.subscription.plan = "premium";
    persist(STORAGE_KEYS.subscription, state.subscription);
    renderPlannerState();
    toast("Upgraded to Premium.");
}

function downgradeToFree() {
    state.subscription.plan = "free";
    persist(STORAGE_KEYS.subscription, state.subscription);
    renderPlannerState();
    toast("Switched to Free plan.");
}

function mockGoogleLogin() {
    state.session = {
        name: "Pack & Plot Traveler",
        email: "google.user@packandplot.com",
        mode: "login",
        loginProvider: "google"
    };
    persist(STORAGE_KEYS.session, state.session);

    state.profile = {
        ...state.profile,
        name: state.profile.name || "Pack & Plot Traveler",
        email: state.profile.email || "google.user@packandplot.com",
        travelerType: state.profile.travelerType || "Solo",
        lifestyle: state.profile.lifestyle || "Mid-range",
        mood: state.profile.mood || "Culture"
    };
    persist(STORAGE_KEYS.profile, state.profile);

    toast("Google login successful.");

    if (state.page === "login" || state.page === "signup") {
        window.setTimeout(() => {
            window.location.href = "planner.html";
        }, 700);
        return;
    }

    if (state.page === "planner") {
        restoreProfileForm();
        renderPlannerState();
    }
}

function logout() {
    state.session = null;
    persist(STORAGE_KEYS.session, null);
    toast("Logged out. Local trips and profile remain in this browser.");
    window.setTimeout(() => {
        window.location.href = "login.html";
    }, 700);
}

function restoreProfileForm() {
    if (!refs.profileForm) {
        return;
    }

    refs.profileName.value = state.profile.name || "";
    refs.profileEmail.value = state.profile.email || "";
    refs.profileHomeBase.value = state.profile.homeBase || "";
    refs.profileTravelerType.value = state.profile.travelerType || "Solo";
    refs.profileLifestyle.value = state.profile.lifestyle || "Budget";
    refs.profileMood.value = state.profile.mood || "Relaxing";
    refs.profileNotes.value = state.profile.notes || "";
}

function seedPlannerDefaults() {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() + 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 3);

    if (refs.startDate && !refs.startDate.value) {
        refs.startDate.value = toDateInputValue(start);
    }
    if (refs.endDate && !refs.endDate.value) {
        refs.endDate.value = toDateInputValue(end);
    }
    if (refs.travelerType && state.profile.travelerType) {
        refs.travelerType.value = state.profile.travelerType;
    }
    if (refs.mood && state.profile.mood) {
        refs.mood.value = state.profile.mood;
    }
    if (refs.lifestyle && state.profile.lifestyle) {
        refs.lifestyle.value = state.profile.lifestyle;
    }

    renderRoutePreviewForDestination(refs.destination?.value || "");
}

function syncPremiumUI() {
    ["behavior", "lifestyle", "purpose"].forEach((id) => {
        const field = refs[id];
        if (!field) {
            return;
        }

        field.title = state.subscription.plan === "premium"
            ? ""
            : "Advanced filter preview. Upgrade to Premium to fully unlock this filter.";
    });
}

function resetMonthlyUsageIfNeeded() {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    if (state.usage.month !== monthKey) {
        state.usage = { month: monthKey, count: 0 };
        persist(STORAGE_KEYS.usage, state.usage);
    }
}

function incrementUsage() {
    state.usage.count += 1;
    persist(STORAGE_KEYS.usage, state.usage);
}

function getDestinationData(destination) {
    const normalized = toTitleCase(destination);
    return destinationCatalog[normalized] || {
        tags: ["Relaxing", "Culture"],
        attractions: [
            `${normalized} city center walk`,
            `${normalized} local market visit`,
            `${normalized} scenic viewpoint`,
            `${normalized} signature food stop`,
            `${normalized} museum or heritage site`,
            `${normalized} sunset leisure block`
        ],
        food: ["local tasting stop", "signature lunch", "recommended dinner block"],
        logistics: `Clustered planning around key areas in ${normalized}`
    };
}

function resolveBudgetBand(budget) {
    if (budget >= 50000) {
        return "High budget, premium convenience fit";
    }
    if (budget >= 25000) {
        return "Mid-range budget with comfort and flexibility";
    }
    return "Budget-sensitive plan with practical spending";
}

function computeTripDays(startDate, endDate, durationLabel) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.round((end - start) / 86400000) + 1;

    if (Number.isFinite(diff) && diff > 0) {
        return diff;
    }

    if (durationLabel === "1-3 days") {
        return 3;
    }
    if (durationLabel === "4-7 days") {
        return 5;
    }
    if (durationLabel === "8-14 days") {
        return 10;
    }
    return 15;
}

function buildDateList(startDate, totalDays) {
    const results = [];
    const base = new Date(startDate);

    for (let index = 0; index < totalDays; index += 1) {
        const current = new Date(base);
        current.setDate(base.getDate() + index);
        results.push(toDateInputValue(current));
    }

    return results;
}

function suggestNextTime(activities) {
    const last = activities[activities.length - 1];
    if (!last) {
        return "09:00";
    }

    const [hours, minutes] = last.time.split(":").map(Number);
    const next = new Date();
    next.setHours(hours + 2, minutes || 0, 0, 0);
    return `${String(next.getHours()).padStart(2, "0")}:${String(next.getMinutes()).padStart(2, "0")}`;
}

function formatReadableDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(date);
}

function toDateInputValue(date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function toTitleCase(value) {
    return String(value || "")
        .toLowerCase()
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function persist(key, value) {
    if (value === null) {
        localStorage.removeItem(key);
        return;
    }

    localStorage.setItem(key, JSON.stringify(value));
}

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.warn(`Unable to load ${key}`, error);
        return fallback;
    }
}

function createId(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

let toastTimer;

function toast(message) {
    if (!refs.toast) {
        return;
    }

    refs.toast.textContent = message;
    refs.toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
        refs.toast.classList.remove("show");
    }, 2400);
}

// added today 5/28
window.addEventListener("DOMContentLoaded", () => {
    const raw = localStorage.getItem("pendingMarketplaceItem");
    if (!raw) return;

    const item = JSON.parse(raw);
    localStorage.removeItem("pendingMarketplaceItem");

    if (!state.currentTrip) {
        state.currentTrip = {
            id: createId("trip"),
            destination: "Marketplace Booking",
            durationLabel: "1 day",
            dateLabel: "Today",
            travelerType: "Solo",
            mood: "Relaxing",
            plan: "free",
            title: "Marketplace Trip",
            summary: "Auto created from marketplace",
            planNote: "Marketplace injected",
            routeLogic: "Manual",
            travelerSummary: "Solo traveler",
            destinationNote: "Marketplace booking",
            budgetBand: "1,000",
            days: [{
                id: createId("day"),
                title: "Day 1",
                note: "Marketplace Day",
                activities: []
            }]
        };
    }

   const activities = generateMarketplaceActivities(item);

    state.currentTrip.days[0].activities.push(...activities);

    renderPlannerState();

    toast("Added marketplace booking!");
});
