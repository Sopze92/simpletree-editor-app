import React from 'react'

import { DndContext, DragOverlay } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import '../res/test.css'

const TestElement= ({ sid })=>{
  const { attributes, listeners, setNodeRef, transform, transition }= useSortable({id: sid})
  return (
    <div ref={setNodeRef} style={{transform:CSS.Transform.toString(transform), transition}} {...attributes} {...listeners} >Element {sid< 10 ? "0" + sid : sid}</div>
  )
}

const numtest= 32

const View= ()=>{

  const [sortables, set_sortables]= React.useState(null)

  React.useEffect(()=>{
    const new_sortables= {
      sids: Array(numtest).fill(null).map((_,i)=>i+1),
      elements: Array(numtest).fill(null).map((_,i)=><TestElement key={i} sid={i+1}/>)
    }
    set_sortables(new_sortables)
  },[])
  
  function handleDragEnd(e) {
    if(e.active && e.over){
      const 
        idxOver= sortables.sids.indexOf(e.over.id), idxActive= sortables.sids.indexOf(e.active.id),
        [min, max] = [Math.min(idxActive, idxOver), Math.max(idxActive, idxOver)],
        elements= [
          ...sortables.elements.slice(0, min), 
          ...(idxOver < idxActive ? 
            [sortables.elements[idxActive], ...sortables.elements.slice(min, max)] : 
            [...sortables.elements.slice(min+1, max+1), sortables.elements[idxActive]]
          ),
          ...sortables.elements.slice(max+1, sortables.elements.length)
        ],
        sids= elements.map(e=>e.props.sid)

      set_sortables({sids, elements})
    }
  }
  return (
    <div className="test">
      { sortables &&
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={sortables.sids} strategy={verticalListSortingStrategy}>
            {sortables.elements}
          </SortableContext>
          <DragOverlay dropAnimation={null} zIndex={4096}>

          </DragOverlay>
        </DndContext>
      }
    </div>
  )
}

export default View