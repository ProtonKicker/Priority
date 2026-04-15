import React from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface DraggableArchivedTaskProps {
  task: any;
  index: number;
  moveArchivedTask: (draggedId: string, hoverId: string) => void;
  children: React.ReactNode;
  [key: string]: any;
}

export default function DraggableArchivedTask({ task, index, moveArchivedTask, children, ...props }: DraggableArchivedTaskProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'archived-task',
    item: { id: task.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: 'archived-task',
    hover: (item: { id: string; index: number }, monitor) => {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex || item.id === task.id) return

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveArchivedTask(item.id, task.id)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
    <div
      ref={ref as any}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
