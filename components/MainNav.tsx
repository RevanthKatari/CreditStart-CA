"use client";

import { LayoutDashboard, BookOpen, Wallet, Map, Sparkles, SlidersHorizontal } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Dashboard", url: "/", icon: LayoutDashboard },
  { name: "Find My Setup", url: "/recommend", icon: Sparkles },
  { name: "Score Simulator", url: "/simulator", icon: SlidersHorizontal },
  { name: "Credit 101", url: "/credit-101", icon: BookOpen },
  { name: "Packages", url: "/student-packages", icon: Wallet },
  { name: "Roadmap", url: "/roadmap", icon: Map },
];

export default function MainNav() {
  return <NavBar items={navItems} />;
}
