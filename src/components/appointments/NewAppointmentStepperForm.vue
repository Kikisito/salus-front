<script lang="ts" setup>
import type { PropType } from 'vue'
import { ref, onMounted, computed } from 'vue'
import { Notify } from 'quasar'
import { formattedAppointmentType } from 'src/helpers/formattedAppointmentType'
import type { Specialty } from 'src/interfaces/Specialty'
import type { MedicalCenter } from 'src/interfaces/MedicalCenter'
import type { MedicalProfile } from 'src/interfaces/MedicalProfile'
import type { AppointmentSlot } from 'src/interfaces/AppointmentSlot'
import type { AppointmentRequest } from 'src/interfaces/AppointmentRequest'

const props = defineProps({
  getSpecialties: {
    type: Function as PropType<(search?: string) => Promise<Specialty[]>>,
    required: true,
  },
  getMedicalCenters: {
    type: Function as PropType<(specialty: Specialty, search?: string) => Promise<MedicalCenter[]>>,
    required: true,
  },
  getDoctors: {
    type: Function as PropType<
      (
        medicalCenter: MedicalCenter,
        specialty: Specialty,
        search?: string,
      ) => Promise<MedicalProfile[]>
    >,
    required: true,
  },
  getAvailableSlots: {
    type: Function as PropType<
      (
        medicalCenter: MedicalCenter,
        specialty: Specialty,
        doctor: MedicalProfile,
        date: Date,
      ) => Promise<AppointmentSlot[]>
    >,
    required: true,
  },
})

const emit = defineEmits(['form:submit', 'form:cancel'])

// Estado del stepper
const step = ref(1)
const loading = ref(false)

// Datos cargados de las API
const medicalCenters = ref<MedicalCenter[]>([])
const specialties = ref<Specialty[]>([])
const doctors = ref<MedicalProfile[]>([])
const allSlots = ref<AppointmentSlot[]>([])

const availableDates = computed(() => {
  if (!allSlots.value.length) return []

  const dates = allSlots.value.map((slot) => new Date(slot.date).toDateString())
  const uniqueDates = Array.from(new Set(dates))

  return uniqueDates.map((date) => new Date(date))
})

const availableSlots = computed(() => {
  if (!selectedDate.value) return []

  return allSlots.value.filter((slot) => {
    const slotDate = new Date(slot.date).toDateString()
    return slotDate === selectedDate.value.toDateString()
  })
})

// Datos seleccionados (para usarlos las llamadas de API)
const selectedSpecialty = ref<Specialty>(null as unknown as Specialty)
const selectedCenter = ref<MedicalCenter>(null as unknown as MedicalCenter)
const selectedDoctor = ref<MedicalProfile>(null as unknown as MedicalProfile)
const selectedDate = ref<Date>(null as unknown as Date)
const selectedSlot = ref<AppointmentSlot>(null as unknown as AppointmentSlot)
const reason = ref<string>('')
const appointmentType = ref<string>('')

// Validaciones
const specialtySelect = ref()
const specialtyError = ref(false)

const medicalCenterSelect = ref()
const medicalCenterError = ref(false)

const doctorSelect = ref()
const doctorError = ref(false)

// Tipos de cita disponibles
const appointmentTypes = [
  { value: 'IN_PERSON', label: formattedAppointmentType('IN_PERSON') },
  { value: 'PHONE', label: formattedAppointmentType('PHONE') },
]

// Cargar especialidades al iniciar
onMounted(async () => {
  try {
    loading.value = true
    const response = await props.getSpecialties()

    specialties.value = response
  } finally {
    loading.value = false
  }
})

async function filterSpecialties(
  value: string,
  done: (callbackFn: () => void) => void,
  abort: () => void,
) {
  const foundSpecialties = await props.getSpecialties(value)

  if (foundSpecialties.length > 0) {
    done(() => {
      specialties.value = foundSpecialties
    })
  } else {
    Notify.create({
      type: 'negative',
      message: 'No se ha encontrado ninguna especialidad con ese nombre',
    })

    abort()
  }
}

async function submitSpecialty() {
  if (!selectedSpecialty.value) {
    Notify.create({
      type: 'negative',
      message: 'Por favor, selecciona una especialidad médica',
    })
    return
  }

  try {
    loading.value = true
    const response = await props.getMedicalCenters(selectedSpecialty.value)

    medicalCenters.value = response

    // Se puede dar el caso de que no haya centros médicos disponibles para la especialidad seleccionada
    // en ese caso, se muestra un mensaje de error
    if (!response.length) {
      specialtyError.value = true
      specialtySelect.value.validate()

      Notify.create({
        type: 'negative',
        message:
          'No queda ninguna cita disponible para la especialidad seleccionada. Vuelve a intentarlo más tarde',
        timeout: 15000,
      })
    } else {
      selectedCenter.value = null as unknown as MedicalCenter
      step.value = 2
    }
  } finally {
    loading.value = false
  }
}

