import { useEffect, useState } from 'react';
import { certificatesApi } from '../../api/learning';

export default function StudentCertificates() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    certificatesApi.mine().then(({ data }) => setCertificates(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">My Certificates</h1>
      <div className="space-y-3">
        {certificates.map((c) => (
          <div key={c.id} className="border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-gray-900">{c.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {c.institutionName} · Issued {new Date(c.issuedAt).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Verification code: <span className="font-mono">{c.verificationCode}</span>
            </p>
          </div>
        ))}
        {certificates.length === 0 && (
          <p className="text-gray-500 text-sm">No certificates issued yet.</p>
        )}
      </div>
    </div>
  );
}
