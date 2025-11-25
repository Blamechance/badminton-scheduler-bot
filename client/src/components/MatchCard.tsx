import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Edit2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MatchCardProps {
  courtNumber: number;
  team1: [string, string];
  team2: [string, string];
  matchId: string;
  scores?: { team1: number; team2: number };
  onScoreUpdate: (matchId: string, team: 1 | 2, score: number) => void;
  allPlayers: string[];
  onPlayerReplace: (matchId: string, position: string, oldPlayer: string, newPlayer: string) => void;
}

type EditingPosition = "team1-0" | "team1-1" | "team2-0" | "team2-1" | null;

export default function MatchCard({ courtNumber, team1, team2, matchId, scores, onScoreUpdate, allPlayers, onPlayerReplace }: MatchCardProps) {
  const team1Score = scores?.team1 || 0;
  const team2Score = scores?.team2 || 0;
  const [editingPosition, setEditingPosition] = useState<EditingPosition>(null);

  const incrementScore = (team: 1 | 2) => {
    const newScore = team === 1 ? team1Score + 1 : team2Score + 1;
    onScoreUpdate(matchId, team, newScore);
  };

  const decrementScore = (team: 1 | 2) => {
    const currentScore = team === 1 ? team1Score : team2Score;
    const newScore = Math.max(0, currentScore - 1);
    onScoreUpdate(matchId, team, newScore);
  };

  const getPlayerAtPosition = (position: EditingPosition): string => {
    if (position === "team1-0") return team1[0];
    if (position === "team1-1") return team1[1];
    if (position === "team2-0") return team2[0];
    if (position === "team2-1") return team2[1];
    return "";
  };

  const handlePlayerChange = (newPlayer: string) => {
    if (!editingPosition || !newPlayer) {
      setEditingPosition(null);
      return;
    }
    const oldPlayer = getPlayerAtPosition(editingPosition);
    if (newPlayer && newPlayer !== oldPlayer) {
      onPlayerReplace(matchId, editingPosition, oldPlayer, newPlayer);
    }
    setEditingPosition(null);
  };

  return (
    <Card data-testid={`card-match-${courtNumber}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs" data-testid={`badge-court-${courtNumber}`}>
            Court {courtNumber}
          </Badge>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {editingPosition === "team1-0" ? (
                <div className="flex items-center gap-1">
                  <Select value="" onValueChange={handlePlayerChange}>
                    <SelectTrigger className="w-24 h-6 text-xs p-1" data-testid={`select-player-team1-0`}>
                      <SelectValue placeholder="Swap..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allPlayers.map((p) => (
                        <SelectItem key={p} value={p} data-testid={`option-${p}`}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setEditingPosition(null)}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPosition("team1-0")}
                  className="hover-elevate active-elevate-2 group relative"
                  data-testid={`button-edit-team1-0`}
                >
                  <Badge 
                    className="bg-primary/10 text-primary hover:bg-primary/20 text-xs" 
                    data-testid={`badge-player-${team1[0]}`}
                  >
                    {team1[0]}
                  </Badge>
                  <Edit2 className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100" />
                </button>
              )}
              {editingPosition === "team1-1" ? (
                <div className="flex items-center gap-1">
                  <Select value="" onValueChange={handlePlayerChange}>
                    <SelectTrigger className="w-24 h-6 text-xs p-1" data-testid={`select-player-team1-1`}>
                      <SelectValue placeholder="Swap..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allPlayers.map((p) => (
                        <SelectItem key={p} value={p} data-testid={`option-${p}`}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setEditingPosition(null)}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPosition("team1-1")}
                  className="hover-elevate active-elevate-2 group relative"
                  data-testid={`button-edit-team1-1`}
                >
                  <Badge 
                    className="bg-primary/10 text-primary hover:bg-primary/20 text-xs"
                    data-testid={`badge-player-${team1[1]}`}
                  >
                    {team1[1]}
                  </Badge>
                  <Edit2 className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => decrementScore(1)}
                data-testid={`button-decrease-team1-${matchId}`}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div 
                className="w-8 text-center font-semibold text-sm"
                data-testid={`text-score-team1-${matchId}`}
              >
                {team1Score}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => incrementScore(1)}
                data-testid={`button-increase-team1-${matchId}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {editingPosition === "team2-0" ? (
                <div className="flex items-center gap-1">
                  <Select value="" onValueChange={handlePlayerChange}>
                    <SelectTrigger className="w-24 h-6 text-xs p-1" data-testid={`select-player-team2-0`}>
                      <SelectValue placeholder="Swap..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allPlayers.map((p) => (
                        <SelectItem key={p} value={p} data-testid={`option-${p}`}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setEditingPosition(null)}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPosition("team2-0")}
                  className="hover-elevate active-elevate-2 group relative"
                  data-testid={`button-edit-team2-0`}
                >
                  <Badge 
                    className="bg-accent text-accent-foreground text-xs"
                    data-testid={`badge-player-${team2[0]}`}
                  >
                    {team2[0]}
                  </Badge>
                  <Edit2 className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100" />
                </button>
              )}
              {editingPosition === "team2-1" ? (
                <div className="flex items-center gap-1">
                  <Select value="" onValueChange={handlePlayerChange}>
                    <SelectTrigger className="w-24 h-6 text-xs p-1" data-testid={`select-player-team2-1`}>
                      <SelectValue placeholder="Swap..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allPlayers.map((p) => (
                        <SelectItem key={p} value={p} data-testid={`option-${p}`}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setEditingPosition(null)}
                    data-testid="button-cancel-edit"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingPosition("team2-1")}
                  className="hover-elevate active-elevate-2 group relative"
                  data-testid={`button-edit-team2-1`}
                >
                  <Badge 
                    className="bg-accent text-accent-foreground text-xs"
                    data-testid={`badge-player-${team2[1]}`}
                  >
                    {team2[1]}
                  </Badge>
                  <Edit2 className="w-3 h-3 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => decrementScore(2)}
                data-testid={`button-decrease-team2-${matchId}`}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <div 
                className="w-8 text-center font-semibold text-sm"
                data-testid={`text-score-team2-${matchId}`}
              >
                {team2Score}
              </div>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={() => incrementScore(2)}
                data-testid={`button-increase-team2-${matchId}`}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
