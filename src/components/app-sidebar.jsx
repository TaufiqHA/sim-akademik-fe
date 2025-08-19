"use client";

import * as React from "react";
import {
  IconBuilding,
  IconCalendar,
  IconChartBar,
  IconChalkboard,
  IconDashboard,
  IconInnerShadowTop,
  IconSchool,
  IconUserCog,
  IconUsers,
  IconClipboard,
  IconFile,
  IconCertificate,
  IconFileText,
  IconClipboardData,
  IconUpload,
  IconEye,
} from "@tabler/icons-react";

import { useAuth } from "@/hooks/use-auth";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const getSuperAdminNavigation = () => ({
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Manajemen User",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    {
      title: "Manajemen Role",
      url: "/dashboard/roles",
      icon: IconUserCog,
    },
    {
      title: "Fakultas",
      url: "/dashboard/fakultas",
      icon: IconBuilding,
    },
    {
      title: "Program Studi",
      url: "/dashboard/prodi",
      icon: IconSchool,
    },
    {
      title: "Tahun Akademik",
      url: "/dashboard/tahun-akademik",
      icon: IconCalendar,
    },
  ],
});

const getDekanNavigation = () => ({
  navMain: [
    {
      title: "Dashboard Fakultas",
      url: "/dashboard/dekan",
      icon: IconDashboard,
    },
    {
      title: "Persetujuan Dokumen",
      url: "/dashboard/dekan/dokumen",
      icon: IconInnerShadowTop,
    },
    {
      title: "Program Studi",
      url: "/dashboard/prodi",
      icon: IconSchool,
    },
    {
      title: "Daftar Dosen",
      url: "/dashboard/dekan/dosen",
      icon: IconChalkboard,
    },
  ],
});

const getKaprodiNavigation = () => ({
  navMain: [
    {
      title: "Dashboard Prodi",
      url: "/dashboard/kaprodi",
      icon: IconDashboard,
    },
    {
      title: "Validasi Nilai & KHS",
      url: "/dashboard/kaprodi/nilai",
      icon: IconClipboard,
    },
    {
      title: "KHS Mahasiswa",
      url: "/dashboard/kaprodi/khs",
      icon: IconChartBar,
    },
    {
      title: "Proposal Skripsi",
      url: "/dashboard/kaprodi/skripsi",
      icon: IconFile,
    },
    {
      title: "Persetujuan Yudisium",
      url: "/dashboard/kaprodi/yudisium",
      icon: IconCertificate,
    },
  ],
});

const getTuFakultasNavigation = () => ({
  navMain: [
    {
      title: "Dashboard TU Fakultas",
      url: "/dashboard/fakultas",
      icon: IconDashboard,
    },
    {
      title: "Manajemen Dosen",
      url: "/dashboard/fakultas/dosen",
      icon: IconChalkboard,
    },
    {
      title: "Dokumen Fakultas",
      url: "/dashboard/fakultas/dokumen",
      icon: IconFile,
    },
    {
      title: "Distribusi Dokumen",
      url: "/dashboard/fakultas/distribusi",
      icon: IconInnerShadowTop,
    },
  ],
});

const getTuProdiNavigation = () => ({
  navMain: [
    {
      title: "Dashboard TU PRODI",
      url: "/dashboard/tu-prodi",
      icon: IconDashboard,
    },
    {
      title: "Data Mahasiswa",
      url: "/dashboard/tu-prodi/mahasiswa",
      icon: IconUsers,
    },
    {
      title: "KRS & Nilai",
      url: "/dashboard/tu-prodi/krs-nilai",
      icon: IconClipboard,
    },
    {
      title: "Jadwal Kuliah & Ujian",
      url: "/dashboard/tu-prodi/jadwal",
      icon: IconCalendar,
    },
    {
      title: "Pengajuan Surat",
      url: "/dashboard/tu-prodi/surat",
      icon: IconFile,
    },
  ],
});

