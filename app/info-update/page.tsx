"use client";
import CountryCodeSelect from "@/components/CountryCodeSelect";
import { BASE_URL, GET_SITESETTINGS, USER_ME, USER_UPADTE } from "@/lib/config";
import { Menu, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
  country_code1: string;
  primary_phone: string;
  logo: string;
  street_address_one: string;
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
  country_code1: string;
  rl_no: string;
  address: string;
  company_name: string;
  street_address_one: string;
  logo: FileList;
  label: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "4px",
  border: "1px solid #e2e8f0",
  marginBottom: "1rem",
};

const countries = [
  { code: "AD", label: "Andorra", value: "+376" },
  {
    code: "AE",
    label: "United Arab Emirates",
    value: "+971",
  },
  { code: "AF", label: "Afghanistan", value: "+93" },
  {
    code: "AG",
    label: "Antigua and Barbuda",
    value: "+1-268",
  },
  { code: "AI", label: "Anguilla", value: "+1-264" },
  { code: "AL", label: "Albania", value: "+355" },
  { code: "AM", label: "Armenia", value: "+374" },
  { code: "AO", label: "Angola", value: "+244" },
  { code: "AQ", label: "Antarctica", value: "+672" },
  { code: "AR", label: "Argentina", value: "+54" },
  { code: "AS", label: "American Samoa", value: "+1-684" },
  { code: "AT", label: "Austria", value: "+43" },
  {
    code: "AU",
    label: "Australia",
    value: "+61",
    suggested: true,
  },
  { code: "AW", label: "Aruba", value: "+297" },
  { code: "AX", label: "Alland Islands", value: "+358" },
  { code: "AZ", label: "Azerbaijan", value: "+994" },
  {
    code: "BA",
    label: "Bosnia and Herzegovina",
    value: "+387",
  },
  { code: "BB", label: "Barbados", value: "+1-246" },
  { code: "BD", label: "Bangladesh", value: "+880" },
  { code: "BE", label: "Belgium", value: "+32" },
  { code: "BF", label: "Burkina Faso", value: "+226" },
  { code: "BG", label: "Bulgaria", value: "+359" },
  { code: "BH", label: "Bahrain", value: "+973" },
  { code: "BI", label: "Burundi", value: "+257" },
  { code: "BJ", label: "Benin", value: "+229" },
  { code: "BL", label: "Saint Barthelemy", value: "+590" },
  { code: "BM", label: "Bermuda", value: "+1-441" },
  { code: "BN", label: "Brunei Darussalam", value: "+673" },
  { code: "BO", label: "Bolivia", value: "+591" },
  { code: "BR", label: "Brazil", value: "+55" },
  { code: "BS", label: "Bahamas", value: "+1-242" },
  { code: "BT", label: "Bhutan", value: "+975" },
  { code: "BV", label: "Bouvet Island", value: "+47" },
  { code: "BW", label: "Botswana", value: "+267" },
  { code: "BY", label: "Belarus", value: "+375" },
  { code: "BZ", label: "Belize", value: "+501" },
  {
    code: "CA",
    label: "Canada",
    value: "+1",
    suggested: true,
  },
  {
    code: "CC",
    label: "Cocos (Keeling) Islands",
    value: "+61",
  },
  {
    code: "CD",
    label: "Congo, Democratic Republic of the",
    value: "+243",
  },
  {
    code: "CF",
    label: "Central African Republic",
    value: "+236",
  },
  {
    code: "CG",
    label: "Congo, Republic of the",
    value: "+242",
  },
  { code: "CH", label: "Switzerland", value: "+41" },
  { code: "CI", label: "Cote d'Ivoire", value: "+225" },
  { code: "CK", label: "Cook Islands", value: "+682" },
  { code: "CL", label: "Chile", value: "+56" },
  { code: "CM", label: "Cameroon", value: "+237" },
  { code: "CN", label: "China", value: "+86" },
  { code: "CO", label: "Colombia", value: "+57" },
  { code: "CR", label: "Costa Rica", value: "+506" },
  { code: "CU", label: "Cuba", value: "+53" },
  { code: "CV", label: "Cape Verde", value: "+238" },
  { code: "CW", label: "Curacao", value: "+599" },
  { code: "CX", label: "Christmas Island", value: "+61" },
  { code: "CY", label: "Cyprus", value: "+357" },
  { code: "CZ", label: "Czech Republic", value: "+420" },
  {
    code: "DE",
    label: "Germany",
    value: "+49",
    suggested: true,
  },
  { code: "DJ", label: "Djibouti", value: "+253" },
  { code: "DK", label: "Denmark", value: "+45" },
  { code: "DM", label: "Dominica", value: "+1-767" },
  {
    code: "DO",
    label: "Dominican Republic",
    value: "+1-809",
  },
  { code: "DZ", label: "Algeria", value: "+213" },
  { code: "EC", label: "Ecuador", value: "+593" },
  { code: "EE", label: "Estonia", value: "+372" },
  { code: "EG", label: "Egypt", value: "+20" },
  { code: "EH", label: "Western Sahara", value: "+212" },
  { code: "ER", label: "Eritrea", value: "+291" },
  { code: "ES", label: "Spain", value: "+34" },
  { code: "ET", label: "Ethiopia", value: "+251" },
  { code: "FI", label: "Finland", value: "+358" },
  { code: "FJ", label: "Fiji", value: "+679" },
  {
    code: "FK",
    label: "Falkland Islands (Malvinas)",
    value: "+500",
  },
  {
    code: "FM",
    label: "Micronesia, Federated States of",
    value: "+691",
  },
  { code: "FO", label: "Faroe Islands", value: "+298" },
  {
    code: "FR",
    label: "France",
    value: "+33",
    suggested: true,
  },
  { code: "GA", label: "Gabon", value: "+241" },
  { code: "GB", label: "United Kingdom", value: "+44" },
  { code: "GD", label: "Grenada", value: "+1-473" },
  { code: "GE", label: "Georgia", value: "+995" },
  { code: "GF", label: "French Guiana", value: "+594" },
  { code: "GG", label: "Guernsey", value: "+44" },
  { code: "GH", label: "Ghana", value: "+233" },
  { code: "GI", label: "Gibraltar", value: "+350" },
  { code: "GL", label: "Greenland", value: "+299" },
  { code: "GM", label: "Gambia", value: "+220" },
  { code: "GN", label: "Guinea", value: "+224" },
  { code: "GP", label: "Guadeloupe", value: "+590" },
  { code: "GQ", label: "Equatorial Guinea", value: "+240" },
  { code: "GR", label: "Greece", value: "+30" },
  {
    code: "GS",
    label: "South Georgia and the South Sandwich Islands",
    value: "+500",
  },
  { code: "GT", label: "Guatemala", value: "+502" },
  { code: "GU", label: "Guam", value: "+1-671" },
  { code: "GW", label: "Guinea-Bissau", value: "+245" },
  { code: "GY", label: "Guyana", value: "+592" },
  { code: "HK", label: "Hong Kong", value: "+852" },
  {
    code: "HM",
    label: "Heard Island and McDonald Islands",
    value: "+672",
  },
  { code: "HN", label: "Honduras", value: "+504" },
  { code: "HR", label: "Croatia", value: "+385" },
  { code: "HT", label: "Haiti", value: "+509" },
  { code: "HU", label: "Hungary", value: "+36" },
  { code: "ID", label: "Indonesia", value: "+62" },
  { code: "IE", label: "Ireland", value: "+353" },
  { code: "IL", label: "Israel", value: "+972" },
  { code: "IM", label: "Isle of Man", value: "+44" },
  { code: "IN", label: "India", value: "+91" },
  {
    code: "IO",
    label: "British Indian Ocean Territory",
    value: "+246",
  },
  { code: "IQ", label: "Iraq", value: "+964" },
  {
    code: "IR",
    label: "Iran, Islamic Republic of",
    value: "+98",
  },
  { code: "IS", label: "Iceland", value: "+354" },
  { code: "IT", label: "Italy", value: "+39" },
  { code: "JE", label: "Jersey", value: "+44" },
  { code: "JM", label: "Jamaica", value: "+1-876" },
  { code: "JO", label: "Jordan", value: "+962" },
  {
    code: "JP",
    label: "Japan",
    value: "+81",
    suggested: true,
  },
  { code: "KE", label: "Kenya", value: "+254" },
  { code: "KG", label: "Kyrgyzstan", value: "+996" },
  { code: "KH", label: "Cambodia", value: "+855" },
  { code: "KI", label: "Kiribati", value: "+686" },
  { code: "KM", label: "Comoros", value: "+269" },
  {
    code: "KN",
    label: "Saint Kitts and Nevis",
    value: "+1-869",
  },
  {
    code: "KP",
    label: "Korea, Democratic People's Republic of",
    value: "+850",
  },
  { code: "KR", label: "Korea, Republic of", value: "+82" },
  { code: "KW", label: "Kuwait", value: "+965" },
  { code: "KY", label: "Cayman Islands", value: "+1-345" },
  { code: "KZ", label: "Kazakhstan", value: "+7" },
  {
    code: "LA",
    label: "Lao People's Democratic Republic",
    value: "+856",
  },
  { code: "LB", label: "Lebanon", value: "+961" },
  { code: "LC", label: "Saint Lucia", value: "+1-758" },
  { code: "LI", label: "Liechtenstein", value: "+423" },
  { code: "LK", label: "Sri Lanka", value: "+94" },
  { code: "LR", label: "Liberia", value: "+231" },
  { code: "LS", label: "Lesotho", value: "+266" },
  { code: "LT", label: "Lithuania", value: "+370" },
  { code: "LU", label: "Luxembourg", value: "+352" },
  { code: "LV", label: "Latvia", value: "+371" },
  { code: "LY", label: "Libya", value: "+218" },
  { code: "MA", label: "Morocco", value: "+212" },
  { code: "MC", label: "Monaco", value: "+377" },
  {
    code: "MD",
    label: "Moldova, Republic of",
    value: "+373",
  },
  { code: "ME", label: "Montenegro", value: "+382" },
  {
    code: "MF",
    label: "Saint Martin (French part)",
    value: "+590",
  },
  { code: "MG", label: "Madagascar", value: "+261" },
  { code: "MH", label: "Marshall Islands", value: "+692" },
  {
    code: "MK",
    label: "Macedonia, the Former Yugoslav Republic of",
    value: "+389",
  },
  { code: "ML", label: "Mali", value: "+223" },
  { code: "MM", label: "Myanmar", value: "+95" },
  { code: "MN", label: "Mongolia", value: "+976" },
  { code: "MO", label: "Macao", value: "+853" },
  {
    code: "MP",
    label: "Northern Mariana Islands",
    value: "+1-670",
  },
  { code: "MQ", label: "Martinique", value: "+596" },
  { code: "MR", label: "Mauritania", value: "+222" },
  { code: "MS", label: "Montserrat", value: "+1-664" },
  { code: "MT", label: "Malta", value: "+356" },
  { code: "MU", label: "Mauritius", value: "+230" },
  { code: "MV", label: "Maldives", value: "+960" },
  { code: "MW", label: "Malawi", value: "+265" },
  { code: "MX", label: "Mexico", value: "+52" },
  { code: "MY", label: "Malaysia", value: "+60" },
  { code: "MZ", label: "Mozambique", value: "+258" },
  { code: "NA", label: "Namibia", value: "+264" },
  { code: "NC", label: "New Caledonia", value: "+687" },
  { code: "NE", label: "Niger", value: "+227" },
  { code: "NF", label: "Norfolk Island", value: "+672" },
  { code: "NG", label: "Nigeria", value: "+234" },
  { code: "NI", label: "Nicaragua", value: "+505" },
  { code: "NL", label: "Netherlands", value: "+31" },
  { code: "NO", label: "Norway", value: "+47" },
  { code: "NP", label: "Nepal", value: "+977" },
  { code: "NR", label: "Nauru", value: "+674" },
  { code: "NU", label: "Niue", value: "+683" },
  { code: "NZ", label: "New Zealand", value: "+64" },
  { code: "OM", label: "Oman", value: "+968" },
  { code: "PA", label: "Panama", value: "+507" },
  { code: "PE", label: "Peru", value: "+51" },
  { code: "PF", label: "French Polynesia", value: "+689" },
  { code: "PG", label: "Papua New Guinea", value: "+675" },
  { code: "PH", label: "Philippines", value: "+63" },
  { code: "PK", label: "Pakistan", value: "+92" },
  { code: "PL", label: "Poland", value: "+48" },
  {
    code: "PM",
    label: "Saint Pierre and Miquelon",
    value: "+508",
  },
  { code: "PN", label: "Pitcairn", value: "+870" },
  { code: "PR", label: "Puerto Rico", value: "+1" },
  {
    code: "PS",
    label: "Palestine, State of",
    value: "+970",
  },
  { code: "PT", label: "Portugal", value: "+351" },
  { code: "PW", label: "Palau", value: "+680" },
  { code: "PY", label: "Paraguay", value: "+595" },
  { code: "QA", label: "Qatar", value: "+974" },
  { code: "RE", label: "Reunion", value: "+262" },
  { code: "RO", label: "Romania", value: "+40" },
  { code: "RS", label: "Serbia", value: "+381" },
  { code: "RU", label: "Russian Federation", value: "+7" },
  { code: "RW", label: "Rwanda", value: "+250" },
  { code: "SA", label: "Saudi Arabia", value: "+966" },
  { code: "SB", label: "Solomon Islands", value: "+677" },
  { code: "SC", label: "Seychelles", value: "+248" },
  { code: "SD", label: "Sudan", value: "+249" },
  { code: "SE", label: "Sweden", value: "+46" },
  { code: "SG", label: "Singapore", value: "+65" },
  { code: "SH", label: "Saint Helena", value: "+290" },
  { code: "SI", label: "Slovenia", value: "+386" },
  {
    code: "SJ",
    label: "Svalbard and Jan Mayen",
    value: "+47",
  },
  { code: "SK", label: "Slovakia", value: "+421" },
  { code: "SL", label: "Sierra Leone", value: "+232" },
  { code: "SM", label: "San Marino", value: "+378" },
  { code: "SN", label: "Senegal", value: "+221" },
  { code: "SO", label: "Somalia", value: "+252" },
  { code: "SR", label: "Suriname", value: "+597" },
  { code: "SS", label: "South Sudan", value: "+211" },
  {
    code: "ST",
    label: "Sao Tome and Principe",
    value: "+239",
  },
  { code: "SV", label: "El Salvador", value: "+503" },
  {
    code: "SX",
    label: "Sint Maarten (Dutch part)",
    value: "+1-721",
  },
  {
    code: "SY",
    label: "Syrian Arab Republic",
    value: "+963",
  },
  { code: "SZ", label: "Swaziland", value: "+268" },
  {
    code: "TC",
    label: "Turks and Caicos Islands",
    value: "+1-649",
  },
  { code: "TD", label: "Chad", value: "+235" },
  {
    code: "TF",
    label: "French Southern Territories",
    value: "+262",
  },
  { code: "TG", label: "Togo", value: "+228" },
  { code: "TH", label: "Thailand", value: "+66" },
  { code: "TJ", label: "Tajikistan", value: "+992" },
  { code: "TK", label: "Tokelau", value: "+690" },
  { code: "TL", label: "Timor-Leste", value: "+670" },
  { code: "TM", label: "Turkmenistan", value: "+993" },
  { code: "TN", label: "Tunisia", value: "+216" },
  { code: "TO", label: "Tonga", value: "+676" },
  { code: "TR", label: "Turkey", value: "+90" },
  {
    code: "TT",
    label: "Trinidad and Tobago",
    value: "+1-868",
  },
  { code: "TV", label: "Tuvalu", value: "+688" },
  {
    code: "TW",
    label: "Taiwan, Province of China",
    value: "+886",
  },
  {
    code: "TZ",
    label: "United Republic of Tanzania",
    value: "+255",
  },
  { code: "UA", label: "Ukraine", value: "+380" },
  { code: "UG", label: "Uganda", value: "+256" },
  {
    code: "US",
    label: "United States",
    value: "+1",
    suggested: true,
  },
  { code: "UY", label: "Uruguay", value: "+598" },
  { code: "UZ", label: "Uzbekistan", value: "+998" },
  {
    code: "VA",
    label: "Holy See (Vatican City State)",
    value: "+379",
  },
  {
    code: "VC",
    label: "Saint Vincent and the Grenadines",
    value: "+1-784",
  },
  { code: "VE", label: "Venezuela", value: "+58" },
  {
    code: "VG",
    label: "British Virgin Islands",
    value: "+1-284",
  },
  {
    code: "VI",
    label: "US Virgin Islands",
    value: "+1-340",
  },
  { code: "VN", label: "Vietnam", value: "+84" },
  { code: "VU", label: "Vanuatu", value: "+678" },
  { code: "WF", label: "Wallis and Futuna", value: "+681" },
  { code: "WS", label: "Samoa", value: "+685" },
  { code: "XK", label: "Kosovo", value: "+383" },
  { code: "YE", label: "Yemen", value: "+967" },
  { code: "YT", label: "Mayotte", value: "+262" },
  { code: "ZA", label: "South Africa", value: "+27" },
  { code: "ZM", label: "Zambia", value: "+260" },
  { code: "ZW", label: "Zimbabwe", value: "+263" },
];

