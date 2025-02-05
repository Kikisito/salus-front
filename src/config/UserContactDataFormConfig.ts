const validationSchema = {
  email(value: string) {
    if (!value) {
      return 'El email es obligatorio'
    }
    if (value.length > 100) {
      return 'El email debe tener como máximo 100 caracteres'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'El email no es válido'
    }
    return true
  },
  telefono(value: string) {
    if (!value) {
      return 'El teléfono es obligatorio'
    }
    if (value.length > 20) {
      return 'El teléfono debe tener como máximo 20 caracteres'
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(value) && !/^\d{1,14}$/.test(value)) {
      return 'El teléfono no es válido'
    }
    return true
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  email: entity ? entity.email : '',
  telefono: entity ? entity.telefono : '',
})

const formFieldsConfig = {
  email: {
    label: 'Email',
    type: 'email',
    hint: 'Tu dirección de correo electrónico servirá para recuperar tu contraseña en caso de olvido',
  },
  telefono: {
    label: 'Teléfono',
    type: 'text',
    hint: 'Te enviaremos recordatorios de tus citas y otros avisos importantes',
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getUserContactDataValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
