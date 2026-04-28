import { GameCanvas } from "@/components/game/GameCanvas";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950">
      <h1 className="text-2xl font-bold text-zinc-200 mb-6 tracking-widest uppercase">
        Hollow Home
      </h1>
      <GameCanvas />
      <p className="text-zinc-500 text-xs mt-4">
        WASD or Arrow Keys to move
      </p>
    </main>
  );
}
