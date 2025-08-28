import { Mail, MapPin, PhoneOutgoing } from "lucide-react";

export default function AddressSection() {
  return (
    <div className="w-full bg-[#0066FF] text-white py-4">
      <div className="container flex flex-col sm:flex-row justify-center items-center text-center sm:space-x-6 space-y-4 sm:space-y-0 px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              250/6 Road No: 06, Smriti Dhara, Japani Bazar, Shonirakhra, Jatra
              Bari, Dhaka-1236, Bangladesh.
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">admin@bluebayit.com</span>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneOutgoing className="h-4 w-4" />
            <span className="text-sm">+8801861650206</span>
          </div>
        </div>
      </div>
    </div>
  );
}
