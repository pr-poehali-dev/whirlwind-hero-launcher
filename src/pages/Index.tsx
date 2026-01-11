import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface Hero {
  id: number;
  name: string;
  era: string;
  power: number;
  speed: number;
  magic: number;
  level: number;
  icon: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  icon: string;
}

const Index = () => {
  const [gold, setGold] = useState(15420);
  const [crystals, setCrystals] = useState(287);
  const [currentTab, setCurrentTab] = useState('home');

  const heroes: Hero[] = [
    { id: 1, name: 'Торвальд Грозный', era: 'Викинг', power: 95, speed: 70, magic: 40, level: 12, icon: '⚔️' },
    { id: 2, name: 'Такэши Мунэката', era: 'Самурай', power: 85, speed: 90, magic: 55, level: 10, icon: '🗡️' },
    { id: 3, name: 'Коммандор Нова', era: 'Космонавт', power: 70, speed: 85, magic: 80, level: 8, icon: '🚀' },
    { id: 4, name: 'Нэко-9000', era: 'Кибер-кот', power: 65, speed: 95, magic: 90, level: 15, icon: '🐱' }
  ];

  const achievements: Achievement[] = [
    { id: 1, title: 'Властелин Вихря', description: 'Пройти 1000 метров в туннеле', progress: 847, total: 1000, reward: 500, icon: '🌪️' },
    { id: 2, title: 'Покоритель Эпох', description: 'Победить всех боссов', progress: 3, total: 5, reward: 1000, icon: '👑' },
    { id: 3, title: 'Коллекционер', description: 'Собрать всех героев', progress: 4, total: 8, reward: 750, icon: '✨' },
    { id: 4, title: 'Богатство Времени', description: 'Накопить 50000 золота', progress: 15420, total: 50000, reward: 300, icon: '💰' }
  ];

  const leaderboard = [
    { rank: 1, name: 'ВихрьМастер', distance: 8547, icon: '👑' },
    { rank: 2, name: 'ХранительВремени', distance: 7823, icon: '⭐' },
    { rank: 3, name: 'ЭпохиПокоритель', distance: 6912, icon: '🏆' },
    { rank: 4, name: 'ВыВикторТам', distance: 5234, icon: '🎯' },
    { rank: 5, name: 'ТуннельГуру', distance: 4891, icon: '🌟' }
  ];

  const shopItems = [
    { id: 1, name: 'Усиление Силы', description: '+20% урона на 1 час', cost: 500, type: 'gold', icon: '💪' },
    { id: 2, name: 'Ускорение', description: '+30% скорости на 1 час', cost: 450, type: 'gold', icon: '⚡' },
    { id: 3, name: 'Магический Щит', description: 'Защита от повреждений', cost: 100, type: 'crystals', icon: '🛡️' },
    { id: 4, name: 'Новый Герой', description: 'Разблокировать героя', cost: 250, type: 'crystals', icon: '🎭' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/10">
      <div className="container mx-auto p-4 max-w-6xl">
        <header className="mb-8 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="text-9xl animate-float">🌪️</div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-2 text-primary animate-fade-in relative z-10">
            Повелитель Вихря
          </h1>
          <p className="text-xl text-muted-foreground mb-6 animate-fade-in">Покори туннель времени</p>
          
          <div className="flex justify-center gap-6 mb-6">
            <Card className="px-6 py-3 bg-card/80 backdrop-blur border-accent/30 animate-glow">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💰</span>
                <div>
                  <p className="text-sm text-muted-foreground">Золото</p>
                  <p className="text-2xl font-bold text-accent">{gold.toLocaleString()}</p>
                </div>
              </div>
            </Card>
            <Card className="px-6 py-3 bg-card/80 backdrop-blur border-primary/30 animate-glow">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💎</span>
                <div>
                  <p className="text-sm text-muted-foreground">Кристаллы</p>
                  <p className="text-2xl font-bold text-primary">{crystals}</p>
                </div>
              </div>
            </Card>
          </div>
        </header>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-card/50 backdrop-blur">
            <TabsTrigger value="home" className="data-[state=active]:bg-primary/20">
              <Icon name="Home" size={20} />
            </TabsTrigger>
            <TabsTrigger value="heroes" className="data-[state=active]:bg-primary/20">
              <Icon name="Users" size={20} />
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-primary/20">
              <Icon name="ShoppingBag" size={20} />
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-primary/20">
              <Icon name="Trophy" size={20} />
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-primary/20">
              <Icon name="Award" size={20} />
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">
              <Icon name="User" size={20} />
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20">
              <Icon name="Settings" size={20} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <Card className="p-8 text-center bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/40">
              <div className="text-6xl mb-4 animate-float">🌪️</div>
              <h2 className="text-4xl font-bold mb-4">Готов к новому забегу?</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Запусти своих героев в вихрь времени и покори бесконечный туннель!
              </p>
              <Button size="lg" className="text-xl px-12 py-6 bg-primary hover:bg-primary/90 animate-glow">
                <Icon name="Play" size={24} className="mr-2" />
                Начать забег
              </Button>
            </Card>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-6 bg-card/80 backdrop-blur border-accent/30">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-semibold mb-2">Лучший результат</h3>
                <p className="text-3xl font-bold text-primary">5,234м</p>
              </Card>
              <Card className="p-6 bg-card/80 backdrop-blur border-accent/30">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Побед над боссами</h3>
                <p className="text-3xl font-bold text-accent">12</p>
              </Card>
              <Card className="p-6 bg-card/80 backdrop-blur border-accent/30">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Всего забегов</h3>
                <p className="text-3xl font-bold text-secondary">347</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="heroes" className="space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-center">Твои Герои</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {heroes.map((hero) => (
                <Card key={hero.id} className="p-6 bg-card/80 backdrop-blur border-primary/30 hover:border-primary/60 transition-all hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{hero.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-bold">{hero.name}</h3>
                        <Badge variant="secondary" className="text-sm">Ур. {hero.level}</Badge>
                      </div>
                      <p className="text-accent mb-4">{hero.era}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>💪 Сила</span>
                            <span className="text-primary font-semibold">{hero.power}</span>
                          </div>
                          <Progress value={hero.power} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>⚡ Скорость</span>
                            <span className="text-accent font-semibold">{hero.speed}</span>
                          </div>
                          <Progress value={hero.speed} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>✨ Магия</span>
                            <span className="text-secondary font-semibold">{hero.magic}</span>
                          </div>
                          <Progress value={hero.magic} className="h-2" />
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
                        <Icon name="ArrowUp" size={16} className="mr-2" />
                        Улучшить
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shop" className="space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-center">Магазин</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {shopItems.map((item) => (
                <Card key={item.id} className="p-6 bg-card/80 backdrop-blur border-accent/30 hover:border-accent/60 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{item.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-muted-foreground mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.type === 'gold' ? '💰' : '💎'}</span>
                          <span className="text-2xl font-bold text-accent">{item.cost}</span>
                        </div>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                          Купить
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-center">Достижения</h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="p-6 bg-card/80 backdrop-blur border-primary/30">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{achievement.title}</h3>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <span>💎</span>
                          <span>+{achievement.reward}</span>
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{achievement.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Прогресс</span>
                          <span className="text-primary font-semibold">{achievement.progress} / {achievement.total}</span>
                        </div>
                        <Progress value={(achievement.progress / achievement.total) * 100} className="h-3" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-center">Таблица лидеров</h2>
            <Card className="p-6 bg-card/80 backdrop-blur">
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <Card 
                      key={player.rank} 
                      className={`p-4 ${index === 0 ? 'bg-gradient-to-r from-accent/20 to-primary/20 border-accent' : 'bg-card/50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`text-3xl font-bold ${index === 0 ? 'text-accent' : 'text-muted-foreground'}`}>
                            #{player.rank}
                          </div>
                          <div className="text-3xl">{player.icon}</div>
                          <div>
                            <p className="font-bold text-lg">{player.name}</p>
                            <p className="text-sm text-muted-foreground">Дистанция: {player.distance.toLocaleString()}м</p>
                          </div>
                        </div>
                        {index < 3 && (
                          <Badge variant={index === 0 ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-center">Профиль игрока</h2>
            <Card className="p-8 bg-card/80 backdrop-blur border-primary/30">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="text-8xl mb-4 animate-float">👤</div>
                <h3 className="text-3xl font-bold mb-2">ВыВикторТам</h3>
                <Badge variant="secondary" className="text-lg px-4 py-2">Уровень 24</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className="p-4 bg-primary/10 border-primary/30">
                  <p className="text-sm text-muted-foreground mb-1">Всего пройдено</p>
                  <p className="text-3xl font-bold text-primary">127,893м</p>
                </Card>
                <Card className="p-4 bg-accent/10 border-accent/30">
                  <p className="text-sm text-muted-foreground mb-1">Побед над боссами</p>
                  <p className="text-3xl font-bold text-accent">12</p>
                </Card>
                <Card className="p-4 bg-secondary/10 border-secondary/30">
                  <p className="text-sm text-muted-foreground mb-1">Героев разблокировано</p>
                  <p className="text-3xl font-bold text-secondary">4 / 8</p>
                </Card>
                <Card className="p-4 bg-muted/20 border-muted/30">
                  <p className="text-sm text-muted-foreground mb-1">Достижений получено</p>
                  <p className="text-3xl font-bold">8 / 25</p>
                </Card>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Опыт до следующего уровня</span>
                  <span className="text-primary font-semibold">7,450 / 10,000</span>
                </div>
                <Progress value={74.5} className="h-3" />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4 text-center">Настройки</h2>
            <Card className="p-6 bg-card/80 backdrop-blur">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Volume2" size={24} className="text-primary" />
                    <div>
                      <p className="font-semibold">Звук</p>
                      <p className="text-sm text-muted-foreground">Громкость эффектов и музыки</p>
                    </div>
                  </div>
                  <Button variant="outline">Настроить</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Zap" size={24} className="text-accent" />
                    <div>
                      <p className="font-semibold">Графика</p>
                      <p className="text-sm text-muted-foreground">Качество визуальных эффектов</p>
                    </div>
                  </div>
                  <Button variant="outline">Настроить</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Globe" size={24} className="text-secondary" />
                    <div>
                      <p className="font-semibold">Язык</p>
                      <p className="text-sm text-muted-foreground">Выбор языка интерфейса</p>
                    </div>
                  </div>
                  <Button variant="outline">Русский</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Bell" size={24} className="text-primary" />
                    <div>
                      <p className="font-semibold">Уведомления</p>
                      <p className="text-sm text-muted-foreground">Управление оповещениями</p>
                    </div>
                  </div>
                  <Button variant="outline">Настроить</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon name="Info" size={24} className="text-accent" />
                    <div>
                      <p className="font-semibold">О игре</p>
                      <p className="text-sm text-muted-foreground">Версия 1.0.0</p>
                    </div>
                  </div>
                  <Button variant="outline">Подробнее</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;