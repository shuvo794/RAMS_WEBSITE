"use client";

import { useEffect, useState } from "react";
import { Printer, Download } from "lucide-react";

// import html2pdf from "html2pdf.js"; // Import html2pdf
import { BASE_URL, GET_SITESETTINGS, STATUS_INVOICE_ID } from "@/lib/config";
import { useParams } from "next/navigation";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

type InvoiceGet = {
  invoice_number: number;
  status: string;
  invoice_date: string;
  payment_method: string;

  total_amount: number;
  billing_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipcode: string;
    country: string;
  };
  subscription: {
    items: {
      package: {
        name: string;
        price: number;
      };
      amount: number;

      start_date: string;
      end_date: string;
      details?: string; // optional, if sometimes missing
    }[];
    id: number;
    total_amount: string;
    transaction_id: string;
  };
};

type GeneralSettings = {
  address: string;
  email: string;
  email2: string;
  phone: number;
  phone2: number;
  address2: string;
  rams_logo: string;
  agency_name_bangla: string;
};

export default function InvoicePage() {
  const [invoiceget, setInvoiceGet] = useState<InvoiceGet | null>(null);

  const routePrams = useParams();
  const [data, setData] = useState<GeneralSettings | null>(null);
  console.log("kgfkjgkfjg", routePrams.id);
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.getElementById("invoice-content");
    if (!element) return;

    // Dynamic import ensures it's only loaded on client
    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `invoice-${invoiceget?.invoice_number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`${STATUS_INVOICE_ID}${routePrams?.id}`);
        const jsonDpt = await res.json();
        setInvoiceGet(jsonDpt || null);
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, [routePrams?.id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_SITESETTINGS);
        const json = await res.json();
        setData(json.general_settings[0]);
      } catch (error) {
        console.error("API fetch error:", error);
      } finally {
        // setLoadingSettings(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        padding: "40px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        id="invoice-content"
        style={{
          maxWidth: "800px",
          margin: "66px auto",

          background: "#fff",
          padding: "32px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        >
          <Image
            src={`${BASE_URL}${data?.rams_logo ?? ""}`}
            alt="CWP Logo"
            className="h-[5rem] w-auto"
            width={98}
            height={98}
          />
          <div>
            <h2
              style={{
                color:
                  invoiceget?.status === "unpaid"
                    ? "red"
                    : invoiceget?.status === "paid"
                    ? "green"
                    : "black",
                fontSize: "16px",
                textAlign: "center",
                marginTop: "5px",
              }}
            >
              {invoiceget?.status === "unpaid"
                ? "Unpaid"
                : invoiceget?.status === "paid"
                ? "Paid"
                : invoiceget?.status}
            </h2>

            {invoiceget?.status === "unpaid" && (
              <Link href={`/checkout/${invoiceget?.subscription?.id}`}>
                <button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginBottom: "6px",
                  }}
                >
                  Pay Now
                </button>
              </Link>
            )}
          </div>
        </div>

        <h1
          style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}
        >
          Invoice #{invoiceget?.invoice_number}
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div>
            <h3 style={{ fontWeight: "600", marginBottom: "12px" }}>
              Invoiced To
            </h3>
            <p>{invoiceget?.billing_address?.address}</p>
            <p>{invoiceget?.billing_address?.zipcode}</p>
            <p>{invoiceget?.billing_address?.city}</p>
            <p>{invoiceget?.billing_address?.country}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0 }}>{data?.agency_name_bangla}</p>
            <p style={{ margin: 0 }}>{data?.email}</p>
            <p style={{ margin: 0 }}>{data?.phone}</p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <div>
            <h4 style={{ fontWeight: "600" }}>Invoice Date</h4>
            <p>
              {invoiceget?.invoice_date
                ? moment(invoiceget.invoice_date).format("DD-MM-YYYY")
                : "--"}
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: "600" }}>Payment Method</h4>
            {invoiceget?.status !== "unpaid" ? (
              <p style={{ textAlign: "right" }}>{invoiceget?.payment_method}</p>
            ) : (
              <p style={{ textAlign: "right" }}>---</p>
            )}
          </div>
        </div>

        <div>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "16px",
              backgroundColor: "#f7f7f7",
              marginBottom: "32px",
            }}
          >
            <h3 style={{ fontWeight: "600", marginBottom: "16px" }}>
              Invoice Items
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "16px",
                backgroundColor: "#fff",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "12px" }}>
                    Description
                  </th>
                  <th style={{ textAlign: "right", padding: "12px" }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoiceget?.subscription?.items?.map((item, index) => {
                  return (
                    <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>
                        <strong>
                          {item?.package?.name || "N/A"} ({item?.start_date} -{" "}
                          {item?.end_date}){" "}
                        </strong>
                      </td>
                      <td style={{ padding: "12px", textAlign: "right" }}>
                        {item?.amount} BDT
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Total Summary */}
            <div style={{ padding: "0 12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  fontSize: "16px",
                  marginTop: "8px",
                }}
              >
                <span>Total</span>
                <span>{invoiceget?.subscription?.total_amount} BDT</span>
              </div>
            </div>
          </div>
        </div>

        {!(invoiceget?.status === "unpaid") && (
          <>
            <h3 style={{ fontWeight: "600", marginBottom: "12px" }}>
              Transaction Details
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "24px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "12px 0" }}>
                    Transaction Date
                  </th>
                  <th style={{ textAlign: "left", padding: "12px 0" }}>
                    Gateway
                  </th>
                  <th style={{ textAlign: "left", padding: "12px 0" }}>
                    Transaction ID
                  </th>
                  <th style={{ textAlign: "right", padding: "12px 0" }}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td>
                    {invoiceget?.invoice_date
                      ? moment(invoiceget.invoice_date).format("DD-MM-YYYY")
                      : "--"}
                  </td>
                  <td>{invoiceget?.payment_method || "--"}</td>
                  <td style={{ fontFamily: "monospace" }}>
                    {invoiceget?.subscription?.transaction_id || "--"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {invoiceget?.subscription?.total_amount
                      ? `${invoiceget.subscription.total_amount} BDT`
                      : "--"}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {/* Buttons hidden during print */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginTop: "32px",
          }}
          className="no-print"
        >
          <button
            onClick={handlePrint}
            aria-label="Print invoice"
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer",
            }}
          >
            <Printer
              size={16}
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
          </button>
          <button
            onClick={handleDownload}
            aria-label="Download invoice PDF"
            style={{
              padding: "8px 16px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer",
            }}
          >
            <Download
              size={16}
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
          </button>
        </div>
      </div>

      {/* Inline print styles */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  );
}
