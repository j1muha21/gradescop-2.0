import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const LANGS = [
  { code: 'en', flag: '🇬🇧', label: 'English',    short: 'EN' },
  { code: 'de', flag: '🇩🇪', label: 'Deutsch',    short: 'DE' },
  { code: 'fr', flag: '🇫🇷', label: 'Français',   short: 'FR' },
  { code: 'es', flag: '🇪🇸', label: 'Español',    short: 'ES' },
  { code: 'ar', flag: '🇦🇪', label: 'العربية',    short: 'AR' },
  { code: 'zh', flag: '🇨🇳', label: '中文',        short: 'ZH' },
  { code: 'pt', flag: '🇵🇹', label: 'Português',  short: 'PT' },
  { code: 'tr', flag: '🇹🇷', label: 'Türkçe',     short: 'TR' },
];

export default function Layout({ children, title = 'GradeScope — International Academic Grade Conversion' }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [router.pathname]);

  // On mount: read saved language and apply it once i18n is ready
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gs_lang');
      if (saved) setActiveLang(saved);
    } catch (_) {}
  }, []);

  // Whenever activeLang changes, call the i18n engine
  useEffect(() => {
    applyLang(activeLang);
  }, [activeLang]);

  function applyLang(lang) {
    // i18n.js may not be loaded yet — retry until it is
    if (typeof window === 'undefined') return;
    if (!window.GS_setLanguage) {
      setTimeout(() => applyLang(lang), 80);
      return;
    }
    window.GS_setLanguage(lang, null);
    // Update the visible label in React state (the span is rendered by React)
    const labels = { en:'English', de:'Deutsch', fr:'Français', es:'Español', ar:'العربية', zh:'中文', pt:'Português', tr:'Türkçe' };
    const labelEl = document.getElementById('currentLangLabel');
    if (labelEl) labelEl.textContent = labels[lang] || lang;
    // RTL
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    // Active class on buttons
    document.querySelectorAll('[data-lang]').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  function handleLang(lang) {
    setActiveLang(lang);
    try { localStorage.setItem('gs_lang', lang); } catch (_) {}
    setMenuOpen(false);
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  }

  function closeMenu() {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e) {
      const menu = document.getElementById('mobileMenu');
      const btn  = document.getElementById('hamburgerBtn');
      if (menuOpen && menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        closeMenu();
      }
    }
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [menuOpen]);

  const isActive = (path) => router.pathname === path;

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* i18n script — loads on EVERY page */}
      <Script src="/i18n.js" strategy="afterInteractive" onLoad={() => applyLang(activeLang)} />

      {/* Google AdSense */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8107397171383696"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* HEADER */}
      <header>
        <nav>
          <Link href="/" className="logo">
            <span className="logo-mark">Grade<span>Scope</span></span>
            <span className="logo-tag">Academic Intelligence</span>
          </Link>

          <ul className="nav-links">
            <li>
              <Link href="/" className={isActive('/') ? 'active-nav' : ''} data-i18n="nav.home">Home</Link>
            </li>
            <li>
              <Link href="/about" className={isActive('/about') ? 'active-nav' : ''}>About</Link>
            </li>
            <li className="dropdown-wrap">
              <Link href="/tools" className={isActive('/tools') ? 'active-nav' : ''} data-i18n="nav.tools">Tools</Link>
              <div className="dropdown">
                <Link href="/tools">🎓 <span data-i18n="nav.gradeConverter">Grade Converter</span> <span className="dropdown-badge">LIVE</span></Link>
                <Link href="/tools?tab=gpa">📊 <span data-i18n="nav.gpaCalc">GPA Calculator</span> <span className="dropdown-badge">LIVE</span></Link>
              </div>
            </li>
          </ul>

          {/* Language Switcher */}
          <div className="lang-switcher">
            <button className="lang-btn" aria-label="Change language">
              <span className="globe">🌐</span>
              <span id="currentLangLabel">
                {LANGS.find(l => l.code === activeLang)?.label || 'English'}
              </span>
              <span className="chevron">▾</span>
            </button>
            <div className="lang-dropdown">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  className={`lang-option ${activeLang === l.code ? 'active' : ''}`}
                  data-lang={l.code}
                  onClick={() => handleLang(l.code)}
                >
                  <span className="lang-flag">{l.flag}</span> {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            id="hamburgerBtn"
            aria-label="Open menu"
            onClick={toggleMenu}
          >
            <span></span><span></span><span></span>
          </button>
        </nav>
      </header>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobileMenu">
        <div className="mobile-menu-label">Navigation</div>
        <Link href="/"           className="mobile-menu-item" onClick={closeMenu}>🏠 <span data-i18n="nav.home">Home</span></Link>
        <Link href="/about"      className="mobile-menu-item" onClick={closeMenu}>ℹ️ About</Link>
        <div className="mobile-menu-label">Tools</div>
        <Link href="/tools"             className="mobile-menu-item" onClick={closeMenu}>
          🎓 <span data-i18n="nav.gradeConverter">Grade Converter</span>{' '}
          <span style={{fontSize:'0.7rem',background:'var(--gold)',color:'var(--ink)',padding:'1px 6px',borderRadius:'3px',fontWeight:700,marginLeft:'0.4rem'}}>LIVE</span>
        </Link>
        <Link href="/tools?tab=gpa"      className="mobile-menu-item" onClick={closeMenu}>
          📊 <span data-i18n="nav.gpaCalc">GPA Calculator</span>{' '}
          <span style={{fontSize:'0.7rem',background:'var(--gold)',color:'var(--ink)',padding:'1px 6px',borderRadius:'3px',fontWeight:700,marginLeft:'0.4rem'}}>LIVE</span>
        </Link>
        <div className="mobile-menu-label">Language</div>
        <div className="mobile-menu-lang">
          {LANGS.map(l => (
            <button
              key={l.code}
              className={`mobile-lang-btn ${activeLang === l.code ? 'active' : ''}`}
              data-lang={l.code}
              onClick={() => handleLang(l.code)}
            >
              {l.flag} {l.short}
            </button>
          ))}
        </div>
      </div>

      {/* PAGE CONTENT */}
      <main>{children}</main>

      {/* FOOTER */}
      <footer>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 2rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem',marginBottom:'1.25rem'}}>
            <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:900,color:'#fff'}}>
              Grade<span style={{color:'var(--gold)'}}>Scope</span>
            </span>
          </div>
          <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.45)',marginBottom:'1.5rem'}} data-i18n="footer.tagline">
            International Academic Intelligence Platform
          </p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
            {[
              { href:'/',               label:'Home' },
              { href:'/about',          label:'About' },
              { href:'/contact',        label:'Contact' },
              { href:'/privacy-policy', label:'Privacy Policy' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
            ))}
            <a
              href="https://www.instagram.com/grade_scope?igsh=MWphc3F5ODJqbnN1OA%3D%3D&utm_source=qr"
              target="_blank" rel="noopener noreferrer"
              className="footer-link footer-ig"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span style={{fontSize:'0.85rem'}}>Instagram</span>
            </a>
          </div>
          <div style={{borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:'1.25rem'}}>
            <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.3)'}} data-i18n="footer.disclaimer">
              For informational purposes only · Final recognition determined by receiving institution
            </span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .footer-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        .footer-link:hover { color: var(--gold); }
        .footer-ig { display: flex; align-items: center; gap: 0.4rem; }
        .active-nav { color: var(--gold) !important; }
        .mobile-menu-item {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.85rem 1.5rem;
          font-size: 0.95rem;
          color: rgba(255,255,255,0.8);
          transition: color 0.2s, background 0.2s;
          text-decoration: none;
        }
        .mobile-menu-item:hover { color: var(--gold); background: rgba(255,255,255,0.04); }
        a.btn-primary, a.btn-secondary {
          display: inline-block;
          text-decoration: none;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
