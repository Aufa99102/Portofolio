export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tech: string[];
  demoUrl: string;
  githubUrl: string;
}

export interface Skill {
  name: string;
  level: string;
  percentage: number;
}

export interface SkillGroup {
  title: string;
  icon: string;
  skills: Skill[];
}

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  verificationUrl: string;
  image?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  stars: number;
  quote: string;
}

// 1. Projects Data
const projects: Project[] = [
  {
    id: 1,
    title: "Mamiri",
    category: "Web Dev",
    description:"Aplikasi Mobile dan Dekstop untuk melihat kesehatan dan kondisi Ibu Hamil.",
    tech: ["JavaScript", "Express.js", "MySQL"],
    demoUrl: "https://www.figma.com/proto/91HtoZpp4IiFt28XYtQHVg/MAMIRI?node-id=0-1&t=MIoTShCN9tC85k5S-1",
    githubUrl: "#",
  },
  {
    id: 2,
    title: "KI_DIGITAL",
    category: "Web Dev",
    description:"Sebuah Web yang memudahkan pekerjaan para Bidan untuk melakukan Input data kehamilan.",
    tech: ["React", "Express.js", "MySQL"],
    demoUrl: "#",
    githubUrl: "https://github.com/Aufa99102/Projek-27",
  },
  {
    id: 3,
    title: "Personal Landing Page Portfolio",
    category: "Web Dev",
    description:"Highly responsive, premium dark-themed portfolio site built with speed and animations.",
    tech: ["HTML", "Vanilla JS", "Tailwind CSS"],
    demoUrl: "#",
    githubUrl: "https://github.com/Aufa99102/Portofolio",
  },
  {
    id: 4,
    title: "KI_DIGITAL",
    category: "UI/UX",
    description:"User Interface Aplikasi kesehatan yang membantu para Bidan dalam mengefisiensikan waktu kerjanya.",
    tech: ["Figma", "Interaction Design"],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: 5,
    title: "Mamiri",
    category: "UI/UX",
    description:"User Interface yang menarik dengan pilihan tema warna yang cocok dengan konsep Aplikasi.",
    tech: ["Figma", "Interaction Design"],
    demoUrl: "https://www.figma.com/proto/91HtoZpp4IiFt28XYtQHVg/MAMIRI?node-id=0-1&t=MIoTShCN9tC85k5S-1",
    githubUrl: "#",
  },
  {
    id: 6,
    title: "Stokify",
    category: "UI/UX",
    description:"User Interface dari sebuah Aplikasi yang mempertemukan antara Produsen dan Distributor.",
    tech: ["Figma", "Interaction Design"],
    demoUrl: "https://www.figma.com/proto/Yew78LuvI48vbTduKMWZEb/SUKSES-SELALU?node-id=481-1044&t=eOObkMJxXYmT6qo5-1&starting-point-node-id=107%3A258",
    githubUrl: "#",
  },
];

// 2. Data Skills
const skillGroups: SkillGroup[] = [
  {
    title: "Frontend Development",
    icon: "💻",
    skills: [
      { name: "HTML5 / CSS3", level: "Advanced", percentage: 90 },
      { name: "JavaScript (ES6+)", level: "Advanced", percentage: 85 },
      { name: "React.js", level: "Intermediate", percentage: 75 },
      { name: "Next.js (App Router)", level: "Intermediate", percentage: 70 },
      { name: "Tailwind CSS", level: "Advanced", percentage: 90 },
    ],
  },
  {
    title: "Backend & Database",
    icon: "⚙️",
    skills: [
      { name: "Node.js", level: "Intermediate", percentage: 70 },
      { name: "Express.js", level: "Intermediate", percentage: 75 },
      { name: "MySQL", level: "Intermediate", percentage: 80 },
      { name: "RESTful API Development", level: "Intermediate", percentage: 80 },
    ],
  },
  {
    title: "Tools & Platform",
    icon: "🛠️",
    skills: [
      { name: "Git & GitHub", level: "Advanced", percentage: 85 },
      { name: "Figma (UI/UX)", level: "Intermediate", percentage: 70 },
      { name: "Postman", level: "Advanced", percentage: 80 },
      { name: "VS Code", level: "Advanced", percentage: 95 },
    ],
  },
];

