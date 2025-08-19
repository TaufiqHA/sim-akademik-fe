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
import { IconCheck, IconX, IconPencil, IconSearch, IconPlus } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

export default function KrsNilaiPage() {
  const [krsList, setKrsList] = useState([])
  const [nilaiList, setNilaiList] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isNilaiDialogOpen, setIsNilaiDialogOpen] = useState(false)
  const [selectedKrs, setSelectedKrs] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock data for KRS
  const mockKrs = [
    {
      id: 1,
      mahasiswa_id: 1,
      mahasiswa_nama: "Ahmad Rizki Pratama",
      mahasiswa_nim: "2021001",
      tahun_akademik: "2024/2025 Ganjil",
      status: "Submitted",
      created_at: "2024-01-15",
      total_sks: 20
    },
    {
      id: 2,
      mahasiswa_id: 2,
      mahasiswa_nama: "Siti Nurhaliza",
      mahasiswa_nim: "2021002", 
      tahun_akademik: "2024/2025 Ganjil",
      status: "Draft",
      created_at: "2024-01-16",
      total_sks: 18
    },
    {
      id: 3,
      mahasiswa_id: 3,
      mahasiswa_nama: "Budi Santoso",
      mahasiswa_nim: "2020003",
      tahun_akademik: "2024/2025 Ganjil", 
      status: "Approved",
      created_at: "2024-01-14",
      total_sks: 21
    }
  ]

  // Mock data for Nilai
  const mockNilai = [
    {
      id: 1,
      mahasiswa_id: 1,
      mahasiswa_nama: "Ahmad Rizki Pratama",
      mahasiswa_nim: "2021001",
      mata_kuliah: "Pemrograman Web",
      kode_mk: "IF101",
      dosen: "Dr. Andi Susanto",
      tugas: 85,
      uts: 80,
      uas: 88,
      nilai_akhir: 84.5
    },
    {
      id: 2,
      mahasiswa_id: 1,
      mahasiswa_nama: "Ahmad Rizki Pratama", 
      mahasiswa_nim: "2021001",
      mata_kuliah: "Basis Data",
      kode_mk: "IF102",
      dosen: "Prof. Sari Wijaya",
      tugas: 90,
      uts: 85,
      uas: 87,
      nilai_akhir: 87.2
    },
    {
      id: 3,
      mahasiswa_id: 2,
      mahasiswa_nama: "Siti Nurhaliza",
      mahasiswa_nim: "2021002",
      mata_kuliah: "Algoritma",
      kode_mk: "IF103", 
      dosen: "Dr. Budi Rahman",
      tugas: 78,
      uts: 82,
      uas: 85,
      nilai_akhir: 81.8
    }
  ]

  useEffect(() => {
    setKrsList(mockKrs)
    setNilaiList(mockNilai)
  }, [])

  const [nilaiFormData, setNilaiFormData] = useState({
    mahasiswa_id: "",
    mata_kuliah: "",
    kode_mk: "",
    dosen: "",
    tugas: "",
    uts: "",
    uas: ""
  })

  const filteredKrs = krsList.filter(krs =>
    krs.mahasiswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    krs.mahasiswa_nim.includes(searchTerm)
  )

  const filteredNilai = nilaiList.filter(nilai =>
    nilai.mahasiswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nilai.mahasiswa_nim.includes(searchTerm) ||
    nilai.mata_kuliah.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleApproveKrs = async (id) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setKrsList(krsList.map(krs => 
        krs.id === id ? { ...krs, status: "Approved" } : krs
      ))
      
      toast({
        title: "Berhasil",
        description: "KRS berhasil disetujui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyetujui KRS",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectKrs = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menolak KRS ini?")) return
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setKrsList(krsList.map(krs => 
        krs.id === id ? { ...krs, status: "Draft" } : krs
      ))
      
      toast({
        title: "Berhasil",
        description: "KRS ditolak dan dikembalikan ke status Draft",
      })
    } catch (error) {
      toast({
        title: "Error", 
        description: "Gagal menolak KRS",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNilai = async () => {
    setLoading(true)
    try {
      // Calculate nilai akhir
      const tugas = parseFloat(nilaiFormData.tugas) || 0
      const uts = parseFloat(nilaiFormData.uts) || 0
      const uas = parseFloat(nilaiFormData.uas) || 0
      const nilai_akhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newNilai = {
        id: nilaiList.length + 1,
        ...nilaiFormData,
        tugas,
        uts,
        uas,
        nilai_akhir: nilai_akhir.toFixed(1)
      }
      
      setNilaiList([...nilaiList, newNilai])
      setNilaiFormData({
        mahasiswa_id: "",
        mata_kuliah: "",
        kode_mk: "",
        dosen: "",
        tugas: "",
        uts: "",
        uas: ""
      })
      setIsNilaiDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Nilai berhasil ditambahkan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan nilai",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      "Draft": "secondary",
      "Submitted": "default", 
      "Approved": "default"
    }
    const colors = {
      "Draft": "bg-gray-100 text-gray-800",
      "Submitted": "bg-blue-100 text-blue-800",
      "Approved": "bg-green-100 text-green-800"
    }
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  const getNilaiHuruf = (nilai) => {
    if (nilai >= 85) return "A"
    if (nilai >= 80) return "A-"  
    if (nilai >= 75) return "B+"
    if (nilai >= 70) return "B"
    if (nilai >= 65) return "B-"
    if (nilai >= 60) return "C+"
    if (nilai >= 55) return "C"
    if (nilai >= 50) return "C-"
    if (nilai >= 45) return "D"
    return "F"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">KRS & Nilai</h1>
        <p className="text-muted-foreground">
          Validasi KRS dan kelola nilai mahasiswa
        </p>
      </div>

      <Tabs defaultValue="krs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="krs">Validasi KRS</TabsTrigger>
          <TabsTrigger value="nilai">Input Nilai</TabsTrigger>
        </TabsList>

        <TabsContent value="krs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Daftar KRS</CardTitle>
                  <CardDescription>
                    Validasi KRS yang diajukan mahasiswa
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari mahasiswa..."
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
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama Mahasiswa</TableHead>
                    <TableHead>Tahun Akademik</TableHead>
                    <TableHead>Total SKS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKrs.map((krs) => (
                    <TableRow key={krs.id}>
                      <TableCell className="font-medium">{krs.mahasiswa_nim}</TableCell>
                      <TableCell>{krs.mahasiswa_nama}</TableCell>
                      <TableCell>{krs.tahun_akademik}</TableCell>
                      <TableCell>{krs.total_sks} SKS</TableCell>
                      <TableCell>{getStatusBadge(krs.status)}</TableCell>
                      <TableCell>{new Date(krs.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        {krs.status === "Submitted" && (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveKrs(krs.id)}
                              disabled={loading}
                            >
                              <IconCheck className="h-4 w-4 mr-1" />
                              Setujui
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectKrs(krs.id)}
                              disabled={loading}
                            >
                              <IconX className="h-4 w-4 mr-1" />
                              Tolak
                            </Button>
                          </div>
                        )}
                        {krs.status === "Approved" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Disetujui
                          </Badge>
                        )}
                        {krs.status === "Draft" && (
                          <Badge variant="outline" className="bg-gray-50 text-gray-700">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredKrs.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Tidak ada data KRS yang ditemukan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nilai" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Daftar Nilai</CardTitle>
                  <CardDescription>
                    Input dan kelola nilai mahasiswa
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cari mahasiswa/mata kuliah..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Dialog open={isNilaiDialogOpen} onOpenChange={setIsNilaiDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Input Nilai
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Input Nilai Mahasiswa</DialogTitle>
                        <DialogDescription>
                          Masukkan nilai komponen untuk mahasiswa
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="mahasiswa">Mahasiswa</Label>
                          <Select 
                            value={nilaiFormData.mahasiswa_id} 
                            onValueChange={(value) => {
                              const mahasiswa = mockKrs.find(k => k.mahasiswa_id.toString() === value)
                              setNilaiFormData({
                                ...nilaiFormData, 
                                mahasiswa_id: value,
                                mahasiswa_nama: mahasiswa?.mahasiswa_nama || "",
                                mahasiswa_nim: mahasiswa?.mahasiswa_nim || ""
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih mahasiswa" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockKrs.map((krs) => (
                                <SelectItem key={krs.mahasiswa_id} value={krs.mahasiswa_id.toString()}>
                                  {krs.mahasiswa_nim} - {krs.mahasiswa_nama}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="mata_kuliah">Mata Kuliah</Label>
                          <Input
                            id="mata_kuliah"
                            value={nilaiFormData.mata_kuliah}
                            onChange={(e) => setNilaiFormData({...nilaiFormData, mata_kuliah: e.target.value})}
                            placeholder="Nama mata kuliah"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="kode_mk">Kode MK</Label>
                          <Input
                            id="kode_mk"
                            value={nilaiFormData.kode_mk}
                            onChange={(e) => setNilaiFormData({...nilaiFormData, kode_mk: e.target.value})}
                            placeholder="IF101"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="dosen">Dosen Pengampu</Label>
                          <Input
                            id="dosen"
                            value={nilaiFormData.dosen}
                            onChange={(e) => setNilaiFormData({...nilaiFormData, dosen: e.target.value})}
                            placeholder="Nama dosen"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label htmlFor="tugas">Tugas (30%)</Label>
                            <Input
                              id="tugas"
                              type="number"
                              min="0"
                              max="100"
                              value={nilaiFormData.tugas}
                              onChange={(e) => setNilaiFormData({...nilaiFormData, tugas: e.target.value})}
                              placeholder="0-100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="uts">UTS (30%)</Label>
                            <Input
                              id="uts"
                              type="number"
                              min="0"
                              max="100"
                              value={nilaiFormData.uts}
                              onChange={(e) => setNilaiFormData({...nilaiFormData, uts: e.target.value})}
                              placeholder="0-100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="uas">UAS (40%)</Label>
                            <Input
                              id="uas"
                              type="number"
                              min="0"
                              max="100"
                              value={nilaiFormData.uas}
                              onChange={(e) => setNilaiFormData({...nilaiFormData, uas: e.target.value})}
                              placeholder="0-100"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" onClick={handleAddNilai} disabled={loading}>
                          {loading ? "Menyimpan..." : "Simpan Nilai"}
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
                    <TableHead>NIM</TableHead>
                    <TableHead>Mahasiswa</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>Dosen</TableHead>
                    <TableHead>Tugas</TableHead>
                    <TableHead>UTS</TableHead>
                    <TableHead>UAS</TableHead>
                    <TableHead>Nilai Akhir</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNilai.map((nilai) => (
                    <TableRow key={nilai.id}>
                      <TableCell className="font-medium">{nilai.mahasiswa_nim}</TableCell>
                      <TableCell>{nilai.mahasiswa_nama}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{nilai.mata_kuliah}</p>
                          <p className="text-sm text-muted-foreground">{nilai.kode_mk}</p>
                        </div>
                      </TableCell>
                      <TableCell>{nilai.dosen}</TableCell>
                      <TableCell>{nilai.tugas}</TableCell>
                      <TableCell>{nilai.uts}</TableCell>
                      <TableCell>{nilai.uas}</TableCell>
                      <TableCell className="font-medium">{nilai.nilai_akhir}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getNilaiHuruf(parseFloat(nilai.nilai_akhir))}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredNilai.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">Tidak ada data nilai yang ditemukan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
