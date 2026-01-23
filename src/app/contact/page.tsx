import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ContactForm } from "@/components/contact-form";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail, MapPin, Phone, Instagram } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Bim Yusuf",
  description: "Get in touch with Bim Yusuf for collaboration, consulting, or just to say hello.",
};

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/bimyusufk" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/bim-yusuf-k/" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/bim_yusuf21" },
  { icon: Mail, label: "Email", href: "mailto:bimyusufkarang21@gmail.com" },
  { icon: Phone, label: "WhatsApp", href: "https://wa.me/628131444891" },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content" className="mx-auto flex max-w-4xl flex-col gap-12 px-4 py-12 lg:py-16">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Get in Touch</h1>
          <p className="mt-2 text-lg text-slate-600">
            Have a project in mind, want to collaborate, or just want to say hello? I&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.5fr]">
          <div className="space-y-6">
            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Contact Info</h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Mail className="h-4 w-4 text-rose-500" />
                  <a href="mailto:bimyusufkarang21@gmail.com" className="hover:text-rose-700">
                    bimyusufkarang21@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <MapPin className="h-4 w-4 text-rose-500" />
                  <span>Indonesia</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Phone className="h-4 w-4 text-rose-500" />
                  <a href="https://wa.me/628131444891" className="hover:text-rose-700" target="_blank" rel="noreferrer">
                    +62 813 1444 891 (WhatsApp)
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <Instagram className="h-4 w-4 text-rose-500" />
                  <a href="https://instagram.com/bim_yusuf21" className="hover:text-rose-700" target="_blank" rel="noreferrer">
                    @bim_yusuf21
                  </a>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-rose-700">Connect</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-100 transition hover:bg-rose-100"
                    aria-label={s.label}
                  >
                    <s.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900">Send a Message</h2>
            <p className="mt-1 text-sm text-slate-600">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </p>
            <ContactForm />
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
