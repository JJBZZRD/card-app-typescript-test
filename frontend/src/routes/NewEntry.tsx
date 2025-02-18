import { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function NewEntry() {
  const emptyEntry: Entry = { title: "", description: "", created_at: new Date(), scheduled_date: new Date() };
  const { saveEntry } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    });
  };
  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    saveEntry(newEntry);
    setNewEntry(emptyEntry);
  };
  return (
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 gap-5 bg-gray-300 dark:bg-gray-700 p-8 rounded-md">
      <input
        className="p-3 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        type="text"
        placeholder="Title"
        name="title"
        value={newEntry.title}
        onChange={handleInputChange}
      />
      <textarea
        className="p-3 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        placeholder="Description"
        name="description"
        value={newEntry.description}
        onChange={handleInputChange}
      />
      <label htmlFor="scheduled_date" className="text-xs text-gray-900 dark:text-gray-100">
        Scheduled Date
      </label>
      <input
        className="p-3 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        type="date"
        name="scheduled_date"
        value={newEntry.scheduled_date ? new Date(newEntry.scheduled_date).toISOString().split("T")[0] : ""}
        onChange={handleInputChange}
      />
      <label htmlFor="created_at" className="text-xs text-gray-900 dark:text-gray-100">
        Created At
      </label>
      <input
        className="p-3 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        type="date"
        name="created_at"
        value={new Date(newEntry.created_at).toISOString().split("T")[0]}
        onChange={handleInputChange}
      />
      <button
        onClick={(e) => {
          handleSend(e);
        }}
        className="bg-blue-400 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-800 font-semibold text-white p-3 rounded-md"
      >
        Create
      </button>
    </section>
  );
}
