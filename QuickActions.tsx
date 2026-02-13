import { Code, Presentation, Search, Laugh, GraduationCap, Gamepad2 } from "lucide-react";
import { cn } from "./utils/cn";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  sendText?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "code", label: "Code", icon: <Code className="h-4 w-4" /> },
  { id: "slides", label: "Create slides", icon: <Presentation className="h-4 w-4" /> },
  { id: "research", label: "Deep research", icon: <Search className="h-4 w-4" /> },
  { id: "joke", label: "Tell me a joke", icon: <Laugh className="h-4 w-4" />, sendText: "Tell me a joke" },
  { id: "learn", label: "Learn something", icon: <GraduationCap className="h-4 w-4" />, sendText: "Help me learn something" },
  { id: "game", label: "Play a game", icon: <Gamepad2 className="h-4 w-4" /> },
];

interface QuickActionsProps {
  onActionClick: (text: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-3">
      <div className="flex gap-2 px-1 min-w-max">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onActionClick(action.sendText || action.label)}
            className={cn(
              "flex items-center gap-2 rounded-full border border-white/10 bg-[#222] px-4 py-2 text-sm font-medium text-white/60 transition-all hover:bg-white/5 hover:text-white/90 active:scale-95"
            )}
          >
            <span className="text-white/40">{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
