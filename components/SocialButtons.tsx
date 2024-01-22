import { FaWhatsapp, FaGithub, FaFacebookF , FaYoutube } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import { Button } from "./ui/button";

import React, { useState } from "react";
import { TfiMoreAlt } from "react-icons/tfi";
import { MdOutlineExpandMore } from "react-icons/md";

interface SocialMediaData {
  [key: string]: string | null;
}
const SocialButtons = ({ data, phone ,sendMessageWa, sendEmail }) => {
  const getSocialIcon = (key) => {
    switch (key) {
      case "whatsapp":
        return <FaWhatsapp className="h-5 w-5" />;
      case "linkedIn":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
          </svg>
        );
      case "instagram":
        return <FaInstagram className="h-5 w-5" />;
      case "email":
        return <FaEnvelope className="h-5 w-5" />;
      case "github":
        return <FaGithub className="h-5 w-5" />;
      case "facebook":
        return <FaFacebookF className="h-5 w-5" />;
      case "twitter":
        return <RiTwitterXFill className="h-5 w-5" />;
      case "youtube":
        return <FaYoutube  className="h-5 w-5" />;
        
      // Add cases for other social media keys as needed
      default:
        return null; // Return null for unknown keys
    }
  };

  // Your social media data from the database
  const socialMediaData: SocialMediaData = data?.socialMedia || {};

  // Define social buttons based on your data
  const socialButtons = Object.entries(socialMediaData)
    .map(([key, value]) => {
      const defaultText = "Default Text"; // You can customize this default text
      const defaultLink = "#"; // You can customize this default link or handle null
      if (value == "" || key === "id") {
        return null;
      }
      return {
        key,
        icon: getSocialIcon(key), // Implement this function to get the corresponding icon
        text: key || defaultText,
        link: value || defaultLink,
        onClick:
          key === "whatsapp"
            ? sendMessageWa
            : key === "email"
            ? sendEmail
            : null, // You can set onClick handlers based on the key
      };
    })
    .filter((button) => button !== null);
    
    if (phone != ""){
      socialButtons.push({
        key: "whatsapp",
        icon: getSocialIcon("whatsapp"),
        text: "WhatsApp",
        link: "", 
        onClick: sendMessageWa,
      });
    }
    

    socialButtons.sort((a, b) => {
      const customOrder = ["whatsapp", "linkedIn", "instagram", "twitter", "facebook", "github", "youtube"];
      return customOrder.indexOf(a.key) - customOrder.indexOf(b.key);
    });
  const [showAllButtons, setShowAllButtons] = useState(false);

  const limitedButtons = socialButtons.slice(0, 4);

  const buttonsToShow = showAllButtons ? socialButtons : limitedButtons;

  return (
    <div className="flex p-2 justify-center items-center flex-wrap gap-4 mt-6 mb-5">
      {buttonsToShow.map(({ key, icon, text, link, onClick }) =>
        key === "whatsapp" ? (
          <a
            key={key}
            className="text-[16px] no-underline"
          >
            <Button
              onClick={onClick}
              className="animate-fade-right animate-delay-300 flex justify-between items-center gap-2 p-2 bg-white text-[#1d1d1d] border-2 border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]"
            >
              {icon}
              <span className="text-[16px]">{text}</span>
            </Button>
          </a>
        ) : (
          <a
            key={key}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[16px] no-underline"
          >
            <Button
              onClick={onClick}
              className="animate-fade-right animate-delay-300 flex justify-between items-center gap-2 p-2 bg-white text-[#1d1d1d] border-2 border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]"
            >
              {icon}
              <span className="text-[16px]">{text}</span>
            </Button>
          </a>
        )
      )}
      {!showAllButtons && socialButtons.length > 4 && (
        <Button
          onClick={() => setShowAllButtons(true)}
          className="rounded-full animate-fade-right animate-delay-300 flex justify-between items-center gap-2 p-2 bg-white text-[#1d1d1d] border-2 border-solid hover:bg-gray-200 border-[#ececec] "
        >
          <TfiMoreAlt />
        </Button>
      )}
    </div>
  );
};

export default SocialButtons;
