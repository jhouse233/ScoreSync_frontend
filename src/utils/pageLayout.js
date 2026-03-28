export function layout(measures = [], settings = DEFAULT_LAYOUT) {
    const metrics = computeMetrics(settings);
    const systems = packIntoSystems(measures, metrics);
    const pages = paginateSystems(systems, metrics);
    return { pages, metrics };
}

export const DEFAULT_LAYOUT = {
    pageWidth: 1000,
    pageHeight: Math.round(1000 * 11 / 8.5),

    marginLeft: 64,
    marginRight: 64,
    marginTop: 72,
    marginBottom: 72,

    systemHeight: 150,
    systemGap: 56,

    minMeasureWidth: 120,
    maxMeasureWidth: 320,

    maxMeasurePerSystem: 2,
};

export function estimateMeasureWidth(m, metrics) {
    let base = metrics.minMeasureWidth;

    const noteCount = Number(m.noteCount ?? 0);
    base += Math.min(1, noteCount / 8) * 
        (metrics.maxMeasureWidth - metrics.minMeasureWidth) * 0.6;

    if (m.hasManyAccidentals) base += 40;
    if (m.hasTuplets) base += 30;
    if (m.hasLyrics) base += 80;

    return clamp(Math.round(base), metrics.minMeasureWidth, metrics.maxMeasureWidth);
}

function computeMetrics(s) {
    const pageInnerWidth = Math.max(0, s.pageWidth - s.marginLeft - s.marginRight);
    const pageInnerHeight = Math.max(0, s.pageHeight - s.marginTop - s.marginBottom);

    const systemsPerPage = Math.max(
        1,
        Math.floor((pageInnerHeight + s.systemGap) / (s.systemHeight + s.systemGap))
    );

    return { ...s, pageInnerWidth, pageInnerHeight, systemsPerPage };
}

function packIntoSystems(measures, metrics) {
    const systems = [];
    let current = newSystem();

    for (const m of measures) {
        let width = estimateMeasureWidth(m, metrics);

        if (current.measures.length === 0 && width > metrics.pageInnerWidth) {
            width = metrics.pageInnerWidth;
        }

        const wouldOverflow = current.totalWidth + width > metrics.pageInnerWidth;
        const mustWrap = (wouldOverflow && current.measures.length > 0);

        const countLimit = Number(metrics.maxMeasurePerSystem || 0);
        const hitCountLimit = countLimit > 0 && current.measures.length > countLimit;

        if (mustWrap || hitCountLimit) {
            systems.push(justifySystem(current, metrics.pageInnerWidth));
            current = newSystem();
        }

        current.measures.push({ ...m, width });
        current.totalWidth += width;

        if (m.isSystemBreak) {
            systems.push(justifySystem(current, metrics.pageInnerWidth));
            current = newSystem()
        }
    }

    if (current.measures.length) {
        systems.push(justifySystem(current, metrics.pageInnerWidth));
    }

    return systems;
}

function paginateSystems(systems, metrics) {
    const pages = [];
    for (let i = 0; i < systems.length; i += metrics.systemsPerPage) {
        pages.push({ systems: systems.slice(i, i + metrics.systemsPerPage) });
    }
    return pages;
}

function justifySystem(system, lineWidth) {
    const sum = system.measures.reduce((s, m) => s + m.width, 0);
    const extra = Math.max(0, lineWidth - sum);
    const add = system.measures.length > 1 ? (extra / system.measures.length) : 0;

    let x = 0;
    const measures = system.measures.map((m) => {
        const w = m.width + add;
        const out = { ...m, x, width: w };
        x += w;
        return out;
    });

    return { measures, totalWidth: lineWidth };
}

function newSystem() {
    return { measures: [], totalWidth: 0 };
}

function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

