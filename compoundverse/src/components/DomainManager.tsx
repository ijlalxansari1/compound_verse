'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Domain,
    MicroAction,
    getActiveDomains,
    canAddDomain,
    addDomain,
    archiveDomain,
    restoreDomain,
    toggleDomainXP,
    getArchivedDomains,
    deleteDomain,
    getActiveDomainCount,
    updateDomain,
    updateDomainItems
} from '@/lib/domains';
import { Input } from '@/components/ui/input'; // Assuming you have these
import { Button } from '@/components/ui/button'; // Assuming you have these
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'; // Assuming Shacdn

const DOMAIN_ICONS = ['🎯', '📚', '🎨', '🏃', '💡', '🌱', '🎵', '✍️', '🧘', '💪', '🧠', '✨', '💸', '🛠️', '🤝'];
const DOMAIN_COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#58cc02', '#ffc800', '#e11d48', '#2563eb'];

interface DomainManagerProps {
    onDomainsChange?: () => void;
    userId?: string;
}

export default function DomainManager({ onDomainsChange, userId }: DomainManagerProps) {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [archivedDomains, setArchivedDomains] = useState<Domain[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showArchived, setShowArchived] = useState(false);

    // Edit State
    const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state (Shared for Add & Edit)
    const [formData, setFormData] = useState({
        name: '',
        icon: '🎯',
        intention: '',
        color: '#8b5cf6',
        items: ['']
    });

    useEffect(() => {
        loadDomains();
    }, [userId]);

    const loadDomains = () => {
        setDomains(getActiveDomains(userId));
        setArchivedDomains(getArchivedDomains(userId));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            icon: '🎯',
            intention: '',
            color: '#8b5cf6',
            items: ['']
        });
        setEditingDomain(null);
        setShowAddForm(false);
        setIsDialogOpen(false);
    };

    const handleEditClick = (domain: Domain) => {
        setEditingDomain(domain);
        setFormData({
            name: domain.name,
            icon: domain.icon,
            intention: domain.intention,
            color: domain.color,
            items: domain.items.map(i => i.label)
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name.trim()) return;

        const items: MicroAction[] = formData.items
            .filter(item => item.trim())
            .map((item, i) => ({
                id: `item_${Date.now()}_${i}`,
                label: item.trim()
            }));

        if (editingDomain) {
            // Update existing
            updateDomain(editingDomain.id, {
                name: formData.name,
                icon: formData.icon,
                intention: formData.intention,
                color: formData.color
            }, userId);
            updateDomainItems(editingDomain.id, items, userId);
        } else {
            // Create new
            addDomain(
                formData.name.trim(),
                formData.icon,
                formData.intention.trim() || 'Custom domain',
                items,
                formData.color,
                userId
            );
        }

        loadDomains();
        onDomainsChange?.();
        resetForm();
    };

    const handleArchive = (domainId: string) => {
        if (archiveDomain(domainId, userId)) {
            loadDomains();
            onDomainsChange?.();
        }
    };

    const handleRestore = (domainId: string) => {
        if (restoreDomain(domainId, userId)) {
            loadDomains();
            onDomainsChange?.();
        }
    };

    const handleDelete = (domainId: string) => {
        if (confirm('Delete this domain permanently? This cannot be undone.')) {
            if (deleteDomain(domainId, userId)) {
                loadDomains();
                onDomainsChange?.();
            }
        }
    };

    const handleToggleXP = (domainId: string) => {
        toggleDomainXP(domainId, userId);
        loadDomains();
        onDomainsChange?.();
    };

    const updateItemField = (index: number, value: string) => {
        const updated = [...formData.items];
        updated[index] = value;
        setFormData({ ...formData, items: updated });
    };

    const addItemField = () => {
        setFormData({ ...formData, items: [...formData.items, ''] });
    };

    const removeItemField = (index: number) => {
        const updated = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updated });
    };

    const activeCount = getActiveDomainCount(userId);
    const canAdd = canAddDomain(userId);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    YOUR SYSTEM
                    <span className="text-xs bg-[#1f6feb] text-white px-2 py-0.5 rounded-full font-mono">
                        {activeCount}/5
                    </span>
                </h3>
                {canAdd && (
                    <Button
                        onClick={() => { resetForm(); setIsDialogOpen(true); }}
                        variant="outline"
                        className="border-[#30363d] text-[#58a6ff] hover:bg-[#58a6ff]/10 hover:text-[#58a6ff]"
                    >
                        + New Domain
                    </Button>
                )}
            </div>

            {/* Domain Editing Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0d1117] border border-[#30363d] w-full max-w-md rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
                    >
                        <button
                            onClick={resetForm}
                            className="absolute top-4 right-4 text-[#8b949e] hover:text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingDomain ? `Edit ${editingDomain.name}` : 'Create New Domain'}
                        </h2>

                        <div className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#8b949e] uppercase">Domain Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Creativity, Fitness"
                                    className="bg-[#161b22] border-[#30363d] text-white focus:ring-[#1f6feb]"
                                />
                            </div>

                            {/* Icons & Colors */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#8b949e] uppercase">Appearance</label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {DOMAIN_ICONS.map(icon => (
                                        <button
                                            key={icon}
                                            onClick={() => setFormData({ ...formData, icon })}
                                            className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-transform hover:scale-110 ${formData.icon === icon ? 'bg-white/10 ring-2 ring-white scale-110' : 'bg-[#161b22]'}`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {DOMAIN_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setFormData({ ...formData, color })}
                                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d1117]' : ''}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Intention */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#8b949e] uppercase">Intention (The "Why")</label>
                                <Input
                                    value={formData.intention}
                                    onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
                                    placeholder="Why does this matter to you?"
                                    className="bg-[#161b22] border-[#30363d] text-white"
                                />
                            </div>

                            {/* Habits */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-[#8b949e] uppercase flex justify-between">
                                    <span>Habits / Micro-actions</span>
                                    <span className="text-[#58a6ff] text-[10px] bg-[#58a6ff]/10 px-2 rounded-full">Max 5 advised</span>
                                </label>
                                {formData.items.map((item, i) => (
                                    <div key={i} className="flex gap-2">
                                        <Input
                                            value={item}
                                            onChange={(e) => updateItemField(i, e.target.value)}
                                            placeholder="Small action (< 2 mins)"
                                            className="bg-[#161b22] border-[#30363d] text-white"
                                        />
                                        {formData.items.length > 1 && (
                                            <button
                                                onClick={() => removeItemField(i)}
                                                className="text-[#8b949e] hover:text-[#ff4b4b] px-2"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <Button
                                    onClick={addItemField}
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 w-full"
                                >
                                    + Add another habit
                                </Button>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={!formData.name.trim()}
                                className="w-full h-12 bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-lg rounded-xl shadow-lg mt-4"
                            >
                                {editingDomain ? 'Save Changes' : 'Create Domain'}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Active Domains List */}
            <div className="grid gap-3">
                <AnimatePresence>
                    {domains.map((domain) => (
                        <motion.div
                            key={domain.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#161b22]/50 border border-[#30363d] rounded-xl p-4 transition-all hover:border-[#8b949e]/50 group relative overflow-hidden"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: domain.color }} />

                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-black/20" style={{ color: domain.color }}>
                                        {domain.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                            {domain.name}
                                            {domain.xpEnabled && <span className="text-[10px] bg-[#58cc02]/20 text-[#58cc02] px-1.5 py-0.5 rounded font-mono">XP ON</span>}
                                        </h4>
                                        <p className="text-sm text-[#8b949e] italic mb-2">"{domain.intention}"</p>

                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {domain.items.map(item => (
                                                <span key={item.id} className="text-xs bg-[#21262d] text-[#c9d1d9] px-2 py-1 rounded-md border border-white/5">
                                                    {item.label}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={() => handleEditClick(domain)}
                                        size="sm"
                                        variant="ghost"
                                        className="text-[#58a6ff] hover:text-[#58a6ff] hover:bg-[#58a6ff]/10 h-8 px-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleArchive(domain.id)}
                                        size="sm"
                                        variant="ghost"
                                        className="text-[#8b949e] hover:text-[#ff4b4b] hover:bg-[#ff4b4b]/10 h-8 px-2"
                                        title="Archive"
                                    >
                                        Archive
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Archived Domains */}
            {archivedDomains.length > 0 && (
                <div className="mt-8 pt-4 border-t border-white/5">
                    <button
                        onClick={() => setShowArchived(!showArchived)}
                        className="text-sm font-bold text-[#8b949e] hover:text-white flex items-center gap-2 mb-4"
                    >
                        {showArchived ? '▼' : '▶'} Archived Domains ({archivedDomains.length})
                    </button>

                    <AnimatePresence>
                        {showArchived && (
                            <div className="space-y-2">
                                {archivedDomains.map((domain) => (
                                    <motion.div
                                        key={domain.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="bg-[#161b22]/30 border border-[#30363d]/50 rounded-xl p-3 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl grayscale">{domain.icon}</span>
                                            <span className="font-medium text-[#8b949e]">{domain.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleRestore(domain.id)}
                                                className="text-[#58cc02] hover:underline"
                                                variant="ghost"
                                                size="sm"
                                            >
                                                Restore
                                            </Button>
                                            <Button
                                                onClick={() => handleDelete(domain.id)}
                                                className="text-[#ff4b4b] hover:underline"
                                                variant="ghost"
                                                size="sm"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
