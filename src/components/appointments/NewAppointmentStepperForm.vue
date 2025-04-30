<script lang="ts" setup>
// eslint-disable
import { ref, onMounted } from 'vue'
import { Notify } from 'quasar'
import { formattedAppointmentType } from 'src/helpers/formattedAppointmentType'
import type { Specialty } from 'src/interfaces/Specialty'
import type { Appointment } from 'src/interfaces/Appointment'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'

const emit = defineEmits(['form:submit', 'form:cancel'])

// Estado del stepper
const step = ref(1)
const loading = ref(false)

// Datos del formulario
const appointment = ref<Partial<Appointment>>({
  type: 'IN_PERSON',
})

// Datos mockup precargados
const medicalCenters = ref<MedicalCenter[]>([])
const specialties = ref<Specialty[]>([])
const doctors = ref([])
const availableDates = ref([])
const availableSlots = ref([])

// DATOS MOCKUP - Centros médicos
const mockMedicalCenters: MedicalCenter[] = [
  { id: 1, name: 'Hospital Universitario Salus', address: 'Avda. Principal, 123', city: 'Madrid' },
  { id: 2, name: 'Clínica Salus Norte', address: 'C/ Roble, 45', city: 'Madrid' },
  { id: 3, name: 'Centro Médico Salus Este', address: 'Plaza Mayor, 7', city: 'Barcelona' },
  { id: 4, name: 'Policlínica Salus Sur', address: 'C/ Encina, 12', city: 'Valencia' },
]

// DATOS MOCKUP - Especialidades por centro
const mockSpecialtiesByCenter = {
  1: [
    { id: 1, name: 'Cardiología' },
    { id: 2, name: 'Dermatología' },
    { id: 3, name: 'Neurología' },
    { id: 4, name: 'Oftalmología' },
    { id: 5, name: 'Traumatología' },
    { id: 6, name: 'Pediatría' },
    { id: 7, name: 'Ginecología' },
  ],
  2: [
    { id: 1, name: 'Cardiología' },
    { id: 3, name: 'Neurología' },
    { id: 5, name: 'Traumatología' },
  ],
  3: [
    { id: 2, name: 'Dermatología' },
    { id: 4, name: 'Oftalmología' },
    { id: 6, name: 'Pediatría' },
  ],
  4: [
    { id: 1, name: 'Cardiología' },
    { id: 7, name: 'Ginecología' },
  ],
}

const mockDoctors = {
  1: [
    // Cardiología
    {
      id: 101,
      user: {
        nombre: 'Antonio',
        apellidos: 'García López',
        sexo: 'Hombre',
      },
      license: '12345-CM',
      centers: [1, 2], // IDs de centros donde trabaja
    },
    {
      id: 102,
      user: {
        nombre: 'Laura',
        apellidos: 'Martínez Ruiz',
        sexo: 'Mujer',
      },
      license: '23456-CM',
      centers: [1, 4],
    },
  ],
  2: [
    // Dermatología
    {
      id: 201,
      user: {
        nombre: 'Carlos',
        apellidos: 'Rodríguez Sánchez',
        sexo: 'Hombre',
      },
      license: '34567-CM',
      centers: [1, 3],
    },
  ],
  3: [
    // Neurología
    {
      id: 301,
      user: {
        nombre: 'María',
        apellidos: 'Fernández González',
        sexo: 'Mujer',
      },
      license: '45678-CM',
      centers: [1, 2],
    },
    {
      id: 302,
      user: {
        nombre: 'Javier',
        apellidos: 'López Pérez',
        sexo: 'Hombre',
      },
      license: '56789-CM',
      centers: [1],
    },
  ],
  4: [
    // Oftalmología
    {
      id: 401,
      user: {
        nombre: 'Ana',
        apellidos: 'Gómez Torres',
        sexo: 'Mujer',
      },
      license: '67890-CM',
      centers: [1, 3],
    },
  ],
  5: [
    // Traumatología
    {
      id: 501,
      user: {
        nombre: 'Miguel',
        apellidos: 'Martín Jiménez',
        sexo: 'Hombre',
      },
      license: '78901-CM',
      centers: [1, 2],
    },
  ],
  6: [
    // Pediatría
    {
      id: 601,
      user: {
        nombre: 'Sofía',
        apellidos: 'Díaz Moreno',
        sexo: 'Mujer',
      },
      license: '89012-CM',
      centers: [1, 3],
    },
  ],
  7: [
    // Ginecología
    {
      id: 701,
      user: {
        nombre: 'Elena',
        apellidos: 'Álvarez Herrero',
        sexo: 'Mujer',
      },
      license: '90123-CM',
      centers: [1, 4],
    },
    {
      id: 702,
      user: {
        nombre: 'Isabel',
        apellidos: 'Gutiérrez Santos',
        sexo: 'Mujer',
      },
      license: '01234-CM',
      centers: [1],
    },
  ],
}

