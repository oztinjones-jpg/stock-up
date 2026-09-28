"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { newId } from "./labels";
import { createSeedState, listLineForItem } from "./seed";
import { clearState, loadState, saveState } from "./storage";
import {
  MEMBERS,
  type AppState,
  type KitchenItem,
  type LineOutcome,
  type ListLine,
  type LocationId,
  type ShopRecord,
  type StockLevel,
} from "./types";

type Status = "loading" | "ready" | "error";

interface HouseholdContextValue {
  status: Status;
  errorMessage: string | null;
  state: AppState;
  currentMemberName: string;
  setCurrentMember: (id: string) => void;
  setItemStock: (itemId: string, stock: StockLevel) => void;
  addItem: (input: {
    name: string;
    location: LocationId;
    stock: StockLevel;
  }) => void;
  updateItem: (
    itemId: string,
    input: { name: string; location: LocationId; stock: StockLevel },
  ) => void;
  removeItem: (itemId: string) => void;
  addNeededToList: (input: { name: string; location: LocationId }) => void;
  removeFromList: (lineId: string) => void;
  setLineOutcome: (lineId: string, outcome: LineOutcome) => void;
  finishShop: () => boolean;
  restoreDemo: () => void;
}

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

function reasonFromStock(stock: StockLevel): ListLine["reason"] {
  if (stock === "out") return "out";
  if (stock === "low") return "low";
  return "needed";
}

