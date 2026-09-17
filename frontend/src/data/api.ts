import { 
    Project,
    SkillGroup,
    SkillFlat,
    Certificate,
    Testimonial, 
} from "./mockData"

const API_BASE = "http://localhost:5000/api"

export interface DashboardStats {
  total_projects: number;
  total_skills: number;
  total_certificates: number;
  total_testimonials: number;
  total_messages: number;
  unread_messages: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean | number;
  created_at: string;
}

export type { SkillFlat };

export interface SkillGroupOption {
    id: number;
    title: string;
    icon: string;
}

// 1. Fetch Project
export async function fetchProject(): Promise<Project[]> {
    const response = await fetch(`${API_BASE}/projects`, { cache: "no-store" });
    const json = await response.json();


    if (!json.success) {
        throw new Error(json.message || "Failed to Get project's data")
    }

    return json.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        tech: typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech || [],
        demoUrl: item.demo_url || "",
        githubUrl: item.github_url || "",
    }));
}

// 1.1 Fetch Project Detail
export async function fetchProjectById(id: number | string): Promise<Project> {
  const response = await fetch(`${API_BASE}/projects/${id}`, { cache: "no-store" });
  const json = await response.json();
  if (!json.success) throw new Error(json.message || "Gagal mengambil detail proyek");
  
  const item = json.data;

  return {
    id: item.id,
    title: item.title,
    category: item.category,
    description: item.description,
    tech: typeof item.tech === "string" ? JSON.parse(item.tech) : item.tech || [],
    demoUrl: item.demo_url,
    githubUrl: item.github_url,
  };
}

// 1.2 Fetch createProject
export async function createProject(
  data: Omit<Project, "id">
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      category: data.category,
      description: data.description,
      tech: data.tech,
      demo_url: data.demoUrl,
      github_url: data.githubUrl,
    }),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menambahkan proyek");
  return json;
}

// 1.3 Fetch updateProject
export async function updateProject(
  id: number | string,
  data: Partial<Project>
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      category: data.category,
      description: data.description,
      tech: data.tech,
      demo_url: data.demoUrl,
      github_url: data.githubUrl,
    }),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal memperbarui proyek");
  return json;
}

// 1.4 Fetch deleteProject
export async function deleteProject(
  id: number | string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menghapus proyek");
  return json;
}

// 2. Fetch Skill
export async function fetchSkills(): Promise<SkillGroup[]> {
    const response = await fetch(`${API_BASE}/skills`, { cache: "no-store" });
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.message || "Failed to Get Skill's data");
    }

    const groupMap = new Map<string, SkillGroup>();

    json.data.forEach((item: any) => {
        const key = item.group_title;

        if (!groupMap.has(key)) {
            groupMap.set(key, {
                title: item.group_title,
                icon: item.group_icon,
                skills: [],
            });
        }

        groupMap.get(key)!.skills.push({
            name: item.name,
            level: item.level,
            percentage:item.percentage,
        });
    });

    return Array.from(groupMap.values());
}

// 2.1 Fetch SkillFlat
export async function fetchSkillsFlat(): Promise<SkillFlat[]> {
  const response = await fetch(`${API_BASE}/skills`, { cache: "no-store" });
  const json = await response.json();
  if (!json.success) throw new Error(json.message || "Gagal mengambil data skill");
  return json.data;
}

// 2.2 Fetch SkillGroup
export async function fetchSkillGroups(): Promise<SkillGroupOption[]> {
  const response = await fetch(`${API_BASE}/skill-groups`, { cache: "no-store" });
  const json = await response.json();
  if (!json.success) throw new Error(json.message || "Gagal mengambil kategori skill");
  return json.data;
}

// 2.3 Fetch CreateSkillGroup
export async function createSkillGroup(data: {
  title: string;
  icon: string;
}): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/skill-groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menambahkan kategori skill");
  return json;
}

