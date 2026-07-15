import { useEffect } from "react";

import { WebSocketClient } from "./websocket";

export function useWebSocket<T>(socket: WebSocketClient<T>, callback: (message: T) => void) {
  useEffect(() => {
    return socket.subscribe(callback);
  }, [socket, callback]);
}
