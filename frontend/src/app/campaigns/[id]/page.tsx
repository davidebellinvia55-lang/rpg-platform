import Link from "next/link";
import { notFound } from "next/navigation";
import CharacterForm from "./character-form";

type Campaign = {
  id: string;
  name: string;
  description: string;
  systemId: string;
  systemVersion: string;
};

type Character = {
  id: string;
  campaignId: string;
  name: string;
  biography: string;
};

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaignUrl =
    `${process.env.API_BASE_URL}/api/campaigns/${encodeURIComponent(id)}`;

  const response = await fetch(campaignUrl, {
    cache: "no-store",
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Impossibile caricare la campagna.");
  }

  const campaign: Campaign = await response.json();

  let characters: Character[] = [];
  let charactersError = false;

  try {
    const charactersResponse = await fetch(
      `${campaignUrl}/characters`,
      { cache: "no-store" },
    );

    if (!charactersResponse.ok) {
      throw new Error("Caricamento personaggi fallito.");
    }

    characters = await charactersResponse.json();
  } catch {
    charactersError = true;
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-8 p-8">
      <Link href="/" className="text-blue-500 underline">
        ← Le mie campagne
      </Link>

      <header>
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
        <p className="mt-3 whitespace-pre-wrap">
          {campaign.description || "Nessuna descrizione."}
        </p>
        <p className="mt-3 text-sm">
          Sistema: {campaign.systemId} · versione {campaign.systemVersion}
        </p>
      </header>

      <CharacterForm campaignId={campaign.id} />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Personaggi</h2>

        {charactersError ? (
          <p role="alert">
            Impossibile caricare i personaggi. Riprova ricaricando la pagina.
          </p>
        ) : characters.length === 0 ? (
          <p>Questa campagna non ha ancora personaggi.</p>
        ) : (
          <ul className="space-y-4">
            {characters.map((character) => (
              <li key={character.id} className="rounded-xl border p-5">
                <h3 className="text-lg font-semibold">
                  <Link
                    href={`/campaigns/${campaign.id}/characters/${character.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {character.name}
                  </Link>
                </h3>
                <p className="mt-2 whitespace-pre-wrap">
                  {character.biography || "Nessuna biografia."}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}