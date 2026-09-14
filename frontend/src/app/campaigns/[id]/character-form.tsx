"use client";

import { useActionState } from "react";
import { createCharacter } from "./actions";

export default function CharacterForm({
  campaignId,
}: {
  campaignId: string;
}) {
  const action = createCharacter.bind(null, campaignId);

  const [state, formAction, pending] = useActionState(action, {
    error: "",
    success: false,
  });

  return (
    <form action={formAction} className="space-y-4 rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Nuovo personaggio</h2>

      <div>
        <label htmlFor="character-name" className="mb-1 block">
          Nome
        </label>
        <input
          id="character-name"
          name="name"
          required
          maxLength={120}
          placeholder="Il nome del personaggio"
          className="w-full rounded border bg-transparent p-2"
        />
      </div>

      <div>
        <label htmlFor="character-biography" className="mb-1 block">
          Biografia
        </label>
        <textarea
          id="character-biography"
          name="biography"
          maxLength={8000}
          rows={4}
          placeholder="Storia, aspetto e personalità"
          className="w-full rounded border bg-transparent p-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Salvataggio…" : "Crea personaggio"}
      </button>

      <div aria-live="polite">
        {state.error && <p className="text-red-500">{state.error}</p>}
        {state.success && (
          <p className="text-green-600">Personaggio creato.</p>
        )}
      </div>
    </form>
  );
}