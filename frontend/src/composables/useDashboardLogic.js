import { ref, computed } from "vue";
import { store } from "../eventStore.js";
import { useAccountLogic } from "./useAccountLogic.js";

export function useDashboardLogic() {
  const { user } = useAccountLogic();

  // --- STATE ---
  const firstName = computed(() => user.value.firstName || "User");
  const lastName = computed(() => user.value.lastName || "");
  const selectedFolderId = ref(null);
  const isDataLoaded = ref(false);

  // --- HELPERS ---
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const getDayName = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short" });

  // --- METHODS ---
  const selectFolder = (folderId) => {
    selectedFolderId.value =
      selectedFolderId.value === folderId ? null : folderId;
  };

  // --- COMPUTED PROPERTIES ---
  const avatar = computed(() => user.value.avatar);

  // Always use normalized dates
  const normalizedEvents = computed(() =>
    store.events.map((e) => ({
      ...e,
      date: e.date.split("T")[0], // remove time if exists
    }))
  );

  const plannerFolders = computed(() => store.folders);
  const displayedFolders = computed(() => plannerFolders.value.slice(0, 4));

  const plansInSelectedFolder = computed(() => {
  if (!selectedFolderId.value) return [];

  // handle both string/ObjectId comparisons
  return normalizedEvents.value
    .filter((event) => String(event.plannerId || event.folderId) === String(selectedFolderId.value))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

  const upcomingPlans = computed(() => {
    const todayStr = formatDate(new Date());
    return normalizedEvents.value
      .filter((event) => event.date >= todayStr)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  });

  const activeTasks = computed(() => {
    const plans = selectedFolderId.value
      ? plansInSelectedFolder.value
      : upcomingPlans.value;
    return plans.slice(0, 5);
  });

  const activeTaskTitle = computed(() => {
    if (!selectedFolderId.value) return "Upcoming Tasks (Next 5)";
    const selectedFolder = plannerFolders.value.find(
      (folder) => folder.id === selectedFolderId.value
    );
    return selectedFolder
      ? `${selectedFolder.name} Tasks`
      : "Tasks in Selected Planner";
  });

  const showTruncation = computed(() => {
    return selectedFolderId.value && plansInSelectedFolder.value.length > 5;
  });

  const truncationCount = computed(() => {
    return selectedFolderId.value
      ? plansInSelectedFolder.value.length - 5
      : 0;
  });

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d;
  };

  const weeklyTaskSummary = computed(() => {
    const startOfWeek = getStartOfWeek(new Date());

    const eventsByDate = normalizedEvents.value.reduce((acc, event) => {
      acc[event.date] = acc[event.date] || [];
      acc[event.date].push(event);
      return acc;
    }, {});

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateKey = formatDate(date);

      return {
        date: dateKey,
        dayOfMonth: date.getDate(),
        dayOfWeek: getDayName(date),
        isToday: date.toDateString() === new Date().toDateString(),
        tasks: eventsByDate[dateKey] || [],
      };
    });
  });

  // --- DATA LOADING ---
  const loadData = async () => {
    await store.loadData(); // load events & folders
    isDataLoaded.value = true;
  };

  loadData();

  return {
    firstName,
    lastName,
    avatar,
    displayedFolders,
    plannerFolders,
    selectedFolderId,
    selectFolder,
    plansInSelectedFolder,
    weeklyTaskSummary,
    activeTasks,
    activeTaskTitle,
    showTruncation,
    truncationCount,
    isDataLoaded,
  };
}
