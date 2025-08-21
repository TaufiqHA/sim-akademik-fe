# API Integration - Dashboard Mahasiswa

## Overview
Dashboard mahasiswa telah diintegrasikan dengan API backend untuk mengambil data secara real-time.

## Konfigurasi API

### Environment Variables
File `.env.local` berisi konfigurasi API:
```
NEXT_PUBLIC_API_URL=https://edlynk.aon-mitrasolutions.com/api
NODE_ENV=development
```

### API Endpoint
Dashboard mahasiswa menggunakan endpoint: `GET /dashboard/mahasiswa`

Expected API response format:
```json
{
  "current_semester": "2024/2025 Ganjil",
  "total_sks": 120,
  "ipk": 3.45,
  "status_krs": "Approved",
  "mata_kuliah_semester": 6,
  "tugas_pending": 3
}
```

## Fitur yang Telah Diimplementasikan

### 1. API Connection Handler
- Automatic fallback ke mock data jika API tidak tersedia
- Error handling yang comprehensive
- Logging untuk debugging

### 2. Loading State
- Loading indicator saat mengambil data dari API
- User-friendly error messages

### 3. API Configuration Display
- Menampilkan status konfigurasi API
- Tombol test koneksi manual
- Debug information

### 4. Mock Data Fallback
- Data fallback otomatis jika API fail
- Seamless user experience

## Testing

### Manual Testing
1. Buka dashboard mahasiswa
2. Klik tombol "Test API Connection" 
3. Check browser console untuk detail respons
4. Verify data yang ditampilkan di dashboard

### Expected Behavior
- ✅ Jika API tersedia: Data diambil dari API backend
- ✅ Jika API tidak tersedia: Menggunakan mock data dengan peringatan
- ✅ Loading state ditampilkan selama request
- ✅ Error handling yang baik

## Files Modified

1. `src/app/dashboard/mahasiswa/mahasiswa-dashboard.jsx` - Main dashboard component
2. `src/lib/api.js` - API functions (existing)
3. `src/lib/api-test.js` - API testing utilities (new)
4. `src/lib/mock-data.js` - Mock data (existing)
5. `.env.local` - Environment configuration (new)

## API Integration Status

### ✅ Dashboard Mahasiswa - COMPLETED
- Endpoint: `/dashboard/mahasiswa`
- Data fetching dan error handling
- Loading states dan configuration display
- Test utilities

### ✅ Dashboard Kaprodi - COMPLETED
- Endpoint: `/dashboard/prodi/{id}` (sesuai sim.json spec)
- Data fields: `total_jurusan`, `total_mahasiswa`, `total_dosen`
- Error handling dan fallback ke mock data
- Loading states dan configuration display
- Test utilities dengan prodi_id parameter

### ✅ Kaprodi Nilai Management - COMPLETED
- Endpoint: `/jadwal-kuliah?prodi_id={id}` untuk list jadwal kuliah
- Endpoint: `/nilai?jadwal_kuliah_id={id}` untuk list nilai per jadwal
- Endpoint: `/nilai/{id}/finalize` untuk finalisasi nilai
- Error handling dan fallback ke mock data
- Real-time state updates setelah API calls
- Development API status display

## Kaprodi Dashboard API Details

### Endpoint: `GET /dashboard/prodi/{id}`
Expected response format sesuai sim.json:
```json
{
  "total_jurusan": 3,
  "total_mahasiswa": 145,
  "total_dosen": 12
}
```

### Testing
1. Buka dashboard kaprodi
2. Klik tombol "Test Kaprodi API Connection"
3. Check browser console untuk detail respons
4. Verify prodi_id tersedia di user context

## Kaprodi Nilai Management API Details

### Endpoint: `GET /jadwal-kuliah?prodi_id={id}`
Load jadwal kuliah untuk prodi tertentu:
```json
[
  {
    "id": 1,
    "mata_kuliah": {
      "kode_mk": "IF301",
      "nama_mk": "Pemrograman Web"
    },
    "dosen": {
      "nama": "Dr. Ahmad Rizki"
    },
    "ruang": "Lab Komputer A",
    "hari": "Senin"
  }
]
```

### Endpoint: `GET /nilai?jadwal_kuliah_id={id}`
Load nilai mahasiswa untuk jadwal kuliah tertentu:
```json
[
  {
    "id": 1,
    "mahasiswa": {
      "nama": "John Doe",
      "nim": "2020001"
    },
    "tugas": 85,
    "uts": 80,
    "uas": 88,
    "nilai_akhir": 84.5,
    "status": "pending"
  }
]
```

### Endpoint: `POST /nilai/{id}/finalize`
Finalisasi nilai mahasiswa sesuai sim.json spec.

## Next Steps

Dashboard role lain yang belum diintegrasikan:
- `/dashboard/dosen`
- `/dashboard/fakultas/{fakultasId}`
