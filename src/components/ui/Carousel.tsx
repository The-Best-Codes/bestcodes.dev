import type { EmblaCarouselType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-solid";
import ArrowLeft from "lucide-solid/icons/arrow-left";
import ArrowRight from "lucide-solid/icons/arrow-right";
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
  type JSX,
  type ParentComponent,
} from "solid-js";

import { Button } from "./button";
import { cn } from "./lib/utils";

type CarouselApi = EmblaCarouselType;
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
  orientation: () => "horizontal" | "vertical";
  opts?: CarouselOptions;
};

const CarouselContext = createContext<CarouselContextProps>();

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const Carousel: ParentComponent<
  CarouselProps & JSX.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const [carouselRef, emblaApi] = useEmblaCarousel(
    () => ({
      ...props.opts,
      axis: props.orientation === "horizontal" ? "x" : "y",
    }),
    () => props.plugins,
  );

  const [canScrollPrev, setCanScrollPrev] = createSignal(false);
  const [canScrollNext, setCanScrollNext] = createSignal(false);

  const orientation = createMemo(
    () =>
      props.orientation ||
      (props.opts?.axis === "y" ? "vertical" : "horizontal"),
  );

  const onSelect = (api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  };

  const scrollPrev = () => emblaApi()?.scrollPrev();
  const scrollNext = () => emblaApi()?.scrollNext();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  };

  createEffect(() => {
    if (!emblaApi() || !props.setApi) return;
    props.setApi(emblaApi()!);
  });

  createEffect(() => {
    const api = emblaApi();
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    onCleanup(() => {
      api.off("select", onSelect);
    });
  });

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: emblaApi,
        opts: props.opts,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        ref={props.ref}
        onKeyDown={handleKeyDown}
        class={cn("relative", props.class)}
        role="region"
        aria-roledescription="carousel"
        {...props}
      >
        {props.children}
      </div>
    </CarouselContext.Provider>
  );
};

const CarouselContent: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} class="overflow-hidden">
      <div
        ref={props.ref}
        class={cn(
          "flex",
          orientation() === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          props.class,
        )}
        {...props}
      />
    </div>
  );
};

const CarouselItem: ParentComponent<JSX.HTMLAttributes<HTMLDivElement>> = (
  props,
) => {
  const { orientation } = useCarousel();
  return (
    <div
      ref={props.ref}
      role="group"
      aria-roledescription="slide"
      class={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation() === "horizontal" ? "pl-4" : "pt-4",
        props.class,
      )}
      {...props}
    />
  );
};

const CarouselPrevious: ParentComponent<
  JSX.HTMLAttributes<HTMLButtonElement> & {
    variant?: "outline" | "default";
    size?: "icon";
  }
> = (props) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      ref={props.ref}
      variant={props.variant || "outline"}
      size={props.size || "icon"}
      class={cn(
        "absolute h-8 w-8 rounded-full",
        orientation() === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        props.class,
      )}
      disabled={!canScrollPrev()}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft class="h-4 w-4" />
      <span class="sr-only">Previous slide</span>
    </Button>
  );
};

const CarouselNext: ParentComponent<
  JSX.HTMLAttributes<HTMLButtonElement> & {
    variant?: "outline" | "default";
    size?: "icon";
  }
> = (props) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      ref={props.ref}
      variant={props.variant || "outline"}
      size={props.size || "icon"}
      class={cn(
        "absolute h-8 w-8 rounded-full",
        orientation() === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        props.class,
      )}
      disabled={!canScrollNext()}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight class="h-4 w-4" />
      <span class="sr-only">Next slide</span>
    </Button>
  );
};

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
};
