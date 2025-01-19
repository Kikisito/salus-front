const validationSchema = {
  especialidad(value: string) {
    if (value?.length >= 2) return true
    return 'La especialidad es requerida'
  },
  tipo(value: string) {
    if (value?.length >= 2) return true
    return 'El tipo de cita es requerido'
  },
  centro_medico(value: string) {
    if (value?.length >= 2) return true
    return 'El centro médico es requerido'
  },
  doctor(value: string) {
    if (value?.length >= 2) return true
    return 'El doctor es requerido'
  },
  fecha(value: string) {
    if (value) return true
    return 'La fecha es requerida'
  },
  hora(value: string) {
    if (value) return true
    return 'La hora es requerida'
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  especialidad: entity ? entity.especialidad : '',
  tipo: entity ? entity.tipo : '',
  centro_medico: entity ? entity.centro_medico : '',
  doctor: entity ? entity.doctor : '',
  fecha: entity ? entity.fecha : '',
  hora: entity ? entity.hora : '',
})

const formFieldsConfig = {
  especialidad: {
    label: 'Especialidad',
    type: 'text',
    hint: 'Especialidad de la cita',
  },
  tipo: {
    label: 'Tipo',
    type: 'text',
    hint: 'Tipo de cita',
  },
  centro_medico: {
    label: 'Centro médico',
    type: 'text',
    hint: 'Centro médico de la cita',
  },
  doctor: {
    label: 'Doctor',
    type: 'text',
    hint: 'Doctor de la cita',
  },
  fecha: {
    label: 'Fecha',
    type: 'date',
    hint: 'Fecha de la cita',
  },
  hora: {
    label: 'Hora',
    type: 'time',
    hint: 'Hora de la cita',
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getCitaValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
