import { Dashboard } from "@/components/Dashboard";
import { districts } from "@/lib/data";

export default function Home() {
  return <Dashboard districts={districts} />;
}
