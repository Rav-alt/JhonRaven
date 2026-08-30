import HomeClient from "./HomeClient";
import { getContributions } from "@/lib/github";

// Server Component: fetch the real GitHub contribution calendar (revalidated
// hourly inside getContributions) and hand it to the client tree. The page
// stays statically prerendered; the token never reaches the browser.
export default async function Home() {
  const graph = await getContributions();
  return <HomeClient graph={graph} />;
}
