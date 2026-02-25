import Layout from '../components/Layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout title="404 — Page Not Found | GradeScope">
      <div style={{maxWidth:'600px',margin:'0 auto',padding:'6rem 2rem',textAlign:'center'}}>
        <p style={{fontFamily:"'DM Mono',monospace",fontSize:'0.7rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'1rem'}}>404</p>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2.5rem,6vw,4rem)',fontWeight:900,lineHeight:1.1,marginBottom:'1rem'}}>Page Not Found</h1>
        <p style={{fontSize:'1rem',color:'var(--slate-light)',lineHeight:1.75,marginBottom:'2.5rem'}}>The page you're looking for doesn't exist. Perhaps you were looking for our grade converter?</p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link href="/" className="btn-primary">← Go Home</Link>
          <Link href="/tools" className="btn-secondary">Open Grade Converter</Link>
        </div>
      </div>
    </Layout>
  );
}
