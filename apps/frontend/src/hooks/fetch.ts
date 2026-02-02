import useSWR, { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

const fetcher = (url) =>
  fetch("http://localhost:3000" + url).then((res) => res.json());
export const useFetchedServerNotesData = () =>
  useSWRImmutable("/v1/notes", fetcher);

const mergeNotes = (currentData, updatedData) => {
  const currentNotes = currentData.data;
  const updatedNotes = updatedData.data;
  const newServerTime = updatedData.serverTime;
  /* データ制約
    currentNotes, updatedNotes 共にid順に整列された0以上の配列
    同idのデータが両方にある場合、updatedNotesのupdated_at >= currentNotesのupdated_at
    等号成立は、鯖での更新処理とgetリクエストが同時に来た場合

     */
  if (currentNotes.length == 0) {
    return updatedData;
  } else if (updatedNotes.length == 0) {
    return { serverTime: newServerTime, data: currentNotes };
  }
  let ci = 0; // currentNotesIndex
  let ui = 0; // updatedNotesIndex
  const newNotes = []; //type Note[]
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
  return { serverTime: newServerTime, data: newNotes };
};

export const useFetchNotesData = () => {
  const updatedAfter = useFetchedServerNotesData().data?.serverTime; //TODO: string->Date
  const fetchAll = !updatedAfter;
  console.log(updatedAfter);
  useSWR(
    "/v1/notes/updates",
    () =>
      fetcher(
        updatedAfter ? `/v1/notes?updatedAfter=${updatedAfter}` : "/v1/notes",
      ),
    {
      refreshInterval: 3_000, // 3秒ごとに再取得
      onSuccess: (updatedData) => {
        if (!fetchAll) {
          mutate(
            "/v1/notes",
            (currentData = []) => {
              return mergeNotes(currentData, updatedData);
            }, // TODO: localStorageに保存
            { revalidate: false },
          );
        }
      },
    },
  );
};
