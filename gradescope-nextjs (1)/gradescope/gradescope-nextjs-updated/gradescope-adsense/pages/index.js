import Layout from '../components/Layout';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="GradeScope — International Academic Grade Conversion" activePage="home">

      {/* HERO */}
      <section className="hero">
        <p className="hero-eyebrow">31 Countries · Bidirectional · Formula Transparent</p>
        <h1>The International Academic<br />Intelligence <em>Platform.</em></h1>
        <p className="hero-sub">
          Transparent grade conversion, GPA calculation, and in-depth education system guides
          for international students, admissions offices, and academic institutions worldwide.
        </p>
        <div className="hero-ctas">
          <Link href="/tools" className="btn-primary">Open Grade Converter</Link>
        </div>
        <div className="hero-stats">
          <div className="stat"><div className="stat-num">31</div><div className="stat-label">Countries</div></div>
          <div className="stat"><div className="stat-num">3</div><div className="stat-label">Live Tools</div></div>
          <div className="stat"><div className="stat-num">961</div><div className="stat-label">Conversion Pairs</div></div>
          <div className="stat"><div className="stat-num">100%</div><div className="stat-label">Formula Transparent</div></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" style={{background:'var(--white)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        <p className="section-label">Platform Capabilities</p>
        <h2 className="section-title">Everything You Need for<br />International Academic Navigation.</h2>
        <p className="section-desc">Built for students, administrators, and institutions who need reliable, explainable grade equivalency.</p>
        <div className="feature-grid">
          {[
            { icon: '🧮', title: 'Modified Bavarian Formula', desc: 'Official DAAD-approved formula for all conversions to Germany, with complete step-by-step derivation shown.' },
            { icon: '🎓', title: 'Pass/Fail Verdict', desc: 'Every conversion result shows pass/fail status, performance classification, and contextual interpretation based on destination country rules.' },
            { icon: '↔️', title: 'Fully Bidirectional', desc: 'All 31 countries are both source and destination. Any-to-any conversion pair is supported.' },
            { icon: '📖', title: 'Education System Guides', desc: 'Long-form country guides covering degree structure, grading scales, GPA methods, passing marks, and international recognition.' },
            { icon: '📊', title: 'GPA Calculator', desc: 'Weighted GPA computation across 4.0, 4.3, 4.5, and 5.0 scales. Includes cumulative GPA tracking across semesters.' },
            { icon: '🌐', title: 'Multi-Language Interface', desc: 'Available in 8 languages. Switch language from the header to access the full platform in your preferred language.' },
          ].map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section style={{background:'var(--ink)',padding:'4rem 2rem',textAlign:'center'}}>
        <p style={{fontFamily:"'DM Mono',monospace",fontSize:'0.7rem',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}}>
          Ready to Convert?
        </p>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(1.8rem,4vw,2.8rem)',fontWeight:900,color:'#fff',marginBottom:'1.5rem',lineHeight:1.2}}>
          Convert Your Grades in Seconds.
        </h2>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/tools" className="btn-primary">Grade Converter →</Link>
          <Link href="/tools?tab=gpa" className="btn-secondary">GPA Calculator →</Link>
        </div>
      </section>

    </Layout>
  );
}