// Generar 10 días a partir de hoy para cada doctor
const generateAvailableDates = () => {
  const dates = []
  const today = new Date()

  for (let i = 1; i <= 10; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // No incluir fines de semana
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      dates.push(date.toISOString().split('T')[0])
    }
  }

  return dates
}

// Generar horarios para una fecha específica
const generateTimeSlots = () => {
  const slots = []
  const startHour = 9
  const endHour = 18

  for (let hour = startHour; hour < endHour; hour++) {
    if (hour === 14) continue // Hora de comida

    slots.push({
      id: `slot-${hour}`,
      startTime: `${hour.toString().padStart(2, '0')}:00:00`,
      duration: 30,
    })

    // Añadir slot de media hora
    slots.push({
      id: `slot-${hour}-30`,
      startTime: `${hour.toString().padStart(2, '0')}:30:00`,
      duration: 30,
    })
  }

  return slots
}

// Cargar centros médicos al iniciar (MOCKUP)
onMounted(async () => {
  loading.value = true

  // Simulación de llamada a API con timeout
  setTimeout(() => {
    medicalCenters.value = mockMedicalCenters
    loading.value = false
  }, 800)
})

// Tipos de cita disponibles
const appointmentTypes = [
  { value: 'IN_PERSON', label: formattedAppointmentType('IN_PERSON') },
  { value: 'PHONE', label: formattedAppointmentType('PHONE') },
]

// Cuando se selecciona un centro médico, cargar especialidades (MOCKUP)
const handleMedicalCenterChange = async () => {
  if (!appointment.value.medicalCenter) return

  loading.value = true
  specialties.value = []
  appointment.value.specialty = null
  appointment.value.doctor = null
  appointment.value.date = null
  appointment.value.slot = null

  // Simulación de llamada a API con timeout
  setTimeout(() => {
    specialties.value = mockSpecialtiesByCenter[appointment.value.medicalCenter] || []
    loading.value = false
  }, 800)
}

// Cuando se selecciona una especialidad, cargar médicos (MOCKUP)
const handleSpecialtyChange = async () => {
  if (!appointment.value.specialty || !appointment.value.medicalCenter) return

  loading.value = true
  doctors.value = []
  appointment.value.doctor = null
  appointment.value.date = null
  appointment.value.slot = null

  // Simulación de llamada a API con timeout
  setTimeout(() => {
    // Filtramos doctores por especialidad y centro médico
    const specialtyDoctors = mockDoctors[appointment.value.specialty] || []
    doctors.value = specialtyDoctors.filter((doctor) =>
      doctor.centers.includes(appointment.value.medicalCenter),
    )
    loading.value = false
  }, 800)
}

// Cuando se selecciona un médico, cargar fechas disponibles (MOCKUP)
const handleDoctorChange = async () => {
  if (!appointment.value.doctor) return

  loading.value = true
  availableDates.value = []
  appointment.value.date = null
  appointment.value.slot = null

  // Simulación de llamada a API con timeout
  setTimeout(() => {
    availableDates.value = generateAvailableDates()
    loading.value = false
  }, 800)
}

