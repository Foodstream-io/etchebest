"use client";

import { startSocialAuth, type SocialProvider } from "@/lib/socialAuth";

type OAuthButtonProps = {
  provider: SocialProvider;
  disabled?: boolean;
};

// SVG Icons for Google and Apple
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" focusable="false" role="presentation" className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" focusable="false" role="presentation" className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-1.996.06-3.875 1.154-4.912 2.921-2.09 3.61-.535 8.973 1.503 11.97 1.01 1.492 2.169 3.12 3.774 3.067 1.523-.053 2.115-.964 3.963-.964 1.821 0 2.37.964 3.931.933 1.637-.024 2.646-1.487 3.626-2.924 1.139-1.632 1.602-3.21 1.622-3.292-.036-.016-3.111-1.183-3.136-4.735-.018-2.972 2.453-4.383 2.56-4.444-1.393-2.067-3.523-2.352-4.283-2.427-2.06-.11-4.053 1.341-4.688 1.341zm1.332-4.102c.813-1.012 1.365-2.41 1.218-3.794-1.17.048-2.646.79-3.486 1.802-.751.884-1.411 2.31-1.233 3.666 1.306.101 2.678-.66 3.501-1.674z" />
  </svg>
);

export default function OAuthButton({
  provider,
  disabled = false,
}: OAuthButtonProps) {
  const isGoogle = provider === "google";
  const label = isGoogle ? "Continuer avec Google" : "Continuer avec Apple";
  const Icon = isGoogle ? GoogleIcon : AppleIcon;

  return (
    <button
      type="button"
      onClick={() => startSocialAuth(provider)}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-black/8 bg-white/70 px-4 text-sm font-medium text-gray-900 shadow-sm backdrop-blur-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/[0.045] dark:text-gray-50 dark:hover:bg-white/[0.08]"
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );
}
