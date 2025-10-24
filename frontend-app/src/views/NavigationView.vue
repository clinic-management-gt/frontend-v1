<template>
  <div>
    <!-- Barra lateral y navegación principal de la app -->
    <TransitionRoot
      as="template"
      :show="sidebarOpen"
    >
      <Dialog
        class="relative z-50 lg:hidden"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/80"></div>
        </TransitionChild>
        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
              <TransitionChild
                as="template"
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  class="absolute left-full top-0 flex w-16 justify-center pt-5"
                >
                  <button
                    type="button"
                    class="-m-2.5 p-2.5"
                    @click="sidebarOpen = false"
                  >
                    <span class="sr-only">Close sidebar</span>
                    <XMarkIcon
                      class="size-6 text-white"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div
                class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-color px-6 pb-4"
              >
                <div
                  class="flex h-18 shrink-0 mt-2 items-center bg-white rounded-full"
                >
                  <img
                    class="h-16 w-auto mx-auto"
                    src="/logo-gastro.png"
                    alt="Logo Gastro"
                  />
                </div>
                <nav class="flex flex-1 flex-col">
                  <NavigationBar />
                </nav>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Barra lateral estática para escritorio -->
    <!-- Barra lateral estática para escritorio -->
    <div
      class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
      data-testid="sidebar-desktop"
    >
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-color align-center justify-center min-h-screen px-6 pb-4"
      >
        <div class="flex h-18 shrink-0 items-center bg-white mt-2 rounded-full">
          <img
            class="h-16 w-auto mx-auto"
            src="/logo-gastro.png"
            alt="Logo Gastro"
          />
        </div>
        <nav class="flex flex-1 flex-col">
          <NavigationBar />
        </nav>
      </div>
    </div>

    <!-- Barra superior y contenido principal -->
    <div class="lg:pl-72">
      <div
        class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 mt-2 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8"
      >
        <button
          type="button"
          class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon
            class="size-6"
            aria-hidden="true"
          />
        </button>

        <div
          class="h-6 w-px bg-gray-900/10 lg:hidden"
          aria-hidden="true"
        ></div>

        <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <form
            class="grid flex-1 grid-cols-1 justify-center items-center"
            action="#"
            method="GET"
          >
            <ComboBoxAutocompleteInputSearchPatient
              v-model:currentSelected="currentPatientSelectedId"
              :data="allPatients"
              class="col-start-1 row-start-1 block w-full bg-white pl-8 text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6"
              :placeholder="$t('general.search-patient')"
              @update:current-selected="handlePatientSelection"
            />
            <MagnifyingGlassIcon
              class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
              aria-hidden="true"
            />
          </form>
          <PlusCircleIcon
            class="cursor-pointer col-start-1 row-start-1 size-10 self-center text-patient-page-color"
            aria-hidden="true"
            @click="openCreateFormDialog()"
          />
          <div class="flex items-center gap-x-4 lg:gap-x-6">
            <div
              class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
              aria-hidden="true"
            ></div>

            <!-- Menú de perfil de usuario -->
            <Menu
              as="div"
              class="relative"
            >
              <MenuButton class="-m-1.5 flex items-center p-1.5">
                <span class="hidden lg:flex lg:items-center">
                  <span class="ml-4 text-sm/6 font-semibold text-gray-900">
                    {{ greeting }}
                  </span>
                  <ChevronDownIcon
                    class="ml-2 size-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </MenuButton>
              <transition
                enterActiveClass="transition ease-out duration-100"
                enterFromClass="transform opacity-0 scale-95"
                enterToClass="transform opacity-100 scale-100"
                leaveActiveClass="transition ease-in duration-75"
                leaveFromClass="transform opacity-100 scale-100"
                leaveToClass="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <button
                      type="button"
                      :class="[
                        active ? 'bg-gray-50' : '',
                        'w-full text-left px-3 py-1 text-sm/6 text-gray-900',
                      ]"
                      @click="item.action()"
                    >
                      {{ $t(item.name) }}
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="h-[calc(100vh-5rem)] overflow-auto">
        <div class="h-full">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import ComboBoxAutocompleteInputSearchPatient from "@components/forms/ComboBoxAutocompleteInputSearchPatient.vue";
import { usePatientsLogicStore } from "@stores/patientsLogicStore";
import { usePatientsStore } from "@/stores/patientsStore";
import { useAuthStore } from "@/stores/authStore";

const patientsStore = usePatientsStore();
const { allPatients, currentPatientSelectedId } = storeToRefs(patientsStore);

const patientsLogicStore = usePatientsLogicStore();
const { openCreateFormDialog } = patientsLogicStore;

const router = useRouter();
const authStore = useAuthStore();

function handlePatientSelection(patientId) {
  if (patientId) {
    router.push("/patients");
  }
}

onMounted(async () => {
  if (!allPatients.value || allPatients.value.length === 0) {
    await patientsStore.fetchAllPatients();
  }
});

const greeting = computed(() => {
  const u = authStore.user;
  return u ? `${u.first_name} ${u.last_name}` : "";
});

const userNavigation = [
  {
    name: "login.your-profile",
    action: () => router.push("/profile"),
  },
  {
    name: "login.logout",
    action: () => {
      authStore.logout();
      router.push("/login");
    },
  },
];

const sidebarOpen = ref(false);
</script>
