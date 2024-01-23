import { FaWhatsapp, FaGithub, FaFacebookF , FaYoutube , FaLinkedin } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";

import { FaInstagram, FaEnvelope , FaFacebookSquare } from "react-icons/fa";
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
        return <FaWhatsapp className="h-4 w-4" />;
      case "linkedIn":
        return (
          <FaLinkedin className="h-4 w-4"/>
        );
      case "instagram":
        return <FaInstagram className="h-4 w-4" />;
      case "email":
        return <FaEnvelope className="h-4 w-4" />;
      case "github":
        return <FaGithub className="h-4 w-4" />;
      case "facebook":
        return <FaFacebookSquare  className="h-4 w-4" />;
      case "twitter":
        return <RiTwitterXFill className="h-4 w-4" />;
      case "youtube":
        return <FaYoutube  className="h-4 w-4" />;
        
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
      const customOrder = ["whatsapp", "linkedIn","github", "instagram", "twitter", "facebook", "youtube"];
      return customOrder.indexOf(a.key) - customOrder.indexOf(b.key);
    });
  const [showAllButtons, setShowAllButtons] = useState(false);

  const limitedButtons = socialButtons.slice(0, 4);

  const buttonsToShow = showAllButtons ? socialButtons : limitedButtons;

  return (
    <div className="flex p-2 justify-center items-center flex-wrap gap-2 mt-2 mb-5">
      {buttonsToShow.map(({ key, icon, text, link, onClick }) =>
        key === "whatsapp" ? (
          <a
            key={key}
            className="text-[16px] no-underline"
          >
            <Button
              onClick={onClick}
              className="animate-fade-right animate-delay-300 flex justify-between items-center gap-2 p-2 bg-white text-[#1d1d1d] border-[1px] border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]"
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
              className="animate-fade-right animate-delay-300 flex justify-between items-center gap-2 p-2 bg-white text-[#1d1d1d] border-[1px] border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]"
            >
              {icon}
              <span className="text-[17px]">{text}</span>
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
