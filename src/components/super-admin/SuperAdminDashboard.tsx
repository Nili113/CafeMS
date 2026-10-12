import React, { useState } from 'react';
import {
  TrendingUp,
  Building2,
  Cpu,
  Key,
  Link as LinkIcon,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Search,
  SlidersHorizontal,
  RefreshCw,
  Eye,
  EyeOff,
  Radio,
  Server,
  Zap,
  Globe,
  Lock,
  Clock,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { useCafeData } from '../../context/CafeDataContext';
import { CafeClientRecord, ApiCredential, SystemActivity } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { formatCurrency, formatDate } from '../../lib/utils';

export const SuperAdminDashboard: React.FC = () => {
  const {
    clients,
    toggleClientStatus,
    dispatchEnrollmentLink,
    apiCredentials,
    generateApiKey,
    revokeApiKey,
    systemActivities,
    showToast,
  } = useCafeData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'clients' | 'api' | 'settings'>('overview');

  // Modals
  const [selectedClientForInfo, setSelectedClientForInfo] = useState<CafeClientRecord | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isViewAllActivityOpen, setIsViewAllActivityOpen] = useState(false);
  const [visibleSecretKeyId, setVisibleSecretKeyId] = useState<string | null>(null);

  // Enrollment Form State
  const [enrollVenueName, setEnrollVenueName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPerson, setEnrollPerson] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Search & Filter
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Deactive'>('all');

  // Stats calculation
  const totalClientsCount = clients.length;
  const activeVenuesCount = clients.filter((c) => c.status === 'Active').length;
  const totalApiRequests = apiCredentials.reduce((sum, k) => sum + k.requestsToday, 0) + 124800;
  const estimatedPlatformRevenue = clients.reduce((sum, c) => sum + (c.status === 'Active' ? c.monthlyRevenueEstimate : 0), 0);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.personInCharge.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(clientSearchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleGenerateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollVenueName || !enrollEmail || !enrollPerson) return;
    const link = await dispatchEnrollmentLink(enrollVenueName, enrollEmail, enrollPerson);
    setGeneratedLink(link);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard`, 'success');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-20 animate-in fade-in duration-300">
      {/* Top Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              Cloud Infrastructure
            </span>
            <span className="text-xs text-muted-foreground">• Platform Node: South Asia (KTM-01)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Platform Operations & Tenants
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Centralized multi-tenant supervision, automated venue enrollment link dispatch, and real-time API telemetry across all cafe nodes.
          </p>
        </div>

        {/* Global Action: Generate Enrollment Link */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={<RefreshCw className="size-3.5" />}
            onClick={() => showToast('Tenant cluster telemetry refreshed', 'info')}
          >
            Sync Telemetry
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<LinkIcon className="size-4" />}
            iconPosition="nested"
            onClick={() => {
              setGeneratedLink(null);
              setEnrollVenueName('');
              setEnrollEmail('');
              setEnrollPerson('');
              setIsEnrollModalOpen(true);
            }}
          >
            Dispatch Enrollment Link
          </Button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: <TrendingUp className="size-4" /> },
          { id: 'clients', label: 'Client Management', icon: <Building2 className="size-4" />, count: clients.length },
          { id: 'api', label: 'API & Gateway Keys', icon: <Key className="size-4" />, count: apiCredentials.length },
          { id: 'settings', label: 'Platform & Webhooks', icon: <Cpu className="size-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all select-none whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-foreground text-background shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeTab === tab.id
                    ? 'bg-background/20 text-background'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card>
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled Clients</span>
                <Building2 className="size-4 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {totalClientsCount}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-500 font-medium">
                <TrendingUp className="size-3.5" />
                <span>+2 enrolled this quarter</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Venues</span>
                <Radio className="size-4 text-emerald-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {activeVenuesCount}
                <span className="text-base text-muted-foreground font-normal ml-1">/ {totalClientsCount}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Operational across Kathmandu & Pokhara</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">API Requests (24h)</span>
                <Zap className="size-4 text-amber-500" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight font-mono">
                {totalApiRequests.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-500 font-medium">
                <ArrowUpRight className="size-3.5" />
                <span>99.98% Gateway Success Rate</span>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between text-muted-foreground mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider">Network Monthly Volume</span>
                <TrendingUp className="size-4 text-primary" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {formatCurrency(estimatedPlatformRevenue)}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <span>Active tenant gross turnover</span>
              </div>
            </Card>
          </div>

          {/* Network Growth Trajectory Visual Grid & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Growth Trend Chart */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Tenant Growth & API Throughput</h3>
                    <p className="text-xs text-muted-foreground">Monthly cumulative tenant expansion and webhook pings</p>
                  </div>
                  <Badge variant="outline" size="sm">Last 6 Months</Badge>
                </div>

                {/* Interactive SVG Bar & Trend Visualizer */}
                <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-border/60">
                  {[
                    { month: 'May', height: '35%', count: '4 cafes', req: '42k' },
                    { month: 'Jun', height: '48%', count: '7 cafes', req: '68k' },
                    { month: 'Jul', height: '60%', count: '9 cafes', req: '94k' },
                    { month: 'Aug', height: '72%', count: '11 cafes', req: '132k' },
                    { month: 'Sep', height: '85%', count: '13 cafes', req: '165k' },
                    { month: 'Oct', height: '100%', count: '14 cafes', req: '184k', current: true },
                  ].map((bar, i) => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-muted-foreground bg-popover px-1.5 py-0.5 rounded shadow border border-border">
                        {bar.count}
                      </div>
                      <div
                        style={{ height: bar.height }}
                        className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 relative ${
                          bar.current
                            ? 'bg-gradient-to-t from-primary/80 to-primary ring-1 ring-primary shadow-glow-primary'
                            : 'bg-foreground/10 group-hover:bg-foreground/20'
                        }`}
                      >
                        <div className="absolute inset-x-0 top-1 h-0.5 bg-white/30 rounded-full mx-2" />
                      </div>
                      <span className={`text-xs font-medium ${bar.current ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {bar.month}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Active Venues</span>
                    <p className="text-sm font-bold text-foreground">12 / 14 Venues</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Avg Table Footprint</span>
                    <p className="text-sm font-bold text-foreground">11.6 Tables / Cafe</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-muted-foreground">Order Latency</span>
                    <p className="text-sm font-bold text-emerald-500 font-mono">142ms Avg</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity Feed with dedicated "View All" modal */}
            <div>
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    <h3 className="text-base font-bold text-foreground">System Audit Log</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-primary hover:text-primary"
                    onClick={() => setIsViewAllActivityOpen(true)}
                  >
                    View All
                  </Button>
                </div>

                <div className="space-y-3.5">
                  {systemActivities.slice(0, 4).map((act) => (
                    <div key={act.id} className="p-3 rounded-xl bg-card border border-border/60 hover:border-border transition-all">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-foreground truncate">{act.title}</span>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-2">{act.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{act.detail}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-mono text-muted-foreground">
                          {act.actor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLIENT MANAGEMENT (STRICT COMPLIANCE) */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border/80">
            <div className="relative flex-1 max-w-md">
              <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search venue name, contact person, or email..."
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full bg-muted/60 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Status:</span>
              {(['all', 'Active', 'Deactive'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    statusFilter === filter
                      ? 'bg-foreground text-background shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {filter === 'all' ? 'All Clients' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Client Table */}
          <div className="rounded-[1.75rem] border border-border/80 bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Cafe Name / Venue Identity</th>
                    <th className="py-3.5 px-4">Contact Information</th>
                    <th className="py-3.5 px-4">Tables</th>
                    <th className="py-3.5 px-4">Status (Strict)</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredClients.map((client) => {
                    const isActive = client.status === 'Active';
                    return (
                      <tr key={client.id} className="hover:bg-muted/30 transition-colors group">
                        {/* Cafe Name */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm shrink-0">
                              {client.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                                {client.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate max-w-xs">
                                {client.address}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Information */}
                        <td className="py-4 px-4">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-foreground text-xs sm:text-sm">{client.personInCharge}</div>
                            <div className="text-xs text-muted-foreground font-mono">{client.contactEmail}</div>
                            <div className="text-[11px] text-muted-foreground">{client.contactPhone}</div>
                          </div>
                        </td>

                        {/* Tables */}
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-foreground">{client.tableCount}</span>
                          <span className="text-xs text-muted-foreground ml-1">Live</span>
                        </td>

                        {/* Status (Strictly Active or Deactive with instant toggle) */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleClientStatus(client.id)}
                            className="group/btn flex items-center gap-2 cursor-pointer focus:outline-none"
                            title="Click to toggle status"
                          >
                            <Badge
                              variant={isActive ? 'success' : 'danger'}
                              dot
                              className="cursor-pointer group-hover/btn:ring-2 group-hover/btn:ring-primary/40 transition-all"
                            >
                              {client.status}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground group-hover/btn:text-foreground underline decoration-dotted">
                              Toggle
                            </span>
                          </button>
                        </td>

                        {/* Actions (Info Button opening Comprehensive Client Drawer/Modal) */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Info className="size-3.5 text-primary" />}
                            onClick={() => setSelectedClientForInfo(client)}
                            className="text-xs h-8 px-3 rounded-full"
                          >
                            Info Details
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredClients.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                <Building2 className="size-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-semibold">No cafe tenants found</p>
                <p className="text-xs mt-1">Adjust search query or generate an enrollment link.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: API MANAGEMENT */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80">
            <div>
              <h3 className="text-base font-bold text-foreground">API Credentials & Ingestion Keys</h3>
              <p className="text-xs text-muted-foreground">
                Tenant security tokens, live telemetry quotas, and automated key revocation.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<Key className="size-3.5" />}
              onClick={() => {
                const activeClient = clients.find((c) => c.status === 'Active');
                if (activeClient) {
                  generateApiKey(activeClient.id);
                }
              }}
            >
              Issue New API Key
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {apiCredentials.map((cred) => {
              const isVisible = visibleSecretKeyId === cred.id;
              const isRevoked = cred.status === 'Revoked';
              return (
                <Card key={cred.id}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm sm:text-base">{cred.clientName}</span>
                        <Badge variant={isRevoked ? 'danger' : 'success'} size="sm" dot>
                          {cred.status}
                        </Badge>
                      </div>

                      {/* Public API Key */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground font-mono uppercase">Key ID:</span>
                        <code className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md text-foreground select-all border border-border/60">
                          {cred.apiKey}
                        </code>
                        <button
                          onClick={() => copyToClipboard(cred.apiKey, 'API Key')}
                          className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Copy API Key"
                        >
                          <Copy className="size-3.5" />
                        </button>
                      </div>

                      {/* Secret */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono uppercase">Secret:</span>
                        <code className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md text-foreground border border-border/60">
                          {isVisible ? cred.clientSecret : '••••••••••••••••••••••••••••••••'}
                        </code>
                        <button
                          onClick={() => setVisibleSecretKeyId(isVisible ? null : cred.id)}
                          className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
                          title={isVisible ? 'Hide Secret' : 'Reveal Secret'}
                        >
                          {isVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center md:flex-col items-end gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Rate Limit: <span className="font-mono font-bold text-foreground">{cred.rateLimitPerMin} req/min</span></div>
                        <div className="text-xs text-muted-foreground">Requests (24h): <span className="font-mono font-bold text-primary">{cred.requestsToday.toLocaleString()}</span></div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isRevoked}
                          onClick={() => {
                            revokeApiKey(cred.id);
                          }}
                          className="text-xs h-7 px-3 text-destructive hover:bg-destructive/10"
                        >
                          {isRevoked ? 'Revoked' : 'Revoke Key'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: PLATFORM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-3xl space-y-6">
          <Card>
            <h3 className="text-base font-bold text-foreground mb-1">Global Platform Security</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Enforce strict tenant isolation, encrypted TLS 1.3 socket streams, and QR tampering detection.
            </p>
            <div className="space-y-4 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Tenant Request Rate Limiter</div>
                  <div className="text-xs text-muted-foreground">Block automated scraping or brute force pings on QR menus</div>
                </div>
                <Badge variant="success">Enabled (Strict)</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Fonepay Webhook Signature Verification</div>
                  <div className="text-xs text-muted-foreground">HMAC-SHA256 signature verification on settlement webhooks</div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: ENROLLMENT LINK DISPATCH (NO MANUAL REGISTER FORM PER SPEC!) */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Dispatch Tenant Enrollment Link"
        description="Super Admin sends an onboarding invitation. The cafe manager self-registers their staff and tables."
      >
        {!generatedLink ? (
          <form onSubmit={handleGenerateEnrollment} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Cafe / Venue Identity
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Artisan Bean & Roastery"
                value={enrollVenueName}
                onChange={(e) => setEnrollVenueName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Owner / General Manager Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Manish Shrestha"
                value={enrollPerson}
                onChange={(e) => setEnrollPerson(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Destination Email
              </label>
              <input
                type="email"
                required
                placeholder="manager@artisancafe.com"
                value={enrollEmail}
                onChange={(e) => setEnrollEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-xl bg-muted border border-border focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="ghost" size="md" type="button" onClick={() => setIsEnrollModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" icon={<LinkIcon className="size-4" />}>
                Generate & Dispatch Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
              <Check className="size-4 shrink-0 mt-0.5 text-emerald-500" />
              <div>
                <span className="font-bold">Enrollment invitation dispatched!</span>
                <p className="mt-0.5 text-muted-foreground">
                  An automated email with this secure single-use onboarding URL has been transmitted to {enrollEmail}.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-muted-foreground mb-1">Generated Onboarding URL</label>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-muted border border-border font-mono text-xs text-foreground select-all break-all">
                {generatedLink}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="md"
                icon={<Copy className="size-3.5" />}
                onClick={() => {
                  copyToClipboard(generatedLink, 'Onboarding Link');
                  setHasCopiedLink(true);
                }}
              >
                {hasCopiedLink ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button variant="primary" size="md" onClick={() => setIsEnrollModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 2: CLIENT DETAILS DRAWER/MODAL (Opened by Info Button) */}
      <Modal
        isOpen={!!selectedClientForInfo}
        onClose={() => setSelectedClientForInfo(null)}
        title={selectedClientForInfo?.name || 'Client Details'}
        description="Comprehensive venue telemetry, location, active table count, and API bindings."
      >
        {selectedClientForInfo && (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/60 border border-border/60">
              <div>
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Status</span>
                <div className="mt-0.5">
                  <Badge variant={selectedClientForInfo.status === 'Active' ? 'success' : 'danger'} dot>
                    {selectedClientForInfo.status}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Enrolled At</span>
                <div className="font-mono text-foreground font-semibold mt-0.5">
                  {formatDate(selectedClientForInfo.enrolledAt)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground text-xs">Venue Location:</span>
                <p className="font-semibold text-foreground">{selectedClientForInfo.address}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Person-in-Charge:</span>
                <p className="font-semibold text-foreground">
                  {selectedClientForInfo.personInCharge} ({selectedClientForInfo.contactPhone})
                </p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Official Contact Email:</span>
                <p className="font-mono font-semibold text-foreground">{selectedClientForInfo.contactEmail}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Active Table Provisioning:</span>
                <p className="font-semibold text-foreground">{selectedClientForInfo.tableCount} Dining Tables</p>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Bound API Credential Key:</span>
                <p className="font-mono text-xs bg-muted p-2 rounded-lg border border-border/60 text-foreground">
                  {selectedClientForInfo.apiKeyId}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex justify-between items-center">
              <Button
                variant={selectedClientForInfo.status === 'Active' ? 'danger' : 'success'}
                size="sm"
                onClick={() => {
                  toggleClientStatus(selectedClientForInfo.id);
                  setSelectedClientForInfo((prev) =>
                    prev ? { ...prev, status: prev.status === 'Active' ? 'Deactive' : 'Active' } : null
                  );
                }}
              >
                Mark as {selectedClientForInfo.status === 'Active' ? 'Deactive' : 'Active'}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setSelectedClientForInfo(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* MODAL 3: VIEW ALL AUDIT ACTIVITIES */}
      <Modal
        isOpen={isViewAllActivityOpen}
        onClose={() => setIsViewAllActivityOpen(false)}
        title="Complete Platform Activity Log"
        description="Chronological log of tenant events, webhook notifications, and security triggers."
        maxWidth="lg"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
          {systemActivities.map((act) => (
            <div key={act.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{act.title}</span>
                  <Badge variant={act.severity === 'success' ? 'success' : act.severity === 'warning' ? 'warning' : 'outline'} size="sm">
                    {act.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{act.detail}</p>
                <span className="text-[10px] font-mono text-muted-foreground mt-1 inline-block">By: {act.actor}</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
