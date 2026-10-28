import { useState } from 'react';
import {
  Clock,
  CheckCircle,
  Plus,
  Filter,
  UserCheck,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { DEMO_SERVICE_TASKS } from '../../services/mockData';
import type {
  ServiceTaskItem,
  ServiceDepartment,
  ServicePriority,
  ServiceTaskStatus,
} from '../../types';

const DEPARTMENTS: (ServiceDepartment | 'All')[] = [
  'All',
  'Housekeeping',
  'Maintenance',
  'Luggage & Porter',
  'Front Desk',
  'In-Room Dining',
];

export const ServiceDispatcher = () => {
  const [tasks, setTasks] = useState<ServiceTaskItem[]>(DEMO_SERVICE_TASKS);
  const [selectedDept, setSelectedDept] = useState<ServiceDepartment | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formRoom, setFormRoom] = useState('');
  const [formGuest, setFormGuest] = useState('');
  const [formDept, setFormDept] = useState<ServiceDepartment>('Housekeeping');
  const [formPriority, setFormPriority] = useState<ServicePriority>('Normal');
  const [formStaff, setFormStaff] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formSla, setFormSla] = useState(30);

  const filteredTasks = tasks.filter((t) => {
    const matchesDept = selectedDept === 'All' || t.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesDept && matchesStatus;
  });

  const handleUpdateStatus = (taskId: string, newStatus: ServiceTaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formRoom.trim()) return;

    const newTask: ServiceTaskItem = {
      id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formTitle.trim(),
      roomNumber: formRoom.trim().startsWith('Room') ? formRoom.trim() : `Room ${formRoom.trim()}`,
      guestName: formGuest.trim() || 'In-House Guest',
      department: formDept,
      priority: formPriority,
      status: 'Pending',
      assignedStaff: formStaff.trim() || 'Duty Dispatch Pool',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      targetCompletion: 'Within SLA',
      slaMinutes: Number(formSla) || 30,
      notes: formNotes.trim() || 'Standard operational protocol.',
      isSimulatedDemo: true,
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsModalOpen(false);

    setFormTitle('');
    setFormRoom('');
    setFormGuest('');
    setFormNotes('');
  };

  return (
    <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              Department Operations
            </span>
            <span className="text-xs font-mono text-slate-500">
              Service Request Dispatcher
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Service Tasks &amp; Operational Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Coordinate housekeeping, engineering diagnostics, baggage handling, and in-room amenities across active hotel shifts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Task</span>
        </button>
      </div>

      {/* Operational Notice */}
      <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-indigo-600 flex-none mt-0.5" />
        <div>
          <strong>Operational Notice:</strong> No backend task-persistence API currently exists in the Django schema. This dispatcher operates as an interactive, stateful session demo allowing shift supervisors to test triage flows, SLA tracking, and staff assignments.
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedDept === dept
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-semibold">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-indigo-600"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Dispatched">Dispatched</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Escalated">Escalated</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Task ID</th>
                <th className="py-3.5 px-4">Room &amp; Guest</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Assigned Staff</th>
                <th className="py-3.5 px-4">SLA / Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{t.roomNumber}</div>
                    <div className="text-[11px] text-slate-400 font-medium">{t.guestName}</div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {t.department}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{t.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{t.notes}</div>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-slate-600 whitespace-nowrap">
                    <span className="flex items-center gap-1 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      {t.assignedStaff}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${
                          t.status === 'Completed'
                            ? 'bg-emerald-500'
                            : t.status === 'In Progress'
                            ? 'bg-blue-500'
                            : t.status === 'Dispatched'
                            ? 'bg-amber-500'
                            : t.status === 'Escalated'
                            ? 'bg-rose-500'
                            : 'bg-slate-400'
                        }`}
                      ></span>
                      <span className="font-bold text-[11px] uppercase text-slate-800">
                        {t.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" />
                      Target: {t.slaMinutes}m SLA
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {t.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-700" />
                          <span>Done</span>
                        </button>
                      )}
                      {t.status === 'Pending' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'In Progress')}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase transition-colors cursor-pointer"
                        >
                          Dispatch
                        </button>
                      )}
                      {t.status !== 'Escalated' && t.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'Escalated')}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          <span>Escalate</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                Dispatch New Operational Task
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. VIP Silk Pillow Refresh & Botanical Mist"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. Room 402"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    value={formGuest}
                    onChange={(e) => setFormGuest(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Department
                  </label>
                  <select
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value as ServiceDepartment)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Luggage & Porter">Luggage &amp; Porter</option>
                    <option value="Front Desk">Front Desk</option>
                    <option value="In-Room Dining">In-Room Dining</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Priority
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as ServicePriority)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Urgent">Urgent (15m SLA)</option>
                    <option value="High">High (30m SLA)</option>
                    <option value="Normal">Normal (60m SLA)</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Assigned Staff / Team
                  </label>
                  <input
                    type="text"
                    value={formStaff}
                    onChange={(e) => setFormStaff(e.target.value)}
                    placeholder="e.g. Jean-Luc (Senior Bellman)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    SLA Target (Minutes)
                  </label>
                  <input
                    type="number"
                    value={formSla}
                    onChange={(e) => setFormSla(Number(e.target.value))}
                    min={5}
                    max={240}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Operational Instructions
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Ensure guest receives signature luggage claim tags."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Create &amp; Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
