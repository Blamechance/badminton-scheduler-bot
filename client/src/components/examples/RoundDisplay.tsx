import RoundDisplay from "../RoundDisplay";

export default function RoundDisplayExample() {
  const matches = [
    {
      court: 1,
      team1: ["Alice", "Bob"] as [string, string],
      team2: ["Charlie", "Diana"] as [string, string],
    },
    {
      court: 2,
      team1: ["Eve", "Frank"] as [string, string],
      team2: ["Grace", "Henry"] as [string, string],
    },
    {
      court: 3,
      team1: ["Ian", "Jane"] as [string, string],
      team2: ["Kate", "Leo"] as [string, string],
    },
  ];

  return (
    <RoundDisplay
      roundNumber={1}
      matches={matches}
      resting={["Mike", "Nina"]}
    />
  );
}