const getDosenNavigation = () => ({
  navMain: [
    {
      title: "Dashboard Dosen",
      url: "/dashboard/dosen",
      icon: IconDashboard,
    },
    {
      title: "Manajemen Mata Kuliah",
      url: "/dashboard/dosen/mata-kuliah",
      icon: IconChalkboard,
      items: [
        {
          title: "Lihat Mata Kuliah",
          url: "/dashboard/dosen/mata-kuliah",
          icon: IconEye,
        },
        {
          title: "Upload Materi",
          url: "/dashboard/dosen/mata-kuliah/upload",
          icon: IconUpload,
        },
      ],
    },
    {
      title: "Input Nilai",
      url: "/dashboard/dosen/nilai",
      icon: IconClipboardData,
      items: [
        {
          title: "Lihat Nilai",
          url: "/dashboard/dosen/nilai",
          icon: IconEye,
        },
        {
          title: "Input Nilai Baru",
          url: "/dashboard/dosen/nilai/input",
          icon: IconUpload,
        },
      ],
    },
    {
      title: "Bimbingan Akademik",
      url: "/dashboard/dosen/bimbingan",
      icon: IconSchool,
      items: [
        {
          title: "Lihat Mahasiswa Bimbingan",
          url: "/dashboard/dosen/bimbingan",
          icon: IconEye,
        },
        {
          title: "Upload Dokumen",
          url: "/dashboard/dosen/bimbingan/upload",
          icon: IconUpload,
        },
      ],
    },
  ],
});

const getMahasiswaNavigation = () => ({
  navMain: [
    {
      title: "Dashboard Akademik",
      url: "/dashboard/mahasiswa",
      icon: IconDashboard,
    },
    {
      title: "Kartu Rencana Studi (KRS)",
      url: "/dashboard/mahasiswa/krs",
      icon: IconClipboard,
      items: [
        {
          title: "Lihat KRS",
          url: "/dashboard/mahasiswa/krs",
          icon: IconEye,
        },
        {
          title: "Isi KRS Baru",
          url: "/dashboard/mahasiswa/krs/isi",
          icon: IconUpload,
        },
      ],
    },
    {
      title: "Kartu Hasil Studi (KHS)",
      url: "/dashboard/mahasiswa/khs",
      icon: IconChartBar,
    },
    {
      title: "Materi Kuliah",
      url: "/dashboard/mahasiswa/materi",
      icon: IconFileText,
    },
    {
      title: "Proposal Skripsi",
      url: "/dashboard/mahasiswa/proposal",
      icon: IconSchool,
    },
    {
      title: "Permintaan Surat",
      url: "/dashboard/mahasiswa/surat",
      icon: IconFile,
    },
  ],
});

const getDefaultNavigation = () => ({
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
  ],
});

export function AppSidebar({ ...props }) {
  const { user } = useAuth();

  // Get navigation based on user role
  const getNavigation = () => {
    if (!user) return getDefaultNavigation();

    if (user.role_id === 1) {
      // Super Admin
      return getSuperAdminNavigation();
    } else if (user.role_id === 2) {
      // Dekan (assuming role_id 2 is Dekan)
      return getDekanNavigation();
    } else if (user.role_id === 3) {
      // TU Fakultas (assuming role_id 3 is TU Fakultas)
      return getTuFakultasNavigation();
    } else if (user.role_id === 4) {
      // Kaprodi (assuming role_id 4 is Kaprodi)
      return getKaprodiNavigation();
    } else if (user.role_id === 5) {
      // TU PRODI (assuming role_id 5 is TU PRODI)
      return getTuProdiNavigation();
    } else if (user.role_id === 6) {
      // Dosen (assuming role_id 6 is Dosen)
      return getDosenNavigation();
    } else if (user.role_id === 7) {
      // Mahasiswa (assuming role_id 7 is Mahasiswa)
      return getMahasiswaNavigation();
    }

    // Add other role-based navigation here
    return getDefaultNavigation();
  };

  const navigation = getNavigation();



  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SIM Akademik</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex justify-end">
            <ThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
