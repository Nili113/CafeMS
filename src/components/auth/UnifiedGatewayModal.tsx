import React, { useState } from 'react';
import { ShieldCheck, Coffee, Smartphone, Key, Lock, ArrowRight, User } from 'lucide-react';
import { useCafeData } from '../../context/CafeDataContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface UnifiedGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnifiedGatewayModal: React.FC<UnifiedGatewayModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentRole, setActiveTableNumber, showToast } = useCafeData();
  const [selectedRoleType, setSelectedRoleType] = useState<'admin' | 'client' | 'customer'>('client');
  const [email, setEmail] = useState('manager@cafexyz.com');
  const [password, setPassword] = useState('••••••••');
  const [tableInput, setTableInput] = useState(4);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRoleType === 'admin') {
      setCurrentRole('super_admin');
      showToast('Authenticated as Platform Super Admin', 'success');
    } else if (selectedRoleType === 'client') {
      setCurrentRole('cafe_client');
      showToast('Authenticated as Cafe XYZ Manager', 'success');
    } else {
      setActiveTableNumber(tableInput);
      setCurrentRole('customer');
      showToast(`Instant Table ${tableInput} QR session activated`, 'success');
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unified Login & Role Gateway"
      description="Single authentication gateway routing to SaaS Platform, Cafe Operations, or Table QR session."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Role Picker Pills */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-muted/60 border border-border/60">
          <button
            type="button"
            onClick={() => {
              setSelectedRoleType('client');
              setEmail('manager@cafexyz.com');
            }}
            className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRoleType === 'client'
                ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Coffee className="size-4 text-primary" />
            <span>Cafe Client</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRoleType('admin');
              setEmail('admin@cafems.io');
            }}
            className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRoleType === 'admin'
                ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldCheck className="size-4 text-primary" />
            <span>Super Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRoleType('customer');
            }}
            className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
              selectedRoleType === 'customer'
                ? 'bg-card text-foreground shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="size-4 text-primary" />
            <span>Customer QR</span>
          </button>
        </div>

        {selectedRoleType !== 'customer' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Authorized Work Email
              </label>
              <div className="relative">
                <User className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Security Token / Password</label>
              <div className="relative">
                <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-muted border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-muted/60 border border-border/60 space-y-3">
            <span className="text-xs font-semibold text-foreground block">
              Direct Table Scan (Zero-Password Guest Access)
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Customers scan physical QR codes at dining tables and access digital ordering without any forced account signup.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Simulate Table #:</span>
              <input
                type="number"
                min={1}
                max={12}
                value={tableInput}
                onChange={(e) => setTableInput(Number(e.target.value))}
                className="w-20 px-2 py-1 text-xs font-mono font-bold rounded-lg bg-card border border-border text-foreground text-center"
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end gap-2 border-t border-border/60">
          <Button variant="ghost" size="md" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" icon={<ArrowRight className="size-4" />} iconPosition="nested">
            Enter Workspace
          </Button>
        </div>
      </form>
    </Modal>
  );
};
