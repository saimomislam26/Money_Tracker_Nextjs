// app/user/verify/[token]/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const VerifyPage = ({ params }: { params: { token: string } }) => {
  const router = useRouter();
  const { token } = params;

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoading(true);
        // Call the backend verification API
        const response = await axios.get(`http://localhost:5000/user/verify/${token}`);
        console.log("response", response);

        if (response.status === 200) {
          setStatus('Verification successful! Redirecting to login...');
          setTimeout(() => {
            router.push('/login'); // Redirect to login after 3 seconds
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        
        setStatus('Verification failed. Token may be invalid or expired. Redirecting to register page.... ');
        setTimeout(() => {
          router.push('/register'); // Redirect to login after 3 seconds
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading && <p>Verifying your email, please wait...</p>}
      {status && <p>{status}</p>}
    </div>
  );
};

export default VerifyPage;
