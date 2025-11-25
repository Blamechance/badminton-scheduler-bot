import { useState, useEffect } from "react";
import PlayerInput from "@/components/PlayerInput";
import RoundDisplay from "@/components/RoundDisplay";
import StatsTable from "@/components/StatsTable";
import { Button } from "@/components/ui/button";
import { RotateCcw, Moon, Sun } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// TODO: This will be replaced with actual scheduling algorithm
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

interface PlayerStats {
  player: string;
  partners: string[];
  opponents: string[];
  matchesPlayed: number;
  rests: number;
}

// TODO: remove mock functionality - Equitable round-robin scheduler
function generateMockSchedule(players: string[]): {
  rounds: Round[];
  stats: PlayerStats[];
} {
  const numPlayers = players.length;
  const playersPerMatch = 4;
  const matchesPerRound = Math.floor(numPlayers / playersPerMatch);
  const playingPerRound = matchesPerRound * playersPerMatch;

  // Calculate target rounds for equal distribution
  // Need rounds where (rounds * matchesPerRound * 4) is divisible by numPlayers
  let numRounds = numPlayers * 2;
  while ((numRounds * playingPerRound) % numPlayers !== 0) {
    numRounds++;
  }
  // Ensure even number of rounds
  if (numRounds % 2 !== 0) numRounds++;

  const targetMatches = (numRounds * playingPerRound) / numPlayers;
  const targetRests = numRounds - targetMatches;

  // Track partnerships, opponents, matches, and rests
  const partnerCount = new Map<string, Map<string, number>>();
  const opponentCount = new Map<string, Map<string, number>>();
  const matchCount = new Map<string, number>();
  const restCount = new Map<string, number>();

  players.forEach((p) => {
    partnerCount.set(p, new Map());
    opponentCount.set(p, new Map());
    matchCount.set(p, 0);
    restCount.set(p, 0);
  });

  const rounds: Round[] = [];

  for (let r = 0; r < numRounds; r++) {
    // Select who rests this round - prioritize overplayed or under-rested players
    const restingCount = numPlayers - playingPerRound;
    const playerScores = players.map((p) => {
      const played = matchCount.get(p) || 0;
      const rested = restCount.get(p) || 0;
      // Higher score = should rest (overplayed or under-rested)
      const score =
        played -
        (targetMatches * (r + 1)) / numRounds -
        (rested - (targetRests * (r + 1)) / numRounds);
      return { player: p, score };
    });

    playerScores.sort((a, b) => b.score - a.score);
    const resting = playerScores.slice(0, restingCount).map((ps) => ps.player);
    const playing = players.filter((p) => !resting.includes(p));

    // Generate matches using pairing optimization
    const matches = generateOptimalMatches(
      playing,
      partnerCount,
      opponentCount,
      r + 1,
    );

    // Update tracking
    matches.forEach((match) => {
      const allPlayers = [...match.team1, ...match.team2];
      allPlayers.forEach((p) => {
        matchCount.set(p, (matchCount.get(p) || 0) + 1);
      });

      // Track partnerships
      [match.team1, match.team2].forEach((team) => {
        const [p1, p2] = team;
        const p1Partners = partnerCount.get(p1)!;
        const p2Partners = partnerCount.get(p2)!;
        p1Partners.set(p2, (p1Partners.get(p2) || 0) + 1);
        p2Partners.set(p1, (p2Partners.get(p1) || 0) + 1);
      });

      // Track opponents
      match.team1.forEach((p1) => {
        match.team2.forEach((p2) => {
          const p1Opponents = opponentCount.get(p1)!;
          const p2Opponents = opponentCount.get(p2)!;
          p1Opponents.set(p2, (p1Opponents.get(p2) || 0) + 1);
          p2Opponents.set(p1, (p2Opponents.get(p1) || 0) + 1);
        });
      });
    });

    resting.forEach((p) => {
      restCount.set(p, (restCount.get(p) || 0) + 1);
    });

    rounds.push({
      roundNumber: r + 1,
      matches,
      resting,
    });
  }

  // Generate stats
  const stats: PlayerStats[] = players.map((player) => ({
    player,
    partners: Array.from(partnerCount.get(player)!.keys()),
    opponents: Array.from(opponentCount.get(player)!.keys()),
    matchesPlayed: matchCount.get(player) || 0,
    rests: restCount.get(player) || 0,
  }));

  return { rounds, stats };
}

