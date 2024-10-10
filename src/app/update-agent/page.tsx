import { permanentRedirect } from "next/navigation";

export default function UpdateAgentPage() {
  return permanentRedirect("/update-agent/identity");
}
