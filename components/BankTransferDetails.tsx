'use client';

import { useState } from 'react';
import { Copy, Check, Building2, Globe, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BankDetail {
  label: string;
  value: string;
  copyable?: boolean;
}

const INTERNATIONAL_DETAILS: BankDetail[] = [
  { label: 'Account Name', value: 'Apostle Emmanuel Etim Ministries', copyable: true },
  { label: 'Account Number', value: '0259662638', copyable: true },
  { label: 'Bank Name', value: 'Guaranty Trust Bank', copyable: true },
  { label: 'SWIFT Code', value: 'GTBINGLA', copyable: true },
  { label: 'Sort Code', value: '058-152094', copyable: true },
  { label: 'Bank Address', value: '56A Adeola Odeku, Victoria Island, Lagos', copyable: false },
];

const NAIRA_DETAILS: BankDetail[] = [
  { label: 'Account Name', value: 'Apostle Emmanuel Etim Ministries', copyable: true },
  { label: 'Account Number', value: '0259662614', copyable: true },
  { label: 'Bank Name', value: 'GTB', copyable: true },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md hover:bg-primary/20 transition-colors flex-shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-primary" />
      )}
    </button>
  );
}

function DetailRow({ detail }: { detail: BankDetail }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] sm:text-xs text-foreground/60">{detail.label}</p>
        <p className="text-xs sm:text-sm font-medium text-foreground truncate">{detail.value}</p>
      </div>
      {detail.copyable && <CopyButton text={detail.value} />}
    </div>
  );
}

interface BankTransferDetailsProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export function BankTransferDetails({ variant = 'full', className = '' }: BankTransferDetailsProps) {
  const [activeTab, setActiveTab] = useState<'international' | 'naira'>('international');

  if (variant === 'compact') {
    return (
      <div className={`bg-card rounded-lg border border-border overflow-hidden ${className}`}>
        <div className="p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary flex-shrink-0" />
            <h3 className="font-semibold text-foreground text-xs sm:text-sm">Bank Transfer</h3>
          </div>
          <p className="text-[10px] sm:text-xs text-foreground/60 mt-1">Send directly to our account</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('international')}
            className={`flex-1 py-2 text-[10px] sm:text-xs font-medium transition-colors ${
              activeTab === 'international'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <Globe className="w-3 h-3 inline mr-1" />
            International (USD)
          </button>
          <button
            onClick={() => setActiveTab('naira')}
            className={`flex-1 py-2 text-[10px] sm:text-xs font-medium transition-colors ${
              activeTab === 'naira'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-foreground/60 hover:text-foreground'
            }`}
          >
            <CreditCard className="w-3 h-3 inline mr-1" />
            Naira (₦)
          </button>
        </div>

        <div className="p-3 sm:p-4 space-y-1">
          {(activeTab === 'international' ? INTERNATIONAL_DETAILS : NAIRA_DETAILS).map((detail, idx) => (
            <DetailRow key={idx} detail={detail} />
          ))}
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`bg-card rounded-lg border border-border overflow-hidden ${className}`}>
      <div className="p-4 sm:p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm sm:text-base">Bank Transfer</h3>
            <p className="text-xs text-foreground/60">Send directly to our ministry account</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('international')}
          className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'international'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-foreground/60 hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <Globe className="w-4 h-4" />
          International (USD)
        </button>
        <button
          onClick={() => setActiveTab('naira')}
          className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'naira'
              ? 'text-primary border-b-2 border-primary bg-primary/5'
              : 'text-foreground/60 hover:text-foreground hover:bg-muted/50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Nigerian Naira (₦)
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'international' && (
          <div className="mb-3">
            <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/30">
              For international wire transfers
            </Badge>
          </div>
        )}
        {activeTab === 'naira' && (
          <div className="mb-3">
            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-500 border-green-500/30">
              For Nigerian bank transfers
            </Badge>
          </div>
        )}

        <div className="space-y-2">
          {(activeTab === 'international' ? INTERNATIONAL_DETAILS : NAIRA_DETAILS).map((detail, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 p-2 sm:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-foreground/60 mb-0.5">{detail.label}</p>
                <p className="text-sm sm:text-base font-semibold text-foreground">{detail.value}</p>
              </div>
              {detail.copyable && <CopyButton text={detail.value} />}
            </div>
          ))}
        </div>

        <p className="text-[10px] sm:text-xs text-foreground/50 mt-4 text-center">
          Click the copy icon to copy account details to your clipboard
        </p>
      </div>
    </div>
  );
}
