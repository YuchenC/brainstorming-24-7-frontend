export async function createRoom(participantId: string): Promise<{
    room_id: string;
    ws_url: string;
  }> {
    const res = await fetch("http://127.0.0.1:8000/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participant_id: participantId }),
    });
  
    if (!res.ok) {
      throw new Error("Failed to create room");
    }
  
    return res.json();
  }
  