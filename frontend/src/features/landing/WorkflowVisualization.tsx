import {
  MessageSquare,
  Database,
  Cpu,
  UserCheck,
  CheckSquare,
} from 'lucide-react';

export const WorkflowVisualization = () => {
  const steps = [
    {
      num: '01',
      title: 'Guest Inquiry',
      desc: 'In-suite tablet or voice intake',
      icon: MessageSquare,
    },
    {
      num: '02',
      title: 'Knowledge Verification',
      desc: 'Grounded against hotel database & SOPs',
      icon: Database,
    },
    {
      num: '03',
      title: 'Proposed Action',
      desc: 'SOP-compliant solution & ticket formulation',
      icon: Cpu,
    },
    {
      num: '04',
      title: 'Human Review',
      desc: 'Supervisor discretion when constraints conflict',
      icon: UserCheck,
    },
    {
      num: '05',
      title: 'Service Outcome',
      desc: 'Dispatched task & SLA tracking',
      icon: CheckSquare,
    },
  ];

  return (
    <div className="w-full py-12">
      <div className="relative">
        {/* Desktop Connecting SVG Hairline */}
        <div className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-0.5 bg-hairline -z-0">
          <div className="h-full bg-burgundy/40 w-full animate-pulse"></div>
        </div>

        {/* 5 Step Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-hairline p-5 flex flex-col items-center text-center transition-all hover:border-burgundy/60"
              >
                <div className="w-12 h-12 bg-linen-100 border border-hairline flex items-center justify-center text-burgundy mb-3 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono uppercase text-burgundy font-bold mb-1">
                  Step {step.num}
                </span>
                <h4 className="font-headline font-bold text-sm text-sand-900 mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-sand-600 font-body leading-snug">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

