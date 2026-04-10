window.tailwind = window.tailwind || {};
window.tailwind.config = {
    theme: {
        extend: {
            colors: {
                trail: {
                    bg: "#f4efe7",
                    sand: "#e8dfd1",
                    surface: "#fffdf9",
                    ink: "#163330",
                    muted: "#60716d",
                    line: "rgba(22, 51, 48, 0.12)",
                    accent: "#0b8b76",
                    deep: "#0a6658",
                    soft: "#d9f0ea",
                    warm: "#e6b261",
                    warmSoft: "#f8e8cd"
                }
            },
            boxShadow: {
                trail: "0 24px 60px rgba(23, 43, 40, 0.12)"
            },
            fontFamily: {
                display: ["Georgia", "Times New Roman", "serif"],
                body: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"]
            }
        }
    }
};

document.write(`
<style type="text/tailwindcss">
@layer base {
    html { @apply scroll-smooth; }
    body {
        @apply min-h-screen bg-trail-bg text-trail-ink font-body leading-relaxed;
        background-image:
            radial-gradient(circle at top left, rgba(11, 139, 118, 0.18), transparent 28%),
            radial-gradient(circle at top right, rgba(230, 178, 97, 0.16), transparent 24%),
            linear-gradient(180deg, #f6f2ea 0%, #f3ede3 100%);
    }
    a { @apply text-inherit no-underline; }
    button, input, select, textarea { font: inherit; }
}

@layer components {
    .site-header { @apply px-4 pt-5; }
    .nav-shell, .page-shell { @apply mx-auto; width: min(1200px, calc(100% - 32px)); }
    .nav-shell { @apply grid grid-cols-[auto_1fr_auto] items-center gap-5 rounded-full border border-white/50 bg-[#fffbf5]/75 px-6 py-5 shadow-trail backdrop-blur-xl; }
    .brand { @apply grid grid-cols-[auto_auto] items-center gap-3; }
    .brand-mark { @apply grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-trail-accent to-trail-deep font-extrabold text-white; }
    .brand strong { @apply font-display text-xl tracking-[-0.03em]; }
    .eyebrow, .card-label, .plan-tag { @apply text-xs font-bold uppercase tracking-[0.16em] text-trail-deep; }
    .top-nav, .nav-cta, .hero-actions, .form-actions, .section-heading, .itinerary-actions, .trip-actions { @apply flex items-center gap-3; }
    .top-nav { @apply flex-wrap justify-center; }
    .top-nav a { @apply text-sm text-trail-muted transition hover:text-trail-deep; }
    .top-nav a.is-active, .text-link { @apply font-bold text-trail-deep; }
    .btn { @apply inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-[#e7ddcf] px-5 py-3 font-bold text-trail-ink transition hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50; }
    .btn.primary { @apply bg-gradient-to-br from-trail-accent to-trail-deep text-white shadow-[0_16px_34px_rgba(11,139,118,0.24)]; }
    .btn.secondary { @apply bg-[#efe7da]; }
    .btn.ghost { @apply border border-trail-line bg-transparent; }
    .btn.full { @apply w-full; }
    .page-shell { @apply py-9 pb-16; }
    .hero-panel, .planner-hero, .planner-layout, .auth-layout, .content-grid, .feature-grid, .pricing-grid { @apply grid gap-6; }
    .hero-panel { @apply grid-cols-[1.35fr_0.8fr] items-stretch; }
    .hero-copy, .planner-hero > div { @apply py-6 pb-3; }
    .hero-panel h1, .planner-hero h1, .auth-side h1 { @apply font-display text-[clamp(2.8rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]; }
    .hero-panel h1, .planner-hero h1 { @apply max-w-[11ch] my-4; }
    .hero-text, .section-card p, .hero-copy p, .auth-side p, .section-copy, .trip-meta, .auth-footnote, .hero-metrics span, .status-grid span, .insight-card span { @apply text-trail-muted; }
    .glass-card, .section-card, .price-card, .saved-card, .day-card, .insight-card { @apply rounded-[30px] border border-white/60 bg-trail-surface/90 shadow-trail; }
    .glass-card, .section-card, .price-card { @apply p-7; }
    .hero-preview { @apply self-end; }
    .feature-list { @apply mt-5 grid list-none gap-2.5; }
    .feature-list li { @apply relative pl-5; }
    .feature-list li::before { @apply absolute left-0 top-2.5 h-2 w-2 rounded-full bg-trail-accent content-['']; }
    .hero-metrics, .status-grid, .stacked-actions, .insights-grid { @apply grid gap-4; }
    .hero-metrics { @apply mt-6 grid-cols-3; }
    .hero-metrics article, .insight-card, .feature-grid article { @apply rounded-[22px] border border-trail-line bg-white/55 p-4; }
    .hero-metrics strong, .status-grid strong, .insight-card strong, .price { @apply mt-1.5 block text-lg; }
    .content-grid, .pricing-grid { @apply mt-7 grid-cols-2; }
    .statement-card { @apply min-h-60; }
    .accent-card, .price-card.featured { @apply bg-gradient-to-b from-trail-soft/90 to-trail-surface/95; }
    .section-card { @apply mt-7; }
    .section-heading { @apply mb-5 justify-between; }
    .section-heading h2, .statement-card h2, .price-card h3, .hero-preview h2, .auth-card h2, .status-panel h2 { @apply mt-2 font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.05] tracking-[-0.03em]; }
    .feature-grid { @apply grid-cols-3; }
    .feature-grid h3 { @apply mb-2 font-bold; }
    .plan-tag, .premium-tag, .pill, .filter-chips span { @apply inline-flex w-fit items-center rounded-full px-3 py-2 text-sm font-bold; }
    .plan-tag, .pill, .filter-chips span { @apply bg-trail-soft text-trail-deep; }
    .premium-tag, .premium-chip { @apply bg-trail-warmSoft text-[#9a5c0f]; }
    .price { @apply text-4xl font-extrabold; }
    .auth-shell { @apply grid min-h-[calc(100vh-120px)] items-center; }
    .auth-layout { @apply grid-cols-[0.95fr_1.05fr] items-stretch; }
    .auth-side { @apply p-8; }
    .auth-side h1 { @apply my-4 max-w-[13ch] text-[clamp(2.3rem,4vw,3.4rem)]; }
    .auth-card { @apply self-center; }
    .auth-form, .form-grid { @apply grid grid-cols-2 gap-4; }
    label { @apply grid gap-2 text-trail-muted; }
    input, select, textarea { @apply w-full rounded-xl border border-trail-line bg-trail-surface px-4 py-3.5 text-trail-ink transition focus:-translate-y-0.5 focus:border-trail-accent focus:outline-none focus:ring-4 focus:ring-trail-accent/15; }
    textarea { @apply resize-y; }
    .full-span { @apply col-span-full; }
    .auth-footnote, .auth-switch { @apply mt-4; }
    .planner-hero { @apply grid-cols-[1.2fr_0.7fr] items-start; }
    .status-panel { @apply p-7; }
    .status-grid { @apply mt-5 grid-cols-2; }
    .planner-layout { @apply mt-7 grid-cols-[1.4fr_0.7fr] items-start; }
    .side-panel { @apply sticky top-6; }
    .section-copy { @apply max-w-[54ch]; }
    .filter-chips { @apply my-5 flex flex-wrap gap-2.5; }
    .itinerary-actions { @apply mb-5 flex-wrap; }
    .insights-grid { @apply mb-6 grid-cols-4; }
    .insight-card { @apply shadow-none; }
    .days-grid, .saved-grid { @apply grid gap-5; }
    .days-grid { @apply grid-cols-[repeat(auto-fit,minmax(280px,1fr))]; }
    .saved-grid { @apply grid-cols-[repeat(auto-fit,minmax(260px,1fr))]; }
    .day-card, .saved-card { @apply p-5; }
    .day-card header, .saved-card header, .activity-controls, .trip-actions { @apply flex items-center gap-2.5; }
    .day-card header, .saved-card header { @apply mb-4 justify-between; }
    .activity-list { @apply grid min-h-6 gap-2.5; }
    .activity-item { @apply grid grid-cols-[1fr_auto] gap-2.5 rounded-2xl border border-transparent bg-trail-sand/70 px-4 py-3; }
    .activity-copy strong { @apply block text-[0.96rem]; }
    .activity-copy span { @apply text-sm text-trail-muted; }
    .small-btn { @apply grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-[#eadfcf] text-trail-ink transition hover:-translate-y-0.5; }
    .activity-form { @apply mt-4 grid grid-cols-[1fr_auto] gap-2.5; }
    .empty-state { @apply rounded-3xl border border-dashed border-trail-ink/20 bg-white/45 px-6 py-9 text-center; }
    .compact { @apply p-6; }
    .toast { @apply fixed bottom-5 right-5 z-40 rounded-2xl bg-trail-ink/95 px-5 py-3.5 text-white opacity-0 shadow-trail transition duration-300 translate-y-28; }
    .toast.show { @apply translate-y-0 opacity-100; }
}

@layer utilities {
    .activity-item.dragging { @apply opacity-[0.45]; }
    .activity-item.drop-target { @apply border-trail-accent; }
}

@media (max-width: 1024px) {
    .hero-panel, .planner-hero, .planner-layout, .auth-layout, .content-grid, .pricing-grid { @apply grid-cols-1; }
    .feature-grid, .insights-grid { @apply grid-cols-2; }
    .side-panel { @apply static; }
}

@media (max-width: 760px) {
    .nav-shell, .page-shell { width: min(calc(100% - 20px), 100%); }
    .nav-shell, .top-nav, .nav-cta, .hero-actions, .section-heading, .form-actions, .itinerary-actions, .trip-actions { @apply flex-col items-stretch; }
    .nav-shell { @apply grid-cols-1 rounded-[28px]; }
    .auth-form, .form-grid, .status-grid, .hero-metrics, .feature-grid, .insights-grid, .activity-form { @apply grid-cols-1; }
    .glass-card, .section-card, .price-card, .day-card, .saved-card { @apply p-5; }
    .hero-panel h1, .planner-hero h1, .auth-side h1 { @apply max-w-[12ch]; }
    .activity-item { @apply grid-cols-1; }
}

@media print {
    .site-header, .planner-hero, .planner-layout, .saved-section, .itinerary-actions, .activity-form, .small-btn, .toast { display: none !important; }
    body { background: white !important; }
    .page-shell { @apply w-full p-0; }
    .section-card, .day-card, .insight-card { @apply border border-gray-300 bg-white shadow-none; }
}
</style>
`);
