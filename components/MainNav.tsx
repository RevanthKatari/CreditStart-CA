"use client";

import { LayoutDashboard, BookOpen, Wallet, Map } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Dashboard", url: "/", icon: LayoutDashboard },
  { name: "Credit 101", url: "/credit-101", icon: BookOpen },
  { name: "Student Packages", url: "/student-packages", icon: Wallet },
  { name: "90-Day Roadmap", url: "/roadmap", icon: Map },
];

export default function MainNav() {
  return <NavBar items={navItems} />;
}
