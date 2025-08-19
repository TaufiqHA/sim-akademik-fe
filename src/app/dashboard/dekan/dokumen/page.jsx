"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { 
  getDokumenAkademik, 
  getDokumenAkademikDetail,
  approveDokumenAkademik,
  rejectDokumenAkademik
} from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/data-table"
import { 
  IconFile, 
  IconCheck, 
  IconX, 
  IconEye,
  IconSignature,
  IconClock,
  IconCircleCheck,
  IconCircleX,
  IconPlus,
  IconDownload
} from "@tabler/icons-react"

export default function DokumenApprovalPage() {
  const { user } = useAuth()
  const [allDocuments, setAllDocuments] = useState([]) // Store all documents
  const [documents, setDocuments] = useState([]) // Store filtered documents
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [documentToReject, setDocumentToReject] = useState(null)
  const [activeTab, setActiveTab] = useState('pending')

  useEffect(() => {
    if (user) {
      loadDocuments()
    }
  }, [user])

  // Client-side filter when tab changes
  useEffect(() => {
    filterDocuments(activeTab)
  }, [activeTab, allDocuments])

  const filterDocuments = (status) => {
    if (!allDocuments.length) {
      setDocuments([])
      return
    }

    let filtered = [...allDocuments]

    if (status === 'pending') {
      filtered = filtered.filter(d => d.status === 'Pending')
    } else if (status === 'approved') {
      filtered = filtered.filter(d => d.status === 'Approved')
    } else if (status === 'rejected') {
      filtered = filtered.filter(d => d.status === 'Rejected')
    }
    // 'all' shows all documents, no filtering needed

    setDocuments(filtered)
  }

  const loadDocuments = async () => {
    try {
      setLoading(true)

      // Load all documents without status filter for client-side filtering
      const allDocsData = await getDokumenAkademik()

      // Ensure allDocsData is an array, set empty array if null/undefined
      const documentsArray = Array.isArray(allDocsData) ? allDocsData : []

      // Map document data according to API schema
      const documentsWithNames = documentsArray.map(doc => ({
        id: doc.id,
        jenis_dokumen: doc.jenis_dokumen,
        file_path: doc.file_path,
        uploaded_by: doc.uploaded_by,
        approved_by: doc.approved_by,
        status: doc.status, // API returns: "Pending", "Approved", "Rejected"
        uploaded_by_name: doc.uploaded_by_name || `User ${doc.uploaded_by}`,
        created_at: doc.created_at || new Date().toISOString()
      }))

      setAllDocuments(documentsWithNames)
    } catch (error) {
      console.error('Error loading documents:', error)
      setAllDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleApproveDocument = async (documentId) => {
    try {
      await approveDokumenAkademik(documentId)

      // Update both all documents and current filtered documents
      const updateDoc = (doc) => doc.id === documentId
        ? { ...doc, status: 'Approved', approved_by: user.id }
        : doc

      setAllDocuments(docs => docs.map(updateDoc))
      setDocuments(docs => docs.map(updateDoc))

      setSelectedDocument(null)
    } catch (error) {
      console.error('Error approving document:', error)
      alert('Gagal menyetujui dokumen. Silakan coba lagi.')
    }
  }

  const handleRejectDocument = async (documentId, alasan = '') => {
    try {
      // API expects 'alasan' parameter according to sim.json spec
      await rejectDokumenAkademik(documentId, alasan)

      // Update both all documents and current filtered documents
      const updateDoc = (doc) => doc.id === documentId
        ? { ...doc, status: 'Rejected', approved_by: user.id }
        : doc

      setAllDocuments(docs => docs.map(updateDoc))
      setDocuments(docs => docs.map(updateDoc))

      setSelectedDocument(null)
      setShowRejectDialog(false)
      setRejectReason('')
      setDocumentToReject(null)
    } catch (error) {
      console.error('Error rejecting document:', error)
      alert('Gagal menolak dokumen. Silakan coba lagi.')
    }
  }

  const initiateRejectDocument = (documentId) => {
    setDocumentToReject(documentId)
    setShowRejectDialog(true)
  }

  const confirmRejectDocument = () => {
    if (documentToReject) {
      handleRejectDocument(documentToReject, rejectReason)
    }
  }

  const handleDigitalSignature = async (documentId) => {
    try {
      alert('Fitur tanda tangan digital akan segera tersedia. Untuk sementara, dokumen akan disetujui.')
      await handleApproveDocument(documentId)
    } catch (error) {
      console.error('Error with digital signature:', error)
      alert('Gagal melakukan tanda tangan digital. Silakan coba lagi.')
    }
  }

  const getStatusBadge = (status) => {
    // Status values according to sim.json API spec: "Pending", "Approved", "Rejected"
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><IconClock className="w-3 h-3 mr-1" />Menunggu</Badge>
      case 'Approved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><IconCircleCheck className="w-3 h-3 mr-1" />Disetujui</Badge>
      case 'Rejected':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><IconCircleX className="w-3 h-3 mr-1" />Ditolak</Badge>
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>
    }
  }

  const documentColumns = [
    {
      accessorKey: "jenis_dokumen",
      header: "Jenis Dokumen",
    },
    {
      accessorKey: "uploaded_by_name",
      header: "Diupload Oleh",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Upload",
      cell: ({ row }) => new Date(row.getValue("created_at")).toLocaleDateString('id-ID'),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const document = row.original
        return (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDocument(document)}
                >
                  <IconEye className="w-4 h-4 mr-2" />
                  Lihat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Detail Dokumen</DialogTitle>
                  <DialogDescription>
                    {document.jenis_dokumen} - {document.uploaded_by_name}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Jenis Dokumen</label>
                      <p className="text-sm text-muted-foreground">{document.jenis_dokumen}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <div className="mt-1">{getStatusBadge(document.status)}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Diupload Oleh</label>
                      <p className="text-sm text-muted-foreground">{document.uploaded_by_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tanggal Upload</label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(document.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-muted-foreground mb-2">File Preview:</p>
                    <div className="flex items-center space-x-2">
                      <IconFile className="w-5 h-5" />
                      <span className="text-sm">{document.file_path}</span>
                      <Button variant="outline" size="sm">
                        <IconDownload className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  {document.status === 'Pending' && (
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => initiateRejectDocument(document.id)}
                      >
                        <IconX className="w-4 h-4 mr-2" />
                        Tolak
                      </Button>
                      <Button
                        onClick={() => handleApproveDocument(document.id)}
                      >
                        <IconCheck className="w-4 h-4 mr-2" />
                        Setujui
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={() => handleDigitalSignature(document.id)}
                      >
                        <IconSignature className="w-4 h-4 mr-2" />
                        Tanda Tangan Digital
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )
      },
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Persetujuan Dokumen</h1>
        <p className="text-muted-foreground">
          Kelola persetujuan dokumen akademik yang memerlukan tanda tangan Dekan
        </p>
      </div>

      {/* Document Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
            <IconFile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allDocuments.length}</div>
            <p className="text-xs text-muted-foreground">
              Semua dokumen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allDocuments.filter(d => d.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">
              Dokumen pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
            <IconCircleCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{allDocuments.filter(d => d.status === 'Approved').length}</div>
            <p className="text-xs text-muted-foreground">
              Dokumen disetujui
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
            <IconCircleX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{allDocuments.filter(d => d.status === 'Rejected').length}</div>
            <p className="text-xs text-muted-foreground">
              Dokumen ditolak
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Document Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconFile className="w-5 h-5 mr-2" />
            Daftar Dokumen
          </CardTitle>
          <CardDescription>
            Kelola semua dokumen akademik yang memerlukan persetujuan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList>
              <TabsTrigger value="pending">
                Menunggu Persetujuan ({allDocuments.filter(d => d.status === 'Pending').length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Disetujui ({allDocuments.filter(d => d.status === 'Approved').length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Ditolak ({allDocuments.filter(d => d.status === 'Rejected').length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Semua ({allDocuments.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              <DataTable
                columns={documentColumns}
                data={documents}
              />
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              <DataTable
                columns={documentColumns}
                data={documents}
              />
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <DataTable
                columns={documentColumns}
                data={documents}
              />
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              <DataTable
                columns={documentColumns}
                data={documents}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Dokumen</DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan dokumen ini
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Alasan Penolakan
              </label>
              <textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Masukkan alasan penolakan..."
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false)
                setRejectReason('')
                setDocumentToReject(null)
              }}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRejectDocument}
            >
              Tolak Dokumen
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
