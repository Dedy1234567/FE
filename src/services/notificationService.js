/**
 * src/services/notificationService.js
 */
import api from "./api";

export const getNotifications = () =>
  api.get("/notifications");