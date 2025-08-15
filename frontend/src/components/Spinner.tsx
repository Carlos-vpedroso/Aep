"use client";

interface SpinnerProps {
  size?: string; // classes do Tailwind, ex: 'w-10 h-10'
  color?: string; // classes do Tailwind, ex: 'border-blue-500'
}

const Spinner = ({ size = "w-5 h-5", color = "border-white" }: SpinnerProps) => {
  return (
    <div className={`flex justify-center items-center`}>
      <div
        className={`${size} ${size} border-4 border-t-transparent border-solid rounded-full animate-spin ${color}`}
      ></div>
    </div>
  );
};

export default Spinner;