// Generate optimal match pairings for a round
function generateOptimalMatches(
  playing: string[],
  partnerCount: Map<string, Map<string, number>>,
  opponentCount: Map<string, Map<string, number>>,
  courtStart: number,
): Match[] {
  const matches: Match[] = [];
  const used = new Set<string>();
  let courtNum = 1;

  // Greedy pairing: prioritize new partnerships and opponents
  while (used.size < playing.length) {
    const available = playing.filter((p) => !used.has(p));
    if (available.length < 4) break;

    // Find best team 1 pairing
    let bestTeam1: [string, string] | null = null;
    let bestTeam1Score = Infinity;

    for (let i = 0; i < available.length - 1; i++) {
      for (let j = i + 1; j < available.length; j++) {
        const p1 = available[i];
        const p2 = available[j];
        const partnerScore = partnerCount.get(p1)?.get(p2) || 0;
        if (partnerScore < bestTeam1Score) {
          bestTeam1Score = partnerScore;
          bestTeam1 = [p1, p2];
        }
      }
    }

    if (!bestTeam1) break;

    // Find best team 2 from remaining
    const remaining = available.filter((p) => !bestTeam1!.includes(p));
    let bestTeam2: [string, string] | null = null;
    let bestMatchScore = Infinity;

    for (let i = 0; i < remaining.length - 1; i++) {
      for (let j = i + 1; j < remaining.length; j++) {
        const p1 = remaining[i];
        const p2 = remaining[j];

        // Score based on partner repeats + opponent repeats
        const partnerScore = partnerCount.get(p1)?.get(p2) || 0;
        const opponentScore =
          (opponentCount.get(bestTeam1[0])?.get(p1) || 0) +
          (opponentCount.get(bestTeam1[0])?.get(p2) || 0) +
          (opponentCount.get(bestTeam1[1])?.get(p1) || 0) +
          (opponentCount.get(bestTeam1[1])?.get(p2) || 0);

        const totalScore = partnerScore * 3 + opponentScore;
        if (totalScore < bestMatchScore) {
          bestMatchScore = totalScore;
          bestTeam2 = [p1, p2];
        }
      }
    }

    if (!bestTeam2) break;

    // Create match
    matches.push({
      court: courtNum++,
      team1: bestTeam1,
      team2: bestTeam2,
    });

    [bestTeam1[0], bestTeam1[1], bestTeam2[0], bestTeam2[1]].forEach((p) =>
      used.add(p),
    );
  }

  return matches;
}

const STORAGE_KEY = "badminton-schedule";

interface StoredState {
  schedule: Round[] | null;
  stats: PlayerStats[] | null;
  matchScores: [string, { team1: number; team2: number }][];
  isPlayerInputCollapsed: boolean;
  showStats: boolean;
}

