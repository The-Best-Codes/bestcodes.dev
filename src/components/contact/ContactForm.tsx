import CheckCircle from "lucide-solid/icons/check-circle";
import Loader2 from "lucide-solid/icons/loader-2";
import {
  type Component,
  createEffect,
  createSignal,
  Match,
  Show,
  Switch,
} from "solid-js";
import Turnstile from "solid-turnstile";

interface FormError {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: Component = () => {
  const [errors, setErrors] = createSignal<FormError>({});
  const [formMessage, setFormMessage] = createSignal<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [turnstileToken, setTurnstileToken] = createSignal<string | null>(null);
  const [turnstileLoaded, setTurnstileLoaded] = createSignal(false);
  const [showTurnstile, setShowTurnstile] = createSignal(false);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSuccess, setIsSuccess] = createSignal(false);

  createEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hostname !== "localhost") {
        setShowTurnstile(true);
      }
    }
  });

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    if (!turnstileToken()) {
      setFormMessage({
        text: "Please complete the Turnstile verification.",
        type: "error",
      });
      return;
    }

    formData.append("turnstileResponse", turnstileToken()!);
    setErrors({});
    setFormMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        form.reset();
        setTurnstileToken(null);
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        if (
          response.status === 400 &&
          errorData &&
          typeof errorData === "object"
        ) {
          setErrors(errorData);
        } else {
          setFormMessage({
            text: "An error occurred, please try again.",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error sending the form: ", error);
      setFormMessage({
        text: "An unexpected error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="max-w-lg container bg-gray-100 dark:bg-gray-700 p-4 m-2 sm:p-6 sm:m-0 rounded-2xl">
      <Switch>
        <Match when={isSuccess()}>
          <div class="flex flex-col items-center justify-center">
            <CheckCircle
              class="text-green-500 w-20 h-20 mb-4"
              aria-label="Success"
            />
            <h1 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">
              Your message has been sent!
            </h1>
            <a
              href="/"
              role="button"
              aria-label="Link to homepage"
              class="bg-blue-500 flex justify-center items-center text-center cursor-pointer text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 w-full max-w-xs"
            >
              Go Home
            </a>
          </div>
        </Match>
        <Match when={!isSuccess()}>
          <>
            <h1 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
              Contact Me
            </h1>
            <form
              id="contact-form"
              class="space-y-4"
              method="post"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  for="name"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring focus:ring-opacity-50 focus:border-indigo-500 focus:ring-indigo-500 aria-invalid:border-red-500 aria-invalid:ring-red-500 aria-invalid:focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                  aria-required="true"
                  aria-invalid={!!errors().name}
                />
                {errors().name && (
                  <p class="mt-1 text-sm text-red-500" role="alert">
                    {errors().name}
                  </p>
                )}
              </div>

              <div>
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring focus:ring-opacity-50 focus:border-indigo-500 focus:ring-indigo-500 aria-invalid:border-red-500 aria-invalid:ring-red-500 aria-invalid:focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                  aria-required="true"
                  aria-invalid={!!errors().email}
                />
                {errors().email && (
                  <p class="mt-1 text-sm text-red-500" role="alert">
                    {errors().email}
                  </p>
                )}
              </div>

              <div>
                <label
                  for="message"
                  class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  class="mt-1 block w-full min-h-8 max-h-96 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring focus:ring-opacity-50 focus:border-indigo-500 focus:ring-indigo-500 aria-invalid:border-red-500 aria-invalid:ring-red-500 aria-invalid:focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  required
                  aria-required="true"
                  aria-invalid={!!errors().message}
                />
                {errors().message && (
                  <p class="mt-1 text-sm text-red-500" role="alert">
                    {errors().message}
                  </p>
                )}
              </div>

              <div>
                {showTurnstile() ? (
                  <>
                    <Turnstile
                      sitekey="0x4AAAAAAAfgP80mkF0iiKza"
                      onVerify={setTurnstileToken}
                      onLoad={() => {
                        console.log("Turnstile loaded");
                        setTurnstileLoaded(true);
                      }}
                      onError={(error) =>
                        console.error("Turnstile error: ", error)
                      }
                      theme="auto"
                    />
                    {turnstileLoaded() === false && (
                      <p class="mt-1 text-sm text-gray-800 dark:text-gray-200">
                        Loading Turnstile verification...
                      </p>
                    )}
                  </>
                ) : (
                  <div class="w-72 h-16 bg-gray-300 dark:bg-gray-800 text-black dark:text-white rounded-lg flex justify-center items-center">
                    Turnstile is disabled in development.
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  class="bg-blue-500 cursor-pointer text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 w-full disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  disabled={isSubmitting()}
                >
                  <Show when={isSubmitting()}>
                    <Loader2 class="h-5 w-5 animate-spin" />
                  </Show>
                  <span>Send Message</span>
                </button>
              </div>
            </form>

            <Show when={formMessage()}>
              <div
                class={`mt-4 text-center ${
                  formMessage()?.type === "success"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
                role="alert"
              >
                {formMessage()?.text}
              </div>
            </Show>
          </>
        </Match>
      </Switch>
    </div>
  );
};

export default ContactForm;
