import React from "react";

type FooterProps = {
  children: React.ReactNode;
};

export default function Footer({ children }: FooterProps) {
  return <footer className="bg-cyan-500 text-gray-800 h-16 flex justify-center items-center">{children}</footer>;
}
