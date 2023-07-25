import Game from '@/components/Game/Game';
import withAuth from '../lib/withAuth';
import Lobby from '@/components/Game/Lobby/Lobby';

export default withAuth(Game(Lobby));
