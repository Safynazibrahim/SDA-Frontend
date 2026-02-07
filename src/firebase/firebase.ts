import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { environment } from '../environments/environment';


export const firebaseApp = initializeApp(environment.firebaseConfig);
export const messaging = getMessaging(firebaseApp);
