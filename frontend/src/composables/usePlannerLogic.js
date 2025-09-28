import { ref, reactive } from 'vue';
import { store } from '../eventStore.js'; // Access to your global data store

/**
 * usePlannerLogic Composable
 * Handles all view state logic and actions for the Planner view.
 */
export function usePlannerLogic() {
  // --- STATE ---
  // Tracks the currently selected folder object for detail view.
  const selectedFolder = ref(null);

  // Controls the visibility of the Add Folder modal.
  const showAddFolderModal = ref(false);

  // Reactive object to capture new folder input data.
  const newFolder = reactive({
    name: "",
    color: "bg-gray-400",
  });

  // --- METHODS ---

  /**
   * Sets the selected folder and transitions the view to the detail mode.
   * @param {Object} folder - The folder object clicked by the user.
   */
  const handleFolderSelect = (folder) => {
    selectedFolder.value = folder;
  };

  /**
   * Clears the selected folder and returns the view to the list mode.
   */
  const backToList = () => {
    selectedFolder.value = null;
  };

  /**
   * Calls the store action to create a new folder and handles modal state.
   */
  const createFolder = async () => {
    if (!newFolder.name.trim()) return;

    // Use the store's async action to persist the new folder
    await store.addFolder(newFolder.name.trim(), newFolder.color);

    // Reset local state and close the modal
    newFolder.name = "";
    newFolder.color = "bg-gray-400";
    showAddFolderModal.value = false;
  };

  return {
    // State to be exposed to the template
    selectedFolder,
    showAddFolderModal,
    newFolder,

    // Methods to be exposed to the template
    handleFolderSelect,
    backToList,
    createFolder,
  };
}
