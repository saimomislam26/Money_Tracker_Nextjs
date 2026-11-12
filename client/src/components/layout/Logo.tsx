export function Logo({ size = 36 }: { size?: number }) {
  return (
    <span className="grid place-items-center rounded-xl bg-gradient-to-br from-brand to-fuchsia-500 text-white shadow-glow" style={{ width: size, height: size }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l5-6 4 4 8-10" /><path d="M15 5h5v5" />
      </svg>
    </span>
  );
}
