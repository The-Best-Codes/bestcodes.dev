"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { convertRemToPx, sanitizeInput, validateRemValue } from "./utils";

interface RemToPxClientProps {
  initialRem: number;
}

export function RemToPxClient({ initialRem }: RemToPxClientProps) {
  const router = useRouter();
  const [rem, setRem] = useState(initialRem);
  const [inputValue, setInputValue] = useState(String(initialRem));
  const [error, setError] = useState<string | null>(null);
  const px = convertRemToPx(rem);

  useEffect(() => {
    setRem(initialRem);
    setInputValue(String(initialRem));
  }, [initialRem]);

  const handleConvert = (e?: React.FormEvent) => {
    e?.preventDefault();

    const sanitized = sanitizeInput(inputValue);

    if (!validateRemValue(sanitized)) {
      setError("Please enter a valid REM value (0 to 1000)");
      return;
    }

    const numValue = parseFloat(sanitized);

    if (numValue > 1000) {
      setError("Value too large. Please enter a value below 1000 REM");
      return;
    }

    setError(null);
    setRem(numValue);

    if (numValue !== initialRem) {
      router.push(`/devtools/convert/rem-to-px/${numValue}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (error) setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConvert();
    }
  };

  const generateRelatedConversions = () => {
    const increments = [-2, -1, 0.5, 1, 2];
    return increments
      .map((inc) => rem + inc)
      .filter((val) => val > 0 && val <= 1000);
  };

  const getUsageStats = () => {
    return {
      screens: {
        small: { rem: 1, px: convertRemToPx(1), context: "Paragraph text" },
        medium: { rem: 1.5, px: convertRemToPx(1.5), context: "Subheading" },
        large: { rem: 2, px: convertRemToPx(2), context: "Page title" },
      },
    };
  };

  return (
    <div className="mx-auto px-4 py-8 max-w-5xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-7xl font-bold mb-4">REM to PX Converter</h1>
        </div>

        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Convert REM to PX</CardTitle>
            <CardDescription>
              Enter any REM value to see the pixel equivalent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleConvert}>
              <div className="space-y-2">
                <Label htmlFor="rem-input">REM Value</Label>
                <div className="flex gap-2">
                  <Input
                    id="rem-input"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter REM value"
                    className="flex-1"
                    type="number"
                    step="0.01"
                    min="0"
                  />
                  <Button type="submit" variant="default">
                    Convert
                  </Button>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="max-w-5xl mx-auto">
          <CardHeader>
            <CardTitle>Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{rem} REM</div>
              <div className="text-2xl text-muted-foreground mt-2">equals</div>
              <div className="text-6xl font-bold text-primary">{px} PX</div>
              <div className="text-lg text-muted-foreground mt-2">
                (16px base font size)
              </div>
            </div>
            <div className="bg-background border rounded-lg max-h-96 overflow-auto">
              <div className="text-center">
                <div className="inline-block">
                  <div
                    style={{
                      fontSize: `${rem}rem`,
                      lineHeight: 1.4,
                    }}
                    className="text-foreground bg-muted px-4 py-2 rounded"
                  >
                    Sample Text - {rem} REM
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Usage Examples</CardTitle>
            <CardDescription>
              Popular REM values used in web development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {Object.entries(getUsageStats().screens).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <div className="font-medium capitalize">
                    {key} ({data.context})
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {data.rem} REM = {data.px} PX
                  </div>
                  <div
                    style={{ fontSize: `${data.rem}rem` }}
                    className="border rounded p-2 inline-block"
                  >
                    Example text
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Conversions</CardTitle>
            <CardDescription>Explore similar conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {generateRelatedConversions().map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/devtools/convert/rem-to-px/${val}`)
                  }
                >
                  {val} REM
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
