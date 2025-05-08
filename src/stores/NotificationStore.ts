import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalNotifications } from '@capacitor/local-notifications'

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
    permissionGranted: false,
    activeNotifications: {} as Record<string, boolean>,
  }),

  getters: {
    isActive: (state) => (notificationId: string) => {
      return !!state.activeNotifications[notificationId]
    },
  },

  actions: {
    async checkPermissions(): Promise<boolean> {
      const { display } = await LocalNotifications.checkPermissions()
      this.permissionGranted = display === 'granted'

      if (!this.permissionGranted) {
        const { display } = await LocalNotifications.requestPermissions()
        this.permissionGranted = display === 'granted'
      }

      return this.permissionGranted
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationStore, import.meta.hot))
}
