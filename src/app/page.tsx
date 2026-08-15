"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const [conversation, setConversation] = useState<Message[]>([]);

  async function askJanine() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    const updatedConversation: Message[] = [
      ...conversation,
      {
        role: "user",
        content: userMessage,
      },
    ];

    setLoading(true);
    setResponse("");
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedConversation,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setResponse(`Error: ${data.error}`);
        return;
      }

      setResponse(data.response);

      setConversation([
        ...updatedConversation,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error(error);
      setResponse("I couldn't connect to Janine.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900 p-4 md:flex">
        <div className="mb-8">
          <h1 className="text-xl font-semibold">Janine</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Your AI writing partner.
          </p>
        </div>

        <button className="mb-4 rounded-lg border border-zinc-700 px-4 py-2 text-left text-sm hover:bg-zinc-800">
          + New conversation
        </button>

        <div className="space-y-2 text-sm text-zinc-400">
          <p className="px-2 py-1 text-xs uppercase tracking-wider text-zinc-600">
            Workspace
          </p>

          <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-zinc-800">
            Conversations
          </button>

          <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-zinc-800">
            Projects
          </button>

          <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-zinc-800">
            Characters
          </button>

          <button className="w-full rounded-lg px-3 py-2 text-left hover:bg-zinc-800">
            Story Bible
          </button>
        </div>
      </aside>

      {/* Main area */}
      <section className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
          <div>
            <h2 className="font-medium">New thought</h2>

            <p className="text-xs text-zinc-500">
              Explore your story, characters, or ideas.
            </p>
          </div>

          <button className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800">
            Challenge mode
          </button>
        </header>

        <div className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-2xl">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-semibold tracking-tight">
                What are you writing?
              </h3>

              <p className="mt-3 text-zinc-500">
                Tell Janine about your story, character, scene, or idea.
              </p>
            </div>

            {/* Conversation */}
            {conversation.length > 0 && (
              <div className="mb-6 space-y-4">
                {conversation.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                  >
                    <p className="mb-2 text-xs uppercase tracking-wider text-zinc-600">
                      {item.role === "user" ? "You" : "Janine"}
                    </p>

                    <p className="whitespace-pre-wrap leading-7 text-zinc-300">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-3 shadow-xl">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    askJanine();
                  }
                }}
                placeholder="Tell Janine what's on your mind..."
                className="min-h-28 w-full resize-none bg-transparent p-3 text-white outline-none placeholder:text-zinc-600"
              />

              <div className="flex items-center justify-between border-t border-zinc-800 pt-3">
                <span className="text-xs text-zinc-600">
                  Shift + Enter for a new line
                </span>

                <button
                  disabled={!message.trim() || loading}
                  onClick={askJanine}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {loading ? "Thinking..." : "Think →"}
                </button>
              </div>
            </div>

            {/* Suggested prompts */}
            {conversation.length === 0 && (
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                <button
                  onClick={() =>
                    setMessage("Help me brainstorm a story idea.")
                  }
                  className="rounded-xl border border-zinc-800 p-3 text-left text-sm text-zinc-400 hover:bg-zinc-900"
                >
                  Brainstorm an idea
                </button>

                <button
                  onClick={() =>
                    setMessage("Help me develop a compelling character.")
                  }
                  className="rounded-xl border border-zinc-800 p-3 text-left text-sm text-zinc-400 hover:bg-zinc-900"
                >
                  Develop a character
                </button>

                <button
                  onClick={() =>
                    setMessage("Help me figure out what's wrong with my plot.")
                  }
                  className="rounded-xl border border-zinc-800 p-3 text-left text-sm text-zinc-400 hover:bg-zinc-900"
                >
                  Fix my plot
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}