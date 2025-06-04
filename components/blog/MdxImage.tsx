import getDynamicImageAsStatic from "@/lib/getImageDynamic";
import Image from "next/image";

export const MdxImage = async (props: any) => {
  if (typeof props.src !== "string" || !props.src) {
    console.error("Invalid image src:", props.src);
    return null;
  }

  const isBlogImage = props.src.startsWith("/image/blog");
  const external = !isBlogImage;

  let srcData = null;
  if (!external) {
    srcData = await getDynamicImageAsStatic(props.src, "public");
  }

  return (
    <>
      {!external && srcData ? (
        <Image
          src={srcData}
          placeholder="blur"
          alt={props.alt || ""}
          loading="lazy"
        />
      ) : (
        <img {...props} alt={props.alt || ""} loading="lazy" decoding="async" />
      )}
    </>
  );
};
