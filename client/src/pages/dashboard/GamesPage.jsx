import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { gamesAPI } from '../../services/api';
import CountdownTimer from '../../components/CountdownTimer';
import WheelGame from '../../components/games/WheelGame';
import CookieGame from '../../components/games/CookieGame';
import ScratchGame from '../../components/games/ScratchGame';
import { Clock, Crown, Sparkles } from 'lucide-react';
import './Games.css';

export default function GamesPage() {
    const { refreshUser } = useAuth();
    const [games, setGames] = useState([]);
    const [gameStatuses, setGameStatuses] = useState({});
    const [activeGame, setActiveGame] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            const [gamesData, statusData] = await Promise.all([
                gamesAPI.getAll(),
                gamesAPI.getStatus()
            ]);
            setGames(gamesData);

            const statusMap = {};
            statusData.forEach(s => { statusMap[s.id] = s; });
            setGameStatuses(statusMap);
        } catch (error) {
            console.error('Failed to load games:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePlay = async (gameId) => {
        setPlaying(true);
        setResult(null);

        try {
            const result = await gamesAPI.play(gameId);
            setResult(result);
            await refreshUser();
            await loadGames();
        } catch (error) {
            setResult({ error: error.message });
        } finally {
            setPlaying(false);
        }
    };

    const closeGame = () => {
        setActiveGame(null);
        setResult(null);
    };

    const getGameComponent = () => {
        if (!activeGame) return null;

        const game = games.find(g => g.id === activeGame);
        if (!game) return null;

        const status = gameStatuses[activeGame];
        const props = {
            game,
            onPlay: () => handlePlay(activeGame),
            onClose: closeGame,
            result,
            playing,
            isAvailable: status?.isAvailable
        };

        // Use game.type from backend (WHEEL, COOKIE, SCRATCH) - convert to lowercase
        const gameType = (game.type || '').toLowerCase();

        switch (gameType) {
            case 'wheel':
                return <WheelGame {...props} />;
            case 'cookie':
                return <CookieGame {...props} />;
            case 'scratch':
                return <ScratchGame {...props} />;
            default:
                return <div className="game-error">Unknown game type: {game.type}</div>;
        }
    };

    if (loading) {
        return (
            <div className="games-loading">
                <div className="spinner"></div>
                <p>Loading games...</p>
            </div>
        );
    }

    return (
        <div className="games-page">
            <div className="games-header">
                <h1>
                    <Sparkles size={28} />
                    Bonus Games
                </h1>
                <p>Play exciting games to win bonus credits!</p>
            </div>

            <div className="games-grid">
                {games.map(game => {
                    const status = gameStatuses[game.id];
                    const isAvailable = status?.isAvailable ?? true;

                    return (
                        <div
                            key={game.id}
                            className={`game-card-large ${!isAvailable ? 'on-cooldown' : ''}`}
                        >
                            <div className="game-card-header">
                                <div className="game-emoji">
                                    {(game.type || '').toLowerCase() === 'wheel' && '🎡'}
                                    {(game.type || '').toLowerCase() === 'cookie' && '🥠'}
                                    {(game.type || '').toLowerCase() === 'scratch' && '🎫'}
                                </div>
                                {!status?.meetsVipRequirement && (
                                    <div className="vip-required">
                                        <Crown size={14} />
                                        {game.vipTierRequired}+
                                    </div>
                                )}
                            </div>

                            <h3>{game.name}</h3>
                            <p>{game.description}</p>

                            <div className="game-rewards">
                                <span className="reward-range">
                                    Win {game.minReward} - {game.maxReward} credits
                                </span>
                            </div>

                            {isAvailable ? (
                                <button
                                    className="btn btn-primary btn-lg play-btn"
                                    onClick={() => setActiveGame(game.id)}
                                >
                                    Play Now
                                </button>
                            ) : (
                                <div className="cooldown-section">
                                    <Clock size={16} />
                                    <span>Available in:</span>
                                    <CountdownTimer
                                        targetDate={status?.nextAvailable}
                                        onComplete={loadGames}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Game Modal */}
            {activeGame && (
                <div className="game-modal-overlay" onClick={closeGame}>
                    <div className="game-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeGame}>×</button>
                        {getGameComponent()}
                    </div>
                </div>
            )}
        </div>
    );
}
