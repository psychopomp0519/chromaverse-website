export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="text-gradient-rgb text-lg font-bold">CHROMAVERSE</span>
          <p className="text-sm text-(--color-text-muted)">
            빛이 있었고, 어둠이 있었고, 그 사이에 있던 사람들이 있었다.
          </p>
          <p className="text-xs text-(--color-text-muted)">
            &copy; {new Date().getFullYear()} Chromaverse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
