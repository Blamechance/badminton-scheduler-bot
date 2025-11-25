import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background/50 text-muted-foreground mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
        <p className="text-xs">Built by Tommy Cao</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/Blamechance"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-foreground transition-colors"
            data-testid="link-github"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
          <a
            href="https://notes.tcao.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
            data-testid="link-blog"
          >
            Blog
          </a>
        </div>
      </div>
    </footer>
  );
}
