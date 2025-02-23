import Entry from "../Entry/Entry";

function EntryList({ entries, fetchEntries }) {
  return (
    <>
      <div className="entrylist">
        <div className="entrylist__container">
          {entries.map((entry) => {
            <ul key={entry.id}>
              <Entry
                id={entry.id}
                title={entry.title}
                date={entry.date}
                sketch={entry.sketch}
                entry={entry.entry}
                fetchEntries={fetchEntries}
              />
            </ul>;
          })}
        </div>
      </div>
    </>
  );
}

export default EntryList;
