"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

const DiscordBotInvite = () => {
  const [discordBotId, setDiscordBotId] = useState("");

  return (
    <div className="not-prose w-full flex flex-row gap-2 justify-between items-center p-2 pr-1 py-1 border-primary border-1 rounded-md">
      <div className="flex flex-row justify-center items-center text-base overflow-x-auto">
        <span className="whitespace-nowrap">
          https://discord.com/oauth2/authorize?client_id=
        </span>
        <input
          type="text"
          className="field-sizing-content rounded-md text-primary"
          placeholder="Discord Bot ID"
          value={discordBotId}
          onChange={(event) => setDiscordBotId(event.target.value)}
        />
        <span className="whitespace-nowrap">&scope=bot</span>
      </div>
      <Button size="sm" disabled={discordBotId === ""}>
        <Link
          target="_blank"
          href={`https://discord.com/oauth2/authorize?client_id=${encodeURIComponent(discordBotId)}&scope=bot`}
        >
          Invite
        </Link>
      </Button>
    </div>
  );
};

export default DiscordBotInvite;
