import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export default function WritingTask() {
  return (
    <div className="flex flex-col  gap-4">
      <Textarea className="w-full h-[500px]" />
      <Button variant="outline">Sprawdź</Button>
    </div>
  );
}
