"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  fetchSkillsFlat,
  fetchSkillGroups,
  createSkill,
  updateSkill,
  deleteSkill,
  createSkillGroup,
  SkillFlat,
  SkillGroupOption,
} from "@/data/api";

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillFlat[]>([]);
  const [groups, setGroups] = useState<SkillGroupOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("All");

  // Modal Skill Form State
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillFlat | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    skill_group_id: 1,
    level: "Intermediate",
    percentage: 75,
  });
  const [savingSkill, setSavingSkill] = useState(false);

  // Modal Group Form State
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState({
    title: "",
    icon: "⚡",
  });
  const [savingGroup, setSavingGroup] = useState(false);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<SkillFlat | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [skillsData, groupsData] = await Promise.all([
        fetchSkillsFlat(),
        fetchSkillGroups(),
      ]);
      setSkills(skillsData);
      setGroups(groupsData);
      if (groupsData.length > 0 && !editingSkill) {
        setSkillForm((prev) => ({ ...prev, skill_group_id: groupsData[0].id }));
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat data skill";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showToast, editingSkill]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return skills.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(q) ||
        s.level.toLowerCase().includes(q) ||
        (s.group_title && s.group_title.toLowerCase().includes(q));
      const matchesGroup =
        selectedGroup === "All" ||
        String(s.skill_group_id ?? s.skillGroupId) === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [skills, searchQuery, selectedGroup]);

  const openAddSkillModal = () => {
    setEditingSkill(null);
    setSkillForm({
      name: "",
      skill_group_id: groups[0]?.id || 1,
      level: "Intermediate",
      percentage: 75,
    });
    setShowSkillModal(true);
  };

  const openEditSkillModal = (skill: SkillFlat) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      skill_group_id: skill.skill_group_id ?? skill.skillGroupId ?? (groups[0]?.id || 1),
      level: skill.level,
      percentage: skill.percentage,
    });
    setShowSkillModal(true);
  };

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;

    try {
      setSavingSkill(true);
      if (editingSkill) {
        await updateSkill(editingSkill.id, skillForm);
        showToast("success", `Skill "${skillForm.name}" berhasil diperbarui!`);
      } else {
        await createSkill(skillForm);
        showToast("success", `Skill "${skillForm.name}" berhasil ditambahkan!`);
      }
      setShowSkillModal(false);
      await loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", errorMessage);
    } finally {
      setSavingSkill(false);
    }
  };

  const handleGroupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupForm.title.trim()) return;

    try {
      setSavingGroup(true);
      await createSkillGroup(groupForm);
      showToast("success", `Kategori "${groupForm.title}" berhasil ditambahkan!`);
      setShowGroupModal(false);
      setGroupForm({ title: "", icon: "⚡" });
      await loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menambahkan kategori";
      showToast("error", errorMessage);
    } finally {
      setSavingGroup(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteSkill(deleteTarget.id);
      showToast("success", `Skill "${deleteTarget.name}" berhasil dihapus!`);
      setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus skill";
      showToast("error", errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
              : "bg-red-950/90 border-red-500/50 text-red-200"
          }`}
        >
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <p className="text-sm font-medium">{toast.text}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Kelola Keahlian (Skills)
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Tambah, edit, atau hapus keterampilan teknis dan kategori skill.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowGroupModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold border border-gray-700 transition-all text-sm"
          >
            📁 Tambah Kategori
          </button>
          <button
            onClick={openAddSkillModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg shadow-amber-500/25 transition-all text-sm"
          >
            ➕ Tambah Skill
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800/60 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama skill, level, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedGroup("All")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedGroup === "All"
                ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                : "bg-gray-950/80 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Semua ({skills.length})
          </button>
          {groups.map((grp) => (
            <button
              key={grp.id}
              onClick={() => setSelectedGroup(String(grp.id))}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedGroup === String(grp.id)
                  ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                  : "bg-gray-950/80 border border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              <span>{grp.icon}</span>
              <span>{grp.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-gray-900/50 border border-gray-800/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/80 border-b border-gray-800/80 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="py-3.5 px-4 w-14 text-center">No</th>
                <th className="py-3.5 px-4">Nama Skill</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4 w-44">Penguasaan</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-6 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-36" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-24" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-32" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">⚡</div>
                    <p className="text-sm">Tidak ada skill ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((skill, index) => {
                  const group = groups.find(
                    (g) => g.id === (skill.skill_group_id ?? skill.skillGroupId)
                  );
                  return (
                    <tr key={skill.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="py-4 px-4 text-center font-mono text-xs text-gray-500">{index + 1}</td>
                      <td className="py-4 px-4 font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {skill.name}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700/60">
                          <span>{group?.icon || skill.group_icon || "⚡"}</span>
                          <span>{group?.title || skill.group_title || "Umum"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {skill.level}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-gray-400 font-mono">
                            <span>{skill.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, Math.max(0, skill.percentage))}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openEditSkillModal(skill)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all hover:scale-110"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => setDeleteTarget(skill)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all hover:scale-110"
                            title="Hapus"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-gray-950/60 border-t border-gray-800/60 text-xs text-gray-400 flex items-center justify-between">
          <span>
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{skills.length}</strong> skill
          </span>
          <span className="text-gray-500 hidden sm:inline">
            MySQL Tables: <code>skills</code>, <code>skill_groups</code>
          </span>
        </div>
      </div>

      {/* Modal Add / Edit Skill */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleSkillSubmit}
            className="w-full max-w-lg p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white">
              {editingSkill ? "Edit Skill ✏️" : "Tambah Skill Baru ⚡"}
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Nama Skill <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Next.js / TypeScript"
                value={skillForm.name}
                onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Kategori Skill <span className="text-rose-400">*</span>
              </label>
              <select
                value={skillForm.skill_group_id}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, skill_group_id: Number(e.target.value) })
                }
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              >
                {groups.map((grp) => (
                  <option key={grp.id} value={grp.id} className="bg-gray-900 text-white">
                    {grp.icon} {grp.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Level Kemahiran <span className="text-rose-400">*</span>
              </label>
              <select
                value={skillForm.level}
                onChange={(e) => setSkillForm({ ...skillForm, level: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              >
                {skillLevels.map((lvl) => (
                  <option key={lvl} value={lvl} className="bg-gray-900 text-white">
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-gray-200">
                <span>Persentase Penguasaan:</span>
                <span className="text-amber-400 font-mono text-base">{skillForm.percentage}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={skillForm.percentage}
                onChange={(e) =>
                  setSkillForm({ ...skillForm, percentage: Number(e.target.value) })
                }
                className="w-full accent-amber-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowSkillModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savingSkill}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {savingSkill ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Add Skill Group */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleGroupSubmit}
            className="w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold text-white">Tambah Kategori Skill 📁</h3>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Judul Kategori <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Mobile App Development"
                value={groupForm.title}
                onChange={(e) => setGroupForm({ ...groupForm, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Icon / Emoji
              </label>
              <input
                type="text"
                placeholder="Contoh: 📱 / ⚡ / 💻"
                value={groupForm.icon}
                onChange={(e) => setGroupForm({ ...groupForm, icon: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowGroupModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savingGroup}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {savingGroup ? "Menyimpan..." : "Tambah Kategori"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Konfirmasi Hapus 🗑️</h3>
            <p className="text-sm text-gray-300">
              Apakah Anda yakin ingin menghapus skill{" "}
              <strong className="text-white">"{deleteTarget.name}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
