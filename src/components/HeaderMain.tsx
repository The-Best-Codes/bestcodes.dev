import Menu from "lucide-solid/icons/menu";
import X from "lucide-solid/icons/x";

const HeaderMain = () => {
  return (
    <header class="sticky top-0 z-50 w-full">
      <div class="bg-white/50 dark:bg-slate-900/50 backdrop-blur shadow-lg overflow-hidden">
        <div class="px-6">
          {/* Desktop Header */}
          <div class="hidden md:flex items-center justify-between h-16">
            <div class="flex items-center gap-4">
              <a href="/">
                <img
                  src="/image/best_codes_logo_low_res.png"
                  alt="logo"
                  class="w-8 h-8 rounded-md"
                  width="40"
                  height="40"
                />
              </a>
              <nav>
                <ul class="flex space-x-4">
                  <li>
                    <a
                      href="/"
                      class="text-black dark:text-white text-2xl hover:text-blue-500 hover:underline"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://dev.to/best_codes"
                      target="_blank"
                      rel="noreferrer"
                      class="text-black dark:text-white text-2xl hover:text-blue-500 hover:underline"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      class="text-black dark:text-white text-2xl hover:text-blue-500 hover:underline"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div class="flex items-center gap-4">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/the-best-codes"
              >
                <img
                  src="/image/icons/github.svg"
                  alt="github"
                  class="w-8 h-8 dark:invert"
                  width="40"
                  height="40"
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://dev.to/best_codes"
              >
                <img
                  src="/image/icons/devdotto.svg"
                  alt="dev.to"
                  class="w-8 h-8 dark:invert"
                  width="40"
                  height="40"
                />
              </a>
            </div>
          </div>

          {/* Mobile Header */}
          <details class="md:hidden marker:hidden group">
            <summary class="flex items-center justify-between h-16 cursor-pointer text-black dark:text-white">
              <div class="flex items-center gap-4">
                <a href="/">
                  <img
                    src="/image/best_codes_logo_low_res.png"
                    alt="logo"
                    class="w-8 h-8 rounded-md"
                    width="40"
                    height="40"
                  />
                </a>
                <span class="text-2xl">BestCodes</span>
              </div>
              <div class="flex items-center">
                <span class="menu-icon group-open:hidden">
                  <Menu class="w-8 h-8" />
                </span>
                <span class="x-icon hidden group-open:inline-block">
                  <X class="w-8 h-8" />
                </span>
              </div>
            </summary>

            {/* Mobile Menu: anchors as inline-block so they shrink to fit text */}
            <nav class="pb-4">
              <ul class="flex flex-col space-y-4">
                <li>
                  <a
                    href="/"
                    class="inline-block text-black dark:text-white text-2xl hover:text-blue-500 hover:underline"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="https://dev.to/best_codes"
                    target="_blank"
                    rel="noreferrer"
                    class="inline-block text-black dark:text-white text-2xl hover:text-blue-500 hover:underline"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    class="inline-block text-black dark:text-white text-2xl hover:text-blue-500 hover:underline"
                  >
                    Contact
                  </a>
                </li>
              </ul>
              <div class="mt-4 flex items-center gap-4">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/the-best-codes"
                >
                  <img
                    src="/image/icons/github.svg"
                    alt="github"
                    class="w-8 h-8 dark:invert"
                    width="40"
                    height="40"
                  />
                </a>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://dev.to/best_codes"
                >
                  <img
                    src="/image/icons/devdotto.svg"
                    alt="dev.to"
                    class="w-8 h-8 dark:invert"
                    width="40"
                    height="40"
                  />
                </a>
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
