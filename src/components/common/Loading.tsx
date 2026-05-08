type Props = {
  text?: string;
};

export default function Loading({ text = "Loading..." }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      
      {/* SPINNER */}
      <div className="w-14 h-14 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4" />

      {/* TEXT */}
      <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">
        {text}
      </p>
    </div>
  );
}