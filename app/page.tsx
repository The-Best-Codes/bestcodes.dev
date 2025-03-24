import Header from "@/components/global/header";
import MatrixRain from "@/components/global/matrix-rain";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen scroll-smooth max-w-screen w-full flex-col items-center">
      <Header />
      <div className="w-full h-96 relative">
        <MatrixRain />
        <div className="absolute top-0 left-0 w-full h-full bg-transparent flex justify-center items-center">
          <div className="text-7xl sm:text-9xl font-bold text-foreground">
            👋 Hi
          </div>
        </div>
      </div>
      <div className="w-full p-6 sm:p-12 flex flex-col justify-center items-center text-center">
        <Image
          src="/image/best_codes_logo_low_res.png"
          alt="Best Codes Logo"
          aria-label="Best Codes letter 'B' logo"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full"
          width={128}
          height={128}
        />
        <span className="text-5xl md:text-8xl mt-4 font-bold text-primary">
          I&apos;m BestCodes
        </span>
        <span className="text-3xl md:text-5xl text-primary">
          Christian, Coder, Creator
        </span>
      </div>
    </main>
  );
}
