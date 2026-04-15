import React from 'react'
import { useDrag, useDrop } from 'react-dnd'

interface DraggableWorkspaceProps {
  category: any;
  index: number;
  moveWorkspace: (draggedId: string, hoverId: string) => void;
  children: React.ReactNode;
  [key: string]: any;
}

export default function DraggableWorkspace({ category, index, moveWorkspace, children, ...props }: DraggableWorkspaceProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'workspace',
    item: { id: category.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver }, drop] = useDrop({
    accept: 'workspace',
    hover: (item: { id: string; index: number }, monitor) => {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex || item.id === category.id) return

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveWorkspace(item.id, category.id)
      item.index = hoverIndex
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
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
