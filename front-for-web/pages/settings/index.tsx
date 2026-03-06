import { useState } from "react";
import Link from "next/link";
import AccountSettingsForm from "../../components/Settings/AccountSettingsForm";
import AuthenticatedLayout from "../../components/authenticated/AuthenticatedLayout";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  selectUser,
  selectUserGroups,
  selectUserRoles,
  selectAccessToken,
  selectTokenType,
} from "../../store/auth/selectors";
import { setUser, type UserProfile } from "../../store/auth/slice";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/common/Toast";

export default function Page() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const dispatch = useAppDispatch();
  const { toasts, addToast, removeToast } = useToast();
  const user = useAppSelector(selectUser);
  const groups = useAppSelector(selectUserGroups);
  const roles = useAppSelector(selectUserRoles);
  const accessToken = useAppSelector(selectAccessToken);
  const tokenType = useAppSelector(selectTokenType) || "Bearer";

  const [rolesPage, setRolesPage] = useState<number>(1);
  const rolesPageSize = 20;
  const totalRoles = roles.length;
  const totalRolePages = totalRoles > 0 ? Math.ceil(totalRoles / rolesPageSize) : 1;
  const currentRolesPage = Math.min(rolesPage, totalRolePages);
  const rolesStartIndex = (currentRolesPage - 1) * rolesPageSize;
  const rolesEndIndex = Math.min(rolesStartIndex + rolesPageSize, totalRoles);
  const paginatedRoles = roles.slice(rolesStartIndex, rolesEndIndex);

  const fullName = [
    user?.first_name,
    user?.middle_name,
    user?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AuthenticatedLayout>
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Settings</h5>

        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link
              href="/dashboard"
              className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500"
            >
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">
                home
              </i>
              Dashboard
            </Link>
          </li>

          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            Settings
          </li>
        </ol>
      </div>

      <div className="trezo-card bg-white dark:bg-[#0c1427] pt-[20px] md:pt-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="trezo-tabs mb-[20px] md:mb-[25px]">
            <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto">
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(0)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 0
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">person</i>
                  Overview
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 1
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">edit</i>
                  Edit Profile
                </button>
              </li>

              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${
                    activeTab === 2
                      ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <i className="material-symbols-outlined !text-[20px]">lock</i>
                  Change Password
                </button>
              </li>
            </ul>
          </div>

          {activeTab === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[25px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                  Profile Overview
                </h6>
                <div className="space-y-[12px] text-sm">
                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                    <span className="text-black dark:text-white font-medium">
                      {fullName || user?.email || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-black dark:text-white font-medium">
                      {user?.email || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="text-black dark:text-white font-medium">
                      {user?.category || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Company:</span>
                    <span className="text-black dark:text-white font-medium">
                      {user?.company?.name || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                    <span className="text-black dark:text-white font-medium">
                      {user?.customer?.name || "-"}
                    </span>
                  </div>

                  <div className="pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400 block mb-[6px]">
                      Groups:
                    </span>
                    <div className="flex flex-wrap gap-[6px]">
                      {groups.length > 0 ? (
                        groups.map((g) => (
                          <span
                            key={g.id}
                            className="inline-flex items-center px-[10px] py-[4px] rounded-full text-xs bg-gray-100 dark:bg-[#172036] text-gray-700 dark:text-gray-200"
                          >
                            {g.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          No groups assigned
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-600 dark:text-gray-400 block mb-[6px]">
                      Roles:
                    </span>
                    {roles.length === 0 ? (
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        No roles assigned
                      </span>
                    ) : (
                      <div className="mt-[6px]">
                        <div className="overflow-x-auto border border-gray-100 dark:border-[#172036] rounded-md">
                          <table className="min-w-full text-xs">
                            <thead className="bg-gray-50 dark:bg-[#111827]">
                              <tr>
                                <th className="px-[10px] py-[8px] text-left font-semibold text-gray-700 dark:text-gray-200">
                                  #
                                </th>
                                <th className="px-[10px] py-[8px] text-left font-semibold text-gray-700 dark:text-gray-200">
                                  Role Name
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedRoles.map((r, index) => (
                                <tr
                                  key={r.id}
                                  className="border-t border-gray-100 dark:border-[#172036]"
                                >
                                  <td className="px-[10px] py-[6px] text-gray-600 dark:text-gray-300">
                                    {rolesStartIndex + index + 1}
                                  </td>
                                  <td className="px-[10px] py-[6px] text-gray-800 dark:text-gray-100">
                                    {r.name}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex items-center justify-between mt-[8px] text-[11px] text-gray-600 dark:text-gray-400">
                          <span>
                            Showing {rolesStartIndex + 1}-{rolesEndIndex} of {totalRoles} roles
                          </span>
                          <div className="flex items-center gap-[6px]">
                            <button
                              type="button"
                              className="px-[8px] py-[4px] rounded border border-gray-200 dark:border-[#172036] disabled:opacity-50"
                              disabled={currentRolesPage <= 1}
                              onClick={() => setRolesPage((p) => Math.max(1, p - 1))}
                            >
                              Prev
                            </button>
                            <span>
                              Page {currentRolesPage} of {totalRolePages}
                            </span>
                            <button
                              type="button"
                              className="px-[8px] py-[4px] rounded border border-gray-200 dark:border-[#172036] disabled:opacity-50"
                              disabled={currentRolesPage >= totalRolePages}
                              onClick={() =>
                                setRolesPage((p) =>
                                  Math.min(totalRolePages, p + 1)
                                )
                              }
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                  Account Status
                </h6>
                <div className="space-y-[10px] text-sm">
                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Active:</span>
                    <span className="text-black dark:text-white font-medium">
                      {user?.is_active ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Email Verified:</span>
                    <span className="text-black dark:text-white font-medium">
                      {user?.email_verified_at ? "Yes" : "No"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Joined:</span>
                    <span className="text-black dark:text-white font-medium">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md max-w-2xl mx-auto">
              <div className="trezo-card-content">
                <AccountSettingsForm
                  user={user || null}
                  onSubmit={async (payload) => {
                    if (!accessToken) {
                      const message = "Not authenticated";
                      addToast(message, "error");
                      throw new Error(message);
                    }
                    const res = await fetch("/api/auth/update-profile", {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `${tokenType} ${accessToken}`,
                      },
                      body: JSON.stringify(payload),
                    });

                    const data = await res.json().catch(() => null);

                    if (!res.ok) {
                      const message = data?.message || "Failed to update profile";
                      addToast(message, "error");
                      throw new Error(message);
                    }

                    if (data?.user) {
                      const updatedUser = data.user as UserProfile;
                      dispatch(setUser(updatedUser));

                      // keep localStorage auth in sync if present
                      try {
                        const raw = localStorage.getItem("auth");
                        if (raw) {
                          const parsed = JSON.parse(raw);
                          localStorage.setItem(
                            "auth",
                            JSON.stringify({
                              ...parsed,
                              user: updatedUser,
                            })
                          );
                        }
                      } catch {
                        // ignore storage errors
                      }

                      addToast(
                        data?.message || "Profile updated successfully",
                        "success"
                      );
                    }
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="trezo-card bg-white dark:bg-[#0c1427] mb-[25px] p-[20px] md:p-[25px] rounded-md max-w-xl mx-auto">
              <h6 className="text-black dark:text-white font-semibold mb-[15px]">
                Change Password
              </h6>
              <ChangePasswordForm
                canSubmit={!!accessToken}
                token={`${tokenType} ${accessToken ?? ""}`}
                onSuccess={(message) =>
                  addToast(message || "Password updated successfully", "success")
                }
                onError={(message) => addToast(message, "error")}
              />
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

type ChangePasswordFormProps = {
  canSubmit: boolean;
  token: string;
};

const ChangePasswordForm: React.FC<ChangePasswordFormProps & {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}> = ({ canSubmit, token, onSuccess, onError }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      const message = "Not authenticated";
      setError(message);
      onError(message);
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message = data?.message || "Failed to update password";
        throw new Error(message);
      }

      const message = data?.message || "Password updated successfully";
      setSuccess(message);
      onSuccess(message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error("change password error", err);
      const message = err?.message || "Failed to update password";
      setError(message);
      onError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-[15px] text-sm" onSubmit={handleSubmit}>
      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm">{error}</div>
      )}
      {success && (
        <div className="text-green-600 dark:text-green-400 text-sm">{success}</div>
      )}

      <div>
        <label className="mb-[8px] text-black dark:text-white font-medium block">
          Current Password
        </label>
        <input
          type="password"
          className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 focus:border-primary-500"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-[8px] text-black dark:text-white font-medium block">
          New Password
        </label>
        <input
          type="password"
          className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 focus:border-primary-500"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-[8px] text-black dark:text-white font-medium block">
          Confirm New Password
        </label>
        <input
          type="password"
          className="h-[48px] rounded-md text-black dark:text-white border border-gray-200 dark:border-[#172036] bg-white dark:bg-[#0c1427] px-[14px] block w-full outline-0 focus:border-primary-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div className="pt-[10px]">
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="font-medium inline-flex items-center justify-center transition-all rounded-md py-[10px] px-[22px] bg-primary-500 text-white hover:bg-primary-400 disabled:opacity-60"
        >
          <span className="inline-block relative ltr:pl-[24px] rtl:pr-[24px]">
            <i className="material-symbols-outlined ltr:left-0 rtl:right-0 absolute top-1/2 -translate-y-1/2">
              key
            </i>
            {submitting ? "Updating..." : "Update Password"}
          </span>
        </button>
      </div>
    </form>
  );
};
