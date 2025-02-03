import createEmblaCarousel from "embla-carousel-solid";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import ArrowRight from "lucide-solid/icons/arrow-right";
import { createSignal, onMount } from "solid-js";

export default function EmblaCarousel(props: { data?: any[] }) {
  const children = props.data || [];

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
      <div
        class="embla rounded-lg w-64 h-fit overflow-hidden relative"
        ref={emblaRef}
      >
        <div class="embla__container flex">
          {children.map((item) => (
            <div class="embla__slide flex-shrink-0 w-full h-full">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={item.coverImage?.src || "/image/not_found.png"}
                  alt={item.coverImage?.alt || item.name}
                  decoding="async"
                  loading="lazy"
                  class="w-full h-full object-cover rounded-lg"
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div class="w-full flex flex-row justify-between items-center">
        <div class="flex space-x-2">
          <button
            disabled={currentIndex() === 0}
            onClick={scrollPrev}
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft class="w-4 h-4" />
          </button>
          <button
            disabled={currentIndex() === slideCount() - 1}
            onClick={scrollNext}
            class="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 p-2 rounded-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
        <a
          href={children[currentIndex()].url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h3 class="text-xl font-bold w-44 truncate text-right text-blue-500 hover:underline">
            <div>{children[currentIndex()].name}</div>
          </h3>
        </a>
      </div>
    </div>
  );
}
