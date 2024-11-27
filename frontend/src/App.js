import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa'; // Icon for delete button

const App = () => {
  const [tasks, setTasks] = useState([]); // Default empty task list
  const [task, setTask] = useState(''); // Input for task title
  const [description, setDescription] = useState(''); // Input for task description
  const [loading, setLoading] = useState(true); // Loading state for better UX
  const [error, setError] = useState(null); // Error state

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      setLoading(true); // Start loading state
      const res = await axios.get('http://localhost:4000/getTodos'); // Fetch from backend
      console.log('Fetched tasks:', res.data); // Debugging response
      setTasks(Array.isArray(res.data) ? res.data : []); // Ensure tasks is an array
      setLoading(false); // End loading state
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks'); // Set error state
      setLoading(false); // End loading state
    }
  };

  // Add a new task
  const addTask = async () => {
    if (task.trim() && description.trim()) {
      try {
        const res = await axios.post('http://localhost:4000/createTodo', {
          title: task,
          description: description,
        });
        console.log('Added task:', res.data.data); // Debugging new task
        setTasks([...tasks, res.data.data]); // Add the new task to the task list
        setTask('');
        setDescription('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/deleteTodo/${id}`);
      console.log(`Deleted task with ID: ${id}`); // Debugging deleted task
      setTasks(tasks.filter((t) => t._id !== id)); // Remove the deleted task
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Toggle task completion (cross out the task)
  const toggleCompletion = async (id) => {
    try {
      const taskToUpdate = tasks.find((t) => t._id === id);
      taskToUpdate.completed = !taskToUpdate.completed; // Toggle completion state
      await axios.put(`http://localhost:4000/updateTodo/${id}`, taskToUpdate); // Update task in backend
      setTasks([...tasks]); // Re-render tasks
    } catch (error) {
      console.error('Error updating task completion:', error);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log('Updated tasks state:', tasks); // Debugging tasks state
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-semibold text-gray-700 mb-6">To-Do List</h1>
      {loading ? (
        <p className="text-xl text-gray-500">Loading tasks...</p> // Show loading state
      ) : error ? (
        <p className="text-red-500">{error}</p> // Show error state
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-6 w-full max-w-lg">
            <input
              type="text"
              className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task Title"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
            <textarea
              className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button
              className="bg-blue-600 text-white p-3 rounded-md shadow-md hover:bg-blue-700 transition-all duration-200"
              onClick={addTask}
            >
              Add Task
            </button>
          </div>
          <ul className="w-full max-w-lg space-y-4">
            {tasks.length > 0 ? (
              tasks.map((t) => (
                <li
                  key={t._id}
                  className={`flex flex-col justify-between items-start bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${t.completed ? 'line-through text-gray-500' : ''}`}
                  onClick={() => toggleCompletion(t._id)} // Toggle completion on task click
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-semibold text-xl text-gray-800">{t.title}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={(e) => { e.stopPropagation(); deleteTask(t._id); }} // Prevent click from triggering toggle completion
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{t.description}</p>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-600">No tasks available.</p>
            )}
          </ul>

          
        </>
      )}
    </div>
  );
};

export default App;
