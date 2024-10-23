import { env } from "../env";

export const getScriptCode = (agentID: string) => {
    const scriptCode = `<script src="${env.NEXT_PUBLIC_WIDGET_SCRIPT_URL}" data-agent-id="${agentID}"></script>`;

    return scriptCode;

}