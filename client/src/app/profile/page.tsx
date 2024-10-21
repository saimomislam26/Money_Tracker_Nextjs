import dynamic from 'next/dynamic';
// import Profile from '@/components/Profile/Profile'
const Profile =  dynamic(()=> import('@/components/Profile/Profile'), { ssr: false })

const ProfilePage = async () => {

    return (
        <Profile />
    )
}

export default ProfilePage