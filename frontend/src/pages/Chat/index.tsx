import withAuth from '@/pages/lib/withAuth';
import Chat from '@/components/Chat';
import { ListPublicChannels } from '@/components/Chat/ChatRoom/ListPublicChannels';

export default withAuth(Chat(()=>(<ListPublicChannels/>)));
