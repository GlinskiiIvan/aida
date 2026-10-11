import React from "react";
import clsx from "clsx";

import styles from "./ActionNotifications.module.scss";

export interface ActionNotification {
  id: number;
  status: "completed" | "failed";
  title: string;
  message: string;
}

interface ActionNotificationsProps {
  notifications: ActionNotification[];
  onDismiss: (id: number) => void;
}

const ActionNotifications: React.FC<ActionNotificationsProps> = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className={styles.container} aria-live="polite">
      {notifications.map((item) => (
        <div
          key={item.id}
          className={clsx(styles.notification, styles[item.status])}
          role={item.status === "failed" ? "alert" : "status"}
        >
          <div className={styles.header}>
            <div className={styles.title}>{item.title}</div>

            <button
              className={styles.close}
              onClick={() => onDismiss(item.id)}
              aria-label="Закрыть уведомление"
            >
              ×
            </button>
          </div>

          <div className={styles.message}>{item.message}</div>
        </div>
      ))}
    </div>
  );
};

export default ActionNotifications;
