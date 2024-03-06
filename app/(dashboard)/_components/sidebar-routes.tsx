"use client";

import { BarChart, Braces, Code, Compass, Bot, Layout, List, FileCheck, Terminal, Image, Languages } from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
  {
    icon: Code,
    label: "Code Generator",
    href: "/code-generator",
  },
  {
    icon: Braces,
    label: "Code Debugger",
    href: "/code-debugger",
  },
  {
    icon: Bot,
    label: "Code Assistant",
    href: "/code-assistant",
  },
  {
    icon: Languages,
    label: "AI Code Translator",
    href: "/ai-code-translator",
  },
  {
    icon: Terminal,
    label: "Online Complier",
    href: "/online-compiler",
  },
  {
    icon: FileCheck,
    label: "Coding Snippets",
    href: "/code-snippets",
  },
  {
    icon: Image,
    label: "Image to Code",
    href: "/image-to-code",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  )
}