// outside of a Vue file
import { Notify } from 'quasar'
import type { QNotifyCreateOptions, QNotifyAction } from 'quasar'

const notify = (message: string, color: string = 'primary', icon: string = '', position: QNotifyCreateOptions["position"] = 'top-right', avatar: string = '', dismisable: Boolean = true) => {
  const actions: QNotifyAction[] = []
  if (dismisable) {
    actions.push(
      { icon: 'cancel', color: 'white', handler: () => { /* ... */ } });
  }
  Notify.create({
    message,
    icon,
    color,
    position,
    avatar,
    actions: actions,
  });
};
export default notify;