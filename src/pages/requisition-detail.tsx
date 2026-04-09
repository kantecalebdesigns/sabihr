import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MOCK_REQUISITIONS,
  REQ_TYPE_STYLES,
  REQ_STATUS_STYLES,
  formatReqCurrency,
} from "@/lib/requisitions-mock-data";

export default function RequisitionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const req = MOCK_REQUISITIONS.find((r) => r.id === id);

  if (!req) {
    return (
      <div className="space-y-6">
        <Link to="/requisitions" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Requisitions
        </Link>
        <div className="rounded-xl border border-dashed border-[#efefef] bg-white p-12 text-center">
          <FileText className="w-10 h-10 mx-auto text-slate-500" />
          <p className="mt-3 text-sm text-slate-500">Requisition not found</p>
        </div>
      </div>
    );
  }

  const typeStyle = REQ_TYPE_STYLES[req.type];
  const statusStyle = REQ_STATUS_STYLES[req.status];

  const infoRows: { label: string; value: React.ReactNode }[] = [
    { label: "Type", value: <span className={cn("font-medium", typeStyle.color)}>{typeStyle.label}</span> },
    { label: "Category", value: req.category },
    { label: "Amount", value: <span className="font-medium">{formatReqCurrency(req.amount)}</span> },
    { label: "Employee", value: req.employeeName },
    { label: "Department", value: req.department },
    { label: "Date", value: req.requestDate },
    { label: "Status", value: <span className={cn("font-medium", statusStyle.color)}>{statusStyle.label}</span> },
  ];

  return (
    <div className="space-y-6">
      <Link to="/requisitions" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Requisitions
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight">Requisition {req.id}</h1>

      {/* Summary card */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-4">Summary</h2>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
          {infoRows.map((row) => (
            <div key={row.label}>
              <dt className="text-xs text-slate-500">{row.label}</dt>
              <dd className="text-sm mt-0.5">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Approval info */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-4">Approval</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-xs text-slate-500">Approver</dt>
            <dd className="text-sm mt-0.5">{req.approver}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Approved Date</dt>
            <dd className="text-sm mt-0.5">{req.approvedDate ?? "Pending"}</dd>
          </div>
        </dl>
      </div>

      {/* Notes */}
      {req.notes && (
        <div className="rounded-xl border border-[#efefef] bg-white p-5">
          <h2 className="text-sm font-medium text-slate-500 mb-2">Notes</h2>
          <p className="text-sm">{req.notes}</p>
        </div>
      )}

      {/* Description */}
      <div className="rounded-xl border border-[#efefef] bg-white p-5">
        <h2 className="text-sm font-medium text-slate-500 mb-2">Description</h2>
        <p className="text-sm">{req.description}</p>
      </div>
    </div>
  );
}
