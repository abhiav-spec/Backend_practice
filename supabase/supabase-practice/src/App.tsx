import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from './supabase-client'

type Task = {
  id: number
  title: string
  description: string
}

type TaskRow = {
  id: number
  tittle: string
  description: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('task')
        .select('id, tittle, description')
        .order('id', { ascending: false })

      if (error) {
        console.error('Error loading tasks:', error)
        return
      }

      const mappedTasks = (data as TaskRow[]).map((taskRow) => ({
        id: taskRow.id,
        title: taskRow.tittle,
        description: taskRow.description,
      }))

      setTasks(mappedTasks)
    }

    void fetchTasks()
  }, [])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setEditingTaskId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle || !trimmedDescription) {
      return
    }

    if (editingTaskId !== null) {
      try {
        const { data, error } = await supabase
          .from('task')
          .update({ tittle: trimmedTitle, description: trimmedDescription })
          .eq('id', editingTaskId)
          .select('id, tittle, description')
          .single()

        if (error) {
          console.error('Error updating task:', error)
          return
        }

        if (data) {
          const updatedTask = data as TaskRow
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id
                ? {
                    id: updatedTask.id,
                    title: updatedTask.tittle,
                    description: updatedTask.description,
                  }
                : task,
            ),
          )
        }

        resetForm()
      } catch (error) {
        console.error('Error updating task:', error)
      }

      return
    }

    try {
      const { data, error } = await supabase
        .from('task')
        .insert({ tittle: trimmedTitle, description: trimmedDescription })
        .select('id, tittle, description')
        .single()

      if (error) {
        console.error('Error inserting task:', error)
        return
      }

      if (data) {
        const insertedTask = data as TaskRow
        setTasks((prevTasks) => [
          {
            id: insertedTask.id,
            title: insertedTask.tittle,
            description: insertedTask.description,
          },
          ...prevTasks,
        ])
      }
      resetForm()
    } catch (error) {
      console.error('Error submitting task:', error)
    }
  }

  const editTask = (task: Task) => {
    setTitle(task.title)
    setDescription(task.description)
    setEditingTaskId(task.id)
  }

  const deleteTask = async (taskId: number) => {
    try {
      const { error } = await supabase.from('task').delete().eq('id', taskId)

      if (error) {
        console.error('Error deleting task:', error)
        return
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
      if (editingTaskId === taskId) {
        resetForm()
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className="app-shell">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #090909;
          color: #ffffff;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }

        .app-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: radial-gradient(circle at top, #141414 0%, #090909 60%);
        }

        .task-manager {
          width: min(760px, 100%);
          border: 1px solid #3c3c3c;
          border-radius: 16px;
          background: #111111;
          padding: 28px;
        }

        .title {
          margin: 0 0 24px;
          text-align: center;
          font-size: clamp(1.75rem, 2.6vw, 2.5rem);
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .task-form {
          display: grid;
          gap: 14px;
          margin-bottom: 24px;
        }

        .input,
        .textarea {
          width: 100%;
          border: 1px solid #4a4a4a;
          border-radius: 10px;
          background: #0d0d0d;
          color: #ffffff;
          padding: 12px 14px;
          font-size: 0.98rem;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .input:focus,
        .textarea:focus {
          border-color: #6a6a6a;
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.08);
        }

        .textarea {
          min-height: 120px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .button {
          border: 1px solid #5a5a5a;
          border-radius: 10px;
          background: #1a1a1a;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          padding: 10px 16px;
          transition: background 0.2s ease, border-color 0.2s ease;
        }

        .button:hover {
          background: #262626;
          border-color: #808080;
        }

        .button.secondary {
          background: #151515;
        }

        .task-list {
          display: grid;
          gap: 12px;
        }

        .task-card {
          border: 1px solid #4d4d4d;
          border-radius: 12px;
          background: #0f0f0f;
          padding: 14px;
          display: grid;
          gap: 12px;
          text-align: center;
        }

        .task-title {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .task-description {
          margin: 0;
          color: #bcbcbc;
          white-space: pre-wrap;
          line-height: 1.45;
        }

        .task-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .empty-state {
          text-align: center;
          border: 1px dashed #444444;
          border-radius: 12px;
          padding: 18px;
          color: #aaaaaa;
        }
      `}</style>

      <main className="task-manager">
        <h1 className="title">Task Manager CRUD</h1>

        <form className="task-form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            className="textarea"
            placeholder="Task Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <div className="form-actions">
            <button className="button" type="submit">
              {editingTaskId === null ? 'Add Task' : 'Update Task'}
            </button>
            {editingTaskId !== null && (
              <button
                className="button secondary"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <section className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">No tasks yet. Add your first task.</div>
          ) : (
            tasks.map((task) => (
              <article className="task-card" key={task.id}>
                <h2 className="task-title">{task.title}</h2>
                <p className="task-description">{task.description}</p>
                <div className="task-actions">
                  <button
                    className="button"
                    type="button"
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="button secondary"
                    type="button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  )
}

export default App
