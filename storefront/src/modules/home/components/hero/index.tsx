import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            The destination for the best in beauty! 
            products including makeup, cosmetics, skincare, haircare, nails, fragrance and more,

          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Explore our line up of trending brands today. At the lowest prices. 
          </Heading>
        </span>
        <a
          href="/store/"
          target="_blank"
        >
          <button className="w-full mt-6">Shop now</button>
          <h1 style={{ textDecoration: "none" }}>
            Shop now
          </h1>
        </a>
      </div>
    </div>
  )
}

export default Hero
