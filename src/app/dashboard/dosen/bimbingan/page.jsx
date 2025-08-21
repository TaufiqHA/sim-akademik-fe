"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  getDokumenAkademik, 
  approveDokumenAkademik, 
  rejectDokumenAkademik,
  getDashboardDosen
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  IconUsers,
  IconFileText,
  IconDownload,
  IconClock,
  IconCheck,
  IconX,
  IconMessageCircle,
  IconRefresh,
  IconFilter,
  IconAlertCircle,
  IconBook
} from "@tabler/icons-react";

export default function BimbinganPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewAction, setReviewAction] = useState("");

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    await Promise.all([
      loadDashboardStats(),
      loadDocuments()
    ]);
  };

  const loadDashboardStats = async () => {
    try {
      console.log("Loading dashboard stats...");
      const stats = await getDashboardDosen();
      console.log("Dashboard stats response:", stats);
      setDashboardStats(stats || {});
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      setDashboardStats({});
    }
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Loading documents...");
      
      // Get all documents from API - sesuai sim.json tidak ada filter khusus untuk bimbingan
      const allDocuments = await getDokumenAkademik({});
      console.log("Documents response:", allDocuments);
      
      // Set documents as-is from API response
      setDocuments(Array.isArray(allDocuments) ? allDocuments : []);
      
    } catch (error) {
      console.error("Error loading documents:", error);
      setError(error.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedDocument) {
      toast.error("Dokumen tidak valid");
      return;
    }

    try {
      if (reviewAction === "approve") {
        await approveDokumenAkademik(selectedDocument.id);
        toast.success("Dokumen berhasil disetujui");
      } else if (reviewAction === "reject") {
        if (!reviewText.trim()) {
          toast.error("Mohon isi alasan penolakan");
          return;
        }
        await rejectDokumenAkademik(selectedDocument.id, reviewText);
        toast.success("Dokumen ditolak dengan alasan");
      }

      // Update local state
      setDocuments(prevDocs =>
        prevDocs.map(doc =>
          doc.id === selectedDocument.id
            ? {
                ...doc,
                status: reviewAction === "approve" ? "Approved" : "Rejected",
                approved_by: user?.id,
                updated_at: new Date().toISOString()
              }
            : doc
        )
      );

      setReviewDialog(false);
      setSelectedDocument(null);
      setReviewText("");
      setReviewAction("");

    } catch (error) {
      console.error("Error reviewing document:", error);
      toast.error("Gagal melakukan review dokumen: " + error.message);
    }
  };

  const filterDocuments = (docs) => {
    return docs.filter(doc => {
      const matchesSearch = searchTerm === "" || 
        (doc.jenis_dokumen && doc.jenis_dokumen.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.file_path && doc.file_path.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <IconClock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800">
            <IconCheck className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="destructive">
            <IconX className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStats = () => {
    const total = documents.length;
    const pending = documents.filter(d => d.status === "Pending").length;
    const approved = documents.filter(d => d.status === "Approved").length;
    const rejected = documents.filter(d => d.status === "Rejected").length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bimbingan Akademik</h1>
          <p className="text-muted-foreground">
            Kelola dan review dokumen akademik
          </p>
          {error && (
            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
              <IconAlertCircle className="w-4 h-4" />
              <span>Error: {error}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <IconRefresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards - berdasarkan dashboard/dosen API */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas Diampu</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.jumlah_kelas_diampu || 0}</div>
            <p className="text-xs text-muted-foreground">Total kelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mahasiswa Bimbingan</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.jumlah_mahasiswa_bimbingan || 0}</div>
            <p className="text-xs text-muted-foreground">Total mahasiswa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Pending</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dokumen</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Semua dokumen</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconFilter className="w-5 h-5 mr-2" />
            Filter Dokumen
          </CardTitle>
          <CardDescription>
            Cari dan filter dokumen berdasarkan jenis atau status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari berdasarkan jenis dokumen atau file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconFileText className="w-5 h-5 mr-2" />
            Dokumen Akademik ({filterDocuments(documents).length})
          </CardTitle>
          <CardDescription>
            Daftar dokumen akademik yang perlu direview
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filterDocuments(documents).length === 0 ? (
            <div className="text-center py-8">
              <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Tidak ada dokumen ditemukan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {error ? "Terjadi error saat memuat data" : "Belum ada dokumen yang sesuai dengan filter Anda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Jenis Dokumen</TableHead>
                    <TableHead>File Path</TableHead>
                    <TableHead>Uploaded By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterDocuments(documents).map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.jenis_dokumen || "-"}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={doc.file_path}>
                          {doc.file_path || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{doc.uploaded_by || "-"}</TableCell>
                      <TableCell>{getStatusBadge(doc.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" title="Download">
                            <IconDownload className="w-4 h-4" />
                          </Button>
                          {doc.status === "Pending" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              title="Review Dokumen"
                              onClick={() => {
                                setSelectedDocument(doc);
                                setReviewDialog(true);
                                setReviewText("");
                                setReviewAction("");
                              }}
                            >
                              <IconMessageCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Dokumen</DialogTitle>
            <DialogDescription>
              Review dokumen ID: {selectedDocument?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Informasi Dokumen:</h4>
              <div className="text-sm space-y-1 p-3 bg-gray-50 rounded-lg">
                <div><strong>ID:</strong> {selectedDocument?.id}</div>
                <div><strong>Jenis:</strong> {selectedDocument?.jenis_dokumen || "-"}</div>
                <div><strong>File:</strong> {selectedDocument?.file_path || "-"}</div>
                <div><strong>Uploaded by:</strong> {selectedDocument?.uploaded_by || "-"}</div>
              </div>
            </div>
            
            {reviewAction === "reject" && (
              <div>
                <label htmlFor="review-text" className="text-sm font-medium mb-2 block">
                  Alasan Penolakan <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="review-text"
                  placeholder="Masukkan alasan penolakan dokumen..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setReviewDialog(false)}
            >
              Batal
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setReviewAction("reject");
                handleReviewSubmit();
              }}
              disabled={reviewAction === "reject" && !reviewText.trim()}
            >
              <IconX className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button 
              onClick={() => {
                setReviewAction("approve");
                handleReviewSubmit();
              }}
            >
              <IconCheck className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
