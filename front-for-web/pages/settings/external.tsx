import { useState } from "react";
import Link from "next/link";
import AccountSettingsForm from "../../components/Settings/AccountSettingsForm";
import AuthenticatedSimpleLayout from "../../components/authenticated/AuthenticatedSimpleLayout";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectUser, selectAccessToken, selectTokenType } from "../../store/auth/selectors";
import { setUser, type UserProfile } from "../../store/auth/slice";
import { useToast } from "../../hooks/useToast";
import { ToastContainer } from "../../components/common/Toast";

export default function Page() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const dispatch = useAppDispatch();
  const { toasts, addToast, removeToast } = useToast();
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);
  const tokenType = useAppSelector(selectTokenType) || "Bearer";

  if (!user || (user.category !== 'company' && user.category !== 'customer')) {
    // Only for external users
    return null;
  }

  const fullName = [user?.first_name, user?.middle_name, user?.last_name].filter(Boolean).join(" ");

  return (
    <AuthenticatedSimpleLayout dashboardHref={user.category === 'company' ? '/company-user-dashboard' : '/customer-user-dashboard'}>
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <div className="mb-[25px] md:flex items-center justify-between">
        <h5 className="!mb-0">Settings</h5>
        <ol className="breadcrumb mt-[12px] md:mt-0">
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">
            <Link href={user.category === 'company' ? '/company-user-dashboard' : '/customer-user-dashboard'} className="inline-block relative ltr:pl-[22px] rtl:pr-[22px] transition-all hover:text-primary-500">
              <i className="material-symbols-outlined absolute ltr:left-0 rtl:right-0 !text-lg -mt-px text-primary-500 top-1/2 -translate-y-1/2">home</i>
              Dashboard
            </Link>
          </li>
          <li className="breadcrumb-item inline-block relative text-sm mx-[11px] ltr:first:ml-0 rtl:first:mr-0 ltr:last:mr-0 rtl:last:ml-0">Settings</li>
        </ol>
      </div>
      <div className="trezo-card bg-white dark:bg-[#0c1427] pt-[20px] md:pt-[25px] rounded-md">
        <div className="trezo-card-content">
          <div className="trezo-tabs mb-[20px] md:mb-[25px]">
            <ul className="navs border-b border-gray-100 dark:border-[#172036] overflow-x-auto">
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button type="button" onClick={() => setActiveTab(0)} className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${activeTab === 0 ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}>
                  <i className="material-symbols-outlined !text-[20px]">person</i>
                  Overview
                </button>
              </li>
              <li className="nav-item inline-block ltr:mr-[50px] rtl:ml-[50px]">
                <button type="button" onClick={() => setActiveTab(1)} className={`nav-link flex items-center gap-[8px] pb-[12px] transition-all relative font-medium whitespace-nowrap ${activeTab === 1 ? "text-primary-500 border-b-[3px] border-primary-500 pb-[9px]" : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"}`}>
                  <i className="material-symbols-outlined !text-[20px]">edit</i>
                  Edit Profile
                </button>
              </li>
            </ul>
          </div>
          {activeTab === 0 && (
            <div className="grid grid-cols-1 gap-[25px]">
              <div className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md">
                <h6 className="text-black dark:text-white font-semibold mb-[15px]">Profile Overview</h6>
                <div className="space-y-[12px] text-sm">
                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Full Name:</span>
                    <span className="text-black dark:text-white font-medium">{fullName || user?.email || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-black dark:text-white font-medium">{user?.email || "-"}</span>
                  </div>
                  <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="text-black dark:text-white font-medium">{user?.category || "-"}</span>
                  </div>
                  {user.category === 'company' && (
                    <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-600 dark:text-gray-400">Company:</span>
                      <span className="text-black dark:text-white font-medium">{user?.company?.name || "-"}</span>
                    </div>
                  )}
                  {user.category === 'customer' && (
                    <div className="flex justify-between items-center pb-[10px] border-b border-gray-100 dark:border-[#172036]">
                      <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                      <span className="text-black dark:text-white font-medium">{user?.customer?.name || "-"}</span>
                    </div>
                  )}
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
                      try {
                        const raw = localStorage.getItem("auth");
                        if (raw) {
                          const parsed = JSON.parse(raw);
                          localStorage.setItem(
                            "auth",
                            JSON.stringify({ ...parsed, user: updatedUser })
                          );
                        }
                      } catch {}
                      addToast(data?.message || "Profile updated successfully", "success");
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedSimpleLayout>
  );
}
