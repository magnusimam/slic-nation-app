'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, Check } from 'lucide-react';

type DonationType = 'tithe' | 'offering' | 'partnership';

export default function DonatePage() {
  const [activeTab, setActiveTab] = useState<DonationType>('offering');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const predefinedAmounts = ['10', '25', '50', '100', '250', '500'];

  const tabContent = {
    tithe: {
      title: 'Tithes',
      description: 'Support the ongoing ministry of SLIC Nations with your tithes. Your faithful giving helps us spread God\'s Word.',
      subtitle: 'Your 10% blessing',
    },
    offering: {
      title: 'Offerings',
      description: 'Give a freewill offering to support special projects and initiatives. Every gift makes a difference.',
      subtitle: 'From the abundance of your heart',
    },
    partnership: {
      title: 'Partnership',
      description: 'Become a monthly partner and sustain the vision. Together, we reach more people with the Gospel.',
      subtitle: 'Join our mission',
    },
  };

  const currentTab = tabContent[activeTab];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setAmount('');
      setCustomAmount('');
      setEmail('');
      setName('');
      setMessage('');
    }, 3000);
  };

  const finalAmount = customAmount || amount;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-4 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">Support Our Ministry</h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Your generous giving enables us to reach more people with the Gospel, provide resources, and make a lasting impact in God's Kingdom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            {!isSubmitted ? (
              <div className="bg-card rounded-lg border border-border p-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-border -mx-8 px-8">
                  {(['tithe', 'offering', 'partnership'] as DonationType[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 font-semibold transition-colors border-b-2 ${
                        activeTab === tab
                          ? 'text-primary border-primary'
                          : 'text-foreground/70 border-transparent hover:text-foreground'
                      }`}
                    >
                      {tabContent[tab as DonationType].title}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  <div>
                    <p className="text-foreground/70 mb-2 text-sm">{currentTab.subtitle}</p>
                    <p className="text-foreground/80">{currentTab.description}</p>
                  </div>

                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-foreground">
                      Select or Enter Amount (USD)
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {predefinedAmounts.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => {
                            setAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-3 px-2 rounded-lg font-semibold transition-colors ${
                            amount === amt && !customAmount
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-muted/80 text-foreground'
                          }`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/70">$</span>
                      <Input
                        type="number"
                        placeholder="Custom amount"
                        className="pl-8 py-6"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount('');
                        }}
                      />
                    </div>
                  </div>

                  {/* Donor Information */}
                  <div className="space-y-4 pt-6 border-t border-border">
                    <label className="block text-sm font-semibold text-foreground">
                      Your Information
                    </label>

                    <Input
                      type="text"
                      placeholder="Full Name"
                      className="py-6"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="py-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <textarea
                      placeholder="Prayer request or message (optional)"
                      className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-foreground/50 outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!finalAmount}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Proceed to Payment - ${finalAmount || '0'}
                  </Button>

                  <p className="text-xs text-foreground/60 text-center">
                    Secure payment powered by GT Squad. All donations are tax-deductible.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border border-border p-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-600/20 border border-green-600 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                  <p className="text-foreground/70">
                    Your generous gift of ${finalAmount} has been received. A confirmation email has been sent to {email}.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-foreground/70 mb-2">Donation Details</p>
                  <p className="text-2xl font-bold text-primary mb-2">${finalAmount}</p>
                  <p className="text-sm text-foreground/70">{currentTab.title}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Impact */}
          <div className="space-y-6">
            {/* Impact Stats */}
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-lg mb-4">Your Impact</h3>
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-foreground/70 mb-1">$25 Can</p>
                  <p className="font-semibold text-foreground">Provide a Bible to a believer</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-foreground/70 mb-1">$50 Can</p>
                  <p className="font-semibold text-foreground">Support 5 ministry members for a week</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-foreground/70 mb-1">$100 Can</p>
                  <p className="font-semibold text-foreground">Reach 1,000 people with streaming</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-foreground/70 mb-1">$500 Can</p>
                  <p className="font-semibold text-foreground">Support monthly live service production</p>
                </div>
              </div>
            </div>

            {/* Trust Message */}
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-lg p-6 border border-secondary/30 space-y-4">
              <h3 className="font-semibold text-foreground">How We Use Your Gift</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-secondary flex-shrink-0">✓</span>
                  <span>Ministry staff and operations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary flex-shrink-0">✓</span>
                  <span>Streaming platform and technology</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary flex-shrink-0">✓</span>
                  <span>Outreach and missions programs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-secondary flex-shrink-0">✓</span>
                  <span>Community support and benevolence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
