"use client";

import { useState } from "react";
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";

export function ApiDebugComponent() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const testDirectApiCall = async () => {
    setTesting(true);
    setDebugInfo([]);
    
    const logs: string[] = [];
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:5280/api";
    
    logs.push(`🌐 API Base URL: ${apiUrl}`);
    logs.push(`🔍 Testing direct API calls...`);
    
    // Test Posts endpoint
    try {
      logs.push(`📡 Calling: ${apiUrl}/Posts`);
      const response = await fetch(`${apiUrl}/Posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });
      
      logs.push(`📊 Response Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        logs.push(`✅ Posts API Success: ${data.length} posts found`);
        logs.push(`📄 Sample post:`, JSON.stringify(data[0], null, 2));
      } else {
        logs.push(`❌ Posts API Failed: ${response.status}`);
        const errorText = await response.text();
        logs.push(`Error details: ${errorText}`);
      }
    } catch (error) {
      logs.push(`❌ Posts API Error: ${error}`);
    }

    // Test Categories endpoint
    try {
      logs.push(`📡 Calling: ${apiUrl}/Categories`);
      const response = await fetch(`${apiUrl}/Categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
      });
      
      logs.push(`📊 Categories Response Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        logs.push(`✅ Categories API Success: ${data.length} categories found`);
        logs.push(`📁 Categories: ${data.map((cat: any) => cat.name).join(', ')}`);
      } else {
        logs.push(`❌ Categories API Failed: ${response.status}`);
      }
    } catch (error) {
      logs.push(`❌ Categories API Error: ${error}`);
    }

    setDebugInfo(logs);
    setTesting(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardBody>
        <Typography variant="h5" className="mb-4 text-center">
          🔍 API Debug Console
        </Typography>
        
        <div className="text-center mb-4">
          <Button 
            onClick={testDirectApiCall} 
            disabled={testing}
            color="blue"
          >
            {testing ? "Testing..." : "Test API Endpoints"}
          </Button>
        </div>

        {debugInfo.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <Typography variant="h6" className="mb-2">
              Debug Output:
            </Typography>
            <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
              {debugInfo.map((log, index) => (
                <div key={`debug-${index}-${log.substring(0, 10)}`} className={`
                  ${log.includes('✅') ? 'text-green-700' : ''}
                  ${log.includes('❌') ? 'text-red-700' : ''}
                  ${log.includes('⚠️') ? 'text-yellow-700' : ''}
                  ${log.includes('📡') ? 'text-blue-700' : ''}
                `}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Typography variant="h6" className="mb-2">
            💡 Quick Checks:
          </Typography>
          <ul className="text-sm space-y-1">
            <li>1. Is your C# backend running? (`dotnet run` in backend folder)</li>
            <li>2. Can you access: <a href="https://localhost:5280/swagger" target="_blank" className="text-blue-600 underline">https://localhost:5280/swagger</a></li>
            <li>3. Check browser console for CORS or certificate errors</li>
            <li>4. Try HTTP instead of HTTPS: `http://localhost:5279/api`</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
}
