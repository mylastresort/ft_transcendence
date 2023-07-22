import withAuth from '@/pages/lib/withAuth';
import Chat from '@/components/Chat';

export default withAuth(Chat(()=>(<>please select a chat</>)));
