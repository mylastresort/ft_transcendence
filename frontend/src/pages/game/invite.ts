import Game from '@/components/Game/Game';
import withAuth from '../lib/withAuth';
import Invite from '@/components/Game/Invite/Invite';

export default withAuth(Game(Invite));
