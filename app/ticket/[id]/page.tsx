"use client";

import {
  BASE_URL,
  GET_SITESETTINGS,
  TICKET_CHECK_ID,
  TICKET_POST,
  USER_ME,
} from "@/lib/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Menu, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";

type GeneralSettings = {
  ticket: {
    subject: string;
  };
  email: string;
  email2: string;
  phone: number;
  phone2: number;
  address2: string;
  rams_logo: string;
  ticket_details?: TicketDetail[]; // <-- Added this line
};
type UserMe = {
  first_name: string;
  last_name: string;
  email: string;
  ticket_department: string;
  primary_phone: string;
  logo: string;
  subject: string;
  rl_no: number;
  address: string;
  company_name: string;
};

type SignUpFormInputs = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  primary_phone: string;
  ticket_department: string;
  ticket_priority: string; // <-- Added this line
  rl_no: string;
  address: string;
  company_name: string;
  subject: string;
  logo: FileList;
  label: string;
  message: string;
  image?: FileList; // <-- Added this line
};

// const inputStyle: React.CSSProperties = {
//   width: "100%",
//   padding: "0.5rem",
//   borderRadius: "4px",
//   border: "1px solid #e2e8f0",
//   marginBottom: "1rem",
// };

// type Department = { id: number; name: string };
type DepartmentOption = { label: string; value: number } | null;

type TicketDetail = {
  id: number;
  message: string;
  ticket_no?: string; // <-- Added this line
  ticket?: {
    subject?: string;
    // ... other fields if needed
  };

  admin?: {
    first_name?: string;
    last_name?: string;
    image?: string;
  };
  customer?: {
    first_name?: string;
    last_name?: string;
    image?: string;
  };
  created_at?: string;
  images?: Array<{
    id: Key | null | undefined;
    image?: FileList;
    // ... other fields if needed
  }>;
  // ... other fields
};

