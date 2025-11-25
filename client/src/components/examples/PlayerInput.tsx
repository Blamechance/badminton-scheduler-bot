import { useState } from "react";
import PlayerInput from "../PlayerInput";

export default function PlayerInputExample() {
  const [players, setPlayers] = useState(["Alice", "Bob", "Charlie", "Diana"]);

  return (
    <PlayerInput
      players={players}
      onPlayersChange={setPlayers}
      onGenerate={() => console.log("Generate schedule with:", players)}
    />
  );
}
