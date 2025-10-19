import Image from 'next/image';
import { redirect } from 'next/navigation';
import EditProfileForm from './EditProfileForm.client';
import { getCurrentUserServer } from '@/lib/api/serverApi';
import css from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function EditProfilePage() {
  const user = await getCurrentUserServer();

  if (!user) redirect('/sign-in');

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/avatar.png'}
            alt={`${user.username} avatar`}
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>

        <EditProfileForm user={user} />
      </div>
    </main>
  );
}
