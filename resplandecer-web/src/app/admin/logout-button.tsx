import { logoutAction } from "@/lib/auth/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
      >
        Cerrar sesion
      </button>
    </form>
  );
}
