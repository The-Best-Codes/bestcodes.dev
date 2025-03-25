import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dependencies, devDependencies, version } from "@/package.json";
import { Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-secondary border-t py-4">
      <div className="container mx-auto px-4 flex items-center justify-center gap-2">
        <p className="text-center text-secondary-foreground">
          &copy; {new Date().getFullYear()} BestCodes. All rights reserved.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-label="Site Information Button"
              variant="outline"
              size="icon"
            >
              <Info />
              <span className="sr-only">Site Information</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-full overflow-auto">
            <DialogHeader>
              <DialogTitle>Site Information</DialogTitle>
              <DialogDescription>
                Details about this website for developers.
              </DialogDescription>
            </DialogHeader>
            <ul className="space-y-2">
              <li>
                <strong>Site version:</strong> {version}
              </li>
              <li>
                <strong>Next.js version:</strong>{" "}
                {dependencies?.next || "Unknown"}
              </li>
              <li>
                <strong>React version:</strong>{" "}
                {dependencies?.react || "Unknown"}
              </li>
              <li>
                <strong>Node.js types:</strong>{" "}
                {devDependencies?.["@types/node"] || "Unknown"}
              </li>
            </ul>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
}