// 3. Data Sertifikat
const certificates: Certificate[] = [
  {
    id: 1,
    title: "AI CLASS ASEAN",
    issuer: "ASEAN FOUNDATION",
    date: "July 2026",
    credentialId: "Asean foundation",
    verificationUrl: "https://www.aiclassasean.org/certificate/eyJpdiI6IlVEUVpwVDEyeFY3Z0ZpZU5NMG1DS3c9PSIsInZhbHVlIjoiWXpuNlJOOTFCdHA4d0VsWnR3MENvZz09IiwibWFjIjoiZWJjMTcwN2FmMTRiNGJiZTUyNmI3YTM1YTUzYTNjNjkxNmVkYTgyNGZjNjA4ODJjODkyZDkyZjRkNjc0MDc0MCIsInRhZyI6IiJ9?v=1",
    image: "/certif.png",
  },
  {
    id: 2,
    title: "Badge JavaScript Essentials 2",
    issuer: "Cisco Networking Academy",
    date: "Juni 2026",
    credentialId: "Cisco",
    verificationUrl: "https://www.credly.com/badges/746c1b87-aef7-4d16-9c16-d5f243c063c9",
    image: "/sertif.png",
  },
  {
    id: 3,
    title: "JavaScript Essentials 2",
    issuer: "Cisco Networking Academy",
    date: "Juni 2026",
    credentialId: "Cisco",
    verificationUrl: "https://www.netacad.com/certificates/?issuanceId=77b0a184-2415-45e3-8d65-b5f2bc988193",
    image: "/sertif.png",
  },
  {
    id: 4,
    title: "Introduction to Financial Literacy",
    issuer: "dicoding",
    date: "1 Januari 2026",
    credentialId: "dicoding",
    verificationUrl: "https://www.dicoding.com/certificates/4EXG3R2WQZRL",
    image: "/sertif.png",
  }
];

// 4. Data Testimoni
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Drs. Eko Prasetyo",
    role: "Kepala Jurusan RPL",
    company: "SMK Negeri 1",
    avatar: "👨‍🏫",
    stars: 5,
    quote:
      "Aufa Safaraz menunjukkan performa luar biasa dalam setiap tugas dan proyek sekolah. Dia selalu menjadi leader dalam team project karena inisiatif dan tanggung jawabnya yang tinggi.",
  },
  {
    id: 2,
    name: "Rian Ardiansyah",
    role: "Teman Sekolah / Ketua Kelas",
    company: "XII RPL 1",
    avatar: "🧑‍💻",
    stars: 5,
    quote:
      "Belajar kelompok bareng Aufa Safaraz selalu asik. Dia pintar menjelaskan konsep pemrograman yang susah dengan bahasa yang gampang dimengerti oleh teman-teman.",
  },
  {
    id: 3,
    name: "Siti Rahmawati",
    role: "Guru Produktif Web & Mobile",
    company: "SMK Negeri 1",
    avatar: "👩‍🏫",
    stars: 5,
    quote:
      "Pemahaman Aufa Safaraz terhadap framework Next.js dan Tailwind CSS v4 di usianya sekarang sangat mengagumkan. Proyek-proyeknya dikerjakan dengan detail dan rapi.",
  },
];

// Simulasi delay untuk skeleton loading
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProjects(): Promise<Project[]> {
  await delay(1200);
  return projects;
}

export async function getSkills(): Promise<SkillGroup[]> {
  await delay(1000);
  return skillGroups;
}

export async function getCertificates(): Promise<Certificate[]> {
  await delay(1200);
  return certificates;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay(1000);
  return testimonials;
}