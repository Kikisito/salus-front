/* eslint-disable @typescript-eslint/no-explicit-any */
const validationSchema = {
  password(value: string) {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{8,}$/.test(value)) {
      return 'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial'
    }
    return true
  },
  passwordConfirmation(value: string, values: any) {
    if (value !== values.form.password) {
      return 'Las contraseñas no coinciden'
    }
    return true
  },
}

const initialValues = (entity?: any) => ({
  password: entity ? entity.password : '',
  passwordConfirmation: entity ? entity.passwordConfirmation : '',
})

const formFieldsConfig = {
  password: {
    label: 'Contraseña',
    type: 'password',
  },
  passwordConfirmation: {
    label: 'Confirmar contraseña',
    type: 'password',
  },
}

export function getPasswordValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
