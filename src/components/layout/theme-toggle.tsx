"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Tombol terang/gelap.
 *
 * Kedua ikon selalu dirender dan dipilih lewat kelas `dark` pada elemen html,
 * bukan lewat state "sudah ter-hidrasi". Dengan begitu tidak ada perbedaan
 * markup antara server dan klien, tidak ada kedipan ikon, dan tidak ada
 * placeholder yang menggeser tata letak app bar.
 */
export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="icon"
      size="md"
      aria-label={label}
      title={label}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </Button>
  );
}
