import axios from "axios";
import React from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DrawerDialog } from "./DrawerDialog";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSWR, { mutate } from "swr";
import { useToast } from "@/components/ui/use-toast";
import { FaUserCircle } from "react-icons/fa";
import { LuUserCircle2 } from "react-icons/lu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 10; // Set your desired page size

export function Home({ usersFromServer }: any) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const { data, isLoading, error } = useSWR(
    `/pop-card-users?page=${currentPage}&limit=${pageSize}&searchTerm=${searchTerm}`
  );
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset current page when search term changes
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset current page when page size changes
  };

  console.log("data :", data, error);
  return (
    <>
      <div className="w-full h-screen flex  items-center flex-col">
        <Navbar />
        {/* Pagination */}

        <div className="w-[90%] bg-white border-[10px] p-10 rounded-[20px] flex flex-col justify-center items-center">
          <div className="flex w-[100%] mb-5 justify-between flex-wrap">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              id="hs-select-label"
              className="pl-2 pr-2 block w-[10%] border border-gray-200 rounded-lg"
            >
              <option selected value="10">10 users</option>
              <option value="25">25 users</option>
              <option value="50">50 users</option>
              <option value="100">100 users</option>
            </select>

            <div className="flex w-[50%] h-[100%] ">
              <span className="w-10 h-10 inline-flex items-center px-3 text-sm text-gray-900 bg-white border border-e-0 border-gray-300 rounded-s-md">
                <svg
                  className="w-4 h-4 text-black dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
              </span>
              <input
                type="text"
                id="website-admin"
                className="mr-10 h-10 rounded-none rounded-e-lg bg-gray-50 focus:border-[#f29c33] border border-gray-300 text-gray-900  flex-1 min-w-0 w-full  p-2.5  "
                placeholder="search ..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={data?.data?.totalPages || 0}
              onPageChange={handlePageChange}
            />
          </div>
          {isLoading ? <div className="bg-white flex space-x-12 p-12 justify-center items-center w-full ">
                <div className="h-20 w-20 bg-[#ffd5a1] p-2 animate-spin rounded-md"></div>
              </div>:<Table className="w-[100%] m-auto shadow-2xl text-[15px] border border-solid border-gray-200  p-10 ">
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-[100px] text-gray-700">Img </TableHead>
                <TableHead className=" text-gray-700">Email</TableHead>
                <TableHead className=" text-gray-700">Full Name</TableHead>
                <TableHead className="text-center  text-gray-700">
                  Qr Code Generator
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.docs?.map((invoice) => (
                <TableRow
                  key={invoice._id}
                  className="shadow-md text-[16px] bg-white"
                >
                  <TableCell>
                    <div className="relative">
                      {invoice?.profilePic ? (
                        <img
                          className="w-10 h-10 rounded-full bg-[#fff3e5] shadow-2xl"
                          src={invoice.profilePic}
                          alt=""
                        />
                      ) : (
                        <LuUserCircle2 className="w-10 h-10 text-gray-700 shadow-2xl" />
                      )}
                      <span className="top-0 left-7 absolute w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice?.email}
                  </TableCell>
                  <TableCell>{invoice?.fullName}</TableCell>
                  <TableCell className="flex justify-center">
                    <Drawer>
                      <DrawerTrigger>
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8 bg-gray-50 text-[#ff9716] cursor-pointer hover:text-gray-800 transition  border-gray-150 shadow-lg shadow-[#f4d6af] "
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </DrawerTrigger>
                      <DrawerContent className="h-[70%]">
                        <DrawerHeader className="flex justify-center items-center flex-col">
                          <DrawerTitle>Qr Code Generator</DrawerTitle>
                          <DrawerDescription>
                            QR Code generating in progress. Click save to
                            immortalize it in the database.
                          </DrawerDescription>
                        </DrawerHeader>
                        <QrCodeGenerator
                          className="px-4"
                          dataUser={[invoice.fullName, invoice._id]}
                        />
                      </DrawerContent>
                    </Drawer>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              }
          
        </div>
      </div>
    </>
  );
}

Home.getInitialProps = async (ctx) => {
  const res = await axios("/pop-card-users");
  const json = res.data;
  return { usersFromServer: json };
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex space-x-2">
      <Button
        className={`px-4 py-2 border border-gray-300 `}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <Button
        className={`px-4 py-2 border border-gray-300 bg-white text-black `}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {currentPage}
      </Button>

      <Button
        className={`px-4 py-2 border border-gray-300 hover:bg-[#f29c33] text-black bg-[#f88f10]`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div>
  );
};

function QrCodeGenerator({ className, dataUser }: any) {
  const [disabled, setDisabled] = useState(false);
  const UrlWebSiteForUser = `https://lastartup-club-popcard.vercel.app/pop-card-users/${dataUser[1]}`;
  const QrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${UrlWebSiteForUser}`;
  const [isHidden, setIsHidden] = useState(true);
  const { toast } = useToast();

  const SaveData = async (e) => {
    e.preventDefault();

    try {
      setDisabled(true);
      await axios.put("/users", {
        idUser: dataUser[2],
        UrlWebSiteForUser: UrlWebSiteForUser,
      });
      mutate("/users");
      setDisabled(false);
      toast({
        description: "User updated successfully!",
        style: {
          backgroundColor: "green", // Set the background color to green
          color: "white", // Set the text color to white or any other contrasting color
        },
      });
      console.log("User updated successfully!");
    } catch (error) {
      setDisabled(false);

      if (error.response && error.response.status === 404) {
        toast({
          description: "User not found. Please check the user ID.",
          style: {
            backgroundColor: "red", // Set the background color to green
            color: "white", // Set the text color to white or any other contrasting color
          },
        });
        console.error("User not found. Please check the user ID.");
      } else {
        toast({
          description: `Error updating user: ${error.message}`,
          style: {
            backgroundColor: "red", // Set the background color to green
            color: "white", // Set the text color to white or any other contrasting color
          },
        });
        console.error("Error updating user:", error.message);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsHidden(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []); // Run the effect only once when the component mounts

  return (
    <div className="flex justify-center items-center">
      <form
        className={cn("grid items-start gap-4 w-[50%]", className)}
        onSubmit={SaveData}
      >
        <a
          href={UrlWebSiteForUser}
          className="inline-flex items-center justify-center p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-10 h-10 text-[#ff9716] mr-5"
          >
            <path
              fillRule="evenodd"
              d="M3 4.875C3 3.839 3.84 3 4.875 3h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 9.375v-4.5ZM4.875 4.5a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875.375c0-1.036.84-1.875 1.875-1.875h4.5C20.16 3 21 3.84 21 4.875v4.5c0 1.036-.84 1.875-1.875 1.875h-4.5a1.875 1.875 0 0 1-1.875-1.875v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5ZM6 6.75A.75.75 0 0 1 6.75 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75A.75.75 0 0 1 6 7.5v-.75Zm9.75 0A.75.75 0 0 1 16.5 6h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM3 14.625c0-1.036.84-1.875 1.875-1.875h4.5c1.036 0 1.875.84 1.875 1.875v4.5c0 1.035-.84 1.875-1.875 1.875h-4.5A1.875 1.875 0 0 1 3 19.125v-4.5Zm1.875-.375a.375.375 0 0 0-.375.375v4.5c0 .207.168.375.375.375h4.5a.375.375 0 0 0 .375-.375v-4.5a.375.375 0 0 0-.375-.375h-4.5Zm7.875-.75a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75ZM6 16.5a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm9.75 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm-3 3a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Zm6 0a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75Z"
              clipRule="evenodd"
            />
          </svg>

          <span className="w-full">
            <span className="text-[17px] font-bold ">Link :</span>{" "}
            {UrlWebSiteForUser}
          </span>
          <svg
            className="w-4 h-4 ms-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
              className="w-10 h-10 text-[#ff9716]"
            />
          </svg>
        </a>

        <div className="flex justify-center items-center">
          {!isHidden && (
            <img
              src={QrCodeUrl}
              className={`h-[200px] max-w-sm rounded-lg shadow-none hover:shadow-lg hover:shadow-black/30`}
              alt=""
            />
          )}
          {isHidden && (
            <div className="bg-white flex space-x-12 p-12 justify-center items-center w-full ">
              <div className="h-20 w-20 bg-[#ffd5a1] p-2 animate-spin rounded-md"></div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="bg-[#f1a447] text-[#0f172a] text-[15px] hover:bg-[#e4c197]"
          disabled={disabled}
        >
          Save Qr Code
        </Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </form>
    </div>
  );
}
