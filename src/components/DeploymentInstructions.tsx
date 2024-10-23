import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { getScriptCode } from "../lib/getScriptCode";
import { useMemo } from "react";
import { useToast } from "../hooks/use-toast";

export const DeploymentInstructions: React.FC<{ agentId: string }> = ({
  agentId,
}) => {
  const { toast } = useToast();
  const scriptCode = useMemo(() => getScriptCode(agentId), [agentId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode);

    toast({
      title: "Copied to clipboard",
      description: "You can now paste it into your website.",
    });
  };

  return (
    <div className="space-y-4 w-full">
      <h3 className="font-semibold">Integration Steps:</h3>
      <ol className="list-decimal list-inside space-y-2">
        <li>Copy the following script tag:</li>
        <div className="bg-muted p-2 rounded-md flex justify-between items-center">
          <code className="text-sm text-black">{scriptCode}</code>
          <Button variant="ghost" size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 text-black" />
          </Button>
        </div>
        <li>Paste it into the {"<body>"} tag of your website.</li>
        <li>Save and deploy your changes.</li>
      </ol>
    </div>
  );
};
