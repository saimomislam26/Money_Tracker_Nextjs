import RegisterForm from './form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign Up to Money Tracker system',
};

export default function RegisterPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white">
      <RegisterForm />
    </div>
  );
}