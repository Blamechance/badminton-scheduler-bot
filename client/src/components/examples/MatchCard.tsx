import MatchCard from "../MatchCard";

export default function MatchCardExample() {
  return (
    <div className="max-w-sm">
      <MatchCard
        courtNumber={1}
        team1={["Alice", "Bob"]}
        team2={["Charlie", "Diana"]}
        matchId="example-1"
      />
    </div>
  );
}
