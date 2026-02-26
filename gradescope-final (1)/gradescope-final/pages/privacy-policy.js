import Layout from '../components/Layout';
import Link from 'next/link';

const IG_URL = 'https://www.instagram.com/grade_scope?igsh=MWphc3F5ODJqbnN1OA%3D%3D&utm_source=qr';

const SECTIONS = [
  {
    n: '1', title: 'Who We Are',
    content: <>GradeScope (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is an international academic intelligence platform providing free grade conversion, GPA calculation, and education system information. You can reach us via Instagram at <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{color:'var(--gold)'}}>@grade_scope</a>.</>
  },
  {
    n: '2', title: 'Information We Collect',
    content: <>
      <p style={{fontSize:'0.9rem',color:'var(--slate)',lineHeight:1.75,marginBottom:'1rem'}}>GradeScope is designed to work with minimal data collection. Specifically:</p>
      <ul style={{listStyle:'none',padding:0,display:'flex',flexDirection:'column',gap:'0.6rem'}}>
        {[
          ['Usage Data', 'We may collect anonymous, aggregated usage statistics through standard web hosting logs. This data cannot identify you personally.'],
          ['Local Storage', 'Some settings (like your preferred language) may be stored locally in your browser. This data never leaves your device.'],
          ['Grade Inputs', 'Grades and GPA values you enter are processed entirely in your browser and are never transmitted to our servers.'],
        ].map(([k,v],i) => (
          <li key={i} style={{display:'flex',gap:'0.75rem',fontSize:'0.9rem',color:'var(--slate)',lineHeight:1.6}}>
            <span style={{color:'var(--gold)',flexShrink:0}}>✦</span>
            <span><strong>{k}:</strong> {v}</span>
          </li>
        ))}
      </ul>
    </>
  },
  { n: '3', title: 'Cookies', content: 'GradeScope does not use advertising cookies or third-party tracking cookies. We may use minimal functional cookies or browser local storage to remember your language preference. No personal profiles are built from your usage.' },
  { n: '4', title: 'How We Use Information', content: "Any anonymous usage data collected is used solely to improve the platform — understanding which tools are used most, which countries are searched, and how to prioritise new features. This data is never sold, shared with third parties for commercial purposes, or used to build personal profiles." },
  { n: '5', title: 'Third-Party Services', content: "GradeScope loads fonts from Google Fonts. Google's own privacy policy applies to those requests. We do not use Google Analytics, Facebook Pixel, or any other advertising or behavioural tracking tools. Our Contact page links to Instagram, which is governed by Meta's privacy policy." },
  { n: '6', title: "Children's Privacy", content: 'GradeScope is intended for users aged 13 and above. We do not knowingly collect personal data from children under 13. If you believe a child has provided us with personal information, please contact us via Instagram and we will promptly address the concern.' },
  {
    n: '7', title: 'Your Rights',
    content: <>Depending on your location, you may have rights under GDPR, CCPA, or other privacy laws. Since GradeScope collects virtually no personal data, there is typically nothing to access or delete. For any privacy-related requests, contact us at <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{color:'var(--gold)'}}>@grade_scope on Instagram</a>.</>
  },
  { n: '8', title: 'Changes to This Policy', content: 'We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top of this page. Continued use of GradeScope after any changes constitutes your acceptance of the updated policy.' },
  {
    n: '9', title: 'Contact Us',
    content: <>For any questions about this Privacy Policy or your data, please reach out to us on Instagram: <a href={IG_URL} target="_blank" rel="noopener noreferrer" style={{color:'var(--gold)',fontWeight:600}}>@grade_scope</a></>
  },
];

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy — GradeScope" activePage="privacy">
      <div style={{maxWidth:'860px',margin:'0 auto',padding:'4rem 2rem'}}>

        <div style={{marginBottom:'2.5rem'}}>
          <p style={{fontFamily:"'DM Mono',monospace",fontSize:'0.7rem',letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold)',marginBottom:'0.75rem'}}>Legal</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,5vw,3rem)',fontWeight:900,lineHeight:1.15,marginBottom:'0.75rem'}}>Privacy Policy</h1>
          <p style={{fontSize:'0.85rem',color:'var(--slate-light)',fontFamily:"'DM Mono',monospace"}}>Last updated: February 2026</p>
        </div>

        <div style={{background:'var(--parchment)',border:'1px solid var(--border)',borderLeft:'4px solid var(--gold)',borderRadius:'0 10px 10px 0',padding:'1.25rem 1.5rem',marginBottom:'2rem'}}>
          <p style={{fontSize:'0.9rem',color:'var(--slate)',lineHeight:1.7}}><strong>Summary:</strong> GradeScope does not sell your data, does not use advertising trackers, and does not require an account to use the platform.</p>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          {SECTIONS.map(s => (
            <div key={s.n} style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'12px',padding:'2rem'}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:700,marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.6rem'}}>
                <span style={{width:'3px',height:'1.1em',background:'var(--gold)',borderRadius:'2px',display:'inline-block'}}></span>
                {s.n}. {s.title}
              </h2>
              {typeof s.content === 'string'
                ? <p style={{fontSize:'0.9rem',color:'var(--slate)',lineHeight:1.75}}>{s.content}</p>
                : <div style={{fontSize:'0.9rem',color:'var(--slate)',lineHeight:1.75}}>{s.content}</div>
              }
            </div>
          ))}
        </div>

        <div style={{textAlign:'center',marginTop:'2.5rem'}}>
          <Link href="/" className="btn-primary">← Back to Home</Link>
        </div>

      </div>
    </Layout>
  );
}
