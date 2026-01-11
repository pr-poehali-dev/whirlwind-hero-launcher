import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Hero, Obstacle, Collectible, AttackType } from '@/types/game';
import { HEROES, OBSTACLE_TYPE_INFO, ATTACK_TYPE_COLORS } from '@/data/heroes';
import { getEraByDistance, ERAS } from '@/data/eras';

interface GameScreenProps {
  onExit: (distance: number, coinsCollected: number, crystals: number) => void;
  selectedHeroes: number[];
}

export const GameScreen = ({ onExit, selectedHeroes }: GameScreenProps) => {
  const [gameState, setGameState] = useState<'playing' | 'gameover'>('playing');
  const [distance, setDistance] = useState(0);
  const [coins, setCoins] = useState(0);
  const [crystals, setCrystals] = useState(0);
  const [squad, setSquad] = useState<Hero[]>(() => 
    selectedHeroes.map(id => ({ ...HEROES.find(h => h.id === id)! }))
  );
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [tunnelOffset, setTunnelOffset] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [currentEra, setCurrentEra] = useState(getEraByDistance(0));
  const [showEraTransition, setShowEraTransition] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const activeHero = squad[activeHeroIndex];
  const eraConfig = ERAS[currentEra];

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (gameState !== 'playing') return;
    
    if (direction === 'left') {
      setActiveHeroIndex(prev => Math.max(0, prev - 1));
    } else {
      setActiveHeroIndex(prev => Math.min(squad.length - 1, prev + 1));
    }
  }, [gameState, squad.length]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    if (e.key === 'ArrowLeft') {
      handleSwipe('left');
    } else if (e.key === 'ArrowRight') {
      handleSwipe('right');
    } else if (e.key === ' ' || e.key === 'Enter') {
      handleAttack();
    }
  }, [gameState, handleSwipe]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    }
    
    setTouchStartX(null);
  };

  const handleAttack = () => {
    if (gameState !== 'playing' || isAttacking) return;
    
    setIsAttacking(true);
    
    const hero = squad[activeHeroIndex];
    hero.ultiCharge = Math.min(hero.maxUltiCharge, hero.ultiCharge + 10);
    
    setObstacles(prev => {
      const updated = [...prev];
      const nearObstacles = updated.filter(obs => obs.id >= 30 && obs.id <= 50);
      
      nearObstacles.forEach(obs => {
        const isEffective = OBSTACLE_TYPE_INFO[obs.type].weakTo === hero.attackType;
        const damage = isEffective ? hero.damage : Math.floor(hero.damage * 0.5);
        
        obs.health -= damage;
        
        if (obs.health <= 0) {
          const index = updated.indexOf(obs);
          if (index > -1) {
            updated.splice(index, 1);
            
            if (Math.random() < 0.3) {
              setCollectibles(prev => [...prev, {
                id: obs.id,
                lane: obs.lane,
                type: 'crystal',
                icon: '💎',
                value: 1,
              }]);
            }
            
            if (hero.id === 1 && Math.random() < 0.2) {
              setSquad(prev => prev.map((h, i) => 
                i === activeHeroIndex && h.health < h.maxHealth
                  ? { ...h, health: h.health + 1 }
                  : h
              ));
            }
          }
        }
      });
      
      return updated;
    });
    
    setTimeout(() => setIsAttacking(false), 200);
  };

  const handleUseUlti = () => {
    const hero = squad[activeHeroIndex];
    if (hero.ultiCharge < hero.maxUltiCharge) return;
    
    hero.ultiCharge = 0;
    
    if (hero.id === 1) {
      setObstacles(prev => prev.filter(obs => obs.id < 80));
    } else if (hero.id === 2) {
      setObstacles(prev => []);
      setCrystals(prev => prev + 5);
    } else if (hero.id === 3) {
      setTimeout(() => {
        setGameState(prev => prev);
      }, 5000);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = setInterval(() => {
      setDistance(prev => {
        const newDistance = prev + 1;
        
        if (newDistance % 300 === 0 && newDistance > 0) {
          const newEra = getEraByDistance(newDistance);
          if (newEra !== currentEra) {
            setShowEraTransition(true);
            setTimeout(() => {
              setCurrentEra(newEra);
              setShowEraTransition(false);
            }, 1000);
          }
        }
        
        return newDistance;
      });
      
      setTunnelOffset(prev => (prev + 5) % 100);

      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, id: obs.id - 5 }))
          .filter(obs => obs.id > -20);

        const lastObstacle = updated[updated.length - 1];
        if (!lastObstacle || lastObstacle.id < 80) {
          const obstacleTypes = eraConfig.obstacles;
          const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
          const typeInfo = OBSTACLE_TYPE_INFO[randomType];
          
          updated.push({
            id: 100,
            lane: Math.floor(Math.random() * 3) + 1,
            type: randomType,
            health: typeInfo.health,
            maxHealth: typeInfo.health,
            icon: typeInfo.icon,
            color: typeInfo.color,
          });
        }

        return updated;
      });

      setCollectibles(prev => {
        const updated = prev
          .map(col => ({ ...col, id: col.id - 5 }))
          .filter(col => col.id > -20);

        if (Math.random() < 0.15) {
          updated.push({
            id: 100,
            lane: Math.floor(Math.random() * 3) + 1,
            type: Math.random() > 0.7 ? 'crystal' : 'coin',
            icon: Math.random() > 0.7 ? '💎' : '💰',
            value: Math.random() > 0.7 ? 1 : 10,
          });
        }

        return updated;
      });
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, currentEra, eraConfig]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    obstacles.forEach(obs => {
      if (obs.id >= 5 && obs.id <= 15) {
        const heroLane = activeHeroIndex + 1;
        if (obs.lane === heroLane) {
          setSquad(prev => prev.map((h, i) => {
            if (i === activeHeroIndex) {
              const newHealth = h.health - 1;
              if (newHealth <= 0) {
                if (activeHeroIndex < squad.length - 1) {
                  setActiveHeroIndex(activeHeroIndex + 1);
                } else {
                  setGameState('gameover');
                }
              }
              return { ...h, health: Math.max(0, newHealth) };
            }
            return h;
          }));
          setObstacles(prev => prev.filter(o => o.id !== obs.id));
        }
      }
    });

    collectibles.forEach(col => {
      if (col.id >= 5 && col.id <= 15) {
        const heroLane = activeHeroIndex + 1;
        if (col.lane === heroLane) {
          if (col.type === 'coin') {
            setCoins(prev => prev + col.value);
          } else if (col.type === 'crystal') {
            setCrystals(prev => prev + col.value);
          }
          setCollectibles(prev => prev.filter(c => c.id !== col.id));
        }
      }
    });
  }, [obstacles, collectibles, activeHeroIndex, gameState, squad.length]);

  const handleRestart = () => {
    setGameState('playing');
    setDistance(0);
    setCoins(0);
    setCrystals(0);
    setSquad(selectedHeroes.map(id => ({ ...HEROES.find(h => h.id === id)! })));
    setActiveHeroIndex(0);
    setObstacles([]);
    setCollectibles([]);
    setTunnelOffset(0);
    setCurrentEra(getEraByDistance(0));
  };

  const handleExit = () => {
    onExit(distance, coins, crystals);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 bg-gradient-to-b ${eraConfig.bgGradient} overflow-hidden transition-all duration-1000`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleAttack}
    >
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-12 border-t-2"
            style={{
              borderColor: eraConfig.colors.primary + '40',
              top: `${(i * 5 + tunnelOffset) % 100}%`,
              transform: 'perspective(500px) rotateX(45deg)',
            }}
          />
        ))}
      </div>

      {showEraTransition && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <h2 className="text-6xl font-bold mb-4 text-primary animate-scale-in">
              {ERAS[getEraByDistance(distance)].name}
            </h2>
            <p className="text-2xl text-muted-foreground">Портал открыт...</p>
          </div>
        </div>
      )}

      <div className="relative z-10 p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} style={{ color: eraConfig.colors.primary }} />
                <span className="font-bold text-xl">{distance}м</span>
              </div>
            </Card>
            <Card className="px-4 py-2 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <span className="font-bold">{coins}</span>
                <span className="text-xl ml-2">💎</span>
                <span className="font-bold">{crystals}</span>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <Badge style={{ backgroundColor: eraConfig.colors.primary }}>
              {eraConfig.name}
            </Badge>
            <Button variant="outline" onClick={handleExit} size="sm" className="backdrop-blur">
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-4">
          {squad.map((hero, index) => (
            <Card
              key={hero.id}
              className={`p-3 bg-card/80 backdrop-blur transition-all ${
                index === activeHeroIndex
                  ? 'ring-4 scale-110'
                  : hero.health <= 0
                  ? 'opacity-30 grayscale'
                  : 'opacity-70'
              }`}
              style={{
                ringColor: index === activeHeroIndex ? hero.color : 'transparent',
              }}
            >
              <div className="text-3xl mb-1">{hero.icon}</div>
              <div className="flex gap-1 mb-1">
                {[...Array(hero.maxHealth)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < hero.health ? 'bg-red-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <Progress 
                value={(hero.ultiCharge / hero.maxUltiCharge) * 100} 
                className="h-1"
                style={{
                  backgroundColor: hero.color + '40',
                }}
              />
            </Card>
          ))}
        </div>

        <div className="relative mx-auto mt-16" style={{ width: '400px', height: '500px' }}>
          <div className="absolute inset-0 flex">
            {[1, 2, 3].map((lane) => (
              <div
                key={lane}
                className="flex-1 border-x-2 relative"
                style={{ borderColor: eraConfig.colors.primary + '30' }}
              >
                {lane === activeHeroIndex + 1 && activeHero.health > 0 && (
                  <div
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 text-6xl transition-transform ${
                      isAttacking ? 'scale-125' : 'scale-100'
                    }`}
                  >
                    {activeHero.icon}
                  </div>
                )}

                {obstacles
                  .filter(obs => obs.lane === lane)
                  .map(obs => (
                    <div
                      key={obs.id}
                      className="absolute left-1/2 -translate-x-1/2 transition-all duration-75"
                      style={{ bottom: `${obs.id}%` }}
                    >
                      <div className="text-4xl">{obs.icon}</div>
                      {obs.health < obs.maxHealth && (
                        <Progress
                          value={(obs.health / obs.maxHealth) * 100}
                          className="h-1 w-12 mx-auto mt-1"
                        />
                      )}
                    </div>
                  ))}

                {collectibles
                  .filter(col => col.lane === lane)
                  .map(col => (
                    <div
                      key={col.id}
                      className="absolute left-1/2 -translate-x-1/2 text-3xl animate-bounce transition-all duration-75"
                      style={{ bottom: `${col.id}%` }}
                    >
                      {col.icon}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 text-center text-sm text-white/70 mb-4 space-y-1">
            <p>← → для переключения героев</p>
            <p>ТАП / ПРОБЕЛ для атаки</p>
            <p style={{ color: ATTACK_TYPE_COLORS[activeHero.attackType] }}>
              Активен: {activeHero.name} ({activeHero.attackType})
            </p>
          </div>
        </div>

        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <Button
            onClick={handleUseUlti}
            disabled={activeHero.ultiCharge < activeHero.maxUltiCharge}
            size="lg"
            className="text-xl px-8 py-6 backdrop-blur"
            style={{
              backgroundColor: activeHero.ultiCharge >= activeHero.maxUltiCharge ? activeHero.color : '#666',
            }}
          >
            <Icon name="Zap" size={24} className="mr-2" />
            УЛЬТА ({Math.floor(activeHero.ultiCharge)}/{activeHero.maxUltiCharge})
          </Button>
        </div>

        {gameState === 'gameover' && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
            <Card className="p-8 max-w-md w-full text-center bg-card/90 backdrop-blur border-primary/50">
              <div className="text-6xl mb-4">💥</div>
              <h2 className="text-4xl font-bold mb-4 text-primary">Игра окончена!</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-lg">Дистанция:</span>
                  <span className="text-2xl font-bold" style={{ color: eraConfig.colors.primary }}>
                    {distance}м
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-lg">Монеты:</span>
                  <span className="text-2xl font-bold text-accent">{coins} 💰</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <span className="text-lg">Кристаллы:</span>
                  <span className="text-2xl font-bold text-primary">{crystals} 💎</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-accent/20 rounded-lg">
                  <span className="text-lg">Награда:</span>
                  <span className="text-2xl font-bold text-accent">+{coins * 10 + crystals * 50} золота</span>
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
