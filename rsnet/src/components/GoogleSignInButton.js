"use client";

export default function GoogleSignInButton({ onClick, disabled, label = "Continue with Google" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-secondary flex w-full items-center justify-center gap-2"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.3 0-6-2.76-6-6.36s2.7-6.36 6-6.36c1.86 0 3.12.78 3.84 1.44l2.64-2.52C16.98 3.36 14.7 2.4 12 2.4 6.9 2.4 2.76 6.6 2.76 11.76S6.9 21.12 12 21.12c6.24 0 8.4-4.44 8.4-6.72 0-.66-.06-1.14-.18-1.68H12z"
        />
      </svg>
      {label}
    </button>
  );
}
