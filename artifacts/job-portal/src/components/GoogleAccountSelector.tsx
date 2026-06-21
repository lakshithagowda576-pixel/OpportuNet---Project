import { useState, useEffect } from "react";
import { ChevronDown, Plus, Mail } from "lucide-react";

interface GoogleAccount {
  email: string;
  name: string;
  lastUsed: string;
}

interface GoogleAccountSelectorProps {
  onSelectAccount: (email?: string) => void;
  isLoading?: boolean;
}

export function GoogleAccountSelector({ onSelectAccount, isLoading }: GoogleAccountSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<GoogleAccount[]>([]);

  useEffect(() => {
    // Load saved Google accounts from localStorage
    const saved = localStorage.getItem("google_accounts");
    if (saved) {
      try {
        setAccounts(JSON.parse(saved));
      } catch {
        setAccounts([]);
      }
    }
  }, []);

  const handleSelectAccount = (email?: string) => {
    setIsOpen(false);
    onSelectAccount(email);
  };

  if (accounts.length === 0) {
    // If no saved accounts, just redirect to OAuth
    return null;
  }

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full py-3 rounded-xl font-medium bg-white border-2 border-gray-200 text-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-3 px-4 disabled:opacity-60"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Select Google Account</span>
        </div>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            {accounts.map((account) => (
              <button
                key={account.email}
                onClick={() => handleSelectAccount(account.email)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors flex items-center gap-3"
              >
                <Mail className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{account.name}</p>
                  <p className="text-xs text-gray-500 truncate">{account.email}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleSelectAccount()}
            className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-3 font-medium text-gray-700 border-t border-gray-200"
          >
            <Plus className="w-4 h-4" />
            Use Different Account
          </button>
        </div>
      )}
    </div>
  );
}
