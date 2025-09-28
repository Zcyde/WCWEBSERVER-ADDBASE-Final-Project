import { ref, computed } from "vue";
import { store } from "../eventStore.js";

export function useDashboardLogic() {
  // --- STATE ---
  const firstName = ref("Marlon");
  const lastName = ref("Garcia Michael");
  const selectedFolderId = ref(null);
  const isDataLoaded = ref(false);

  // --- HELPERS ---
  const formatDate = (date) => date.toISOString().split("T")[0];
  const getDayName = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short" });

  // --- METHODS ---
  const selectFolder = (folderId) => {
    selectedFolderId.value =
      selectedFolderId.value === folderId ? null : folderId;
  };

  // --- COMPUTED PROPERTIES ---
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
    return normalizedEvents.value
      .filter((event) => event.folderId === selectedFolderId.value)
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
    return selectedFolderId.value
      ? "Tasks in Selected Planner"
      : "Upcoming Tasks (Next 5)";
  });

  const showTruncation = computed(() => {
    return selectedFolderId.value && plansInSelectedFolder.value.length > 5;
  });

  const truncationCount = computed(() => {
    return selectedFolderId.value
      ? plansInSelectedFolder.value.length - 5
      : 0;
  });

  const weeklyTaskSummary = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventsByDate = normalizedEvents.value.reduce((acc, event) => {
      acc[event.date] = acc[event.date] || [];
      acc[event.date].push(event);
      return acc;
    }, {});

    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = formatDate(date);

      return {
        date: dateKey,
        dayOfMonth: date.getDate(),
        dayOfWeek: getDayName(date),
        isToday: i === 0,
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
