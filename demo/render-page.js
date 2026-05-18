const sectionFiles = [
    './sections/leaderboard-section.html',
    './sections/progress-bar-section.html',
    './sections/countdown-section.html',
    './sections/stat-card-section.html',
    './sections/player-card-section.html',
    './sections/quest-list-section.html',
    './sections/inventory-slot-section.html',
    './sections/inventory-grid-section.html',
    './sections/badge-section.html',
    './sections/reward-card-section.html',
    './sections/reward-reveal-section.html',
    './sections/emblem-section.html'
];

async function loadSection(path) {
    const url = new URL(path, import.meta.url);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load demo section: ${url.pathname}`);
    }

    return response.text();
}

export async function renderDemoPage() {
    const demoApp = document.getElementById('demoApp');

    if (!demoApp) {
        throw new Error('Demo root element #demoApp was not found.');
    }

    const sections = await Promise.all(
        sectionFiles.map(path => loadSection(path))
    );

    demoApp.innerHTML = sections.join('\n');
}