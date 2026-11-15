import Image from "next/image";
export function Footer() {
    return <footer>
        <Image className="brand-logo" src="/zincwise-logo.jpg" alt="" width={55} height={55} priority /><p>Based on the supplied Punjab climate and crop-rotation datasets.</p><em>Healthier soil. More nutritious wheat. A more resilient Punjab.</em></footer>;
}
