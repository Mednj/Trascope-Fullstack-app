import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useEffect, useState } from "react";

export function BackendStatus() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
        });
        
        // If we get any response (even an error), the backend is running
        setBackendStatus('connected');
      } catch (error) {
        setBackendStatus('disconnected');
      }
    };

    checkBackend();
  }, []);

  if (backendStatus === 'checking') {
    return (
      <Alert className="mb-4 border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Checking backend connection...
        </AlertDescription>
      </Alert>
    );
  }

  if (backendStatus === 'connected') {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Backend Connected:</strong> Spring Boot server is running on port 8080.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <XCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Backend Required:</strong> Start your Spring Boot server on port 8080 to enable full functionality.
        Until then, use the demo login to explore the frontend interface.
      </AlertDescription>
    </Alert>
  );
}