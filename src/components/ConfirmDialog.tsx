import Button from "./Button";

type ConfirmDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({ onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <div className="bg-half-transparent flex h-full w-full items-center justify-center">
      <div className="w-80 rounded bg-gray-700 p-6">
        <h3 className="mb-16 text-lg font-bold text-white">Are you sure?</h3>
        <div className="flex justify-between">
          <Button onClick={onConfirm}>Confirm</Button>
          <Button gray={true} onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
