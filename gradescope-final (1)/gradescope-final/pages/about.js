import Layout from '../components/Layout';
import Link from 'next/link';

export default function About() {
  return (
    <Layout title="About — GradeScope" activePage="about">
      <div style={{maxWidth:'900px',margin:'0 auto',padding:'4rem 2rem'}}>

        <div style={{background:'var(--ink)',borderRadius:'14px',padding:'3rem 2.5rem',marginBottom:'2.5rem',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 60% at 20% 50%,rgba(201,153,58,0.10),transparent)',pointerEvents:'none'}}></div>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:'0.7rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}} data-i18n="about.eyebrow">About GradeScope</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,5vw,3.2rem)',fontWeight:900,color:'#fff',lineHeight:1.15,letterSpacing:'-0.02em',marginBottom:'1.25rem'}} data-i18n="about.headline">Built for Students<br />Who Cross Borders.</h1>
          <p style={{fontSize:'1.05rem',color:'rgba(255,255,255,0.6)',maxWidth:'600px',lineHeight:1.75}} data-i18n="about.sub">GradeScope is a free international academic intelligence platform designed to make grade conversion, GPA calculation, and education system understanding accessible to every student, institution, and admissions office in the world.</p>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem',marginBottom:'2rem'}}>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'12px',padding:'2rem'}}>
            <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🎯</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:700,marginBottom:'0.75rem'}} data-i18n="about.mission.title">Our Mission</h3>
            <p style={{fontSize:'0.9rem',color:'var(--slate-light)',lineHeight:1.7}} data-i18n="about.mission.desc">To eliminate confusion in international academic transitions by providing transparent, formula-driven grade conversions — not black-box guesses. Every result comes with a full explanation of the method used.</p>
          </div>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'12px',padding:'2rem'}}>
            <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🌍</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:700,marginBottom:'0.75rem'}} data-i18n="about.global.title">Global Coverage</h3>
            <p style={{fontSize:'0.9rem',color:'var(--slate-light)',lineHeight:1.7}} data-i18n="about.global.desc">We support 31 countries and 961 conversion pairs. Whether you're converting a US GPA to a German note, a UK classification to a French mention, or a Nigerian CGPA — we've got you covered.</p>
          </div>
        </div>

        <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'12px',padding:'2rem',marginBottom:'1.5rem'}}>
          <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',fontWeight:700,marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'0.6rem'}}>
            <span style={{width:'3px',height:'1.2em',background:'var(--gold)',borderRadius:'2px',display:'inline-block'}}></span>
            <span data-i18n="about.diff.title">What Makes Us Different</span>
          </h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div style={{display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
              <span style={{color:'var(--gold)',fontSize:'1.1rem',flexShrink:0,marginTop:'0.1rem'}}>✦</span>
              <div><strong style={{fontSize:'0.9rem'}} data-i18n="about.diff.transparent.title">Formula Transparent</strong><p style={{fontSize:'0.84rem',color:'var(--slate-light)',marginTop:'0.2rem',lineHeight:1.6}} data-i18n="about.diff.transparent.desc">Every conversion shows the exact formula used — Modified Bavarian, linear interpolation, or classification-based — so you always know how your grade was calculated.</p></div>
            </div>
            <div style={{display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
              <span style={{color:'var(--gold)',fontSize:'1.1rem',flexShrink:0,marginTop:'0.1rem'}}>✦</span>
              <div><strong style={{fontSize:'0.9rem'}} data-i18n="about.diff.verdict.title">Pass/Fail Verdict</strong><p style={{fontSize:'0.84rem',color:'var(--slate-light)',marginTop:'0.2rem',lineHeight:1.6}} data-i18n="about.diff.verdict.desc">We apply each destination country's actual passing threshold — not just a number, but a real academic verdict that matters for admissions and enrollment.</p></div>
            </div>
            <div style={{display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
              <span style={{color:'var(--gold)',fontSize:'1.1rem',flexShrink:0,marginTop:'0.1rem'}}>✦</span>
              <div><strong style={{fontSize:'0.9rem'}} data-i18n="about.diff.free.title">Fully Free</strong><p style={{fontSize:'0.84rem',color:'var(--slate-light)',marginTop:'0.2rem',lineHeight:1.6}} data-i18n="about.diff.free.desc">GradeScope is completely free to use. No subscriptions, no paywalls. We believe academic tools should be accessible to every student worldwide.</p></div>
            </div>
            <div style={{display:'flex',gap:'0.75rem',alignItems:'flex-start'}}>
              <span style={{color:'var(--gold)',fontSize:'1.1rem',flexShrink:0,marginTop:'0.1rem'}}>✦</span>
              <div><strong style={{fontSize:'0.9rem'}} data-i18n="about.diff.lang.title">Multi-Language</strong><p style={{fontSize:'0.84rem',color:'var(--slate-light)',marginTop:'0.2rem',lineHeight:1.6}} data-i18n="about.diff.lang.desc">Available in 8 languages including Arabic (RTL), Chinese, German, French, Spanish, Portuguese, and Turkish — so students can navigate in their own language.</p></div>
            </div>
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'2rem'}}>
          {[
            {n:'31', lKey:'about.stat.countries', lDef:'Countries'},
            {n:'961', lKey:'about.stat.pairs', lDef:'Conversion Pairs'},
            {n:'2', lKey:'about.stat.tools', lDef:'Live Tools'},
            {n:'8', lKey:'about.stat.langs', lDef:'Languages'},
          ].map((s,i) => (
            <div key={i} style={{background:'var(--ink)',borderRadius:'10px',padding:'1.5rem',textAlign:'center'}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2rem',fontWeight:700,color:'var(--gold)'}}>{s.n}</div>
              <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.45)',textTransform:'uppercase',letterSpacing:'0.08em',marginTop:'0.3rem'}} data-i18n={s.lKey}>{s.lDef}</div>
            </div>
          ))}
        </div>

        <div style={{background:'var(--parchment)',border:'1px solid var(--border)',borderLeft:'4px solid var(--gold)',borderRadius:'0 10px 10px 0',padding:'1.5rem 2rem',textAlign:'center'}}>
          <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',fontStyle:'italic',color:'var(--slate)',lineHeight:1.7}} data-i18n="about.quote">"Grades should be a bridge, not a barrier. GradeScope exists to make sure your academic achievements are understood — wherever in the world you choose to go."</p>
          <p style={{fontSize:'0.8rem',color:'var(--gold)',fontFamily:"'DM Mono',monospace",letterSpacing:'0.1em',marginTop:'0.75rem'}} data-i18n="about.quoteAuthor">— THE GRADESCOPE TEAM</p>
        </div>

        <div style={{textAlign:'center',marginTop:'2rem',display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/tools" className="btn-primary" data-i18n="about.ctaConverter">Try the Grade Converter →</Link>
          <Link href="/contact" className="btn-secondary" data-i18n="about.ctaContact">Contact Us</Link>
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns:1fr 1fr"],
          div[style*="grid-template-columns:repeat(4"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns:repeat(4"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </Layout>
  );
}
