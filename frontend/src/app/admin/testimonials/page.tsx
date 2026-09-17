"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  fetchTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/data/api";
import { Testimonial } from "@/data/mockData";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    avatar: "👤",
    stars: 5,
    quote: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = useCallback((type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTestimonials();
      setTestimonials(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat data testimoni";
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
    return testimonials.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.role && t.role.toLowerCase().includes(q)) ||
        (t.company && t.company.toLowerCase().includes(q)) ||
        (t.quote && t.quote.toLowerCase().includes(q))
    );
  }, [testimonials, searchQuery]);

  const openAddModal = () => {
    setEditing(null);
    setFormData({
      name: "",
      role: "",
      company: "",
      avatar: "👤",
      stars: 5,
      quote: "",
    });
    setShowModal(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditing(item);
    setFormData({
      name: item.name,
      role: item.role || "",
      company: item.company || "",
      avatar: item.avatar || "👤",
      stars: item.stars || 5,
      quote: item.quote || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) return;

    try {
      setSaving(true);
      if (editing) {
        await updateTestimonial(editing.id, formData);
        showToast("success", `Testimoni dari "${formData.name}" berhasil diperbarui!`);
      } else {
        await createTestimonial(formData);
        showToast("success", `Testimoni dari "${formData.name}" berhasil ditambahkan!`);
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
      await deleteTestimonial(deleteTarget.id);
      showToast("success", `Testimoni "${deleteTarget.name}" berhasil dihapus!`);
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus testimoni";
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
            Kelola Data Testimoni
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Tambah, edit, atau hapus ulasan dan rekomendasi dari rekan atau pengajar.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all"
        >
          ➕ Tambah Testimoni
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-gray-900/50 border border-gray-800/60">
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari berdasarkan nama pemberi testimoni, jabatan, instansi, atau isi pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-gray-900/50 border border-gray-800/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/80 border-b border-gray-800/80 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="py-3.5 px-4 w-14 text-center">No</th>
                <th className="py-3.5 px-4">Pemberi Testimoni</th>
                <th className="py-3.5 px-4">Jabatan / Instansi</th>
                <th className="py-3.5 px-4 w-28">Rating</th>
                <th className="py-3.5 px-4">Isi Testimoni</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-6 mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-32" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-28" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-48" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">Tidak ada testimoni ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-800/30 transition-colors group">
                    <td className="py-4 px-4 text-center font-mono text-xs text-gray-500">{index + 1}</td>
                    <td className="py-4 px-4 font-semibold text-white group-hover:text-purple-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-base shrink-0">
                          {item.avatar || "👤"}
                        </span>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-xs font-medium text-gray-200">{item.role || "-"}</p>
                        <p className="text-[11px] text-gray-400">{item.company || "-"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex text-amber-400 text-xs tracking-wider">
                        {Array.from({ length: Math.min(5, Math.max(1, item.stars || 5)) }).map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-xs text-gray-300 italic line-clamp-2 max-w-md">
                        &quot;{item.quote}&quot;
                      </p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all hover:scale-110"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
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
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{testimonials.length}</strong> testimoni
          </span>
          <span className="text-gray-500 hidden sm:inline">
            MySQL Table: <code>testimonials</code>
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
              {editing ? "Edit Testimoni ✏️" : "Tambah Testimoni Baru 💬"}
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Nama Pemberi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. Saad"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Avatar (Emoji)
                </label>
                <input
                  type="text"
                  placeholder="👨‍🏫"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white text-center text-lg placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Peran / Jabatan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kepala Sekolah"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  Perusahaan / Sekolah
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMK Telkom Makassar"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Bintang Rating (1 - 5)
              </label>
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormData({ ...formData, stars: star })}
                    className={`text-2xl transition-transform hover:scale-125 ${
                      star <= formData.stars ? "text-amber-400" : "text-gray-600"
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-xs text-gray-400 ml-2">({formData.stars} dari 5 bintang)</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Isi Testimoni / Pesan <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan testimoni atau ulasan di sini..."
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
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
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all disabled:opacity-50"
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
              Apakah Anda yakin ingin menghapus testimoni dari{" "}
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
