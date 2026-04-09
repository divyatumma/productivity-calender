import { useState } from "react"
import HeroImage from "./components/Layout/Heroimage.jsx"
import CalendarGrid from "./components/Calendar/CalendarGrid"
import NotesPanel from "./components/Layout/NotesPanel.jsx"

function App() {
  const [activeDate, setActiveDate] = useState(null)
  const [notesMap, setNotesMap] = useState({})

  return (
    <div className="min-h-screen bg-zinc-200 p-4">
      <main className="mx-auto max-w-300 bg-[#f4f4f4] rounded-xl shadow">

        <HeroImage />

        <div className="flex flex-col lg:flex-row">

          <div className="w-full lg:w-2/3">
            <CalendarGrid setActiveDate={setActiveDate} />
          </div>

          <div className="w-full lg:w-1/3 p-4">
            <NotesPanel
              activeDate={activeDate}
              notesMap={notesMap}
              setNotesMap={setNotesMap}
            />
          </div>

        </div>

      </main>
    </div>
  )
}

export default App