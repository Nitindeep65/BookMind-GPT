
interface ProcessStepProps {
	step: number;
	title: string;
	description?: string;
	status: "pending" | "active" | "done";
}

export function ProcessStep({ step, title, description, status }: ProcessStepProps) {
	let statusColor = "bg-neutral-700";
	if (status === "active") statusColor = "bg-blue-500 animate-pulse";
	if (status === "done") statusColor = "bg-green-500";

	return (
		<div className="flex items-center gap-4 mb-6">
			<div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg ${statusColor}`}>
				{step}
			</div>
			<div>
				<div className="text-white text-lg font-semibold">{title}</div>
				{description && <div className="text-neutral-400 text-sm">{description}</div>}
			</div>
		</div>
	);
}
