import { useState } from "react";
import { useParams } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { CircleOrCross } from "../types/types";

const useJoinRoom = () => {
  const { roomId } = useParams();
  const [isJoining, setIsJoining] = useState(false);

  async function joinRoom(
    player: CircleOrCross,
    userId: string,
    userDisplayName: string | null
  ) {
    setIsJoining(true);
    try {
      const document = await getDoc(doc(db, "rooms", roomId!));
      if (document.exists()) {
        const data = document.data();
        if (data?.playerOId === userId || data?.playerXId === userId)
          return alert("You can't join the game more than once!");
        await updateDoc(doc(db, "rooms", roomId!), {
          [player === "X" ? "playerXId" : "playerOId"]: userId,
          [player === "X" ? "playerXDisplayName" : "playerODisplayName"]:
            userDisplayName,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsJoining(false);
    }
  }
  return { isJoining, joinRoom };
};

export default useJoinRoom;
