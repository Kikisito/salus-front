const validationSchema = {
  especialidad(value: string) {
    if (value?.length >= 2) return true
    return 'La especialidad es requerida'
  },
  tipo(value: string) {
    if (value?.length >= 2) return true
    return 'El tipo de cita es requerido'
  },
  aseguradora() {
    return true
  },
  /* eslint-disable @typescript-eslint/no-explicit-any */
  num_poliza(value: string, values: any) {
    if (
      values.form.aseguradora === null ||
      values.form.aseguradora === undefined ||
      values.form.aseguradora.value === null
    ) {
      return true
    }

    if (value?.length >= 2) return true
    return 'El número de póliza es requerido'
  },
  /* eslint-enable @typescript-eslint/no-explicit-any */
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
  aseguradora: entity ? entity.aseguradora : null,
  num_poliza: entity ? entity.num_poliza : '',
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
  aseguradora: {
    label: 'Aseguradora',
    type: 'select',
    hint: 'Aseguradora de la cita',
    options: [
      { value: null, label: 'Ninguna' },
      { value: 'Aseguradora 1', label: 'Aseguradora 1' },
      { value: 'Aseguradora 2', label: 'Aseguradora 2' },
      { value: 'Aseguradora 3', label: 'Aseguradora 3' },
    ],
  },
  num_poliza: {
    label: 'Número de póliza',
    type: 'text',
    hint: 'Número de póliza de la cita',
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
