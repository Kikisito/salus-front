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
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  nif: entity ? entity.nif : '',
  email: entity ? entity.email : '',
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
  email: {
    label: 'Email',
    type: 'email',
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
export function getForgotPasswordValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
