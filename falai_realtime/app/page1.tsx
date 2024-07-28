"use client";
import React, { useEffect, useRef, useState } from 'react';
import * as fal from "@fal-ai/serverless-client";

fal.config({
  proxyUrl: "/api/proxy",
});

const INPUT_DEFAULTS = {
  _force_msgpack: new Uint8Array([]),
  enable_safety_checker: true,
  image_size: "square_hd",
  sync_mode: true,
  num_images: 1,
  num_inference_steps: "2",
};

function randomSeed() {
  return Math.floor(Math.random() * 10000000).toFixed(0);
}

export default function Home() {
  const [input, setInput] = useState('');
  const [seed, setSeed] = useState(randomSeed());
  const [image, setImage] = useState('');
  const [inferenceTime, setInferenceTime] = useState<any>(null);

  const connectionRef = useRef<any | undefined>(undefined);
  const timerRef = useRef<any | undefined>(undefined);

  useEffect(() => {
    const connection = fal.realtime.connect("fal-ai/fast-lightning-sdxl", {
      connectionKey: "lightning-sdxl",
      throttleInterval: 64,
      onResult: (result) => {
        const blob = new Blob([result.images[0].content], { type: "image/jpeg" });
        setImage(URL.createObjectURL(blob));
        setInferenceTime(result.timings.inference);
      },
    });

    connectionRef.current = connection;

    return () => {
      // Perform any necessary cleanup for the connection
      if (connectionRef.current && connectionRef.current.disconnect) {
        connectionRef.current.disconnect();
      }
    };
  }, []);

  async function handleOnChange(prompt: string) {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setInput(prompt);
    const input = {
      ...INPUT_DEFAULTS,
      prompt: prompt,
      seed: seed ? Number(seed) : Number(randomSeed()),
    };
    connectionRef.current.send(input);
    timerRef.current = setTimeout(() => {
      connectionRef.current.send({ ...input, num_inference_steps: "4" });
    }, 500);
  };

  return (
    <main className="flex justify-center pt-5">
      <div className="w-[800px] flex flex-col items-center justify-center">
        <input
          placeholder="Type something..."
          onChange={(e) => handleOnChange(e.target.value)}
          className="border w-full p-2 text-sm"
          value={input}
        />
        {inferenceTime && (
          <p className="mt-3">{(inferenceTime * 1000).toFixed(0)}ms</p>
        )}
        {image && (
          <img
            src={image}
            className="mt-3 w-[800px] h-[800px]"
            alt="Generated"
          />
        )}
      </div>
    </main>
  );
}
