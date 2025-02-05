const validationSchema = {
  nif(value: string) {
    if (!value) {
      return 'El NIF es obligatorio'
    }

    // Tenemos dos opciones ahora, que sea un DNI o un NIE
    // Si es un DNI, el formato es 12345678Z
    // Si es un NIE, el formato es X1234567Z. La letra inicial puede ser X, Y o Z

    // Si es un DNI o un NIE y es válido, continuamos. Si no, devolvemos un error
    if (
      !(
        (/^\d{8}[A-Z]$/.test(value) && verifyDni(value)) ||
        (/^[XYZ]\d{7}[A-Z]$/.test(value) && verifyNie(value))
      )
    ) {
      return 'El NIF no es válido'
    }
    return true
  },
  password(value: string) {
    if (!value) {
      return 'La contraseña es obligatoria'
    }
    return true
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  nif: entity ? entity.nif : '',
})

const formFieldsConfig = {
  nif: {
    label: 'DNI/NIE/NIF',
    type: 'text',
    autocomplete: 'username',
    onChange: (value: string) => {
      return value.toUpperCase()
    },
  },
  password: {
    label: 'Contraseña',
    type: 'password',
    autocomplete: 'current-password',
  },
}

function verifyDni(nif: string) {
  const letter = nif.charAt(nif.length - 1).toUpperCase()
  const number = nif.substring(0, nif.length - 1)
  const letterValues = 'TRWAGMYFPDXBNJZSQVHLCKET'
  const mod = parseInt(number, 10) % 23
  const expectedLetter = letterValues.charAt(mod)
  return letter === expectedLetter
}

function verifyNie(nif: string) {
  const letterValues = 'TRWAGMYFPDXBNJZSQVHLCKET'
  const niePrefix = nif.charAt(0)
  const niePrefixes = 'XYZ'
  const niePrefixValue = niePrefixes.indexOf(niePrefix)
  if (niePrefixValue === -1) {
    return false
  }
  const nieNumber = nif.substring(1, nif.length - 1)
  const mod = parseInt(nieNumber, 10) % 23
  const expectedLetter = letterValues.charAt(mod)
  return nif.charAt(nif.length - 1) === expectedLetter
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function getLoginValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
