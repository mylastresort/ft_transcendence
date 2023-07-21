import Game from '@/components/Game/Game';
import withAuth from '../lib/withAuth';
import Customizer from '@/components/Game/Customizer/Customizer';

export default withAuth(Game(Customizer));
