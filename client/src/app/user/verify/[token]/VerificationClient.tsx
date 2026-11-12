// app/user/verify/[token]/page.tsx
'use client'
import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { verifyToken } from '@/lib/api';

const VerificationClient: FC<{ token: string }> = ({ token }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<string | null>(null);
    let isCalledVerify = false
    useEffect(() => {

        if (isCalledVerify){
            isCalledVerify = false
            return;
        } 
        const tokenVerification = async () => {
            try {
                isCalledVerify = true
                setLoading(true)
                const res = await verifyToken(token);
                if (res.status === 200) {
                    setStatus('Verification successful! Redirecting to login...');
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            } catch (error) {
                console.log(error);
                setStatus('Verification failed. Token may be invalid or expired. Redirecting to register page.... ');
                setTimeout(() => {
                    router.push('/register');
                }, 2000);

            } finally {
                setLoading(false);
            }
        };


        //   try {
        //     setLoading(true);
        //     const response = await axios.get(`http://localhost:5000/user/verify/${token}`);
        //     console.log("response", response);

        //     if (response.status === 200) {
        //       setStatus('Verification successful! Redirecting to login...');
        //       setTimeout(() => {
        //         router.push('/login');
        //       }, 2000);
        //     }
        //   } catch (error) {
        //     console.log(error);
        //     setStatus('Verification failed. Token may be invalid or expired. Redirecting to register page.... ');
        //     setTimeout(() => {
        //       router.push('/register');
        //     }, 2000);
        //   } finally {
        //     setLoading(false);
        //   }
        // };

        tokenVerification();
    }, [token]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {loading && <p>Verifying your email, please wait...</p>}
            {status && <p>{status}</p>}
        </div>
    );
};

export default VerificationClient;
