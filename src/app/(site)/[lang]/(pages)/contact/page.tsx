import { Github, Instagram, Linkedin, Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getSiteData } from "@/lib/site";

export const revalidate = 60;

const platformIcons: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  email: Mail,
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.contact.title,
    description: dict.contact.lead,
    alternates: { canonical: `/${lang}/contact` },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang = raw as Locale;

  const [dict, site] = await Promise.all([getDictionary(lang), getSiteData(lang)]);

  // Subjek surel diisi di muka agar pesan masuk sudah punya konteks.
  const mailSubject = encodeURIComponent(
    lang === "id" ? `Kolaborasi dengan ${site.name}` : `Collaboration with ${site.name}`,
  );
  const mailHref = `mailto:${site.email}?subject=${mailSubject}`;

  return (
    <>
      <PageHeader
        crumbs={[{ label: dict.nav.home, href: `/${lang}` }, { label: dict.contact.title }]}
        title={dict.contact.title}
        lead={dict.contact.lead}
      />

      <div className="gcp-container py-10 lg:py-14">
        <div className="grid max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <h2 className="text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">
              {dict.contact.channels}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ChannelCard
                icon={Mail}
                label={dict.contact.email}
                value={site.email}
                href={mailHref}
              />
              {site.phone && (
                <ChannelCard
                  icon={MessageCircle}
                  label={dict.contact.whatsapp}
                  value={site.phone}
                  href={`https://wa.me/${site.phone.replace(/\D/g, "")}`}
                  external
                />
              )}
              <ChannelCard icon={MapPin} label={dict.contact.location} value={site.location} />
            </div>

            <h2 className="mt-10 text-caption font-medium uppercase tracking-[0.06em] text-ink-tertiary">
              {dict.contact.social}
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {site.socials.map((social) => {
                const Icon = platformIcons[social.platform ?? ""] ?? Mail;
                return (
                  <Button key={social.url} variant="outlined" size="sm" asChild>
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {social.label}
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardBody className="p-5">
                <h2 className="text-subtitle text-ink">{dict.contact.preferredTitle}</h2>
                <p className="mt-2 text-ui text-ink-secondary">{dict.contact.preferredBody}</p>
                <Button className="mt-5 w-full" asChild>
                  <a href={mailHref}>
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    {dict.home.contactCta}
                  </a>
                </Button>
              </CardBody>
            </Card>

            <Banner tone="info">{dict.contact.responseTime}</Banner>
          </aside>
        </div>
      </div>
    </>
  );
}

function ChannelCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <Card interactive={Boolean(href)} className="relative">
      <CardBody className="flex items-start gap-3 p-5">
        <IconTile icon={icon} size="sm" />
        <div className="min-w-0">
          <p className="text-caption uppercase tracking-[0.06em] text-ink-tertiary">{label}</p>
          {href ? (
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="mt-1 block break-words text-ui text-brand after:absolute after:inset-0 after:content-['']"
            >
              {value}
            </a>
          ) : (
            <p className="mt-1 break-words text-ui text-ink">{value}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
