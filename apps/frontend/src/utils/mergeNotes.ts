import type { Note, NotesApi } from "@shared/types/note";

export const mergeNotes = (
  currentData: NotesApi,
  updatedData: NotesApi,
): NotesApi => {
  const currentNotes = currentData.notes;
  const updatedNotes = updatedData.notes;
  const newServerTime = updatedData.serverTime;
  /* データ制約
    currentNotes, updatedNotes 共にid順に整列された0以上の配列
    同idのデータが両方にある場合、updatedNotesのupdated_at >= currentNotesのupdated_at
    等号成立は、鯖での更新処理とgetリクエストが同時に来た場合

     */
  if (currentNotes.length == 0) {
    return updatedData;
  } else if (updatedNotes.length == 0) {
    return { serverTime: newServerTime, notes: currentNotes };
  }
  let ci = 0; // currentNotesIndex
  let ui = 0; // updatedNotesIndex
  const newNotes: Note[] = [];
  while (true) {
    const cid = currentNotes[ci].id;
    const uid = updatedNotes[ui].id;
    if (cid == uid) {
      newNotes.push(updatedNotes[ui]);
      ci++;
      ui++;
    } else if (cid > uid) {
      newNotes.push(updatedNotes[ui]);
      ui++;
    } else if (cid < uid) {
      newNotes.push(currentNotes[ci]);
      ci++;
    }
    if (ci >= currentNotes.length) {
      while (ui < updatedNotes.length) {
        newNotes.push(updatedNotes[ui]);
        ui++;
      }
      break;
    } else if (ui >= updatedNotes.length) {
      while (ci < currentNotes.length) {
        newNotes.push(currentNotes[ci]);
        ci++;
      }
      break;
    }
  }
  return { serverTime: newServerTime, notes: newNotes };
};
