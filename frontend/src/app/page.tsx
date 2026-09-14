import Link from "next/link";
import CampaignForm from "./campaign-form";

type Campaign = {
  id: string;
  name: string;
  description: string;
  systemId: string;
  systemVersion: string;
};

export default async function Home() {
  let campaigns: Campaign[] = [];
  let loadError = false;

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/campaigns`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error("Caricamento fallito");
    }

    campaigns = await response.json();
  } catch {
    loadError = true;
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-8 p-8">
      <header>
        <h1 className="text-3xl font-bold">Le mie campagne</h1>
        <p className="mt-2">Crea e consulta le tue avventure.</p>
      </header>

      <CampaignForm />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Campagne create</h2>

        {loadError ? (
          <p role="alert">
            Impossibile caricare le campagne. Verifica che il backend
            sia avviato.
          </p>
        ) : campaigns.length === 0 ? (
          <p>Non hai ancora creato una campagna.</p>
        ) : (
          <ul className="space-y-4">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="rounded-xl border p-5">
                <h3 className="text-lg font-semibold">
                  <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                    {campaign.name}
                  </Link>
                </h3>
                <p className="mt-2 whitespace-pre-wrap">
                  {campaign.description || "Nessuna descrizione."}
                </p>
                <p className="mt-3 text-sm">
                  Sistema: {campaign.systemId} · versione{" "}
                  {campaign.systemVersion}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
