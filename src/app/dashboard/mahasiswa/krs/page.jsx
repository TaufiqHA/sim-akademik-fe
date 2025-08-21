"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getKrsMahasiswa, submitKrs, deleteKrs } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconClipboard,
  IconPlus,
  IconSend,
  IconTrash,
  IconEye,
  IconCalendar,
  IconSchool,
} from "@tabler/icons-react";
import Link from "next/link";

export default function KrsPage() {
  const { user } = useAuth();
  const [krsList, setKrsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedKrs, setSelectedKrs] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadKrsData();
    }
  }, [user]);

  const loadKrsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getKrsMahasiswa(user.id);
      setKrsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading KRS data:", error);
      setError(`Gagal memuat data KRS: ${error.message}`);
      setKrsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitKrs = async (krsId) => {
    try {
      setSubmitting(true);
      await submitKrs(krsId);
      await loadKrsData();
    } catch (error) {
      console.error("Error submitting KRS:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteKrs = async () => {
    if (!selectedKrs) return;
    
    try {
      await deleteKrs(selectedKrs.id);
      await loadKrsData();
      setShowDeleteDialog(false);
      setSelectedKrs(null);
    } catch (error) {
      console.error("Error deleting KRS:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Submitted":
        return <Badge variant="outline">Submitted</Badge>;
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading KRS data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kartu Rencana Studi (KRS)</h1>
          <p className="text-muted-foreground">
            Kelola pengisian dan submisi KRS per semester
          </p>
          {error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
        <Link href="/dashboard/mahasiswa/krs/isi">
          <Button>
            <IconPlus className="w-4 h-4 mr-2" />
            Isi KRS Baru
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total KRS</CardTitle>
            <IconClipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{krsList.length}</div>
            <p className="text-xs text-muted-foreground">Semester terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KRS Approved</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {krsList.filter(krs => krs.status === "Approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Sudah disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SKS Semester Ini</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {krsList.find(krs => krs.status === "Draft" || krs.status === "Submitted")?.total_sks || 0}
            </div>
            <p className="text-xs text-muted-foreground">SKS diambil</p>
          </CardContent>
        </Card>
      </div>

      {/* KRS List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconClipboard className="w-5 h-5 mr-2" />
            Daftar KRS
          </CardTitle>
          <CardDescription>
            Riwayat KRS per semester akademik
          </CardDescription>
        </CardHeader>
        <CardContent>
          {krsList.length === 0 ? (
            <div className="text-center py-8">
              <IconClipboard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Belum ada KRS
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Mulai isi KRS untuk semester ini.
              </p>
              <Link href="/dashboard/mahasiswa/krs/isi">
                <Button className="mt-4">
                  <IconPlus className="w-4 h-4 mr-2" />
                  Isi KRS Baru
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tahun Akademik</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Total SKS</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {krsList.map((krs) => (
                  <TableRow key={krs.id}>
                    <TableCell className="font-medium">
                      {krs.tahun_akademik?.tahun}
                    </TableCell>
                    <TableCell>{krs.tahun_akademik?.semester}</TableCell>
                    <TableCell>{krs.total_sks} SKS</TableCell>
                    <TableCell>{getStatusBadge(krs.status)}</TableCell>
                    <TableCell>
                      {new Date(krs.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <IconEye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                        {krs.status === "Draft" && (
                          <>
                            <Button 
                              size="sm"
                              onClick={() => handleSubmitKrs(krs.id)}
                              disabled={submitting}
                            >
                              <IconSend className="w-4 h-4 mr-1" />
                              Submit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => {
                                setSelectedKrs(krs);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <IconTrash className="w-4 h-4 mr-1" />
                              Hapus
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus KRS</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus KRS untuk semester {selectedKrs?.tahun_akademik?.tahun} {selectedKrs?.tahun_akademik?.semester}? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteKrs}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
