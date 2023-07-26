import withAuth from '@/pages/lib/withAuth';
import Chat from '@/components/Chat';
import ChatRoom from '@/components/Chat/ChatRoom'

export default withAuth(Chat(ChatRoom));