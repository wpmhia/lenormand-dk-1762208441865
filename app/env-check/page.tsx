/*
 * Environment Variables Checker Page
 * 
 * This page displays all environment variables needed for the application
 * and their current status. When AI adds new env variables to the codebase,
 * it should automatically update the ENV_VARIABLES array in lib/env-config.ts.
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Code, Settings, Save, ArrowRight, Bug, Play } from 'lucide-react';
import { ENV_VARIABLES } from '@/lib/env-config';
import Link from 'next/link';

export default function EnvCheckPage() {
  // Check environment variables on server side
  const envStatus: { [key: string]: boolean } = {};
  const envValues: { [key: string]: string } = {};
  ENV_VARIABLES.forEach((envVar) => {
    const value = process.env[envVar.name];
    envStatus[envVar.name] = !!value;
    envValues[envVar.name] = value || '';
  });

  const getStatusIcon = (isSet: boolean) => {
    if (isSet) {
      return <CheckCircle className="h-5 w-5 text-primary" />;
    } else {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (isSet: boolean) => {
    if (isSet) {
      return <Badge variant="default" className="bg-primary">Set</Badge>;
    } else {
      return <Badge variant="destructive">Missing</Badge>;
    }
  };

  const missingCount = ENV_VARIABLES.filter(env => !envStatus[env.name]).length;

  return (
    <div className="page-layout">
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Environment Variables Status</h1>
        <p className="text-base mt-2 text-muted-foreground flex items-center flex-wrap gap-1">
          <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md font-semibold">Steps</span> Switch to{' '}
          <span className="text-primary font-medium inline-flex items-center gap-1">
            <Code className="h-4 w-4" />
            Code
          </span>
          {' '}tab → Select{' '}
          <span className="text-primary font-medium inline-flex items-center gap-1">
            <Settings className="h-4 w-4" />
            .env
          </span>
          {' '}file → Add/Update the missing variables →{' '}
          <span className="text-primary font-medium inline-flex items-center gap-1">
            <Save className="h-4 w-4" />
            Save
          </span>
        </p>
      </div>

      {missingCount > 0 && (
        <>
          <Alert className="mb-3 border-destructive bg-destructive/10 text-destructive p-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 flex-shrink-0" />
              <AlertDescription>
                <strong>{missingCount} environment variable{missingCount > 1 ? 's are' : ' is'} missing.</strong>
              </AlertDescription>
            </div>
          </Alert>
          <p className="text-sm text-muted-foreground mb-6">
            Please configure {missingCount > 1 ? 'these variables' : 'this variable'} to ensure proper application functionality.
          </p>
        </>
      )}

      {missingCount === 0 && (
        <Alert className="mb-6 border-primary/20 bg-primary/10 dark:border-primary/30 dark:bg-primary/20 dark:text-primary p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>All environment variables are properly configured!</strong>
              </AlertDescription>
            </div>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Go to App
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </Alert>
      )}

      <div className="grid gap-4">
        {ENV_VARIABLES.map((envVar) => {
          const isSet = envStatus[envVar.name];
          return (
            <Card key={envVar.name} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono">{envVar.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(isSet)}
                    {getStatusBadge(isSet)}
                  </div>
                </div>
                <CardDescription>{envVar.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">How to get this variable:</h4>
                    <div 
                      className="text-sm text-muted-foreground prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: envVar.instructions
                          .replace(/\n/g, '<br>')
                          .replace(
                            /\[([^\]]+)\]\(([^)]+)\)/g,
                            '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80 underline">$1</a>'
                          )
                      }}
                    />
                  </div>
                  {isSet && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Current value (debug):</h4>
                      <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                        {envVar.name.includes('KEY') 
                          ? `${envValues[envVar.name].substring(0, 8)}...${envValues[envVar.name].substring(envValues[envVar.name].length - 4)}`
                          : envValues[envVar.name]
                        }
                      </div>
                    </div>
                  )}
                  {!isSet && (
                    <div className="text-xs text-destructive">
                      This variable is not set in the current environment
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Debug Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Debug Tools
          </CardTitle>
          <CardDescription>
            Test API endpoints and environment configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.open('/api/debug/env', '_blank')}
              className="flex items-center gap-2"
            >
              <Code className="h-4 w-4" />
              Check Environment
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('/api/debug/ai', '_blank')}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Check AI Config
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.open('/api/debug/test-ai', '_blank')}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Test AI Call
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Click the buttons above to open debug endpoints in new tabs. These will show you exactly what&apos;s happening in your deployed environment.
          </p>
        </CardContent>
      </Card>

    </div>
    </div>
  );
}