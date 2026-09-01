import { useState } from 'react';
import { certificatesApi } from '../../api/learning';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function CertificateVerify() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setResult(null);
    setNotFound(false);
    setLoading(true);
    try {
      const { data } = await certificatesApi.verify(code.trim());
      setResult(data);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-blue-900 mb-2">Verify a Certificate</h1>
      <p className="text-gray-500 text-sm mb-6">
        Enter the verification code printed on an ELMKUSOMA certificate to confirm its authenticity.
      </p>

      <form onSubmit={handleVerify} className="flex gap-2 mb-6">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. A1B2C3D4E5F6G7H8"
          required
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <Button type="submit" loading={loading}>Verify</Button>
      </form>

      {notFound && (
        <div className="border border-red-200 bg-red-50 text-red-700 rounded-md p-4 text-sm">
          No certificate found for this code. Please check and try again.
        </div>
      )}

      {result && (
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge status={result.valid ? 'VERIFIED' : 'REJECTED'}>
              {result.valid ? 'Valid Certificate' : 'Revoked'}
            </Badge>
          </div>
          <p className="font-semibold text-gray-900">{result.data.title}</p>
          <p className="text-sm text-gray-600 mt-1">Issued to: {result.data.studentName}</p>
          {result.data.institutionName && (
            <p className="text-sm text-gray-600">Institution: {result.data.institutionName}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">
            Certificate No. {result.data.certificateNumber} · Issued {new Date(result.data.issuedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
