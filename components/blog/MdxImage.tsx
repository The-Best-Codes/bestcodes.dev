import getDynamicImageAsStatic from "@/lib/getImageDynamic";
import Image from "next/image";

export const MdxImage = async (props: any) => {
  if (typeof props.src !== "string" || !props.src) {
    console.error("Invalid image src:", props.src);
    return null;
  }

  if (!props.src.startsWith("/image/blog")) {
    return (
      <img {...props} alt={props.alt || ""} loading="lazy" decoding="async" />
    );
  }

  return (
    <Image
      src={await getDynamicImageAsStatic(props.src)}
      placeholder="blur"
      alt={props.alt || ""}
      loading="lazy"
    />
  );
};
