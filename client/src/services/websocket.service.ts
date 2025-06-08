/**
 * WebSocket Service
 * Handles WebSocket connections, message sending, and reconnections.
 */

export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number; // Time (in ms) to wait before reconnecting
  private isManuallyClosed: boolean = false;

  constructor(url: string, reconnectInterval: number = 5000) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
  }

  /**
   * Connects to the WebSocket server.
   */
  public connect(): void {
    this.isManuallyClosed = false; // Reset manual close flag
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log(`[WebSocket] Connected to ${this.url}`);
    };

    this.socket.onmessage = (event: MessageEvent) => {
      console.log(`[WebSocket] Message received:`, event.data);
      this.handleMessage(event.data);
    };

    this.socket.onerror = (error: Event) => {
      console.error(`[WebSocket] Error occurred:`, error);
    };

    this.socket.onclose = (event: CloseEvent) => {
      console.warn(`[WebSocket] Connection closed:`, event.reason);

      if (!this.isManuallyClosed) {
        console.log(`[WebSocket] Attempting to reconnect in ${this.reconnectInterval / 1000} seconds...`);
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };
  }

  /**
   * Sends a message to the WebSocket server.
   * @param message - The message to send (string or JSON object).
   */
  public sendMessage(message: string | object): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message);
      this.socket.send(data);
      console.log(`[WebSocket] Message sent:`, data);
    } else {
      console.error(`[WebSocket] Cannot send message, socket is not connected.`);
    }
  }

  /**
   * Handles incoming messages.
   * Override this method in your application to process incoming messages.
   * @param data - The message data received from the WebSocket server.
   */
  protected handleMessage(data: any): void {
    console.log(`[WebSocket] Override handleMessage to process:`, data);
    // Add your custom logic here (e.g., dispatch event or update state).
  }

  /**
   * Closes the WebSocket connection.
   */
  public close(): void {
    this.isManuallyClosed = true;
    if (this.socket) {
      this.socket.close();
      console.log(`[WebSocket] Connection closed manually.`);
    }
  }

  /**
   * Checks if the WebSocket is currently connected.
   * @returns True if the socket is connected, otherwise false.
   */
  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
        }
