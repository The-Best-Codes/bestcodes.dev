import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RemToPxClient } from "./client";
import { validateRemValue } from "./utils";

type PageProps = {
  params: { remValue: string };
};

export async function generateStaticParams() {
  const commonValues = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5];
  const customValues = Array.from({ length: 1000 }, (_, i) => i + 1); // TODO: This is a lot! Maybe only pre-generate 50?
  const values = new Set([...commonValues, ...customValues]);

  return Array.from(values).map((remValue) => ({
    remValue: String(remValue),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const paramsValue = await params;
  const rem = Number(paramsValue.remValue);

  if (!validateRemValue(rem)) {
    return {
      title: "Invalid REM Value | REM to PX Converter",
      description: "Enter a valid REM value to convert to pixels",
    };
  }

  const px = Math.round(rem * 16 * 100) / 100;

  return {
    title: `${rem} REM to PX - REM to PX Conversion Tool | BestCodes Dev Tools`,
    description: `Convert ${rem} REM to ${px} pixels with live preview.`,
    keywords: [
      "REM to PX converter",
      "CSS units converter",
      "rem px calculator",
      "responsive web design",
      "CSS units conversion",
      "font size converter",
      "REM unit calculator",
    ],
    openGraph: {
      title: `${rem} REM = ${px} PX | BestCodes Dev Tools`,
      description: `Instant conversion of ${rem} REM to ${px} pixels. Interactive preview and detailed usage examples.`,
      type: "website",
      url: `https://bestcodes.dev/devtools/convert/rem-to-px/${rem}`,
      siteName: "BestCodes Dev Tools",
    },
    twitter: {
      card: "summary_large_image",
      title: `${rem} REM to ${px} PX Converter`,
      description: `Convert REM to PX with live preview`,
    },
    alternates: {
      canonical: `https://bestcodes.dev/devtools/convert/rem-to-px/${rem}`,
    },
  };
}

export default async function RemToPxPage({ params }: PageProps) {
  const paramsValue = await params;
  const rem = Number(paramsValue.remValue);

  if (!validateRemValue(rem)) {
    notFound();
  }

  return <RemToPxClient initialRem={rem} />;
}
