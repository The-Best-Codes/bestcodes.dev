"use client";
import CopyButton from "@/components/global/copy-button";
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
import { AlertCircle, CheckCircle2, Eye, Search, Trash2 } from "lucide-react";
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

  const clearInput = () => {
    setInput("");
  };

  const detectedCharacters = extractDetectedCharacters(
    parsedTokens,
    renderTokens,
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Hidden Unicode Character Detector
          </CardTitle>
          <CardDescription>
            Detect and analyze hidden Unicode characters in your text.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Textarea
              className="min-h-24 font-mono text-sm resize-y pr-20"
              placeholder="Paste or type your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
            <div className="absolute top-2 right-2 flex gap-1">
              {input && (
                <>
                  <CopyButton text={input} />
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
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Characters: {input.length}</span>
              <span>Bytes: {new Blob([input]).size}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {input && (
        <Card>
          <CardContent>
            {stats.totalHidden === 0 ? (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                No hidden characters detected
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {stats.totalHidden} hidden character
                    {stats.totalHidden !== 1 ? "s" : ""} detected
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-200 dark:bg-amber-800 rounded"></div>
                      <span>Unicode</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-200 dark:bg-blue-800 rounded"></div>
                      <span>Variant</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-200 dark:bg-purple-800 rounded"></div>
                      <span>Sneaky</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-200 dark:bg-emerald-800 rounded"></div>
                      <span>Invisible</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {stats.unicodeTags > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs h-5 px-2 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
                    >
                      Unicode: {stats.unicodeTags}
                    </Badge>
                  )}
                  {stats.variantSelectors > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs h-5 px-2 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                    >
                      Variant: {stats.variantSelectors}
                    </Badge>
                  )}
                  {stats.sneakyBitChars > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs h-5 px-2 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800"
                    >
                      Sneaky: {stats.sneakyBitChars}
                    </Badge>
                  )}
                  {stats.invisibleOthers > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs h-5 px-2 bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
                    >
                      Invisible: {stats.invisibleOthers}
                    </Badge>
                  )}
                </div>

                {detectedCharacters.length > 0 && (
                  <div className="space-y-1">
                    {detectedCharacters.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center gap-2 p-2 rounded border bg-muted/20 text-xs overflow-auto"
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs h-4 px-1",
                            item.type === "unicodeTag" &&
                              "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300",
                            item.type === "variantSelector" &&
                              "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
                            item.type === "sneakyBits" &&
                              "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300",
                            item.type === "invisible" &&
                              "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
                          )}
                        >
                          {item.position}
                        </Badge>
                        <code className="font-mono text-xs bg-background border rounded px-1 py-0.5 flex-shrink-0">
                          {item.display}
                        </code>
                        <span className="text-muted-foreground truncate flex-1 min-w-0">
                          {item.name}
                        </span>
                        <CopyButton
                          text={item.originalChar}
                          className="h-5 w-5 flex-shrink-0"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {input && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              Text Preview with Highlights
            </CardTitle>
            <CardDescription className="text-sm">
              Hidden characters are highlighted. Hover for details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ScrollArea className="h-32 w-full">
                <div className="whitespace-pre-wrap break-words font-mono text-sm p-3 rounded border bg-muted/30 min-h-24 pr-10">
                  {parsedTokens.length > 0 ? renderTokens(parsedTokens) : input}
                </div>
              </ScrollArea>
              <div className="absolute top-2 right-2">
                <CopyButton text={input} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
