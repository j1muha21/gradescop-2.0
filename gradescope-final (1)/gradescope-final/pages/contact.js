import Layout from '../components/Layout';

const IG_URL = 'https://www.instagram.com/grade_scope?igsh=MWphc3F5ODJqbnN1OA%3D%3D&utm_source=qr';

export default function Contact() {
  return (
    <Layout title="Contact — GradeScope" activePage="contact">
      <div style={{maxWidth:'600px',margin:'0 auto',padding:'4rem 2rem',textAlign:'center'}}>

        <p style={{fontFamily:"'DM Mono',monospace",fontSize:'0.7rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}} data-i18n="contact.eyebrow">Get In Touch</p>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,5vw,3rem)',fontWeight:900,lineHeight:1.15,letterSpacing:'-0.02em',marginBottom:'1rem'}} data-i18n="contact.headline">
          We&apos;d Love to Hear From You.
        </h1>
        <p style={{fontSize:'1rem',color:'var(--slate-light)',lineHeight:1.75,marginBottom:'3rem'}} data-i18n="contact.sub">
          Have a question, suggestion, or just want to say hi? Reach us directly on Instagram — we read every message.
        </p>

        <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="ig-card">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="ig-icon">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          <div style={{textAlign:'left'}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:'0.68rem',letterSpacing:'0.15em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.3rem'}} data-i18n="contact.igLabel">Find Us On</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:700,color:'#fff'}}>@grade_scope</div>
            <div style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.5)',marginTop:'0.2rem'}}>instagram.com/grade_scope</div>
          </div>
        </a>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'1rem',marginTop:'3rem'}}>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1.5rem 1rem'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>💬</div>
            <div style={{fontSize:'0.85rem',fontWeight:600,marginBottom:'0.3rem'}} data-i18n="contact.card1.title">Questions</div>
            <div style={{fontSize:'0.78rem',color:'var(--slate-light)',lineHeight:1.5}} data-i18n="contact.card1.desc">Ask us anything about grade conversion or GPA calculations.</div>
          </div>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1.5rem 1rem'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>💡</div>
            <div style={{fontSize:'0.85rem',fontWeight:600,marginBottom:'0.3rem'}} data-i18n="contact.card2.title">Suggestions</div>
            <div style={{fontSize:'0.78rem',color:'var(--slate-light)',lineHeight:1.5}} data-i18n="contact.card2.desc">Want a new country or feature? We want to know.</div>
          </div>
          <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'10px',padding:'1.5rem 1rem'}}>
            <div style={{fontSize:'1.5rem',marginBottom:'0.5rem'}}>🤝</div>
            <div style={{fontSize:'0.85rem',fontWeight:600,marginBottom:'0.3rem'}} data-i18n="contact.card3.title">Partnerships</div>
            <div style={{fontSize:'0.78rem',color:'var(--slate-light)',lineHeight:1.5}} data-i18n="contact.card3.desc">Schools, universities, and institutions are welcome to reach out.</div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .ig-card { display:inline-flex; align-items:center; gap:1rem; background:var(--ink); border:2px solid var(--gold); border-radius:14px; padding:1.75rem 2.5rem; text-decoration:none; transition:all 0.2s; color:inherit; }
        .ig-card:hover { background:var(--gold); color:var(--ink); }
        .ig-card:hover .ig-icon { color:var(--ink); }
        .ig-icon { color:var(--gold); flex-shrink:0; transition:color 0.2s; }
        @media (max-width:640px) {
          .ig-card { flex-direction:column; }
          div[style*="grid-template-columns:1fr 1fr 1fr"] { grid-template-columns:1fr !important; }
        }
      `}</style>
    </Layout>
  );
}
