import axios from "axios";
import { useNotificationStore } from "@/stores/notificationStore";
import i18n from "@/langs";

export function handleHttpError(error) {
     const notificationStore = useNotificationStore();
     let type = 'error'
     if (axios.isAxiosError(error)) {
          if (error.response.data.message) {
               if (isSQLMessage(error.response.data.message)){
                    const titleKey = 'http-errors.unknown-error';
                    const messageKey = 'http-errors.unknown-error-message';
                    notificationStore.addNotification(type, titleKey, messageKey);
               } else {
                    const status = error.response.status;
                    let titleKey = `http-errors.error-${status}`
                    let messageKey = error.response.data.message
                    notificationStore.addNotification('error', titleKey, messageKey);
               }
          }
          else if (notificationExist(error.response.data.error)) {
               let titleKey = `${error.response.data.error}`
               let messageKey = `${(error.response.data.error_description).replaceAll(' ', '-').replaceAll('.', '')}`
               notificationStore.addNotification('error', titleKey, messageKey);
          } else if (error.response) { //Status >2xx
               const status = error.response.status;
               let titleKey = `http-errors.error-${status}`
               let messageKey = `http-errors.error-${status}-message`

               if (!notificationExist(titleKey)) {
                    titleKey = 'http-errors.unknown-error'
               }
               if (!notificationExist(messageKey)) {
                    messageKey = 'http-errors.unknown-error-message'
               }
               notificationStore.addNotification('error', titleKey, messageKey);
          } else if (error.request) { // Network Error
               let titleKey = `http-errors.network-error`
               let messageKey = `http-errors.network-error-message`
               notificationStore.addNotification('error', titleKey, messageKey);
          } else { // Request error
               const titleKey = 'http-errors.unknown-error';
               const messageKey = 'http-errors.unknown-error-message';
               notificationStore.addNotification(type, titleKey, messageKey);
          }
     } else { // Not an Axios Error
          const titleKey = 'http-errors.unknown-error';
          const messageKey = 'http-errors.unknown-error-message';
          notificationStore.addNotification(type, titleKey, messageKey);
     }
}
function notificationExist(key) {
     return i18n.global.te(`http-errors.${key}`)
}
function isSQLMessage(message){
     const sqlMessage = /SQLSTATE/;
     return sqlMessage.test(message)
}
