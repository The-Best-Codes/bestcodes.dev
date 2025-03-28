"use client";
import { generateAndSetCSRFToken } from "@/app/actions";
import BCaptcha from "@/components/bcaptcha";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useBCaptchaToken from "@/hooks/useBcaptchaToken";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactFormClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const csrfInitialized = useRef<boolean>(false);
  const { bcaptchaToken } = useBCaptchaToken();

  useEffect(() => {
    if (csrfInitialized.current) return;
    async function fetchCSRFToken() {
      try {
        setIsLoading(true);
        const token = await generateAndSetCSRFToken();
        setCsrfToken(token);
        csrfInitialized.current = true;
      } catch (error) {
        console.error(`Error getting CSRF token: ${error}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCSRFToken();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          csrf_token: csrfToken,
          bcaptcha_token: bcaptchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setIsSuccess(true);
      form.reset();
      //setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      console.error("Submission Error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-5xl w-full bg-secondary border border-primary p-6 rounded-md">
      <h1 className="text-3xl font-semibold mb-4">Contact Me</h1>
      <p className="text-foreground mb-6">
        I&apos;d love to hear from you! Please fill out the form below to get in
        touch.
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-4 bg-background rounded-md"
        >
          {isSuccess && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Your message has been sent successfully!
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Name"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Email Address"
                    type="email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your message here..."
                    className="resize-none max-h-64 overflow-auto"
                    {...field}
                    disabled={isLoading}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <BCaptcha />

          <Button type="submit" disabled={isLoading || !bcaptchaToken}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Loading&hellip;
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
