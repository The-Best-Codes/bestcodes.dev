import Header from "@/components/global/header";
import MatrixRain from "@/components/global/matrix-rain";

export default function Home() {
  return (
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center">
      <Header />
      <div className="w-full h-80">
        <MatrixRain />
      </div>
    </main>
  );
}
