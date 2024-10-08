import {
  Content,
  DraggableTopBar,
  Hint,
  MarkdownEditor,
  NoteDetails,
  NotePreviewList,
  NoteTitle
} from '@/components'

import { notesAtom, selectedNoteIndexAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { isEmpty } from 'lodash'
import { useEffect, useRef, useState } from 'react'

const App = () => {
  const [notePreviewListOn, setNotePreviewListOn] = useState(false)
  const [detailsOn, setDetailsOn] = useState(false)

  const selectedNoteIndex = useAtomValue(selectedNoteIndexAtom)
  const notes = useAtomValue(notesAtom)

  const contentContainerRef = useRef<HTMLDivElement>(null)

  function handleKeyDown(e: KeyboardEvent) {
    if (e.altKey) {
      // Uh... i do this because the MDXEditor does not have a easy way to blur()
      document.getElementById('hidden-focus')?.focus()

      setNotePreviewListOn(true)
    } else if (e.key === 'Escape') {
      window.close()
    }

    if (e.key === 'a') {
      setDetailsOn(true)
    } else if (e.key === 't') {
      window.context.toggleAlwaysOnTop()
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.code === 'AltLeft') {
      setNotePreviewListOn(false)
    }
    if (e.key == 'a') {
      setDetailsOn(false)
    }
  }

  useEffect(() => {
    // Sets up event listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Cleans up the event listeners on umount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <>
      <DraggableTopBar className="h-4" />
      {detailsOn && notePreviewListOn && <NoteDetails />}
      {(selectedNoteIndex === null || isEmpty(notes)) && !notePreviewListOn && (
        <Hint>
          press <span className="first-text">alt</span> to view notes
        </Hint>
      )}
      {selectedNoteIndex !== null && (
        <Content className="px-2" ref={contentContainerRef}>
          <NoteTitle className="text-3xl mt-[6px] z-30 supermicro:heading" />
          <MarkdownEditor />
        </Content>
      )}
      {notePreviewListOn && (
        <NotePreviewList className=" text-3xl z-2 top-0 left-2 right-2 fixed h-screen" />
      )}
      <div id="hidden-focus" tabIndex={-1} className="absolute -top:10000"></div>
    </>
  )
}

export default App
