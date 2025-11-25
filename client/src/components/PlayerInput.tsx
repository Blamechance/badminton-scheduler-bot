import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlayerInputProps {
  players: string[];
  onPlayersChange: (players: string[]) => void;
  onGenerate: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function PlayerInput({ 
  players, 
  onPlayersChange, 
  onGenerate,
  isCollapsed = false,
  onToggleCollapse
}: PlayerInputProps) {
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 10) {
      onPlayersChange([...players, newPlayerName.trim()]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (index: number) => {
    onPlayersChange(players.filter((_, i) => i !== index));
  };

  const updatePlayer = (index: number, value: string) => {
    const updated = [...players];
    updated[index] = value;
    onPlayersChange(updated);
  };

  const canGenerate = players.length >= 4 && players.length <= 10 && 
    players.every(p => p.trim().length > 0);

  if (isCollapsed && onToggleCollapse) {
    return (
      <Card data-testid="card-player-input-collapsed">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium" data-testid="text-player-count">
                  {players.length} {players.length === 1 ? 'Player' : 'Players'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {players.join(", ")}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onToggleCollapse}
              data-testid="button-edit-players"
            >
              Edit Players
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-player-input">
      <CardHeader>
        <CardTitle className="font-heading">Add Players</CardTitle>
        <CardDescription>
          Enter 4-10 player names to generate a balanced schedule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <Badge variant="secondary" data-testid="badge-player-count">
            {players.length} / 10 Players
          </Badge>
          {players.length >= 4 && players.length <= 10 && (
            <Badge variant="default" data-testid="badge-ready">
              Ready to generate
            </Badge>
          )}
          {players.length < 4 && (
            <Badge variant="outline" data-testid="badge-need-more">
              Need {4 - players.length} more
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {players.map((player, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={player}
                onChange={(e) => updatePlayer(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                data-testid={`input-player-${index}`}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removePlayer(index)}
                data-testid={`button-remove-player-${index}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {players.length < 10 && (
          <div className="flex gap-2">
            <Input
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
              placeholder="Enter player name"
              data-testid="input-new-player"
            />
            <Button
              onClick={addPlayer}
              disabled={!newPlayerName.trim()}
              data-testid="button-add-player"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={onGenerate}
            disabled={!canGenerate}
            className="flex-1 text-lg py-6"
            data-testid="button-generate-schedule"
          >
            Generate Schedule
          </Button>
          {players.length > 0 && (
            <Button
              variant="outline"
              onClick={() => onPlayersChange([])}
              data-testid="button-clear-all"
            >
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
