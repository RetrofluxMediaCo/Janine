export async function POST(request: Request) {
  try {
    const body = await request.json();

    const messages = body.messages ?? (
      body.message
        ? [{ role: "user", content: body.message }]
        : []
    );

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "No messages provided." },
        { status: 400 }
      );
    }

    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        messages: [
          {
            role: "system",
            content:
              "You are Janine, an AI writing partner specializing in storytelling. You help users develop stories, characters, plots, scenes, dialogue, themes, worldbuilding, and fictional worlds. Remember details from the conversation and use them when responding. Be creative, thoughtful, analytical, and honest. Do not blindly agree with the user.",
          },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      return Response.json(
        { error: "Janine could not be reached." },
        { status: 500 }
      );
    }

    const data = await ollamaResponse.json();

    return Response.json({
      response: data.message?.content ?? "Janine had nothing to say.",
    });
  } catch (error) {
    console.error("Janine API error:", error);

    return Response.json(
      { error: "Something went wrong connecting to Janine." },
      { status: 500 }
    );
  }
}