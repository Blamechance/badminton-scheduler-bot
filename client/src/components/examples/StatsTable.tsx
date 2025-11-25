import StatsTable from "../StatsTable";

export default function StatsTableExample() {
  const stats = [
    {
      player: "Alice",
      partners: ["Bob", "Charlie"],
      opponents: ["Diana", "Eve", "Frank"],
      matchesPlayed: 3,
      rests: 1,
    },
    {
      player: "Bob",
      partners: ["Alice", "Diana"],
      opponents: ["Charlie", "Eve", "Frank"],
      matchesPlayed: 3,
      rests: 1,
    },
    {
      player: "Charlie",
      partners: ["Alice", "Eve"],
      opponents: ["Bob", "Diana", "Frank"],
      matchesPlayed: 3,
      rests: 1,
    },
    {
      player: "Diana",
      partners: ["Bob", "Frank"],
      opponents: ["Alice", "Charlie", "Eve"],
      matchesPlayed: 3,
      rests: 1,
    },
  ];

  return <StatsTable stats={stats} />;
}
