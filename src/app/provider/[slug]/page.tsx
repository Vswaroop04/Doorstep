import { ProviderDash } from "@/components/Provider/ProviderDash";

const page = ({ params }: { params: { slug: string } }) => {
  const providerId = params.slug;
  return (
    <div>
      <ProviderDash providerId={providerId} />
    </div>
  );
};

export default page;
