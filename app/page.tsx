import Header from "@/components/global/header";
import MatrixRain from "@/components/global/matrix-rain";

export default function Home() {
  return (
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center">
      <Header />
      <div className="w-full h-96 relative">
        <MatrixRain />
        <div className="absolute top-0 left-0 w-full h-full bg-transparent flex justify-center items-center">
          <div className="text-9xl font-bold text-foreground">👋 Hi</div>
        </div>
      </div>
    </main>
  );
}
