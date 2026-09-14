"use server";

import { revalidatePath } from "next/cache";

export type CharacterFormState = {
  error: string;
  success: boolean;
};

export async function createCharacter(
  campaignId: string,
  _previousState: CharacterFormState,
  formData: FormData,
): Promise<CharacterFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const biography = String(formData.get("biography") ?? "").trim();

  if (!name || name.length > 120 || biography.length > 8000) {
    return {
      error: "Inserisci un nome valido e una biografia entro 8000 caratteri.",
      success: false,
    };
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/campaigns/${encodeURIComponent(campaignId)}/characters`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, biography }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        error:
          response.status === 404
            ? "Campagna non trovata."
            : "Salvataggio non riuscito. Controlla il backend e riprova.",
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
  return { error: "", success: true };
}