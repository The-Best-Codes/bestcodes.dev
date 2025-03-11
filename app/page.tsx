import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-24 px-6 md:px-12 lg:px-24">
      <div className="container max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          Work in progress
        </h1>
        <p className="text-gray-500 text-lg md:text-xl mb-8">
          We're working hard!
        </p>
        <div className="space-x-4">
          <Button size="lg">
            Explore Examples <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </main>
  );
}
