import { serviceExists } from "@/lib/fetchers/serviceExists";

export default async function Page({ params }: { params: { slug: string } }) {
  const service = await serviceExists(params.slug);
  console.log(service);
  if (!service.services.success) {
    return (
      <div className="relative">
        <div className="mx-auto flex flex-col items-center justify-center">
          <div className="w-32 h-32 bg-slate rounded-lg flex items-center justify-center">
            <div className="text-black text-4xl font-bold">404</div>
          </div>
          <div className="mt-4 text-gray-600">Service Not Found</div>
        </div>
      </div>
    );
  }
  return <p>Post: {params.slug}</p>;
}
