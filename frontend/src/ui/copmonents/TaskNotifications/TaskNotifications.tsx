import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import { useWebSocket } from "../../../core/ws/useWebSocket";
import type { WebSocketClient } from "../../../core/ws/websocket";
import type { TaskMessage } from "./TaskMessage";

import styles from "./TaskNotifications.module.scss";

type TaskNotification = {
  taskId: string;
  taskType: string;
  status: TaskMessage["status"];
  title: string;
  message: string;
  progress?: number;
  error?: string;
};

interface TaskNotificationsProps {
  socket: WebSocketClient<TaskMessage>;
}

function getTaskTitle(taskType: string, t: TFunction): string {
  switch (taskType) {
    case "UPLOAD_STUDY":
      return t("common.taskNotifications.uploadStudy");
    case "INFERENCE_STUDY":
      return t("common.taskNotifications.inferenceStudy");
    default:
      return t("common.taskNotifications.backgroundTask");
  }
}

function getNotification(message: TaskMessage, t: TFunction): TaskNotification {
  const title = getTaskTitle(message.task_type, t);

  if (message.status === "pending") {
    return {
      taskId: message.task_id,
      taskType: message.task_type,
      status: message.status,
      title,
      message: t("common.taskNotifications.pending"),
    };
  }

  if (message.status === "processing") {
    if (message.progress) {
      const { totalImages, processedImages, currentBatch, totalBatches } = message.progress;

      const progress =
        totalImages > 0 ? Math.min(100, Math.round((processedImages / totalImages) * 100)) : 0;

      return {
        taskId: message.task_id,
        taskType: message.task_type,
        status: message.status,
        title,
        message: t("common.taskNotifications.processedImages", {
          processed: processedImages,
          total: totalImages,
          currentBatch,
          totalBatches,
        }),
        progress,
      };
    }

    if (message.images) {
      const { total, current } = message.images;

      const progress = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

      return {
        taskId: message.task_id,
        taskType: message.task_type,
        status: message.status,
        title,
        message: t("common.taskNotifications.uploadedImages", {
          current,
          total,
        }),
        progress,
      };
    }

    return {
      taskId: message.task_id,
      taskType: message.task_type,
      status: message.status,
      title,
      message: t("common.taskNotifications.processing"),
    };
  }

  if (message.status === "completed") {
    return {
      taskId: message.task_id,
      taskType: message.task_type,
      status: message.status,
      title,
      message: t("common.taskNotifications.completed"),
      progress: 100,
    };
  }

  return {
    taskId: message.task_id,
    taskType: message.task_type,
    status: "failed",
    title,
    message: t("common.taskNotifications.failed"),
    error: message.error ?? t("common.taskNotifications.unknownError"),
  };
}

const TaskNotifications: React.FC<TaskNotificationsProps> = ({ socket }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState<TaskNotification[]>([]);

  const handleMessage = React.useCallback(
    (message: TaskMessage) => {
      const notification = getNotification(message, t);

      setNotifications((current) => {
        const exists = current.some((item) => item.taskId === message.task_id);

        if (exists) {
          return current.map((item) => (item.taskId === message.task_id ? notification : item));
        }

        return [...current, notification].slice(-5);
      });
    },
    [t],
  );

  useWebSocket(socket, handleMessage);

  const dismiss = React.useCallback((taskId: string) => {
    setNotifications((current) => current.filter((item) => item.taskId !== taskId));
  }, []);

  React.useEffect(() => {
    const timers = notifications
      .filter((item) => item.status === "completed" || item.status === "failed")
      .map((item) => window.setTimeout(() => dismiss(item.taskId), 7000));

    return () => timers.forEach(window.clearTimeout);
  }, [notifications, dismiss]);

  if (notifications.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {notifications.map((item) => (
        <div key={item.taskId} className={clsx(styles.notification, styles[item.status])}>
          <div className={styles.header}>
            <div className={styles.title}>{item.title}</div>

            <button
              className={styles.close}
              onClick={() => dismiss(item.taskId)}
              aria-label={t("common.taskNotifications.close")}
            >
              ×
            </button>
          </div>

          <div className={styles.message}>{item.message}</div>

          {item.status === "processing" && item.progress !== undefined && (
            <div
              className={styles.progressTrack}
              role="progressbar"
              aria-valuenow={item.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className={styles.progressBar} style={{ width: `${item.progress}%` }} />
            </div>
          )}

          {item.status === "failed" && <div className={styles.error}>{item.error}</div>}

          <div className={styles.footer}>
            <span>{t(`common.taskNotifications.status.${item.status}`)}</span>
            <span title={item.taskId}>
              {t("common.taskNotifications.taskId", {
                id: item.taskId.slice(0, 8),
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskNotifications;
