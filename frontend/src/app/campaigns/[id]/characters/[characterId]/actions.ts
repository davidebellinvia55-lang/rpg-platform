"use server";

import { revalidatePath } from "next/cache";

export type EditCharacterState = {
  error: string;
  success: boolean;
};

export async function updateCharacter(
  campaignId: string,
  characterId: string,
  _previousState: EditCharacterState,
  formData: FormData,
): Promise<EditCharacterState> {
  const name = String(formData.get("name") ?? "").trim();
  const biography = String(formData.get("biography") ?? "").trim();

  if (!name || name.length > 120) {
    return {
      error: "Il nome è obbligatorio e può avere al massimo 120 caratteri.",
      success: false,
    };
  }

  if (biography.length > 8000) {
    return {
      error: "La biografia può avere al massimo 8000 caratteri.",
      success: false,
    };
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/campaigns/${encodeURIComponent(campaignId)}/characters/${encodeURIComponent(characterId)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, biography }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        error:
          response.status === 404
            ? "Personaggio non trovato nella campagna."
            : "Salvataggio non riuscito. Riprova.",
        success: false,
      };
    }
  } catch {
    return {
      error: "Backend non raggiungibile.",
      success: false,
    };
  }

  revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath(`/campaigns/${campaignId}/characters/${characterId}`);

  return { error: "", success: true };
}