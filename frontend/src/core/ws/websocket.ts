type Callback<T> = (message: T) => void;

export class WebSocketClient<T = unknown> {
  private readonly url: string;
  private readonly listeners = new Set<Callback<T>>();

  private socket?: WebSocket;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    if (this.socket) return;

    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log(`[WS] Connected: ${this.url}`);
    };

    this.socket.onclose = () => {
      console.log(`[WS] Disconnected: ${this.url}`);
      this.socket = undefined;
    };

    this.socket.onerror = (error) => {
      console.error(`[WS] Error: ${this.url}`, error);
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as T;

      this.listeners.forEach((listener) => listener(message));
    };
  }

  disconnect() {
    this.socket?.close();
    this.socket = undefined;
  }

  subscribe(callback: Callback<T>) {
    this.listeners.add(callback);

    return () => {
      this.listeners.delete(callback);
    };
  }

  send(data: unknown) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  get isConnected() {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
