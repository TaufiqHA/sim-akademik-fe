const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://edlynk.aon-mitrasolutions.com/api";

// Development mode flag - set to true to use mock data
const USE_MOCK_DATA =
  process.env.NODE_ENV === "development" &&
  (!process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL === "");

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function fetchApi(endpoint, options = {}) {
  // Return mock data in development when backend is not configured
  if (USE_MOCK_DATA) {
    return handleMockApi(endpoint, options);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // If network error in development, fall back to mock data
    if (process.env.NODE_ENV === "development") {
      console.warn("Backend not available, using mock data:", error.message);
      return handleMockApi(endpoint, options);
    }
    throw new ApiError("Network error", 0, { message: error.message });
  }
}

export async function login(email, password) {
  const response = await fetchApi("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  if (response.access_token) {
    localStorage.setItem("access_token", response.access_token);
    localStorage.setItem("token_type", response.token_type || "Bearer");
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  return response;
}

export async function logout() {
  try {
    await fetchApi("/auth/logout", { method: "POST" });
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("user");
  }
}

export async function getCurrentUser() {
  return await fetchApi("/auth/me");
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function isAuthenticated() {
  return !!getStoredToken();
}

// Super Admin Dashboard
export async function getSuperAdminDashboard() {
  return await fetchApi("/dashboard/super-admin");
}

// Users Management
export async function getUsers(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // Map 'search' parameter to 'q' for API compatibility
      if (key === "search") {
        searchParams.append("q", value);
      } else {
        searchParams.append(key, value);
      }
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/users${query ? `?${query}` : ""}`);
}

export async function createUser(userData) {
  return await fetchApi("/users", {
    method: "POST",
    body: userData,
  });
}

export async function getAllDosen(params = {}) {
  return await getUsers({ ...params, role_id: 6 });
}

export async function updateUser(id, userData) {
  return await fetchApi(`/users/${id}`, {
    method: "PUT",
    body: userData,
  });
}

export async function deleteUser(id) {
  return await fetchApi(`/users/${id}`, {
    method: "DELETE",
  });
}

export async function getUser(id) {
  return await fetchApi(`/users/${id}`);
}

// Roles Management
export async function getRoles(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/roles${query ? `?${query}` : ""}`);
}

export async function createRole(roleData) {
  return await fetchApi("/roles", {
    method: "POST",
    body: roleData,
  });
}

export async function updateRole(id, roleData) {
  return await fetchApi(`/roles/${id}`, {
    method: "PUT",
    body: roleData,
  });
}

export async function deleteRole(id) {
  return await fetchApi(`/roles/${id}`, {
    method: "DELETE",
  });
}

export async function getRole(id) {
  return await fetchApi(`/roles/${id}`);
}

// Fakultas Management
export async function getFakultas(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/fakultas${query ? `?${query}` : ""}`);
}

export async function createFakultas(data) {
  return await fetchApi("/fakultas", {
    method: "POST",
    body: data,
  });
}

export async function updateFakultas(id, data) {
  return await fetchApi(`/fakultas/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteFakultas(id) {
  return await fetchApi(`/fakultas/${id}`, {
    method: "DELETE",
  });
}

// Prodi Management
// params: { page, per_page, fakultas_id }
export async function getProdi({ page, per_page, fakultas_id } = {}) {
  const searchParams = new URLSearchParams();
  if (page !== undefined) searchParams.append("page", page);
  if (per_page !== undefined) searchParams.append("per_page", per_page);
  if (fakultas_id !== undefined)
    searchParams.append("fakultas_id", fakultas_id);
  const query = searchParams.toString();
  const data = await fetchApi(`/prodi${query ? `?${query}` : ""}`, {
    method: "GET",
  });
  return data.data;
}

export async function createProdi(data) {
  return await fetchApi("/prodi", {
    method: "POST",
    body: data,
  });
}

export async function updateProdi(id, data) {
  return await fetchApi(`/prodi/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteProdi(id) {
  return await fetchApi(`/prodi/${id}`, {
    method: "DELETE",
  });
}

// Jurusan Management
export async function getJurusan(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/jurusan${query ? `?${query}` : ""}`);
}

export async function createJurusan(data) {
  return await fetchApi("/jurusan", {
    method: "POST",
    body: data,
  });
}

export async function updateJurusan(id, data) {
  return await fetchApi(`/jurusan/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteJurusan(id) {
  return await fetchApi(`/jurusan/${id}`, {
    method: "DELETE",
  });
}

// Tahun Akademik Management
export async function getTahunAkademik(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  const data = await fetchApi(`/tahun-akademik${query ? `?${query}` : ""}`);
  return data.data;
}

export async function createTahunAkademik(data) {
  return await fetchApi("/tahun-akademik", {
    method: "POST",
    body: data,
  });
}

export async function updateTahunAkademik(id, data) {
  return await fetchApi(`/tahun-akademik/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteTahunAkademik(id) {
  return await fetchApi(`/tahun-akademik/${id}`, {
    method: "DELETE",
  });
}

export async function setTahunAkademikAktif(id) {
  return await fetchApi(`/tahun-akademik/${id}/set-aktif`, {
    method: "POST",
  });
}

// Dashboard APIs
export async function getDashboardFakultas(fakultasId) {
  return await fetchApi(`/dashboard/fakultas/${fakultasId}`);
}

export async function getDashboardProdi(prodiId) {
  return await fetchApi(`/dashboard/prodi/${prodiId}`);
}

export async function getDashboardDosen() {
  return await fetchApi("/dashboard/dosen");
}

export async function getDashboardMahasiswa() {
  return await fetchApi("/dashboard/mahasiswa");
}

// Dokumen Akademik Management
export async function getDokumenAkademik(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/dokumen-akademik${query ? `?${query}` : ""}`);
}

export async function getDokumenAkademikDetail(id) {
  return await fetchApi(`/dokumen-akademik/${id}`);
}

export async function approveDokumenAkademik(id) {
  return await fetchApi(`/dokumen-akademik/${id}/approve`, {
    method: "POST",
  });
}

export async function rejectDokumenAkademik(id, alasan = "") {
  return await fetchApi(`/dokumen-akademik/${id}/reject`, {
    method: "POST",
    body: alasan ? { alasan } : {},
  });
}

export async function uploadDokumenAkademik(formData) {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}/dokumen-akademik`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData
    );
  }

  return await response.json();
}

export async function deleteDokumenAkademik(id) {
  return await fetchApi(`/dokumen-akademik/${id}`, {
    method: "DELETE",
  });
}

// Lecturer Profile Management
export async function createDosenProfile(userId, profileData) {
  return await fetchApi(`/users/${userId}/profile-dosen`, {
    method: "POST",
    body: profileData,
  });
}

export async function updateDosenProfile(userId, profileData) {
  return await fetchApi(`/users/${userId}/profile-dosen`, {
    method: "PUT",
    body: profileData,
  });
}

export async function getDosenProfile(userId) {
  return await fetchApi(`/users/${userId}/profile-dosen`);
}

// TU Fakultas specific functions
export async function getTuFakultasDashboardStats() {
  try {
    // Get lecturer count
    const dosenData = await getAllDosen({
      search: searchTerm,
      ...(user?.fakultas_id && { fakultas_id: user.fakultas_id }),
    });

    // Ensure we have an array and filter only dosen (role_id === 3)
    const lecturers = Array.isArray(dosenData)
      ? dosenData.filter((d) => d.role_id === 6)
      : [];

    // Get faculty documents
    const documents = await getDokumenAkademik({ jenis_dokumen: "fakultas" });

    // Calculate stats
    const stats = {
      total_dosen: Array.isArray(lecturers) ? lecturers.length : 0,
      dokumen_pending: Array.isArray(documents)
        ? documents.filter((doc) => doc.status === "Pending").length
        : 0,
      dokumen_approved: Array.isArray(documents)
        ? documents.filter((doc) => doc.status === "Approved").length
        : 0,
      total_dokumen: Array.isArray(documents) ? documents.length : 0,
    };

    return stats;
  } catch (error) {
    console.error("Error fetching TU Fakultas dashboard stats:", error);
    throw error;
  }
}

// Document distribution functions
export async function distributeDocumentToDekan(
  documentId,
  dekanId,
  notes = ""
) {
  return await fetchApi(`/dokumen-akademik/${documentId}`, {
    method: "PUT",
    body: {
      approved_by: null, // Clear approved_by to reassign to Dekan
      assigned_to: dekanId,
      distribution_notes: notes,
      status: "Pending",
    },
  });
}

export async function getDistributionHistory(params = {}) {
  // Get documents that have been distributed (have approved_by or assigned_to)
  return await getDokumenAkademik({
    ...params,
    jenis_dokumen: "fakultas",
    distributed: true,
  });
}

// Create a lecturer with profile in one transaction
export async function createLecturerWithProfile(userData, profileData) {
  try {
    // First create the user account
    const user = await createUser({
      ...userData,
      role_id: 5, // Dosen role
    });

    // Then create the lecturer profile
    if (user && user.id) {
      await createDosenProfile(user.id, profileData);
    }

    return user;
  } catch (error) {
    console.error("Error creating lecturer with profile:", error);
    throw error;
  }
}

// Materi Kuliah Management (for Dosen)
export async function getMateriKuliah(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/materi-kuliah${query ? `?${query}` : ""}`);
}

export async function uploadMateriKuliah(formData) {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}/materi-kuliah`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData
    );
  }

  return await response.json();
}