function syncListForStock(
  list: ListLine[],
  item: KitchenItem,
): ListLine[] {
  const existing = list.find((line) => line.itemId === item.id);
  if (item.stock === "plenty") {
    if (!existing) return list;
    if (existing.reason === "needed" || existing.reason === "rolled") {
      return list;
    }
    return list.filter((line) => line.id !== existing.id);
  }
  if (existing) {
    return list.map((line) =>
      line.id === existing.id
        ? {
            ...line,
            name: item.name,
            location: item.location,
            reason:
              existing.reason === "rolled" || existing.reason === "needed"
                ? existing.reason
                : reasonFromStock(item.stock),
          }
        : line,
    );
  }
  return [...list, listLineForItem(item)];
}

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [state, setState] = useState<AppState>(createSeedState);

  useEffect(() => {
    try {
      const loaded = loadState();
      // localStorage is an external store; hydrate after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- browser storage hydrate
      setState(loaded);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not open the kitchen list.",
      );
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    try {
      saveState(state);
    } catch {
      toast.error("Could not save. Check that this browser allows storage.");
    }
  }, [state, status]);

  const update = useCallback((updater: (current: AppState) => AppState) => {
    setState((current) => updater(current));
  }, []);

  const setCurrentMember = useCallback(
    (id: string) => {
      update((current) => ({ ...current, currentMemberId: id }));
    },
    [update],
  );

  const setItemStock = useCallback(
    (itemId: string, stock: StockLevel) => {
      update((current) => {
        const item = current.items.find((entry) => entry.id === itemId);
        if (!item) return current;
        const nextItem = { ...item, stock };
        return {
          ...current,
          items: current.items.map((entry) =>
            entry.id === itemId ? nextItem : entry,
          ),
          currentList: syncListForStock(current.currentList, nextItem),
        };
      });
    },
    [update],
  );

  const addItem = useCallback(
    (input: { name: string; location: LocationId; stock: StockLevel }) => {
      const name = input.name.trim();
      if (!name) {
        toast.error("Type a food name first.");
        return;
      }
      update((current) => {
        const kitchenItem: KitchenItem = {
          id: newId("item"),
          name,
          location: input.location,
          stock: input.stock,
        };
        return {
          ...current,
          items: [...current.items, kitchenItem],
          currentList: syncListForStock(current.currentList, kitchenItem),
        };
      });
      toast.success(`Added ${name} to the kitchen.`);
    },
    [update],
  );

  const updateItem = useCallback(
    (
      itemId: string,
      input: { name: string; location: LocationId; stock: StockLevel },
    ) => {
      const name = input.name.trim();
      if (!name) {
        toast.error("Food needs a name.");
        return;
      }
      update((current) => {
        const nextItem: KitchenItem = {
          id: itemId,
          name,
          location: input.location,
          stock: input.stock,
        };
        return {
          ...current,
          items: current.items.map((entry) =>
            entry.id === itemId ? nextItem : entry,
          ),
          currentList: syncListForStock(
            current.currentList.map((line) =>
              line.itemId === itemId ? { ...line, name, location: input.location } : line,
            ),
            nextItem,
          ),
        };
      });
    },
    [update],
  );

  const removeItem = useCallback(
    (itemId: string) => {
      update((current) => ({
        ...current,
        items: current.items.filter((entry) => entry.id !== itemId),
        currentList: current.currentList.filter((line) => line.itemId !== itemId),
      }));
      toast.message("Removed from the kitchen.");
    },
    [update],
  );

  const addNeededToList = useCallback(
    (input: { name: string; location: LocationId }) => {
      const name = input.name.trim();
      if (!name) {
        toast.error("Type what to buy.");
        return;
      }
      update((current) => ({
        ...current,
        currentList: [
          ...current.currentList,
          {
            id: newId("line"),
            itemId: null,
            name,
            location: input.location,
            reason: "needed",
            outcome: "open",
          },
        ],
      }));
      toast.success(`Added ${name} to this week's shop.`);
    },
    [update],
  );

  const removeFromList = useCallback(
    (lineId: string) => {
      update((current) => ({
        ...current,
        currentList: current.currentList.filter((line) => line.id !== lineId),
      }));
    },
    [update],
  );

  const setLineOutcome = useCallback(
    (lineId: string, outcome: LineOutcome) => {
      update((current) => ({
        ...current,
        currentList: current.currentList.map((line) =>
          line.id === lineId ? { ...line, outcome } : line,
        ),
      }));
    },
    [update],
  );

  const finishShop = useCallback(() => {
    if (state.currentList.length === 0) {
      toast.error("The buy list is empty.");
      return false;
    }
    const unfinished = state.currentList.filter(
      (line) => line.outcome === "open",
    );
    if (unfinished.length > 0) {
      toast.error(
        "Mark every item as Got it or Shop didn't have it, then finish.",
      );
      return false;
    }

    const record: ShopRecord = {
      id: newId("shop"),
      finishedAt: new Date().toISOString(),
      finishedById: state.currentMemberId,
      lines: state.currentList.map((line) => ({
        name: line.name,
        location: line.location,
        reason: line.reason,
        outcome: line.outcome === "unavailable" ? "unavailable" : "bought",
      })),
    };

    const boughtIds = new Set(
      state.currentList
        .filter((line) => line.outcome === "bought" && line.itemId)
        .map((line) => line.itemId as string),
    );

    const nextItems = state.items.map((item) =>
      boughtIds.has(item.id) ? { ...item, stock: "plenty" as const } : item,
    );

    const rolled = state.currentList
      .filter((line) => line.outcome === "unavailable")
      .map((line) => ({
        ...line,
        id: newId("line"),
        reason: "rolled" as const,
        outcome: "open" as const,
      }));

    setState({
      ...state,
      items: nextItems,
      currentList: rolled,
      history: [record, ...state.history],
    });

    toast.success(
      rolled.length
        ? `Shop saved. ${rolled.length} item${rolled.length === 1 ? "" : "s"} moved to next week's list.`
        : "Shop saved. Next week's list is ready.",
    );
    return true;
  }, [state]);

  const restoreDemo = useCallback(() => {
    clearState();
    const demo = createSeedState();
    setState(demo);
    setErrorMessage(null);
    setStatus("ready");
    toast.success("Sample kitchen restored.");
  }, []);

  const currentMemberName =
    MEMBERS.find((member) => member.id === state.currentMemberId)?.name ??
    "Austin";

  const value = useMemo(
    () => ({
      status,
      errorMessage,
      state,
      currentMemberName,
      setCurrentMember,
      setItemStock,
      addItem,
      updateItem,
      removeItem,
      addNeededToList,
      removeFromList,
      setLineOutcome,
      finishShop,
      restoreDemo,
    }),
    [
      status,
      errorMessage,
      state,
      currentMemberName,
      setCurrentMember,
      setItemStock,
      addItem,
      updateItem,
      removeItem,
      addNeededToList,
      removeFromList,
      setLineOutcome,
      finishShop,
      restoreDemo,
    ],
  );

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const value = useContext(HouseholdContext);
  if (!value) {
    throw new Error("useHousehold must be used inside HouseholdProvider");
  }
  return value;
}
