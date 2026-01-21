import { Shield, Plus, Trash2 } from "lucide-react";

interface WhitelistViewProps {
  whitelist: string[];
  newDomain: string;
  onNewDomainChange: (value: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onRemove: (domain: string) => void;
}

export function WhitelistView({
  whitelist,
  newDomain,
  onNewDomainChange,
  onAdd,
  onRemove,
}: WhitelistViewProps) {
  // Basic domain regex validation
  const isValidDomain = (domain: string) => {
    // Allows localhost, IPv4, and standard domains like example.com
    const pattern =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$|^localhost$|^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return pattern.test(domain);
  };

  const isInvalid = newDomain && !isValidDomain(newDomain);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-lg font-bold mb-2 text-neutral-200 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Whitelist
        </h3>
        <p className="text-sm text-neutral-400 mb-6">
          Add domains that should not be tracked. Time spent on these sites
          won't count towards your stats.
        </p>
        <form onSubmit={onAdd} className="flex gap-4 items-start">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => onNewDomainChange(e.target.value)}
              placeholder="example.com"
              className={`w-full bg-black/50 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors placeholder:text-neutral-600 ${
                isInvalid
                  ? "border-red-500/50 focus:border-red-500"
                  : "border-white/10 focus:border-primary/50"
              }`}
            />
            {isInvalid && (
              <p className="text-xs text-red-400 px-1">
                Please enter a valid domain (e.g., google.com)
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={!newDomain || !isValidDomain(newDomain)}
            className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Domain
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {whitelist.map((domain) => (
          <div
            key={domain}
            className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-primary/30 transition-colors"
          >
            <span className="font-medium text-neutral-300">{domain}</span>
            <button
              onClick={() => onRemove(domain)}
              className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {whitelist.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary opacity-50" />
            </div>
            <h3 className="text-lg font-bold text-neutral-200 mb-2">
              No domains whitelisted
            </h3>
            <p className="text-neutral-500 max-w-xs mx-auto">
              Add a domain above to prevent it from being tracked in your stats.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
