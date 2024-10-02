import { CreditCard, PlusCircle, Users, Zap } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export const Sidebar = () => {
  return (
    <div className="w-64 bg-zinc-900 p-4 flex flex-col">
      <div className="mb-8">
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 text-white"
          fill="currentColor"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
      </div>
      <nav className="space-y-2 flex-1">
        <Link href="/create-agent" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Agent
          </Button>
        </Link>

        <Link href="/actions" passHref>
          <Button variant="ghost" className="w-full justify-start bg-zinc-800">
            <Zap className="mr-2 h-4 w-4" />
            Actions
          </Button>
        </Link>
        <Link href="/billing" passHref>
          <Button variant="ghost" className="w-full justify-start">
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
        </Link>
      </nav>
      <UserButton />
    </div>
  );
};