// 2.4 createSkill 
export async function createSkill(data: {
  skill_group_id: number;
  name: string;
  level: string;
  percentage: number;
}): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/skills`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menambahkan skill");
  return json;
}

// 2.5 UpdateSkill
export async function updateSkill(
  id: number | string,
  data: {
    skill_group_id: number;
    name: string;
    level: string;
    percentage: number;
  }
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/skills/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal memperbarui skill");
  return json;
}

// 2.6 DeleteSkill
export async function deleteSkill(
  id: number | string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/skills/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menghapus skill");
  return json;
}


// 3. Fetch Sertifikat
export async function fetchCertificates(): Promise<Certificate[]> {
    const response = await fetch(`${API_BASE}/certificates`, { cache: "no-store" });
    const json = await response.json();

    if (!json.success) {
        throw new Error(
            json.message || "Failed to Get Sertificate's data"
        );
    }

    return json.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        issuer: item.issuer,
        date: item.date,
        credentialId: item.credential_id,
        verificationUrl: item.verification_url,
    }));
}

// 3.1 Fetch SertifikatById
export async function fetchCertificateById(id: number | string): Promise<Certificate> {
  const response = await fetch(`${API_BASE}/certificates/${id}`, { cache: "no-store" });
  const json = await response.json();
  if (!json.success) throw new Error(json.message || "Gagal mengambil detail sertifikat");

  const item = json.data;

  return {
    id: item.id,
    title: item.title,
    issuer: item.issuer,
    date: item.date,
    credentialId: item.credential_id,
    verificationUrl: item.verification_url,
  };
}

// 3.2 Fetch createCertificate
export async function createCertificate(
  data: Omit<Certificate, "id">
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/certificates`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      credential_id: data.credentialId,
      verification_url: data.verificationUrl,
    }),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menambahkan sertifikat");
  return json;
}

// 3.3 Fetch updateCertificate
export async function updateCertificate(
  id: number | string,
  data: Partial<Certificate>
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/certificates/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: data.title,
      issuer: data.issuer,
      date: data.date,
      credential_id: data.credentialId,
      verification_url: data.verificationUrl,
    }),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal memperbarui sertifikat");
  return json;
}

// 3.4 Fetch deleteCertificate
export async function deleteCertificate(
  id: number | string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/certificates/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menghapus sertifikat");
  return json;
}

// 4. Fetch Testimonial
export async function fetchTestimonials(): Promise<Testimonial[]> {
    const response = await fetch (`${API_BASE}/testimonials`, { cache: "no-store" });
    const json = await response.json();

    if (!json.success) {
        throw new Error(json.message || "Failed to Get Tetimonial's data");
    }

    return json.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        company: item.company,
        avatar: item.avatar,
        stars: item.stars,
        quote: item.quote,
    }));
}

// 4.1 Create Testimonial
export async function createTestimonial(
  data: Omit<Testimonial, "id">
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/testimonials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menambahkan testimoni");
  return json;
}

// 4.2 Update Testimonial
export async function updateTestimonial(
  id: number | string,
  data: Partial<Testimonial>
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/testimonials/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal memperbarui testimoni");
  return json;
}

// 4.3 Delete Testimonial
export async function deleteTestimonial(
  id: number | string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/testimonials/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menghapus testimoni");
  return json;
}

// 5. Fetch Pesan Kotak
export async function sendContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
}): Promise<{ success: boolean; message: string }> {
    const response = await fetch (`${API_BASE}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nama: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
        }),
    });

    const json = await response.json();
    return json;
}

// 6. Fetch Semua Pesan Kontak (Untuk Admin)
export async function fetchMessages(): Promise<ContactMessage[]> {
  const response = await fetch(`${API_BASE}/messages`, { cache: "no-store" });
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Gagal mengambil data pesan");
  }

  return json.data.map((item: any) => ({
    id: item.id,
    name: item.name || item.nama || "",
    email: item.email || "",
    subject: item.subject || "",
    message: item.message || "",
    is_read: item.is_read,
    created_at: item.created_at,
  }));
}

// 6.1 Fetch toggleMessageRead
export async function toggleMessageRead(
  id: number | string,
  isRead: boolean
): Promise<{ success: boolean; message: string; data?: unknown }> {
  const response = await fetch(`${API_BASE}/messages/${id}/read`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_read: isRead }),
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal mengubah status pesan");
  return json;
}

// 6.2 deleteMessage
export async function deleteMessage(
  id: number | string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE}/messages/${id}`, {
    method: "DELETE",
  });
  const json = await response.json();
  if (!response.ok || !json.success)
    throw new Error(json.message || "Gagal menghapus pesan");
  return json;
}

// 7. Fetch Statistik Dashboard (Untuk Admin)
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_BASE}/dashboard/stats`);
  const json = await response.json();

  if (!json.success) {
    throw new Error(json.message || "Gagal mengambil data statistik");
  }

  return json.data;
}