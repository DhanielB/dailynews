import { Warning } from "phosphor-react";
import { useEffect, useState } from "react";

export default function InputForm(props) {
  const { className, text, error } = props;
  const [showError, setShowError] = useState(props.error || null);

  useEffect(() => {
    setShowError(error);

    setTimeout(() => {
      setShowError(null);
    }, 5000);
  }, [error]);

  return (
    <div className={className}>
      <p className="text-[0.8rem] font-semibold top-[5.9rem] left-[1rem] md:left-[16rem] md:top-[5.45rem] md:text-[0.875rem] absolute">
        {text}
      </p>
      <input
        {...props}
        className="text-5 px-4 py-[0.75rem] top-[7rem] left-[0.5rem] w-[24.7rem] border border-black border-opacity-20 rounded-md outline-none bg-transparent focus:border-[#3277ca] md:px-4 md:py-[0.5rem] md:top-[6.725rem] md:left-[16rem] md:w-[31.5rem] absolute"
      ></input>

      {showError ? (
        <div>
          <div className="warn">
            <Warning color="red" weight="bold" />
          </div>

          <p className="flex w-screen text-red-600 font-[600] text-[0.8rem] top-[10rem] left-[2.5rem] md:left-[17.5rem] md:top-[9.45rem] md:text-[0.875rem] absolute">
            {showError}
          </p>
        </div>
      ) : null}

      <style jsx>{`
        .warn {
          top: 10.25rem;
          left: 1rem;
          position: absolute;
        }

        @media (min-width: 768px) {
          .warn {
            left: 16rem;
            top: 9.65rem;
            position: absolute;
          }
        }
      `}</style>
    </div>
  );
}
