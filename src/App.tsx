import React, { useState, useEffect, useRef } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  Calendar,
  Briefcase,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings,
  Edit2,
  Upload,
  Download,
  Moon,
  Sun,
  X,
  Folder,
  Zap,
  Archive,
  ArchiveRestore,
  Copy
} from 'lucide-react'
import { AVAILABLE_ICONS, STORAGE_KEY_CATEGORIES, STORAGE_KEY_TASKS, STORAGE_KEY_THEME, STORAGE_KEY_SIDEBAR_WIDTH, STORAGE_KEY_ARCHIVE_PANEL_WIDTH, STORAGE_KEY_ARCHIVED, DEFAULT_CATEGORIES, DEFAULT_TASKS, DEFAULT_ARCHIVED_TASKS, DEFAULT_THEME } from './constants'
import { loadState, saveState } from './utils/storage'
import DraggableWorkspace from './components/DraggableWorkspace'
import DraggableTask from './components/DraggableTask'
import DraggableArchivedTask from './components/DraggableArchivedTask'


export default function App() {
  const [theme, setTheme] = useState(() => loadState(STORAGE_KEY_THEME, DEFAULT_THEME))
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)

  // Detect system theme preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Compute actual theme based on setting
  const actualTheme = theme === 'system' ? getSystemTheme() : theme

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        // Force re-render when system theme changes
        setTheme('system')
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const [categories, setCategories] = useState(() => loadState(STORAGE_KEY_CATEGORIES, DEFAULT_CATEGORIES))
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')
  const [editingCategoryIcon, setEditingCategoryIcon] = useState('')

  const [tasks, setTasks] = useState(() => loadState(STORAGE_KEY_TASKS, DEFAULT_TASKS))
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState('')
  const [archivedTasksByWorkspace, setArchivedTasksByWorkspace] = useState(() => loadState(STORAGE_KEY_ARCHIVED, DEFAULT_ARCHIVED_TASKS))

  const [activeCategory, setActiveCategory] = useState<string>('')
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = loadState(STORAGE_KEY_SIDEBAR_WIDTH, 256)
    return Math.max(60, Math.min(500, saved))
  })
  const [archivePanelWidth, setArchivePanelWidth] = useState(() => {
    const saved = loadState(STORAGE_KEY_ARCHIVE_PANEL_WIDTH, 320)
    return Math.max(60, Math.min(600, saved))
  })
  const [newTaskText, setNewTaskText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  const inputRef = useRef<HTMLTextAreaElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const isDraggingRef = useRef(false)
  const archiveDraggingRef = useRef(false)

  const isSidebarCollapsed = sidebarWidth <= 60
  const isSidebarExpanded = sidebarWidth > 60

  const isArchivePanelCollapsed = archivePanelWidth <= 60
  const isArchivePanelExpanded = archivePanelWidth > 60

  // Get archived tasks for the current active workspace
  const getArchivedForWorkspace = (workspaceId: string) => {
    return archivedTasksByWorkspace[workspaceId] || []
  }

  const archivedTasksForCurrentWorkspace = activeCategory ? getArchivedForWorkspace(activeCategory) : []
  const showArchivePanel = archivedTasksForCurrentWorkspace.length > 0 && archivePanelWidth > 0

  // Function to move workspaces
  const moveWorkspace = React.useCallback((draggedId: string, hoverId: string) => {
    setCategories((prevCategories) => {
      const draggedIndex = prevCategories.findIndex(c => c.id === draggedId)
      const hoverIndex = prevCategories.findIndex(c => c.id === hoverId)
      if (draggedIndex === -1 || hoverIndex === -1) return prevCategories

      const newCategories = [...prevCategories]
      const [movedCategory] = newCategories.splice(draggedIndex, 1)
      newCategories.splice(hoverIndex, 0, movedCategory)
      return newCategories
    })
  }, [])

  // Function to move tasks
  const moveTask = React.useCallback((draggedId: string, hoverId: string) => {
    setTasks((prevTasks) => {
      const draggedIndex = prevTasks.findIndex(t => t.id === draggedId)
      const hoverIndex = prevTasks.findIndex(t => t.id === hoverId)
      if (draggedIndex === -1 || hoverIndex === -1) return prevTasks

      const newTasks = [...prevTasks]
      const [movedTask] = newTasks.splice(draggedIndex, 1)
      newTasks.splice(hoverIndex, 0, movedTask)
      return newTasks
    })
  }, [])

  // Function to move archived tasks
  const moveArchivedTask = React.useCallback((draggedId: string, hoverId: string) => {
    setArchivedTasksByWorkspace((prev) => {
      const currentArchived = prev[activeCategory] || []
      const draggedIndex = currentArchived.findIndex(t => t.id === draggedId)
      const hoverIndex = currentArchived.findIndex(t => t.id === hoverId)
      if (draggedIndex === -1 || hoverIndex === -1) return prev

      const newArchived = [...currentArchived]
      const [moved] = newArchived.splice(draggedIndex, 1)
      newArchived.splice(hoverIndex, 0, moved)
      return { ...prev, [activeCategory]: newArchived }
    })
  }, [activeCategory])

  // Handle sidebar resize drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const newWidth = e.clientX - 16
        setSidebarWidth(Math.max(60, Math.min(500, newWidth)))
      }
      if (archiveDraggingRef.current) {
        const newWidth = window.innerWidth - e.clientX - 16
        setArchivePanelWidth(Math.max(200, Math.min(600, newWidth)))
      }
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      archiveDraggingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.body.style.pointerEvents = ''
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Persist sidebar width
  useEffect(() => {
    saveState(STORAGE_KEY_SIDEBAR_WIDTH, sidebarWidth)
  }, [sidebarWidth])

  // Persist archive panel width
  useEffect(() => {
    saveState(STORAGE_KEY_ARCHIVE_PANEL_WIDTH, archivePanelWidth)
  }, [archivePanelWidth])

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.body.style.pointerEvents = 'none'
  }

  const startArchiveResize = (e: React.MouseEvent) => {
    e.preventDefault()
    archiveDraggingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.body.style.pointerEvents = 'none'
  }

  // Auto-select the first workspace on launch
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
    }
  }, [categories, activeCategory])

  // Persist categories
  useEffect(() => {
    saveState(STORAGE_KEY_CATEGORIES, categories)
  }, [categories])

  // Persist tasks
  useEffect(() => {
    saveState(STORAGE_KEY_TASKS, tasks)
  }, [tasks])

  // Persist archived tasks
  useEffect(() => {
    saveState(STORAGE_KEY_ARCHIVED, archivedTasksByWorkspace)
  }, [archivedTasksByWorkspace])

  // Persist theme
  useEffect(() => {
    saveState(STORAGE_KEY_THEME, theme)
  }, [theme])

  // Archive completed tasks in current category
  const archiveCompletedTasks = () => {
    const completedInCategory = tasks.filter(t => t.category === activeCategory && t.completed)
    if (completedInCategory.length === 0) {
      alert('No completed tasks to archive in this workspace.')
      return
    }

    // Add to archived tasks with timestamp
    const tasksToArchive = completedInCategory.map(t => ({
      ...t,
      archivedAt: new Date().toISOString(),
      originalCategory: t.category
    }))

    const currentArchived = archivedTasksByWorkspace[activeCategory] || []
    setArchivedTasksByWorkspace({
      ...archivedTasksByWorkspace,
      [activeCategory]: [...currentArchived, ...tasksToArchive]
    })
    // Set archive panel to collapsed state (collapsed by default when created)
    setArchivePanelWidth(60)

    // Remove from active tasks
    setTasks(tasks.filter(t => !(t.category === activeCategory && t.completed)))
  }

  // Copy todo items to clipboard in text format
  const copyTodoItems = () => {
    const currentTasks = tasks.filter(t => t.category === activeCategory)
    if (currentTasks.length === 0) {
      alert('No tasks to copy in this workspace.')
      return
    }

    const workspaceName = categories.find(c => c.id === activeCategory)?.name || 'Tasks'
    const taskList = currentTasks.map(task =>
      `${task.completed ? '✓' : '-'} ${task.text}`
    ).join('\n')

    const copyText = `${workspaceName}:\n${taskList}`

    navigator.clipboard.writeText(copyText).then(() => {
      alert('Tasks copied to clipboard!')
    }).catch(() => {
      alert('Failed to copy tasks to clipboard.')
    })
  }

  // Edit task functions
  const startEditTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setEditingTaskId(taskId)
      setEditingTaskText(task.text)
    }
  }

  const saveTaskEdit = () => {
    if (editingTaskId && editingTaskText.trim()) {
      setTasks(tasks.map(t =>
        t.id === editingTaskId
          ? { ...t, text: editingTaskText.trim() }
          : t
      ))
    }
    setEditingTaskId(null)
    setEditingTaskText('')
  }

  const cancelTaskEdit = () => {
    setEditingTaskId(null)
    setEditingTaskText('')
  }

  // Handle task edit keyboard events
  const handleTaskEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey) {
        const start = e.currentTarget.selectionStart
        const end = e.currentTarget.selectionEnd
        const value = e.currentTarget.value
        setEditingTaskText(value.substring(0, start) + '\n' + value.substring(end))
        // We can't easily reset cursor here in a controlled component without a ref or useEffect
        // but it's better than nothing. 
      } else {
        e.preventDefault()
        saveTaskEdit()
      }
    } else if (e.key === 'Escape') {
      cancelTaskEdit()
    }
  }

  // Restore task from archive
  const restoreTask = (taskId: string) => {
    const currentArchived = archivedTasksByWorkspace[activeCategory] || []
    const taskToRestore = currentArchived.find(t => t.id === taskId)
    if (!taskToRestore) return

    // Add back to tasks (to original category or first available)
    const restoredTask = { ...taskToRestore }
    delete restoredTask.archivedAt
    delete restoredTask.originalCategory

    setTasks([restoredTask, ...tasks])
    // Remove from archive for this workspace
    setArchivedTasksByWorkspace({
      ...archivedTasksByWorkspace,
      [activeCategory]: currentArchived.filter(t => t.id !== taskId)
    })
  }

  // Delete from archive permanently
  const deleteFromArchive = (taskId: string) => {
    if (confirm('Permanently delete this archived task?')) {
      const currentArchived = archivedTasksByWorkspace[activeCategory] || []
      setArchivedTasksByWorkspace({
        ...archivedTasksByWorkspace,
        [activeCategory]: currentArchived.filter(t => t.id !== taskId)
      })
    }
  }

  // Clear all archived tasks for current workspace
  const clearArchive = () => {
    if (confirm('Clear all archived tasks for this workspace? This cannot be undone.')) {
      setArchivedTasksByWorkspace({
        ...archivedTasksByWorkspace,
        [activeCategory]: []
      })
    }
  }

  const addCategory = () => {
    const newId = 'cat_' + Date.now()
    const newCat = { id: newId, name: 'New Workspace', icon: 'Folder', isSystem: false }
    setCategories([...categories, newCat])
    setEditingCategoryId(newId)
    setEditingCategoryName('New Workspace')
    setEditingCategoryIcon('Folder')
    setActiveCategory(newId)
    setSidebarWidth(256)
  }

  const deleteCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (categories.find(c => c.id === id)?.isSystem) return

    const categoryName = categories.find(c => c.id === id)?.name || 'this workspace'
    const tasksInCategory = tasks.filter(t => t.category === id)

    // Show confirmation popup
    const message = tasksInCategory.length > 0
      ? `Are you sure you want to delete the "${categoryName}" workspace? This will permanently delete ${tasksInCategory.length} task(s) in this workspace. This cannot be undone.`
      : `Are you sure you want to delete the "${categoryName}" workspace? This cannot be undone.`

    if (confirm(message)) {
      // Delete the category
      setCategories(categories.filter(c => c.id !== id))

      // Delete all tasks in the workspace
      setTasks(tasks.filter(t => t.category !== id))

      // Delete archived tasks for this workspace
      setArchivedTasksByWorkspace(prev => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })

      // Update active category if needed
      if (activeCategory === id) {
        const remainingCategories = categories.filter(c => c.id !== id)
        setActiveCategory(remainingCategories.length > 0 ? remainingCategories[0].id : '')
      }
    }
  }

  const startEditCategory = (category: any, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.name)
    setEditingCategoryIcon(category.icon)
  }

  const cycleIcon = (e: React.MouseEvent) => {
    e.preventDefault()
    const keys = Object.keys(AVAILABLE_ICONS)
    const currentIndex = keys.indexOf(editingCategoryIcon)
    const nextIndex = (currentIndex + 1) % keys.length
    setEditingCategoryIcon(keys[nextIndex])
  }

  const saveCategoryEdit = () => {
    if (editingCategoryId) {
      setCategories(categories.map(c =>
        c.id === editingCategoryId
          ? { ...c, name: editingCategoryName.trim() || 'Unnamed Workspace', icon: editingCategoryIcon }
          : c
      ))
      setEditingCategoryId(null)
    }
  }

  const exportData = () => {
    const data = { categories, tasks, archivedTasksByWorkspace }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'zen_todo_backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const data = JSON.parse(event.target?.result as string)

          if (!data.categories && !data.tasks) {
            alert('Invalid backup file format.')
            return
          }

          if (data.categories) setCategories(data.categories)
          if (data.tasks) setTasks(data.tasks)
          if (data.archivedTasksByWorkspace) setArchivedTasksByWorkspace(data.archivedTasksByWorkspace)

          if (data.categories?.length > 0) {
            setActiveCategory(data.categories[0].id)
          } else {
            setActiveCategory('')
          }
        } catch {
          alert('Failed to parse backup file. Make sure it is a valid JSON file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // Filter tasks based on category and search
  // When searching, show results from ALL workspaces
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = activeCategory === 'all' || task.category === activeCategory
    const matchesSearch = searchQuery === '' || task.text.toLowerCase().includes(searchQuery.toLowerCase())
    // If there's a search query, search across all workspaces
    if (searchQuery !== '') return matchesSearch
    return matchesCategory && matchesSearch
  })

  // Search results across all workspaces (for sidebar dropdown)
  const searchResults = searchQuery.trim() !== ''
    ? tasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const activeCategoryName = categories.find(c => c.id === activeCategory)?.name || 'All Tasks'

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskText.trim()) return

    // If no workspace exists, create one automatically with the task
    if (categories.length === 0) {
      const newCatId = 'cat_' + Date.now()
      const newCat = { id: newCatId, name: 'My Tasks', icon: 'Folder', isSystem: false }
      setCategories([newCat])

      const newTask = {
        id: (Date.now() + 1).toString(),
        text: newTaskText.trim(),
        completed: false,
        category: newCatId
      }

      setTasks([newTask])
      setActiveCategory(newCatId)
      setNewTaskText('')
      setSidebarWidth(256)
      return
    }

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      category: activeCategory || categories[0]?.id
    }

    setTasks([newTask, ...tasks])
    setNewTaskText('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  // Helper function to check if user is in an input field
  const isInInputField = () => {
    const activeElement = document.activeElement
    return (
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.getAttribute('contenteditable') === 'true'
    )
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Focus search bar
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }

      // Ctrl/Cmd + L: Focus task input
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // / : Focus search bar (when not in input)
      if (e.key === '/' && !isInInputField()) {
        e.preventDefault()
        searchRef.current?.focus()
      }

      // S or s: Open settings (when not in input)
      if ((e.key === 's' || e.key === 'S') && !isInInputField() && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setIsSettingsOpen(true)
      }

      // Tab: Toggle workspace panel (when not in input)
      if (e.key === 'Tab' && !isInInputField()) {
        e.preventDefault()
        setSidebarWidth(isSidebarCollapsed ? 256 : 56)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarCollapsed])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={actualTheme}>
        {/* Outer "Window" background */}
        <div className="flex h-screen w-screen bg-zinc-50 dark:bg-[#1c1c20] text-zinc-800 dark:text-zinc-200 font-sans overflow-hidden p-2 gap-2 selection:bg-zinc-300 dark:selection:bg-zinc-700 selection:text-black dark:selection:text-white transition-colors duration-300">

          {/* Sidebar / Vertical Tabs Area */}
          <aside
            style={{ width: `${sidebarWidth}px` }}
            className={`transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-white dark:bg-[#28282e] rounded-xl flex flex-col border border-zinc-200 dark:border-zinc-800/60 relative overflow-hidden group shadow-lg shrink-0`}
          >
            {/* Sidebar Header */}
            <div className="p-3 flex items-center justify-between mt-1">
              <div className="flex items-center gap-2 overflow-hidden">
                <img src="/app-icon.png" alt="Priority" className="w-8 h-8 rounded-lg shrink-0" />
                {sidebarWidth > 60 && <span className="font-semibold tracking-wide text-zinc-800 dark:text-zinc-100 whitespace-nowrap opacity-100 transition-opacity delay-100">Priority</span>}
              </div>
              {sidebarWidth > 60 && (
                <button
                  onClick={() => setSidebarWidth(56)}
                  className="p-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                >
                  <PanelLeftClose size={18} />
                </button>
              )}
            </div>

            {sidebarWidth <= 60 && (
              <button
                onClick={() => setSidebarWidth(256)}
                className="mx-auto mt-2 p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                title="Expand Sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}

            {/* Search Box - Sidebar */}
            {sidebarWidth > 60 && (
              <div className="px-3 mb-3 relative">
                <div className="relative">
                  <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
                    <Search size={13} className="text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search all tasks"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true) }}
                    onFocus={() => setShowSearchDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSearchDropdown(false), 150)}
                    className="w-full bg-zinc-50 dark:bg-[#1c1c20] border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs rounded-lg py-1.5 pl-8 pr-6 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => { setSearchQuery(''); setShowSearchDropdown(false) }}
                      className="absolute inset-y-0 right-1.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                {/* Search Results Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#28282e] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                    {searchResults.slice(0, 20).map(task => {
                      const workspace = categories.find(c => c.id === task.category)
                      return (
                        <button
                          key={task.id}
                          onMouseDown={(e) => {
                            e.preventDefault()
                            setActiveCategory(task.category)
                            setSearchQuery('')
                            setShowSearchDropdown(false)
                          }}
                          className="w-full flex flex-col items-start px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 text-left transition-colors"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span className="text-sm text-zinc-800 dark:text-zinc-200 truncate">{task.text}</span>
                            {task.completed && <CheckCircle2 size={12} className="text-zinc-400 flex-shrink-0" />}
                          </div>
                          {workspace && (
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 flex-shrink-0" />
                              {workspace.name}
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Categories / Workspaces */}
            <div className="flex-1 overflow-y-auto px-2 space-y-1 scrollbar-hide">
              {sidebarWidth > 60 && (
                <div className="flex items-center justify-between px-3 mb-2 opacity-60">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Workspaces</span>
                  <button
                    onClick={addCategory}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                    title="Add Workspace"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              )}

              {categories.map((category, index) => {
                const Icon = AVAILABLE_ICONS[category.icon] || Folder
                const CurrentEditIcon = AVAILABLE_ICONS[editingCategoryIcon] || Folder
                const workspaceArchiveCount = (archivedTasksByWorkspace[category.id] || []).length

                return (
                  <DraggableWorkspace
                    key={category.id}
                    category={category}
                    index={index}
                    moveWorkspace={moveWorkspace}
                  >
                    <div
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center ${sidebarWidth > 60 ? 'justify-start px-3' : 'justify-center'} py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer ${activeCategory === category.id
                        ? 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-sm border border-zinc-200 dark:border-zinc-700/50'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                        }`}
                      title={sidebarWidth <= 60 ? category.name : ''}
                    >
                      {/* Active Indicator Line (Zen style) */}
                      {activeCategory === category.id && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-zinc-400 rounded-r-full" />
                      )}

                      {editingCategoryId !== category.id && (
                        <Icon size={18} className={`shrink-0 ${activeCategory === category.id ? 'text-zinc-900 dark:text-zinc-100' : 'group-hover:text-zinc-700 dark:group-hover:text-zinc-200'}`} />
                      )}

                      {sidebarWidth > 60 && (
                        <div className={`${editingCategoryId !== category.id ? 'ml-3' : ''} flex-1 flex items-center justify-between overflow-hidden`}>
                          {editingCategoryId === category.id ? (
                            <div className="flex items-center gap-2 w-full pr-2">
                              <button
                                onMouseDown={cycleIcon}
                                className="shrink-0 p-1 rounded-md bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                                title="Click to change icon"
                              >
                                <CurrentEditIcon size={14} />
                              </button>
                              <input
                                autoFocus
                                value={editingCategoryName}
                                onChange={(e) => setEditingCategoryName(e.target.value)}
                                onBlur={saveCategoryEdit}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveCategoryEdit()
                                  if (e.key === 'Escape') setEditingCategoryId(null)
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 rounded px-1.5 py-0.5 focus:outline-none focus:border-zinc-500"
                              />
                            </div>
                          ) : (
                            <>
                              <span
                                onDoubleClick={(e) => startEditCategory(category, e)}
                                className="truncate text-sm font-medium flex-1 select-none"
                              >
                                {category.name}
                              </span>

                              {/* Right side: Actions (on hover) OR Badge */}
                              <div className="flex items-center gap-1 shrink-0">
                                {/* Actions wrapper: visible on hover */}
                                <div className="hidden group-hover:flex items-center gap-0.5">
                                  <button
                                    onClick={(e) => startEditCategory(category, e)}
                                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 rounded transition-colors"
                                    title="Edit Workspace"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  {!category.isSystem && (
                                    <button
                                      onClick={(e) => deleteCategory(category.id, e)}
                                      className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                                      title="Delete Workspace"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>

                                {/* Badge: active tasks count, hidden on hover */}
                                <span className="group-hover:hidden text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 border border-zinc-200 dark:border-zinc-800/50">
                                  {tasks.filter(t => t.category === category.id && !t.completed).length}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </DraggableWorkspace>
                )
              })}
            </div>

            {/* Settings Area at bottom */}
            <div className="p-2 mt-auto space-y-1">
              <button
                onClick={() => setIsShortcutsOpen(true)}
                className={`w-full flex items-center ${isSidebarExpanded ? 'justify-start px-3' : 'justify-center'} py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors`}
              >
                <Zap size={16} />
                {isSidebarExpanded && <span className="ml-3 text-sm font-medium">Shortcuts</span>}
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`w-full flex items-center ${isSidebarExpanded ? 'justify-start px-3' : 'justify-center'} py-2.5 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors`}
              >
                <Settings size={18} />
                {isSidebarExpanded && <span className="ml-3 text-sm font-medium">Settings</span>}
              </button>
            </div>
          </aside>

          {/* Draggable Divider */}
          <div
            onMouseDown={startResize}
            className="w-1 bg-transparent hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-col-resize transition-colors shrink-0 relative z-10 group"
            style={{ margin: '0 -2px' }}
          >
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-zinc-200 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Main Content Area / Browser Webview Area */}
          <main className="flex-1 bg-white dark:bg-[#28282e] rounded-xl border border-zinc-200 dark:border-zinc-800/60 shadow-lg flex flex-col relative overflow-hidden transition-colors duration-300">

            {/* Top "Address Bar" Area */}
            <header className="h-14 border-b border-zinc-200 dark:border-zinc-800/60 flex items-center px-4 gap-4 bg-white/80 dark:bg-[#28282e]/80 backdrop-blur-md z-10">

              {/* Omnibox / Task Input */}
              <div className="flex-1 max-w-2xl relative group flex items-center">
                <form onSubmit={handleAddTask} className="relative w-full flex items-center">
                  <Plus size={16} className="text-zinc-400 dark:text-zinc-500 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors mr-2 flex-shrink-0" />
                  <textarea
                    ref={inputRef}
                    placeholder="Add a task"
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (e.ctrlKey) {
                          const start = e.currentTarget.selectionStart
                          const end = e.currentTarget.selectionEnd
                          const value = e.currentTarget.value
                          setNewTaskText(value.substring(0, start) + '\n' + value.substring(end))
                        } else {
                          e.preventDefault()
                          handleAddTask(e as any)
                        }
                      }
                    }}
                    rows={1}
                    className="w-full bg-zinc-50 dark:bg-[#1c1c20] border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm rounded-full py-1.5 pl-3 pr-16 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none font-sans"
                  />
                  {newTaskText && (
                    <button type="submit" className="ml-2 px-4 py-1.5 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-sm rounded-full transition-colors text-zinc-700 dark:text-zinc-300 font-medium flex-shrink-0">
                      Add
                    </button>
                  )}
                </form>
              </div>

              {/* Spacer to push buttons to the far right corner */}
              <div className="flex-1" />

              {/* Workspace action bar - Move back to header */}
              {activeCategory && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={archiveCompletedTasks}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800/60"
                    title="Archive completed tasks"
                  >
                    <Archive size={14} />
                    <span>Archive done</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={copyTodoItems}
                    className="p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Copy tasks as bullet list"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              )}
            </header>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-gradient-to-b from-white to-zinc-50 dark:from-[#28282e] dark:to-[#202026] relative">
              <div className="w-full space-y-1.5 pb-20 pt-2">

                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-400 dark:text-zinc-500 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-center border border-zinc-200 dark:border-zinc-800/50">
                      <CheckCircle2 size={24} className="opacity-50" />
                    </div>
                    <p className="text-sm">No tasks found. Take a deep breath.</p>
                  </div>
                ) : (
                  filteredTasks.map((task, index) => (
                    <DraggableTask
                      key={task.id}
                      task={task}
                      index={index}
                      moveTask={moveTask}
                    >
                      <div
                        className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${task.completed
                          ? 'bg-zinc-50 dark:bg-[#1c1c20]/50 border-transparent opacity-60'
                          : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/40 hover:border-zinc-300 dark:hover:border-zinc-700/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                          }`}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex-shrink-0 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none"
                        >
                          {task.completed ? (
                            <CheckCircle2 size={20} className="text-zinc-400" />
                          ) : (
                            <Circle size={20} />
                          )}
                        </button>

                        {editingTaskId === task.id ? (
                          <textarea
                            autoFocus
                            value={editingTaskText}
                            onChange={(e) => setEditingTaskText(e.target.value)}
                            onBlur={saveTaskEdit}
                            onKeyDown={handleTaskEditKeyDown}
                            className="flex-1 text-sm bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded px-2 py-1 focus:outline-none focus:border-zinc-500 transition-all resize-none overflow-hidden font-sans whitespace-pre-wrap"
                            rows={editingTaskText.split('\n').length}
                          />
                        ) : (
                          <span
                            className={`flex-1 text-sm transition-all duration-200 cursor-pointer whitespace-pre-wrap ${task.completed ? 'text-zinc-400 dark:text-zinc-500 line-through' : 'text-zinc-800 dark:text-zinc-200'
                              }`}
                            onDoubleClick={() => startEditTask(task.id)}
                          >
                            {task.text}
                          </span>
                        )}

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {editingTaskId !== task.id && (
                            <button
                              onClick={() => startEditTask(task.id)}
                              className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-400/10 rounded-md transition-all"
                              title="Edit task"
                            >
                              <Edit2 size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md transition-all"
                            title="Delete task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </DraggableTask>
                  ))
                )}
              </div>
            </div>

          </main>

          {/* Archive Panel - Right Side */}
          {archivedTasksForCurrentWorkspace.length > 0 && (
            <>
              {/* Archive Panel Divider */}
              <div
                onMouseDown={startArchiveResize}
                className="w-1 bg-transparent hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-col-resize transition-colors shrink-0 relative z-10 group"
                style={{ margin: '0 -2px' }}
              >
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-zinc-200 dark:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Archive Panel */}
              <aside
                style={{ width: `${archivePanelWidth}px` }}
                className="transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] bg-white dark:bg-[#28282e] rounded-xl flex flex-col border border-zinc-200 dark:border-zinc-800/60 relative overflow-hidden group shadow-lg shrink-0"
              >
                {/* Archive Header */}
                <div className={`p-3 flex items-center ${isArchivePanelExpanded ? 'justify-between' : 'justify-center'} mt-1`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Folder size={18} className="text-zinc-500 dark:text-zinc-400 shrink-0" />
                    {isArchivePanelExpanded && (
                      <>
                        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Archive</span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">({archivedTasksForCurrentWorkspace.length})</span>
                      </>
                    )}
                  </div>
                  {isArchivePanelExpanded && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          if (confirm('Clear all archived tasks for this workspace? This cannot be undone.')) {
                            setArchivedTasksByWorkspace({
                              ...archivedTasksByWorkspace,
                              [activeCategory]: []
                            })
                          }
                        }}
                        className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
                        title="Delete All Archived"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => setArchivePanelWidth(60)}
                        className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
                        title="Collapse Archive Panel"
                      >
                        <PanelRightClose size={14} />
                      </button>
                    </div>
                  )}
                </div>
                {isArchivePanelCollapsed && (
                  <button
                    onClick={() => setArchivePanelWidth(320)}
                    className="mt-2 p-3 flex items-center justify-center mx-auto text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Expand Archive Panel"
                  >
                    <PanelRightOpen size={18} />
                  </button>
                )}

                {/* Archive Task List */}
                {isArchivePanelExpanded && (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide border-t border-zinc-200 dark:border-zinc-800/60">
                    {archivedTasksForCurrentWorkspace.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-zinc-400 dark:text-zinc-500 space-y-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-center border border-zinc-200 dark:border-zinc-800/50">
                          <Archive size={20} className="opacity-50" />
                        </div>
                        <p className="text-xs text-center">No archived tasks in this workspace.</p>
                      </div>
                    ) : (
                      archivedTasksForCurrentWorkspace.map((task, index) => (
                        <DraggableArchivedTask
                          key={task.id}
                          task={task}
                          index={index}
                          moveArchivedTask={moveArchivedTask}
                        >
                          <div
                            className="group flex items-center gap-3 p-3 rounded-xl border bg-zinc-50 dark:bg-[#1c1c20]/50 border-transparent opacity-70"
                          >
                            <CheckCircle2 size={18} className="text-zinc-400 flex-shrink-0" />

                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-zinc-400 dark:text-zinc-500 line-through block truncate">
                                {task.text}
                              </span>
                              {task.archivedAt && (
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                                  Archived {new Date(task.archivedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => restoreTask(task.id)}
                                className="flex items-center justify-center p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-all"
                                title="Restore Task"
                              >
                                <ArchiveRestore size={14} />
                              </button>
                              <button
                                onClick={() => deleteFromArchive(task.id)}
                                className="flex items-center justify-center p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md transition-all"
                                title="Delete Permanently"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </DraggableArchivedTask>
                      ))
                    )}
                  </div>
                )}
              </aside>
            </>
          )}
        </div>

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsSettingsOpen(false)}>
            <div className="bg-white dark:bg-[#28282e] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Settings</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Theme Toggle */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Appearance</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Choose your preferred theme</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${theme === 'light'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 shadow-sm'
                        : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                    >
                      <Sun size={20} className="text-zinc-700 dark:text-zinc-300" />
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${theme === 'dark'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 shadow-sm'
                        : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                    >
                      <Moon size={20} className="text-zinc-700 dark:text-zinc-300" />
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${theme === 'system'
                        ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 shadow-sm'
                        : 'bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                    >
                      <Settings size={20} className="text-zinc-700 dark:text-zinc-300" />
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">System</span>
                    </button>
                  </div>
                  {theme === 'system' && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                      Currently using: {actualTheme === 'dark' ? 'Dark' : 'Light'} mode
                    </p>
                  )}
                </div>

                {/* Data Import/Export */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Data & Backup</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Import or export tasks to JSON</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={importData}
                      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                      title="Import Data"
                    >
                      <Upload size={18} />
                    </button>
                    <button
                      onClick={exportData}
                      className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                      title="Export Data"
                    >
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                {/* Clear All Items */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-red-600 dark:text-red-400">Clear All Items</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Remove all tasks and workspaces</p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Clear all items? This cannot be undone.')) {
                        localStorage.removeItem(STORAGE_KEY_TASKS)
                        localStorage.removeItem(STORAGE_KEY_CATEGORIES)
                        localStorage.removeItem(STORAGE_KEY_ARCHIVED)
                        setTasks(DEFAULT_TASKS)
                        setCategories(DEFAULT_CATEGORIES)
                        setArchivedTasksByWorkspace(DEFAULT_ARCHIVED_TASKS)
                        setActiveCategory('')
                      }
                    }}
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="px-5 py-3 bg-zinc-50 dark:bg-[#1c1c20] border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-1.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        {isShortcutsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsShortcutsOpen(false)}>
            <div className="bg-white dark:bg-[#28282e] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col font-sans" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setIsShortcutsOpen(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-md transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Keyboard Shortcuts */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Navigation & Focus</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Quick actions for faster workflow</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-[#1c1c20] border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Search size={14} className="text-zinc-500 dark:text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Focus Search</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300">/</kbd>
                        <span className="text-xs text-zinc-400">or</span>
                        <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300">Ctrl+K</kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-[#1c1c20] border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Plus size={14} className="text-zinc-500 dark:text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Add Task</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300">Ctrl+L</kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-[#1c1c20] border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Settings size={14} className="text-zinc-500 dark:text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Open Settings</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300">S</kbd>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-[#1c1c20] border border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <PanelLeftClose size={14} className="text-zinc-500 dark:text-zinc-400" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Toggle Workspace Panel</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-700 dark:text-zinc-300">Tab</kbd>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">Note: Single-key shortcuts only work when not typing in input fields.</p>
                </div>
              </div>

              <div className="px-5 py-3 bg-zinc-50 dark:bg-[#1c1c20] border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
                <button
                  onClick={() => setIsShortcutsOpen(false)}
                  className="px-4 py-1.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}
