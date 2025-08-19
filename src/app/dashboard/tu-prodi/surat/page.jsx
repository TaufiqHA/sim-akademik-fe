"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconPlus, IconEye, IconDownload, IconCheck, IconX, IconSearch, IconFile, IconFileText, IconCertificate } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

export default function PengajuanSuratPage() {
  const [suratList, setSuratList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedSurat, setSelectedSurat] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock data for Pengajuan Surat
  const mockSurat = [
    {
      id: 1,
      jenis_dokumen: "surat_keterangan_aktif",
      nama_surat: "Surat Keterangan Aktif Kuliah",
      pemohon_id: 1,
      pemohon_nama: "Ahmad Rizki Pratama",
      pemohon_nim: "2021001",
      keperluan: "Untuk persyaratan beasiswa",
      file_path: "/documents/surat_keterangan_aktif_1.pdf",
      uploaded_by: 1,
      approved_by: null,
      status: "Pending",
      created_at: "2024-01-15",
      updated_at: "2024-01-15",
      keterangan: "Surat untuk keperluan beasiswa mahasiswa"
    },
    {
      id: 2,
      jenis_dokumen: "surat_rekomendasi",
      nama_surat: "Surat Rekomendasi",
      pemohon_id: 2,
      pemohon_nama: "Siti Nurhaliza",
      pemohon_nim: "2021002",
      keperluan: "Untuk magang di PT. ABC",
      file_path: "/documents/surat_rekomendasi_2.pdf",
      uploaded_by: 2,
      approved_by: 4,
      status: "Approved",
      created_at: "2024-01-10",
      updated_at: "2024-01-12",
      keterangan: "Surat rekomendasi untuk program magang"
    },
    {
      id: 3,
      jenis_dokumen: "surat_cuti",
      nama_surat: "Surat Pengajuan Cuti Akademik",
      pemohon_id: 3,
      pemohon_nama: "Budi Santoso",
      pemohon_nim: "2020003",
      keperluan: "Cuti karena sakit",
      file_path: "/documents/surat_cuti_3.pdf",
      uploaded_by: 3,
      approved_by: null,
      status: "Rejected",
      created_at: "2024-01-08",
      updated_at: "2024-01-09",
      keterangan: "Dokumen pendukung belum lengkap"
    }
  ]

  useEffect(() => {
    setSuratList(mockSurat)
  }, [])

  const [formData, setFormData] = useState({
    jenis_dokumen: "",
    nama_surat: "",
    pemohon_id: "",
    pemohon_nama: "",
    pemohon_nim: "",
    keperluan: "",
    keterangan: "",
    file: null
  })

  const jenisSurat = [
    { value: "surat_keterangan_aktif", label: "Surat Keterangan Aktif Kuliah" },
    { value: "surat_rekomendasi", label: "Surat Rekomendasi" },
    { value: "surat_cuti", label: "Surat Pengajuan Cuti Akademik" },
    { value: "surat_pindah", label: "Surat Keterangan Pindah" },
    { value: "surat_dispensasi", label: "Surat Dispensasi" },
    { value: "surat_penelitian", label: "Surat Izin Penelitian" },
    { value: "surat_magang", label: "Surat Pengantar Magang" },
    { value: "legalisir_ijazah", label: "Legalisir Ijazah" },
    { value: "legalisir_transkrip", label: "Legalisir Transkrip Nilai" }
  ]

  const filteredSurat = suratList.filter(surat =>
    surat.nama_surat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surat.pemohon_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surat.pemohon_nim.includes(searchTerm) ||
    surat.keperluan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = async () => {
    setLoading(true)
    try {
      // Simulate file upload and API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newSurat = {
        id: suratList.length + 1,
        ...formData,
        file_path: formData.file ? `/documents/${formData.file.name}` : null,
        uploaded_by: 5, // TU PRODI user
        approved_by: null,
        status: "Pending",
        created_at: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString().split('T')[0]
      }
      
      setSuratList([...suratList, newSurat])
      setFormData({
        jenis_dokumen: "",
        nama_surat: "",
        pemohon_id: "",
        pemohon_nama: "",
        pemohon_nim: "",
        keperluan: "",
        keterangan: "",
        file: null
      })
      setIsAddDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Pengajuan surat berhasil ditambahkan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan pengajuan surat",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuratList(suratList.map(surat => 
        surat.id === id 
          ? { 
              ...surat, 
              status: "Approved", 
              approved_by: 5,
              updated_at: new Date().toISOString().split('T')[0]
            }
          : surat
      ))
      
      toast({
        title: "Berhasil",
        description: "Pengajuan surat berhasil disetujui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyetujui pengajuan surat",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id) => {
    const keterangan = prompt("Masukkan alasan penolakan:")
    if (!keterangan) return
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuratList(suratList.map(surat => 
        surat.id === id 
          ? { 
              ...surat, 
              status: "Rejected", 
              approved_by: 5,
              keterangan: keterangan,
              updated_at: new Date().toISOString().split('T')[0]
            }
          : surat
      ))
      
      toast({
        title: "Berhasil",
        description: "Pengajuan surat ditolak",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menolak pengajuan surat",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({...formData, file})
    }
  }

  const handleJenisChange = (value) => {
    const selectedJenis = jenisSurat.find(j => j.value === value)
    setFormData({
      ...formData, 
      jenis_dokumen: value,
      nama_surat: selectedJenis ? selectedJenis.label : ""
    })
  }

  const getStatusBadge = (status) => {
    const variants = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Approved": "bg-green-100 text-green-800",
      "Rejected": "bg-red-100 text-red-800"
    }
    return (
      <Badge className={variants[status] || "bg-gray-100 text-gray-800"}>
        {status === "Pending" ? "Menunggu" : status === "Approved" ? "Disetujui" : "Ditolak"}
      </Badge>
    )
  }

  const getJenisIcon = (jenis) => {
    if (jenis.includes("legalisir")) return IconCertificate
    if (jenis.includes("surat")) return IconFileText
    return IconFile
  }

  const openDetailDialog = (surat) => {
    setSelectedSurat(surat)
    setIsDetailDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengajuan Surat</h1>
          <p className="text-muted-foreground">
            Kelola pengajuan surat dan dokumen akademik mahasiswa
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Pengajuan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Pengajuan Surat</DialogTitle>
              <DialogDescription>
                Tambahkan pengajuan surat atau dokumen akademik baru
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="jenis_dokumen">Jenis Dokumen</Label>
                <Select value={formData.jenis_dokumen} onValueChange={handleJenisChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisSurat.map((jenis) => (
                      <SelectItem key={jenis.value} value={jenis.value}>
                        {jenis.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nama_surat">Nama Surat</Label>
                <Input
                  id="nama_surat"
                  value={formData.nama_surat}
                  onChange={(e) => setFormData({...formData, nama_surat: e.target.value})}
                  placeholder="Nama surat akan terisi otomatis"
                  disabled
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="pemohon_nim">NIM Pemohon</Label>
                  <Input
                    id="pemohon_nim"
                    value={formData.pemohon_nim}
                    onChange={(e) => setFormData({...formData, pemohon_nim: e.target.value})}
                    placeholder="NIM mahasiswa"
                  />
                </div>
                <div>
                  <Label htmlFor="pemohon_nama">Nama Pemohon</Label>
                  <Input
                    id="pemohon_nama"
                    value={formData.pemohon_nama}
                    onChange={(e) => setFormData({...formData, pemohon_nama: e.target.value})}
                    placeholder="Nama mahasiswa"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keperluan">Keperluan</Label>
                <Textarea
                  id="keperluan"
                  value={formData.keperluan}
                  onChange={(e) => setFormData({...formData, keperluan: e.target.value})}
                  placeholder="Jelaskan keperluan surat..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                  placeholder="Keterangan tambahan (opsional)..."
                  className="min-h-[60px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Upload Dokumen Pendukung</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  Format yang didukung: PDF, DOC, DOCX, JPG, PNG (Max 5MB)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAdd} disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Pengajuan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Daftar Pengajuan Surat</CardTitle>
              <CardDescription>
                Total: {suratList.length} pengajuan
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pengajuan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Dokumen</TableHead>
                <TableHead>Pemohon</TableHead>
                <TableHead>Keperluan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurat.map((surat) => {
                const IconComponent = getJenisIcon(surat.jenis_dokumen)
                return (
                  <TableRow key={surat.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <IconComponent className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{surat.nama_surat}</p>
                          <p className="text-xs text-muted-foreground">{surat.jenis_dokumen}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{surat.pemohon_nama}</p>
                        <p className="text-sm text-muted-foreground">{surat.pemohon_nim}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate" title={surat.keperluan}>
                        {surat.keperluan}
                      </p>
                    </TableCell>
                    <TableCell>
                      {new Date(surat.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>{getStatusBadge(surat.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDetailDialog(surat)}
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                        {surat.file_path && (
                          <Button variant="outline" size="sm">
                            <IconDownload className="h-4 w-4" />
                          </Button>
                        )}
                        {surat.status === "Pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApprove(surat.id)}
                              disabled={loading}
                            >
                              <IconCheck className="h-4 w-4 mr-1" />
                              Setujui
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(surat.id)}
                              disabled={loading}
                            >
                              <IconX className="h-4 w-4 mr-1" />
                              Tolak
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredSurat.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Tidak ada pengajuan surat yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detail Pengajuan Surat</DialogTitle>
            <DialogDescription>
              Informasi lengkap pengajuan surat
            </DialogDescription>
          </DialogHeader>
          {selectedSurat && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="font-semibold">Jenis Dokumen</Label>
                <p className="text-sm">{selectedSurat.nama_surat}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-semibold">NIM Pemohon</Label>
                  <p className="text-sm">{selectedSurat.pemohon_nim}</p>
                </div>
                <div className="grid gap-2">
                  <Label className="font-semibold">Nama Pemohon</Label>
                  <p className="text-sm">{selectedSurat.pemohon_nama}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="font-semibold">Keperluan</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedSurat.keperluan}</p>
              </div>
              {selectedSurat.keterangan && (
                <div className="grid gap-2">
                  <Label className="font-semibold">Keterangan</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedSurat.keterangan}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-semibold">Status</Label>
                  {getStatusBadge(selectedSurat.status)}
                </div>
                <div className="grid gap-2">
                  <Label className="font-semibold">Tanggal Pengajuan</Label>
                  <p className="text-sm">{new Date(selectedSurat.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              {selectedSurat.updated_at !== selectedSurat.created_at && (
                <div className="grid gap-2">
                  <Label className="font-semibold">Terakhir Diperbarui</Label>
                  <p className="text-sm">{new Date(selectedSurat.updated_at).toLocaleDateString('id-ID')}</p>
                </div>
              )}
              {selectedSurat.file_path && (
                <div className="grid gap-2">
                  <Label className="font-semibold">Dokumen Pendukung</Label>
                  <div className="flex items-center gap-2">
                    <IconFile className="h-4 w-4 text-blue-600" />
                    <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                      {selectedSurat.file_path.split('/').pop()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Tutup
            </Button>
            {selectedSurat?.status === "Pending" && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleApprove(selectedSurat.id)
                    setIsDetailDialogOpen(false)
                  }}
                  disabled={loading}
                >
                  <IconCheck className="h-4 w-4 mr-1" />
                  Setujui
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleReject(selectedSurat.id)
                    setIsDetailDialogOpen(false)
                  }}
                  disabled={loading}
                >
                  <IconX className="h-4 w-4 mr-1" />
                  Tolak
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Pengajuan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suratList.length}</div>
            <p className="text-xs text-muted-foreground">Semua pengajuan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Menunggu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {suratList.filter(s => s.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Perlu review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Disetujui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {suratList.filter(s => s.status === "Approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Telah disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Ditolak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {suratList.filter(s => s.status === "Rejected").length}
            </div>
            <p className="text-xs text-muted-foreground">Ditolak</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
