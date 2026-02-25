import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Layout({ children, title = 'GradeScope — International Academic Grade Conversion', activePage = '' }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langLabel, setLangLabel] = useState('English');

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }, [router.pathname]);

  function toggleMenu() {
    const next = !menuOpen;
    setMenuOpen(next);
    document.body.style.overflow = next ? 'hidden' : '';
  }

  function closeMenu() {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      const menu = document.getElementById('mobileMenu');
      const btn = document.getElementById('hamburgerBtn');
      if (menu && menuOpen && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        closeMenu();
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  // Language switcher — calls global setLanguage if available
  function handleLang(lang, label, btn) {
    setLangLabel(label);
    document.querySelectorAll('.lang-option').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.mobile-lang-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll(`[data-lang="${lang}"]`).forEach(b => b.classList.add('active'));
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.body.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    if (typeof window !== 'undefined' && window.setLanguage) {
      window.setLanguage(lang, null);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('gs_lang', lang);
      localStorage.setItem('gs_lang_label', label);
    }
    closeMenu();
  }

  // Restore saved language on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLang = localStorage.getItem('gs_lang');
    const savedLabel = localStorage.getItem('gs_lang_label');
    if (savedLang && savedLabel) {
      setLangLabel(savedLabel);
      document.documentElement.setAttribute('dir', savedLang === 'ar' ? 'rtl' : 'ltr');
    }
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
  ];

  const toolLinks = [
    { href: '/tools', label: '🎓 Grade Converter', badge: 'LIVE' },
    { href: '/tools#gpa', label: '📊 GPA Calculator', badge: 'LIVE' },
    { href: '/tools#flashcard', label: '🃏 Flashcard Study Tool', badge: 'LIVE' },
  ];

  const langs = [
    { code: 'en', flag: '🇬🇧', label: 'English', short: 'EN' },
    { code: 'de', flag: '🇩🇪', label: 'Deutsch', short: 'DE' },
    { code: 'fr', flag: '🇫🇷', label: 'Français', short: 'FR' },
    { code: 'es', flag: '🇪🇸', label: 'Español', short: 'ES' },
    { code: 'ar', flag: '🇦🇪', label: 'العربية', short: 'AR' },
    { code: 'zh', flag: '🇨🇳', label: '中文', short: 'ZH' },
    { code: 'pt', flag: '🇵🇹', label: 'Português', short: 'PT' },
    { code: 'tr', flag: '🇹🇷', label: 'Türkçe', short: 'TR' },
  ];

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

      {/* HEADER */}
      <header>
        <nav>
          <Link href="/" className="logo">
            <span className="logo-mark">Grade<span>Scope</span></span>
            <span className="logo-tag">Academic Intelligence</span>
          </Link>

          <ul className="nav-links">
            {navLinks.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={router.pathname === l.href ? 'active-nav' : ''}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="dropdown-wrap">
              <Link href="/tools" className={router.pathname === '/tools' ? 'active-nav' : ''}>
                Tools
              </Link>
              <div className="dropdown">
                <Link href="/tools">🎓 <span>Grade Converter</span> <span className="dropdown-badge">LIVE</span></Link>
                <Link href="/tools?tab=gpa">📊 <span>GPA Calculator</span> <span className="dropdown-badge">LIVE</span></Link>
                <Link href="/tools?tab=flashcard">🃏 <span>Flashcard Study Tool</span> <span className="dropdown-badge">LIVE</span></Link>
              </div>
            </li>
          </ul>

          {/* Language Switcher */}
          <div className="lang-switcher">
            <button className="lang-btn" aria-label="Change language">
              <span className="globe">🌐</span>
              <span id="currentLangLabel">{langLabel}</span>
              <span className="chevron">▾</span>
            </button>
            <div className="lang-dropdown">
              {langs.map(l => (
                <button
                  key={l.code}
                  className={`lang-option ${l.code === 'en' ? 'active' : ''}`}
                  data-lang={l.code}
                  onClick={() => handleLang(l.code, l.label)}
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
        <Link href="/" className="mobile-menu-item" onClick={closeMenu}>🏠 Home</Link>
        <Link href="/about" className="mobile-menu-item" onClick={closeMenu}>ℹ️ About</Link>
        <div className="mobile-menu-label">Tools</div>
        <Link href="/tools" className="mobile-menu-item" onClick={closeMenu}>
          🎓 Grade Converter <span style={{fontSize:'0.7rem',background:'var(--gold)',color:'var(--ink)',padding:'1px 6px',borderRadius:'3px',fontWeight:700,marginLeft:'0.5rem'}}>LIVE</span>
        </Link>
        <Link href="/tools?tab=gpa" className="mobile-menu-item" onClick={closeMenu}>
          📊 GPA Calculator <span style={{fontSize:'0.7rem',background:'var(--gold)',color:'var(--ink)',padding:'1px 6px',borderRadius:'3px',fontWeight:700,marginLeft:'0.5rem'}}>LIVE</span>
        </Link>
        <Link href="/tools?tab=flashcard" className="mobile-menu-item" onClick={closeMenu}>
          🃏 Flashcard Study Tool <span style={{fontSize:'0.7rem',background:'var(--gold)',color:'var(--ink)',padding:'1px 6px',borderRadius:'3px',fontWeight:700,marginLeft:'0.5rem'}}>LIVE</span>
        </Link>
        <div className="mobile-menu-label">Language</div>
        <div className="mobile-menu-lang">
          {langs.map(l => (
            <button
              key={l.code}
              className={`mobile-lang-btn ${l.code === 'en' ? 'active' : ''}`}
              data-lang={l.code}
              onClick={() => handleLang(l.code, l.label)}
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
          <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.45)',marginBottom:'1.5rem'}}>
            International Academic Intelligence Platform
          </p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:'1.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
              { href: '/privacy-policy', label: 'Privacy Policy' },
            ].map(l => (
              <Link key={l.href} href={l.href} className="footer-link">{l.label}</Link>
            ))}
            <a
              href="https://www.instagram.com/grade_scope?igsh=MWphc3F5ODJqbnN1OA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
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
            <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.3)'}}>
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
      `}</style>
    </>
  );
}
