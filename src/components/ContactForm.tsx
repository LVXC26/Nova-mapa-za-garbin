"use client";

import { useState } from "react";
import type { SiteContent } from "@/content/types";

export function ContactForm({ contact }: { contact: SiteContent["contact"] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Povpraševanje od ${name || "obiskovalca strani"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-border bg-surface p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          {contact.form.name}
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-foreground outline-none focus:border-cyan"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm text-muted">
          {contact.form.email}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border bg-black/20 px-3 py-2 text-foreground outline-none focus:border-cyan"
          />
        </label>
      </div>
      <label className="flex flex-col gap-1.5 text-sm text-muted">
        {contact.form.message}
        <textarea
          required
          rows={5}
          placeholder={contact.form.messagePlaceholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none rounded-lg border border-border bg-black/20 px-3 py-2 text-foreground outline-none focus:border-cyan"
        />
      </label>
      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition hover:opacity-85"
      >
        {contact.form.submit}
      </button>
      <p className="text-xs text-muted">{contact.form.note}</p>
    </form>
  );
}
