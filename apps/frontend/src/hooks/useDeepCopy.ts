import { Players } from './usePlayer';

const useDeepCopy = (players: Players): Players => {
    return Object.keys(players).reduce((acc, key) => {
        acc[key] = { ...players[key], url: players[key].url };
        return acc;
    }, {} as Players);
}

export default useDeepCopy;