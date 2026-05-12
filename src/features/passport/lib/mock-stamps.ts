import type { Stamp } from "@/types";

/**
 * Mock stamps to demonstrate the UI for an activated passport.
 * We select a few prominent locations to show as "checked-in".
 */
export const MOCK_STAMPS: Stamp[] = [
  {
    id: "mock_st_1",
    locationId: "loc_dragon_bridge",
    collectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    points: 15,
  },
  {
    id: "mock_st_2",
    locationId: "loc_my_khe",
    collectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    points: 10,
  },
  {
    id: "mock_st_3",
    locationId: "loc_ba_na_hills",
    collectedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    points: 25,
  },
];
