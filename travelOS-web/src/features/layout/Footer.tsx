"use client";

export default function Footer() {
  return (
    <footer className="h-10 bg-white/80 backdrop-blur-sm border-t border-gray-300 flex items-center justify-between px-4 shrink-0 text-xs text-gray-600 transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <span>© 2026 Travel OS. All Rights Reserved.</span>
        <span className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors">Privacy Policy</span>
        <span className="text-blue-600 cursor-pointer hover:underline hover:text-blue-800 transition-colors">Terms of Service</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>Powered by</span>
        <span className="font-bold text-[var(--accent-color)]">Travel OS</span>
      </div>
    </footer>
  );
}