async function filterMedicalCenters(
  value: string,
  done: (callbackFn: () => void) => void,
  abort: () => void,
) {
  const foundMedicalCenters = await props.getMedicalCenters(selectedSpecialty.value, value)

  if (foundMedicalCenters.length > 0) {
    done(() => {
      medicalCenters.value = foundMedicalCenters
    })
  } else {
    Notify.create({
      type: 'negative',
      message: 'No se ha encontrado ningún centro médico con ese nombre',
    })

    abort()
  }
}

async function submitMedicalCenter() {
  if (!selectedCenter.value) {
    Notify.create({
      type: 'negative',
      message: 'Por favor, selecciona un centro médico',
    })
    return
  }

  try {
    loading.value = true
    const response = await props.getDoctors(selectedCenter.value, selectedSpecialty.value)
    doctors.value = response

    // Se puede dar el caso de que no haya médicos disponibles para el centro médico seleccionado
    // en ese caso, se muestra un mensaje de error
    // Por ejemplo, alguien ha ocupado la última cita disponible mientras el usuario estaba pidiendo la cita
    if (!response.length) {
      medicalCenterError.value = true
      medicalCenterSelect.value.validate()

      Notify.create({
        type: 'negative',
        message:
          'No queda ninguna cita disponible para el centro médico seleccionado. Vuelve a intentarlo más tarde',
        timeout: 15000,
      })
    } else {
      selectedDoctor.value = null as unknown as MedicalProfile
      step.value = 3
    }
  } finally {
    loading.value = false
  }
}

async function submitDoctor() {
  if (!selectedDoctor.value) {
    Notify.create({
      type: 'negative',
      message: 'Por favor, selecciona un médico',
    })
    return
  }

  try {
    loading.value = true
    const response = await props.getAvailableSlots(
      selectedCenter.value,
      selectedSpecialty.value,
      selectedDoctor.value,
      new Date(),
    )

    allSlots.value = response

    // Se puede dar el caso de que no haya citas disponibles para el médico seleccionado
    // en ese caso, se muestra un mensaje de error
    if (!response.length) {
      doctorError.value = true
      doctorSelect.value.validate()

      Notify.create({
        type: 'negative',
        message:
          'No queda ninguna cita disponible para el médico seleccionado. Vuelve a intentarlo más tarde',
        timeout: 15000,
      })
    } else {
      selectedDate.value = null as unknown as Date
      selectedSlot.value = null as unknown as AppointmentSlot
      step.value = 4
    }
  } finally {
    loading.value = false
  }
}

async function submitAppointmentSlot() {
  if (!selectedSlot.value) {
    Notify.create({
      type: 'negative',
      message: 'Por favor, selecciona una hora',
    })
    return
  }

  try {
    loading.value = true
    step.value = 5
  } finally {
    loading.value = false
  }
}

async function clearSelectedSlot() {
  selectedSlot.value = null as unknown as AppointmentSlot
}

async function submitForm() {
  const appointmentRequest: Partial<AppointmentRequest> = {
    appointmentSlot: selectedSlot.value.id,
    reason: reason.value,
    type: appointmentType.value,
  }

  emit('form:submit', appointmentRequest)
}
</script>

