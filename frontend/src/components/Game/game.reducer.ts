export const init = ({ map }: { map: number }) => ({
  config: null as { limit; paddle; radius } | null,
  gameId: null as string | null,
  opponent: null as { user } | null,
  page: 'home' as 'home' | 'lobby' | 'game' | 'custom',
  ready: false,
  conf: { map, speed: 5, games: 3, name: '' },
  role: null as string | null,
});

export type Action =
  | { type: 'CUSTOM' }
  | { type: 'LEAVE' }
  | { type: 'LOBBY'; value: { role } }
  | { type: 'MATCH'; value }
  | { type: 'READY'; value: boolean }
  | { type: 'STARTED'; value };

type State = ReturnType<typeof init>;

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'CUSTOM':
      return { ...state, page: 'custom' };
    case 'LOBBY':
      return { ...state, page: 'lobby', role: action.value.role };
    case 'LEAVE':
      return init({ map: 0 });
    case 'MATCH':
      const [gameId, opponent, conf] = action.value;
      return { ...state, gameId, opponent, conf };
    case 'READY':
      return { ...state, ready: action.value };
    case 'STARTED':
      return { ...state, config: action.value, page: 'game' };
    default:
      throw new Error('Invalid action');
  }
}
