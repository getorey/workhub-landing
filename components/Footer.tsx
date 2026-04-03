export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="section-container flex flex-col items-center gap-6 text-center">
        <a href="#" className="text-xl font-bold">
          <span className="gradient-text">Workhub</span>
        </a>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition">강점</a>
          <a href="#bots" className="hover:text-white transition">봇</a>
          <a href="#comparison" className="hover:text-white transition">비교</a>
          <a href="#tech" className="hover:text-white transition">기술</a>
          <a href="#security" className="hover:text-white transition">보안</a>
          <a href="#pricing" className="hover:text-white transition">가격</a>
        </div>

        <a
          href="mailto:13thathat@gmail.com"
          className="text-sm text-gray-400 transition hover:text-white"
        >
          13thathat@gmail.com
        </a>

        <p className="text-xs text-gray-600">
          &copy; 2026 Workhub. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
