interface DesignIssuesProps {
  issues: string[];
}

export default function DesignIssues({ issues }: DesignIssuesProps) {
  if (issues.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 animate-slide-up animate-delay-300">
      <div className="text-sm text-gray-600 mb-3">Issues</div>
      <div className="flex flex-wrap gap-2">
        {issues.map((issue, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-xs font-semibold rounded-full bg-red-50/80 text-red-700 border border-red-100/50"
          >
            {issue}
          </span>
        ))}
      </div>
    </div>
  );
}

