interface PolaroidProps {
  imgSrc: string
  title: string
}

export function Polaroid({ imgSrc, title }: PolaroidProps) {
  return (
    <figure className="bg-white p-2 w-40 h-48">
      <img className="bg-black w-36 h-36" src={imgSrc} />
      <figcaption className="font-semibold text-center w-full mt-1">
        {title}
      </figcaption>
    </figure>
  )
}
