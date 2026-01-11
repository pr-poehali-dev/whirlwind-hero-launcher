import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GameScreenProps {
  onExit: (distance: number, coinsCollected: number) => void;
  selectedHero: string;
}

export const GameScreen = ({ onExit, selectedHero }: GameScreenProps) => {
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [heroPosition, setHeroPosition] = useState(2);
  const [obstacles, setObstacles] = useState<Array<{ id: number; lane: number; type: 'obstacle' | 'coin' }>>([]);
  const [tunnelOffset, setTunnelOffset] = useState(0);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    if (e.key === 'ArrowLeft' && heroPosition > 1) {
      setHeroPosition(prev => prev - 1);
    } else if (e.key === 'ArrowRight' && heroPosition < 3) {
      setHeroPosition(prev => prev + 1);
    }
  }, [heroPosition, gameState]);

  const handleLaneClick = (lane: number) => {
    if (gameState === 'playing') {
      setHeroPosition(lane);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setDistance(prev => prev + 1);
      setTunnelOffset(prev => (prev + 5) % 100);

      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, id: obs.id - 5 }))
          .filter(obs => obs.id > -20);

        const lastObstacle = updated[updated.length - 1];
        if (!lastObstacle || lastObstacle.id < 80) {
          const newItem = {
            id: 100,
            lane: Math.floor(Math.random() * 3) + 1,
            type: Math.random() > 0.4 ? 'coin' : 'obstacle'
          } as { id: number; lane: number; type: 'obstacle' | 'coin' };
          updated.push(newItem);
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    obstacles.forEach(obs => {
      if (obs.id >= 5 && obs.id <= 15 && obs.lane === heroPosition) {
        if (obs.type === 'coin') {
          setCoins(prev => prev + 1);
          setObstacles(prev => prev.filter(o => o.id !== obs.id));
        } else if (obs.type === 'obstacle') {
          setGameState('gameover');
        }
      }
    });
  }, [obstacles, heroPosition, gameState]);

  const handleRestart = () => {
    setGameState('playing');
    setDistance(0);
    setCoins(0);
    setHeroPosition(2);
    setObstacles([]);
    setTunnelOffset(0);
  };

  const handleExit = () => {
    onExit(distance, coins);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-950 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-12 border-t-2 border-primary/20"
            style={{
              top: `${(i * 5 + tunnelOffset) % 100}%`,
              transform: 'perspective(500px) rotateX(45deg)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} className="text-primary" />
                <span className="font-bold text-xl">{distance}м</span>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <span className="font-bold text-xl text-accent">{coins}</span>
              </div>
            </Card>
          </div>
          <Button variant="outline" onClick={handleExit} className="backdrop-blur">
            <Icon name="X" size={20} className="mr-2" />
            Выход
          </Button>
        </div>

        <div className="relative mx-auto mt-32" style={{ width: '400px', height: '500px' }}>
          <div className="absolute inset-0 flex">
            {[1, 2, 3].map((lane) => (
              <div
                key={lane}
                onClick={() => handleLaneClick(lane)}
                className="flex-1 border-x-2 border-primary/30 cursor-pointer hover:bg-primary/10 transition-colors relative"
              >
                {heroPosition === lane && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl animate-bounce">
                    {selectedHero}
                  </div>
                )}

                {obstacles
                  .filter(obs => obs.lane === lane)
                  .map(obs => (
                    <div
                      key={obs.id}
                      className="absolute left-1/2 -translate-x-1/2 text-5xl transition-all duration-75"
                      style={{
                        bottom: `${obs.id}%`,
                      }}
                    >
                      {obs.type === 'coin' ? '💰' : '⚡'}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-muted-foreground mb-4">
            <p>← →  или нажми на дорожку для управления</p>
          </div>
        </div>

        {gameState === 'gameover' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full text-center bg-card/90 backdrop-blur border-primary/50">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-4xl font-bold mb-4 text-primary">Игра окончена!</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-lg">Дистанция:</span>
                  <span className="text-2xl font-bold text-primary">{distance}м</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-lg">Монеты:</span>
                  <span className="text-2xl font-bold text-accent">{coins} 💰</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                  <span className="text-lg">Награда:</span>
                  <span className="text-2xl font-bold text-accent">+{coins * 10} золота</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRestart} className="flex-1 text-lg py-6">
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Еще раз
                </Button>
                <Button onClick={handleExit} variant="outline" className="flex-1 text-lg py-6">
                  <Icon name="Home" size={20} className="mr-2" />
                  В меню
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
