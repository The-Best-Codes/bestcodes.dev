import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import packageJson from "@/package.json";
import { Cookie, Info } from "lucide-react";

const { dependencies, devDependencies, version } = packageJson;

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full border-secondary border-t h-16 py-4"
    >
      <div className="container h-full mx-auto px-4 flex items-center justify-between sm:justify-center gap-2">
        <p className="text-left text-sm sm:text-base sm:text-center text-secondary-foreground flex flex-col sm:flex-row justify-center items-center gap-0 sm:gap-1">
          <span>&copy; {new Date().getFullYear()} BestCodes.</span>
          <span>All rights reserved.</span>
        </p>
        <div className="flex flex-row justify-center items-center gap-2">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button aria-label="Cookie Policy" variant="outline" size="icon">
                <Cookie />
                <span className="sr-only">Cookie Policy</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-full overflow-auto">
              <DialogHeader>
                <DialogTitle>Cookie Policy</DialogTitle>
                <DialogDescription>
                  Details about how we use cookies on this website.
                </DialogDescription>
              </DialogHeader>
              <ul className="space-y-2 list-disc p-4">
                <li>
                  <strong>Cookies are first-party,</strong> which means they are
                  set by the website itself and not by third-party services.
                </li>
                <li>
                  Cookies on this site are used to{" "}
                  <strong>
                    store your preferences, prevent spam, and save settings like
                    the site theme.
                  </strong>
                </li>
                <li>
                  Only a few pages on the site use cookies. Pages use local
                  storage when possible, which{" "}
                  <strong>does not leave your device.</strong>
                </li>
              </ul>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </footer>
  );
}
