import Game from '@/components/Game/Game';
import withAuth from '../lib/withAuth';
import Accept from '@/components/Game/Room/Accept';

export default withAuth(Game(Accept));
