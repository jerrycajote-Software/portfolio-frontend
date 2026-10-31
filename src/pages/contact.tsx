import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, CONTACT_LIMITS, type ContactInput } from "@/lib/contact";

type Status = { kind: "idle" } | { kind: "success" } | { kind: "error"; text: string };

export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus({ kind: "idle" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset();
        setStatus({ kind: "success" });
        return;
      }

      const retry = res.headers.get("Retry-After");
      setStatus({
        kind: "error",
        text:
          res.status === 429
            ? `Too many messages. Please try again in ${Math.ceil(Number(retry ?? 600) / 60)} minute(s).`
            : res.status === 400
              ? "Please check the form and try again."
              : "Sorry, something went wrong on our side. Please try again later.",
      });
    } catch {
      setStatus({ kind: "error", text: "Network error. Please check your connection and try again." });
    }
  };

  return (
    <>
      <Head>
        <title>Contact – Jerry Cajote</title>
      </Head>
      <Header />
      <main className="max-w-xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Contact Me</h1>

        {status.kind === "success" && (
          <div role="status" className="mb-4 p-3 bg-green-100 text-green-800 rounded">
            Message sent successfully! I&apos;ll get back to you soon.
          </div>
        )}
        {status.kind === "error" && (
          <div role="alert" className="mb-4 p-3 bg-red-100 text-red-800 rounded">
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Honeypot: invisible to people and screen readers, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              autoComplete="name"
              maxLength={CONTACT_LIMITS.name}
              aria-invalid={!!errors.name}
              {...register("name")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              maxLength={CONTACT_LIMITS.email}
              aria-invalid={!!errors.email}
              {...register("email")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              maxLength={CONTACT_LIMITS.message}
              aria-invalid={!!errors.message}
              {...register("message")}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
