import { Fragment, ReactNode, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  { role: "assistant", content: "Hi! I'm Musote AI. How can I help you manage your subscriptions today?" },
];

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-flash"] as const;
const PRIMARY_GEMINI_MODEL = GEMINI_MODELS[0];

const SYSTEM_PROMPT = `You are Musote AI, a helpful assistant for a subscription tracking application. You help users manage their subscriptions, understand their spending, and provide tips on saving money. Keep responses concise and friendly. You can help with:
- Subscription management advice
- Budget optimization tips
- Explaining features of Musote
- General financial advice related to subscriptions
- Answering questions about the app`;

function getGeminiErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Sorry, something went wrong. Please try again.";
  }

  const message = error.message;

  if (/quota|resource_exhausted|429/i.test(message)) {
    return "Gemini is connected, but this model has no available quota right now. Try again shortly or switch to a key with more quota.";
  }

  if (/api key|api_key_invalid|permission/i.test(message)) {
    return "Gemini rejected the API key. Double-check the key and make sure the Generative Language API is enabled for this project.";
  }

  return `Gemini error: ${message}`;
}

async function generateGeminiResponse(contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>) {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing Gemini API key");
  }

  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    }

    let errorMessage = `API error: ${res.status}`;

    try {
      const errorData = await res.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      const errorText = await res.text();
      if (errorText) errorMessage = `${errorMessage} ${errorText}`;
    }

    lastError = new Error(errorMessage);

    if (!/quota|resource_exhausted|429/i.test(errorMessage)) {
      throw lastError;
    }
  }

  throw lastError ?? new Error("No Gemini models were available.");
}

function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={index} className="rounded bg-black/10 px-1.5 py-0.5 font-mono text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

function renderMarkdownText(text: string, keyPrefix: string): ReactNode {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushList = (index: number) => {
    if (!listType || listItems.length === 0) return;

    if (listType === "ul") {
      blocks.push(
        <ul key={`${keyPrefix}-ul-${index}`} className="list-disc space-y-1 pl-5">
          {listItems.map((item, itemIndex) => (
            <li key={`${keyPrefix}-ul-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
    } else {
      blocks.push(
        <ol key={`${keyPrefix}-ol-${index}`} className="list-decimal space-y-1 pl-5">
          {listItems.map((item, itemIndex) => (
            <li key={`${keyPrefix}-ol-item-${itemIndex}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ol>,
      );
    }

    listType = null;
    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);

    if (unorderedMatch) {
      if (listType !== "ul") flushList(index);
      listType = "ul";
      listItems.push(unorderedMatch[1]);
      return;
    }

    if (orderedMatch) {
      if (listType !== "ol") flushList(index);
      listType = "ol";
      listItems.push(orderedMatch[1]);
      return;
    }

    flushList(index);

    if (!trimmed) {
      blocks.push(<div key={`${keyPrefix}-space-${index}`} className="h-2" />);
      return;
    }

    blocks.push(
      <p key={`${keyPrefix}-p-${index}`} className="whitespace-pre-wrap">
        {renderInlineMarkdown(line)}
      </p>,
    );
  });

  flushList(lines.length);

  return <div className="space-y-2">{blocks}</div>;
}

function renderMessageContent(text: string) {
  const segments = text.split(/```([\s\S]*?)```/g);

  return (
    <div className="space-y-2">
      {segments.map((segment, index) => {
        if (index % 2 === 1) {
          return (
            <pre key={`code-${index}`} className="overflow-x-auto rounded-lg bg-black/10 p-3 text-xs">
              <code>{segment.trim()}</code>
            </pre>
          );
        }

        if (!segment.trim()) {
          return null;
        }

        return <Fragment key={`text-${index}`}>{renderMarkdownText(segment, `segment-${index}`)}</Fragment>;
      })}
    </div>
  );
}

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    if (!GEMINI_API_KEY) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Gemini is not configured yet. Add `VITE_GEMINI_API_KEY` to your local environment and try again." },
      ]);
      return;
    }

    setLoading(true);

    try {
      const contents = newMessages.map(message => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }],
      }));
      const text = await generateGeminiResponse(contents);
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch (err) {
      console.error("Gemini API error:", err);
      setMessages(prev => [...prev, { role: "assistant", content: getGeminiErrorMessage(err) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setOpen(true)}
              className="h-14 w-14 rounded-full gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">Musote AI</p>
                  <p className="text-xs text-muted-foreground">Powered by {PRIMARY_GEMINI_MODEL}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-muted text-card-foreground rounded-bl-md"
                      }`}
                    >
                      {renderMessageContent(msg.content)}
                    </div>
                    {msg.role === "user" && (
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-2 items-center">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-md px-3.5 py-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-border">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 text-sm"
                  disabled={loading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim()}
                  className="gradient-primary text-primary-foreground shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
