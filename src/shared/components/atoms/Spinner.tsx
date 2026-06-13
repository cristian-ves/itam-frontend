interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const Spinner = ({ size = "md", label }: SpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        <div
          className={`${sizes[size]} animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600`}
        />
        <div className="absolute h-1.5 w-1.5 rounded-full bg-indigo-600" />
      </div>
      {label && <p className="text-sm text-gray-400 tracking-wide">{label}</p>}
    </div>
  );
};

export default Spinner;
