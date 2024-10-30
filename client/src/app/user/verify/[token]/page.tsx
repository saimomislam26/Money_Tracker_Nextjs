
import { Metadata } from 'next';
import VerificationClient from './VerificationClient';

export const metadata: Metadata = {
  title: 'Email Verification',
  description: 'Email Verification System for Money Tracker system',
};
const VerifyPage = ({ params }: { params: { token: string } }) => {
  const { token } = params;

  return (
   <VerificationClient token={token}/>
  );
};

export default VerifyPage;