<template>
  <q-stepper v-model="step" contracted flat done-color="green" animated>
    <!-- Paso 1: Selección de especialidad -->
    <q-step :name="1" title="Especialidad" icon="medical_services" :done="step > 1">
      <div class="text-body1 q-mb-md">¿Qué especialidad médica necesitas?</div>

      <q-select
        v-model="selectedSpecialty"
        ref="specialtySelect"
        :options="specialties"
        option-value="value"
        option-label="name"
        label="Especialidad"
        :rules="[
          (val) => !!val || 'La especialidad es obligatoria',
          () =>
            !specialtyError ||
            'No hay citas disponibles para esta especialidad. Vuelve a intentarlo más tarde',
        ]"
        emit-value
        map-options
        filled
        :loading="loading"
        use-input
        input-debounce="300"
        @filter="filterSpecialties"
        @update:model-value="specialtyError = false"
      />

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="close"
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
            :disable="!selectedSpecialty"
            @click="submitSpecialty()"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 2: Selección de centro médico -->
    <q-step :name="2" title="Centro médico" icon="local_hospital" :done="step > 2">
      <div class="text-body1 q-mb-md">
        Centros médicos disponibles para la especialidad seleccionada
      </div>

      <q-select
        v-model="selectedCenter"
        :options="medicalCenters"
        option-value="value"
        option-label="name"
        label="Centro médico"
        :rules="[
          (val) => !!val || 'El centro médico es obligatorio',
          () =>
            !medicalCenterError ||
            'No hay citas disponibles para este centro médico. Vuelve a intentarlo más tarde',
        ]"
        emit-value
        map-options
        filled
        :loading="loading"
        use-input
        input-debounce="300"
        @filter="filterMedicalCenters"
      />

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="step = 1"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            :disable="!selectedCenter"
            @click="submitMedicalCenter()"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 3: Selección de médico -->
    <q-step :name="3" title="Doctor" icon="person" :done="step > 3">
      <div class="text-body1 q-mb-md">Selecciona el médico de tu preferencia</div>

      <q-select
        v-model="selectedDoctor"
        ref="doctorSelect"
        :options="doctors"
        option-value="value"
        :option-label="(doctor) => doctor.user.nombre + ' ' + doctor.user.apellidos"
        label="Médico"
        :rules="[
          (val) => !!val || 'El médico es obligatorio',
          () =>
            !doctorError ||
            'No hay citas disponibles para este médico. Vuelve a intentarlo más tarde',
        ]"
        emit-value
        map-options
        filled
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

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="step = 2"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            :disable="!selectedDoctor"
            @click="submitDoctor()"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 4: Selección de fecha y hora -->
    <q-step :name="4" title="Fecha y hora" icon="event" :done="step > 4">
      <div class="text-body1 q-mb-md">¿Cuándo quieres tu cita?</div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-select
            v-model="selectedDate"
            :options="availableDates"
            label="Fecha de la cita"
            :rules="[(val) => !!val || 'La fecha es obligatoria']"
            filled
            :loading="loading"
            @update:model-value="clearSelectedSlot()"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    {{
                      new Date(scope.opt).toLocaleDateString(undefined, {
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
              <div v-if="selectedDate">
                {{
                  new Date(selectedDate).toLocaleDateString(undefined, {
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
            v-model="selectedSlot"
            :options="availableSlots"
            option-value="value"
            :option-label="(slot) => slot.startTime.slice(0, 5)"
            label="Hora de la cita"
            :rules="[(val) => !!val || 'La hora es obligatoria']"
            emit-value
            map-options
            filled
            :loading="loading"
            :disable="!selectedDate"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.startTime.slice(0, 5) }}</q-item-label>
                  <q-item-label caption>
                    {{
                      new Date(selectedDate).toLocaleDateString(undefined, {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="step = 3"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            :disable="!selectedDate || !selectedSlot"
            @click="submitAppointmentSlot()"
          />
        </div>
      </div>
    </q-step>

    <!-- Paso 5: Detalles finales -->
    <q-step :name="5" title="Detalles" icon="info" :done="step > 5">
      <div class="text-body1 q-mb-md">Detalles de la cita</div>

      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-input
            v-model="reason"
            label="Motivo de la consulta"
            filled
            type="textarea"
            hint="Por favor, describe brevemente el motivo de tu consulta"
          />
        </div>

        <div class="col-12">
          <q-select
            v-model="appointmentType"
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

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="step = 4"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="chevron_right"
            label="Siguiente"
            color="primary"
            :disable="!appointmentType"
            @click="step = 6"
          />
        </div>
      </div>
    </q-step>

    <q-step :name="6" title="Resumen" icon="check_circle" :done="step > 6">
      <div class="text-body1 q-mb-md">Resumen de la cita</div>
      <q-list separator>
        <q-item v-if="selectedCenter">
          <q-item-section>
            <q-item-label>Centro médico</q-item-label>
            <q-item-label caption>
              {{ selectedCenter.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="selectedSpecialty">
          <q-item-section>
            <q-item-label>Especialidad</q-item-label>
            <q-item-label caption>
              {{ selectedSpecialty.name }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="selectedDoctor">
          <q-item-section>
            <q-item-label>Médico</q-item-label>
            <q-item-label caption>
              {{ selectedDoctor.user.sexo === 'Mujer' ? 'Dra.' : 'Dr.' }}
              {{ selectedDoctor.user.nombre }} {{ selectedDoctor.user.apellidos }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="selectedDate">
          <q-item-section>
            <q-item-label>Fecha</q-item-label>
            <q-item-label caption>
              {{
                new Date(selectedDate).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="selectedSlot">
          <q-item-section>
            <q-item-label>Hora</q-item-label>
            <q-item-label caption>
              {{ allSlots.find((s) => s.id === selectedSlot.id)?.startTime.slice(0, 5) }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="reason">
          <q-item-section>
            <q-item-label>Motivo de la consulta</q-item-label>
            <q-item-label caption>
              {{ reason }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="appointmentType">
          <q-item-section>
            <q-item-label>Tipo de cita</q-item-label>
            <q-item-label caption>
              {{ formattedAppointmentType(appointmentType) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon="chevron_left"
            label="Volver"
            color="primary"
            outline
            @click="step = 5"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-btn
            class="full-width"
            icon-right="check"
            label="Confirmar cita"
            color="primary"
            @click="submitForm()"
            :disable="!appointmentType"
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
