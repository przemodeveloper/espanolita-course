export default function TaskSetProgressBar({
  completedTasksCount,
  totalTasksCount,
  taskSetTitle,
}: {
  completedTasksCount: number;
  totalTasksCount: number;
  taskSetTitle: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-2">Postęp arkusza: {taskSetTitle}</p>
      <div className="w-full h-3 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{
            width: `${
              totalTasksCount > 0
                ? (completedTasksCount / totalTasksCount) * 100
                : 0
            }%`,
          }}
        />
      </div>
    </div>
  );
}
