// components/game/GameCanvas.tsx
"use client";

import { useEffect, useRef } from "react";
import { GAME_WIDTH, GAME_HEIGHT } from "@/lib/phaser/config";
import type { ResourceType } from "@/types/game";

interface Props {
  onGather: (type: ResourceType, amount: number) => void;
  onGameEvent: (event: string) => void;
}

export function GameCanvas({ onGather, onGameEvent }: Props) {
  const gameRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const onGatherRef = useRef(onGather);
  const onGameEventRef = useRef(onGameEvent);

  // Keep refs up to date without re-creating the game
  useEffect(() => {
    onGatherRef.current = onGather;
    onGameEventRef.current = onGameEvent;
  }, [onGather, onGameEvent]);

  useEffect(() => {
    const initPhaser = async () => {
      if (gameRef.current || !containerRef.current) return;

      const Phaser = await import("phaser");
      const { createGameScene } = await import("@/lib/phaser/scenes/GameScene");

      const GameScene = createGameScene(Phaser);

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        backgroundColor: "#1a1a2e",
        physics: {
          default: "arcade",
          arcade: { gravity: { x: 0, y: 0 }, debug: false },
        },
        pixelArt: true,
        antialias: false,
        scene: [GameScene],
        parent: containerRef.current,
      });

      // Listen for gather events from Phaser
      gameRef.current.events.on(
        "gathered",
        ({ type, amount }: { type: ResourceType; amount: number }) => {
          onGatherRef.current(type, amount);
        },
      );

      // Listen for other game events
      gameRef.current.events.on("openCrafting", () => {
        onGameEventRef.current("openCrafting");
      });

      gameRef.current.events.on("openHomestead", () => {
        onGameEventRef.current("openHomestead");
      });
    };

    initPhaser();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden shadow-2xl"
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    />
  );
}
