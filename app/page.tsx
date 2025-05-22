import Iridescence from "@/components/Backgrounds/Iridescence/Iridescence";

export default function Home() {
  return (
    <div className="realtive h-screen w-full overflow-hidden">
      <Iridescence
        color={[0.85, 0.95, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-3xl font-bold text-black">Intro Page</h1>
      </div>
    </div>
  );
}
