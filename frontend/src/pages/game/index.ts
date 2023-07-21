import Game from '@/components/Game/Game';
import Home from '@/components/Game/Home/Home';
import withAuth from '../lib/withAuth';

export default withAuth(Game(Home));