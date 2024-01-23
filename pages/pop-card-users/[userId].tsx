import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import vcf from "vcf";
import { RWebShare } from "react-web-share";
import { FaWhatsapp, FaGithub, FaFacebookF } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LuSendHorizonal } from "react-icons/lu";

import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";
import SocialButtons from "@/components/SocialButtons";
import { MdOutlineEventAvailable } from "react-icons/md";
import { BsQrCode } from "react-icons/bs";
import { RiExternalLinkLine } from "react-icons/ri";
const ProfilePage: React.FC = () => {
  const router = useRouter();
  const userId = router.query.userId?.toString() || "";
  const { data, isValidating, error, isLoading } = useSWR(
    `pop-card-users/${userId}`
  );
  const [expandedState, setExpandedState] = useState({});
  const [contactInfo, setContactInfo] = useState({
    fn: " ",
    photo: {
      uri: " ",
      mediatype: "image/gif",
    },
    tel: [
      {
        value: " ",
        type: ["work", "voice"],
        valueType: "uri",
      },
      {
        value: " ",
        type: ["home", "voice"],
        valueType: "uri",
      },
    ],
    email: " ",
  });

  useEffect(() => {
    setContactInfo({
      fn: `${data?.data?.firstName} ${data?.data?.lastName}` || " ",
      photo: {
        uri: data?.data?.image || " ",
        mediatype: "image/gif",
      },
      tel: [
        {
          value: `tel:${data?.data?.phone}` || " ",
          type: ["work", "voice"],
          valueType: "uri",
        },
        {
          value: `tel:${data?.data?.phone}` || " ",
          type: ["home", "voice"],
          valueType: "uri",
        },
      ],
      email: data?.data?.email || " ",
    });
  }, [data, isValidating]);

  const createVCard = (): string => {
    const vCard = new vcf();
    vCard.add("fn", contactInfo.fn);
    vCard.add("email", contactInfo.email);
    vCard.add("tel", contactInfo.tel[0].value);
    // Add other properties as needed

    return vCard.toString();
  };

  const downloadFile = (content: string, fileName: string) => {
    const blob = new Blob([content], { type: "text/vcard" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadVcf = () => {
    console.log(contactInfo);

    const vCardData = createVCard();

    // Download vCard file
    downloadFile(vCardData, `${contactInfo.fn}-contact.vcf`);
  };
  const shareLink = () => {
    const message = `Check out this link: https://lastartupstation.vercel.app/profile-v2/${data?.data?.firstName}-${data?.data?.lastName}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
  };

  const sendMessageWa = () => {
    const encodedMessage = encodeURIComponent("Hi 👋");
    const phoneNumber = data?.data?.phone;
    const phoneFormat = String(phoneNumber).slice(1);

    console.log("phoneFormat: ", phoneFormat);
    const whatsappLink = `https://wa.me/${phoneFormat}?text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
  };
  const callPhoneNumber = () => {
    const phoneNumber = data?.data?.phone;

    console.log("phoneFormat: ", phoneNumber);

    const telLink = `tel:${phoneNumber}`;

    window.open(telLink, "_blank");
  };

  const sendEmail = () => {
    const toEmail = `${data?.data?.email}`;
    const subject = "Getting to Know You 🤝🚀";
    const body =
      "Hello 👋, \n \n I hope this email finds you well.  I m reaching out to connect with you.\n Looking forward to hearing from you. \n \nBest regards";

    const mailtoLink = `mailto:${toEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  const dataFromDatabase = {
    socialMedia: data?.data?.socialLinks || {},
  };
  const webSite = () => {
    router.push(data?.data?.website);
  };

  function formatDateRange(
    startDateString: string,
    endDateString: string
  ): string {
    const formatDate = (dateString: string): string => {
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        year: "numeric",
      };
      return new Date(dateString).toLocaleDateString("fr-FR", options);
    };

    const formattedStartDate: string = formatDate(startDateString);
    const formattedEndDate: string = formatDate(endDateString);

    const startMonth = new Date(startDateString).getMonth();
    const endMonth = new Date(endDateString).getMonth();
    const monthDifference = endMonth - startMonth;

    return `${formattedStartDate} - ${formattedEndDate} · ${monthDifference} mois`;
  }

  function formatCityName(city: string): string {
    return city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  }

  const handleToggleExpansion = (paragraphId) => {
    setExpandedState((prev) => ({
      ...prev,
      [paragraphId]: !prev[paragraphId],
    }));
  };

  if (error) {
    if (error?.response?.status === 300) {
      return (
        <div className="flex w-full h-screen justify-center items-center">
          <div
            className="w-[70%] h-[10%] bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">
                  {error?.response?.data?.data?.message}
                </p>
                <p className="text-sm">{error?.message}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (error?.response?.status === 400) {
      return (
        <div className="flex w-full h-screen justify-center items-center">
          <div
            className="w-[70%] h-[10%] bg-red-100 border-t-4 border-red-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1">
                <svg
                  className="fill-current h-6 w-6 text-red-500 mr-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">User Not found </p>
                <p className="text-sm">
                  {error?.response?.data?.data?.message}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  if (isLoading) {
    return (
      <div className="bg-white flex space-x-12 p-12 justify-center items-center w-full h-screen">
        <div className="h-20 w-20 bg-gray-800 p-2 animate-spin rounded-md"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen  flex flex-col justify-start items-center bg-gray-200">
        <div className="w-[90%] flex justify-between items-center mt-5 pl-1 pr-1">
          <a href="https://www.lastartup.club/">
            <img
              className="h-[40px]"
              src="https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_300,w_300,f_auto,q_100/1949084/991517_558822.png"
              alt=""
            />
          </a>

          <Drawer>
            <DrawerTrigger>
              <BsQrCode className="w-8 h-8" />
            </DrawerTrigger>
            <DrawerContent className="h-[50%]">
              <DrawerHeader className="flex justify-center items-center flex-col">
                <DrawerTitle>Qr Code Generator</DrawerTitle>
                <DrawerDescription>
                  QR Code generation in progress. This is the QR Code for that
                  website.
                </DrawerDescription>
              </DrawerHeader>
              <QrCodeGenerator
                className="px-4"
                dataUser={[data?.data?.fullName, data?.data?._id]}
              />
            </DrawerContent>
          </Drawer>
        </div>
        <div className=" w-[90%] shadow mt-2 bg-whititeme  rounded-[15px] text-gray-900 animate-fade-right animate-delay-300 bg-white">
          <div className="rounded-t-[15px] h-32 overflow-hidden animate-fade-down animate-once animate-delay-300">
            <img
              className="object-cover object-top w-full"
              src="https://firebasestorage.googleapis.com/v0/b/ecommerce-arkx.appspot.com/o/bg.PNG?alt=media&token=7f137af0-c6aa-4fca-baf0-dba61c1352dc"
              alt="Mountain"
            />
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden animate-fade-right animate-delay-300">
            <img
              className="object-cover object-center h-32 w-full"
              src={data?.data?.profilePic}
              alt="Woman looking front"
            />
          </div>
          <div className="text-center flex flex-col justify-center items-center mt-2">
            <h3 className="font-sans leading-20 text-[#0d0d0d] text-[25px] font-semibold animate-fade-left animate-once animate-delay-300">
              {data?.data?.firstName} {data?.data?.lastName}
            </h3>
            <div className="font-sans text-[#595b5a] text-[17px] font-medium animate-fade-up animate-delay-300">
              {data?.data?.jobTitle} {data?.data?.jobTitle && " - "}{" "}
              <span className="text-[#0d0d0d]">LaStartupClub</span>
            </div>
            <div className="text-center font-sans text-[#595b5a] text-[17px] font-[400] w-[85%] mt-5 animate-fade-up animate-delay-300">
              {data?.data?.shortDescription.en ? (
                data?.data?.shortDescription.en
              ) : (
                <div>
                  I code dreams into reality with a touch of flair – MERN Stack
                  Enthusiast 💻✨ | JavaScript Maestro 🚀{" "}
                </div>
              )}
            </div>
          </div>
          <SocialButtons
            phone={data?.data?.phone}
            data={dataFromDatabase}
            sendMessageWa={sendMessageWa}
            sendEmail={sendEmail}
          />
        </div>
        <div className="w-[100%] mt-3 flex justify-center items-center flex-col bg-gray-200 ">
          <Tabs
            defaultValue="profile"
            className="w-[90%] flex justify-center items-center flex-col bg-gray-200 "
          >
            <TabsList className="w-[100%] mb-2 shadow flex justify-evenly items-center h-30 animate-fade-right animate-delay-300">
              <TabsTrigger
                value="profile"
                className="w-[20%] animate-fade-up animate-delay-300"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
                  />
                </svg>
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="w-[20%] animate-fade-up animate-delay-300"
              >
                <svg
                  className="w-5 h-5 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </TabsTrigger>
              <TabsTrigger
                value="event"
                className="w-[20%] animate-fade-up animate-delay-300"
              >
                <MdOutlineEventAvailable className="w-6 h-6" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile" className="w-[100%] mb-5">
              <div className="bg-white p-5 rounded-2xl animate-fade-right animate-delay-300">
                <div className="font-sans leading-20 text-[#0d0d0d] text-[18px] font-[600] mb-2">
                  Contact
                </div>
                <ul className="max-w-md divide-y divide-gray-200 ">
                  {data?.data?.phone ? (
                    <li className="pb-2 sm:pb-4 pt-2  animate-fade-up animate-delay-300 rounded-[10px] group active:bg-slate-100">
                      <div
                        className="flex items-center space-x-4 rtl:space-x-reverse "
                        onClick={callPhoneNumber}
                      >
                        <div className="flex-shrink-0 ">
                          <Button className="flex justify-between items-center gap-2 pl-2 pr-2 pt-5 pb-5  bg-white text-[#1d1d1d] border-2 border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                              />
                            </svg>
                          </Button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[16px] font-medium  text-gray-500 truncate dark:text-white">
                            Phone
                          </p>
                          <p className="flex text-[16px] text-gray-900 truncate dark:text-gray-400">
                            <div className="mr-2">{data?.data?.phone}</div>
                          </p>
                        </div>
                      </div>
                    </li>
                  ) : null}

                  {data?.data?.email ? (
                    <li className="pb-2 sm:pb-4 pt-2  animate-fade-up animate-delay-300 rounded-[10px] group active:bg-slate-100">
                      <div
                        className="flex items-center space-x-4 rtl:space-x-reverse"
                        onClick={sendEmail}
                      >
                        <div className="flex-shrink-0">
                          <Button className="flex justify-between items-center gap-2 pl-2 pr-2 pt-5 pb-5  bg-white text-[#1d1d1d] border-2 border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                              />
                            </svg>
                          </Button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[16px] font-medium  text-gray-500 truncate dark:text-white">
                            Email
                          </p>
                          <p className="text-[16px] text-gray-900 truncate dark:text-gray-400">
                            {data?.data?.email}
                          </p>
                        </div>
                      </div>
                    </li>
                  ) : null}

                  {data?.data?.website ? (
                    <li className="pb-2 sm:pb-4 pt-2  animate-fade-up animate-delay-300 rounded-[10px] group active:bg-slate-100">
                      <div
                        className="flex items-center space-x-4 rtl:space-x-reverse"
                        onClick={webSite}
                      >
                        <div className="flex-shrink-0">
                          <Button className="flex justify-between items-center gap-2 pl-2 pr-2 pt-5 pb-5  bg-white text-[#1d1d1d] border-2 border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25"
                              />
                            </svg>
                          </Button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[16px] font-medium  text-gray-500 truncate dark:text-white">
                            Web Site
                          </p>
                          <p className="text-[16px] text-gray-900 truncate dark:text-gray-400">
                            {data?.data?.website}
                          </p>
                        </div>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
              {data?.data?.experiences && (
                <div className="bg-white p-5 rounded-2xl mt-3 animate-fade-right animate-delay-300">
                  <div className="font-sans leading-20 text-[#0d0d0d] text-[18px] font-[600] mb-2">
                    Work
                  </div>
                  <ul className="max-w-md divide-y divide-gray-200">
                    {data?.data?.experiences.map((experience) => (
                      <li
                        key={experience.id}
                        className="pb-2 sm:pb-4 pt-2 animate-fade-up animate-delay-300 rounded-[10px] group active:bg-slate-100"
                        onClick={() => handleToggleExpansion(experience.id)}
                      >
                        <div className="flex items-start space-x-4 rtl:space-x-reverse ">
                          <div className="flex-shrink-0">
                            <Button className="mt-2 flex justify-between items-center gap-2 pl-2 pr-2 pt-5 pb-5  bg-white text-[#1d1d1d] border-2 border-solid hover:bg-gray-200 border-[#ececec] rounded-[10px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z"
                                />
                              </svg>
                            </Button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[16px] font-medium text-gray-500 truncate dark:text-white">
                              {experience.title}
                            </p>
                            <p className="text-[14px]  text-gray-500   dark:text-white">
                              {formatDateRange(
                                experience?.dateInfos?.start,
                                experience?.dateInfos?.end
                              )}
                            </p>
                            <p className="text-[14px]  text-gray-500 truncate dark:text-white">
                              {formatCityName(experience?.city)} -{" "}
                              {experience?.country}
                            </p>
                            <p
                              key={experience.id}
                              className={`text-[16px] text-gray-900 dark:text-gray-400 mt-2 cursor-pointer ${
                                expandedState[experience.id]
                                  ? "block"
                                  : "truncate"
                              }`}
                            >
                              {experience.description?.en}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            <TabsContent value="about" className="w-[100%] shadow mb-10">
              <div className="bg-white p-5 rounded-2xl animate-fade-right animate-delay-300">
                <div className="font-sans leading-20 text-[#0d0d0d] text-[18px] font-[600] mb-2">
                  About me
                </div>
                <div className="font-sans text-[#0d0d0d] text-[17px] font-[400] w-[90%] mt-5">
                  {data?.data?.fullPresentation?.en}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="event" className="w-[100%] shadow mb-10">
              <div className="bg-white p-5 rounded-2xl animate-fade-right animate-delay-300">
                <div className="w-full m-auto py-16 min-h-screen flex items-center justify-center">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-8">
                    <div className="border-t border-gray-200 text-center pt-8">
                      <h1 className="text-9xl font-bold text-purple-400">
                        404
                      </h1>
                      <h1 className="text-6xl font-medium py-8">
                        oops! Page not found
                      </h1>
                      <p className="text-2xl pb-8 px-12 font-medium">
                        Oops! The page you are looking for does not exist. It
                        might have been moved or deleted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="custom-shadow-gray  w-[100%] pt-3 pb-3 sticky bottom-0 right-0 opacity-1 flex bg-white justify-center items-center border-2 border-solid border-[#eeebee]">
          <div className=" animate-fade-up animate-once animate-delay-300 w-[100%] bg-white flex justify-between items-center pt-1 pb-1 pl-5 pr-5 ">
            <Button
              onClick={downloadVcf}
              className="animate-fade-right animate-once animate-delay-300 active:bg-gray-500 w-[75%] h-[50px]  bg-[#111013] text-[15px]"
            >
              Add To Contacts
            </Button>
            <RWebShare
              data={{
                text: "Check out this link 🚀: \n",
                url: `https://lastartup-club-popcard.vercel.app/pop-card-users/${data?.data?._id}`,
                title: "Website link ",
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <Button className="animate-fade-right animate-once animate-delay-300 hover:bg-gray-300  active:bg-gray-500 w-[20%] h-[50px] bg-white border-2 border-solid border-[#ececec] text-[#111013]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                  />
                </svg>
              </Button>
            </RWebShare>
          </div>
        </div>
      </div>
    </>
  );
};

function QrCodeGenerator({ className, dataUser }: any) {
  const [disabled, setDisabled] = useState(false);
  const UrlWebSiteForUser = `https://lastartup-club-popcard.vercel.app/pop-card-users/${dataUser[1]}`;
  const QrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${UrlWebSiteForUser}`;
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsHidden(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []); // Run the effect only once when the component mounts

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = QrCodeUrl;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex justify-center items-center">
        {!isHidden && (
          <div>
            <img
              src={QrCodeUrl}
              className={`h-[200px] max-w-sm rounded-lg shadow-none hover:shadow-lg hover:shadow-black/30`}
              alt=""
            />
            <Button
              onClick={handleDownload}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Download QR Code
            </Button>
          </div>
        )}
        {isHidden && (
          <div className="bg-white flex space-x-12 p-12 justify-center items-center w-full ">
            <div className="h-20 w-20 bg-[#ffd5a1] p-2 animate-spin rounded-md"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
