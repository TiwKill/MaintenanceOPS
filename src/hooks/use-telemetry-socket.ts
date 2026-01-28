
import { useState, useEffect, useRef } from 'react';

interface TelemetrySocketOptions<T> {
  onMessage?: (data: T) => void;
  reconnectInterval?: number;
  mockDataGenerator?: () => T;
  enableMock?: boolean; // Force mock or enable fallback
}

export function useTelemetrySocket<T>(url: string, options: TelemetrySocketOptions<T> = {}) {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'SIMULATED'>('DISCONNECTED');
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mockIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const retryCount = useRef(0);

  useEffect(() => {
    isMountedRef.current = true;
    retryCount.current = 0;

    const startMock = () => {
      if (!options.mockDataGenerator) return;
      
      console.log('Starting simulation mode...');
      setStatus('SIMULATED');
      
      // Clear any existing mock interval
      if (mockIntervalRef.current) clearInterval(mockIntervalRef.current);

      mockIntervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;
        const mockData = options.mockDataGenerator!();
        setData(mockData);
        if (options.onMessage) {
          options.onMessage(mockData);
        }
      }, 1000);
    };

    const connect = () => {
      // If forced mock, skip connection
      if (options.enableMock) {
        startMock();
        return;
      }

      if (!url) return;

      setStatus('CONNECTING');
      
      try {
        const ws = new WebSocket(url);
        socketRef.current = ws;

         ws.onopen = () => {
          if (isMountedRef.current) {
            setStatus('CONNECTED');
            retryCount.current = 0;
            console.log('Connected to WebSocket:', url);
            // Stop mock if it was running
            if (mockIntervalRef.current) {
                clearInterval(mockIntervalRef.current);
                mockIntervalRef.current = null;
            }
          }
        };

        ws.onmessage = (event) => {
          if (!isMountedRef.current) return;
          try {
            const parsed = JSON.parse(event.data);
            setData(parsed);
            if (options.onMessage) {
              options.onMessage(parsed);
            }
          } catch (err) {
            console.error('Failed to parse WS message:', err);
          }
        };

        ws.onclose = () => {
          if (!isMountedRef.current) return;
          
          socketRef.current = null;
          
          // If we fail, immediately switch to mock if available to avoid bad UX
          if (options.mockDataGenerator) {
             if (retryCount.current === 0) {
                 console.warn('WebSocket connection failed, switching to simulation.');
             }
             startMock();
             return; 
          }

          setStatus('DISCONNECTED');
          retryCount.current += 1;

          // Setup reconnect
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              connect();
            }
          }, options.reconnectInterval || 3000);
        };

        ws.onerror = (err) => {
          // Only log full error if we don't have a fallback or if we're debugging
          if (!options.mockDataGenerator) {
              console.error('WebSocket error:', err);
          } else {
              console.warn('WebSocket check failed (using simulation)');
          }
        };

      } catch (e) {
          console.error("Failed to create WebSocket:", e);
          if (options.mockDataGenerator) startMock();
      }
    };

    connect();

    return () => {
      isMountedRef.current = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (mockIntervalRef.current) {
        clearInterval(mockIntervalRef.current);
      }
    };
  }, [url, options.reconnectInterval, options.enableMock]);

  return { data, status };
}
