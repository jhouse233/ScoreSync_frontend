export function toDateSafe(v) {
    if (!v) return null;
    if (v instanceof Date) return isNaN(+v) ? null : v;
    if (typeof v?.toDate === 'function') {
        try { const d = v.toDate(); return isNaN(+d) ? null : d; } catch { return null; }
    }
    if (typeof v === 'object' && typeof v.seconds === 'number') {
        const ms = v.seconds * 1000 + (v.nanoseconds ? v.nanoseconds / 1e6 : 0);
        const d = new Date(ms); return isNaN(+d) ? null : d; 
    }
    
    if (typeof v === 'number') { const d = new Date(v); return isNaN(+d) ? null : d; }
    if (typeof v === 'string') { const d = new Date(v); return isNaN(+d) ? null : d; }
    return null;
}

export function bestEffortDate(createdAt, clientCreatedAt) {
    return toDateSafe(createdAt) || toDateSafe(clientCreatedAt);
}

export function formatDateSafe(d, opts) {
    const date = toDateSafe(d);
    if (!date) return 'saving...';
    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short', ...(opts || {}) });
}

export function isEdited(createdAt, updatedAt) {
    const c = toDateSafe(createdAt);
    const u = toDateSafe(updatedAt);
    if (!c || !u) return false;
    return u.getTime() - c.getTime() > 2000;
}