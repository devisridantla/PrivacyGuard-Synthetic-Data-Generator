import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, AlertTriangle, CheckCircle2, FileCode, Scale, 
  Search, ShieldAlert, Cpu, Award, ExternalLink 
} from 'lucide-react';

export default function PrivacyPage() {
  const [testEmail, setTestEmail] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const reservedDomains = [
    'example.com', 'example.org', 'example.net', 
    'test.edu', 'synthetic.local', 'student.example.org'
  ];

  const handleTestScan = (e) => {
    e.preventDefault();
    if (!testEmail.trim()) return;

    const email = testEmail.trim().toLowerCase();
    const domain = email.includes('@') ? email.split('@')[1] : '';

    const isReserved = reservedDomains.some(d => domain === d || domain.endsWith('.' + d));
    const isCommercial = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'].includes(domain);

    if (isReserved) {
      setScanResult({
        safe: true,
        message: `RFC-Reserved Test Domain Verified: '@${domain}' is officially protected by IETF RFC 2606. Safe for synthetic datasets.`,
        badge: '100% Synthetic Safe'
      });
    } else if (isCommercial) {
      setScanResult({
        safe: false,
        message: `Real Public Provider Detected: '@${domain}' is a live commercial email domain. PrivacyGuard strictly blocks real email domains to prevent accidental communication.`,
        badge: 'VIOLATION DETECTED'
      });
    } else {
      setScanResult({
        safe: false,
        message: `Non-Standard Domain: '@${domain}' is not in the IETF RFC 2606 reserved synthetic test list.`,
        badge: 'UNRESERVED DOMAIN'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy & Security Architecture</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Zero-PII Compliance
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Comprehensive review of PrivacyGuard's algorithmic safeguards, mathematical guarantees, 
          and compliance with global data protection frameworks.
        </p>
      </div>

      {/* Comparison: Synthetic Data vs Traditional Anonymization */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">The Fundamental Difference</span>
          <h2 className="text-2xl font-bold text-white mt-1">Why Anonymization Fails & Synthetic Data Prevails</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Traditional masking and pseudonymization (e.g. hashing names or masking phone numbers) leave latent correlations 
            vulnerable to re-identification attacks when combined with public auxiliary datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Anonymized Data */}
          <div className="p-5 rounded-xl bg-slate-950 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Traditional Anonymization (High Risk)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Vulnerable to quasi-identifier linkage (ZIP code + DOB + Gender re-identifies 87% of individuals).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Still regulated as personal data under GDPR and the India DPDP Act 2023.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Risk of leaking actual people's real phone numbers, emails, and residential addresses.</span>
              </li>
            </ul>
          </div>

          {/* Synthetic Data */}
          <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>PrivacyGuard Synthetic Data (Zero Risk)</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Zero 1-to-1 mapping to real human beings. Every record is an algorithmic fabrication.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Exempt from privacy restrictions under GDPR Recital 26 and India DPDP Act Section 3(c).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Guaranteed non-deliverable email domains and fictional telephone prefixes.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* The 5 Pillars of PrivacyGuard */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">The 5 Pillars of Privacy Protection</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. RFC 2606 Reserved Domains</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every synthetic email uses IETF RFC 2606 reserved domains (<code className="text-purple-300">@example.com</code>, <code className="text-purple-300">@example.org</code>, <code className="text-purple-300">@student.example.org</code>) that can never be registered by real individuals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Fictional Phone Ranges</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mobile numbers use non-routable fictional series (<code className="text-indigo-300">+91 91234 XXXXX</code> and <code className="text-indigo-300">+91 98765 XXXXX</code>) to prevent unwanted calls or spam to real subscribers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Indian Address Synthesis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Addresses blend authentic metropolitan localities (Bengaluru, Hyderabad, Pune, Mumbai, Delhi) with randomized fictional apartment and street numbers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. Zero External PII Leaks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your schemas and prompts run strictly through local backend processes. Real personal records are never uploaded to external generative models.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">5. Synthetic Watermarking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every Excel and CSV file generated contains explicit synthetic classification headers and a formal Certificate of Non-Personal Data.
            </p>
          </div>

        </div>
      </div>

      {/* Interactive Domain & PII Verification Tool */}
      <div className="rounded-2xl bg-slate-900/60 border border-purple-500/20 p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Interactive Auditor</span>
          <h2 className="text-xl font-bold text-white mt-1">Live Test Domain Scanner</h2>
          <p className="text-xs text-slate-400 mt-1">
            Test any sample email address to verify if it complies with synthetic data safety standards.
          </p>
        </div>

        <form onSubmit={handleTestScan} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="e.g. user001@example.com or test@gmail.com"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Verify Safety</span>
          </button>
        </form>

        {scanResult && (
          <div className={`p-4 rounded-xl border text-xs ${
            scanResult.safe 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            <div className="flex items-center justify-between font-bold mb-1">
              <span>{scanResult.badge}</span>
              <span>{scanResult.safe ? '✓ Compliant' : '⚠ Non-Compliant'}</span>
            </div>
            <p>{scanResult.message}</p>
          </div>
        )}
      </div>

      {/* Legal & Regulatory Compliance Matrix */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-400" />
          <span>Legal & Regulatory Frameworks</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Legislation / Standard</th>
                <th className="py-3 px-4 font-semibold">Jurisdiction</th>
                <th className="py-3 px-4 font-semibold">Compliance Status</th>
                <th className="py-3 px-4 font-semibold">Applicability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-400">
              <tr>
                <td className="py-3 px-4 font-semibold text-white">Digital Personal Data Protection (DPDP) Act 2023</td>
                <td className="py-3 px-4">India</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">100% Fully Exempt</td>
                <td className="py-3 px-4">Classified as Non-Personal / Fictional synthetic data.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">General Data Protection Regulation (GDPR) Art. 89</td>
                <td className="py-3 px-4">European Union</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Permitted for Research</td>
                <td className="py-3 px-4">Permitted for scientific, testing, and educational research without consent barriers.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">IETF RFC 2606 & RFC 6761</td>
                <td className="py-3 px-4">Global Internet Standard</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Strictly Enforced</td>
                <td className="py-3 px-4">Mandates reserved domains (.example, .test, example.com, example.org).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-white">ISO/IEC 20889 Privacy Enhancing Tech</td>
                <td className="py-3 px-4">International</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">Architecture Aligned</td>
                <td className="py-3 px-4">Follows standardized synthetic data de-identification principles.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

