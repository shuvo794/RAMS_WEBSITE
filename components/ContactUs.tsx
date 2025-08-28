"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone } from "lucide-react";
import { CRETE_CONTUCTUS, GET_SITESETTINGS } from "@/lib/config";

type GeneralSettings = {
  address: string;
  email: string;
  email2: string;
  phone: number;
  phone2: number;
  address2: string;
};

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [data, setData] = useState<GeneralSettings | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(CRETE_CONTUCTUS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Reset the form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(GET_SITESETTINGS);
        const json = await res.json();
        setData(json.general_settings[0]); // assuming array
      } catch (error) {
        console.error("API fetch error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <section className="mt-10 mb-10 px-4">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6 lg:col-span-1">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-black mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Phone</h3>
                  <p className="text-gray-600 text-sm">
                    Our customer care is open from Mon–Fri,
                    <br />
                    10:00 am to 7:00 pm
                  </p>
                  <p className="text-black mt-2 font-medium">
                    {data?.phone || ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-black mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">
                    Our support team will get back to you in 48h
                    <br />
                    during standard business hours.
                  </p>
                  <p className="text-black mt-2 font-medium">
                    {data?.email || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <h4 className="uppercase text-sm font-bold text-purple-700 tracking-wide">
              Get in touch
            </h4>
            <h2 className="text-3xl font-semibold mb-6 mt-2">
              <span className="italic font-bold text-purple-700">Connect</span>{" "}
              with us
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Please contact us using the details below. For more information
              about our services, please visit the corresponding page on our
              web.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 mb-6  ">
                <Input
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gray-50 p-5 rounded-md shadow-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <Input
                  placeholder="Your Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-gray-50 p-5  rounded-md shadow-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <Input
                placeholder="Your Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="bg-gray-50 p-5  rounded-md shadow-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <Textarea
                placeholder="Write Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="min-h-[200px] p-5  bg-gray-50 rounded-md shadow-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <Button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md shadow-md transition duration-300"
              >
                SEND YOUR MESSAGE
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section (Full Width Below Form) */}
        <div className="mt-10">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228.346169539958!2d90.45283815014301!3d23.692448890276122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b744135cebcb%3A0x58b6f62a3a3160a8!2sBluebay%20IT%20Limited!5e0!3m2!1sen!2sbd!4v1747031483179!5m2!1sen!2sbd"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
