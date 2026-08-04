export default function AboutPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            About{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Me
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Kenali lebih dekat siapa saya, apa yang saya pelajari, dan apa
            yang memotivasi saya.
          </p>
        </div>

        {/* Ini profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Ini photo dan info */}
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-gray-800/50 flex items-center justify-center">
              <span className="text-6xl">
                <img src="/profil.png" alt="Profile" className="w-full h-full object-cover rounded-2xl" />
              </span>
            </div>

            <div className="w-full space-y-3">
              {[
                { label: "Nama", value: "Aufa Safaraz Prianda" },
                { label: "Kelas", value: "XII RPL 1" },
                { label: "Sekolah", value: "SMK TELKOM MAKASSAR" },
                { label: "Lokasi", value: "Makassar, Sulawesi Selatan" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-900/50 border border-gray-800/50"
                >
                  <span className="text-gray-400 text-sm">{item.label}</span>
                  <span className="text-white text-sm font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deskripsi kanan */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Siapa saya?
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Saya adalah siswa kelas XII jurusan Rekayasa Perangkat Lunak
                (RPL) yang memiliki passion besar di bidang web development.
                Saya senang membangun website dan aplikasi web yang tidak
                hanya fungsional, tetapi juga memiliki tampilan yang menarik
                dan pengalaman pengguna yang baik.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Perjalanan Saya
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Perjalanan saya di dunia programming dimulai sejak kelas X
                ketika pertama kali belajar HTML dan CSS. Sejak saat itu,
                saya terus mengeksplorasi berbagai teknologi mulai dari
                JavaScript, React, Next.js hingga backend dengan Express.js
                dan database MySQL.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Tujuan Saya
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Saya ingin terus berkembang menjadi full-stack web developer
                yang handal. Melalui portofolio ini, saya ingin menunjukkan
                hasil kerja dan kemampuan yang telah saya bangun selama
                belajar di jurusan RPL.
              </p>
            </div>
          </div>
        </div>

        {/* Ini edukasi dan timeline pendidikan */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            Pendidikan
          </h2>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* timeline 1 */}
            <div className="relative pl-8 border-l-2 border-indigo-500/30">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-indigo-500 border-4 border-gray-950" />
              <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800/50">
                <span className="text-xs text-indigo-400 font-medium">
                  2024 — Sekarang
                </span>
                <h3 className="text-white font-semibold mt-1">
                  SMK TELKOM MAKASSAR — XII RPL 1
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Mempelajari pemrograman web, mobile, dan desktop. Fokus
                  pada pengembangan fullstack web application.
                </p>
              </div>
            </div>

            {/* timeline 2 */}
            <div className="relative pl-8 border-l-2 border-gray-800/50">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-gray-700 border-4 border-gray-950" />
              <div className="p-5 rounded-xl bg-gray-900/50 border border-gray-800/50">
                <span className="text-xs text-gray-500 font-medium">
                  2021 — 2024
                </span>
                <h3 className="text-white font-semibold mt-1">SMP BUQ'ATUN MUBARAKAH POMPES DARUL AMAN MAKASSAR</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Masa SMP dimana mulai tertarik dengan dunia teknologi dan
                  komputer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}