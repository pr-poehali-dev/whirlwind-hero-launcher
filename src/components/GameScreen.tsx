import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface GameScreenProps {
  onExit: (distance: number, coinsCollected: number, kills: number) => void;
  selectedHero: string;
}

interface Enemy {
  id: number;
  lane: number;
  hp: number;
  maxHp: number;
  type: 'weak' | 'strong' | 'boss';
  icon: string;
}

export const GameScreen = ({ onExit, selectedHero }: GameScreenProps) => {
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [kills, setKills] = useState(0);
  const [heroPosition, setHeroPosition] = useState(2);
  const [heroHp, setHeroHp] = useState(100);
  const [maxHeroHp] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [coinItems, setCoinItems] = useState<Array<{ id: number; lane: number; y: number }>>([]);
  const [tunnelOffset, setTunnelOffset] = useState(0);

  const handleAttack = useCallback(() => {
    if (isAttacking || gameState !== 'playing') return;
    setIsAttacking(true);
    
    setEnemies(prev => prev.map(enemy => {
      if (enemy.lane === heroPosition && enemy.id < 30 && enemy.id > 0) {
        const newHp = enemy.hp - 35;
        if (newHp <= 0) {
          setKills(k => k + 1);
          setCoins(c => c + (enemy.type === 'boss' ? 10 : enemy.type === 'strong' ? 3 : 1));
          return { ...enemy, hp: 0 };
        }
        return { ...enemy, hp: newHp };
      }
      return enemy;
    }));

    setTimeout(() => setIsAttacking(false), 300);
  }, [isAttacking, gameState, heroPosition]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    if (e.key === 'ArrowLeft' && heroPosition > 1) {
      setHeroPosition(prev => prev - 1);
    } else if (e.key === 'ArrowRight' && heroPosition < 3) {
      setHeroPosition(prev => prev + 1);
    } else if (e.key === ' ' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleAttack();
    }
  }, [heroPosition, gameState, handleAttack]);

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

      setEnemies(prev => {
        const updated = prev
          .map(enemy => ({ ...enemy, id: enemy.id - 2 }))
          .filter(enemy => enemy.hp > 0 && enemy.id > -30);

        const lastEnemy = updated[updated.length - 1];
        if (!lastEnemy || lastEnemy.id < 70) {
          const rand = Math.random();
          const isBoss = distance > 0 && distance % 500 === 0 && rand > 0.7;
          const type = isBoss ? 'boss' : rand > 0.6 ? 'strong' : 'weak';
          const maxHp = type === 'boss' ? 140 : type === 'strong' ? 70 : 35;
          const icon = type === 'boss' ? '👹' : type === 'strong' ? '👾' : '👻';
          
          updated.push({
            id: 100,
            lane: Math.floor(Math.random() * 3) + 1,
            hp: maxHp,
            maxHp,
            type,
            icon
          });
        }

        return updated;
      });

      setCoinItems(prev => {
        const updated = prev
          .map(coin => ({ ...coin, y: coin.y - 2 }))
          .filter(coin => coin.y > -30);

        if (Math.random() > 0.95) {
          updated.push({
            id: Date.now(),
            lane: Math.floor(Math.random() * 3) + 1,
            y: 100
          });
        }

        return updated;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, distance]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    enemies.forEach(enemy => {
      if (enemy.id >= 0 && enemy.id <= 10 && enemy.lane === heroPosition && enemy.hp > 0) {
        setHeroHp(prev => {
          const newHp = prev - (enemy.type === 'boss' ? 20 : enemy.type === 'strong' ? 10 : 5);
          if (newHp <= 0) {
            setGameState('gameover');
            return 0;
          }
          return newHp;
        });
        setEnemies(prev => prev.filter(e => e.id !== enemy.id));
      }
    });

    coinItems.forEach(coin => {
      if (Math.abs(coin.y - 10) < 15 && coin.lane === heroPosition) {
        setCoins(prev => prev + 1);
        setCoinItems(prev => prev.filter(c => c.id !== coin.id));
      }
    });
  }, [enemies, coinItems, heroPosition, gameState]);

  const handleRestart = () => {
    setGameState('playing');
    setDistance(0);
    setCoins(0);
    setKills(0);
    setHeroPosition(2);
    setHeroHp(100);
    setEnemies([]);
    setCoinItems([]);
    setTunnelOffset(0);
  };

  const handleExit = () => {
    onExit(distance, coins, kills);
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
            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <Icon name="Skull" size={20} className="text-red-500" />
                <span className="font-bold text-xl">{kills}</span>
              </div>
            </Card>
          </div>
          <Button variant="outline" onClick={handleExit} className="backdrop-blur">
            <Icon name="X" size={20} className="mr-2" />
            Выход
          </Button>
        </div>

        <div className="flex justify-center mb-4">
          <Card className="px-6 py-2 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <Icon name="Heart" size={20} className="text-red-500" />
              <Progress value={(heroHp / maxHeroHp) * 100} className="w-48 h-3" />
              <span className="font-bold text-lg">{heroHp}/{maxHeroHp}</span>
            </div>
          </Card>
        </div>

        <div className="relative mx-auto mt-16" style={{ width: '400px', height: '500px' }}>
          <div className="absolute inset-0 flex">
            {[1, 2, 3].map((lane) => (
              <div
                key={lane}
                onClick={() => handleLaneClick(lane)}
                className="flex-1 border-x-2 border-primary/30 cursor-pointer hover:bg-primary/10 transition-colors relative"
              >
                {heroPosition === lane && (
                  <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-6xl transition-transform ${
                    isAttacking ? 'scale-125 -translate-y-4' : ''
                  }`}>
                    {selectedHero}
                  </div>
                )}

                {enemies
                  .filter(enemy => enemy.lane === lane && enemy.hp > 0)
                  .map(enemy => (
                    <div
                      key={enemy.id}
                      className="absolute left-1/2 -translate-x-1/2 transition-all duration-75"
                      style={{ bottom: `${enemy.id}%` }}
                    >
                      <div className="text-5xl animate-bounce">{enemy.icon}</div>
                      <div className="w-16 bg-gray-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className="h-full bg-red-500 transition-all"
                          style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}

                {coinItems
                  .filter(coin => coin.lane === lane)
                  .map(coin => (
                    <div
                      key={coin.id}
                      className="absolute left-1/2 -translate-x-1/2 text-4xl"
                      style={{ bottom: `${coin.y}%` }}
                    >
                      💰
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-muted-foreground mb-4 space-y-1">
            <p>← → движение</p>
            <p className="text-lg font-bold text-primary">Пробел / ↑ — атака</p>
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
                  <span className="text-lg">Убито врагов:</span>
                  <span className="text-2xl font-bold text-red-500">{kills} 💀</span>
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
