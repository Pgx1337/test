import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Trophy, Zap, DollarSign } from "lucide-react";

const Games = () => {
  const games = [
    {
      id: "slots",
      name: "Diamond Slots",
      description: "Spin to win big with our premium slot machine",
      icon: Sparkles,
      path: "/games/slots",
    },
    {
      id: "blackjack",
      name: "Blackjack",
      description: "Classic card game - Beat the dealer!",
      icon: Trophy,
      path: "#",
      comingSoon: true,
    },
    {
      id: "roulette",
      name: "Roulette",
      description: "Place your bets on red or black",
      icon: Zap,
      path: "#",
      comingSoon: true,
    },
    {
      id: "poker",
      name: "Video Poker",
      description: "Royal flush awaits!",
      icon: DollarSign,
      path: "#",
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Casino Games
          </h1>
          <p className="text-muted-foreground">Choose your game and start winning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Card
                key={game.id}
                className="group hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--glow-primary)] bg-card/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                      <Icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                    </div>
                    {game.comingSoon && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {game.comingSoon ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  ) : (
                    <Link to={game.path}>
                      <Button className="w-full group-hover:shadow-[var(--glow-primary)] transition-shadow">
                        Play Now
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Games;
