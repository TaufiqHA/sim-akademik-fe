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
    },
    {
      id: 4,
      nama: "Budi Dosen",
      email: "dosen@simak.test",
      role_id: 6,
      fakultas_id: 3,
      prodi_id: 5,
      created_at: "2024-01-04T00:00:00Z",
      updated_at: "2024-01-04T00:00:00Z"
    },
    {
      id: 5,
      nama: "Mega Update",
      email: "mega@mail.com",
      role_id: 6,
      fakultas_id: 3,
      prodi_id: 6,
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-05T00:00:00Z"
    },
    {
      id: 6,
      nama: "Dr. Ahmad Rizki",
      email: "ahmad@teknik.edu",
      role_id: 6,
      fakultas_id: 3,
      prodi_id: 5,
      created_at: "2024-01-06T00:00:00Z",
      updated_at: "2024-01-06T00:00:00Z"
    },
    {
      id: 7,
      nama: "Dr. Siti Aminah",
      email: "siti@teknik.edu",
      role_id: 6,
      fakultas_id: 3,
      prodi_id: 6,
      created_at: "2024-01-07T00:00:00Z",
      updated_at: "2024-01-07T00:00:00Z"
    },
    {
      id: 8,
      nama: "Prof. Andi Wijaya",
      email: "andi@teknik.edu",
      role_id: 6,
      fakultas_id: 3,
      prodi_id: 5,
      created_at: "2024-01-08T00:00:00Z",
      updated_at: "2024-01-08T00:00:00Z"
    },
    {
      id: 9,
      nama: "Dr. Maya Sari",
      email: "maya@teknik.edu",
      role_id: 6,
      fakultas_id: 3,
      prodi_id: 6,
      created_at: "2024-01-09T00:00:00Z",
      updated_at: "2024-01-09T00:00:00Z"
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
      tahun: "2024/2025",
      semester: "Ganjil",
      periode_krs_mulai: "2024-08-01",
      periode_krs_selesai: "2024-08-15",
      periode_nilai_mulai: "2024-12-01",
      periode_nilai_selesai: "2025-01-31",
      is_aktif: true
    },
    {
      id: 2,
      tahun: "2023/2024",
      semester: "Genap",
      periode_krs_mulai: "2024-02-01",
      periode_krs_selesai: "2024-02-15",
      periode_nilai_mulai: "2024-06-01",
      periode_nilai_selesai: "2024-07-31",
      is_aktif: false
    },
    {
      id: 3,
      tahun: "2023/2024",
      semester: "Ganjil",
      periode_krs_mulai: "2023-08-01",
      periode_krs_selesai: "2023-08-15",
      periode_nilai_mulai: "2023-12-01",
      periode_nilai_selesai: "2024-01-31",
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

  // Handle both 'search' and 'q' parameters for search functionality
  const searchTerm = params.search || params.q;
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase()
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
    total_jurusan: 3,
    total_mahasiswa: 145,
    total_dosen: 12
  },
  dekan: {
    total_prodi: 6,
    total_mahasiswa: 890,
    total_dosen: 45,
    dokumen_pending: 12,
    persetujuan_pending: 8
  }
}

// Mock data untuk jadwal kuliah
export const mockJadwalKuliah = [
  {
    id: 1,
    mata_kuliah_id: 1,
    dosen_id: 4,
    ruang: "Lab Komputer A",
    hari: "Senin",
    jam_mulai: "08:00",
    jam_selesai: "10:30",
    tahun_akademik_id: 1,
    mata_kuliah: {
      id: 1,
      kode_mk: "IF301",
      nama_mk: "Pemrograman Web",
      sks: 3,
      prodi_id: 5
    },
    dosen: {
      id: 4,
      nama: "Dr. Ahmad Rizki",
      email: "ahmad@teknik.edu"
    }
  },
  {
    id: 2,
    mata_kuliah_id: 2,
    dosen_id: 7,
    ruang: "Lab Komputer B",
    hari: "Selasa",
    jam_mulai: "10:30",
    jam_selesai: "13:00",
    tahun_akademik_id: 1,
    mata_kuliah: {
      id: 2,
      kode_mk: "IF302",
      nama_mk: "Basis Data",
      sks: 3,
      prodi_id: 5
    },
    dosen: {
      id: 7,
      nama: "Dr. Siti Aminah",
      email: "siti@teknik.edu"
    }
  },
  {
    id: 3,
    mata_kuliah_id: 3,
    dosen_id: 8,
    ruang: "Ruang 203",
    hari: "Rabu",
    jam_mulai: "14:00",
    jam_selesai: "16:30",
    tahun_akademik_id: 1,
    mata_kuliah: {
      id: 3,
      kode_mk: "IF303",
      nama_mk: "Sistem Operasi",
      sks: 3,
      prodi_id: 5
    },
    dosen: {
      id: 8,
      nama: "Prof. Andi Wijaya",
      email: "andi@teknik.edu"
    }
  }
];

// Mock data untuk nilai
export const mockNilai = [
  {
    id: 1,
    mahasiswa_id: 10,
    jadwal_kuliah_id: 1,
    tugas: 85,
    uts: 80,
    uas: 88,
    nilai_akhir: 84.5,
    status: "pending",
    mahasiswa: {
      id: 10,
      nama: "John Doe",
      nim: "2020001",
      email: "john@student.edu"
    }
  },
  {
    id: 2,
    mahasiswa_id: 11,
    jadwal_kuliah_id: 1,
    tugas: 90,
    uts: 85,
    uas: 92,
    nilai_akhir: 89.0,
    status: "finalized",
    mahasiswa: {
      id: 11,
      nama: "Jane Smith",
      nim: "2020002",
      email: "jane@student.edu"
    }
  },
  {
    id: 3,
    mahasiswa_id: 12,
    jadwal_kuliah_id: 1,
    tugas: 78,
    uts: 75,
    uas: 80,
    nilai_akhir: 77.5,
    status: "pending",
    mahasiswa: {
      id: 12,
      nama: "Bob Wilson",
      nim: "2020003",
      email: "bob@student.edu"
    }
  },
  {
    id: 4,
    mahasiswa_id: 10,
    jadwal_kuliah_id: 2,
    tugas: 88,
    uts: 82,
    uas: 90,
    nilai_akhir: 86.8,
    status: "finalized",
    mahasiswa: {
      id: 10,
      nama: "John Doe",
      nim: "2020001",
      email: "john@student.edu"
    }
  },
  {
    id: 5,
    mahasiswa_id: 11,
    jadwal_kuliah_id: 2,
    tugas: 85,
    uts: 88,
    uas: 87,
    nilai_akhir: 86.6,
    status: "pending",
    mahasiswa: {
      id: 11,
      nama: "Jane Smith",
      nim: "2020002",
      email: "jane@student.edu"
    }
  }
];
