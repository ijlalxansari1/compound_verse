'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Domain,
    MicroAction,
    getDomains,
    getActiveDomains,
    canAddDomain,
    addDomain,
    archiveDomain,
    restoreDomain,
    toggleDomainXP,
    updateDomainItems,
    getArchivedDomains,
    deleteDomain,
    getActiveDomainCount
} from '@/lib/domains';

const DOMAIN_ICONS = ['🎯', '📚', '🎨', '🏃', '💡', '🌱', '🎵', '✍️', '🧘', '💪'];
const DOMAIN_COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1'];

interface DomainManagerProps {
    onDomainsChange?: () => void;
}

export default function DomainManager({ onDomainsChange }: DomainManagerProps) {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [archivedDomains, setArchivedDomains] = useState<Domain[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [editingDomain, setEditingDomain] = useState<string | null>(null);

    // Form state
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('🎯');
    const [newIntention, setNewIntention] = useState('');
    const [newColor, setNewColor] = useState('#8b5cf6');
    const [newItems, setNewItems] = useState<string[]>(['']);

    useEffect(() => {
        loadDomains();
    }, []);

    const loadDomains = () => {
        setDomains(getActiveDomains());
        setArchivedDomains(getArchivedDomains());
    };

    const handleAddDomain = () => {
        if (!newName.trim()) return;

        const items: MicroAction[] = newItems
            .filter(item => item.trim())
            .map((item, i) => ({
                id: `item_${Date.now()}_${i}`,
                label: item.trim()
            }));

        const result = addDomain(
            newName.trim(),
            newIcon,
            newIntention.trim() || 'Custom domain',
            items,
            newColor
        );

        if (result) {
            setNewName('');
            setNewIcon('🎯');
            setNewIntention('');
            setNewItems(['']);
            setShowAddForm(false);
            loadDomains();
            onDomainsChange?.();
        }
    };

    const handleArchive = (domainId: string) => {
        if (archiveDomain(domainId)) {
            loadDomains();
            onDomainsChange?.();
        }
    };

    const handleRestore = (domainId: string) => {
        if (restoreDomain(domainId)) {
            loadDomains();
            onDomainsChange?.();
        }
    };

    const handleDelete = (domainId: string) => {
        if (confirm('Delete this domain permanently?')) {
            if (deleteDomain(domainId)) {
                loadDomains();
                onDomainsChange?.();
            }
        }
    };

    const handleToggleXP = (domainId: string) => {
        toggleDomainXP(domainId);
        loadDomains();
        onDomainsChange?.();
    };

    const addItemField = () => {
        setNewItems([...newItems, '']);
    };

    const updateItemField = (index: number, value: string) => {
        const updated = [...newItems];
        updated[index] = value;
        setNewItems(updated);
    };

    const activeCount = getActiveDomainCount();
    const canAdd = canAddDomain();

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#8b949e]">
                    Domains ({activeCount}/5)
                </h3>
                {canAdd && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="text-sm text-[#1cb0f6] hover:underline"
                    >
                        {showAddForm ? 'Cancel' : '+ Add Domain'}
                    </button>
                )}
            </div>

            {/* Add Domain Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card rounded-2xl p-4 space-y-4"
                    >
                        <div>
                            <label className="text-xs text-[#6e7681] block mb-2">Name</label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="Recovery, Creativity, etc."
                                className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1cb0f6]"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#6e7681] block mb-2">Icon</label>
                            <div className="flex flex-wrap gap-2">
                                {DOMAIN_ICONS.map((icon) => (
                                    <button
                                        key={icon}
                                        onClick={() => setNewIcon(icon)}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${newIcon === icon
                                                ? 'bg-[#1cb0f6]/20 border-2 border-[#1cb0f6]'
                                                : 'bg-[#161b22] border border-[#30363d]'
                                            }`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-[#6e7681] block mb-2">Color</label>
                            <div className="flex gap-2">
                                {DOMAIN_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setNewColor(color)}
                                        className={`w-8 h-8 rounded-full ${newColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1117]' : ''
                                            }`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-[#6e7681] block mb-2">Intention (optional)</label>
                            <input
                                type="text"
                                value={newIntention}
                                onChange={(e) => setNewIntention(e.target.value)}
                                placeholder="Why this domain matters to you"
                                className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1cb0f6]"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-[#6e7681] block mb-2">Micro-actions</label>
                            {newItems.map((item, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    value={item}
                                    onChange={(e) => updateItemField(i, e.target.value)}
                                    placeholder="Quick action (under 2 min)"
                                    className="w-full bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1cb0f6] mb-2"
                                />
                            ))}
                            <button
                                onClick={addItemField}
                                className="text-xs text-[#6e7681] hover:text-[#1cb0f6]"
                            >
                                + Add action
                            </button>
                        </div>

                        <button
                            onClick={handleAddDomain}
                            disabled={!newName.trim()}
                            className="w-full py-2 rounded-lg bg-[#1cb0f6] text-white font-medium disabled:opacity-50"
                        >
                            Create Domain
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Domains */}
            <div className="space-y-2">
                {domains.map((domain) => (
                    <motion.div
                        key={domain.id}
                        className="glass-card rounded-xl p-3 flex items-center gap-3"
                        style={{ borderLeft: `4px solid ${domain.color}` }}
                    >
                        <span className="text-2xl">{domain.icon}</span>
                        <div className="flex-1">
                            <div className="font-medium text-sm">{domain.name}</div>
                            <div className="text-xs text-[#6e7681]">{domain.intention}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* XP Toggle */}
                            <button
                                onClick={() => handleToggleXP(domain.id)}
                                className={`text-xs px-2 py-1 rounded ${domain.xpEnabled
                                        ? 'bg-[#58cc02]/20 text-[#58cc02]'
                                        : 'bg-[#30363d] text-[#6e7681]'
                                    }`}
                                title={domain.xpEnabled ? 'XP enabled' : 'XP disabled'}
                            >
                                XP {domain.xpEnabled ? 'ON' : 'OFF'}
                            </button>
                            {/* Archive (only custom domains) */}
                            {!domain.isCore && (
                                <button
                                    onClick={() => handleArchive(domain.id)}
                                    className="text-xs text-[#6e7681] hover:text-[#ff4b4b]"
                                    title="Archive"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Archived Domains */}
            {archivedDomains.length > 0 && (
                <div>
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="text-sm text-[#6e7681] hover:text-[#8b949e]"
                    >
                        {showArchived ? '▼' : '▶'} Archived ({archivedDomains.length})
                    </button>

                    <AnimatePresence>
                        {showArchived && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 space-y-2"
                            >
                                {archivedDomains.map((domain) => (
                                    <div
                                        key={domain.id}
                                        className="glass-card rounded-xl p-3 flex items-center gap-3 opacity-60"
                                    >
                                        <span className="text-xl">{domain.icon}</span>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{domain.name}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRestore(domain.id)}
                                                disabled={!canAdd}
                                                className="text-xs text-[#58cc02] hover:underline disabled:opacity-50"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => handleDelete(domain.id)}
                                                className="text-xs text-[#ff4b4b] hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* Info message */}
            <p className="text-xs text-[#6e7681] text-center">
                Archiving removes zero XP or progress. Domains can be restored anytime.
            </p>
        </div>
    );
}
