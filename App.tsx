import { useState, useRef, useEffect } from "react";
import { Menu, Send, Paperclip, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "./utils/cn";
import { QuickActions } from "./QuickActions";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const MODELS = [
  { id: "gpt4", name: "GPT-4", description: "Most capable model" },
  { id: "gpt35", name: "GPT-3.5", description: "Fast & efficient" },
  { id: "claude", name: "Claude", description: "Anthropic model" },
];

export function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);

  // Handle mobile virtual keyboard - improved version
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        // Calculate keyboard height
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        const keyboardHeight = windowHeight - viewportHeight;
        
        // Set offset to keyboard height to keep input bar above keyboard
        setKeyboardOffset(keyboardHeight);

        // Scroll input bar into view when keyboard appears
        if (keyboardHeight > 0 && inputBarRef.current) {
          setTimeout(() => {
            inputBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }
    };

    // Initial check
    handleViewportChange();

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportChange);
      window.visualViewport.addEventListener("scroll", handleViewportChange);
    }

    // Also listen to window resize as fallback
    window.addEventListener("resize", handleViewportChange);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportChange);
        window.visualViewport.removeEventListener("scroll", handleViewportChange);
      }
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!isAtBottom) {
      setShowModelDropdown(false);
    }
  }, [isAtBottom]);

  const handleSend = async (text?: string) => {
    const messageContent = text || input.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "AI features are still under construction. Check back soon for the full experience.",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = () => {
    console.log("File upload clicked");
  };

  const handleScroll = () => {
    const container = messagesScrollRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(distanceFromBottom < 20);
  };

  const showQuickActions = messages.length === 0 && input.length === 0;

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#262626] text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/5"
          onClick={() => console.log("Menu clicked")}
        >
          <Menu className="h-5 w-5 text-white/60" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-white/80" />
          <span className="text-lg font-semibold tracking-tight">Annex</span>
        </div>

        <div className="h-10 w-10" />
      </header>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col overflow-hidden"
        style={{ paddingBottom: isAtBottom ? "8.5rem" : "5.5rem" }}
      >
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <h1 className="text-4xl md:text-5xl font-semibold text-center bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tight">
              How can I help you today?
            </h1>
            <p className="mt-4 text-white/40 text-sm text-center max-w-md">
              I can execute tasks, browse the web, analyze files, write code, and more
            </p>
          </div>
        ) : (
          <div
            ref={messagesScrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-5 py-3.5 text-base leading-relaxed whitespace-pre-wrap break-words",
                    message.role === "user"
                      ? "inline-block w-fit max-w-[75%] border border-white/30 text-white bg-transparent"
                      : "w-full bg-[#111] text-white/90 border border-white/30"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-full bg-[#111] border border-white/20 rounded-2xl px-5 py-4 flex items-center gap-2">
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Bar */}
      <div
        ref={inputBarRef}
        className="fixed left-0 right-0 z-20 px-4 pt-2 transition-all duration-150 ease-out"
        style={{ 
          bottom: `${keyboardOffset}px`,
          paddingBottom: keyboardOffset > 0 ? "0.5rem" : "max(1.5rem, env(safe-area-inset-bottom))",
          transform: 'translate3d(0, 0, 0)', // Force GPU acceleration for smoother positioning
          willChange: keyboardOffset > 0 ? 'bottom' : 'auto' // Optimize animation performance
        }}
      >
        <div className="mx-auto max-w-3xl">
          {showQuickActions && (
            <QuickActions onActionClick={(label) => handleSend(label)} />
          )}
          <div className="relative rounded-2xl border border-white/10 bg-[#222] backdrop-blur-xl">
            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Annex..."
              rows={1}
              className="w-full resize-none bg-transparent px-5 py-4 pr-14 text-white placeholder:text-white/25 focus:outline-none text-base"
            />

            {/* Send Button - Fixed positioning */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className={cn(
                "absolute right-3 flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                input.trim() && !isTyping
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              )}
              style={{ top: "13px" }}
            >
              <Send className="h-4 w-4" />
            </button>

            {/* Bottom Toolbar */}
            {isAtBottom && keyboardOffset === 0 && (
              <div className="flex items-center justify-between border-t border-white/5 px-3 py-2.5">
                <div className="flex items-center gap-1">
                  {/* File Upload */}
                  <button
                    onClick={handleFileUpload}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white/50"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>

                  {/* Model Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setShowModelDropdown(!showModelDropdown)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/30 transition-colors hover:bg-white/5 hover:text-white/50"
                    >
                      {selectedModel.name}
                      <ChevronDown className="h-3 w-3" />
                    </button>

                    {showModelDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowModelDropdown(false)}
                        />
                        <div className="absolute bottom-full left-0 mb-2 w-52 rounded-xl border border-white/10 bg-[#222] shadow-2xl z-50 overflow-hidden">
                          {MODELS.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model);
                                setShowModelDropdown(false);
                              }}
                              className={cn(
                                "flex w-full flex-col items-start px-4 py-3 text-left transition-colors hover:bg-white/5",
                                selectedModel.id === model.id && "bg-white/5"
                              )}
                            >
                              <span className="text-sm font-medium text-white/90">
                                {model.name}
                              </span>
                              <span className="text-xs text-white/40">
                                {model.description}
                              </span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <span className="text-xs text-white/20">
                  Annex can make mistakes
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
