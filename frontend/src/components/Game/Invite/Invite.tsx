import { useRouter } from 'next/router';
import Customizer from '../Customizer/Customizer';

export default function Invite() {
  const router = useRouter();
  return <Customizer type="invite" userId={router.query.userId} />;
}