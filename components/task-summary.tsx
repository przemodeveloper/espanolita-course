export function TaskSummary({ score }: { score: number }) {
  return (
    <div className="bg-green-100 p-2 rounded-md mb-2">
      <p>Wynik tego zadania: {score}</p>
      <p>To zadanie zostało zakończone</p>
    </div>
  );
}
