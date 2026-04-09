import PropTypes from "prop-types"

function NotesPanel({ activeDate, notesMap, setNotesMap }) {

  const note = activeDate ? notesMap[activeDate] || "" : ""

  const handleChange = (e) => {
    setNotesMap(prev => ({
      ...prev,
      [activeDate]: e.target.value
    }))
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-2">Notes</h2>

      {activeDate ? (
        <>
          <p className="text-sm mb-2">For: {activeDate}</p>
          <textarea
            value={note}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </>
      ) : (
        <p className="text-sm text-gray-500">
          Select a date to add notes
        </p>
      )}
    </div>
  )
}

NotesPanel.propTypes = {
  activeDate: PropTypes.string,
  notesMap: PropTypes.objectOf(PropTypes.string).isRequired,
  setNotesMap: PropTypes.func.isRequired,
}

export default NotesPanel