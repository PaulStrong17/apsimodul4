import Image from "next/image";

const galleryItems = [
  {
    name: "Keripik Original",
    image: "keripik-original.png",
    color: "bg-[#ffe0d1]",
    imageSize: "h-[215px] w-[167px]",
    imagePosition: "left-[-14px] top-[-52px]",
    labelPosition: "left-[10px]",
  },
  {
    name: "Kue Bawang Pedas",
    image: "kue-bawang-pedas.png",
    color: "bg-[#deedd4]",
    imageSize: "size-[182px]",
    imagePosition: "left-[-23px] top-[-19px]",
    labelPosition: "left-[10px]",
  },
  {
    name: "Kerupuk Bawang",
    image: "kerupuk-bawang.png",
    color: "bg-[#fff0c9]",
    imageSize: "size-[181px]",
    imagePosition: "left-[-23px] top-[-21px]",
    labelPosition: "left-[16px]",
  },
  {
    name: "Keripik Balado",
    image: "keripik-balado.png",
    color: "bg-[#deedd4]",
    imageSize: "size-[189px]",
    imagePosition: "left-[-30px] top-[-24px]",
    labelPosition: "left-[24px]",
  },
  {
    name: "Stik Ubi Ungu",
    image: "stik-ubi-ungu.png",
    color: "bg-[#ffe0d1]",
    imageSize: "size-[198px]",
    imagePosition: "left-[-31px] top-[-37px]",
    labelPosition: "left-[24px]",
  },
  {
    name: "Stik Ubi",
    image: "stik-ubi.png",
    color: "bg-[#ffe0d1]",
    imageSize: "h-[255px] w-[183px]",
    imagePosition: "left-[-22px] top-[-91px]",
    labelPosition: "left-[46px]",
  },
];

export function ProductGallery() {
  return (
    <section className="relative z-10 mt-6 w-full max-w-[896px] overflow-x-auto">
      <div className="flex w-[896px] gap-4 overflow-hidden pb-2">
        {galleryItems.map((item) => (
          <div
            key={item.image}
            className={`relative h-[229px] w-[136px] shrink-0 overflow-hidden rounded-[16px] ${item.color}`}
          >
            <Image
              src={`/images/data-produk/${item.image}`}
              alt={item.name}
              width={200}
              height={260}
              className={`absolute rounded-[74px] object-cover ${item.imageSize} ${item.imagePosition}`}
            />
            <p
              className={`absolute top-[186px] z-10 w-[120px] whitespace-nowrap text-[13px] font-bold leading-[normal] text-[#1f2e29] ${item.labelPosition}`}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
