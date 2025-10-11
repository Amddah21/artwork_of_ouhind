import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  Eye, 
  EyeOff, 
  Activity, 
  Shield, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  category: 'auth' | 'artwork' | 'user' | 'system' | 'security';
  message: string;
  details?: any;
  userAgent?: string;
  ipAddress?: string;
}

interface DashboardStats {
  totalVisits: number;
  uniqueVisitors: number;
  pageViews: number;
  artworkViews: number;
  errorCount: number;
  lastActivity: Date;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    artworkViews: 0,
    errorCount: 0,
    lastActivity: new Date()
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Sample log data - in a real app, this would come from your backend
  const generateSampleLogs = (): LogEntry[] => {
    const sampleLogs: LogEntry[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        level: 'info',
        category: 'artwork',
        message: 'Artwork "Rêve Aquarelle" viewed',
        details: { artworkId: 1, userId: 'visitor_123' },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ipAddress: '192.168.1.100'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        level: 'success',
        category: 'auth',
        message: 'Admin login successful',
        details: { userId: 'admin', sessionId: 'sess_456' },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        ipAddress: '192.168.1.101'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        level: 'warning',
        category: 'security',
        message: 'Failed login attempt detected',
        details: { username: 'admin', attempts: 3 },
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        ipAddress: '192.168.1.102'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        level: 'error',
        category: 'system',
        message: 'Image loading failed for artwork ID 2',
        details: { artworkId: 2, error: '404 Not Found' },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        ipAddress: '192.168.1.103'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        level: 'info',
        category: 'user',
        message: 'New visitor from France',
        details: { country: 'France', city: 'Paris' },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ipAddress: '192.168.1.104'
      }
    ];
    return sampleLogs;
  };

  // Load logs and stats
  useEffect(() => {
    const loadData = () => {
      const sampleLogs = generateSampleLogs();
      setLogs(sampleLogs);
      
      // Generate sample stats
      setStats({
        totalVisits: Math.floor(Math.random() * 1000) + 500,
        uniqueVisitors: Math.floor(Math.random() * 300) + 200,
        pageViews: Math.floor(Math.random() * 2000) + 1000,
        artworkViews: Math.floor(Math.random() * 500) + 300,
        errorCount: sampleLogs.filter(log => log.level === 'error').length,
        lastActivity: new Date()
      });
    };

    loadData();

    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Filter logs
  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchTerm, levelFilter, categoryFilter]);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      error: 'destructive',
      warning: 'secondary',
      success: 'default',
      info: 'outline'
    } as const;

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'outline'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'Message', 'IP Address', 'User Agent'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.category,
        `"${log.message}"`,
        log.ipAddress || '',
        `"${log.userAgent || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    const sampleLogs = generateSampleLogs();
    setLogs(sampleLogs);
    
    setStats({
      totalVisits: Math.floor(Math.random() * 1000) + 500,
      uniqueVisitors: Math.floor(Math.random() * 300) + 200,
      pageViews: Math.floor(Math.random() * 2000) + 1000,
      artworkViews: Math.floor(Math.random() * 500) + 300,
      errorCount: sampleLogs.filter(log => log.level === 'error').length,
      lastActivity: new Date()
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-foreground/80 mt-2">
                Monitor your gallery activity and system logs
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
                className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="secondary"
                onClick={refreshData}
                className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Artwork Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.artworkViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.errorCount}</div>
              <p className="text-xs text-muted-foreground">
                Last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="logs" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={autoRefresh ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Auto-refresh
                </Button>
                <Button variant="outline" size="sm" onClick={exportLogs}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="logs" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Level</label>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="auth">Authentication</SelectItem>
                        <SelectItem value="artwork">Artwork</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Logs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredLogs.length} of {logs.length} entries
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getLevelIcon(log.level)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getLevelBadge(log.level)}
                          <Badge variant="outline" className="text-xs">
                            {log.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {log.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{log.message}</p>
                        {log.details && (
                          <details className="text-xs text-muted-foreground">
                            <summary className="cursor-pointer hover:text-foreground">
                              Details
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                          {log.userAgent && (
                            <span className="truncate max-w-xs">
                              UA: {log.userAgent.substring(0, 50)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No logs found matching your filters.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Failed Login Attempts</h3>
                      <p className="text-2xl font-bold text-red-500">3</p>
                      <p className="text-sm text-muted-foreground">Last 24 hours</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Suspicious Activity</h3>
                      <p className="text-2xl font-bold text-yellow-500">1</p>
                      <p className="text-sm text-muted-foreground">Currently monitoring</p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Security monitoring features coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
