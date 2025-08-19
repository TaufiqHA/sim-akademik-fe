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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { IconPlus, IconPencil, IconTrash, IconSearch, IconCalendar, IconClock } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

export default function JadwalPage() {
  const [jadwalKuliah, setJadwalKuliah] = useState([])
  const [jadwalUjian, setJadwalUjian] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isKuliahDialogOpen, setIsKuliahDialogOpen] = useState(false)
  const [isUjianDialogOpen, setIsUjianDialogOpen] = useState(false)
  const [isEditKuliahDialogOpen, setIsEditKuliahDialogOpen] = useState(false)
  const [isEditUjianDialogOpen, setIsEditUjianDialogOpen] = useState(false)
  const [selectedJadwal, setSelectedJadwal] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock data for Jadwal Kuliah
  const mockJadwalKuliah = [
    {
      id: 1,
      mata_kuliah: "Pemrograman Web",
      kode_mk: "IF101",
      dosen: "Dr. Andi Susanto",
      ruang: "Lab A-201",
      hari: "Senin",
      jam_mulai: "08:00",
      jam_selesai: "10:00",
      sks: 3,
      tahun_akademik: "2024/2025 Ganjil"
    },
    {
      id: 2,
      mata_kuliah: "Basis Data",
      kode_mk: "IF102", 
      dosen: "Prof. Sari Wijaya",
      ruang: "A-102",
      hari: "Selasa",
      jam_mulai: "13:00",
      jam_selesai: "15:00",
      sks: 3,
      tahun_akademik: "2024/2025 Ganjil"
    },
    {
      id: 3,
      mata_kuliah: "Algoritma",
      kode_mk: "IF103",
      dosen: "Dr. Budi Rahman",
      ruang: "B-201",
      hari: "Rabu",
      jam_mulai: "10:00", 
      jam_selesai: "12:00",
      sks: 2,
      tahun_akademik: "2024/2025 Ganjil"
    }
  ]

  // Mock data for Jadwal Ujian
  const mockJadwalUjian = [
    {
      id: 1,
      mata_kuliah: "Pemrograman Web",
      kode_mk: "IF101",
      dosen: "Dr. Andi Susanto",
      ruang: "A-301",
      tanggal: "2024-06-15",
      jam_mulai: "08:00",
      jam_selesai: "10:00",
      jenis_ujian: "UTS",
      tahun_akademik: "2024/2025 Ganjil"
    },
    {
      id: 2,
      mata_kuliah: "Basis Data", 
      kode_mk: "IF102",
      dosen: "Prof. Sari Wijaya",
      ruang: "A-302",
      tanggal: "2024-06-16",
      jam_mulai: "13:00",
      jam_selesai: "15:00",
      jenis_ujian: "UAS",
      tahun_akademik: "2024/2025 Ganjil"
    }
  ]

  useEffect(() => {
    setJadwalKuliah(mockJadwalKuliah)
    setJadwalUjian(mockJadwalUjian)
  }, [])

  const [kuliahFormData, setKuliahFormData] = useState({
    mata_kuliah: "",
    kode_mk: "",
    dosen: "",
    ruang: "",
    hari: "",
    jam_mulai: "",
    jam_selesai: "",
    sks: ""
  })

  const [ujianFormData, setUjianFormData] = useState({
    mata_kuliah: "",
    kode_mk: "",
    dosen: "",
    ruang: "",
    tanggal: "",
    jam_mulai: "",
    jam_selesai: "",
    jenis_ujian: ""
  })

  const filteredJadwalKuliah = jadwalKuliah.filter(jadwal =>
    jadwal.mata_kuliah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.kode_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.dosen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.ruang.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredJadwalUjian = jadwalUjian.filter(jadwal =>
    jadwal.mata_kuliah.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.kode_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.dosen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.ruang.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddKuliah = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newJadwal = {
        id: jadwalKuliah.length + 1,
        ...kuliahFormData,
        sks: parseInt(kuliahFormData.sks),
        tahun_akademik: "2024/2025 Ganjil"
      }
      
      setJadwalKuliah([...jadwalKuliah, newJadwal])
      setKuliahFormData({
        mata_kuliah: "",
        kode_mk: "",
        dosen: "",
        ruang: "",
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
        sks: ""
      })
      setIsKuliahDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Jadwal kuliah berhasil ditambahkan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan jadwal kuliah",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUjian = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newJadwal = {
        id: jadwalUjian.length + 1,
        ...ujianFormData,
        tahun_akademik: "2024/2025 Ganjil"
      }
      
      setJadwalUjian([...jadwalUjian, newJadwal])
      setUjianFormData({
        mata_kuliah: "",
        kode_mk: "",
        dosen: "",
        ruang: "",
        tanggal: "",
        jam_mulai: "",
        jam_selesai: "",
        jenis_ujian: ""
      })
      setIsUjianDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Jadwal ujian berhasil ditambahkan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan jadwal ujian",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditKuliah = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setJadwalKuliah(jadwalKuliah.map(jadwal => 
        jadwal.id === selectedJadwal.id 
          ? { ...jadwal, ...kuliahFormData, sks: parseInt(kuliahFormData.sks) }
          : jadwal
      ))
      
      setKuliahFormData({
        mata_kuliah: "",
        kode_mk: "",
        dosen: "",
        ruang: "",
        hari: "",
        jam_mulai: "",
        jam_selesai: "",
        sks: ""
      })
      setSelectedJadwal(null)
      setIsEditKuliahDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Jadwal kuliah berhasil diperbarui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui jadwal kuliah",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditUjian = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setJadwalUjian(jadwalUjian.map(jadwal => 
        jadwal.id === selectedJadwal.id 
          ? { ...jadwal, ...ujianFormData }
          : jadwal
      ))
      
      setUjianFormData({
        mata_kuliah: "",
        kode_mk: "",
        dosen: "",
        ruang: "",
        tanggal: "",
        jam_mulai: "",
        jam_selesai: "",
        jenis_ujian: ""
      })
      setSelectedJadwal(null)
      setIsEditUjianDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Jadwal ujian berhasil diperbarui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui jadwal ujian", 
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteKuliah = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal kuliah ini?")) return
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setJadwalKuliah(jadwalKuliah.filter(jadwal => jadwal.id !== id))
      
      toast({
        title: "Berhasil",
        description: "Jadwal kuliah berhasil dihapus",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus jadwal kuliah",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUjian = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jadwal ujian ini?")) return
    
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setJadwalUjian(jadwalUjian.filter(jadwal => jadwal.id !== id))
      
      toast({
        title: "Berhasil",
        description: "Jadwal ujian berhasil dihapus",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus jadwal ujian",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openEditKuliahDialog = (jadwal) => {
    setSelectedJadwal(jadwal)
    setKuliahFormData({
      mata_kuliah: jadwal.mata_kuliah,
      kode_mk: jadwal.kode_mk,
      dosen: jadwal.dosen,
      ruang: jadwal.ruang,
      hari: jadwal.hari,
      jam_mulai: jadwal.jam_mulai,
      jam_selesai: jadwal.jam_selesai,
      sks: jadwal.sks.toString()
    })
    setIsEditKuliahDialogOpen(true)
  }

  const openEditUjianDialog = (jadwal) => {
    setSelectedJadwal(jadwal)
    setUjianFormData({
      mata_kuliah: jadwal.mata_kuliah,
      kode_mk: jadwal.kode_mk,
      dosen: jadwal.dosen,
      ruang: jadwal.ruang,
      tanggal: jadwal.tanggal,
      jam_mulai: jadwal.jam_mulai,
      jam_selesai: jadwal.jam_selesai,
      jenis_ujian: jadwal.jenis_ujian
    })
    setIsEditUjianDialogOpen(true)
  }

  const getJenisUjianBadge = (jenis) => {
    const colors = {
      "UTS": "bg-blue-100 text-blue-800",
      "UAS": "bg-green-100 text-green-800", 
      "Quiz": "bg-yellow-100 text-yellow-800",
      "Tugas": "bg-purple-100 text-purple-800"
    }
    return (
      <Badge className={colors[jenis] || "bg-gray-100 text-gray-800"}>
        {jenis}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Jadwal Kuliah & Ujian</h1>
        <p className="text-muted-foreground">
          Kelola jadwal kuliah dan ujian program studi
        </p>
      </div>

      <Tabs defaultValue="kuliah" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kuliah">Jadwal Kuliah</TabsTrigger>
          <TabsTrigger value="ujian">Jadwal Ujian</TabsTrigger>
        </TabsList>

        <TabsContent value="kuliah" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Jadwal Kuliah</CardTitle>
                  <CardDescription>
                    Kelola jadwal kuliah semester aktif
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari jadwal..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Dialog open={isKuliahDialogOpen} onOpenChange={setIsKuliahDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Tambah Jadwal
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Tambah Jadwal Kuliah</DialogTitle>
                        <DialogDescription>
                          Tambahkan jadwal kuliah baru
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="mata_kuliah">Mata Kuliah</Label>
                          <Input
                            id="mata_kuliah"
                            value={kuliahFormData.mata_kuliah}
                            onChange={(e) => setKuliahFormData({...kuliahFormData, mata_kuliah: e.target.value})}
                            placeholder="Nama mata kuliah"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="kode_mk">Kode MK</Label>
                          <Input
                            id="kode_mk"
                            value={kuliahFormData.kode_mk}
                            onChange={(e) => setKuliahFormData({...kuliahFormData, kode_mk: e.target.value})}
                            placeholder="IF101"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dosen">Dosen</Label>
                          <Input
                            id="dosen"
                            value={kuliahFormData.dosen}
                            onChange={(e) => setKuliahFormData({...kuliahFormData, dosen: e.target.value})}
                            placeholder="Nama dosen"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ruang">Ruang</Label>
                          <Input
                            id="ruang"
                            value={kuliahFormData.ruang}
                            onChange={(e) => setKuliahFormData({...kuliahFormData, ruang: e.target.value})}
                            placeholder="A-101"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="hari">Hari</Label>
                          <Select value={kuliahFormData.hari} onValueChange={(value) => setKuliahFormData({...kuliahFormData, hari: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih hari" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Senin">Senin</SelectItem>
                              <SelectItem value="Selasa">Selasa</SelectItem>
                              <SelectItem value="Rabu">Rabu</SelectItem>
                              <SelectItem value="Kamis">Kamis</SelectItem>
                              <SelectItem value="Jumat">Jumat</SelectItem>
                              <SelectItem value="Sabtu">Sabtu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="jam_mulai">Jam Mulai</Label>
                            <Input
                              id="jam_mulai"
                              type="time"
                              value={kuliahFormData.jam_mulai}
                              onChange={(e) => setKuliahFormData({...kuliahFormData, jam_mulai: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="jam_selesai">Jam Selesai</Label>
                            <Input
                              id="jam_selesai"
                              type="time"
                              value={kuliahFormData.jam_selesai}
                              onChange={(e) => setKuliahFormData({...kuliahFormData, jam_selesai: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="sks">SKS</Label>
                          <Input
                            id="sks"
                            type="number"
                            min="1"
                            max="6"
                            value={kuliahFormData.sks}
                            onChange={(e) => setKuliahFormData({...kuliahFormData, sks: e.target.value})}
                            placeholder="3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddKuliah} disabled={loading}>
                          {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode MK</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>Dosen</TableHead>
                    <TableHead>Hari</TableHead>
                    <TableHead>Jam</TableHead>
                    <TableHead>Ruang</TableHead>
                    <TableHead>SKS</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJadwalKuliah.map((jadwal) => (
                    <TableRow key={jadwal.id}>
                      <TableCell className="font-medium">{jadwal.kode_mk}</TableCell>
                      <TableCell>{jadwal.mata_kuliah}</TableCell>
                      <TableCell>{jadwal.dosen}</TableCell>
                      <TableCell>{jadwal.hari}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconClock className="h-4 w-4 text-muted-foreground" />
                          {jadwal.jam_mulai} - {jadwal.jam_selesai}
                        </div>
                      </TableCell>
                      <TableCell>{jadwal.ruang}</TableCell>
                      <TableCell>{jadwal.sks} SKS</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditKuliahDialog(jadwal)}>
                            <IconPencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteKuliah(jadwal.id)}>
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredJadwalKuliah.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Tidak ada jadwal kuliah yang ditemukan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ujian" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Jadwal Ujian</CardTitle>
                  <CardDescription>
                    Kelola jadwal ujian semester aktif
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari jadwal ujian..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Dialog open={isUjianDialogOpen} onOpenChange={setIsUjianDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Tambah Ujian
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Tambah Jadwal Ujian</DialogTitle>
                        <DialogDescription>
                          Tambahkan jadwal ujian baru
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="ujian_mata_kuliah">Mata Kuliah</Label>
                          <Input
                            id="ujian_mata_kuliah"
                            value={ujianFormData.mata_kuliah}
                            onChange={(e) => setUjianFormData({...ujianFormData, mata_kuliah: e.target.value})}
                            placeholder="Nama mata kuliah"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ujian_kode_mk">Kode MK</Label>
                          <Input
                            id="ujian_kode_mk"
                            value={ujianFormData.kode_mk}
                            onChange={(e) => setUjianFormData({...ujianFormData, kode_mk: e.target.value})}
                            placeholder="IF101"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ujian_dosen">Dosen</Label>
                          <Input
                            id="ujian_dosen"
                            value={ujianFormData.dosen}
                            onChange={(e) => setUjianFormData({...ujianFormData, dosen: e.target.value})}
                            placeholder="Nama dosen"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="ujian_ruang">Ruang</Label>
                          <Input
                            id="ujian_ruang"
                            value={ujianFormData.ruang}
                            onChange={(e) => setUjianFormData({...ujianFormData, ruang: e.target.value})}
                            placeholder="A-101"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="tanggal">Tanggal</Label>
                          <Input
                            id="tanggal"
                            type="date"
                            value={ujianFormData.tanggal}
                            onChange={(e) => setUjianFormData({...ujianFormData, tanggal: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="ujian_jam_mulai">Jam Mulai</Label>
                            <Input
                              id="ujian_jam_mulai"
                              type="time"
                              value={ujianFormData.jam_mulai}
                              onChange={(e) => setUjianFormData({...ujianFormData, jam_mulai: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="ujian_jam_selesai">Jam Selesai</Label>
                            <Input
                              id="ujian_jam_selesai"
                              type="time"
                              value={ujianFormData.jam_selesai}
                              onChange={(e) => setUjianFormData({...ujianFormData, jam_selesai: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="jenis_ujian">Jenis Ujian</Label>
                          <Select value={ujianFormData.jenis_ujian} onValueChange={(value) => setUjianFormData({...ujianFormData, jenis_ujian: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih jenis ujian" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="UTS">UTS</SelectItem>
                              <SelectItem value="UAS">UAS</SelectItem>
                              <SelectItem value="Quiz">Quiz</SelectItem>
                              <SelectItem value="Tugas">Tugas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddUjian} disabled={loading}>
                          {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode MK</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>Dosen</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jam</TableHead>
                    <TableHead>Ruang</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJadwalUjian.map((jadwal) => (
                    <TableRow key={jadwal.id}>
                      <TableCell className="font-medium">{jadwal.kode_mk}</TableCell>
                      <TableCell>{jadwal.mata_kuliah}</TableCell>
                      <TableCell>{jadwal.dosen}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconCalendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(jadwal.tanggal).toLocaleDateString('id-ID')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconClock className="h-4 w-4 text-muted-foreground" />
                          {jadwal.jam_mulai} - {jadwal.jam_selesai}
                        </div>
                      </TableCell>
                      <TableCell>{jadwal.ruang}</TableCell>
                      <TableCell>{getJenisUjianBadge(jadwal.jenis_ujian)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditUjianDialog(jadwal)}>
                            <IconPencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteUjian(jadwal.id)}>
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredJadwalUjian.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Tidak ada jadwal ujian yang ditemukan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Kuliah Dialog */}
      <Dialog open={isEditKuliahDialogOpen} onOpenChange={setIsEditKuliahDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Jadwal Kuliah</DialogTitle>
            <DialogDescription>
              Perbarui jadwal kuliah
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_mata_kuliah">Mata Kuliah</Label>
              <Input
                id="edit_mata_kuliah"
                value={kuliahFormData.mata_kuliah}
                onChange={(e) => setKuliahFormData({...kuliahFormData, mata_kuliah: e.target.value})}
                placeholder="Nama mata kuliah"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_kode_mk">Kode MK</Label>
              <Input
                id="edit_kode_mk"
                value={kuliahFormData.kode_mk}
                onChange={(e) => setKuliahFormData({...kuliahFormData, kode_mk: e.target.value})}
                placeholder="IF101"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_dosen">Dosen</Label>
              <Input
                id="edit_dosen"
                value={kuliahFormData.dosen}
                onChange={(e) => setKuliahFormData({...kuliahFormData, dosen: e.target.value})}
                placeholder="Nama dosen"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_ruang">Ruang</Label>
              <Input
                id="edit_ruang"
                value={kuliahFormData.ruang}
                onChange={(e) => setKuliahFormData({...kuliahFormData, ruang: e.target.value})}
                placeholder="A-101"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_hari">Hari</Label>
              <Select value={kuliahFormData.hari} onValueChange={(value) => setKuliahFormData({...kuliahFormData, hari: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Senin">Senin</SelectItem>
                  <SelectItem value="Selasa">Selasa</SelectItem>
                  <SelectItem value="Rabu">Rabu</SelectItem>
                  <SelectItem value="Kamis">Kamis</SelectItem>
                  <SelectItem value="Jumat">Jumat</SelectItem>
                  <SelectItem value="Sabtu">Sabtu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit_jam_mulai">Jam Mulai</Label>
                <Input
                  id="edit_jam_mulai"
                  type="time"
                  value={kuliahFormData.jam_mulai}
                  onChange={(e) => setKuliahFormData({...kuliahFormData, jam_mulai: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_jam_selesai">Jam Selesai</Label>
                <Input
                  id="edit_jam_selesai"
                  type="time"
                  value={kuliahFormData.jam_selesai}
                  onChange={(e) => setKuliahFormData({...kuliahFormData, jam_selesai: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_sks">SKS</Label>
              <Input
                id="edit_sks"
                type="number"
                min="1"
                max="6"
                value={kuliahFormData.sks}
                onChange={(e) => setKuliahFormData({...kuliahFormData, sks: e.target.value})}
                placeholder="3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditKuliah} disabled={loading}>
              {loading ? "Menyimpan..." : "Perbarui"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ujian Dialog */}
      <Dialog open={isEditUjianDialogOpen} onOpenChange={setIsEditUjianDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Jadwal Ujian</DialogTitle>
            <DialogDescription>
              Perbarui jadwal ujian
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_ujian_mata_kuliah">Mata Kuliah</Label>
              <Input
                id="edit_ujian_mata_kuliah"
                value={ujianFormData.mata_kuliah}
                onChange={(e) => setUjianFormData({...ujianFormData, mata_kuliah: e.target.value})}
                placeholder="Nama mata kuliah"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_ujian_kode_mk">Kode MK</Label>
              <Input
                id="edit_ujian_kode_mk"
                value={ujianFormData.kode_mk}
                onChange={(e) => setUjianFormData({...ujianFormData, kode_mk: e.target.value})}
                placeholder="IF101"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_ujian_dosen">Dosen</Label>
              <Input
                id="edit_ujian_dosen"
                value={ujianFormData.dosen}
                onChange={(e) => setUjianFormData({...ujianFormData, dosen: e.target.value})}
                placeholder="Nama dosen"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_ujian_ruang">Ruang</Label>
              <Input
                id="edit_ujian_ruang"
                value={ujianFormData.ruang}
                onChange={(e) => setUjianFormData({...ujianFormData, ruang: e.target.value})}
                placeholder="A-101"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_tanggal">Tanggal</Label>
              <Input
                id="edit_tanggal"
                type="date"
                value={ujianFormData.tanggal}
                onChange={(e) => setUjianFormData({...ujianFormData, tanggal: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="edit_ujian_jam_mulai">Jam Mulai</Label>
                <Input
                  id="edit_ujian_jam_mulai"
                  type="time"
                  value={ujianFormData.jam_mulai}
                  onChange={(e) => setUjianFormData({...ujianFormData, jam_mulai: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_ujian_jam_selesai">Jam Selesai</Label>
                <Input
                  id="edit_ujian_jam_selesai"
                  type="time"
                  value={ujianFormData.jam_selesai}
                  onChange={(e) => setUjianFormData({...ujianFormData, jam_selesai: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_jenis_ujian">Jenis Ujian</Label>
              <Select value={ujianFormData.jenis_ujian} onValueChange={(value) => setUjianFormData({...ujianFormData, jenis_ujian: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis ujian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTS">UTS</SelectItem>
                  <SelectItem value="UAS">UAS</SelectItem>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                  <SelectItem value="Tugas">Tugas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditUjian} disabled={loading}>
              {loading ? "Menyimpan..." : "Perbarui"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
