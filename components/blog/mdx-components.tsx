import getDynamicImageAsStatic from "@/lib/getImageDynamic";
import Image from "next/image";
import OutboundLink from "../global/links/outbound";
import { Button } from "../ui/button";
import DevToEmbed from "./DevToEmbed";
import DiscordBotInvite from "./DiscordBotInvite";
import { Margin } from "./Margin";

const MdxImage = async (props: any) => {
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

export const components = {
  DevToEmbed,
  Button,
  OutboundLink,
  Margin,
  DiscordBotInvite,
  img: MdxImage,
};
