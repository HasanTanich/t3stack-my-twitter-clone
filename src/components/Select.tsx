import { useState, useRef, useEffect, type ReactNode } from "react";
import { VscChevronDown } from "react-icons/vsc";
import { ConfirmDialog } from "./ConfirmDialog";

type SelectProps = {
  children: ReactNode;
  options: string[];
  className?: string;
  dropdowns?: {
    label: string;
    items: string[];
  }[];
  onClick: (option: string) => void;
};

export function Select({
  children,
  options,
  className = "",
  dropdowns,
  onClick,
}: SelectProps) {
  const [isActive, setIsActive] = useState(false);
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);

  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // Clicked outside the element, do something
        setIsActive(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Pressed escape key, do something
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  const onOption = (option: string) => {
    if (option.toLowerCase() === "delete") {
      setIsConfirmDialog(true);
      setIsActive(false);
    } else {
      onClick(option);
      setIsActive(false);
    }
  };
  const onCloseDialog = () => {
    setIsConfirmDialog(false);
  };

  function onDelete() {
    onClick("delete");
  }

  return (
    <>
      <div>
        <button onClick={() => setIsActive(!isActive)}>{children}</button>
        {isActive && (
          <ul
            className={`absolute w-60 rounded-xl bg-white shadow-md shadow-gray-600 ${className} z-1000`}
            ref={ref}
          >
            {options.map((option) => (
              <li
                key={option}
                className="cursor-pointer p-4 text-lg first:rounded-t-xl last:rounded-b-xl hover:bg-gray-200"
                onClick={() => onOption(option)}
              >
                {option}
              </li>
            ))}
            <div className="border-t">
              {dropdowns && (
                <>
                  {dropdowns.map((dropdown) => (
                    <Dropdown
                      key={dropdown.label}
                      label={dropdown.label}
                      options={dropdown.items}
                    />
                  ))}
                </>
              )}
            </div>
          </ul>
        )}
      </div>
      {isConfirmDialog && (
        <div className="z-1000 fixed inset-0">
          <ConfirmDialog onConfirm={onDelete} onCancel={onCloseDialog} />
        </div>
      )}
    </>
  );
}

type DropdownProps = {
  label: string;
  options: string[];
  className?: string;
};

function Dropdown({ label, options, className = "" }: DropdownProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <li
        className={`cursor-pointer p-4 font-semibold last:rounded-b-xl hover:bg-gray-200 ${className}`}
        onClick={() => setIsActive(!isActive)}
      >
        <span className="flex items-center justify-between">
          <p>{label}</p>
          <VscChevronDown
            className={`h-5 w-10 duration-100 ${
              isActive ? "rotate rotate-180 fill-blue-700" : ""
            }`}
          />
        </span>
      </li>
      {isActive &&
        options.map((option) => (
          <li
            key={option}
            className="flex cursor-pointer items-center justify-between p-4 last:rounded-b-xl hover:bg-gray-200"
          >
            {option}
          </li>
        ))}
    </>
  );
}
