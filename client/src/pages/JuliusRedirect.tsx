import { useEffect } from 'react';

export default function JuliusRedirect() {
  useEffect(() => {
    // Redirect to external website
    window.location.href = 'https://www.jla.co.il';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirecting to JLA...</p>
    </div>
  );
}

