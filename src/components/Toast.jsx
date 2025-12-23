export default function Toast({ text }) {
  if (!text) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow z-50">
      {text}
    </div>
  );
}

