import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function AllEntries() {
  const { entries, deleteEntry } = useContext(EntryContext) as EntryContextType;
  let navigate = useNavigate();
  if (entries.length == 0) {
    return (
      <section className="p-6 bg-gray-100 dark:bg-gray-800 rounded-md">
        <h1 className="text-center font-semibold text-2xl m-5 text-gray-900 dark:text-gray-100">
          You don't have any card
        </h1>
        <p className="text-center font-medium text-md text-gray-700 dark:text-gray-300">
          Lets{" "}
          <Link className="text-blue-400 dark:text-blue-300 underline underline-offset-1" to="/create">
            Create One
          </Link>
        </p>
      </section>
    );
  }
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {entries.map((entry: Entry, index: number) => {
        return (
          <div
            id={entry.id}
            key={index}
            className="bg-gray-300 dark:bg-gray-700 shadow-md shadow-gray-500 dark:shadow-gray-900 m-3 p-4 rounded flex flex-col justify-between"
          >
            <h1 className="font-bold text-sm md:text-lg text-gray-900 dark:text-gray-100">{entry.title}</h1>
            <p className="text-center text-lg font-light md:mt-2 md:mb-4 mt-1 mb-3 text-gray-900 dark:text-gray-200">
              {entry.description}
            </p>
            <section className="flex items-center justify-between flex-col md:flex-row pt-2 md:pt-0">
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    deleteEntry(entry.id as string);
                  }}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-red-500 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-800 text-white"
                >
                  ✖
                </button>
                <button
                  onClick={() => {
                    navigate(`/edit/${entry.id}`, { replace: true });
                  }}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-blue-500 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 text-white"
                >
                  🖊
                </button>
              </div>
              <div className="flex flex-col items-end">
                <small className="text-xs text-gray-600 dark:text-gray-400">Scheduled Date</small>
                <time className="text-right text-sm md:text-lg text-gray-900 dark:text-gray-300">
                  {entry.scheduled_date
                    ? new Date(entry.scheduled_date.toString()).toLocaleDateString()
                    : "No scheduled date"}
                </time>
              </div>
              <div className="flex flex-col items-end">
                <small className="text-xs text-gray-600 dark:text-gray-400">Created At</small>
                <time className="text-right text-sm md:text-lg text-gray-900 dark:text-gray-300">
                  {new Date(entry.created_at.toString()).toLocaleDateString()}
                </time>
              </div>
            </section>
          </div>
        );
      })}
    </section>
  );
}
