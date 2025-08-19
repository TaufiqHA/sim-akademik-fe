"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  getDokumenAkademik,
  distributeDocumentToDekan,
  getDistributionHistory,
  getUsers
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconSend, IconSearch, IconEye, IconUsers, IconFileCheck, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

export default function DistribusiDokumenPage() {
  const { user } = useAuth()
  const [pendingDocuments, setPendingDocuments] = useState([])
  const [distributionHistory, setDistributionHistory] = useState([])
  const [deans, setDeans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDocuments, setSelectedDocuments] = useState([])
  const [selectedDean, setSelectedDean] = useState("")
  const [isDistributeDialogOpen, setIsDistributeDialogOpen] = useState(false)
  const [distributionNotes, setDistributionNotes] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchPendingDocuments(),
        fetchDistributionHistory(),
        fetchDeans()
      ])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingDocuments = async () => {
    try {
      const response = await getDokumenAkademik({
        jenis_dokumen: "fakultas",
        status: "Pending"
      })
      setPendingDocuments(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching pending documents:", error)
      setPendingDocuments([])
    }
  }

  const fetchDistributionHistory = async () => {
    try {
      const response = await getDistributionHistory()
      setDistributionHistory(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching distribution history:", error)
      setDistributionHistory([])
    }
  }

  const fetchDeans = async () => {
    try {
      const response = await getUsers({ role_id: 2 }) // Assuming role_id 2 is for Dekan
      setDeans(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching deans:", error)
      setDeans([])
    }
  }

  const filteredDocuments = pendingDocuments.filter(doc =>
    doc.judul.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectDocument = (documentId, checked) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, documentId])
    } else {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId))
    }
  }

  const handleSelectAllDocuments = (checked) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id))
    } else {
      setSelectedDocuments([])
    }
  }

  const handleDistributeDocuments = async () => {
    try {
      if (selectedDocuments.length === 0 || !selectedDean) {
        toast.error("Pilih dokumen dan penerima distribusi")
        return
      }

      const selectedDeanData = deans.find(dean => dean.id.toString() === selectedDean)
      if (!selectedDeanData) {
        toast.error("Dekan yang dipilih tidak valid")
        return
      }

      // Distribute each selected document
      for (const documentId of selectedDocuments) {
        await distributeDocumentToDekan(documentId, selectedDean, distributionNotes)
      }

      // Refresh data
      await fetchData()

      // Reset form
      setSelectedDocuments([])
      setSelectedDean("")
      setDistributionNotes("")
      setIsDistributeDialogOpen(false)

      toast.success(`${selectedDocuments.length} dokumen berhasil didistribusikan ke ${selectedDeanData.nama}`)
    } catch (error) {
      console.error("Error distributing documents:", error)
      toast.error(error.message || "Gagal mendistribusikan dokumen")
    }
  }

  const handleViewDocument = (document) => {
    // Here you would implement the document viewer
    toast.info(`Melihat: ${document.judul}`)
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Disetujui
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            Ditolak
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Menunggu
          </Badge>
        )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distribusi Dokumen</h1>
          <p className="text-muted-foreground">
            Distribusikan dokumen fakultas ke Dekan untuk persetujuan
          </p>
        </div>
        <Dialog open={isDistributeDialogOpen} onOpenChange={setIsDistributeDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={selectedDocuments.length === 0}>
              <IconSend className="mr-2 h-4 w-4" />
              Distribusikan ({selectedDocuments.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Distribusi Dokumen</DialogTitle>
              <DialogDescription>
                Distribusikan {selectedDocuments.length} dokumen terpilih ke Dekan
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pilih Penerima</label>
                <Select value={selectedDean} onValueChange={setSelectedDean}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Dekan" />
                  </SelectTrigger>
                  <SelectContent>
                    {deans.map((dean) => (
                      <SelectItem key={dean.id} value={dean.id.toString()}>
                        {dean.nama} - {dean.jabatan}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Catatan (Opsional)</label>
                <textarea
                  value={distributionNotes}
                  onChange={(e) => setDistributionNotes(e.target.value)}
                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Tambahkan catatan untuk Dekan..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dokumen yang akan didistribusikan:</label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {pendingDocuments
                    .filter(doc => selectedDocuments.includes(doc.id))
                    .map(doc => (
                      <div key={doc.id} className="text-sm p-2 bg-muted rounded">
                        {doc.judul}
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleDistributeDocuments}>
                Distribusikan Dokumen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dokumen Siap Distribusi
            </CardTitle>
            <IconFileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocuments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dokumen Terpilih
            </CardTitle>
            <IconUsers className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedDocuments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Terdistribusi
            </CardTitle>
            <IconSend className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{distributionHistory.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Documents for Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Dokumen Siap Distribusi</CardTitle>
              <CardDescription>
                Pilih dokumen yang akan didistribusikan ke Dekan
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <IconSearch className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Memuat data dokumen...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
                      onCheckedChange={handleSelectAllDocuments}
                    />
                  </TableHead>
                  <TableHead>Judul Dokumen</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Tanggal Upload</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {pendingDocuments.length === 0 ? "Tidak ada dokumen untuk didistribusikan" : "Tidak ada dokumen yang sesuai dengan pencarian"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDocuments.includes(document.id)}
                          onCheckedChange={(checked) => handleSelectDocument(document.id, checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{document.judul}</TableCell>
                      <TableCell className="capitalize">{document.jenis_dokumen}</TableCell>
                      <TableCell className="max-w-xs truncate">{document.description || document.judul}</TableCell>
                      <TableCell>{formatDate(document.created_at)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDocument(document)}
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Distribution History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Distribusi</CardTitle>
          <CardDescription>
            Dokumen yang telah didistribusikan ke Dekan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Dokumen</TableHead>
                <TableHead>Didistribusikan Kepada</TableHead>
                <TableHead>Tanggal Distribusi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributionHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.judul}</TableCell>
                  <TableCell>{item.distributed_to}</TableCell>
                  <TableCell>{formatDate(item.distributed_at)}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="max-w-xs truncate">{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
