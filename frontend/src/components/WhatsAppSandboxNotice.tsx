import { MessageCircleWarning } from "lucide-react";

export function WhatsAppSandboxNotice() {
  return (
    <div className="glass-card p-4 border border-yellow-500/30 bg-yellow-500/5">
      <div className="flex items-start gap-3">
        <MessageCircleWarning className="w-5 h-5 text-yellow-500 mt-0.5" />

        <div>
          <h4 className="text-sm font-semibold text-foreground">
            Enable WhatsApp Alerts (Sandbox Mode)
          </h4>

          <p className="text-xs text-muted-foreground mt-1">
            To receive WhatsApp AQI alerts:
          </p>

          <ol className="text-xs text-muted-foreground list-decimal ml-4 mt-1 space-y-0.5">
            <li>Save <b>+1 415 523 8886</b> in your contacts</li>
            <li>
              Send <b>join nails-feathers</b> on WhatsApp
            </li>
            <li>Alerts will work for the next <b>72 hours</b></li>
          </ol>

          <p className="text-[10px] text-muted-foreground mt-2 italic">
            Sandbox is for demo/academic use only.
          </p>
        </div>
      </div>
    </div>
  );
}
