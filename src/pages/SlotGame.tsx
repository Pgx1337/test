import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles } from "lucide-react";

const symbols = ["💎", "🍒", "🔔", "⭐", "7️⃣"];

const SlotGame = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(["💎", "💎", "💎"]);
  const [balance, setBalance] = useState(1000);
  const [betAmount] = useState(10);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadBalance();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    } else {
      setUserId(user.id);
    }
  };

  const loadBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", user.id)
        .single();
      
      if (data) {
        setBalance(Number(data.balance));
      }
    }
  };

  const spin = async () => {
    if (balance < betAmount) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough credits to place this bet.",
        variant: "destructive",
      });
      return;
    }

    setSpinning(true);
    
    // Deduct bet amount
    const newBalance = balance - betAmount;
    setBalance(newBalance);

    // Animate spinning
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    // Stop after 2 seconds
    setTimeout(async () => {
      clearInterval(spinInterval);
      
      // Final result
      const finalReels = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ];
      setReels(finalReels);

      // Check for win
      let winAmount = 0;
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        winAmount = betAmount * 10; // 10x multiplier for 3 matching
        toast({
          title: "🎉 JACKPOT!",
          description: `You won $${winAmount}!`,
        });
      } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2]) {
        winAmount = betAmount * 2; // 2x multiplier for 2 matching
        toast({
          title: "Winner!",
          description: `You won $${winAmount}!`,
        });
      }

      const finalBalance = newBalance + winAmount;
      setBalance(finalBalance);

      // Update database
      if (userId) {
        await supabase
          .from("profiles")
          .update({ balance: finalBalance })
          .eq("user_id", userId);

        await supabase
          .from("game_history")
          .insert({
            user_id: userId,
            game_name: "Diamond Slots",
            bet_amount: betAmount,
            win_amount: winAmount,
          });
      }

      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/games")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Sparkles className="h-8 w-8 text-accent" />
              Diamond Slots
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Balance</p>
              <p className="text-4xl font-bold text-accent">${balance.toFixed(2)}</p>
            </div>

            <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-8 rounded-2xl border-2 border-primary/50">
              <div className="flex justify-center gap-4 mb-8">
                {reels.map((symbol, index) => (
                  <div
                    key={index}
                    className="w-32 h-32 bg-card rounded-xl flex items-center justify-center text-6xl border-2 border-border shadow-[var(--shadow-elevated)] transition-transform"
                    style={{
                      transform: spinning ? `rotate(${index * 120}deg)` : "rotate(0deg)",
                      transition: "transform 0.1s ease-out",
                    }}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              <div className="text-center space-y-4">
                <p className="text-muted-foreground">Bet: ${betAmount}</p>
                <Button
                  onClick={spin}
                  disabled={spinning || balance < betAmount}
                  className="px-12 py-6 text-lg font-bold shadow-[var(--glow-primary)]"
                  size="lg"
                >
                  {spinning ? "Spinning..." : "SPIN"}
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Match 3 symbols: 10x payout | Match 2 symbols: 2x payout
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SlotGame;
