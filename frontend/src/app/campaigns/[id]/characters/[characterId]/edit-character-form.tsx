"use client";

import { useActionState, useState } from "react";
import { updateCharacter } from "./actions";

type Character = {
  id: string;
  campaignId: string;
  name: string;
  biography: string;
};

export default function EditCharacterForm({
  character,
}: {
  character: Character;
}) {
  const [name, setName] = useState(character.name);
  const [biography, setBiography] = useState(character.biography);

  const action = updateCharacter.bind(
    null,
    character.campaignId,
    character.id,
  );

  const [state, formAction, pending] = useActionState(action, {
    error: "",
    success: false,
  });

  const hasChanges =
    name !== character.name || biography !== character.biography;

  return (
    <form action={formAction} className="space-y-4 rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Modifica personaggio</h2>

      <div>
        <label htmlFor="character-name" className="mb-1 block">
          Nome
        </label>
        <input
          id="character-name"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          maxLength={120}
          disabled={pending}
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
          value={biography}
          onChange={(event) => setBiography(event.target.value)}
          maxLength={8000}
          rows={6}
          disabled={pending}
          className="w-full rounded border bg-transparent p-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending || !hasChanges}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Salvataggio…" : "Salva modifiche"}
      </button>

      <div aria-live="polite">
        {state.error && <p className="text-red-500">{state.error}</p>}
        {state.success && (
          <p className="text-green-600">
            Ultimo salvataggio completato.
          </p>
        )}
        {hasChanges && !pending && <p>Hai modifiche non salvate.</p>}
      </div>
    </form>
  );
}