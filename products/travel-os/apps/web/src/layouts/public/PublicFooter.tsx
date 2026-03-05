'use client';

import { type FormEvent, useState } from 'react';
import Link from 'next/link';

import { APP_NAME, APP_VERSION } from '@/config/constants';
import { Icon } from '@/components/icons/Icon';
import type { IconProps } from '@/components/icons/Icon';

// ─── Sitemap data ─────────────────────────────────────────────────────────────

export interface FooterLinkItem {
  label: string;
  href:  string;
}

export interface FooterColumn {
  heading: string;
  links:   FooterLinkItem[];
}

export const FOOTER_SITEMAP: FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',     href: '/features' },
      { label: 'Pricing',      href: '/pricing' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'Changelog',    href: '/changelog' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',    href: '/about' },
      { label: 'Blog',     href: '/blog' },
      { label: 'Careers',  href: '/careers' },
      { label: 'Press',    href: '/press' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Docs',          href: '/docs' },
      { label: 'API Reference', href: '/api-reference' },
      { label: 'Support',       href: '/support' },
      { label: 'Status',        href: '/status' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',   href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy',    href: '/cookies' },
    ],
  },
];

// ─── Social data ──────────────────────────────────────────────────────────────

export interface SocialLink {
  label: string;
  href:  string;
  icon:  IconProps['name'];
}

export const FOOTER_SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub',    href: 'https://github.com/travelOS',           icon: 'Github' },
  { label: 'LinkedIn',  href: 'https://linkedin.com/company/travelOS', icon: 'Linkedin' },
  { label: 'Twitter',   href: 'https://twitter.com/travelOS',          icon: 'Twitter' },
  { label: 'YouTube',   href: 'https://youtube.com/@travelOS',         icon: 'Youtube' },
  { label: 'Instagram', href: 'https://instagram.com/travelOS',        icon: 'Instagram' },
];

// ─── Newsletter ───────────────────────────────────────────────────────────────

function NewsletterForm() {
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  }

  if (submitted) {
    return (
      <p
        className="tos-pub-footer__newsletter-success"
        role="status"
        data-testid="newsletter-success"
      >
        <Icon name="CircleCheck" size={16} aria-hidden />
        Thanks! You&apos;re subscribed.
      </p>
    );
  }

  return (
    <form
      className="tos-pub-footer__newsletter-form"
      onSubmit={handleSubmit}
      aria-label="Newsletter signup"
      data-testid="newsletter-form"
      noValidate
    >
      <label
        htmlFor="pub-newsletter-email"
        className="tos-pub-footer__newsletter-label"
      >
        Subscribe to our newsletter
      </label>
      <div className="tos-pub-footer__newsletter-row">
        <input
          id="pub-newsletter-email"
          type="email"
          name="email"
          className="tos-pub-footer__newsletter-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          aria-label="Email address for newsletter"
          data-testid="newsletter-email-input"
          required
        />
        <button
          type="submit"
          className="tos-pub-footer__newsletter-btn"
          aria-label="Subscribe to newsletter"
          data-testid="newsletter-submit-btn"
        >
          <Icon name="Send" size={16} aria-hidden />
          <span>Subscribe</span>
        </button>
      </div>
    </form>
  );
}

// ─── PublicFooter ─────────────────────────────────────────────────────────────

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="tos-pub-footer"
      role="contentinfo"
      aria-label={`${APP_NAME} site footer`}
      data-testid="public-footer"
    >
      {/* ── Top section: brand + newsletter ───────────────────────────── */}
      <div className="tos-pub-footer__top">
        <div className="tos-pub-footer__brand">
          <Link
            href="/"
            className="tos-pub-footer__brand-link"
            aria-label={`${APP_NAME} — back to home`}
            data-testid="footer-brand-link"
          >
            <Icon name="Globe" size={20} aria-hidden />
            <span className="tos-pub-footer__brand-name">{APP_NAME}</span>
          </Link>
          <p className="tos-pub-footer__tagline">
            Your World, Your Journey — powered by AI.
          </p>
        </div>

        <div className="tos-pub-footer__newsletter" data-testid="footer-newsletter">
          <NewsletterForm />
        </div>
      </div>

      {/* ── Sitemap ────────────────────────────────────────────────────── */}
      <div className="tos-pub-footer__sitemap" data-testid="footer-sitemap">
        {FOOTER_SITEMAP.map((col) => (
          <div key={col.heading} className="tos-pub-footer__col">
            <h3 className="tos-pub-footer__col-heading">{col.heading}</h3>
            <nav aria-label={`${col.heading} links`}>
              <ul className="tos-pub-footer__col-list" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="tos-pub-footer__col-link"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        ))}
      </div>

      {/* ── Bottom bar: social + copyright ────────────────────────────── */}
      <div className="tos-pub-footer__bottom">
        {/* Social links */}
        <div
          className="tos-pub-footer__social"
          aria-label="Social media links"
          data-testid="footer-social"
        >
          {FOOTER_SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="tos-pub-footer__social-link"
              aria-label={`${APP_NAME} on ${social.label}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`social-${social.label.toLowerCase()}`}
            >
              <Icon name={social.icon} size={18} aria-hidden />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="tos-pub-footer__copy" data-testid="footer-copyright">
          <span aria-hidden>©</span>
          <span className="tos-sr-only">Copyright</span>
          {' '}{year} {APP_NAME}.
          {' '}All rights reserved.
          {' '}
          <span
            className="tos-pub-footer__version"
            aria-label={`Version ${APP_VERSION}`}
          >
            v{APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
}
