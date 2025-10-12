import { ref, reactive, computed } from 'vue';
import { store } from '../eventStore.js';


export function usePlannerLogic() {
  const selectedFolder = ref(null); 
  const showAddFolderModal = ref(false); 
  const showAddEventModal = ref(false); 

 
  const newFolder = reactive({
    name: "",
    color: "bg-indigo-500",
  });

 
  const newEvent = reactive({
    title: "",
    date: "",
    folderId: null,
  });

 
  const events = ref([]); 


  const handleFolderSelect = (folder) => {
    selectedFolder.value = folder;
    events.value = store.events.filter(e => e.folderId === folder.id);
  };

  const backToList = () => {
    selectedFolder.value = null;
    events.value = [];
  };

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

  const createEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    if (!selectedFolder.value) {
      console.warn("Select a folder first!");
      return;
    }

    try {
      newEvent.folderId = selectedFolder.value.id;
      await store.addEvent(newEvent.title.trim(), newEvent.date, newEvent.folderId);

      events.value.push({ 
        id: store.events[store.events.length - 1].id, 
        title: newEvent.title, 
        date: newEvent.date, 
        folderId: newEvent.folderId 
      });

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
      if (!confirm(`Are you sure you want to delete the planner: "${folderName}"?\n\nThis action will PERMANENTLY delete the planner and ALL its plans. This action cannot be undone.`)) {
          return;
      }

      try {
          await store.deleteFolder(folderId);
          if (selectedFolder.value && selectedFolder.value._id === folderId) {
              backToList();
          }
          
          alert(`Planner "${folderName}" deleted successfully.`);
      } catch (error) {
          console.error("Failed to delete planner:", error);
          alert(error.message || "Failed to delete the planner. Check console for details.");
      }
  };

  const folderEvents = computed(() => {
    if (!selectedFolder.value) return [];
    return events.value.filter(e => e.folderId === selectedFolder.value.id);
  });

  return {
    selectedFolder,
    showAddFolderModal,
    showAddEventModal,
    newFolder,
    newEvent,
    events,
    folderEvents,
    
    handleFolderSelect,
    backToList,
    createFolder,
    createEvent,
    deletePlanner
  };
}
