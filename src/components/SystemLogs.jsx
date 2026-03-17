import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  FileText, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Clock
} from 'lucide-react';

export function SystemLogs() {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');


  const filteredLogs = logs.filter(log => {
    const levelMatch = selectedLevel === 'all' || log.level === selectedLevel;
    const categoryMatch = selectedCategory === 'all' || log.category === selectedCategory;
    return levelMatch && categoryMatch;
  });

  const getLevelIcon = (level) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };

    return (
      <Badge variant="secondary" className={variants[level]}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryBadge = (category) => {
    const variants = {
      upload: 'bg-purple-100 text-purple-800',
      recognition: 'bg-indigo-100 text-indigo-800',
      database: 'bg-cyan-100 text-cyan-800',
      system: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant="outline" className={variants[category]}>
        {category}
      </Badge>
    );
  };

  const handleExportLogs = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    alert(`System logs exported to: system_logs_${timestamp}.txt`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                System Logs
              </CardTitle>
              <CardDescription>
                View system activities, errors, and performance metrics
              </CardDescription>
            </div>
            <Button onClick={handleExportLogs}>
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="recognition">Recognition</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <div>
                          <div>{log.timestamp.toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {log.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        {getLevelBadge(log.level)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(log.category)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {log.message}
                      </div>
                    </TableCell>
                    <TableCell>
                      {log.details && (
                        <div className="max-w-sm text-sm text-muted-foreground">
                          {log.details}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No logs found matching the selected filters.
            </div>
          )}

          {/* Log Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg text-green-600">
                {logs.filter(l => l.level === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Success</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-blue-600">
                {logs.filter(l => l.level === 'info').length}
              </div>
              <div className="text-sm text-muted-foreground">Info</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-yellow-600">
                {logs.filter(l => l.level === 'warning').length}
              </div>
              <div className="text-sm text-muted-foreground">Warning</div>
            </div>
            <div className="text-center">
              <div className="text-lg text-red-600">
                {logs.filter(l => l.level === 'error').length}
              </div>
              <div className="text-sm text-muted-foreground">Error</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}