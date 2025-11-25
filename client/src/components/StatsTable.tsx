import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";

interface PlayerStats {
  player: string;
  partners: string[];
  opponents: string[];
  matchesPlayed: number;
  rests: number;
}

interface Match {
  court: number;
  team1: [string, string];
  team2: [string, string];
}

interface Round {
  roundNumber: number;
  matches: Match[];
  resting: string[];
}

interface StatsTableProps {
  stats: PlayerStats[];
  rounds: Round[];
  matchScores: Map<string, { team1: number; team2: number }>;
}

export default function StatsTable({ stats, rounds, matchScores }: StatsTableProps) {
  const [expandedPlayers, setExpandedPlayers] = useState<Set<string>>(new Set());

  const togglePlayer = (player: string) => {
    setExpandedPlayers(prev => {
      const next = new Set(prev);
      if (next.has(player)) {
        next.delete(player);
      } else {
        next.add(player);
      }
      return next;
    });
  };

  const getPlayerMatches = (player: string) => {
    const matches: Array<{
      roundNumber: number;
      court: number;
      partner: string;
      opponents: [string, string];
      playerTeam: 1 | 2;
      matchId: string;
    }> = [];

    rounds.forEach(round => {
      round.matches.forEach(match => {
        const matchId = `r${round.roundNumber}-c${match.court}`;
        if (match.team1.includes(player)) {
          matches.push({
            roundNumber: round.roundNumber,
            court: match.court,
            partner: match.team1.find(p => p !== player)!,
            opponents: match.team2,
            playerTeam: 1,
            matchId,
          });
        } else if (match.team2.includes(player)) {
          matches.push({
            roundNumber: round.roundNumber,
            court: match.court,
            partner: match.team2.find(p => p !== player)!,
            opponents: match.team1,
            playerTeam: 2,
            matchId,
          });
        }
      });
    });

    return matches;
  };
  return (
    <Card data-testid="card-stats">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Player Statistics</CardTitle>
        <CardDescription>
          Overview of partnerships, opponents, and playing time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Partners</TableHead>
                <TableHead>Opponents</TableHead>
                <TableHead className="text-center">Matches</TableHead>
                <TableHead className="text-center">Rests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((stat) => {
                const isExpanded = expandedPlayers.has(stat.player);
                const playerMatches = getPlayerMatches(stat.player);
                
                return (
                  <>
                    <TableRow key={stat.player} data-testid={`row-stats-${stat.player}`}>
                      <TableCell className="font-medium" data-testid={`cell-player-${stat.player}`}>
                        <button 
                          onClick={() => togglePlayer(stat.player)}
                          className="flex items-center gap-2 hover-elevate active-elevate-2 w-full text-left p-2 -m-2 rounded" 
                          data-testid={`button-expand-${stat.player}`}
                        >
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          <span>{stat.player}</span>
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {stat.partners.map((partner) => (
                            <Badge 
                              key={partner} 
                              variant="secondary" 
                              className="text-xs"
                              data-testid={`badge-partner-${partner}`}
                            >
                              {partner}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {stat.opponents.map((opponent) => (
                            <Badge 
                              key={opponent} 
                              variant="outline" 
                              className="text-xs"
                              data-testid={`badge-opponent-${opponent}`}
                            >
                              {opponent}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge data-testid={`badge-matches-${stat.player}`}>
                          {stat.matchesPlayed}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" data-testid={`badge-rests-${stat.player}`}>
                          {stat.rests}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${stat.player}-history`}>
                        <TableCell colSpan={5} className="p-0">
                          <div className="p-4 bg-muted/30">
                            <h4 className="font-semibold text-sm mb-3" data-testid={`title-match-history-${stat.player}`}>
                              Match History
                            </h4>
                            {playerMatches.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No matches played</p>
                            ) : (
                              <div className="space-y-2 max-h-96 overflow-y-auto">
                                {playerMatches.map((match, idx) => {
                                  const scores = matchScores.get(match.matchId);
                                  const playerScore = match.playerTeam === 1 ? scores?.team1 : scores?.team2;
                                  const opponentScore = match.playerTeam === 1 ? scores?.team2 : scores?.team1;
                                  
                                  let bgClass = "bg-background";
                                  if (scores && playerScore !== undefined && opponentScore !== undefined) {
                                    if (playerScore > opponentScore) {
                                      bgClass = "bg-green-50 dark:bg-green-950";
                                    } else if (playerScore < opponentScore) {
                                      bgClass = "bg-red-50 dark:bg-red-950";
                                    }
                                  }
                                  
                                  return (
                                    <div 
                                      key={idx} 
                                      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm ${bgClass} p-2 rounded`}
                                      data-testid={`match-history-item-${stat.player}-${idx}`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          R{match.roundNumber}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          C{match.court}
                                        </Badge>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-1 md:gap-2 flex-1">
                                        <span className="text-xs text-muted-foreground">with</span>
                                        <Badge className="bg-primary/10 text-primary text-xs">
                                          {match.partner}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">vs</span>
                                        <div className="flex gap-1">
                                          <Badge className="bg-accent text-accent-foreground text-xs">
                                            {match.opponents[0]}
                                          </Badge>
                                          <Badge className="bg-accent text-accent-foreground text-xs">
                                            {match.opponents[1]}
                                          </Badge>
                                        </div>
                                      </div>
                                      {scores && (
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <Badge 
                                            variant={playerScore! > opponentScore! ? "default" : "secondary"}
                                            className="text-xs"
                                            data-testid={`score-player-${match.matchId}`}
                                          >
                                            {playerScore}
                                          </Badge>
                                          <span className="text-xs text-muted-foreground">-</span>
                                          <Badge 
                                            variant={opponentScore! > playerScore! ? "default" : "secondary"}
                                            className="text-xs"
                                            data-testid={`score-opponent-${match.matchId}`}
                                          >
                                            {opponentScore}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
