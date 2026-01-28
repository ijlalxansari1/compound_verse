// ========================================
// Compoundverse - Dynamic Domain System
// Extensible domains with zero-penalty archiving
// ========================================

export interface MicroAction {
    id: string;
    label: string;
}

export interface Domain {
    id: string;
    name: string;
    icon: string;
    intention: string;       // User's reason for this domain
    enabled: boolean;
    xpEnabled: boolean;      // Default: false for custom domains
    items: MicroAction[];    // User-defined actions
    archived: boolean;       // Can archive without penalty
    isCore: boolean;         // Core domains cannot be deleted
    color: string;           // Domain accent color
    createdAt: string;
}

const DOMAINS_KEY = 'compoundverse_domains';
const MAX_ACTIVE_DOMAINS = 5;

// Default core domains (always present)
const DEFAULT_DOMAINS: Domain[] = [
    {
        id: 'health',
        name: 'Health',
        icon: '💪',
        intention: 'Body, movement, recovery',
        enabled: true,
        xpEnabled: true,
        items: [
            { id: 'pushups', label: 'Push-ups (any amount)' },
            { id: 'walk', label: 'Walk (10+ minutes)' },
            { id: 'norelapse', label: 'No relapse today' }
        ],
        archived: false,
        isCore: true,
        color: '#58cc02',
        createdAt: new Date().toISOString()
    },
    {
        id: 'faith',
        name: 'Faith',
        icon: '✨',
        intention: 'Reflection, gratitude, grounding',
        enabled: true,
        xpEnabled: true,
        items: [
            { id: 'tasbih', label: 'Tasbih (any count)' },
            { id: 'reflection', label: 'Quiet reflection' },
            { id: 'gratitude', label: 'Gratitude (1 blessing)' }
        ],
        archived: false,
        isCore: true,
        color: '#ffc800',
        createdAt: new Date().toISOString()
    },
    {
        id: 'career',
        name: 'Career',
        icon: '🧠',
        intention: 'Skill-building, study, cognitive growth',
        enabled: true,
        xpEnabled: true,
        items: [
            { id: 'de', label: 'Data Engineering lesson' },
            { id: 'german', label: 'German lesson' },
            { id: 'reading', label: 'Read 10 pages' },
            { id: 'learning', label: 'Learned 1 positive thing' }
        ],
        archived: false,
        isCore: true,
        color: '#1cb0f6',
        createdAt: new Date().toISOString()
    }
];

/**
 * Get all domains from storage
 */
export function getDomains(): Domain[] {
    if (typeof window === 'undefined') return DEFAULT_DOMAINS;

    const stored = localStorage.getItem(DOMAINS_KEY);
    if (stored) {
        const domains = JSON.parse(stored) as Domain[];
        // Ensure core domains exist
        const coreIds = DEFAULT_DOMAINS.map(d => d.id);
        const storedIds = domains.map(d => d.id);

        for (const coreDomain of DEFAULT_DOMAINS) {
            if (!storedIds.includes(coreDomain.id)) {
                domains.unshift(coreDomain);
            }
        }
        return domains;
    }
    return [...DEFAULT_DOMAINS];
}

/**
 * Save domains to storage
 */
export function saveDomains(domains: Domain[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DOMAINS_KEY, JSON.stringify(domains));
}

/**
 * Get only active (non-archived) domains
 */
export function getActiveDomains(): Domain[] {
    return getDomains().filter(d => !d.archived && d.enabled);
}

/**
 * Get count of active domains
 */
export function getActiveDomainCount(): number {
    return getActiveDomains().length;
}

/**
 * Check if user can add more domains
 */
export function canAddDomain(): boolean {
    return getActiveDomainCount() < MAX_ACTIVE_DOMAINS;
}

/**
 * Add a new custom domain
 */
export function addDomain(
    name: string,
    icon: string,
    intention: string,
    items: MicroAction[] = [],
    color: string = '#8b5cf6'
): Domain | null {
    if (!canAddDomain()) {
        return null; // Max domains reached
    }

    const domains = getDomains();
    const newDomain: Domain = {
        id: `custom_${Date.now()}`,
        name,
        icon,
        intention,
        enabled: true,
        xpEnabled: false, // Custom domains don't grant XP by default
        items: items.length > 0 ? items : [{ id: 'default', label: 'Did something' }],
        archived: false,
        isCore: false,
        color,
        createdAt: new Date().toISOString()
    };

    domains.push(newDomain);
    saveDomains(domains);
    return newDomain;
}

/**
 * Archive a domain (zero penalty)
 */
export function archiveDomain(domainId: string): boolean {
    const domains = getDomains();
    const domain = domains.find(d => d.id === domainId);

    if (!domain) return false;
    if (domain.isCore) return false; // Core domains cannot be archived

    domain.archived = true;
    domain.enabled = false;
    saveDomains(domains);
    return true;
}

/**
 * Restore an archived domain
 */
export function restoreDomain(domainId: string): boolean {
    if (!canAddDomain()) return false;

    const domains = getDomains();
    const domain = domains.find(d => d.id === domainId);

    if (!domain) return false;

    domain.archived = false;
    domain.enabled = true;
    saveDomains(domains);
    return true;
}

/**
 * Toggle XP for a domain
 */
export function toggleDomainXP(domainId: string): boolean {
    const domains = getDomains();
    const domain = domains.find(d => d.id === domainId);

    if (!domain) return false;

    domain.xpEnabled = !domain.xpEnabled;
    saveDomains(domains);
    return domain.xpEnabled;
}

/**
 * Update domain items (micro-actions)
 */
export function updateDomainItems(domainId: string, items: MicroAction[]): boolean {
    const domains = getDomains();
    const domain = domains.find(d => d.id === domainId);

    if (!domain) return false;

    domain.items = items;
    saveDomains(domains);
    return true;
}

/**
 * Update domain settings
 */
export function updateDomain(
    domainId: string,
    updates: Partial<Pick<Domain, 'name' | 'icon' | 'intention' | 'color'>>
): boolean {
    const domains = getDomains();
    const domain = domains.find(d => d.id === domainId);

    if (!domain) return false;

    Object.assign(domain, updates);
    saveDomains(domains);
    return true;
}

/**
 * Get a specific domain by ID
 */
export function getDomainById(domainId: string): Domain | undefined {
    return getDomains().find(d => d.id === domainId);
}

/**
 * Get archived domains
 */
export function getArchivedDomains(): Domain[] {
    return getDomains().filter(d => d.archived);
}

/**
 * Delete a custom domain permanently
 */
export function deleteDomain(domainId: string): boolean {
    const domains = getDomains();
    const domain = domains.find(d => d.id === domainId);

    if (!domain) return false;
    if (domain.isCore) return false; // Core domains cannot be deleted

    const filtered = domains.filter(d => d.id !== domainId);
    saveDomains(filtered);
    return true;
}
