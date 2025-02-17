import Provincias from 'src/assets/provincias'

const validationSchema = {
  lineaDireccion1() {
    return true
  },
  lineaDireccion2() {
    return true
  },
  codigoPostal() {
    return true
  },
  provincia() {
    return true
  },
  municipio() {
    return true
  },
  localidad() {
    return true
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  lineaDireccion1: entity ? entity.lineaDireccion1 : '',
  lineaDireccion2: entity ? entity.lineaDireccion2 : '',
  codigoPostal: entity ? entity.codigoPostal : '',
  provincia: entity ? entity.provincia : '',
  municipio: entity ? entity.municipio : '',
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
  municipio: {
    label: 'Municipio',
    type: 'text',
    hint: 'Tu municipio',
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
