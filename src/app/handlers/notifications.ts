import { Notification } from 'electron';

function CreateNotification(title: string, body: string) {
  return new Notification({ title, body }).show();
}

export { CreateNotification };
