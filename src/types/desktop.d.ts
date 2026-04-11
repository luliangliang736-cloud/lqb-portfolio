interface DesktopBridge {
  openMainApp: () => void;
  closeCompanion: () => void;
  dictate: (timeoutSeconds?: number) => Promise<{ ok: boolean; text?: string; error?: string }>;
}

interface Window {
  desktopBridge?: DesktopBridge;
}