export default function Scheduler() {
  const [players, setPlayers] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Round[] | null>(null);
  const [stats, setStats] = useState<PlayerStats[] | null>(null);
  const [isPlayerInputCollapsed, setIsPlayerInputCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [matchScores, setMatchScores] = useState<
    Map<string, { team1: number; team2: number }>
  >(new Map());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const state: StoredState = JSON.parse(stored);
        setSchedule(state.schedule);
        setStats(state.stats);
        setMatchScores(new Map(state.matchScores));
        setIsPlayerInputCollapsed(state.isPlayerInputCollapsed);
        setShowStats(state.showStats);
      }
    } catch (error) {
      console.error("Failed to load schedule from localStorage:", error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (schedule) {
      try {
        const state: StoredState = {
          schedule,
          stats,
          matchScores: Array.from(matchScores.entries()),
          isPlayerInputCollapsed,
          showStats,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save schedule to localStorage:", error);
      }
    }
  }, [schedule, stats, matchScores, isPlayerInputCollapsed, showStats]);

  const handleGenerate = () => {
    const { rounds, stats } = generateMockSchedule(players);
    setSchedule(rounds);
    setStats(stats);
    setIsPlayerInputCollapsed(true);
    setShowStats(true);
    setMatchScores(new Map());
  };

  const handleReset = () => {
    setSchedule(null);
    setStats(null);
    setIsPlayerInputCollapsed(false);
    setShowStats(false);
    setMatchScores(new Map());
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleScoreUpdate = (matchId: string, team: 1 | 2, score: number) => {
    setMatchScores((prev) => {
      const newScores = new Map(prev);
      const current = newScores.get(matchId) || { team1: 0, team2: 0 };
      if (team === 1) {
        newScores.set(matchId, { ...current, team1: score });
      } else {
        newScores.set(matchId, { ...current, team2: score });
      }
      return newScores;
    });
  };

  const recalculateStats = (updatedSchedule: Round[]) => {
    const partnerCount = new Map<string, Map<string, number>>();
    const opponentCount = new Map<string, Map<string, number>>();
    const matchCount = new Map<string, number>();
    const restCount = new Map<string, number>();

    players.forEach((p) => {
      partnerCount.set(p, new Map());
      opponentCount.set(p, new Map());
      matchCount.set(p, 0);
      restCount.set(p, 0);
    });

    updatedSchedule.forEach((round) => {
      round.matches.forEach((match) => {
        const allPlayers = [...match.team1, ...match.team2];
        allPlayers.forEach((p) => {
          matchCount.set(p, (matchCount.get(p) || 0) + 1);
        });

        [match.team1, match.team2].forEach((team) => {
          const [p1, p2] = team;
          const p1Partners = partnerCount.get(p1)!;
          const p2Partners = partnerCount.get(p2)!;
          p1Partners.set(p2, (p1Partners.get(p2) || 0) + 1);
          p2Partners.set(p1, (p2Partners.get(p1) || 0) + 1);
        });

        match.team1.forEach((p1) => {
          match.team2.forEach((p2) => {
            const p1Opponents = opponentCount.get(p1)!;
            const p2Opponents = opponentCount.get(p2)!;
            p1Opponents.set(p2, (p1Opponents.get(p2) || 0) + 1);
            p2Opponents.set(p1, (p2Opponents.get(p1) || 0) + 1);
          });
        });
      });

      round.resting.forEach((p) => {
        restCount.set(p, (restCount.get(p) || 0) + 1);
      });
    });

    const newStats: PlayerStats[] = players.map((player) => ({
      player,
      partners: Array.from(partnerCount.get(player)!.keys()),
      opponents: Array.from(opponentCount.get(player)!.keys()),
      matchesPlayed: matchCount.get(player) || 0,
      rests: restCount.get(player) || 0,
    }));

    setStats(newStats);
  };

  const handlePlayerReplace = (
    matchId: string,
    position: string,
    oldPlayer: string,
    newPlayer: string,
  ) => {
    if (!schedule) return;

    const parts = matchId.split("-");
    const roundNum = parseInt(parts[0].substring(1));
    const courtNum = parseInt(parts[1].substring(1));

    const updatedSchedule = schedule.map((round) => {
      if (round.roundNumber !== roundNum) return round;

      return {
        ...round,
        matches: round.matches.map((match) => {
          if (match.court !== courtNum) return match;

          let team1 = match.team1;
          let team2 = match.team2;

          if (position === "team1-0") {
            team1 = [newPlayer, match.team1[1]];
          } else if (position === "team1-1") {
            team1 = [match.team1[0], newPlayer];
          } else if (position === "team2-0") {
            team2 = [newPlayer, match.team2[1]];
          } else if (position === "team2-1") {
            team2 = [match.team2[0], newPlayer];
          }

          return { ...match, team1, team2 };
        }),
      };
    });

    setSchedule(updatedSchedule);
    recalculateStats(updatedSchedule);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-4xl font-bold font-heading"
              data-testid="title-main"
            >
              Badminton Scheduler Bot
            </h1>
            <p className="text-muted-foreground mt-1">
              Create balanced doubles schedules with fair pairings
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Player Input */}
        <PlayerInput
          players={players}
          onPlayersChange={setPlayers}
          onGenerate={handleGenerate}
          isCollapsed={isPlayerInputCollapsed}
          onToggleCollapse={() =>
            setIsPlayerInputCollapsed(!isPlayerInputCollapsed)
          }
        />

        {/* Schedule Display */}
        {schedule && (
          <>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <h2
                className="text-2xl font-semibold font-heading"
                data-testid="title-schedule"
              >
                Generated Schedule
              </h2>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  onClick={() => setShowStats(!showStats)}
                  data-testid="button-toggle-stats"
                >
                  {showStats ? "Hide" : "Show"} Statistics
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  data-testid="button-reset-schedule"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Schedule
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {schedule.map((round) => (
                <RoundDisplay
                  key={round.roundNumber}
                  roundNumber={round.roundNumber}
                  matches={round.matches}
                  resting={round.resting}
                  matchScores={matchScores}
                  onScoreUpdate={handleScoreUpdate}
                  allPlayers={players}
                  onPlayerReplace={handlePlayerReplace}
                />
              ))}
            </div>

            {/* Statistics */}
            {showStats && stats && (
              <Collapsible open={showStats}>
                <CollapsibleContent>
                  <StatsTable
                    stats={stats}
                    rounds={schedule}
                    matchScores={matchScores}
                  />
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}

        {/* Empty State */}
        {!schedule && players.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="text-6xl">🏸</div>
            <h2 className="text-2xl font-semibold font-heading">
              Ready to organize your badminton session?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Add 4-10 players above to generate a fair round robin schedule
              with balanced pairings and playtime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
