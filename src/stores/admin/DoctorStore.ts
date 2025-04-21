import { defineStore, acceptHMRUpdate } from 'pinia'
import { api } from 'src/boot/axios'
import { handleRequest } from 'src/helpers/handleRequest'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import { type ServiceAnswer } from 'src/interfaces/ServiceAnswer'

export const useDoctorStore = defineStore('doctorStore', {
  state: () => ({
    count: 0,
    doctors: [] as MedicalProfile[],
    inspectedDoctor: null as MedicalProfile | null,
  }),

  actions: {
    async getAll(
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<MedicalProfile[] | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/doctor-profiles/all/' + page + '/' + limit)
          this.count = await response.data.count
          this.doctors = await response.data.doctors

          return this.doctors
        },
        (error) => {
          throw error
        },
      )
    },

    async search(
      search: string,
      page: number = 0,
      limit: number = 10,
    ): Promise<ServiceAnswer<MedicalProfile[] | null>> {
      return handleRequest(
        async () => {
          const response = await api.get(
            '/doctor-profiles/search/' + search + '/' + page + '/' + limit,
          )
          this.count = await response.data.count
          this.doctors = await response.data.doctors

          return this.doctors
        },
        (error) => {
          throw error
        },
      )
    },

    async getDoctorData(id: number): Promise<ServiceAnswer<MedicalProfile | null>> {
      return handleRequest(
        async () => {
          const response = await api.get('/doctor-profiles/' + id)
          this.inspectedDoctor = response.data as MedicalProfile

          return response.data
        },
        (error) => {
          throw error
        },
      )
    },

    async changeLicense(
      id: number,
      license: string,
    ): Promise<ServiceAnswer<MedicalProfile | null>> {
      return handleRequest(
        async () => {
          const response = await api.put('/doctor-profiles/' + id + '/license', {
            userId: id,
            license: license,
          })
          this.inspectedDoctor = response.data

          return response.data
        },
        (error) => {
          if (error.status === 409) {
            return 'El número de colegiado introducido ya está en uso'
          } else {
            return 'Error al cambiar el número de colegiado'
          }
        },
      )
    },

    async addSpecialty(
      doctorId: number,
      specialtyId: number,
    ): Promise<ServiceAnswer<MedicalProfile | null>> {
      return handleRequest(
        async () => {
          const response = await api.post('/doctor-profiles/' + doctorId + '/specialties/add', {
            specialtyId: specialtyId,
          })
          this.inspectedDoctor = response.data

          return response.data
        },
        (error) => {
          if (error.status === 409) {
            return 'La especialidad ya está asignada a este médico'
          } else {
            return 'Error al añadir la especialidad al médico'
          }
        },
      )
    },

    async removeSpecialty(
      doctorId: number,
      specialtyId: number,
    ): Promise<ServiceAnswer<MedicalProfile | null>> {
      return handleRequest(
        async () => {
          const response = await api.delete(
            '/doctor-profiles/' + doctorId + '/specialties/' + specialtyId,
          )
          this.inspectedDoctor = response.data

          return response.data
        },
        (error) => {
          if (error.status === 409) {
            return 'La especialidad no está asignada a este médico'
          } else if (error.status === 404) {
            return 'La especialidad o el perfil médico indicados no existen'
          } else {
            return 'Error al eliminar la especialidad del médico'
          }
        },
      )
    },

    async deleteMedicalProfile(id: number): Promise<ServiceAnswer<boolean>> {
      return handleRequest(
        async () => {
          const response = await api.delete('/doctor-profiles/' + id)
          this.inspectedDoctor = null

          return response.data
        },
        (error) => {
          if (error.status === 404) {
            return 'El perfil médico indicado no existe'
          } else if (error.status === 409) {
            return 'El perfil médico no puede ser eliminado porque tiene datos asociados'
          } else {
            return 'Error al eliminar el perfil médico'
          }
        },
      )
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDoctorStore, import.meta.hot))
}
