import { ref } from "vue";
import { defineStore } from "pinia";
import instance from "@stores/axios.js";
import { useNotificationStore } from "@stores/notificationStore.js";
import { useMedicalRecordStore } from "@stores/medicalRecordStore.js";
import { globalI18n } from "@/langs/index.js";

export const useRecipeStore = defineStore("recipe", () => {
  const recipes = ref([]);
  const selectedRecipe = ref(null);
  const selectedRecipeForEdit = ref(null);
  const currentPatientRecipes = ref([]);
  const error = ref(null);
  const loading = ref(false);
  const isLoadingRecipes = ref(false);
  const isEditingRecipe = ref(false);
  
  // ✅ UI state para modal de recetas
  const showRecipeFormModal = ref(false);

  const { t } = globalI18n;
  const notificationStore = useNotificationStore();

  // Recipe CRUD functions
  async function fetchRecipe(recipeId) {
    loading.value = true;
    error.value = null;
    try {
      const res = await instance.get(`/recipes/${recipeId}`);
      selectedRecipe.value = res.data;
      return res.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function fetchPatientRecipes(patientId) {
    isLoadingRecipes.value = true;
    error.value = null;
    try {
      const res = await instance.get(`/patients/${patientId}/recipes`);
      currentPatientRecipes.value = res.data;
      return res.data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoadingRecipes.value = false;
    }
  }

  async function createRecipe(recipeData) {
    loading.value = true;
    error.value = null;
    try {
      const res = await instance.post(`/recipes`, recipeData);
      
      if (res.data) {
        recipes.value.push(res.data);
      }
      
      notificationStore.addNotification(
        "success",
        "notifications.success",
        t("recipes.recipe-created")
      );
      
      return res.data;
    } catch (err) {
      error.value = err.message;
      notificationStore.addNotification(
        "error",
        "notifications.error",
        t("recipes.error-creating-recipe")
      );
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateRecipe(recipeId, recipeData) {
    loading.value = true;
    error.value = null;
    try {
      const res = await instance.patch(`/recipes/${recipeId}`, recipeData);
      
      // Actualizar en la lista
      const index = recipes.value.findIndex(r => r.id === recipeId);
      if (index !== -1 && res.data) {
        recipes.value[index] = { ...recipes.value[index], ...res.data };
      }
      
      notificationStore.addNotification(
        "success",
        "notifications.success",
        t("recipes.recipe-updated")
      );
      
      return res.data;
    } catch (err) {
      error.value = err.message;
      notificationStore.addNotification(
        "error",
        "notifications.error",
        t("recipes.error-updating-recipe")
      );
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteRecipe(recipeId) {
    loading.value = true;
    error.value = null;
    
    try {
      await instance.delete(`/recipes/${recipeId}`);
      
      // Eliminar de la lista
      recipes.value = recipes.value.filter(r => r.id !== recipeId);
      
      notificationStore.addNotification(
        "success",
        "notifications.success",
        t("notifications.recipe-deleted-successfully")
      );
      
      return true;
    } catch (err) {
      error.value = err.message;
      notificationStore.addNotification(
        "error",
        "notifications.error",
        t("notifications.error-deleting-recipe")
      );
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // ✅ High-level save handler
  async function handleRecipeSave(recipeData, patientId, selectedRecordId = null) {
    try {
      if (isEditingRecipe.value && selectedRecipeForEdit.value) {
        await updateRecipe(selectedRecipeForEdit.value.id, recipeData);
      } else {
        await createRecipe(recipeData);
      }

      // Recargar detalles del registro médico si existe
      if (selectedRecordId) {
        const medicalRecordStore = useMedicalRecordStore();
        await medicalRecordStore.fetchMedicalRecordDetails(selectedRecordId);
      }

      // Recargar recetas del paciente
      if (patientId) {
        await fetchPatientRecipes(patientId);
      }

      return true;
    } catch (error) {
      notificationStore.addNotification(
        "error",
        "general.error",
        "Error al guardar la receta: " + (error.message || "Error desconocido"),
      );
      throw error;
    }
  }

  // ✅ UI Modal functions
  function openRecipeFormModal(recipe = null) {
    selectedRecipeForEdit.value = recipe;
    isEditingRecipe.value = !!recipe;
    showRecipeFormModal.value = true;
  }

  function closeRecipeModal() {
    showRecipeFormModal.value = false;
    selectedRecipeForEdit.value = null;
    isEditingRecipe.value = false;
  }

  // Recipe state management
  function setRecipes(newRecipes) {
    recipes.value = newRecipes;
  }

  function setSelectedRecipe(recipe) {
    selectedRecipe.value = recipe;
  }

  function setSelectedRecipeForEdit(recipe) {
    selectedRecipeForEdit.value = recipe;
    isEditingRecipe.value = !!recipe;
  }

  function addRecipe(recipe) {
    recipes.value.push(recipe);
  }

  function updateRecipeInList(id, updatedRecipe) {
    const index = recipes.value.findIndex(r => r.id === id);
    if (index !== -1) {
      recipes.value[index] = { ...recipes.value[index], ...updatedRecipe };
    }
  }

  function removeRecipe(id) {
    recipes.value = recipes.value.filter(r => r.id !== id);
  }

  function clearSelectedRecipe() {
    selectedRecipe.value = null;
  }

  function clearSelectedRecipeForEdit() {
    selectedRecipeForEdit.value = null;
    isEditingRecipe.value = false;
  }

  function clearError() {
    error.value = null;
  }

  function reset() {
    recipes.value = [];
    selectedRecipe.value = null;
    selectedRecipeForEdit.value = null;
    currentPatientRecipes.value = [];
    loading.value = false;
    isLoadingRecipes.value = false;
    isEditingRecipe.value = false;
    showRecipeFormModal.value = false;
    error.value = null;
  }

  return {
    // state
    recipes,
    selectedRecipe,
    selectedRecipeForEdit,
    currentPatientRecipes,
    loading,
    isLoadingRecipes,
    isEditingRecipe,
    showRecipeFormModal,
    error,
    
    // actions
    fetchRecipe,
    fetchPatientRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    handleRecipeSave,
    
    // UI modal actions
    openRecipeFormModal,
    closeRecipeModal,
    
    // state management
    setRecipes,
    setSelectedRecipe,
    setSelectedRecipeForEdit,
    addRecipe,
    updateRecipeInList,
    removeRecipe,
    clearSelectedRecipe,
    clearSelectedRecipeForEdit,
    clearError,
    reset,
  };
});