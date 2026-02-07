import { TextInput } from "@/components/TextInput";
import type { EventItem } from "@/lib/emailTypes";

export interface EventsEditorProps {
  events: EventItem[];
  setEvents: (events: EventItem[]) => void;
}

export function EventsEditor({ events, setEvents }: EventsEditorProps) {
  const addEvent = () => {
    setEvents([
      ...events,
      {
        eventImage: "",
        eventTitle: "",
        eventDate: "",
        eventTime: "",
        eventLocation: "",
      },
    ]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, updates: Partial<EventItem>) => {
    const updated = [...events];
    updated[index] = { ...updated[index], ...updates };
    setEvents(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {events.map((event, index) => (
        <div
          key={index}
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 8,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, opacity: 0.7 }}>Événement {index + 1}</span>
            <button
              onClick={() => removeEvent(index)}
              style={{
                background: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: 4,
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Supprimer
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const result = ev.target?.result as string;
                  const base64 = result.split(",")[1];
                  updateEvent(index, { eventImage: base64 });
                };
                reader.readAsDataURL(file);
              }
            }}
            style={{
              padding: 8,
              borderRadius: 4,
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.02)",
              color: "#ddd",
              cursor: "pointer",
              fontSize: 12,
            }}
          />

          {event.eventImage && (
            <img
              src={`data:image/png;base64,${event.eventImage}`}
              alt="Event"
              style={{
                maxWidth: "100%",
                maxHeight: 120,
                borderRadius: 4,
                objectFit: "cover",
              }}
            />
          )}

          <TextInput
            label="Titre"
            value={event.eventTitle}
            onChange={(v) => updateEvent(index, { eventTitle: v })}
          />

          <TextInput
            label="Date"
            value={event.eventDate}
            onChange={(v) => updateEvent(index, { eventDate: v })}
          />

          <TextInput
            label="Heure"
            value={event.eventTime}
            onChange={(v) => updateEvent(index, { eventTime: v })}
          />

          <TextInput
            label="Lieu"
            value={event.eventLocation}
            onChange={(v) => updateEvent(index, { eventLocation: v })}
          />
        </div>
      ))}

      <button
        onClick={addEvent}
        style={{
          background: "rgba(255, 77, 173, 0.2)",
          color: "#FF4DAD",
          border: "1px solid rgba(255, 77, 173, 0.4)",
          borderRadius: 6,
          padding: "10px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        + Ajouter un événement
      </button>
    </div>
  );
}
