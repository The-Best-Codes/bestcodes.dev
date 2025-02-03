import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./Carousel";

export default function CarouselWrapper() {
  return (
    <Carousel class="rounded-lg overflow-hidden shadow-md">
      <CarouselContent>
        <CarouselItem>
          <img
            src="https://placehold.co/300"
            alt="Kitten 1"
            class="w-full h-auto object-cover aspect-square"
          />
        </CarouselItem>
        {/* Add other CarouselItems */}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
