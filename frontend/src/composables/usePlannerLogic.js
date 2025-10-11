import { ref, reactive, computed } from 'vue';
import { store } from '../eventStore.js'; // Your global store

/**
 * usePlannerLogic Composable
 * Handles all view state logic and actions for the Planner view.
 */
export function usePlannerLogic() {
  // --- STATE ---
  const selectedFolder = ref(null); // Tracks the currently selected folder
  const showAddFolderModal = ref(false); // Controls folder modal visibility
  const showAddEventModal = ref(false);  // Controls event modal visibility

  // Folder form state
  const newFolder = reactive({
    name: "",
    color: "bg-indigo-500",
  });

  // Event form state
  const newEvent = reactive({
    title: "",
    date: "",
    folderId: null,
  });

  // Reactive array for events
  const events = ref([]); // Local copy of store events

  // --- METHODS ---

  /**
   * Sets the selected folder and transitions the view to the folder detail mode.
   */
  const handleFolderSelect = (folder) => {
    selectedFolder.value = folder;
    // Filter events for this folder
    events.value = store.events.filter(e => e.folderId === folder.id);
  };

  /**
   * Clears the selected folder and returns to the folder list view.
   */
  const backToList = () => {
    selectedFolder.value = null;
    events.value = [];
  };

  /**
   * Creates a new folder and updates store/reactive state.
   */
  const createFolder = async () => {
    if (!newFolder.name.trim()) return;

    try {
      await store.addFolder(newFolder.name.trim(), newFolder.color);
      newFolder.name = "";
      newFolder.color = "bg-indigo-500";
      showAddFolderModal.value = false;
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  /**
   * Creates a new event and updates store/reactive state.
   */
  const createEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    if (!selectedFolder.value) {
      console.warn("Select a folder first!");
      return;
    }

    try {
      newEvent.folderId = selectedFolder.value.id;
      await store.addEvent(newEvent.title.trim(), newEvent.date, newEvent.folderId);

      // Update local events
      events.value.push({ 
        id: store.events[store.events.length - 1].id, 
        title: newEvent.title, 
        date: newEvent.date, 
        folderId: newEvent.folderId 
      });

      // Reset form + close modal
      newEvent.title = "";
      newEvent.date = "";
      newEvent.folderId = null;
      showAddEventModal.value = false;

    } catch (error) {
      console.error("Failed to create event:", error);
    }
  };

   /**
 * Deletes a folder (planner) by its ID after user confirmation.
 * @param {string} folderId The _id of the folder to delete.
 * @param {string} folderName The name of the folder for the confirmation message.
 */
  const deletePlanner = async (folderId, folderName) => {
      // 1. Final confirmation before deletion
      if (!confirm(`Are you sure you want to delete the planner: "${folderName}"?\n\nThis action will PERMANENTLY delete the planner and ALL its plans. This action cannot be undone.`)) {
          return; // User cancelled
      }

      try {
          // 2. Call the store to delete the folder and its events
          await store.deleteFolder(folderId);
          
          // Ensure the selectedFolder state is cleared if the deleted one was selected
          // We use folder._id for MongoDB documents
          if (selectedFolder.value && selectedFolder.value._id === folderId) {
              backToList();
          }
          
          alert(`Planner "${folderName}" deleted successfully.`);
      } catch (error) {
          console.error("Failed to delete planner:", error);
          alert(error.message || "Failed to delete the planner. Check console for details.");
      }
  };

  /**
   * Computed to get events for the selected folder
   */
  const folderEvents = computed(() => {
    if (!selectedFolder.value) return [];
    return events.value.filter(e => e.folderId === selectedFolder.value.id);
  });

  return {
    // State exposed to template
    selectedFolder,
    showAddFolderModal,
    showAddEventModal,
    newFolder,
    newEvent,
    events,
    folderEvents,

    // Methods exposed to template
    handleFolderSelect,
    backToList,
    createFolder,
    createEvent,
    deletePlanner
  };
}
