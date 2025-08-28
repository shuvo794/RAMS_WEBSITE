"use client";
import Select from "react-select";

import {
  BASE_URL,
  CREATE_TICKET,
  GET_SITESETTINGS,
  GET_TICKET_DEPARTMENT,
  GET_TICKET_PRIORITY,
  USER_ME,
} from "@/lib/config";
import { Menu, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

type GeneralSettings = {
  address: string;
  email: string;
  email2: string;
  phone: number;
  phone2: number;
  address2: string;
  rams_logo: string;
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
  image: FileList;
  label: string;
  message: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #e2e8f0",
  marginBottom: "1rem",
};

type Department = { id: number; name: string };
type DepartmentOption = { label: string; value: number } | null;

const OpenTicketItemPage = () => {
  const methods = useForm<SignUpFormInputs>({
    defaultValues: {
      ticket_department: "",
    },
  });
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  const { register, handleSubmit, control } = methods;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentOption | null>(null);

  const pathId = id;
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPass, setUserPass] = useState<string | null>(null);
  const [data, setData] = useState<GeneralSettings | null>(null);
  const [userData, setUserData] = useState<UserMe | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userToken, setToken] = useState<string | null>(null);

  const [, setUser] = useState<string | { name?: string } | null>(null);
  const router = useRouter();
  const [priorities, setPriorities] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_TICKET_PRIORITY);
        const jsonDpt = await res.json();
        interface TicketPriority {
          id: number;
          name: string;
        }
        interface TicketPriorityResponse {
          ticket_priorities: TicketPriority[];
        }
        const jsonDptTyped: TicketPriorityResponse = jsonDpt;
        const options: { label: string; value: number }[] =
          jsonDptTyped.ticket_priorities.map((item: TicketPriority) => ({
            label: item.name,
            value: item.id,
          }));
        setPriorities(options);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, []);

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
        setData(json.general_settings[0]);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        setLoadingSettings(false);
      }
    }

    fetchData();
  }, []);
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const res = await fetch(GET_TICKET_DEPARTMENT);
  //       const jsonDpt = await res.json();
  //     } catch (error) {
  //       console.error("API fetch error:", error);
  //     } finally {
  //       setLoadingSettings(false);
  //     }
  //   }

  //   fetchData();
  // }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_TICKET_DEPARTMENT);
        const jsonDpt = await res.json();

        const allDepartments = jsonDpt.ticket_departments;
        setDepartments(allDepartments);

        const matched: Department | undefined = allDepartments.find(
          (dept: Department) => dept.id === Number(pathId)
        );
        if (matched) {
          setSelectedDepartment({ label: matched.name, value: matched.id });
        }
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
    const formData = new FormData();

    formData.append(
      "ticket_department",
      selectedDepartment ? String(selectedDepartment.value) : ""
    );
    formData.append("ticket_priority", data.ticket_priority);
    formData.append("message", data.message);
    formData.append("subject", data.subject);
    formData.append("email", userEmail ?? "");
    formData.append("password", userPass ?? "");
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    try {
      const response = await fetch(CREATE_TICKET, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (!response.ok) return;

      Swal.fire({
        title: "Ticket Create  Successful",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
        router.push("/dashboard");
      });
    } catch {
      Swal.fire("Error", "sign-up failed. Please try again.", "error");
    }
  };

  const [, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Home" },

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
          <Link href="/">
            <Image
              src={`${BASE_URL}${data?.rams_logo ?? ""}`}
              alt="CWP Logo"
              className="h-12 w-auto"
              width={48}
              height={48}
            />
          </Link>
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
                <p className="text-sx">{data?.email}</p>
                <p className="text-sx">{data?.phone}</p>
                <p className="text-sx">{data?.address}</p>
              </>
            )}
          </div>
        </aside>
        {/* Dashboard Content */}
        <section className="space-y-4 md:col-span-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg md:text-xl font-semibold">
              Create A New Ticket
            </h1>
          </div>

          {/* Services Box */}
          <div className="bg-white p-4 rounded shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ width: "100%" }}
                >
                  {/* address */}
                  <input
                    type="text"
                    placeholder="Enter Your Subject"
                    {...register("subject")}
                    style={inputStyle}
                  />

                  <Controller
                    name="ticket_department"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={departments.map((d) => ({
                          label: d.name,
                          value: d.id,
                        }))}
                        value={
                          selectedDepartment ||
                          (departments?.find(
                            (d) => d.id === Number(field.value)
                          ) ??
                            null) ||
                          null
                        }
                        isDisabled={!!selectedDepartment} // disable if matched
                        onChange={(selectedOption) => {
                          field.onChange(
                            selectedOption && "value" in selectedOption
                              ? selectedOption.value
                              : ""
                          );
                        }}
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: "40px",
                            minHeight: "40px",
                          }),
                        }}
                        placeholder="Select a ticket department"
                      />
                    )}
                  />

                  <Controller
                    name="ticket_priority"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={priorities}
                        placeholder="Select a ticket priority"
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: "40px",
                            minHeight: "40px",
                            marginTop: "15px",
                          }),
                        }}
                        value={
                          priorities.find(
                            (opt) => opt.value === Number(field.value)
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption?.value)
                        }
                      />
                    )}
                  />

                  <label className="block text-gray-700 text-sm mt-5 font-medium mb-1">
                    Message <span className="text-red-500 ">*</span>
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    rows={4}
                    placeholder="Enter your message"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Image Upload */}
                  <label className="block text-gray-700 text-sm font-medium mb-1 mt-5">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("image")}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="mb-3"
                  />

                  {/* Image Preview and Remove */}
                  {imagePreview && (
                    <div className="relative inline-block mt-2">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        className="object-cover border rounded"
                        width={84}
                        height={64}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          methods.setValue("image", new DataTransfer().files);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded-full"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center mt-10 space-x-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                      Create
                    </button>

                    <Link href="/dashboard">
                      <button
                        type="button"
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </Link>
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

export default OpenTicketItemPage;
