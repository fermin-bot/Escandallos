export default function Semaforo({ marginPct }) {
  let color = 'bg-gray-400';
  if (marginPct >= 25) color = 'bg-green-500';
  else if (marginPct >= 15) color = 'bg-yellow-500';
  else if (marginPct > 0) color = 'bg-red-500';
  return <span className={`inline-block w-3 h-3 rounded-full ${color}`} />;
}

