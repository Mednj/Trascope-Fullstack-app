import { AlertTriangle, Server } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ConnectionErrorProps {
  onRetry?: () => void;
}

export function ConnectionError({ onRetry }: ConnectionErrorProps) {
  return (
    <Alert className="max-w-md mx-auto">
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        Backend Connection Required
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p>The Spring Boot backend is not running on port 8080.</p>
        <p className="text-sm text-muted-foreground">
          Start your Spring Boot backend server to use this application.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            Retry Connection
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}