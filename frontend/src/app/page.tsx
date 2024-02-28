import dynamic from "next/dynamic";

const MultimediaProcessor = dynamic(
  () => import("@/components/MultimediaProcessor"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <>
      <div className="xl:m-10 lg:m-8 md:m-4 flex flex-col box-border bg-white flex-grow text-gray-700">
        <h1 className="font-bold text-center p-4 text-4xl">
          Multimedia Forensics Toolkit
        </h1>
        <p className="font-semibold p-2 max-w-none pb-4">
          Some description (Optional)
        </p>
        <MultimediaProcessor />
      </div>
      <p className="font-semibold p-8 w-full bg-gray-300">
        Website is currently under development.
      </p>
    </>
  );
}
