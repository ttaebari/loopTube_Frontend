import { CircleUserRound, Settings } from "lucide-react";
import { Button } from "../common/Button";

export function Header() {
  return (
    <header className="border-b border-white/10 bg-loop-bg/95">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-loop-primary">
            <span className="text-sm font-black text-white">LT</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">LoopTube</h1>
            <p className="text-xs text-loop-muted">YouTube loop playlist</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button aria-label="설정" size="icon" variant="ghost">
            <Settings size={18} />
          </Button>
          <Button aria-label="로그인" size="icon" variant="ghost">
            <CircleUserRound size={19} />
          </Button>
        </div>
      </div>
    </header>
  );
}
