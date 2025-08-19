// Mock data for development when API server is not available

export const mockData = {
  users: [
    {
      id: 1,
      nama: "Super Admin",
      email: "admin@example.com",
      role_id: 1,
      fakultas_id: null,
      prodi_id: null,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      nama: "Dekan FKIP",
      email: "dekan@fkip.example.com",
      role_id: 2,
      fakultas_id: 1,
      prodi_id: null,
      created_at: "2024-01-02T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z"
    },
    {
      id: 3,
      nama: "Kaprodi Informatika",
      email: "kaprodi@informatika.example.com",
      role_id: 3,
      fakultas_id: 1,
      prodi_id: 1,
      created_at: "2024-01-03T00:00:00Z",
      updated_at: "2024-01-03T00:00:00Z"
    }
  ],
  
  roles: [
    { id: 1, nama_role: "Super Admin" },
    { id: 2, nama_role: "Dekan" },
    { id: 3, nama_role: "Kaprodi" },
    { id: 4, nama_role: "TU Fakultas" },
    { id: 5, nama_role: "TU Prodi" },
    { id: 6, nama_role: "Dosen" },
    { id: 7, nama_role: "Mahasiswa" }
  ],
  
  fakultas: [
    { id: 1, nama_fakultas: "Fakultas Keguruan dan Ilmu Pendidikan" },
    { id: 2, nama_fakultas: "Fakultas Ekonomi dan Bisnis" },
    { id: 3, nama_fakultas: "Fakultas Teknik" },
    { id: 4, nama_fakultas: "Fakultas Hukum" }
  ],
  
  prodi: [
    { id: 1, fakultas_id: 1, nama_prodi: "Pendidikan Informatika" },
    { id: 2, fakultas_id: 1, nama_prodi: "Pendidikan Matematika" },
    { id: 3, fakultas_id: 2, nama_prodi: "Manajemen" },
    { id: 4, fakultas_id: 2, nama_prodi: "Akuntansi" },
    { id: 5, fakultas_id: 3, nama_prodi: "Teknik Informatika" },
    { id: 6, fakultas_id: 3, nama_prodi: "Teknik Sipil" }
  ],
  
  jurusan: [
    { id: 1, nama_jurusan: "Pendidikan Teknologi Informasi" },
    { id: 2, nama_jurusan: "Pendidikan Sains" },
    { id: 3, nama_jurusan: "Bisnis dan Ekonomi" },
    { id: 4, nama_jurusan: "Teknik dan Teknologi" }
  ],
  
  tahunAkademik: [
    {
      id: 1,
      nama_tahun: "2024/2025 Ganjil",
      tanggal_mulai: "2024-08-01",
      tanggal_selesai: "2025-01-31",
      is_aktif: true
    },
    {
      id: 2,
      nama_tahun: "2023/2024 Genap",
      tanggal_mulai: "2024-02-01",
      tanggal_selesai: "2024-07-31",
      is_aktif: false
    },
    {
      id: 3,
      nama_tahun: "2023/2024 Ganjil",
      tanggal_mulai: "2023-08-01",
      tanggal_selesai: "2024-01-31",
      is_aktif: false
    }
  ],
  
  superAdminStats: {
    total_user: 156,
    total_fakultas: 4,
    total_prodi: 12,
    total_mahasiswa: 1234,
    total_dosen: 89
  },

  mahasiswaDashboard: {
    current_semester: "2024/2025 Ganjil",
    total_sks: 120,
    ipk: 3.45,
    status_krs: "Approved",
    mata_kuliah_semester: 6,
    tugas_pending: 3
  },

  dosenDashboard: {
    mata_kuliah_diampu: 4,
    mahasiswa_bimbingan: 8,
    tugas_pending: 12,
    jadwal_hari_ini: 3
  },

  kaprodiDashboard: {
    total_mahasiswa: 145,
    mahasiswa_aktif: 132,
    total_dosen: 12,
    proposal_pending: 8,
    skripsi_progress: 23,
    yudisium_siap: 5
  },

  dekanDashboard: {
    total_prodi: 6,
    total_mahasiswa: 890,
    total_dosen: 45,
    dokumen_pending: 12,
    persetujuan_pending: 8
  }
}

// Helper functions to simulate API delays and filtering
export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const filterData = (data, params = {}) => {
  let result = [...data]
  
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    result = result.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchLower)
      )
    )
  }
  
  if (params.role_id) {
    result = result.filter(item => item.role_id === parseInt(params.role_id))
  }
  
  if (params.fakultas_id) {
    result = result.filter(item => item.fakultas_id === parseInt(params.fakultas_id))
  }
  
  return result
}

// Generate unique IDs for new items
export const getNextId = (data) => {
  return Math.max(...data.map(item => item.id), 0) + 1
}

// Enhanced mock dashboard data
export const dashboardData = {
  mahasiswa: {
    current_semester: "2024/2025 Ganjil",
    total_sks: 120,
    ipk: 3.45,
    status_krs: "Approved",
    mata_kuliah_semester: 6,
    tugas_pending: 3
  },
  dosen: {
    mata_kuliah_diampu: 4,
    mahasiswa_bimbingan: 8,
    tugas_pending: 12,
    jadwal_hari_ini: 3
  },
  kaprodi: {
    total_mahasiswa: 145,
    mahasiswa_aktif: 132,
    total_dosen: 12,
    proposal_pending: 8,
    skripsi_progress: 23,
    yudisium_siap: 5
  },
  dekan: {
    total_prodi: 6,
    total_mahasiswa: 890,
    total_dosen: 45,
    dokumen_pending: 12,
    persetujuan_pending: 8
  }
}
