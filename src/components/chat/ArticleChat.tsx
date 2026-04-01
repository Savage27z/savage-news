"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ArticleChatProps {
  articleId: string;
  articleTitle: string;
  articleContent: string;
  articleSources: { name: string; url: string }[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What are the key implications?",
  "Explain this in simpler terms",
  "What are the counterarguments?",
  "What should I know about the background?",
];

export function ArticleChat({
  articleId,
  articleTitle,
  articleContent,
  articleSources,
}: ArticleChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: content.trim(),
      };

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setIsLoading(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const allMessages = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: content.trim() },
        ];

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            articleId,
            messages: allMessages,
            articleTitle,
            articleContent: articleContent.slice(0, 8000),
            articleSources,
          }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Chat request failed");
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: accumulated,
            };
            return updated;
          });
        }
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: "Sorry, I encountered an error. Please try again.",
          };
          return updated;
        });
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [messages, isLoading, articleId, articleTitle, articleContent, articleSources]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
        aria-label="Ask about this article"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-medium">Ask about this article</span>
      </button>

      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          isOpen
            ? "inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-[420px] md:h-[600px] md:max-h-[80vh]"
            : "bottom-6 right-6 w-0 h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex flex-col h-full bg-background border border-border md:rounded-2xl shadow-2xl overflow-hidden transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="font-serif font-semibold text-sm">Article Q&A</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <Sparkles className="h-8 w-8 text-accent mx-auto mb-3 opacity-60" />
                  <p className="text-sm text-muted-foreground">
                    Ask anything about this article. I&apos;ll help you understand the key points.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Suggested questions
                  </p>
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left px-3 py-2.5 text-sm rounded-lg border border-border hover:bg-muted hover:border-accent/30 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-accent text-accent-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  {m.role === "assistant" ? (
                    m.content ? (
                      <div className="prose prose-sm max-w-none [&>p]:my-1.5 [&>ul]:my-1.5 [&>ol]:my-1.5">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex gap-1.5 py-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
                      </div>
                    )
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-border px-4 py-3 bg-card">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-muted rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 ring-accent/30 placeholder:text-muted-foreground/60"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground/50">
              Powered by Claude
            </p>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
