// src/utils/httpErrorHandler.js
import axios from "axios";
import { useNotificationStore } from "@/stores/notificationStore";
import i18n from "@/langs";

/**
 * Handles HTTP errors from Axios requests.
 */
export function handleHttpError(error) {
  const notificationStore = useNotificationStore();

  // If the error is a cancellation, we ignore it
  if (axios.isCancel?.(error)) return;

  // If the error is not an Axios error, we notify about an unknown error
  if (!axios.isAxiosError(error)) {
    return notify(notificationStore, "unknown-error");
  }

  // 1) Timeout error
  if (error.code === "ECONNABORTED") {
    return notify(notificationStore, "timeout");
  }

  // Network error (no response)
  if (!error.response) {
    return notify(notificationStore, "network-error");
  }

  // HTTP response >2xx
  const { status, data } = error.response;

  // Try to extract a meaningful message from the backend response
  const backendMessage = pickBackendMessage(data);
  if (backendMessage) {
    const safeMessage = isSQLMessage(backendMessage)
      ? tKey("unknown-error-message")
      : backendMessage;

    const titleKey = tKey(`error-${status}`, "unknown-error");
    return notificationStore.addNotification("error", titleKey, safeMessage);
  }

  const knownByStatus = {
    400: "error-400",
    401: "error-401",
    403: "error-403",
    404: "error-404",
    409: "error-409",
    413: "error-413",
    415: "error-415",
    429: "error-429",
    500: "error-500",
    502: "error-502",
    503: "error-503",
    504: "error-504",
  };

  const titleKey = tKey(knownByStatus[status], "unknown-error");
  const msgKey = tKey(`${titleKey}-message`, "unknown-error-message");
  return notificationStore.addNotification("error", titleKey, msgKey);
}

// Single instance for notification
// This avoids creating a new notification store instance every time the function is called
function notify(store, baseKey) {
  const title = tKey(baseKey, "unknown-error");
  const message = tKey(`${baseKey}-message`, "unknown-error-message");
  store.addNotification("error", title, message);
}

// Translates a key, falling back to a default if not found
function tKey(key, fallbackKey) {
  const full = key.startsWith("http-errors.") ? key : `http-errors.${key}`;
  const fallback = fallbackKey
    ? fallbackKey.startsWith("http-errors.")
      ? fallbackKey
      : `http-errors.${fallbackKey}`
    : undefined;

  return notificationExist(full)
    ? full
    : (fallback ?? "http-errors.unknown-error");
}

// Checks if a notification key exists in the i18n store
function notificationExist(key) {
  try {
    return i18n?.global?.te?.(key) === true;
  } catch {
    return false;
  }
}

// Checks if the message is a SQL error message
function isSQLMessage(message) {
  return /SQLSTATE/i.test(String(message));
}

// Extracts a message from the backend response data
// It checks for common fields that might contain an error message
function pickBackendMessage(data) {
  if (!data) return null;

  if (typeof data === "string") return data;
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error_description === "string")
    return data.error_description;
  if (typeof data?.error === "string") return data.error;
  if (Array.isArray(data?.errors))
    return data.errors.filter(Boolean).join(" • ");

  return null;
}
