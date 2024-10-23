import { PopupButton } from "react-calendly";

import dynamic from "next/dynamic";

const CalendlyPopupComponent: React.FC<{
  url: string;
  text: string;
}> = ({ url, text }) => {
  const rootElement = document ? document.getElementById("root") : null;

  if (!rootElement) {
    throw new Error("Root element not found");
  }
  return <PopupButton url={url} text={text} rootElement={rootElement} />;
};

export const CalendlyPopup = dynamic(
  () => Promise.resolve(CalendlyPopupComponent),
  { ssr: false }
);
