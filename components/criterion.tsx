import { CircleCheck } from "lucide-react";

export function Criterion({
  name,
  criterion,
}: {
  name: string;
  criterion: string;
}) {
  return (
    <li className="bg-gray-50 p-2 rounded-md" key={name}>
      <div className="flex items-start gap-2">
        <CircleCheck className="size-4 text-green-500 mt-1 shrink-0" />
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{criterion}</p>
        </div>
      </div>
    </li>
  );
}
