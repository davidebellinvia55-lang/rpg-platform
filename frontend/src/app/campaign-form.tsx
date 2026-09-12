"use client";

import { useActionState } from "react";
import { createCampaign } from "./actions";

export default function CampaignForm() {
  const [state, formAction, pending] = useActionState(createCampaign, {
    error: "",
    success: false,
  });

  return (
    <form action={formAction} className="space-y-4 rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Nuova campagna</h2>

      <div>
        <label htmlFor="name" className="mb-1 block">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={120}
          className="w-full rounded border bg-transparent p-2"
          placeholder="Le cronache della Costa"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block">
          Descrizione
        </label>
        <textarea
          id="description"
          name="description"
          maxLength={4000}
          rows={3}
          className="w-full rounded border bg-transparent p-2"
        />
      </div>

      <p className="text-sm">Sistema: generico</p>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Salvataggio…" : "Crea campagna"}
      </button>

      <div aria-live="polite">
        {state.error && <p className="text-red-500">{state.error}</p>}
        {state.success && (
          <p className="text-green-600">Campagna creata.</p>
        )}
      </div>
    </form>
  );
}