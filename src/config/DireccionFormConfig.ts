import Provincias from 'src/assets/provincias'

const validationSchema = {
  lineaDireccion1(value: string) {
    if (!value) {
      return 'La línea de dirección 1 es obligatoria'
    }
    if (value.length < 2) {
      return 'La línea de dirección 1 debe tener al menos 2 caracteres'
    }
    if (value.length > 100) {
      return 'La línea de dirección 1 debe tener como máximo 100 caracteres'
    }
    return true
  },
  lineaDireccion2() {
    return true
  },
  codigoPostal(value: string) {
    if (!value) {
      return 'El código postal es obligatorio'
    }
    if (value.length != 5) {
      return 'El código postal debe tener 5 dígitos'
    }
    if (!/^\d{5}$/.test(value)) {
      return 'El código postal no es válido'
    }
    return true
  },
  provincia(value: string) {
    if (!value) {
      return 'La provincia es obligatoria'
    }
    if (value.length > 50) {
      return 'La provincia debe tener como máximo 50 caracteres'
    }
    return true
  },
  localidad(value: string) {
    if (!value) {
      return 'La localidad es obligatoria'
    }
    if (value.length > 50) {
      return 'La localidad debe tener como máximo 50 caracteres'
    }
    return true
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  lineaDireccion1: entity ? entity.lineaDireccion1 : '',
  lineaDireccion2: entity ? entity.lineaDireccion2 : '',
  codigoPostal: entity ? entity.codigoPostal : '',
  provincia: entity ? entity.provincia : '',
  localidad: entity ? entity.localidad : '',
})

const formFieldsConfig = {
  lineaDireccion1: {
    label: 'Línea de dirección 1',
    type: 'text',
    hint: 'Tu dirección',
  },
  lineaDireccion2: {
    label: 'Línea de dirección 2',
    type: 'text',
    hint: 'Tu dirección',
  },
  codigoPostal: {
    label: 'Código postal',
    type: 'text',
    hint: 'Tu código postal',
  },
  provincia: {
    label: 'Provincia',
    type: 'select',
    hint: 'Tu provincia',
    options: Provincias,
  },
  localidad: {
    label: 'Localidad',
    type: 'text',
    hint: 'Tu localidad',
  },
}

export function getDireccionValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
