import { useRef } from 'react';

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.1)' }) => {
  const divRef = useRef(null);

  const handleMouseMove = e => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden before:absolute before:inset-0 before:z-0 before:bg-[radial-gradient(600px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),var(--spotlight-color,rgba(255,255,255,0.1)),transparent_50%)] before:opacity-0 before:transition-opacity before:duration-[400ms] before:pointer-events-none hover:before:opacity-100 [&>*]:relative [&>*]:z-[1] ${className}`}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
