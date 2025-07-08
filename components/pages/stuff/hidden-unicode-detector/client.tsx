"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Eye,
  FileText,
  Search,
  Trash2,
} from "lucide-react";
import * as React from "react";

import { parseText } from "./parser";
import { renderTokens } from "./renderer";
import { CategoryCounts, Token } from "./types";
import { calculateStats, extractDetectedCharacters } from "./utils";

export default function HiddenUnicodeDetector() {
  const [input, setInput] = React.useState("");
  const [parsedTokens, setParsedTokens] = React.useState<Token[]>([]);
  const [stats, setStats] = React.useState<CategoryCounts>({
    totalHidden: 0,
    unicodeTags: 0,
    variantSelectors: 0,
    sneakyBitChars: 0,
    sneakyBitBytes: 0,
    invisibleOthers: 0,
  });

  React.useEffect(() => {
    if (input) {
      const { tokens } = parseText(input);
      setParsedTokens(tokens);
      setStats(calculateStats(tokens));
    } else {
      setParsedTokens([]);
      setStats({
        totalHidden: 0,
        unicodeTags: 0,
        variantSelectors: 0,
        sneakyBitChars: 0,
        sneakyBitBytes: 0,
        invisibleOthers: 0,
      });
    }
  }, [input]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const clearInput = () => {
    setInput("");
  };

  const detectedCharacters = extractDetectedCharacters(
    parsedTokens,
    renderTokens,
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Hidden Unicode Character Detector
          </CardTitle>
          <CardDescription>
            Detect and analyze hidden Unicode characters, zero-width spaces,
            directional marks, and other invisible characters in your text.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-4 w-4" />
            Input Text
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              className="min-h-32 font-mono text-sm resize-y"
              placeholder="Paste or type your text here to analyze for hidden Unicode characters..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              {input && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(input)}
                    className="h-7 w-7 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearInput}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
          {input && (
            <div className="text-sm text-muted-foreground">
              Character count: {input.length} | Byte length:{" "}
              {new Blob([input]).size}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Detection Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {stats.totalHidden === 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              Detection Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalHidden === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                No hidden Unicode characters detected
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-4 w-4" />
                  {stats.totalHidden} hidden character
                  {stats.totalHidden !== 1 ? "s" : ""} detected
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {stats.unicodeTags > 0 && (
                    <Badge variant="outline" className="justify-between">
                      Unicode Tags
                      <span className="ml-2 bg-amber-100 dark:bg-amber-900 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded text-xs">
                        {stats.unicodeTags}
                      </span>
                    </Badge>
                  )}
                  {stats.variantSelectors > 0 && (
                    <Badge variant="outline" className="justify-between">
                      Variant Selectors
                      <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-1.5 py-0.5 rounded text-xs">
                        {stats.variantSelectors}
                      </span>
                    </Badge>
                  )}
                  {stats.sneakyBitChars > 0 && (
                    <Badge variant="outline" className="justify-between">
                      Sneaky Bits
                      <span className="ml-2 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 px-1.5 py-0.5 rounded text-xs">
                        {stats.sneakyBitChars}
                      </span>
                    </Badge>
                  )}
                  {stats.invisibleOthers > 0 && (
                    <Badge variant="outline" className="justify-between">
                      Invisible Chars
                      <span className="ml-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-1.5 py-0.5 rounded text-xs">
                        {stats.invisibleOthers}
                      </span>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Character Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-4 w-4" />
              Character Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {detectedCharacters.length === 0 ? (
              <div className="text-muted-foreground text-sm">
                No hidden characters to display
              </div>
            ) : (
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {detectedCharacters.map((item) => (
                    <div
                      key={item.key}
                      className="space-y-2 p-3 rounded-lg border bg-muted/30"
                    >
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            item.type === "unicodeTag" &&
                              "border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
                            item.type === "variantSelector" &&
                              "border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
                            item.type === "sneakyBits" &&
                              "border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
                            item.type === "invisible" &&
                              "border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
                          )}
                        >
                          Position {item.position}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(item.originalChar)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="font-mono text-xs bg-background border rounded px-2 py-1 break-all">
                          {item.display}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      {input && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="h-4 w-4" />
              Text Preview with Highlights
            </CardTitle>
            <CardDescription>
              Hidden characters are highlighted with colored backgrounds. Hover
              over them for details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ScrollArea className="h-48 w-full">
                <div className="whitespace-pre-wrap break-words font-mono text-sm p-4 rounded-lg border bg-muted/30 min-h-32">
                  {parsedTokens.length > 0 ? renderTokens(parsedTokens) : input}
                </div>
              </ScrollArea>
              <div className="absolute top-2 right-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(input)}
                  className="h-7 w-7 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Color Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded"></div>
              <span className="text-sm">Unicode Tags</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded"></div>
              <span className="text-sm">Variant Selectors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded"></div>
              <span className="text-sm">Sneaky Bits</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded"></div>
              <span className="text-sm">Invisible Characters</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