export async function deleteMateriKuliah(id) {
  return await fetchApi(`/materi-kuliah/${id}`, {
    method: "DELETE",
  });
}

// Nilai Management (for Dosen)
export async function getNilai(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/nilai${query ? `?${query}` : ""}`);
}

export async function inputNilai(nilaiData) {
  return await fetchApi("/nilai", {
    method: "POST",
    body: nilaiData,
  });
}

export async function updateNilai(id, nilaiData) {
  return await fetchApi(`/nilai/${id}`, {
    method: "PUT",
    body: nilaiData,
  });
}

export async function finalizeNilai(id) {
  return await fetchApi(`/nilai/${id}/finalize`, {
    method: "POST",
  });
}

// Jadwal Kuliah for Dosen
export async function getJadwalKuliahByDosen(dosenId, params = {}) {
  const searchParams = new URLSearchParams();
  searchParams.append("dosen_id", dosenId);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/jadwal-kuliah${query ? `?${query}` : ""}`);
}

// KRS Management (for Mahasiswa)
export async function getKrsMahasiswa(mahasiswaId, params = {}) {
  const searchParams = new URLSearchParams();
  searchParams.append("mahasiswa_id", mahasiswaId);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/krs${query ? `?${query}` : ""}`);
}

export async function createKrs(krsData) {
  return await fetchApi("/krs", {
    method: "POST",
    body: krsData,
  });
}

export async function submitKrs(krsId) {
  return await fetchApi(`/krs/${krsId}/submit`, {
    method: "POST",
  });
}

export async function approveKrs(krsId) {
  return await fetchApi(`/krs/${krsId}/approve`, {
    method: "POST",
  });
}

export async function getKrsDetail(krsId) {
  return await fetchApi(`/krs/${krsId}`);
}

export async function deleteKrs(krsId) {
  return await fetchApi(`/krs/${krsId}`, {
    method: "DELETE",
  });
}

// KHS Management (for Mahasiswa)
export async function getKhsMahasiswa(mahasiswaId, params = {}) {
  const searchParams = new URLSearchParams();
  searchParams.append("mahasiswa_id", mahasiswaId);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/khs${query ? `?${query}` : ""}`);
}

