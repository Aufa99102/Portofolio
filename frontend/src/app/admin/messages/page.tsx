"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { fetchMessages, toggleMessageRead, deleteMessage, ContactMessage } from "@/data/api";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "unread" | "read">("all");

  // View Detail Modal State
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Delete Target
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
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
      const data = await fetchMessages();
      setMessages(data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat pesan masuk";
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
    return messages.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        m.message.toLowerCase().includes(q);

      const isRead = Boolean(m.is_read);
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "unread" && !isRead) ||
        (filterStatus === "read" && isRead);

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchQuery, filterStatus]);

  const handleToggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newStatus = !Boolean(msg.is_read);
    try {
      await toggleMessageRead(msg.id, newStatus);
      setMessages((prev) =>
        prev.map((item) =>
          item.id === msg.id ? { ...item, is_read: newStatus ? 1 : 0 } : item
        )
      );
      if (selectedMessage && selectedMessage.id === msg.id) {
        setSelectedMessage((prev) => (prev ? { ...prev, is_read: newStatus ? 1 : 0 } : null));
      }
      showToast(
        "success",
        newStatus ? "Pesan ditandai sudah dibaca" : "Pesan ditandai belum dibaca"
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memperbarui status pesan";
      showToast("error", errorMessage);
    }
  };

  const handleOpenDetail = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    // Jika belum dibaca, otomatis tandai sudah dibaca saat dibuka
    if (!Boolean(msg.is_read)) {
      handleToggleRead(msg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteMessage(deleteTarget.id);
      showToast("success", `Pesan dari "${deleteTarget.name}" berhasil dihapus!`);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (selectedMessage && selectedMessage.id === deleteTarget.id) {
        setSelectedMessage(null);
      }
      setDeleteTarget(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus pesan";
      showToast("error", errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const unreadCount = useMemo(
    () => messages.filter((m) => !Boolean(m.is_read)).length,
    [messages]
  );

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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Pesan Kontak Masuk</span>
            {unreadCount > 0 && (
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 animate-pulse">
                {unreadCount} Baru
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Lihat pesan dan pertanyaan yang dikirimkan oleh pengunjung melalui form kontak.
          </p>
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
            placeholder="Cari berdasarkan nama, email, subjek, atau pesan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-950/80 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === "all"
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-gray-950/80 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Semua ({messages.length})
          </button>
          <button
            onClick={() => setFilterStatus("unread")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              filterStatus === "unread"
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-gray-950/80 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Belum Dibaca ({unreadCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus("read")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterStatus === "read"
                ? "bg-pink-600 text-white shadow-md shadow-pink-500/20"
                : "bg-gray-950/80 border border-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            Sudah Dibaca ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-gray-900/50 border border-gray-800/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-gray-950/80 border-b border-gray-800/80 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Status</th>
                <th className="py-3.5 px-4">Pengirim</th>
                <th className="py-3.5 px-4">Subjek / Pesan</th>
                <th className="py-3.5 px-4 w-32 hidden sm:table-cell">Waktu</th>
                <th className="py-3.5 px-4 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-3 w-3 bg-gray-800 rounded-full mx-auto" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-36" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-60" /></td>
                    <td className="py-4 px-4 hidden sm:table-cell"><div className="h-4 bg-gray-800 rounded w-20" /></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-800 rounded w-16 mx-auto" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="text-sm">Tidak ada pesan ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => {
                  const isRead = Boolean(msg.is_read);
                  return (
                    <tr
                      key={msg.id}
                      onClick={() => handleOpenDetail(msg)}
                      className={`hover:bg-gray-800/40 transition-colors cursor-pointer group ${
                        !isRead ? "bg-indigo-950/20" : ""
                      }`}
                    >
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            !isRead ? "bg-pink-500 animate-pulse" : "bg-gray-700"
                          }`}
                          title={!isRead ? "Belum Dibaca" : "Sudah Dibaca"}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="min-w-0">
                          <p
                            className={`text-sm truncate ${
                              !isRead ? "font-bold text-white" : "font-medium text-gray-300"
                            }`}
                          >
                            {msg.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{msg.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="min-w-0 max-w-lg">
                          {msg.subject && (
                            <p
                              className={`text-xs truncate mb-0.5 ${
                                !isRead ? "font-semibold text-pink-300" : "text-gray-400"
                              }`}
                            >
                              {msg.subject}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 line-clamp-1">{msg.message}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell text-xs text-gray-500">
                        {new Date(msg.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => handleToggleRead(msg, e)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all hover:scale-110"
                            title={isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                          >
                            {isRead ? "📩" : "✉️"}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(msg)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all hover:scale-110"
                            title="Hapus Pesan"
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
            Menampilkan <strong>{filtered.length}</strong> dari <strong>{messages.length}</strong> pesan
          </span>
          <span className="text-gray-500 hidden sm:inline">
            MySQL Table: <code>contacts</code>
          </span>
        </div>
      </div>

      {/* Modal Detail Message */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl space-y-5 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-white">Detail Pesan Masuk 📩</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Diterima pada{" "}
                  {new Date(selectedMessage.created_at).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="p-3.5 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Pengirim:</span>
                  <span className="font-semibold text-white">{selectedMessage.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Email:</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="font-mono text-xs text-indigo-400 hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.subject && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Subjek:</span>
                    <span className="font-medium text-pink-300">{selectedMessage.subject}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Isi Pesan:
                </label>
                <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 text-gray-200 whitespace-pre-wrap leading-relaxed min-h-28 text-sm">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => handleToggleRead(selectedMessage)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all flex items-center gap-1.5"
              >
                <span>{Boolean(selectedMessage.is_read) ? "📩" : "✉️"}</span>
                <span>
                  {Boolean(selectedMessage.is_read)
                    ? "Tandai Belum Dibaca"
                    : "Tandai Sudah Dibaca"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || "Balasan Portofolio"}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <span>✉️</span>
                  <span>Balas Email</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Konfirmasi Hapus Pesan 🗑️</h3>
            <p className="text-sm text-gray-300">
              Apakah Anda yakin ingin menghapus pesan dari{" "}
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
