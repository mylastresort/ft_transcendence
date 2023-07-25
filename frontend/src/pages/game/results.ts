import Game from '@/components/Game/Game';
import withAuth from '../lib/withAuth';
import Results from '@/components/Game/Results/Results';

export default withAuth(Game(Results));
