import { permanentRedirect } from "next/navigation";

export default function CreateAgentPage() {
  permanentRedirect("/create-agent/identity");
}
