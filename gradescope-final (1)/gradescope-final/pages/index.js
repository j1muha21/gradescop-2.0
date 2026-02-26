import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="GradeScope — International Academic Grade Conversion" activePage="home">

      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow" data-i18n="home.eyebrow">31 Countries · Bidirectional · Formula Transparent</p>
        <h1 data-i18n="home.headline">The International Academic<br />Intelligence <em>Platform.</em></h1>
        <p className="hero-sub" data-i18n="home.subheadline">
          Transparent grade conversion, GPA calculation, and in-depth education system guides
          for international students, admissions offices, and academic institutions worldwide.
        </p>
        <div className="hero-ctas">
          <Link href="/tools" className="btn-primary" data-i18n="home.ctaTools">Open Grade Converter</Link>
        </div>
        <div className="hero-stats">
          <div className="stat"><div className="stat-num">31</div><div className="stat-label" data-i18n="stats.countries">Countries</div></div>
          <div className="stat"><div className="stat-num">2</div><div className="stat-label" data-i18n="stats.tools">Live Tools</div></div>
          <div className="stat"><div className="stat-num">961</div><div className="stat-label" data-i18n="stats.pairs">Conversion Pairs</div></div>
          <div className="stat"><div className="stat-num">100%</div><div className="stat-label" data-i18n="stats.transparent">Formula Transparent</div></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" style={{background:'var(--white)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        <p className="section-label" data-i18n="home.platformLabel">Platform Capabilities</p>
        <h2 className="section-title" data-i18n="home.platformTitle">Everything You Need for<br />International Academic Navigation.</h2>
        <p className="section-desc" data-i18n="home.platformDesc">Built for students, administrators, and institutions who need reliable, explainable grade equivalency.</p>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🧮</div>
            <h3 data-i18n="feat.bavarian">Modified Bavarian Formula</h3>
            <p data-i18n="feat.bavarianDesc">Official DAAD-approved formula for all conversions to Germany, with complete step-by-step derivation shown.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3 data-i18n="feat.verdict">Pass/Fail Verdict</h3>
            <p data-i18n="feat.verdictDesc">Every conversion result shows pass/fail status, performance classification, and contextual interpretation based on destination country rules.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">↔️</div>
            <h3 data-i18n="feat.bidir">Fully Bidirectional</h3>
            <p data-i18n="feat.bidirDesc">All 31 countries are both source and destination. Any-to-any conversion pair is supported.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 data-i18n="feat.gpa">GPA Calculator</h3>
            <p data-i18n="feat.gpaDesc">Weighted GPA computation across 4.0, 4.3, 4.5, and 5.0 scales. Includes cumulative GPA tracking across semesters.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 data-i18n="feat.multilang">Multi-Language Interface</h3>
            <p data-i18n="feat.multilangDesc">Available in 8 languages. Switch language from the header to access the full platform in your preferred language.</p>
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{background:'var(--ink)',padding:'4rem 2rem',textAlign:'center'}}>
        <p style={{fontFamily:"'DM Mono',monospace",fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}} data-i18n="home.ctaStripLabel">
          Ready to Convert?
        </p>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:900,color:'#fff',marginBottom:'1.5rem',lineHeight:1.2}} data-i18n="home.ctaStripTitle">
          Convert Your Grades in Seconds.
        </h2>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/tools" className="btn-primary" data-i18n="home.ctaConverter">Grade Converter →</Link>
          <Link href="/tools?tab=gpa" className="btn-secondary" data-i18n="home.ctaGPA">GPA Calculator →</Link>
        </div>
      </section>

    </Layout>
  );
}
