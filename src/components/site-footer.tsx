import Link from "next/link";

const socials = [
  { href: "https://github.com/bimyusufk", label: "GitHub" },
  { href: "https://www.linkedin.com/in/bim-yusuf-k/", label: "LinkedIn" },
  { href: "https://instagram.com/bim_yusuf21", label: "Instagram" },
  { href: "https://wa.me/628131444891", label: "WhatsApp" },
  { href: "mailto:bimyusufkarang21@gmail.com", label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-rose-100/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Bim Yusuf</p>
          <p className="text-sm text-slate-600">Product engineer · Research-driven builder</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-slate-700">
          {socials.map((social) => (
            <Link key={social.href} href={social.href} className="hover:text-rose-700" target="_blank">
              {social.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
