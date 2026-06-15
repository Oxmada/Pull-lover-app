import "./Toast.css";

export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`admin-toast admin-toast-${toast.type === "error" ? "error" : "success"}`}>
      {toast.message}
    </div>
  );
}
