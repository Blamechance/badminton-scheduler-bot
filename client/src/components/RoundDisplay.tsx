import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MatchCard from "./MatchCard";
import { Coffee } from "lucide-react";

interface Match {
  court: number;
  team1: [string, string];
  team2: [string, string];
}

interface RoundDisplayProps {
  roundNumber: number;
  matches: Match[];
  resting: string[];
  matchScores: Map<string, { team1: number; team2: number }>;
  onScoreUpdate: (matchId: string, team: 1 | 2, score: number) => void;
  allPlayers: string[];
  onPlayerReplace: (matchId: string, position: string, oldPlayer: string, newPlayer: string) => void;
}

export default function RoundDisplay({ roundNumber, matches, resting, matchScores, onScoreUpdate, allPlayers, onPlayerReplace }: RoundDisplayProps) {
  // Compute who's actually resting based on current matches
  const computeRestingPlayers = () => {
    const playingSet = new Set<string>();
    matches.forEach(match => {
      match.team1.forEach(p => playingSet.add(p));
      match.team2.forEach(p => playingSet.add(p));
    });
    return allPlayers.filter(p => !playingSet.has(p));
  };

  const actualResting = computeRestingPlayers();

  return (
    <Card data-testid={`card-round-${roundNumber}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-heading text-lg font-semibold" data-testid={`title-round-${roundNumber}`}>
            Round {roundNumber}
          </h3>
          {actualResting.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Coffee className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Resting:</span>
              {actualResting.map((player) => (
                <Badge 
                  key={player} 
                  variant="outline"
                  className="text-xs"
                  data-testid={`badge-resting-${player}`}
                >
                  {player}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {matches.map((match) => {
            const matchId = `r${roundNumber}-c${match.court}`;
            return (
              <MatchCard
                key={match.court}
                courtNumber={match.court}
                team1={match.team1}
                team2={match.team2}
                matchId={matchId}
                scores={matchScores.get(matchId)}
                onScoreUpdate={onScoreUpdate}
                allPlayers={allPlayers}
                onPlayerReplace={onPlayerReplace}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
