"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchProject, createProject, updateProject, deleteProject } from "@/data/api";
import { Project } from "@/data/mockData";

const categories = ["Web Dev", "Mobile App", "UI/UX", "Backend", "Fullstack", "Lainnya"];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Web Dev",
    description: "",
    techInput: "",
    demoUrl: "",
    githubUrl: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchProject();
      setProjects(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat data proyek";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (Array.isArray(p.tech) && p.tech.some((t) => t.toLowerCase().includes(q)));
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [projects, searchQuery, selectedCategory]);

  const openAddModal = () => {
    setEditing(null);
    setFormData({
      title: "",
      category: "Web Dev",
      description: "",
      techInput: "",
      demoUrl: "",
      githubUrl: "",
    });
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditing(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description || "",
      techInput: Array.isArray(project.tech) ? project.tech.join(", ") : "",
      demoUrl: project.demoUrl || "",
      githubUrl: project.githubUrl || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category.trim()) return;

    const techArray = formData.techInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      tech: techArray,
      demoUrl: formData.demoUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
    };

    try {
      setSaving(true);
      if (editing) {
        await updateProject(editing.id, payload);
        showToast("success", `Proyek "${formData.title}" berhasil diperbarui!`);
      } else {
        await createProject(payload);
        showToast("success", `Proyek "${formData.title}" berhasil ditambahkan!`);
      }
      setShowModal(false);
      await loadData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan";
      showToast("error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteProject(deleteTarget.id);
      showToast("success", `Proyek "${deleteTarget.title}" berhasil dihapus!`);
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus proyek";
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
            Kelola Data Proyek
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Tambah, edit, atau hapus portofolio proyek yang Anda kerjakan.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all"
        >
          ➕ Tambah Proyek
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800/60 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan judul, kategori, atau teknologi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "All"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                : "bg-gray-950/80 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-gray-950/80 border border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {cat}
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
                <th className="py-3.5 px-4">Judul Proyek</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Teknologi</th>
                <th className="py-3.5 px-4 hidden lg:table-cell">Link Demo / Repo</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-6 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-40" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-20" /></td>
                    <td className="py-4 px-4 hidden md:table-cell"><div className="h-4 bg-gray-800 rounded w-32" /></td>
                    <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 bg-gray-800 rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🚀</div>
                    <p className="text-sm">Tidak ada proyek ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((proj, index) => (
                  <tr key={proj.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="py-4 px-4 text-center font-mono text-xs text-gray-500">{index + 1}</td>
                    <td className="py-4 px-4 font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {proj.title}
                      {proj.description && (
                        <p className="text-xs text-gray-400 font-normal line-clamp-1 mt-0.5">
                          {proj.description}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(proj.tech) && proj.tech.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[11px] bg-gray-800/80 text-gray-300 border border-gray-700/50"
                          >
                            {t}
                          </span>
                        ))}
                        {Array.isArray(proj.tech) && proj.tech.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[11px] bg-gray-800 text-gray-400">
                            +{proj.tech.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell text-xs">
                      <div className="flex items-center gap-3">
                        {proj.demoUrl && proj.demoUrl !== "#" ? (
                          <a
                            href={proj.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            Demo ↗
                          </a>
                        ) : (
                          <span className="text-gray-600">No Demo</span>
                        )}
                        {proj.githubUrl && proj.githubUrl !== "#" ? (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            GitHub ↗
                          </a>
                        ) : (
                          <span className="text-gray-600">No Repo</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all hover:scale-110"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteTarget(proj)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all hover:scale-110"
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-gray-950/60 border-t border-gray-800/60 text-xs text-gray-400 flex items-center justify-between">
          <span>
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{projects.length}</strong> proyek
          </span>
          <span className="text-gray-500 hidden sm:inline">
            MySQL Table: <code>projects</code>
          </span>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4 my-8"
          >
            <h3 className="text-lg font-bold text-white">
              {editing ? "Edit Proyek ✏️" : "Tambah Proyek Baru 🚀"}
            </h3>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Judul Proyek <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Aplikasi Pengelolaan Rumah Sakit"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Kategori <span className="text-rose-400">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-gray-900 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Deskripsi
              </label>
              <textarea
                rows={3}
                placeholder="Penjelasan singkat mengenai proyek ini..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Teknologi Digunakan (pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="Contoh: React, Next.js, Tailwind CSS, MySQL"
                value={formData.techInput}
                onChange={(e) => setFormData({ ...formData, techInput: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  URL Live Demo
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  URL GitHub / Repository
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium text-sm transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Simpan"}
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
              Apakah Anda yakin ingin menghapus proyek{" "}
              <strong className="text-white">"{deleteTarget.title}"</strong>?
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
