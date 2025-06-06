const validationSchema = {
  nombre(value: string) {
    if (!value) {
      return 'El nombre es obligatorio'
    }
    if (value.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres'
    }
    if (value.length > 50) {
      return 'El nombre debe tener como máximo 50 caracteres'
    }
    return true
  },
  apellidos(value: string) {
    if (!value) {
      return 'Los apellidos son obligatorios'
    }
    if (value.length < 2) {
      return 'Los apellidos deben tener al menos 2 caracteres'
    }
    if (value.length > 100) {
      return 'Los apellidos deben tener como máximo 100 caracteres'
    }
    return true
  },
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
  fechaNacimiento(value: string) {
    if (!value) {
      return 'La fecha de nacimiento es obligatoria'
    }

    const dob = new Date(value)
    if (isNaN(dob.getTime())) {
      return 'La fecha de nacimiento no es válida'
    }

    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    if (age < 18) {
      return 'Debes ser mayor de edad'
    }

    return true
  },
  sexo(value: string) {
    if (!value) {
      return 'El sexo es obligatorio'
    }
    return true
  },
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const initialValues = (entity?: any) => ({
  nombre: entity ? entity.nombre : '',
  apellidos: entity ? entity.apellidos : '',
  nif: entity ? entity.nif : '',
  fechaNacimiento: entity ? entity.fechaNacimiento : '',
  sexo: entity ? entity.sexo : '',
})

const formFieldsConfig = {
  nombre: {
    label: 'Nombre',
    type: 'text',
    hint: 'Tu nombre, sin apellidos',
  },
  apellidos: {
    label: 'Apellidos',
    type: 'text',
    hint: 'Tus apellidos',
  },
  nif: {
    label: 'DNI/NIE/NIF',
    type: 'text',
    hint: 'Tu número de identificación fiscal',
    onChange: (value: string) => {
      return value.toUpperCase()
    },
  },
  fechaNacimiento: {
    label: 'Fecha de nacimiento',
    type: 'date',
    hint: 'Tu fecha de nacimiento',
  },
  sexo: {
    label: 'Sexo',
    type: 'select-with-other',
    hint: 'Tu sexo',
    options: ['Hombre', 'Mujer', 'Otro'],
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
export function getUserBasicDataValidatedFormConfig(entity?: any) {
  return {
    validationSchema: validationSchema,
    initialValues: initialValues(entity),
    formFieldsConfig: formFieldsConfig,
  }
}
