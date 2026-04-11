import type { CSSProperties } from 'react';
import { ExternalLink, GripHorizontal, Sparkles, X } from 'lucide-react';
import CharacterAvatar from '../Avatar/CharacterAvatar';

function openMainApp() {
  if (window.desktopBridge?.openMainApp) {
    window.desktopBridge.openMainApp();
    return;
  }

  window.location.search = '';
}

function closeCompanion() {
  if (window.desktopBridge?.closeCompanion) {
    window.desktopBridge.closeCompanion();
    return;
  }

  window.close();
}

export default function DesktopCompanion() {
  return (
    <div className="flex min-h-screen items-end justify-end bg-transparent p-4 text-surface-100">
      <div
        className="relative h-[236px] w-[188px]"
        style={{ WebkitAppRegion: 'drag' } as CSSProperties}
      >
        <div className="absolute right-1 top-0 inline-flex items-center gap-1 rounded-full border border-white/6 bg-surface-950/28 px-2 py-0.5 text-[8px] tracking-[0.14em] text-[#FFB8DF]/80 backdrop-blur-xl">
          <GripHorizontal size={12} />
          FLOAT
        </div>

        <div
          className="absolute right-[8px] top-[28px] max-w-[126px] rounded-[18px] rounded-br-md border border-white/6 bg-surface-950/30 px-2.5 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.1)] backdrop-blur-xl"
        >
          <div className="mb-1 inline-flex items-center gap-1 text-[9px] text-[#AEFF62]">
            <span className="inline-block h-1 w-1 rounded-full bg-[#AEFF62]" />
            在线
          </div>
          <p className="text-[11px] font-medium leading-4 text-surface-50">
            LQB 在这里
          </p>
          <p className="mt-0.5 text-[10px] leading-4 text-surface-400">
            双击头像进入
          </p>
        </div>

        <div className="absolute bottom-[8px] left-[0px]">
          <div className="relative animate-[float_4.2s_ease-in-out_infinite]">
            <div className="absolute inset-0 rounded-full bg-[#FFB8DF]/4 blur-2xl" />
            <button
              type="button"
              onDoubleClick={openMainApp}
              className="relative flex h-[102px] w-[102px] items-center justify-center rounded-full border border-white/8 bg-white/[0.02] shadow-[0_10px_20px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.04] active:scale-[0.98]"
              style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
              title="双击打开完整站点"
            >
              <div className="scale-[1.86]">
                <CharacterAvatar size="lg" status="online" showStatus animated={false} />
              </div>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={openMainApp}
          className="absolute bottom-[22px] right-[8px] inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#FFB8DF]/12 bg-[#FFB8DF]/76 text-surface-950 shadow-[0_8px_14px_rgba(255,184,223,0.16)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.08] active:scale-[0.94]"
          style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
          title="打开完整站点"
        >
          <ExternalLink size={14} />
        </button>

        <button
          type="button"
          onClick={closeCompanion}
          className="absolute right-[8px] top-[104px] inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/6 bg-surface-950/24 text-surface-300 shadow-[0_6px_12px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-transform duration-200 hover:scale-[1.06] active:scale-[0.94]"
          style={{ WebkitAppRegion: 'no-drag' } as CSSProperties}
          title="关闭悬浮载体"
        >
          <X size={13} />
        </button>

        <div className="absolute left-[78px] top-[142px] inline-flex items-center gap-1 text-[9px] text-surface-500">
          <Sparkles size={9} className="text-[#FFB8DF]/85" />
          双击
        </div>
      </div>
    </div>
  );
}
