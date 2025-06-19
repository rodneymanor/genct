"use client";

import { useState, useEffect } from "react";

import { collection, addDoc, getDocs, query, limit } from "firebase/firestore";
import { Mail, Database, CheckCircle, XCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";

interface EmailAlias {
  id: number;
  alias: string;
  forward: string;
  created: number;
}

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export default function TestSetupPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Firebase Firestore Connection', status: 'pending' },
    { name: 'ImprovMX API Connection', status: 'pending' },
    { name: 'Email Alias Creation', status: 'pending' },
  ]);
  const [emailAliases, setEmailAliases] = useState<EmailAlias[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [newAlias, setNewAlias] = useState('');
  const [forwardEmail, setForwardEmail] = useState('rodney@rodneymanor.com');

  const updateTest = (name: string, status: 'success' | 'error', message?: string) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message } : test
    ));
  };

  const testFirestore = async () => {
    try {
      // Test writing to Firestore
      const testCollection = collection(db, 'test');
      await addDoc(testCollection, {
        message: 'Test connection',
        timestamp: new Date(),
        userId: user?.uid || 'anonymous'
      });

      // Test reading from Firestore
      const q = query(testCollection, limit(1));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        updateTest('Firebase Firestore Connection', 'success', 'Connected to Firestore emulator');
        return true;
      } else {
        updateTest('Firebase Firestore Connection', 'error', 'No data found in Firestore');
        return false;
      }
    } catch (error) {
      console.error('Firestore test error:', error);
      updateTest('Firebase Firestore Connection', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const testImprovMX = async () => {
    try {
      const response = await fetch('/api/email/create-alias', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setEmailAliases(data.aliases || []);
        updateTest('ImprovMX API Connection', 'success', `Found ${data.aliases?.length || 0} existing aliases`);
        return true;
      } else {
        const errorData = await response.json();
        updateTest('ImprovMX API Connection', 'error', errorData.error || 'API request failed');
        return false;
      }
    } catch (error) {
      console.error('ImprovMX test error:', error);
      updateTest('ImprovMX API Connection', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const testEmailCreation = async () => {
    try {
      const testEmail = `test-${Date.now()}@gencapp.pro`;
      const response = await fetch('/api/email/create-alias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          forward: 'test@example.com',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        updateTest('Email Alias Creation', 'success', `Created alias: ${data.alias?.email}`);
        
        // Refresh aliases list
        await testImprovMX();
        return true;
      } else {
        const errorData = await response.json();
        updateTest('Email Alias Creation', 'error', errorData.error || 'Failed to create alias');
        return false;
      }
    } catch (error) {
      console.error('Email creation test error:', error);
      updateTest('Email Alias Creation', 'error', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    
    // Reset tests
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const, message: undefined })));

    // Run tests sequentially
    await testFirestore();
    await testImprovMX();
    await testEmailCreation();

    setIsRunningTests(false);
    toast.success('All tests completed!');
  };

  const createCustomAlias = async () => {
    if (!newAlias || !forwardEmail) {
      toast.error('Please fill in both alias and forward email');
      return;
    }

    try {
      const response = await fetch('/api/email/create-alias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `${newAlias}@gencapp.pro`,
          forward: forwardEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Created alias: ${data.alias?.email}`);
        setNewAlias('');
        
        // Refresh aliases list
        await testImprovMX();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create alias');
      }
    } catch (error) {
      console.error('Error creating alias:', error);
      toast.error('Failed to create alias');
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  useEffect(() => {
    // Load existing aliases on mount
    testImprovMX();
  }, []);

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Setup Testing</h1>
          <p className="text-muted-foreground">
            Test Firebase emulators and ImprovMX email functionality.
          </p>
        </div>
        <Button onClick={runAllTests} disabled={isRunningTests}>
          {isRunningTests ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run All Tests'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System Tests
            </CardTitle>
            <CardDescription>
              Verify that all systems are working correctly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tests.map((test) => (
              <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <p className="font-medium text-sm">{test.name}</p>
                    {test.message && (
                      <p className="text-xs text-muted-foreground">{test.message}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Email Alias Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Aliases
            </CardTitle>
            <CardDescription>
              Manage email aliases for gencapp.pro domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create New Alias */}
            <div className="space-y-3 p-3 border rounded-lg bg-gray-50">
              <h4 className="font-medium text-sm">Create New Alias</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="alias" className="text-xs">Alias</Label>
                  <div className="flex">
                    <Input
                      id="alias"
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      placeholder="username"
                      className="rounded-r-none text-sm"
                    />
                    <div className="flex items-center px-2 bg-gray-100 border border-l-0 rounded-r text-xs text-gray-600">
                      @gencapp.pro
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="forward" className="text-xs">Forward To</Label>
                  <Input
                    id="forward"
                    type="email"
                    value={forwardEmail}
                    onChange={(e) => setForwardEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="text-sm"
                  />
                </div>
              </div>
              <Button onClick={createCustomAlias} size="sm" className="w-full">
                <Send className="mr-2 h-3 w-3" />
                Create Alias
              </Button>
            </div>

            {/* Existing Aliases */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Existing Aliases ({emailAliases.length})</h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {emailAliases.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No aliases found. Run tests to load aliases.
                  </p>
                ) : (
                  emailAliases.map((alias) => (
                    <div key={alias.id} className="flex items-center justify-between p-2 border rounded text-sm">
                      <div>
                        <p className="font-medium">{alias.alias}@gencapp.pro</p>
                        <p className="text-xs text-muted-foreground">→ {alias.forward}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ID: {alias.id}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Email:</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="font-medium">User ID:</p>
                <p className="text-muted-foreground font-mono">{user.uid}</p>
              </div>
              <div>
                <p className="font-medium">Your Email Alias:</p>
                <p className="text-muted-foreground font-mono">rodney@gencapp.pro</p>
              </div>
              <div>
                <p className="font-medium">Forwards To:</p>
                <p className="text-muted-foreground">rodney@rodneymanor.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Firebase Emulators:</strong> Make sure you have run `npm run emulators:ui` in a separate terminal</p>
          <p><strong>Firestore:</strong> The emulator should be running on localhost:8180</p>
          <p><strong>Auth:</strong> The emulator should be running on localhost:9199</p>
          <p><strong>Firebase UI:</strong> Access the emulator UI at localhost:4200</p>
          <p><strong>Email Testing:</strong> Send test emails to any alias@gencapp.pro to test the email processing</p>
          <p><strong>Your Personal Alias:</strong> rodney@gencapp.pro forwards to rodney@rodneymanor.com</p>
        </CardContent>
      </Card>
    </div>
  );
} 