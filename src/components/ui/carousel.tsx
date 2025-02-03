import createEmblaCarousel from "embla-carousel-solid";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import ArrowRight from "lucide-solid/icons/arrow-right";
import { createSignal, onMount } from "solid-js";

export default function EmblaCarousel() {
  const [emblaRef, emblaApi] = createEmblaCarousel();

  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [slideCount, setSlideCount] = createSignal(0);

  // Functions to control navigation
  const scrollPrev = () => {
    const api = emblaApi();
    if (api) api.scrollPrev();
  };

  const scrollNext = () => {
    const api = emblaApi();
    if (api) api.scrollNext();
  };

  // Subscribe to Embla API events on mount.
  onMount(() => {
    const api = emblaApi();
    if (api) {
      // Update slide count initially.
      setSlideCount(api.scrollSnapList().length);

      // Function to update current slide index.
      const onSelect = () => {
        setCurrentIndex(api.selectedScrollSnap());
      };

      // Listen to the "select" event.
      api.on("select", onSelect);

      // Initialize current index.
      onSelect();
    }
  });

  return (
    <div class="flex flex-col items-center space-y-4">
      {/* Carousel container with fixed dimensions */}
      <div
        class="embla rounded-lg w-64 h-64 overflow-hidden relative"
        ref={emblaRef}
      >
        <div class="embla__container flex">
          {/* Slide 1 */}
          <div class="embla__slide flex-shrink-0 w-full h-full">
            <img
              src="https://placehold.co/400"
              alt="Slide 1"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          {/* Slide 2 */}
          <div class="embla__slide flex-shrink-0 w-full h-full">
            <img
              src="https://placehold.co/400"
              alt="Slide 2"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
          {/* Slide 3 */}
          <div class="embla__slide flex-shrink-0 w-full h-full">
            <img
              src="https://placehold.co/400"
              alt="Slide 3"
              class="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div class="flex space-x-4">
        <button
          disabled={currentIndex() === 0}
          onClick={scrollPrev}
          class="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
        <button
          disabled={currentIndex() === slideCount() - 1}
          onClick={scrollNext}
          class="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight class="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
