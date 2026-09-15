import Link from "next/link";
import { notFound } from "next/navigation";
import EditCharacterForm from "./edit-character-form";  

type Character = {
  id: string;
  campaignId: string;
  name: string;
  biography: string;
};

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string; characterId: string }>;
}) {
  const { id, characterId } = await params;

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/campaigns/${encodeURIComponent(id)}/characters/${encodeURIComponent(characterId)}`,
    { cache: "no-store" },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Impossibile caricare il personaggio.");
  }

  const character: Character = await response.json();

  return (
    <main className="mx-auto min-h-screen max-w-3xl space-y-8 p-8">
      <Link
        href={`/campaigns/${id}`}
        className="text-blue-500 underline"
      >
        ← Torna alla campagna
      </Link>

      <header>
        <h1 className="text-3xl font-bold">{character.name}</h1>
      </header>

      <EditCharacterForm key={character.id} character={character} />
    </main>
  );
}