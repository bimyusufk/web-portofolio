import { notFound } from "next/navigation";

/**
 * Penangkap rute tak dikenal di dalam segmen bahasa.
 *
 * Tanpa ini, alamat seperti /id/entah-apa jatuh ke halaman galat bawaan Next
 * yang berada di luar layout situs - tanpa app bar, footer, maupun bahasa.
 * Dengan memanggil notFound() di sini, batas not-found milik [lang] yang
 * menangani, sehingga 404 tampil dalam bahasa dan kerangka yang benar.
 *
 * Segmen statis (/projects, /research, ...) tetap menang atas catch-all,
 * jadi rute yang sah tidak terpengaruh.
 */
export default function CatchAllPage(): never {
  notFound();
}