const Page = () => {
  const methods = useForm<SignUpFormInputs>({
    defaultValues: {
      country_code1: "",
    },
  });

  const { register, handleSubmit, reset } = methods;
  const [userName, setUserName] = useState<string | null>(null);
  const [data, setData] = useState<GeneralSettings | null>(null);
  const [userData, setUserData] = useState<UserMe | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [userToken, setToken] = useState<string | null>(null);
  const [, setUser] = useState<string | { name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (!storedUserName) {
      router.push("/sign-in");
    } else {
      setUserName(storedUserName);
      setUserId(id);
      setToken(token);
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

  const handleSignOut = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    router.push("/sign-in");
    setUser(null);
  };

  const onSubmit = async (data: SignUpFormInputs) => {
    const formData = new FormData();

    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("company_name", data.company_name);

    formData.append("street_address_one", data.street_address_one);
    formData.append("primary_phone", data.primary_phone);
    formData.append("country_code1", data.country_code1);

    if (data.logo && data.logo.length > 0) {
      formData.append("logo", data.logo[0]);
    }

    try {
      const response = await fetch(`${USER_UPADTE}${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`, // set token here
        },
        body: formData,
      });

      if (!response.ok) return;

      Swal.fire({
        title: "Profile Update  Successful!",
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

  useEffect(() => {
    if (userData) {
      const matchedCode = countries.find(
        (code) => code.value === userData.country_code1
      );

      reset({
        ...userData,
        rl_no: userData.rl_no?.toString?.() ?? "",
        country_code1: matchedCode ? matchedCode.value : undefined,
        logo: undefined, // logo must be FileList or undefined
      });
    }
  }, [userData, reset]);

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
              <DropdownMenuTrigger>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-gray-700   hover:text-blue-500 focus:outline-none"
                  style={{ borderColor: "#d1d5db" }} // gray-300 hex to avoid default black
                >
                  <UserCheck className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="shadow-lg rounded-md bg-white p-1">
                <DropdownMenuItem>
                  <Link href="/dashboard" className="w-full">
                    <button className="w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100">
                      Account
                    </button>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
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
                    {userData?.country_code1} {userData?.primary_phone}
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
              Welcome Back, {userName}
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
                  {/* logo Upload */}
                  <label style={{ marginBottom: "0.5rem", display: "block" }}>
                    Upload logo
                    <Image
                      src={`${BASE_URL}${userData?.logo ?? ""}`}
                      alt="Preview"
                      style={{ width: 100, marginBottom: 10 }}
                      width={100}
                      height={100}
                    />
                  </label>

                  <input
                    type="file"
                    {...register("logo")}
                    accept="image/*"
                    style={inputStyle}
                  />

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Enter First Name"
                      {...register("first_name")}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Enter Last Name"
                      {...register("last_name")}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    <input
                      type="email"
                      placeholder="Enter Email"
                      {...register("email")}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <input
                      type="text"
                      placeholder="Enter Company name"
                      {...register("company_name")}
                      style={{ ...inputStyle, flex: 1 }}
                    />
                  </div>

                  {/* address */}
                  <input
                    type="text"
                    placeholder="Enter Your Address"
                    {...register("street_address_one")}
                    style={inputStyle}
                  />

                  {/* Country & Phone */}
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "1rem",
                      alignItems: "center", // center-align vertically
                    }}
                  >
                    {/* Country Dropdown */}
                    <div style={{ flex: 1 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        Country
                      </label>
                      <div
                        style={{
                          height: "40px",
                        }}
                      >
                        <CountryCodeSelect />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div style={{ flex: 2 }}>
                      <label
                        style={{
                          display: "block",
                          marginBottom: "0.5rem",
                          fontSize: "0.8rem",
                          color: "#666",
                        }}
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter Phone"
                        {...register("primary_phone", { required: true })}
                        style={{
                          width: "100%",
                          height: "40px", // match the CountryCodeSelect height
                          padding: "0.5rem",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                      Update
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

export default Page;