// Cuando se selecciona una fecha, cargar slots disponibles (MOCKUP)
const handleDateChange = async () => {
  if (!appointment.value.date || !appointment.value.doctor) return

  loading.value = true
  availableSlots.value = []
  appointment.value.slot = null

  // Simulación de llamada a API con timeout
  setTimeout(() => {
    availableSlots.value = generateTimeSlots()
    loading.value = false
  }, 800)
}

// Formatear hora para mostrar
const formatTime = (time) => {
  return time ? time.slice(0, 5) : ''
}

// Validar cada paso antes de avanzar
const validateStep = () => {
  if (step.value === 1) {
    return !!appointment.value.medicalCenter
  } else if (step.value === 2) {
    return !!appointment.value.specialty
  } else if (step.value === 3) {
    return !!appointment.value.doctor
  } else if (step.value === 4) {
    return !!appointment.value.date && !!appointment.value.slot
  } else if (step.value === 5) {
    return !!appointment.value.reason && !!appointment.value.type
  }
  return true
}

// Avanzar al siguiente paso
const nextStep = () => {
  if (validateStep()) {
    step.value++
  } else {
    Notify.create({
      type: 'negative',
      message: 'Por favor, complete todos los campos requeridos',
    })
  }
}

// Retroceder al paso anterior
const prevStep = () => {
  step.value--
}

// Enviar el formulario (MOCKUP)
const submitForm = () => {
  if (validateStep()) {
    Notify.create({
      type: 'positive',
      message: 'Cita creada correctamente (simulación)',
    })
    console.log('Datos de la cita:', appointment.value)
    emit('form:submit', appointment.value)
  } else {
    Notify.create({
      type: 'negative',
      message: 'Por favor, complete todos los campos requeridos',
    })
  }
}
</script>

