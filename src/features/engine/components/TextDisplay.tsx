
import React, { useEffect, useRef, useMemo } from 'react';
import { CornerDownLeft } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface TextDisplayProps {
  text: string;      // The target text
  typedText: string; // What the user has typed so far
  cursorIndex: number;
  ghostCursorIndex?: number;
}

export const TextDisplay: React.FC<TextDisplayProps> = ({ text, typedText, cursorIndex, ghostCursorIndex = -1 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  // Group text into tokens (words + separators) to prevent word-splitting
  // We split by spaces and newlines but keep them to render logic
  const tokens = useMemo(() => {
    // Regex splits by space or newline, capturing the delimiter
    const rawTokens = text.split(/([ \n]+)/);
    let charCount = 0;

    return rawTokens.map((token, _i) => {
      const startIndex = charCount;
      charCount += token.length;
      return {
        content: token,
        startIndex,
        isNewline: token.includes('\n'),
      };
    }).filter(t => t.content.length > 0);
  }, [text]);

  // Auto-scroll logic: Keep active line at the top
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const cursorEl = activeCharRef.current;

      // We want the cursor's line to be roughly at the top (e.g., 40px down)
      // offsetTop is relative to the offsetParent (the container if positioned)
      const relativeTop = cursorEl.offsetTop;

      container.scrollTo({
        top: relativeTop - 40, // 40px padding from top
        behavior: 'smooth'
      });
    }
  }, [cursorIndex]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-hidden px-4 md:px-12 py-8 select-none relative"
      style={{ maxHeight: '400px' }}
      onClick={() => window.focus()}
    >
      <div className="text-3xl md:text-4xl leading-relaxed font-mono whitespace-pre-wrap">
        {tokens.map((token, tokenIdx) => {
          // If the token contains a newline, we must use 'inline' display so the <br/> 
          // inside it breaks the flow of the parent container. 
          // Words (no newlines) use 'inline-block' to prevent splitting across lines.
          return (
            <span key={tokenIdx} className={token.isNewline ? "inline" : "inline-block"}>
              {token.content.split('').map((char, charOffset) => {
                const absIndex = token.startIndex + charOffset;
                const isActive = absIndex === cursorIndex;
                const isGhost = absIndex === ghostCursorIndex;
                const isVisited = absIndex < typedText.length;

                let displayChar = char;
                let statusClass = "text-slate-700"; // Darker grey for untyped/future text

                if (isVisited) {
                  const typedChar = typedText[absIndex];
                  const isCorrect = typedChar === char;

                  displayChar = typedChar === '\n' ? '↵' : typedChar;

                  if (isCorrect) {
                    statusClass = "text-emerald-500";
                  } else {
                    statusClass = "text-red-500 bg-red-500/10 rounded";
                    if (displayChar === ' ' || displayChar === '\n') {
                      // Make invisible errors visible
                      statusClass += " underline decoration-red-500 decoration-4 underline-offset-4";
                    }
                  }
                } else if (isActive) {
                  statusClass = "text-brand-200"; // Bright white/blue for current
                }

                // Special rendering for Newline char in target
                const isTargetNewline = char === '\n';

                const charElement = (
                  <span
                    key={absIndex}
                    ref={isActive ? activeCharRef : null}
                    className={cn(
                      "relative inline-block transition-colors duration-100 min-w-[1ch]",
                      statusClass
                    )}
                  >
                    {/* If it's a newline char, render visual symbol if active or visited */}
                    {isTargetNewline ? (
                      <span className={cn("inline-flex items-center justify-center opacity-50", isActive ? "opacity-100 text-yellow-400" : "")}>
                        <CornerDownLeft size={24} strokeWidth={3} />
                      </span>
                    ) : (
                      displayChar
                    )}

                    {/* Active Cursor */}
                    {isActive && (
                      <span className="absolute inset-0 -inset-x-0.5 bg-brand-500/20 rounded-sm border-b-4 border-brand-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] -z-10 animate-pulse" />
                    )}

                    {/* Ghost Cursor */}
                    {isGhost && (
                      <span className="absolute -left-0.5 top-0 bottom-0 w-1 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20 transition-all duration-75" />
                    )}
                  </span>
                );

                // If this char is a newline, append a break AFTER the symbol
                if (isTargetNewline) {
                  return (
                    <React.Fragment key={absIndex}>
                      {charElement}
                      <br />
                    </React.Fragment>
                  );
                }

                return charElement;
              })}
            </span>
          );
        })}
      </div>
    </div>
  );
};
