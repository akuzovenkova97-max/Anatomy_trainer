import { useState } from "react";
import muscleData from "./muscle_description.json";
import FlashCard from "./FlashCard";

const muscles = muscleData.muscles;

export default function MuscleTrainer() {
  const [idx, setIdx] = useState(0);

  const isLast = idx === muscles.length - 1;

  return (
    <FlashCard
      muscle={muscles[idx]}
      index={idx}
      total={muscles.length}
      onPrev={() => setIdx((i) => (i - 1 + muscles.length) % muscles.length)}
      onNext={isLast ? null : () => setIdx((i) => i + 1)}
      onResume={isLast ? () => setIdx(0) : null}
    />
  );
}
