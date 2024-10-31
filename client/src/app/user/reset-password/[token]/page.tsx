
import { Metadata } from 'next';
import ResetPassword from './ResetPassword';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Password reset in ayebya',
};
const VerifyPage = ({ params }: { params: { token: string } }) => {
    const { token } = params;

    return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
            <ResetPassword token={token} />
        </div>

    );
};

export default VerifyPage;
