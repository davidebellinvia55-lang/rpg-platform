"use server";

import { revalidatePath } from "next/cache";

export type CreateCampaignState = {
  error: string;
  success: boolean;
};

export async function createCampaign(
  _previousState: CreateCampaignState,
  formData: FormData,
): Promise<CreateCampaignState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!name || name.length > 120 || description.length > 4000) {
    return {
      error: "Controlla il nome e la lunghezza della descrizione.",
      success: false,
    };
  }

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/campaigns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return {
        error: "Salvataggio non riuscito. Controlla il backend e riprova.",
        success: false,
      };
    }
  } catch {
    return {
      error: "Backend non raggiungibile.",
      success: false,
    };
  }

  revalidatePath("/");
  return { error: "", success: true };
}