<template>
  <q-stepper v-model="step" contracted flat done-color="green" animated>
    <!-- Paso 1: Selección de centro médico -->
    <q-step :name="1" title="Centro médico" icon="local_hospital" :done="step > 1">
      <div class="text-h6 q-mb-md">¿A qué centro médico deseas acudir?</div>

      <q-select
        v-model="appointment.medicalCenter"
        :options="medicalCenters"
        option-value="id"
        option-label="name"
        label="Centro médico"
        :rules="[(val) => !!val || 'El centro médico es obligatorio']"
        emit-value
        map-options
        filled
        @update:model-value="handleMedicalCenterChange"
        :loading="loading"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="local_hospital" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
              <q-item-label caption>{{ scope.opt.address }}, {{ scope.opt.city }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Cancelar"
            color="primary"
            outline
            @click="emit('form:cancel')"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            @click="nextStep"
            :disable="!appointment.medicalCenter"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 2: Selección de especialidad -->
    <q-step :name="2" title="Especialidad" icon="medical_services" :done="step > 2">
      <div class="text-h6 q-mb-md">¿Qué especialidad médica necesitas?</div>

      <q-select
        v-model="appointment.specialty"
        :options="specialties"
        option-value="id"
        option-label="name"
        label="Especialidad"
        :rules="[(val) => !!val || 'La especialidad es obligatoria']"
        emit-value
        map-options
        filled
        @update:model-value="handleSpecialtyChange"
        :loading="loading"
      />

      <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="prevStep"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            @click="nextStep"
            :disable="!appointment.specialty"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 3: Selección de médico -->
    <q-step :name="3" title="Doctor" icon="person" :done="step > 3">
      <div class="text-h6 q-mb-md">Selecciona el médico de tu preferencia</div>

      <q-select
        v-model="appointment.doctor"
        :options="doctors"
        option-value="id"
        option-label="user.nombre"
        label="Médico"
        :rules="[(val) => !!val || 'El médico es obligatorio']"
        emit-value
        map-options
        filled
        @update:model-value="handleDoctorChange"
        :loading="loading"
      >
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section avatar>
              <q-avatar>
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ scope.opt.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.' }}
                {{ scope.opt.user.nombre }} {{ scope.opt.user.apellidos }}
              </q-item-label>
              <q-item-label caption> Nº Colegiado: {{ scope.opt.license }} </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="prevStep"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            @click="nextStep"
            :disable="!appointment.doctor"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 4: Selección de fecha y hora -->
    <q-step :name="4" title="Fecha y hora" icon="event" :done="step > 4">
      <div class="text-h6 q-mb-md">¿Cuándo quieres tu cita?</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-select
            v-model="appointment.date"
            :options="availableDates"
            label="Fecha disponible"
            :rules="[(val) => !!val || 'La fecha es obligatoria']"
            filled
            @update:model-value="handleDateChange"
            :loading="loading"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    {{
                      new Date(scope.opt).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <div v-if="appointment.date">
                {{
                  new Date(appointment.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                }}
              </div>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="appointment.slot"
            :options="availableSlots"
            option-value="id"
            label="Hora disponible"
            :rules="[(val) => !!val || 'La hora es obligatoria']"
            emit-value
            map-options
            filled
            :loading="loading"
            :disable="!appointment.date"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ formatTime(scope.opt.startTime) }}</q-item-label>
                  <q-item-label caption> Duración: {{ scope.opt.duration }} min </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <div v-if="appointment.slot">
                {{ formatTime(availableSlots.find((s) => s.id === appointment.slot)?.startTime) }}
              </div>
            </template>
          </q-select>
        </div>
      </div>

      <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="prevStep"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            @click="nextStep"
            :disable="!appointment.date || !appointment.slot"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 5: Detalles finales -->
    <q-step :name="5" title="Detalles" icon="info" :done="step > 5">
      <div class="text-h6 q-mb-md">Detalles de la cita</div>

      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-input
            v-model="appointment.reason"
            label="Motivo de la consulta"
            :rules="[(val) => !!val || 'El motivo de la consulta es obligatorio']"
            filled
            type="textarea"
            hint="Por favor, describe brevemente el motivo de tu consulta"
          />
        </div>

        <div class="col-12">
          <q-select
            v-model="appointment.type"
            :options="appointmentTypes"
            option-value="value"
            option-label="label"
            label="Tipo de cita"
            :rules="[(val) => !!val || 'El tipo de cita es obligatorio']"
            emit-value
            map-options
            filled
          />
        </div>
      </div>

      <q-card bordered flat class="q-mt-md bg-grey-1">
        <q-card-section>
          <div class="text-subtitle1">Resumen de la cita</div>
          <q-list dense separator>
            <q-item v-if="appointment.medicalCenter">
              <q-item-section>
                <q-item-label>Centro médico</q-item-label>
                <q-item-label caption>
                  {{ medicalCenters.find((c) => c.id === appointment.medicalCenter)?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="appointment.specialty">
              <q-item-section>
                <q-item-label>Especialidad</q-item-label>
                <q-item-label caption>
                  {{ specialties.find((s) => s.id === appointment.specialty)?.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="appointment.doctor">
              <q-item-section>
                <q-item-label>Médico</q-item-label>
                <q-item-label caption>
                  {{
                    doctors.find((d) => d.id === appointment.doctor)?.user?.sexo === 'Mujer'
                      ? 'Dra.'
                      : 'Dr.'
                  }}
                  {{ doctors.find((d) => d.id === appointment.doctor)?.user?.nombre }}
                  {{ doctors.find((d) => d.id === appointment.doctor)?.user?.apellidos }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="appointment.date">
              <q-item-section>
                <q-item-label>Fecha</q-item-label>
                <q-item-label caption>
                  {{
                    new Date(appointment.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="appointment.slot">
              <q-item-section>
                <q-item-label>Hora</q-item-label>
                <q-item-label caption>
                  {{ formatTime(availableSlots.find((s) => s.id === appointment.slot)?.startTime) }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="appointment.type">
              <q-item-section>
                <q-item-label>Tipo de cita</q-item-label>
                <q-item-label caption>
                  {{ formattedAppointmentType(appointment.type) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="prevStep"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="check"
            label="Confirmar cita"
            color="primary"
            @click="submitForm"
            :disable="!appointment.reason || !appointment.type"
          />
        </div>
      </div>
    </q-step>
  </q-stepper>
</template>

<style lang="scss" scoped>
.q-card {
  border-radius: 8px;
}

.q-list {
  background-color: white;
  border-radius: 4px;
}
</style>
