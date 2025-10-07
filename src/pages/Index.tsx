import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Trophy, Shield, Zap } from "lucide-react";
import heroImage from "@/assets/casino-hero.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/games");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user && event === "SIGNED_IN") {
        navigate("/games");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const features = [
    {
      icon: Sparkles,
      title: "Premium Games",
      description: "Experience the finest selection of casino games",
    },
    {
      icon: Trophy,
      title: "Big Wins",
      description: "Massive jackpots and generous payouts await",
    },
    {
      icon: Shield,
      title: "Secure & Fair",
      description: "Certified random number generation and secure transactions",
    },
    {
      icon: Zap,
      title: "Instant Play",
      description: "No downloads required, play directly in your browser",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Luxury casino atmosphere"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-accent animate-pulse" />
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Royal Casino
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the thrill of premium casino gaming with stunning graphics and massive jackpots
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 shadow-[var(--glow-primary)]">
                Get Started
              </Button>
            </Link>
            <Link to="/games">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Explore Games
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Why Choose Royal Casino
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-[var(--glow-primary)]"
                >
                  <CardHeader>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 w-fit mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
          <CardContent className="text-center py-12">
            <h2 className="text-4xl font-bold mb-4">Ready to Win Big?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of players and start your winning journey today
            </p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-12 shadow-[var(--glow-primary)]">
                Sign Up Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
