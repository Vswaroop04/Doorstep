import Image from "next/image";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent z-50">
      <div className="animate-bounce">
        <Image src="/Doorstep.png" alt="logo" width="64" height="64" />
      </div>
    </div>
  );
};

export default Loading;
