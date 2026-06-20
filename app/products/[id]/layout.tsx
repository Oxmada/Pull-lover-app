import { ReactNode } from "react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products/${id}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    const product = data?.product;
    if (!product) return {};
    return {
      title: product.name,
      description: product.description?.slice(0, 155) || "",
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 155) || "",
        images: product.image ? [{ url: product.image, width: 800, height: 800, alt: product.name }] : [],
        type: "website",
      },
    };
  } catch {
    return {};
  }
}

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
