const validationSchema = {
  numeroColegiado() {
    return true
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  numeroColegiado: entity ? entity.numeroColegiado : '',
})

const formFieldsConfig = {
  numeroColegiado: {
    label: 'Número de colegiado',
    type: 'text',
  },
}

export function getPerfilMedicoValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