const TicketItemPage = () => {
  const methods = useForm<SignUpFormInputs>({
    defaultValues: {
      ticket_department: "",
    },
  });
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const { register, handleSubmit } = methods;
  // const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const [departments, setDepartments] = useState<Department[]>([]);
  // const [selectedDepartment, setSelectedDepartment] =
  useState<DepartmentOption | null>(null);

  const pathId = id;
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPass, setUserPass] = useState<string | null>(null);
  const [data, setData] = useState<GeneralSettings | null>(null);
  const [contuct, setContuct] = useState<GeneralSettings | null>(null);
  const [userData, setUserData] = useState<UserMe | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null); // store clicked image URL

  interface ModalHandler {
    (imageUrl: string): void;
  }

  const handleOpenModal: ModalHandler = (imageUrl) => setModalImage(imageUrl);
  const handleCloseModal = () => setModalImage(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userToken, setToken] = useState<string | null>(null);
  const [, setUser] = useState<string | { name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const getEmail = localStorage.getItem("email");
    const getpass = localStorage.getItem("hashedPassword");
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!storedUserName) {
      router.push("/sign-in");
    } else {
      setUserName(storedUserName);
      setUserId(id);
      setToken(token);
      setUserEmail(getEmail);
      setUserPass(getpass);
    }
  }, [router]);

  useEffect(() => {
    if (!userId || !userToken) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`${USER_ME}${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchBlog();
  }, [userId, userToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_SITESETTINGS);
        const json = await res.json();

        setContuct(json.general_settings[0]);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoadingSettings(false);
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    if (!pathId) return;

    async function fetchData() {
      try {
        const res = await fetch(`${TICKET_CHECK_ID}${pathId}`);
        const jsonDpt = await res.json();
        setData(jsonDpt);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, [pathId]);

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    router.push("/sign-in");
    setUser(null);
  };

  const onSubmit = async (data: SignUpFormInputs) => {
    if (!data.message && (!data.image || data.image.length === 0)) {
      Swal.fire("Error", "Please enter a message or attach a file.", "error");
      return;
    }

    const formData = new FormData();
    if (data.message) formData.append("message", data.message);
    formData.append("email", userEmail ?? "");
    formData.append("password", userPass ?? "");
    if (pathId !== undefined) formData.append("ticket", String(pathId));
    if (data.image && data.image.length > 0)
      formData.append("image", data.image[0]);

    try {
      const response = await fetch(TICKET_POST, {
        method: "POST",
        headers: { Authorization: `Bearer ${userToken}` },
        body: formData,
      });

      if (!response.ok) {
        Swal.fire("Error", "Message post failed. Please try again.", "error");
        return;
      }

      // Refetch ticket data
      const updatedRes = await fetch(`${TICKET_CHECK_ID}${pathId}`);
      const updatedData = await updatedRes.json();
      setData(updatedData);

      methods.reset(); // reset form
    } catch (error) {
      console.error("Post message error:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  const [, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/package", label: "Pakage" },
    { href: "/invoice", label: "Invoice" },
    { href: "/ticket", label: "Ticket" },
    { href: "/open-ticket", label: "Open Ticket" },
  ];

  if (!userName) return null;
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav
        className="relative text-white px-4 py-2 flex items-center justify-between flex-wrap"
        style={{
          background:
            "linear-gradient(45deg, #488fed 0%, #291fbc 51%, #0f0786 100%)",
        }}
      >
        {/* Left: Logo */}
        <div className="w-full flex justify-center md:justify-start md:w-auto mb-2 md:mb-0">
          <Image
            src={
              userData?.logo
                ? `${BASE_URL}${userData.logo}`
                : "/default-logo.png"
            }
            alt="CWP Logo"
            className="h-12 w-auto"
            width={48}
            height={48}
          />
        </div>

        {/* Center: Nav Links (Desktop only) */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-2 font-semibold uppercase text-sm"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right: Username + Mobile Menu Icon */}
        <div className="flex items-center gap-3 px-8">
          {/* Desktop dropdown */}
          <span className="hidden md:inline font-semibold text-sm md:text-base">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center w-10 h-10 bg-white text-gray-700 border border-gray-300 rounded-full hover:text-blue-500 focus:outline-none">
                  <UserCheck className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="shadow-lg rounded-md bg-white">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full">
                    <span className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
                      Account
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </span>

          {/* Mobile menu toggle */}
          <div className="flex justify-center w-1/2 md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="ml-2"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <aside className="space-y-4 md:col-span-1">
          {/* USER INFO */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-4">Your Info</h2>

            {loadingUser ? (
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-16 w-16 bg-gray-200 rounded-full mt-4"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <p>
                    {userData?.first_name} {userData?.last_name}
                    <br />
                    {userData?.email}
                    <br />
                    {userData?.rl_no}
                  </p>
                </div>

                {typeof userData?.logo === "string" &&
                  userData.logo.startsWith("/media") && (
                    <Image
                      src={`${BASE_URL}${userData.logo}`}
                      alt="CWP Logo"
                      className="h-16 w-16 mb-16 object-contain ml-4"
                      width={64}
                      height={64}
                    />
                  )}
              </div>
            )}
          </div>

          {/* CONTACT INFO */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Contacts</h2>

            {loadingSettings ? (
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ) : (
              <>
                <p className="text-sx">{contuct?.email}</p>
                <p className="text-sx">{contuct?.phone}</p>
                {/* <p className="text-sx">{data?.address}</p> */}
              </>
            )}
          </div>
        </aside>
        {/* Dashboard Content */}
        <section className="space-y-4 md:col-span-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-semibold">Send Replay</h1>
          </div>

          {/* Services Box */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full bg-white p-5 rounded shadow-md"
                >
                  {data?.ticket_details?.[0]?.ticket?.subject && (
                    <h5 className="text-black-600 mb-10">
                      Subject:{" "}
                      <span className="text-gray-600">
                        {data.ticket_details[0].ticket.subject}
                      </span>
                    </h5>
                  )}
                  <div className="flex flex-wrap gap-2 text-sm mb-5">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full">
                      open
                    </span>
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full">
                      high
                    </span>
                    <span className="bg-gray-800 text-white px-2 py-1 rounded-full">
                      support
                    </span>
                    {/* <span className="bg-gray-300 text-gray-800 px-2 py-1 rounded-full">
                      Ticket#{data?.ticket_details?.[0]?.ticket_no}
                    </span> */}
                    {/* <span className="text-gray-600">
                      {data?.ticket_details?.[0]?.created_at}
                    </span> */}
                  </div>
                  <>
                    {data?.ticket_details?.map((ticket, index) => {
                      const isAdmin = !!ticket.admin;
                      const name = isAdmin
                        ? `${ticket.admin?.first_name || ""} ${
                            ticket.admin?.last_name || ""
                          }`
                        : `${ticket.customer?.first_name || ""} ${
                            ticket.customer?.last_name || ""
                          }`;

                      const userImage = isAdmin
                        ? ticket.admin?.image
                          ? `${BASE_URL}${ticket.admin.image}`
                          : "/admin.jpg"
                        : ticket.customer?.image
                        ? `${BASE_URL}${ticket.customer.image}`
                        : "/admin.jpg";

                      const time = new Date(
                        ticket.created_at ?? ""
                      ).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={index}
                          className={`flex mb-6 ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isAdmin && (
                            <Image
                              src={userImage}
                              alt="customer"
                              className="w-8 h-8 rounded-full mr-2"
                              width={32}
                              height={32}
                            />
                          )}

                          <div className="max-w-lg bg-gray-100 p-3 rounded-lg shadow text-sm">
                            <div className="font-semibold mb-1">{name}</div>
                            <div className="text-xs text-gray-500 whitespace-pre-line break-words">
                              {ticket.message}
                            </div>

                            <div className="text-gray-700 mb-1">
                              {/* Ticket attachments */}
                              {Array.isArray(ticket.images) &&
                                ticket.images.map((file) => {
                                  if (!file.image) return null;

                                  const fileUrl = `${BASE_URL}${file.image}`;
                                  const extension =
                                    typeof file.image === "string"
                                      ? (file.image as string)
                                          .split(".")
                                          .pop()
                                          ?.toLowerCase()
                                      : undefined;

                                  const isImage = [
                                    "jpg",
                                    "jpeg",
                                    "png",
                                    "gif",
                                    "webp",
                                  ].includes(extension!);
                                  const isPdf = extension === "pdf";
                                  const isDoc = ["doc", "docx"].includes(
                                    extension!
                                  );

                                  return (
                                    <div
                                      key={file.id}
                                      className="inline-block ml-2 mt-2"
                                    >
                                      {isImage ? (
                                        <Image
                                          src={fileUrl}
                                          alt="attachment"
                                          className="w-20 h-20 rounded cursor-pointer object-cover"
                                          width={80}
                                          height={80}
                                          onClick={() =>
                                            handleOpenModal(fileUrl)
                                          }
                                        />
                                      ) : isPdf ? (
                                        <div
                                          className="w-20 h-20 rounded bg-red-600 flex items-center justify-center text-white font-semibold cursor-pointer"
                                          onClick={() =>
                                            window.open(fileUrl, "_blank")
                                          }
                                        >
                                          PDF
                                        </div>
                                      ) : isDoc ? (
                                        <div
                                          className="w-20 h-20 rounded bg-blue-200 flex items-center justify-center text-blue-700 font-semibold cursor-pointer"
                                          onClick={() =>
                                            window.open(fileUrl, "_blank")
                                          }
                                        >
                                          DOC
                                        </div>
                                      ) : (
                                        <div
                                          className="w-20 h-20 rounded bg-green-700 flex items-center justify-center text-white font-semibold cursor-pointer"
                                          onClick={() =>
                                            window.open(fileUrl, "_blank")
                                          }
                                        >
                                          FILE
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>

                            <div className="text-xs text-gray-500">{time}</div>
                          </div>

                          {isAdmin && (
                            <Image
                              src={userImage}
                              alt="admin"
                              className="w-8 h-8 rounded-full ml-2"
                              width={32}
                              height={32}
                            />
                          )}
                        </div>
                      );
                    })}

                    {/* Modal */}
                    {modalImage && (
                      <div
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                        onClick={handleCloseModal}
                      >
                        <div
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Image
                            src={modalImage}
                            alt="attachment large"
                            className="rounded"
                            width={600}
                            height={600}
                          />
                          <button
                            className="absolute top-2 right-2 text-red-600 text-xl font-bold"
                            onClick={handleCloseModal}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </>

                  {/* New Message Form */}
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("message", { required: true })}
                      rows={4}
                      placeholder="Enter your message"
                      className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </div>
                  {/* File Upload */}
                  <div className="mb-5">
                    <label className="block text-gray-700 text-sm font-medium mb-1">
                      Attach Files
                    </label>
                    <input
                      type="file"
                      {...register("image")}
                      className="text-sm"
                    />
                  </div>
                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow-sm"
                    >
                      Post Message
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push("/ticket")}
                      className="bg-orange-400 hover:bg-orange-500 text-white px-5 py-2 rounded shadow-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TicketItemPage;
