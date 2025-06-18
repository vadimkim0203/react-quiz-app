import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { v4 as uuidv4 } from 'uuid';

const TASKS = [
  { name: 'Reading', color: 'bg-blue-400' },
  { name: 'Math', color: 'bg-green-400' },
  { name: 'Break', color: 'bg-yellow-400' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => `${8 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`);

export default function ScheduleBuilder() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [blocks, setBlocks] = useState([]);

  const handleGridClick = (index) => {
    if (!selectedTask) return;
    setBlocks(prev => [
      ...prev,
      {
        id: uuidv4(),
        task: selectedTask,
        position: index,
        duration: 1,
      },
    ]);
  };

  const handleResize = (id, newSize) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, duration: Math.max(1, Math.round(newSize.height / 40)) } : block
      )
    );
  };

  return (
    <div className="flex w-full h-screen p-4 gap-4">
      {/* Task List */}
      <div className="w-1/4 bg-gray-100 rounded p-4">
        <h2 className="font-bold mb-2">Tasks</h2>
        {TASKS.map(task => (
          <button
            key={task.name}
            className={`w-full mb-2 py-2 px-3 rounded ${task.color} ${selectedTask?.name === task.name ? 'ring-2 ring-black' : ''}`}
            onClick={() => setSelectedTask(task)}
          >
            {task.name}
          </button>
        ))}
      </div>

      {/* Time Grid */}
      <div className="w-3/4 relative">
        <div className="grid grid-cols-1 gap-[1px] bg-gray-300 h-full" style={{ gridTemplateRows: 'repeat(24, 40px)' }}>
          {HOURS.map((label, index) => (
            <div
              key={index}
              className="bg-white cursor-pointer relative"
              onClick={() => handleGridClick(index)}
            >
              <span className="absolute left-1 top-1 text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>

        {/* Render Tasks */}
        {blocks.map((block) => (
          <Rnd
            key={block.id}
            default={{
              x: 0,
              y: block.position * 40,
              width: '100%',
              height: block.duration * 40,
            }}
            bounds="parent"
            enableResizing={{ top: false, right: false, bottom: true, left: false }}
            onResizeStop={(e, direction, ref) =>
              handleResize(block.id, { height: parseInt(ref.style.height) })
            }
            disableDragging
            className={`absolute px-2 py-1 text-white text-sm ${block.task.color} rounded`}
          >
            {block.task.name}
          </Rnd>
        ))}
      </div>
    </div>
  );
}
