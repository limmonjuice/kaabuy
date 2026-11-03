function CustomTooltip({ active, payload, label, formatCurrency }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-2xl animate-fadeIn">
        <p className="text-white/80 text-xs font-medium mb-2">
          {payload[0].payload.fullLabel}
        </p>
        <p className="text-white text-lg font-bold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
