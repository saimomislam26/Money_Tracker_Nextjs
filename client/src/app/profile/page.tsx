import dynamic from 'next/dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Check your Profile and update info',
};
// import Profile from '@/components/Profile/Profile'
const Profile =  dynamic(()=> import('@/components/Profile/Profile'), { ssr: false })

const ProfilePage = async () => {

    return (
        <Profile />
    )
}

export default ProfilePage