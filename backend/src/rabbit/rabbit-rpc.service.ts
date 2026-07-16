import { Injectable } from "@nestjs/common";

@Injectable()
export class RabbitRpcService {
  private readonly pending = new Map<string, (value: { taskId: string }) => void>();

  wait(requestId: string, timeout = 5000) {
    return new Promise<{ taskId: string } | null>((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        resolve(null);
      }, timeout);

      this.pending.set(requestId, (result) => {
        clearTimeout(timer);
        this.pending.delete(requestId);
        resolve(result);
      });
    });
  }

  resolve(requestId: string, taskId: string) {
    const callback = this.pending.get(requestId);

    if (callback) {
      callback({ taskId });
    }
  }
}