export async function getKhsDetail(khsId) {
  return await fetchApi(`/khs/${khsId}`);
}

export async function downloadKhs(khsId) {
  const token = getStoredToken();

  const response = await fetch(`${API_BASE_URL}/khs/${khsId}/download`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new ApiError(`HTTP ${response.status}`, response.status, {
      message: "Failed to download KHS",
    });
  }

  return response.blob();
}

// Materi Kuliah Access (for Mahasiswa)
export async function getMateriKuliahByJadwal(jadwalKuliahId, params = {}) {
  const searchParams = new URLSearchParams();
  searchParams.append("jadwal_kuliah_id", jadwalKuliahId);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/materi-kuliah${query ? `?${query}` : ""}`);
}

// Document Academic for Mahasiswa (Proposal & Surat)
export async function uploadProposalSkripsi(formData) {
  const token = getStoredToken();

  // Add jenis_dokumen to formData
  formData.append("jenis_dokumen", "proposal");

  const response = await fetch(`${API_BASE_URL}/dokumen-akademik`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData
    );
  }

  return await response.json();
}

export async function uploadSuratPermintaan(formData, jenisSurat) {
  const token = getStoredToken();

  // Add jenis_dokumen to formData based on jenisSurat
  formData.append("jenis_dokumen", jenisSurat);

  const response = await fetch(`${API_BASE_URL}/dokumen-akademik`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData
    );
  }

  return await response.json();
}

// Get mahasiswa documents
export async function getMahasiswaDokumen(mahasiswaId, params = {}) {
  const searchParams = new URLSearchParams();
  searchParams.append("uploaded_by", mahasiswaId);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();
  return await fetchApi(`/dokumen-akademik${query ? `?${query}` : ""}`);
}

// Mock API handler for development
async function handleMockApi(endpoint, options = {}) {
  const { mockData, dashboardData, delay } = await import("./mock-data");

  // Simulate API delay
  await delay(200);

  const method = options.method || "GET";

  // Handle dashboard endpoints
  if (endpoint === "/dashboard/mahasiswa") {
    return dashboardData.mahasiswa;
  }

  if (endpoint === "/dashboard/dosen") {
    return dashboardData.dosen;
  }

  if (endpoint.startsWith("/dashboard/fakultas/")) {
    return dashboardData.dekan;
  }

  if (endpoint.startsWith("/dashboard/prodi/")) {
    return dashboardData.kaprodi;
  }

  if (endpoint === "/dashboard/super-admin") {
    return mockData.superAdminStats;
  }

  // Handle auth endpoints
  if (endpoint === "/auth/login") {
    const { email, password } = JSON.parse(options.body || "{}");
    if (email && password) {
      return {
        access_token: "mock_token_123",
        token_type: "Bearer",
        user: {
          id: 1,
          nama: "Test User",
          email: email,
          role_id: 7, // Mahasiswa
          fakultas_id: 1,
          prodi_id: 1,
        },
      };
    }
    throw new ApiError("Invalid credentials", 401, {});
  }

  if (endpoint === "/auth/me") {
    const storedUser = getStoredUser();
    if (storedUser) {
      return storedUser;
    }
    throw new ApiError("Unauthorized", 401, {});
  }

  // Handle KRS endpoints
  if (endpoint.startsWith("/krs")) {
    if (method === "GET") {
      return [
        {
          id: 1,
          mahasiswa_id: 1,
          tahun_akademik: { tahun: "2024/2025", semester: "Ganjil" },
          status: "Approved",
          details: [
            {
              jadwal_kuliah: {
                id: 1,
                mata_kuliah: {
                  id: 1,
                  nama_mk: "Pemrograman Web",
                  kode_mk: "TI301",
                  sks: 3,
                },
                dosen: { id: 1, nama: "Dr. Ahmad Rizki" },
                hari: "Senin",
                jam_mulai: "08:00",
                jam_selesai: "10:30",
                ruang: "Lab Komputer 1",
              },
            },
            {
              jadwal_kuliah: {
                id: 2,
                mata_kuliah: {
                  id: 2,
                  nama_mk: "Basis Data",
                  kode_mk: "TI302",
                  sks: 3,
                },
                dosen: { id: 2, nama: "Dr. Siti Aminah" },
                hari: "Rabu",
                jam_mulai: "10:30",
                jam_selesai: "13:00",
                ruang: "Lab Komputer 2",
              },
            },
          ],
        },
      ];
    }
  }

  // Handle materi kuliah endpoints
  if (endpoint.startsWith("/materi-kuliah")) {
    if (method === "GET") {
      return [
        {
          id: 1,
          judul: "Pengenalan HTML dan CSS",
          deskripsi: "Materi dasar HTML dan CSS untuk pemrograman web",
          file_path: "/uploads/materi/html-css-intro.pdf",
          created_at: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          judul: "JavaScript Fundamentals",
          deskripsi: "Konsep dasar JavaScript dan DOM manipulation",
          file_path: "/uploads/materi/js-fundamentals.pdf",
          created_at: "2024-01-20T14:30:00Z",
        },
        {
          id: 3,
          judul: "Framework CSS Bootstrap",
          deskripsi: "Menggunakan Bootstrap untuk responsive design",
          file_path: "/uploads/materi/bootstrap-tutorial.pdf",
          created_at: "2024-01-25T09:15:00Z",
        },
      ];
    }
  }

  // Handle other endpoints with mock data
  if (endpoint.startsWith("/users")) {
    if (method === "GET") {
      return mockData.users;
    }
  }

  if (endpoint.startsWith("/roles")) {
    if (method === "GET") {
      return mockData.roles;
    }
  }

  if (endpoint.startsWith("/fakultas")) {
    if (method === "GET") {
      return mockData.fakultas;
    }
  }

  if (endpoint.startsWith("/prodi")) {
    if (method === "GET") {
      return { data: mockData.prodi };
    }
  }

  if (endpoint.startsWith("/tahun-akademik")) {
    if (method === "GET") {
      return { data: mockData.tahunAkademik };
    }
  }

  // Default empty response for unhandled endpoints
  console.warn(`Mock API: Unhandled endpoint ${method} ${endpoint}`);
  return {};
}

export { ApiError };
